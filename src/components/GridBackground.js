'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GridBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ============================================================
    // 1. Ρύθμιση Σκηνής (Three.js Setup)
    // ============================================================
    const scene = new THREE.Scene();

    // Κάμερα με Perspective Projection
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;
    camera.position.y = 8;
    camera.lookAt(0, 0, 0);

    // WebGL Renderer με άλφα κανάλι για διαφανές background
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // ============================================================
    // 2. Δημιουργία Πλέγματος Σωματιδίων (Particles Grid)
    // ============================================================
    const widthCount = 55; // Αριθμός στηλών
    const depthCount = 55; // Αριθμός γραμμών
    const numParticles = widthCount * depthCount;

    const positions = new Float32Array(numParticles * 3);
    const initialPositions = new Float32Array(numParticles * 3);

    const spacing = 0.6; // Απόσταση μεταξύ των σωματιδίων
    const startX = -((widthCount - 1) * spacing) / 2;
    const startZ = -((depthCount - 1) * spacing) / 2;

    let index = 0;
    for (let x = 0; x < widthCount; x++) {
      for (let z = 0; z < depthCount; z++) {
        const px = startX + x * spacing;
        const py = 0; // Αρχικό ύψος (επίπεδο)
        const pz = startZ + z * spacing;

        positions[index * 3] = px;
        positions[index * 3 + 1] = py;
        positions[index * 3 + 2] = pz;

        initialPositions[index * 3] = px;
        initialPositions[index * 3 + 1] = py;
        initialPositions[index * 3 + 2] = pz;

        index++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Προγραμματική δημιουργία υφής αστεριού με λάμψη (star flare)
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      
      ctx.clearRect(0, 0, 32, 32);
      
      // Κεντρικός λαμπερός πυρήνας
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 8);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
      
      // Οριζόντια sci-fi γραμμή λάμψης
      const gradH = ctx.createLinearGradient(0, 16, 32, 16);
      gradH.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradH.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
      gradH.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradH;
      ctx.fillRect(0, 15, 32, 2);
      
      // Κάθετη sci-fi γραμμή λάμψης
      const gradV = ctx.createLinearGradient(16, 0, 16, 32);
      gradV.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradV.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
      gradV.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradV;
      ctx.fillRect(15, 0, 2, 32);
      
      return new THREE.CanvasTexture(canvas);
    };

    // Υλικό σωματιδίων (αστρική σκόνη) με Additive Blending
    const material = new THREE.PointsMaterial({
      color: 0x7f5af0, // Μοβ accent χρώμα
      size: 0.22,
      map: createStarTexture(),
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ============================================================
    // 3. Παρακολούθηση Κίνησης Ποντικιού (Mouse Interaction)
    // ============================================================
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (event) => {
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // ============================================================
    // 4. Animation Loop (RequestAnimationFrame)
    // ============================================================
    // Χρήση THREE.Timer αντί του Clock (deprecated) για ομαλή διαχείριση χρόνου
    const timer = new THREE.Timer();
    let animationFrameId;

    const animate = (timestamp) => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update(timestamp);

      const elapsed = timer.getElapsed();

      // Lerp για ομαλή κίνηση του ποντικιού
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const posAttribute = geometry.attributes.position;
      const posArray = posAttribute.array;

      const mouseWorldX = mouse.x * 12;
      const mouseWorldZ = -mouse.y * 8;

      // Ενημέρωση Y κάθε σωματιδίου (κύματα + αλληλεπίδραση ποντικιού)
      for (let i = 0; i < numParticles; i++) {
        const i3 = i * 3;
        const px = initialPositions[i3];
        const pz = initialPositions[i3 + 2];

        let py = Math.sin(px * 0.5 + elapsed) * Math.cos(pz * 0.5 + elapsed) * 0.3;

        const dx = px - mouseWorldX;
        const dz = pz - mouseWorldZ;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < 4) {
          const force = (4 - dist) / 4;
          py += Math.sin(dist * 2.0 - elapsed * 4) * force * 0.6;
        }

        posArray[i3 + 1] = py;
      }

      posAttribute.needsUpdate = true;
      particles.rotation.y = elapsed * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // ============================================================
    // 5. Καθαρισμός Μνήμης (Memory Cleanup)
    // ============================================================
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (containerRef.current && renderer.domElement) {
        if (containerRef.current.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    />
  );
}
