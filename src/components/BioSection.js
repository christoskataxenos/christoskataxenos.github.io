'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

// ============================================================
// Βοηθητικό: Animated SVG neural path μεταξύ δύο σημείων
// Σκοπός: Οπτικοποίηση σύνδεσης avatar → node
// ============================================================
function NeuralPath({ fromX, fromY, toX, toY, isActive }) {
  const id = `path-${Math.round(toX)}-${Math.round(toY)}`;

  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isActive ? '#22d3ee' : '#a855f7'} stopOpacity={isActive ? 0.8 : 0.15} />
          <stop offset="100%" stopColor={isActive ? '#a855f7' : '#22d3ee'} stopOpacity={isActive ? 0.8 : 0.08} />
        </linearGradient>
      </defs>
      <line
        x1={fromX} y1={fromY}
        x2={toX} y2={toY}
        stroke={`url(#${id})`}
        strokeWidth={isActive ? 2 : 0.8}
        strokeDasharray={isActive ? 'none' : '5 8'}
        style={{
          transition: 'all 0.6s ease-in-out',
          filter: isActive ? 'drop-shadow(0 0 8px rgba(34,211,238,0.5))' : 'none',
        }}
      />
      {/* Animated signal dot κατά μήκος του path */}
      {isActive && (
        <>
          <circle r="3" fill="#22d3ee" opacity="0.9">
            <animate
              attributeName="cx"
              from={fromX} to={toX}
              dur="1.8s" repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              from={fromY} to={toY}
              dur="1.8s" repeatCount="indefinite"
            />
          </circle>
          <circle r="6" fill="#22d3ee" opacity="0.2">
            <animate
              attributeName="cx"
              from={fromX} to={toX}
              dur="1.8s" repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              from={fromY} to={toY}
              dur="1.8s" repeatCount="indefinite"
            />
          </circle>
        </>
      )}
    </g>
  );
}

// ============================================================
// Βοηθητικό: Orbital node κουμπί
// Σκοπός: Interactive κόμβος γύρω από τον avatar
// ============================================================
function OrbitalNode({ id, icon, label, isActive, onClick, style }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`
        absolute z-20 flex flex-col items-center gap-2 group cursor-pointer
        transition-all duration-500 ease-out
        ${isActive ? 'scale-110' : 'hover:scale-110'}
      `}
      style={{
        ...style,
        transform: `translate(-50%, -50%) ${isActive ? 'scale(1.1)' : ''}`,
      }}
      aria-label={`View ${label}`}
    >
      {/* Outer glow */}
      <div className={`
        absolute w-16 h-16 rounded-full transition-all duration-500
        ${isActive
          ? 'bg-cyan-500/25 shadow-[0_0_35px_rgba(34,211,238,0.4)] scale-125'
          : 'bg-purple-500/5 group-hover:bg-purple-500/15 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]'
        }
      `} />

      {/* Node circle */}
      <div className={`
        relative w-14 h-14 rounded-full flex items-center justify-center
        border-2 transition-all duration-500 backdrop-blur-sm
        ${isActive
          ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_25px_rgba(34,211,238,0.35)]'
          : 'border-purple-500/40 bg-[#0a0a0c]/80 group-hover:border-purple-400 group-hover:bg-purple-500/10'
        }
      `}>
        <span className="text-xl select-none">{icon}</span>
      </div>

      {/* Label */}
      <span className={`
        text-[9px] font-mono uppercase tracking-[0.15em] whitespace-nowrap
        transition-all duration-300 max-w-[120px] text-center leading-tight select-none
        ${isActive ? 'text-cyan-400 font-bold' : 'text-gray-500 group-hover:text-gray-300'}
      `}>
        {label}
      </span>

      {/* Active ping animation */}
      {isActive && (
        <div className="absolute w-14 h-14 rounded-full border border-cyan-400/40 animate-ping" />
      )}
    </button>
  );
}

