'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ============================================================
// HELPERS & CONFIG: Hologram Definitions Generator
// Σκοπός: Δομημένα δεδομένα για τις ονοματικές οθόνες (holograms)
// ============================================================
const getHologramDefinitions = (t) => ({
  experience: [
    {
      id: 'exp1',
      offset: new THREE.Vector3(-3.5, 2.0, 0.8),
      title: t.roles.researchDev.title,
      subtitle: t.roles.researchDev.date,
      body: t.roles.researchDev.description,
    },
    {
      id: 'exp2',
      offset: new THREE.Vector3(3.8, 0.8, -0.8),
      title: t.roles.technician.title,
      subtitle: t.roles.technician.dateLocation,
      body: t.roles.technician.responsibilitiesList ? t.roles.technician.responsibilitiesList.slice(0, 3).join(' • ') : '',
    },
    {
      id: 'exp3',
      offset: new THREE.Vector3(-3.0, -1.8, 1.8),
      title: t.roles.security.title,
      subtitle: t.roles.security.date,
      body: t.roles.security.description,
    }
  ],
  projects: (t.roles.researchDev.projects || []).map((p, idx) => ({
    id: `proj-${idx}`,
    offset: idx === 0 
      ? new THREE.Vector3(-3.5, 1.6, 0.8) 
      : (idx === 1 ? new THREE.Vector3(3.8, 0.4, -0.8) : new THREE.Vector3(-2.8, -1.8, 1.5)),
    title: p.name,
    subtitle: 'GitHub Project',
    body: p.desc,
    url: p.url
  })),
  education: [
    {
      id: 'edu1',
      offset: new THREE.Vector3(-3.4, 1.6, 0.8),
      title: t.education.university,
      subtitle: '2025',
      body: t.education.degree
    },
    {
      id: 'edu2',
      offset: new THREE.Vector3(3.4, -1.2, -0.8),
      title: t.education.iek,
      subtitle: '2008-2010',
      body: t.education.iekDegree
    }
  ],
  skills: Object.entries(t.skillGroups || {}).map(([key, group], idx) => ({
    id: `skill-${idx}`,
    offset: idx === 0 
      ? new THREE.Vector3(-3.5, 1.6, 0.8) 
      : (idx === 1 ? new THREE.Vector3(3.8, 0.4, -0.8) : new THREE.Vector3(-2.8, -1.8, 1.5)),
    title: group.title,
    subtitle: 'Expertise Matrix',
    skillsList: group.skills
  })),
  interests: [
    {
      id: 'int1',
      offset: new THREE.Vector3(-3.0, 1.6, 0.8),
      title: 'Photography',
      subtitle: 'INTEREST',
      body: 'Capturing moments, street photography, landscapes.'
    },
    {
      id: 'int2',
      offset: new THREE.Vector3(3.2, 0.8, -0.8),
      title: 'Gaming',
      subtitle: 'INTEREST',
      body: 'RPG, strategy, simulation, VR experiences.'
    },
    {
      id: 'int3',
      offset: new THREE.Vector3(-2.5, -1.6, 1.2),
      title: 'Travelling',
      subtitle: 'INTEREST',
      body: 'Exploring new cultures, roadtrips, documentation.'
    },
    {
      id: 'int4',
      offset: new THREE.Vector3(2.8, -1.4, -1.2),
      title: 'Custom Rigs',
      subtitle: 'INTEREST',
      body: 'PC building, hardware tweaking, server setups.'
    }
  ]
});

// ============================================================
// HELPER COMPONENT: Typewriter Text
// Σκόπος: Εφέ γραφομηχανής για sci-fi αίσθηση εμφάνισης κειμένου
// ============================================================
const TypewriterText = ({ text, delay = 15 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    if (!text) return;
    
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(currentIndex));
      currentIndex++;
      if (currentIndex >= text.length) {
        clearInterval(intervalId);
      }
    }, delay);

    return () => clearInterval(intervalId);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

