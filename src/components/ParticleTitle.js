"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ParticleTitle = ({ 
  text, 
  subtitle, 
  className = '',
  particleSize = 6.0,
  scale = 1.0
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    
    // We want a very tight camera that focuses just on the text area
    // Using orthographic or a narrow perspective.
    const aspect = mount.clientWidth / mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 1, 100);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // --- Generate Particles from Text ---
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Canvas dimensions - high resolution for crisp sampling
    canvas.width = 1200;
    canvas.height = 300;
    
    // Draw Text
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Χρησιμοποιούμε Courier New για να ταιριάζει με το terminal θέμα
    ctx.font = 'bold 140px "Courier New", Courier, monospace';
    
    // Συνδυάζουμε ένα απαλό γέμισμα με ένα περίγραμμα για "αστερικό" (constellation) look
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Remove accents before converting to uppercase to ensure font compatibility for Greek
    const safeText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    
    ctx.fillText(safeText, canvas.width / 2, canvas.height / 2);
    
    // Προσθέτουμε και ένα ελαφρύ stroke για να τονίσουμε τις άκρες
    ctx.lineWidth = 3.0; // Thicker stroke for Courier New
    ctx.strokeStyle = '#ffffff';
    ctx.strokeText(safeText, canvas.width / 2, canvas.height / 2);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    const positions = [];
    const colors = [];
    const randomness = [];
    
    // Sample every N pixels (αυξάνουμε το step για λιγότερα, πιο ξεχωριστά σωματίδια)
    const step = 3; 
    
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const index = (y * canvas.width + x) * 4;
        const r = imgData[index]; // read red channel (since text is white)
        
        if (r > 64) { // Lower threshold to capture thinner fonts
          // Center the coordinates and scale them to Three.js units
          const pX = (x - canvas.width / 2) * 0.035;
          const pY = -(y - canvas.height / 2) * 0.035;
          const pZ = (Math.random() - 0.5) * 2.0; // Initial random depth
          
          positions.push(pX, pY, pZ);
          
          // Color Gradient: Cyan (#22d3ee) to Purple/Pink (#c084fc)
          const t = x / canvas.width;
          const cR = 0.13 + t * 0.62; // 0.13 -> 0.75
          const cG = 0.82 - t * 0.3;  // 0.82 -> 0.52
          const cB = 0.93 + t * 0.05; // 0.93 -> 0.98
          
          colors.push(cR, cG, cB);
          
          // Add random value for animation variance
          randomness.push(Math.random());
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('aRandom', new THREE.Float32BufferAttribute(randomness, 1));

    // --- Shader Material ---
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(-999, -999) },
        uSize: { value: particleSize * renderer.getPixelRatio() }
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uSize;
        
        attribute vec3 color;
        attribute float aRandom;
        
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec3 pos = position;
          
          // Continuous wave motion based on position and random offset
          pos.z += sin(pos.x * 1.5 + uTime * 2.0 + aRandom * 3.14) * 0.5;
          
          // Mouse interaction (repel effect)
          // Convert mouse (-1 to 1) to world coordinates approximately
          vec2 mouseWorld = uMouse * vec2(15.0, 5.0); 
          float dist = distance(pos.xy, mouseWorld);
          
          if (dist < 3.0) {
            float force = (3.0 - dist) / 3.0; // 0 to 1
            pos.z += force * 3.0; // push forward
            pos.x += (pos.x - mouseWorld.x) * force * 0.5; // push outward
            pos.y += (pos.y - mouseWorld.y) * force * 0.5;
          }
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          // Size attenuation based on depth
          gl_PointSize = uSize * (25.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          // Circular particle with soft edges
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          // Soft glow edge
          float alpha = smoothstep(0.5, 0.2, dist);
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    points.scale.set(scale, scale, scale);
    scene.add(points);

    // --- Interaction & Animation ---
    let mouse = new THREE.Vector2(-999, -999);
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e) => {
      // Normalize to -1 to +1
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Calculate target rotation based on mouse on the whole window
      const winX = (e.clientX / window.innerWidth) * 2 - 1;
      const winY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = winX * 0.15;
      targetRotationX = winY * -0.15;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const timer = new THREE.Timer();
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      timer.update();
      const elapsedTime = timer.getElapsed();
      material.uniforms.uTime.value = elapsedTime;
      
      // Lerp mouse uniform for smooth repel effect
      material.uniforms.uMouse.value.lerp(mouse, 0.1);
      
      // Lerp global rotation for smooth parallax
      points.rotation.y += (targetRotationY - points.rotation.y) * 0.05;
      points.rotation.x += (targetRotationX - points.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [text, particleSize, scale]);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Container for the 3D Canvas */}
      <div 
        ref={mountRef} 
        className="w-full h-[180px] md:h-[250px] relative z-10"
        style={{ pointerEvents: 'none' }} // Let mouse events pass through if needed
      />
      
      {/* Subtitle remains normal HTML for crisp readability */}
      {subtitle && (
        <div className="mt-[-20px] md:mt-[-40px] relative z-20">
          <p className="text-[10px] md:text-xs text-cyan-400 font-mono tracking-widest uppercase opacity-80">
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
};

export default ParticleTitle;