// ============================================================
// Detail Panel: Expanded content overlay
// Σκοπός: Εμφάνιση λεπτομερειών κάθε section
// ============================================================
function DetailPanel({ activeNode, t, onClose }) {
  if (!activeNode) return null;

  const panelContent = {
    experience: (
      <div className="space-y-5">
        {/* Research & Development */}
        <div className="border-l-2 border-cyan-400/50 pl-4">
          <h4 className="text-white font-semibold text-sm">{t.roles.researchDev.title}</h4>
          <p className="text-[10px] text-cyan-500/70 mb-1.5 font-mono">{t.roles.researchDev.date}</p>
          <p className="text-xs text-gray-400 italic leading-relaxed">{t.roles.researchDev.description}</p>
        </div>
        {/* Technician */}
        <div className="border-l-2 border-purple-500/50 pl-4">
          <h4 className="text-white font-semibold text-sm">{t.roles.technician.title}</h4>
          <p className="text-[10px] text-gray-500 mb-1.5 font-mono">{t.roles.technician.dateLocation}</p>
          <ul className="list-disc list-inside text-xs text-gray-400 space-y-0.5 ml-1">
            {t.roles.technician.responsibilitiesList?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        {/* Security */}
        <div className="border-l-2 border-gray-700 pl-4">
          <h4 className="text-white font-semibold text-sm">{t.roles.security.title}</h4>
          <p className="text-[10px] text-gray-500 mb-1.5 font-mono">{t.roles.security.date}</p>
          <p className="text-xs text-gray-400 leading-relaxed">{t.roles.security.description}</p>
        </div>
      </div>
    ),

    projects: (
      <div className="space-y-3">
        {t.roles.researchDev.projects?.map((project, i) => (
          <a
            key={i}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-cyan-500/5 border border-cyan-500/15 rounded-lg p-3 hover:bg-cyan-500/10 hover:border-cyan-400/30 transition-all group/link"
          >
            <span className="text-cyan-400 font-mono text-xs font-bold block mb-1 group-hover/link:text-cyan-300 transition-colors">
              ▸ {project.name}
              <span className="text-gray-600 text-[9px] ml-2 group-hover/link:text-cyan-500/70">↗ GitHub</span>
            </span>
            <span className="text-gray-400 text-xs leading-relaxed">{project.desc}</span>
          </a>
        ))}
      </div>
    ),

    education: (
      <div className="space-y-4">
        <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
          <div>
            <span className="text-white font-medium block text-sm">{t.education.university}</span>
            <span className="text-xs text-gray-300 italic">{t.education.degree}</span>
          </div>
          <span className="text-xs text-cyan-500/70 font-mono">2025</span>
        </div>
        <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
          <div>
            <span className="text-white font-medium block text-sm">{t.education.iek}</span>
            <span className="text-xs text-gray-300 italic">{t.education.iekDegree}</span>
          </div>
          <span className="text-xs text-gray-500 font-mono">2008-2010</span>
        </div>
      </div>
    ),

    skills: (
      <div className="space-y-4">
        {t.skillGroups && Object.entries(t.skillGroups).map(([key, group]) => (
          <div key={key}>
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 border-b border-white/5 pb-1">
              {group.title}
            </h4>
            <div className="space-y-2">
              {group.skills?.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-mono text-gray-300 mb-0.5">
                    <span>{skill.label}</span>
                    <span className={`
                      ${skill.level === 'Loading...' || skill.level === 'Exploring' ? 'text-purple-400 animate-pulse' : ''}
                      ${skill.level === 'Intermediate' ? 'text-cyan-400' : ''}
                      ${skill.level === 'Production Ready' ? 'text-green-400' : ''}
                    `}>
                      {skill.level}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800/50 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)] transition-all duration-1000 ease-out rounded-full"
                      style={{ width: skill.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),

    interests: (
      <div className="grid grid-cols-2 gap-3">
        {['PHOTOGRAPHY', 'GAMING', 'TRAVELLING', 'CUSTOM RIGS'].map((interest, i) => (
          <span
            key={i}
            className="flex justify-center items-center text-center px-3 py-2.5 text-[10px] font-bold tracking-wider text-cyan-400 uppercase bg-gray-900/60 border border-cyan-500/30 rounded-full hover:bg-cyan-500/20 hover:border-cyan-400 hover:scale-105 transition-all cursor-default font-mono"
          >
            {interest}
          </span>
        ))}
      </div>
    ),
  };

  const titles = {
    experience: t.experienceTitle,
    projects: t.roles.researchDev.projectsLabel?.replace(':', '') || 'Projects',
    education: t.educationTitle,
    skills: t.skillsTitle,
    interests: t.interestsTitle || 'Interests',
  };

  return (
    <>
      {/* Backdrop dim - κλείνει πατώντας έξω */}
      <div
        className="absolute inset-0 z-[25] bg-black/30 backdrop-blur-[2px] animate-fadeIn"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="detail-panel absolute z-30 w-[360px] max-h-[400px] overflow-y-auto bg-[#08080c]/95 backdrop-blur-xl border border-cyan-500/25 rounded-xl shadow-[0_0_50px_rgba(34,211,238,0.12),0_0_100px_rgba(168,85,247,0.08)] p-6 animate-fadeInScale"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Corner accent lines */}
        <div className="absolute -top-[1px] -left-[1px] w-5 h-5 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-xl" />
        <div className="absolute -bottom-[1px] -right-[1px] w-5 h-5 border-b-2 border-r-2 border-cyan-400/60 rounded-br-xl" />
        <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t border-r border-purple-500/40 rounded-tr-lg" />
        <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b border-l border-purple-500/40 rounded-bl-lg" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            {titles[activeNode]}
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-700 text-gray-500 hover:text-cyan-400 hover:border-cyan-400/50 transition-all text-sm leading-none"
            aria-label="Close panel"
          >
            ×
          </button>
        </div>

        {/* Content */}
        {panelContent[activeNode]}

        {/* Footer hint */}
        <div className="mt-4 pt-3 border-t border-white/5 text-center">
          <span className="text-[9px] text-gray-600 font-mono">ESC or click outside to close</span>
        </div>
      </div>
    </>
  );
}

// ============================================================
// MAIN COMPONENT: Neural Network Bio
// Σκοπός: Interactive single-screen bio σε μορφή neural network
// ============================================================
export default function BioSection() {
  const { t } = useLanguage();
  const [activeNode, setActiveNode] = useState(null);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ w: 900, h: 600 });

  // Μέτρηση πραγματικού μεγέθους container για SVG coords
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ w: rect.width, h: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Κλείσιμο panel με Escape
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

  // Node positions σε ποσοστά (%) — orbit pattern γύρω από center
  const nodeDefinitions = [
    { id: 'experience', icon: '💼', label: t.experienceTitle, pctX: 22, pctY: 20 },
    { id: 'projects',   icon: '🚀', label: 'Projects',       pctX: 78, pctY: 20 },
    { id: 'education',  icon: '🎓', label: t.educationTitle,  pctX: 15, pctY: 75 },
    { id: 'skills',     icon: '⚡', label: t.skillsTitle,     pctX: 85, pctY: 75 },
    { id: 'interests',  icon: '🎮', label: t.interestsTitle || 'Interests', pctX: 50, pctY: 90 },
  ];

  // Center coords σε pixels (για SVG)
  const cx = containerSize.w * 0.5;
  const cy = containerSize.h * 0.48;

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden font-sans">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Main neural network container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl h-[85vh] max-h-[750px] mx-4"
      >
        {/* SVG layer — neural paths */}
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ${activeNode ? 'opacity-20' : 'opacity-100'}`}
          style={{ zIndex: 1 }}
          viewBox={`0 0 ${containerSize.w} ${containerSize.h}`}
          preserveAspectRatio="none"
        >
          {nodeDefinitions.map((node) => (
            <NeuralPath
              key={node.id}
              fromX={cx}
              fromY={cy}
              toX={containerSize.w * node.pctX / 100}
              toY={containerSize.h * node.pctY / 100}
              isActive={activeNode === node.id}
            />
          ))}

          {/* Interconnection lines between adjacent nodes (subtle) */}
          <line
            x1={containerSize.w * 0.22} y1={containerSize.h * 0.20}
            x2={containerSize.w * 0.78} y2={containerSize.h * 0.20}
            stroke="rgba(168,85,247,0.06)" strokeWidth="0.5" strokeDasharray="3 8"
          />
          <line
            x1={containerSize.w * 0.15} y1={containerSize.h * 0.75}
            x2={containerSize.w * 0.85} y2={containerSize.h * 0.75}
            stroke="rgba(168,85,247,0.06)" strokeWidth="0.5" strokeDasharray="3 8"
          />
        </svg>

        {/* ====== CENTER HUB: Avatar ====== */}
        <div
          className={`absolute z-10 flex flex-col items-center transition-all duration-500 ${activeNode ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100'}`}
          style={{ top: '48%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          {/* Outer ambient glow */}
          <div className="absolute w-44 h-44 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />

          {/* Hexagonal avatar */}
          <div className="relative w-32 h-32 transition-all duration-500 hover:scale-105 cursor-default">
            <div
              className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-[2px]"
              style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            >
              <div
                className="w-full h-full bg-[#0a0a0c] flex items-center justify-center"
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
              >
                <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center text-center p-3">
                  <span className="text-3xl mb-1">👨‍💻</span>
                  <span className="text-cyan-400 font-mono text-[9px]">USER_ID: CHRIS</span>
                  <span className="text-purple-400 font-mono text-[8px]">STATUS: ONLINE</span>
                </div>
              </div>
            </div>

            {/* Scanning text */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-cyan-500/50 font-mono animate-bounce">
              SCANNING...
            </div>
          </div>

          {/* Name & instruction */}
          <div className="mt-4 text-center">
            <h1 className="text-xl font-bold text-white tracking-wide">CHRISTOS KATAXENOS</h1>
            <p className="text-[10px] text-gray-500 font-mono mt-1 animate-pulse">
              {'// CLICK A NODE TO BEGIN'}
            </p>
          </div>
        </div>

        {/* ====== ORBITAL NODES ====== */}
        {nodeDefinitions.map((node) => (
          <OrbitalNode
            key={node.id}
            id={node.id}
            icon={node.icon}
            label={node.label}
            isActive={activeNode === node.id}
            onClick={handleNodeClick}
            style={{
              top: `${node.pctY}%`,
              left: `${node.pctX}%`,
            }}
          />
        ))}

        {/* ====== DETAIL PANEL ====== */}
        {activeNode && (
          <DetailPanel
            activeNode={activeNode}
            t={t}
            onClose={() => setActiveNode(null)}
          />
        )}
      </div>

      {/* ====== Injected CSS Animations ====== */}
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
}