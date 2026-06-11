'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export default function SpotlightCard({ children, href, className = "", iconType = 'user' }) {
  const cardRef = useRef(null);
  const spotlightRef = useRef(null);
  const canvasRef = useRef(null);
  
  // State για το 3D CSS tilt effect
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. Αρχικοποίηση Σκηνής
    const scene = new THREE.Scene();
    
    // 2. Κάμερα
    const camera = new THREE.PerspectiveCamera(50, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 100);
    camera.position.z = 6; 

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasRef.current.appendChild(renderer.domElement);

    // 4. Υλικό Point Cloud (Hologram / Particle style)
    const material = new THREE.PointsMaterial({
      color: 0x7e22ce, // Βαθύ μωβ (purple-700)
      size: 0.025, // Πιο λεπτά και κομψά σημεία
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending // Δημιουργεί ένα ωραίο glow όταν ενώνονται τα σημεία
    });

    const iconGroup = new THREE.Group();

    // Βοηθητική συνάρτηση για τη δημιουργία γεωμετριών από particles
    const addPoints = (geometry, posX = 0, posY = 0, posZ = 0, rotX = 0, rotY = 0, rotZ = 0) => {
      const points = new THREE.Points(geometry, material);
      points.position.set(posX, posY, posZ);
      points.rotation.set(rotX, rotY, rotZ);
      iconGroup.add(points);
    };

    // Κατασκευή των Holographic 3D Μοντέλων
    if (iconType === 'user') {
      // Κεφάλι (Όρθιο)
      addPoints(new THREE.SphereGeometry(0.4, 32, 32), 0, 0.6, 0);
      // Σώμα (Κύλινδρος που ανοίγει προς τα κάτω - Ώμοι)
      addPoints(new THREE.CylinderGeometry(0.3, 0.8, 1.0, 32, 16), 0, -0.3, 0);

    } else if (iconType === 'terminal') {
      // Σύμβολο ">" με λεπτές γραμμές και σωστό spacing
      addPoints(new THREE.BoxGeometry(0.8, 0.06, 0.06, 20, 2, 2), -0.4, 0.35, 0, 0, 0, Math.PI / 4);
      addPoints(new THREE.BoxGeometry(0.8, 0.06, 0.06, 20, 2, 2), -0.4, -0.35, 0, 0, 0, -Math.PI / 4);
      // Σύμβολο "_" (με κενό από το ">")
      addPoints(new THREE.BoxGeometry(0.6, 0.06, 0.06, 16, 2, 2), 0.6, -0.6, 0);

    } else if (iconType === 'camera') {
      // Σώμα κάμερας 
      addPoints(new THREE.BoxGeometry(1.6, 1.0, 0.4, 24, 16, 6), 0, 0, 0);
      // Φακός
      addPoints(new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32, 6), 0, 0, 0.3, Math.PI / 2, 0, 0);
      // Κουμπί
      addPoints(new THREE.BoxGeometry(0.2, 0.1, 0.2, 4, 2, 4), 0.5, 0.55, 0);
      // Φλας
      addPoints(new THREE.BoxGeometry(0.5, 0.2, 0.3, 8, 4, 4), 0, 0.6, 0);
    }

    iconGroup.position.y = 0.2;
    scene.add(iconGroup);

    // 5. Animation Loop
    let animationId;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let time = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.01;

      // Πολύ απαλή περιστροφή στο Hover
      iconGroup.rotation.x += (targetRotationX - iconGroup.rotation.x) * 0.05;
      iconGroup.rotation.y += (targetRotationY - iconGroup.rotation.y) * 0.05;
      
      // Αέρινη αιώρηση
      iconGroup.position.y = 0.2 + Math.sin(time) * 0.1;
      
      // Αν δεν κάνουμε hover, ας περιστρέφεται αργά και ομαλά
      if (targetRotationX === 0 && targetRotationY === 0) {
         iconGroup.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Ενημέρωση περιστροφής από το onMouseMove
    canvasRef.current.updateRotation = (nx, ny) => {
      // Πολύ μικρές γωνίες (0.3 radians) για να φαίνεται κομψό και όχι παραμορφωμένο
      targetRotationX = ny * 0.3;
      targetRotationY = nx * 0.3;
    };
    
    // Αλλαγή opacity και metalness όταν γίνεται hover
    canvasRef.current.setHoverState = (hovering) => {
      material.opacity = hovering ? 0.9 : 0.6;
      material.color.setHex(hovering ? 0xa855f7 : 0x7e22ce); // Πιο ανοιχτό μωβ στο hover
    };

    // Καθαρισμός μνήμης
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (canvasRef.current && renderer.domElement && canvasRef.current.contains(renderer.domElement)) {
        canvasRef.current.removeChild(renderer.domElement);
      }
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
      });
      material.dispose();
      renderer.dispose();
    };
  }, [iconType]);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !spotlightRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // CSS Spotlight
    spotlightRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(168, 85, 247, 0.15), transparent 40%)`;

    // Υπολογισμός CSS 3D Tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const normalizedX = (x - centerX) / centerX; // -1 to 1
    const normalizedY = (y - centerY) / centerY; // -1 to 1

    setTilt({
      x: -normalizedY * 8, // Max 8 degrees tilt on X
      y: normalizedX * 8   // Max 8 degrees tilt on Y
    });

    // Ενημέρωση Three.js rotation target
    if (canvasRef.current && canvasRef.current.updateRotation) {
      canvasRef.current.updateRotation(normalizedX, normalizedY);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (spotlightRef.current) spotlightRef.current.style.opacity = '1';
    if (canvasRef.current && canvasRef.current.setHoverState) {
      canvasRef.current.setHoverState(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
    setTilt({ x: 0, y: 0 }); // Επαναφορά tilt
    if (canvasRef.current && canvasRef.current.updateRotation) {
      canvasRef.current.updateRotation(0, 0);
      canvasRef.current.setHoverState(false);
    }
  };

  return (
    <div 
      style={{ perspective: '1000px' }} 
      className={`w-full md:w-[300px] min-h-[220px] flex ${className}`}
    >
      <a
        href={href}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className={`
          relative flex-1 flex flex-col items-center justify-end gap-6 p-6 pb-8
          bg-gray-900/50 backdrop-blur-md border border-purple-500/30 rounded-xl
          text-decoration-none overflow-hidden transition-transform duration-200 ease-out
          shadow-lg group
        `}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.05 : 1})`,
          boxShadow: isHovered ? '0 15px 35px rgba(168,85,247,0.2)' : '0 4px 6px rgba(0,0,0,0.3)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Background glow για το 3D model, ώστε να κάνει αντίθεση */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-48 h-48 mb-8 rounded-full bg-purple-900/40 blur-2xl transition-all duration-500 group-hover:bg-purple-600/30 group-hover:w-56 group-hover:h-56" />
        </div>

        {/* Spotlight Overlay */}
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
          style={{
            background: 'radial-gradient(600px circle at 0px 0px, rgba(168, 85, 247, 0.15), transparent 40%)',
          }}
        />

        {/* Three.js Canvas Container (Background) */}
        <div 
          ref={canvasRef} 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ transform: 'translateZ(-10px)' }}
        />
        
        {/* Content */}
        <div 
          className="relative z-20 flex flex-col items-center mt-auto"
          style={{ transform: 'translateZ(30px)' }} // Pop out the content slightly
        >
          {children}
        </div>
      </a>
    </div>
  );
}
