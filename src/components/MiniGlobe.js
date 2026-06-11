'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function MiniGlobe() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || 112;
    let height = container.clientHeight || 112;

    // ============================================================
    // 1. Ρύθμιση Σκηνής (Three.js Setup)
    // ============================================================
    const scene = new THREE.Scene();

    // Perspective Camera κεντραρισμένη στο αντικείμενο
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.2;

    // WebGL Renderer με διαφανές background
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ============================================================
    // 2. Φωτισμός (Lighting)
    // ============================================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x7f5af0, 2.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x22d3ee, 2.0, 15);
    pointLight.position.set(-4, 2, 4);
    scene.add(pointLight);

    // ============================================================
    // 3. Κατασκευή Υδρογείου (Globe Construction)
    // ============================================================
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const textureLoader = new THREE.TextureLoader();
    const normalMap = textureLoader.load('/images/earth_normal.jpg');
    const specularMap = textureLoader.load('/images/earth_specular.jpg');

    const globeRadius = 1.8;

    // Σφαίρα με υλικό PBR (Metalness/Roughness/Normal maps)
    const globeGeom = new THREE.SphereGeometry(globeRadius, 64, 64);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x0f0f15,
      roughness: 0.2,
      metalness: 0.9,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.3, 0.3),
      roughnessMap: specularMap,
      transparent: true,
      opacity: 0.95,
      emissive: 0x7f5af0,
      emissiveIntensity: 0.1,
    });
    const globeMesh = new THREE.Mesh(globeGeom, globeMat);
    globeGroup.add(globeMesh);

    // Ατμόσφαιρα (atmosphere glow)
    const atmosGeom = new THREE.SphereGeometry(globeRadius + 0.04, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x7f5af0,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const atmosMesh = new THREE.Mesh(atmosGeom, atmosMat);
    globeGroup.add(atmosMesh);

    // ============================================================
    // 4. Σημεία Ταξιδιών & Τόξα (Travel Arcs)
    // ============================================================
    const convertLatLngToVector3 = (lat, lng, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.sin(theta));
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.cos(theta);
      return new THREE.Vector3(x, y, z);
    };

    const locations = {
      stuttgart: { lat: 48.7758, lng: 9.1829 },
      rhodes: { lat: 36.4349, lng: 28.2176 },
      athens: { lat: 37.9838, lng: 23.7275 },
      newYork: { lat: 40.7128, lng: -74.0060 },
      tokyo: { lat: 35.6762, lng: 139.6503 },
      sydney: { lat: -33.8688, lng: 151.2093 },
      capeTown: { lat: -33.9249, lng: 18.4241 }
    };

    const connections = [
      { from: locations.stuttgart, to: locations.athens },
      { from: locations.stuttgart, to: locations.rhodes },
      { from: locations.athens, to: locations.rhodes },
      { from: locations.stuttgart, to: locations.newYork },
      { from: locations.stuttgart, to: locations.tokyo },
      { from: locations.tokyo, to: locations.sydney },
      { from: locations.sydney, to: locations.capeTown },
      { from: locations.capeTown, to: locations.athens }
    ];

    const arcMat = new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    const signalMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    const signals = [];

    connections.forEach((conn) => {
      const p1 = convertLatLngToVector3(conn.from.lat, conn.from.lng, globeRadius);
      const p2 = convertLatLngToVector3(conn.to.lat, conn.to.lng, globeRadius);

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dist = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(globeRadius + dist * 0.16);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);

      const points = curve.getPoints(20);
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeom, arcMat);
      globeGroup.add(line);

      const signalGeom = new THREE.SphereGeometry(0.04, 8, 8);
      const signalMesh = new THREE.Mesh(signalGeom, signalMat.clone());
      globeGroup.add(signalMesh);

      signals.push({
        mesh: signalMesh,
        curve: curve,
        speed: 0.3 + Math.random() * 0.25,
        offset: Math.random()
      });
    });

    // ============================================================
    // 5. Animation Loop
    // ============================================================
    // Χρήση THREE.Timer αντί του Clock (deprecated) για σταθερό χρόνο
    const timer = new THREE.Timer();
    let animationFrameId;

    const animate = (timestamp) => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update(timestamp);

      const elapsed = timer.getElapsed();

      // Αργή περιστροφή της υδρογείου
      globeGroup.rotation.y = elapsed * 0.05;
      globeGroup.rotation.x = Math.sin(elapsed * 0.1) * 0.1;

      // Κίνηση των φωτεινών σημάτων
      signals.forEach((s) => {
        const t = (elapsed * s.speed + s.offset) % 1.0;
        const pos = s.curve.getPointAt(t);
        s.mesh.position.copy(pos);
        s.mesh.material.opacity = Math.sin(t * Math.PI) * 0.95;
      });

      renderer.render(scene, camera);
    };

    animate();

    // ============================================================
    // 6. Διαχείριση Resize
    // ============================================================
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // ============================================================
    // 7. Καθαρισμός Μνήμης (Cleanup)
    // ============================================================
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }

      globeGeom.dispose();
      globeMat.dispose();
      atmosGeom.dispose();
      atmosMat.dispose();
      arcMat.dispose();
      signalMat.dispose();
      
      signals.forEach((s) => {
        s.mesh.geometry.dispose();
        s.mesh.material.dispose();
      });

      normalMap.dispose();
      specularMap.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-16 h-16 md:w-24 h-24 relative flex-shrink-0"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  );
}
