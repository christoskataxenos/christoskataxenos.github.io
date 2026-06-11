'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GridBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ==========================================
    // 1. Ρύθμιση Σκηνής (Three.js Setup)
    // ==========================================
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

    // ==========================================
    // 2. Δημιουργία Πλέγματος Σωματιδίων (Particles Grid)
    // ==========================================
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

        // Κρατάμε τις αρχικές θέσεις για να υπολογίζουμε τις αποκλίσεις
        initialPositions[index * 3] = px;
        initialPositions[index * 3 + 1] = py;
        initialPositions[index * 3 + 2] = pz;

        index++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Προγραμματική δημιουργία κυκλικής υφής (soft dot) για να μην χρειαζόμαστε εικόνα
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
      return new THREE.CanvasTexture(canvas);
    };

    // Υλικό σωματιδίων με Additive Blending για όμορφο glow εφέ
    const material = new THREE.PointsMaterial({
      color: 0x7f5af0, // Μοβ accent χρώμα
      size: 0.15,
      map: createCircleTexture(),
      transparent: true,
      opacity: 0.4, // Μειωμένη αδιαφάνεια για καλύτερη αναγνωσιμότητα κειμένου
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ==========================================
    // 3. Παρακολούθηση Κίνησης Ποντικιού (Mouse Interaction)
    // ==========================================
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (event) => {
      // Κανονικοποίηση συντεταγμένων ποντικιού (-1 έως 1)
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Διαχείριση αλλαγής μεγέθους παραθύρου (Resize)
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // ==========================================
    // 4. Animation Loop (RequestAnimationFrame)
    // ==========================================
    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Linear Interpolation (lerp) για ομαλότητα στην κίνηση του ποντικιού
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const posAttribute = geometry.attributes.position;
      const posArray = posAttribute.array;

      // Αντιστοίχιση των coordinates του ποντικιού στον 3D χώρο
      const mouseWorldX = mouse.x * 12;
      const mouseWorldZ = -mouse.y * 8;

      // Ενημέρωση της θέσης Y κάθε σωματιδίου (κύματα + αλληλεπίδραση ποντικιού)
      for (let i = 0; i < numParticles; i++) {
        const i3 = i * 3;
        const px = initialPositions[i3];
        const pz = initialPositions[i3 + 2];

        // Βασικό κυματικό εφέ (sine/cosine) με βάση τον χρόνο
        let py = Math.sin(px * 0.5 + elapsed) * Math.cos(pz * 0.5 + elapsed) * 0.3;

        // Υπολογισμός απόστασης από το ποντίκι στο επίπεδο XZ
        const dx = px - mouseWorldX;
        const dz = pz - mouseWorldZ;
        const dist = Math.sqrt(dx * dx + dz * dz);

        // Αν το ποντίκι είναι κοντά, δημιουργούμε μια "απώθηση" (warp wave)
        if (dist < 4) {
          const force = (4 - dist) / 4; // Τιμή από 0 έως 1
          py += Math.sin(dist * 2.0 - elapsed * 4) * force * 0.6;
        }

        posArray[i3 + 1] = py; // Ενημέρωση Y
      }

      posAttribute.needsUpdate = true;

      // Αργή περιστροφή του πλέγματος για αίσθηση βάθους
      particles.rotation.y = elapsed * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // ==========================================
    // 5. Καθαρισμός Μνήμης (Memory Cleanup)
    // ==========================================
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (containerRef.current && renderer.domElement) {
        // Ασφαλής αφαίρεση του canvas από το DOM
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