// ============================================================
// MAIN COMPONENT: 3D Holographic Constellation Bio
// Σκοπός: 3D διαδραστικός αστερισμός με ολόγραμματα (Three.js WebGL)
// ============================================================
export default function BioSection() {
  const { t } = useLanguage();
  const [activeNode, setActiveNode] = useState(null);
  
  const containerRef = useRef(null);
  const canvasContainerRef = useRef(null);
  
  const labelRefs = useRef({});
  const hologramRefs = useRef({});
  const svgPathRefs = useRef({}); // Refs για τις 2D γραμμές σύνδεσης SVG
  const centerLabelRef = useRef(null);
  
  const [activeHolograms, setActiveHolograms] = useState([]);
  const activeHologramsRef = useRef(activeHolograms);

  const activeNodeRef = useRef(activeNode);
  useEffect(() => {
    activeNodeRef.current = activeNode;
    
    const defs = getHologramDefinitions(t);
    if (activeNode && defs[activeNode]) {
      setActiveHolograms(defs[activeNode]);
    } else {
      setActiveHolograms([]);
    }
  }, [activeNode, t]);

  useEffect(() => {
    activeHologramsRef.current = activeHolograms;
  }, [activeHolograms]);
  
  const hoveredNodeIdRef = useRef(null);
  
  const targetsRef = useRef({
    cameraPos: new THREE.Vector3(0, 0, 12),
    lookAt: new THREE.Vector3(0, 0, 0),
    zoomFactor: 1.0,
  });

  const nodeDefinitions = [
    { id: 'experience', label: t.experienceTitle, pos3D: new THREE.Vector3(-4.5, 2.5, 1.5) },
    { id: 'projects',   label: 'Projects',       pos3D: new THREE.Vector3(4.5, 2.5, -1.5) },
    { id: 'education',  label: t.educationTitle,  pos3D: new THREE.Vector3(-3.5, -2.5, 2.0) },
    { id: 'skills',     label: t.skillsTitle,     pos3D: new THREE.Vector3(3.5, -2.5, -2.0) },
    { id: 'interests',  label: t.interestsTitle || 'Interests', pos3D: new THREE.Vector3(0.0, -4.0, 1.0) },
  ];

  // Εφέ για τον καθορισμό των θέσεων-στόχων της κάμερας (Inspect Mode)
  // Μετατοπίζουμε το lookAt και το cameraPos ώστε ο κόμβος να φαίνεται στα πλάγια και τα ολογράμματα στο κενό
  useEffect(() => {
    const nodeDef = nodeDefinitions.find((n) => n.id === activeNode);
    if (nodeDef) {
      const pos = nodeDef.pos3D;
      const isLeft = pos.x < 0;
      const isCenter = Math.abs(pos.x) < 1.0;
      
      const targetLookAt = new THREE.Vector3();
      const targetCamPos = new THREE.Vector3();
      
      if (isCenter) {
        // Κεντρικός κόμβος (Interests): κοιτάμε ελαφρώς πιο πάνω
        targetLookAt.set(pos.x, pos.y + 1.2, pos.z);
        targetCamPos.set(pos.x, pos.y + 0.8, pos.z + 10.5);
      } else if (isLeft) {
        // Κόμβος στα αριστερά: μετατοπίζουμε το κέντρο δεξιά για να μπει ο κόμβος αριστερά στην οθόνη
        targetLookAt.set(pos.x + 2.5, pos.y, pos.z);
        targetCamPos.set(pos.x + 1.5, pos.y, pos.z + 9.5);
      } else {
        // Κόμβος στα δεξιά: μετατοπίζουμε το κέντρο αριστερά για να μπει ο κόμβος δεξιά στην οθόνη
        targetLookAt.set(pos.x - 2.5, pos.y, pos.z);
        targetCamPos.set(pos.x - 1.5, pos.y, pos.z + 9.5);
      }
      
      targetsRef.current.cameraPos.copy(targetCamPos);
      targetsRef.current.lookAt.copy(targetLookAt);
      targetsRef.current.zoomFactor = 0.45;
    } else {
      targetsRef.current.cameraPos.set(0, 0, 12);
      targetsRef.current.lookAt.set(0, 0, 0);
      targetsRef.current.zoomFactor = 1.0;
    }
  }, [activeNode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveNode(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNodeClick = useCallback((id) => {
    setActiveNode((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    if (!canvasContainerRef.current) return;

    let width = canvasContainerRef.current.clientWidth;
    let height = canvasContainerRef.current.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.copy(targetsRef.current.cameraPos);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.maxDistance = 18;
    controls.minDistance = 4;
    controls.enablePan = false;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x7f5af0, 2, 50);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(0, 0, 1);
    camera.add(dirLight);
    scene.add(camera);

    const nodeMeshes = [];
    const connectionLines = [];
    const signals = [];
    const nodeGroups = {}; // Αναφορές στα groups των πλανητών για το hover scaling
    
    // ============================================================
    // PROCEDURAL TEXTURES GENERATION (Sci-Fi / Cybernetic Themes)
    // ============================================================
    
    // 1. Μεταλλική υφή (Metal Bump Map) για τον κόμβο της Εμπειρίας
    const createMetalBumpTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 128, 128);
      // Προσθήκη κόκκων θορύβου
      for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 128;
        const y = Math.random() * 128;
        const val = Math.floor(Math.random() * 80) - 40;
        ctx.fillStyle = `rgb(${128+val}, ${128+val}, ${128+val})`;
        ctx.fillRect(x, y, 1, 1);
      }
      return new THREE.CanvasTexture(canvas);
    };

    // 2. Ψηφιακό πλέγμα (Grid Texture) για την Εκπαίδευση
    const createGridTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 64, 64);
      // Σχεδίαση πλέγματος
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, 64, 64);
      ctx.beginPath();
      ctx.moveTo(32, 0);
      ctx.lineTo(32, 64);
      ctx.moveTo(0, 32);
      ctx.lineTo(64, 32);
      ctx.stroke();
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      return texture;
    };

    // 3. Ρίγες Neon (Neon Stripes) για τα Projects και τα Skills
    const createNeonStripesTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 128, 128);
      
      const grad = ctx.createLinearGradient(0, 0, 0, 128);
      grad.addColorStop(0.0, '#db2777');
      grad.addColorStop(0.2, '#000000');
      grad.addColorStop(0.4, '#a855f7');
      grad.addColorStop(0.6, '#000000');
      grad.addColorStop(0.8, '#22d3ee');
      grad.addColorStop(1.0, '#000000');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const metalBumpTexture = createMetalBumpTexture();
    const gridTexture = createGridTexture();
    const neonStripesTexture = createNeonStripesTexture();
    
    // Πίνακες για την παρακολούθηση των custom στοιχείων κάθε πλανήτη
    const experienceRings = []; // Για περιστροφή των δακτυλίων της Εμπειρίας
    const projectMoons = [];    // Για τις τροχιές των δορυφόρων των Projects
    const educationCages = [];   // Για την περιστροφή του πλέγματος της Εκπαίδευσης
    const skillKnots = [];       // Για τον παλμό και την περιστροφή του Torus Knot
    const interestGyros = [];    // Για τους γυροσκοπικούς δακτυλίους των Interests

    const centerGroup = new THREE.Group();
    scene.add(centerGroup);

    const coreGeom = new THREE.DodecahedronGeometry(1.2, 1);
    const coreMat = new THREE.MeshPhongMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.6, shininess: 80 });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    centerGroup.add(coreMesh);

    const ringGeom = new THREE.RingGeometry(1.5, 1.55, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    centerGroup.add(ringMesh);

    nodeDefinitions.forEach((node) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.copy(node.pos3D);
      scene.add(nodeGroup);
      nodeGroups[node.id] = nodeGroup;

      // Δημιουργία κύριας σφαίρας (click target / collider) - γίνεται αόρατη για όλους τους πλανήτες
      const sphereGeom = new THREE.SphereGeometry(0.45, 32, 32);
      const sphereMat = new THREE.MeshBasicMaterial({ visible: false }); // Αόρατο click target
      const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
      sphereMesh.userData = { id: node.id };
      nodeGroup.add(sphereMesh);
      nodeMeshes.push(sphereMesh);

      // Προσθήκη custom 3D διακοσμητικών στοιχείων για κάθε πλανήτη
      if (node.id === 'experience') {
        // Κεντρικός μικρός μεταλλικός πυρήνας με ανάγλυφη υφή
        const coreGeom = new THREE.SphereGeometry(0.2, 32, 32);
        const coreMat = new THREE.MeshStandardMaterial({ 
          color: 0x7f5af0, 
          metalness: 0.95, 
          roughness: 0.05,
          bumpMap: metalBumpTexture,
          bumpScale: 0.04
        });
        const coreMesh = new THREE.Mesh(coreGeom, coreMat);
        nodeGroup.add(coreMesh);

        // Διπλοί τρισδιάστατοι δακτύλιοι (Toruses) τύπου Κρόνου
        const ringGeom1 = new THREE.TorusGeometry(0.48, 0.035, 12, 64);
        const ringMat1 = new THREE.MeshPhongMaterial({ color: 0x22d3ee, shininess: 100 });
        const ringMesh1 = new THREE.Mesh(ringGeom1, ringMat1);
        ringMesh1.rotation.x = Math.PI / 3;
        ringMesh1.rotation.y = Math.PI / 6;
        nodeGroup.add(ringMesh1);
        experienceRings.push(ringMesh1);

        const ringGeom2 = new THREE.TorusGeometry(0.64, 0.03, 12, 64);
        const ringMat2 = new THREE.MeshPhongMaterial({ color: 0xec4899, shininess: 80 });
        const ringMesh2 = new THREE.Mesh(ringGeom2, ringMat2);
        ringMesh2.rotation.x = Math.PI / 3;
        ringMesh2.rotation.y = -Math.PI / 6;
        nodeGroup.add(ringMesh2);
        experienceRings.push(ringMesh2);
      } else if (node.id === 'projects') {
        // Κεντρικός λαμπερός πυρήνας με neon ρίγες
        const coreGeom = new THREE.SphereGeometry(0.16, 32, 32);
        const coreMat = new THREE.MeshStandardMaterial({ 
          color: 0xffffff,
          map: neonStripesTexture,
          roughness: 0.15,
          metalness: 0.85,
          emissive: 0x22d3ee,
          emissiveIntensity: 0.5
        });
        const coreMesh = new THREE.Mesh(coreGeom, coreMat);
        nodeGroup.add(coreMesh);

        // Τρεις δορυφόροι (moons) που εκτελούν τροχιές
        const moonGeom1 = new THREE.SphereGeometry(0.065, 16, 16);
        const moonMat1 = new THREE.MeshPhongMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, shininess: 100 });
        const moonMesh1 = new THREE.Mesh(moonGeom1, moonMat1);
        nodeGroup.add(moonMesh1);

        const moonGeom2 = new THREE.SphereGeometry(0.05, 16, 16);
        const moonMat2 = new THREE.MeshPhongMaterial({ color: 0xa855f7, emissive: 0xa855f7, shininess: 100 });
        const moonMesh2 = new THREE.Mesh(moonGeom2, moonMat2);
        nodeGroup.add(moonMesh2);

        const moonGeom3 = new THREE.SphereGeometry(0.055, 16, 16);
        const moonMat3 = new THREE.MeshPhongMaterial({ color: 0xdb2777, emissive: 0xdb2777, shininess: 100 });
        const moonMesh3 = new THREE.Mesh(moonGeom3, moonMat3);
        nodeGroup.add(moonMesh3);

        projectMoons.push(
          { mesh: moonMesh1, radius: 0.55, speed: 1.6, phase: 0, tilt: 0.35 },
          { mesh: moonMesh2, radius: 0.8, speed: -1.1, phase: Math.PI / 3, tilt: -0.4 },
          { mesh: moonMesh3, radius: 1.05, speed: 0.7, phase: (2 * Math.PI) / 3, tilt: 0.2 }
        );

        // Λεπτές γραμμές τροχιάς των δορυφόρων
        const trackGeom1 = new THREE.RingGeometry(0.54, 0.55, 64);
        const trackMat1 = new THREE.MeshBasicMaterial({ color: 0x22d3ee, side: THREE.DoubleSide, transparent: true, opacity: 0.12 });
        const trackMesh1 = new THREE.Mesh(trackGeom1, trackMat1);
        trackMesh1.rotation.x = Math.PI / 2 + 0.35;
        nodeGroup.add(trackMesh1);

        const trackGeom2 = new THREE.RingGeometry(0.79, 0.8, 64);
        const trackMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide, transparent: true, opacity: 0.08 });
        const trackMesh2 = new THREE.Mesh(trackGeom2, trackMat2);
        trackMesh2.rotation.x = Math.PI / 2 - 0.4;
        nodeGroup.add(trackMesh2);

        const trackGeom3 = new THREE.RingGeometry(1.04, 1.05, 64);
        const trackMat3 = new THREE.MeshBasicMaterial({ color: 0xdb2777, side: THREE.DoubleSide, transparent: true, opacity: 0.06 });
        const trackMesh3 = new THREE.Mesh(trackGeom3, trackMat3);
        trackMesh3.rotation.x = Math.PI / 2 + 0.2;
        nodeGroup.add(trackMesh3);
      } else if (node.id === 'education') {
        // Κεντρικός πυρήνας εικοσάεδρου με πλέγμα
        const coreGeom = new THREE.OctahedronGeometry(0.18, 0);
        const coreMat = new THREE.MeshStandardMaterial({ 
          color: 0x1d4ed8, 
          metalness: 0.8, 
          roughness: 0.2,
          bumpMap: gridTexture,
          bumpScale: 0.03
        });
        const coreMesh = new THREE.Mesh(coreGeom, coreMat);
        nodeGroup.add(coreMesh);

        // Εσωτερικός κλωβός (οκτάεδρο wireframe) με υφή πλέγματος
        const innerCageGeom = new THREE.OctahedronGeometry(0.48, 0);
        const innerCageMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.4, map: gridTexture });
        const innerCageMesh = new THREE.Mesh(innerCageGeom, innerCageMat);
        nodeGroup.add(innerCageMesh);
        educationCages.push({ mesh: innerCageMesh, speedX: 0.4, speedY: 0.3 });

        // Εξωτερικός κλωβός (δωδεκάεδρο wireframe) με υφή πλέγματος
        const outerCageGeom = new THREE.DodecahedronGeometry(0.72, 0);
        const outerCageMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.3, map: gridTexture });
        const outerCageMesh = new THREE.Mesh(outerCageGeom, outerCageMat);
        nodeGroup.add(outerCageMesh);
        educationCages.push({ mesh: outerCageMesh, speedX: -0.2, speedY: -0.4 });
      } else if (node.id === 'skills') {
        // Κεντρικός κόμβος-σπείρα Torus Knot με neon ρίγες
        const knotGeom = new THREE.TorusKnotGeometry(0.28, 0.08, 64, 8);
        const knotMat = new THREE.MeshStandardMaterial({ 
          color: 0xffffff,
          map: neonStripesTexture,
          roughness: 0.1,
          metalness: 0.9,
          emissive: 0xdb2777,
          emissiveIntensity: 0.5
        });
        const knotMesh = new THREE.Mesh(knotGeom, knotMat);
        nodeGroup.add(knotMesh);
        skillKnots.push(knotMesh);
      } else if (node.id === 'interests') {
        // Κεντρικός μικρός πυρήνας με μεταλλική υφή
        const coreGeom = new THREE.SphereGeometry(0.16, 32, 32);
        const coreMat = new THREE.MeshStandardMaterial({ 
          color: 0x10b981, 
          metalness: 0.75, 
          roughness: 0.25,
          bumpMap: metalBumpTexture,
          bumpScale: 0.02
        });
        const coreMesh = new THREE.Mesh(coreGeom, coreMat);
        nodeGroup.add(coreMesh);

        // Γυροσκοπική δομή 3 δακτυλίων (Toruses) στους άξονες X, Y, Z
        const gyroRingGeom = new THREE.TorusGeometry(0.46, 0.02, 8, 48);
        const gyroMat1 = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide });
        const gyroMesh1 = new THREE.Mesh(gyroRingGeom, gyroMat1);
        nodeGroup.add(gyroMesh1);

        const gyroMat2 = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });
        const gyroMesh2 = new THREE.Mesh(gyroRingGeom, gyroMat2);
        gyroMesh2.rotation.y = Math.PI / 2;
        nodeGroup.add(gyroMesh2);

        const gyroMat3 = new THREE.MeshBasicMaterial({ color: 0x22d3ee, side: THREE.DoubleSide });
        const gyroMesh3 = new THREE.Mesh(gyroRingGeom, gyroMat3);
        gyroMesh3.rotation.x = Math.PI / 2;
        nodeGroup.add(gyroMesh3);

        interestGyros.push(
          { mesh: gyroMesh1, axis: 'z', speed: 0.6 },
          { mesh: gyroMesh2, axis: 'x', speed: -0.8 },
          { mesh: gyroMesh3, axis: 'y', speed: 1.0 }
        );
      }

      const points = [new THREE.Vector3(0, 0, 0), node.pos3D];
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x7f5af0, transparent: true, opacity: 0.15 });
      const line = new THREE.Line(lineGeom, lineMat);
      scene.add(line);
      connectionLines.push(line);

      const signalGeom = new THREE.SphereGeometry(0.08, 8, 8);
      const signalMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.9 });
      const signalMesh = new THREE.Mesh(signalGeom, signalMat);
      scene.add(signalMesh);
      signals.push({ mesh: signalMesh, start: new THREE.Vector3(0, 0, 0), end: node.pos3D.clone(), speed: 0.5 + Math.random() * 0.4, offset: Math.random() });
    });

    const dustCount = 120;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 25;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({ color: 0x94a1b2, size: 0.05, transparent: true, opacity: 0.3 });
    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustParticles);

    const hologramGroup = new THREE.Group();
    scene.add(hologramGroup);

    // Ομάδα για την προβολή των ολογραφικών κυμάτων (volumetric effect)
    const projectionBeamGroup = new THREE.Group();
    scene.add(projectionBeamGroup);

    let hologram3DMeshes = [];
    let hologramLines = [];
    let projectRings = []; // Αποθήκευση δακτυλίων προβολής για το animation

    // Συνάρτηση αναδόμησης των 3D σημείων ολογράμματος
    const rebuildHologramsIn3D = (nodeId) => {
      // Καθαρισμός προηγούμενων ολογραμμάτων
      while(hologramGroup.children.length > 0) {
        const obj = hologramGroup.children[0];
        hologramGroup.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      }
      hologram3DMeshes = [];
      hologramLines = [];

      // Καθαρισμός προηγούμενων δακτυλίων προβολής
      while(projectionBeamGroup.children.length > 0) {
        const obj = projectionBeamGroup.children[0];
        projectionBeamGroup.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      }
      projectRings = [];
      projectionBeamGroup.visible = false;

      if (nodeId) {
        const nodeDef = nodeDefinitions.find(n => n.id === nodeId);
        const holos = getHologramDefinitions(t)[nodeId];
        if (nodeDef && holos) {
          const isLeft = nodeDef.pos3D.x < 0;
          const isCenter = Math.abs(nodeDef.pos3D.x) < 1.0;
          
          let sumOffsets = new THREE.Vector3();

          holos.forEach((holo, idx) => {
            // Υπολογισμός δυναμικής θέσης των 3D αστεριών ολογράμματος (πιο κοντά στον κόμβο για να μην βγαίνουν εκτός viewport)
            const customOffset = new THREE.Vector3();
            if (isCenter) {
              // Κεντρικός κόμβος (Interests): άπλωμα σε ημικύκλιο
              const angle = (idx / (holos.length - 1 || 1)) * Math.PI - Math.PI / 2; // -90 έως 90 μοίρες
              customOffset.set(Math.sin(angle) * 2.0, Math.cos(angle) * 1.4 + 0.8, Math.sin(angle) * 0.2);
            } else if (isLeft) {
              // Αριστερός κόμβος: τα αστέρια πάνε δεξιά
              const xOffset = 2.0 + (idx % 2 === 0 ? 0.3 : 0);
              const yOffset = 0.8 - idx * 0.8;
              customOffset.set(xOffset, yOffset, -0.1 + idx * 0.1);
            } else {
              // Δεξιός κόμβος: τα αστέρια πάνε αριστερά
              const xOffset = -2.0 - (idx % 2 === 0 ? 0.3 : 0);
              const yOffset = 0.8 - idx * 0.8;
              customOffset.set(xOffset, yOffset, 0.1 - idx * 0.1);
            }

            sumOffsets.add(customOffset);

            const geom = new THREE.SphereGeometry(0.05, 8, 8);
            const mat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.8 });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.copy(nodeDef.pos3D).add(customOffset);
            hologramGroup.add(mesh);
            hologram3DMeshes.push({ mesh, offset: customOffset, id: holo.id, nodePos: nodeDef.pos3D.clone() });

            // Διακεκομμένη γραμμή σύνδεσης από τον κόμβο στο ολόγραμμα
            const linePoints = [nodeDef.pos3D, mesh.position];
            const lineGeom = new THREE.BufferGeometry().setFromPoints(linePoints);
            const lineMat = new THREE.LineDashedMaterial({
              color: 0x22d3ee,
              dashSize: 0.15,
              gapSize: 0.1,
              transparent: true,
              opacity: 0.35
            });
            const line = new THREE.Line(lineGeom, lineMat);
            line.computeLineDistances();
            hologramGroup.add(line);
            hologramLines.push({ line, mesh, nodePos: nodeDef.pos3D.clone() });
          });

          // Δημιουργία δακτυλίων προβολής (holographic beam waves) προς το κέντρο των καρτών
          const averageOffset = sumOffsets.divideScalar(holos.length || 1);
          const targetCenter = nodeDef.pos3D.clone().add(averageOffset);
          const beamDistance = nodeDef.pos3D.distanceTo(targetCenter);

          projectionBeamGroup.position.copy(nodeDef.pos3D);
          projectionBeamGroup.lookAt(targetCenter);
          projectionBeamGroup.visible = true;

          const ringGeom = new THREE.RingGeometry(0.1, 0.12, 32);
          const ringMat = new THREE.MeshBasicMaterial({ 
            color: 0x22d3ee, 
            side: THREE.DoubleSide, 
            transparent: true, 
            opacity: 0 
          });

          const numRings = 4;
          for (let i = 0; i < numRings; i++) {
            const ringMesh = new THREE.Mesh(ringGeom, ringMat.clone());
            projectionBeamGroup.add(ringMesh);
            projectRings.push({ 
              mesh: ringMesh, 
              offset: i / numRings, 
              maxDist: beamDistance 
            });
          }
        }
      }
    };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-9999, -9999);

    const handleMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('click', () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      
      if (intersects.length > 0) {
        if (!activeNodeRef.current) {
          handleNodeClick(intersects[0].object.userData.id);
        }
      } else {
        if (activeNodeRef.current) {
          setActiveNode(null);
        }
      }
    });

    // Χρήση THREE.Timer αντί του Clock (deprecated) για σταθερό χρόνο
    const timer = new THREE.Timer();
    const tempV = new THREE.Vector3();
    let animationFrameId;
    let lastActiveNode = null;

    const animate = (timestamp) => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update(timestamp);
      const elapsed = timer.getElapsed();

      const curW = renderer.domElement.clientWidth;
      const curH = renderer.domElement.clientHeight;

      if (activeNodeRef.current !== lastActiveNode) {
        lastActiveNode = activeNodeRef.current;
        rebuildHologramsIn3D(lastActiveNode);
      }

      // Απενεργοποίηση χειροκίνητης περιστροφής, ο έλεγχος γίνεται μέσω Mouse Gravity
      controls.enableRotate = false;

      // ============================================================
      // YΠΟΛΟΓΙΣΜΟΣ ΒΑΡΥΤΗΤΑΣ ΠΟΝΤΙΚΙΟΥ (Mouse Gravity Calculation)
      // ============================================================
      if (!activeNodeRef.current) {
        let closestNode = null;
        let minDist = Infinity;
        const tempV2 = new THREE.Vector2();

        // Εύρεση πλησιέστερου κόμβου σε NDC συντεταγμένες
        nodeDefinitions.forEach((node) => {
          tempV.copy(node.pos3D).project(camera);
          tempV2.set(tempV.x, tempV.y);
          const dist = mouse.distanceTo(tempV2);
          if (dist < minDist) {
            minDist = dist;
            closestNode = node;
          }
        });

        // Όριο βαρυτικής έλξης (threshold)
        const gravityThreshold = 0.9;
        if (closestNode && minDist < gravityThreshold) {
          // Υπολογισμός δύναμης έλξης με smoothstep
          const t = 1.0 - (minDist / gravityThreshold);
          const influence = t * t * (3 - 2 * t);

          // Έλξη της κάμερας προς τον κόμβο
          targetsRef.current.lookAt.copy(closestNode.pos3D).multiplyScalar(0.22 * influence);
          targetsRef.current.cameraPos.set(0, 0, 12).addScaledVector(closestNode.pos3D, 0.14 * influence);
        } else {
          // Επαναφορά στην κεντρική θέση
          targetsRef.current.lookAt.set(0, 0, 0);
          targetsRef.current.cameraPos.set(0, 0, 12);
        }
      }

      if (!activeNode) {
        centerGroup.rotation.y = elapsed * 0.15;
        centerGroup.rotation.x = elapsed * 0.08;
        dustParticles.rotation.y = elapsed * 0.015;
      } else {
        centerGroup.rotation.y = elapsed * 0.05;
      }
      // Animation των δακτυλίων της Εμπειρίας
      experienceRings.forEach((r, idx) => {
        const direction = idx === 0 ? 1 : -1;
        r.rotation.z = elapsed * 0.6 * direction;
      });

      // Animation των δορυφόρων στα Projects
      projectMoons.forEach((m) => {
        const angle = elapsed * m.speed + m.phase;
        m.mesh.position.x = Math.cos(angle) * m.radius;
        m.mesh.position.y = Math.sin(angle) * Math.sin(m.tilt) * m.radius;
        m.mesh.position.z = Math.sin(angle) * Math.cos(m.tilt) * m.radius;
      });

      // Animation του πλέγματος της Εκπαίδευσης (πολλαπλοί κλωβοί)
      educationCages.forEach((cage) => {
        cage.mesh.rotation.y += cage.speedY * 0.015;
        cage.mesh.rotation.x += cage.speedX * 0.015;
      });

      // Animation του Torus Knot των Skills (περιστροφή & παλμός)
      skillKnots.forEach((knot) => {
        knot.rotation.x = elapsed * 0.8;
        knot.rotation.y = elapsed * 0.5;
        const scale = 1.0 + Math.sin(elapsed * 2.2) * 0.1;
        knot.scale.set(scale, scale, scale);
      });

      // Animation των γυροσκοπικών δακτυλίων των Interests
      interestGyros.forEach((g) => {
        if (g.axis === 'x') g.mesh.rotation.x += g.speed * 0.015;
        if (g.axis === 'y') g.mesh.rotation.y += g.speed * 0.015;
        if (g.axis === 'z') g.mesh.rotation.z += g.speed * 0.015;
      });

      signals.forEach((s) => {
        const t = (elapsed * s.speed + s.offset) % 1.0;
        s.mesh.position.copy(s.start).lerp(s.end, t);
        s.mesh.material.opacity = Math.sin(t * Math.PI) * 0.9;
      });

      hologram3DMeshes.forEach((item, idx) => {
        const floatY = Math.sin(elapsed * 1.5 + idx) * 0.15;
        item.mesh.position.copy(item.nodePos).add(item.offset);
        item.mesh.position.y += floatY;
      });

      // Animation των δακτυλίων προβολής (holographic wave propagation)
      if (activeNodeRef.current) {
        projectRings.forEach((ring) => {
          const progress = (elapsed * 0.5 + ring.offset) % 1.0;
          const dist = progress * ring.maxDist;
          ring.mesh.position.z = dist;
          const currentScale = 0.5 + progress * 9.0;
          ring.mesh.scale.set(currentScale, currentScale, 1);
          ring.mesh.material.opacity = Math.sin(progress * Math.PI) * 0.18;
        });
      }

      hologramLines.forEach((item) => {
        const posArray = item.line.geometry.attributes.position.array;
        posArray[3] = item.mesh.position.x;
        posArray[4] = item.mesh.position.y;
        posArray[5] = item.mesh.position.z;
        item.line.geometry.attributes.position.needsUpdate = true;
        item.line.computeLineDistances();
      });

      camera.position.lerp(targetsRef.current.cameraPos, 0.05);
      controls.target.lerp(targetsRef.current.lookAt, 0.05);
      controls.update();

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      const curHover = (intersects.length > 0 && !activeNode) ? intersects[0].object : null;

      // Ομαλό Hover Scaling για ολόκληρη την ομάδα (Group) κάθε πλανήτη
      nodeDefinitions.forEach((node) => {
        const group = nodeGroups[node.id];
        if (group) {
          const isH = (curHover && curHover.userData.id === node.id) || (hoveredNodeIdRef.current === node.id);
          const isActive = activeNode === node.id;
          const targetScale = isActive ? 1.25 : (isH ? 1.35 : 1.0);
          group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
        }
      });

      nodeDefinitions.forEach((n) => {
        const el = labelRefs.current[n.id];
        if (el) {
          tempV.copy(n.pos3D).project(camera);
          const x = (tempV.x * 0.5 + 0.5) * curW;
          const y = (tempV.y * -0.5 + 0.5) * curH;
          el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
          el.style.opacity = activeNode ? '0' : '1';
        }
      });

      // Σχεδίαση των 2D SVG γραμμών σύνδεσης από τον 3D κόμβο, μέσω των 3D αστεριών, προς τις HTML κάρτες
      const activeNodeId = activeNodeRef.current;
      if (activeNodeId) {
        const activeNodeDef = nodeDefinitions.find(n => n.id === activeNodeId);
        if (activeNodeDef) {
          tempV.copy(activeNodeDef.pos3D).project(camera);
          const nodeX = (tempV.x * 0.5 + 0.5) * curW;
          const nodeY = (tempV.y * -0.5 + 0.5) * curH;
          
          hologram3DMeshes.forEach((item) => {
            const cardEl = hologramRefs.current[item.id];
            const pathEl = svgPathRefs.current[item.id];
            if (cardEl && pathEl) {
              // Προβολή του 3D ολογραφικού αστεριού
              tempV.copy(item.mesh.position).project(camera);
              const holoX = (tempV.x * 0.5 + 0.5) * curW;
              const holoY = (tempV.y * -0.5 + 0.5) * curH;
              
              // Συντεταγμένες της HTML κάρτας
              if (containerRef.current) {
                const rect = cardEl.getBoundingClientRect();
                const parentRect = containerRef.current.getBoundingClientRect();
                
                const cardMidX = rect.left - parentRect.left + rect.width / 2;
                const isCardOnLeft = cardMidX < holoX;
                const cardX = rect.left - parentRect.left + (isCardOnLeft ? rect.width : 0);
                const cardY = rect.top - parentRect.top + rect.height / 2;
                
                // Σχεδιάζουμε γραμμή: Κόμβος -> 3D Αστέρι -> HTML Κάρτα
                const pathData = `M ${nodeX} ${nodeY} L ${holoX} ${holoY} L ${cardX} ${cardY}`;
                pathEl.setAttribute('d', pathData);
              }
            }
          });
        }
      } else {
        // Απόκρυψη των SVG γραμμών καθαρίζοντας το d attribute
        const holos = activeHologramsRef.current;
        holos.forEach((holo) => {
          const pathEl = svgPathRefs.current[holo.id];
          if (pathEl) {
            pathEl.setAttribute('d', '');
          }
        });
      }

      if (centerLabelRef.current) {
        tempV.set(0, 0, 0).project(camera);
        centerLabelRef.current.style.transform = `translate(-50%, -50%) translate(${(tempV.x * 0.5 + 0.5) * curW}px, ${(tempV.y * -0.5 + 0.5) * curH}px)`;
        centerLabelRef.current.style.opacity = activeNode ? '0.0' : '1';
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!canvasContainerRef.current) return;
      width = canvasContainerRef.current.clientWidth;
      height = canvasContainerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  const nodeDef = nodeDefinitions.find((n) => n.id === activeNode);
  const isLeftNode = nodeDef ? nodeDef.pos3D.x < 0 : false;
  const alignmentClass = isLeftNode 
    ? 'right-4 md:right-16 md:items-end' 
    : 'left-4 md:left-16 md:items-start';

  return (
    <section className="relative w-full h-screen overflow-hidden font-sans bg-[#0a0a0c]">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-[120px]" />
      </div>

      <div ref={canvasContainerRef} className="fixed inset-0 w-full h-full z-10 animate-fadeIn" />

      <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none z-20">
        {nodeDefinitions.map((node) => (
          <div
            key={node.id}
            ref={(el) => (labelRefs.current[node.id] = el)}
            className="absolute z-20 flex flex-col items-center cursor-pointer group pointer-events-auto transition-opacity duration-300"
            style={{ left: 0, top: 0, transform: 'translate(-50%, -100%)' }}
            onMouseEnter={() => { hoveredNodeIdRef.current = node.id; }}
            onMouseLeave={() => { hoveredNodeIdRef.current = null; }}
            onClick={() => handleNodeClick(node.id)}
          >
            <div className="px-4 py-2 bg-[#0a0a0c]/90 border border-purple-500/40 rounded-lg backdrop-blur-md text-center shadow-lg transition-all group-hover:border-cyan-400">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white group-hover:text-cyan-300">
                {node.label}
              </span>
            </div>
            <div className="w-[1px] h-8 bg-gradient-to-b from-purple-500/50 to-transparent group-hover:from-cyan-400/80 group-hover:h-10" />
          </div>
        ))}

        {/* SVG connection lines overlay: Σχεδιασμός με drop-shadow glow και moving pulse dots */}
        <svg 
          width="100%" 
          height="100%" 
          className={`absolute inset-0 pointer-events-none z-15 md:block hidden transition-opacity duration-500 ${activeNode ? 'opacity-100' : 'opacity-0'}`}
        >
          {activeHolograms.map((holo) => (
            <g key={holo.id}>
              <path
                id={`path-${holo.id}`}
                ref={(el) => (svgPathRefs.current[holo.id] = el)}
                stroke="#22d3ee"
                strokeWidth="1.5"
                strokeDasharray="4 5"
                fill="none"
                className="opacity-70"
                style={{ filter: 'drop-shadow(0 0 3px rgba(34, 211, 238, 0.6))' }}
              />
              <circle r="2" fill="#22d3ee">
                <animateMotion dur="2s" repeatCount="indefinite">
                  <mpath href={`#path-${holo.id}`} />
                </animateMotion>
              </circle>
              <circle r="4" fill="#22d3ee" opacity="0.35">
                <animateMotion dur="2s" repeatCount="indefinite">
                  <mpath href={`#path-${holo.id}`} />
                </animateMotion>
              </circle>
            </g>
          ))}
        </svg>

        {/* Hologram cards wrapper: Στο κινητό δημιουργεί ένα scrollable container στο κάτω μέρος, στο desktop είναι flex column στα πλάγια */}
        {activeNode && (
          <div className={`absolute top-20 bottom-24 w-full md:w-[340px] flex flex-col justify-end md:justify-center gap-4 pointer-events-none z-20 ${alignmentClass} overflow-y-auto md:overflow-visible pb-16 md:pb-0`}>
            <div className="flex flex-col gap-4 p-4 md:p-0 items-center md:items-stretch pointer-events-none w-full">
              {activeHolograms.map((holo, idx) => {
                // Βοηθητική συνάρτηση για segmented progress bars (10 τμήματα)
                const getSegmentCount = (widthStr) => {
                  const pct = parseInt(widthStr) || 50;
                  return Math.round(pct / 10);
                };

                return (
                  <div
                    key={holo.id}
                    ref={(el) => (hologramRefs.current[holo.id] = el)}
                    className="relative z-20 flex flex-col pointer-events-auto w-full max-w-[310px] md:w-[300px] select-text transition-all duration-500 animate-fadeIn"
                    style={{ animationDelay: `${idx * 0.12}s` }}
                  >
                    <div className="relative p-4 bg-[#071118]/85 border border-cyan-500/30 rounded-lg backdrop-blur-xl shadow-2xl shadow-black/95 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all overflow-hidden group/card">
                      {/* Laser Scanline animation */}
                      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                        <div className="absolute w-full h-1/3 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent -top-full group-hover/card:animate-scanline" />
                      </div>

                      {/* Cybernetic Corner brackets */}
                      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400/80" />
                      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400/80" />
                      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400/80" />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400/80" />
                      
                      <div className="flex justify-between items-start mb-2 border-b border-cyan-500/20 pb-1.5">
                        <span className="text-[8px] font-mono text-cyan-400/85 tracking-widest">// DATA_STREAM_0{idx+1}</span>
                        <span className="text-[8px] font-mono text-gray-500">SEC_OK</span>
                      </div>

                      <h4 className="text-xs font-bold text-white tracking-wide flex items-center">
                        {holo.title}
                      </h4>
                      <h5 className="text-[9px] text-cyan-400/80 font-mono mt-0.5">{holo.subtitle}</h5>
                      
                      {holo.skillsList ? (
                        <div className="space-y-2.5 mt-2.5">
                          {holo.skillsList.map((skill, sIdx) => (
                            <div key={sIdx} className="text-[9px] font-mono">
                              <div className="flex justify-between text-gray-300">
                                <span>{skill.label}</span>
                                <span className="text-cyan-400 font-bold">{skill.level}</span>
                              </div>
                              {/* Segmented sci-fi bars */}
                              <div className="flex gap-0.5 mt-1">
                                {Array.from({ length: 10 }).map((_, segmentIdx) => {
                                  const isActive = segmentIdx < getSegmentCount(skill.width);
                                  return (
                                    <div 
                                      key={segmentIdx} 
                                      className="h-1.5 w-full rounded-[1px] transition-all duration-700" 
                                      style={{
                                        backgroundColor: isActive ? '#22d3ee' : '#09212b',
                                        boxShadow: isActive ? '0 0 5px rgba(34, 211, 238, 0.7)' : 'none',
                                        opacity: isActive ? 1 : 0.25,
                                        transitionDelay: `${segmentIdx * 0.05}s`
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-300 mt-2.5 leading-relaxed font-sans">
                          <TypewriterText text={holo.body} />
                        </p>
                      )}

                      {holo.url && (
                        <a
                          href={holo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[9px] text-cyan-400 font-mono mt-3 hover:text-cyan-300 hover:underline cursor-pointer group/link"
                        >
                          <span className="group-hover/link:translate-x-0.5 transition-transform">▸</span> OPEN LINK ↗
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div
          ref={centerLabelRef}
          className="absolute pointer-events-none select-none z-20 transition-opacity duration-500 flex flex-col items-center text-center gap-0.5"
          style={{ left: 0, top: 0 }}
        >
          <div className="w-14 h-14 rounded-full border border-purple-500/20 bg-purple-500/5 flex items-center justify-center mb-1">
            <span className="text-xl font-mono text-cyan-400 animate-pulse">&gt;_</span>
          </div>
          <span className="text-[9px] text-cyan-400 font-mono tracking-widest">USER_ID: CHRIS</span>
          <span className="text-[8px] text-purple-400 font-mono tracking-wider animate-pulse">STATUS: ONLINE</span>
        </div>

        <div
          className={`absolute pointer-events-none z-25 text-center transition-all duration-500 w-full ${activeNode ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'}`}
          style={{ top: '6%', left: '50%', transform: 'translateX(-50%)' }}
        >
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-widest uppercase mb-1">
            {t.bioTitle}
          </h1>
          <p className="text-[9px] text-cyan-400 font-mono tracking-widest animate-pulse">
            {'// MOVE MOUSE TO GRAVITATE • CLICK NODES TO EXPLORE'}
          </p>
        </div>

        {activeNode && (
          <button
            onClick={() => setActiveNode(null)}
            className="fixed top-6 right-6 md:top-8 md:right-8 z-30 px-5 py-2.5 bg-red-950/30 border border-red-500/40 hover:border-red-400 hover:bg-red-950/50 rounded-lg text-[10px] font-mono font-bold tracking-widest text-red-400 hover:text-red-300 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(239,68,68,0.35)] cursor-pointer pointer-events-auto flex items-center gap-1.5"
          >
            <span>✕</span> <span>[ ESC // CLOSE_CONNECTION ]</span>
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        
        @keyframes scanlineSweep {
          0% { top: -100%; }
          100% { top: 200%; }
        }
        .animate-scanline {
          animation: scanlineSweep 1.8s cubic-bezier(0.15, 0.85, 0.45, 1) infinite;
        }
      `}</style>
    </section>
  );
}