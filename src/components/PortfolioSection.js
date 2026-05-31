'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';

const CATEGORY_ICONS = {
  'american-football': '🏈',
  'football': '⚽',
  'landscaping': '🏔️',
  default: '📷'
};

// ============================================================
// Βοηθητικό: Animated SVG neural path
// ============================================================
function NeuralPath({ fromX, fromY, toX, toY, isActive }) {
  const id = `path-pf-${Math.round(toX)}-${Math.round(toY)}`;

  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isActive ? '#22d3ee' : '#a855f7'} stopOpacity={isActive ? 0.8 : 0.15} />
          <stop offset="100%" stopColor={isActive ? '#a855f7' : '#22d3ee'} stopOpacity={isActive ? 0.8 : 0.08} />
        </linearGradient>
      </defs>
      <line
        x1={`${fromX}%`} y1={`${fromY}%`}
        x2={`${toX}%`} y2={`${toY}%`}
        stroke={`url(#${id})`}
        strokeWidth={isActive ? 2 : 0.8}
        strokeDasharray={isActive ? 'none' : '5 8'}
        style={{
          transition: 'all 0.6s ease-in-out',
          filter: isActive ? 'drop-shadow(0 0 8px rgba(34,211,238,0.5))' : 'none',
        }}
      />
      {isActive && (
        <circle r="3" fill="#22d3ee" opacity="0.9">
          <animate attributeName="cx" from={`${fromX}%`} to={`${toX}%`} dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="cy" from={`${fromY}%`} to={`${toY}%`} dur="1.8s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
}

// ============================================================
// Βοηθητικό: Orbital Node
// ============================================================
function OrbitalNode({ category, isActive, onClick, pctX, pctY }) {
  const icon = CATEGORY_ICONS[category.id] || CATEGORY_ICONS.default;
  const count = category.images.length;

  return (
    <button
      onClick={() => onClick(category.id)}
      className={`
        absolute z-20 flex flex-col items-center gap-2 group cursor-pointer
        transition-all duration-500 ease-out
        ${isActive ? 'scale-110' : 'hover:scale-110'}
      `}
      style={{
        top: `${pctY}%`,
        left: `${pctX}%`,
        transform: `translate(-50%, -50%) ${isActive ? 'scale(1.1)' : ''}`,
      }}
    >
      <div className={`
        absolute w-16 h-16 rounded-full transition-all duration-500
        ${isActive
          ? 'bg-cyan-500/25 shadow-[0_0_35px_rgba(34,211,238,0.4)] scale-125'
          : 'bg-purple-500/5 group-hover:bg-purple-500/15 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]'
        }
      `} />

      <div className={`
        relative w-14 h-14 rounded-full flex items-center justify-center
        border-2 transition-all duration-500 backdrop-blur-sm
        ${isActive
          ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_25px_rgba(34,211,238,0.35)]'
          : 'border-purple-500/40 bg-[#0a0a0c]/80 group-hover:border-purple-400 group-hover:bg-purple-500/10'
        }
      `}>
        <span className="text-2xl select-none">{icon}</span>
        {/* Φούσκα με τον αριθμό των φωτογραφιών */}
        <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-purple-400">
          {count}
        </span>
      </div>

      <span className={`
        text-[10px] font-mono uppercase tracking-[0.15em] whitespace-nowrap
        transition-all duration-300 text-center select-none
        ${isActive ? 'text-cyan-400 font-bold' : 'text-gray-500 group-hover:text-gray-300'}
      `}>
        {category.title}
      </span>
    </button>
  );
}

// ============================================================
// Το Slideshow Panel
// ============================================================
function SlideshowPanel({ category, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const images = category.images;

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-play (5 δευτερόλεπτα), σταματάει αν ο χρήστης βάλει το ποντίκι πάνω στην εικόνα
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextImage();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextImage, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage, onClose]);

  // Mobile Swipe Logic
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true); // Σταματάμε το autoplay όταν αγγίζει την οθόνη
  };
  
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (diff > 50) {
      nextImage(); // Swipe Left (επόμενη)
    } else if (diff < -50) {
      prevImage(); // Swipe Right (προηγούμενη)
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  return (
    <>
      {/* Σκοτεινό Background */}
      <div 
        className="fixed inset-0 z-[40] bg-black/80 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      {/* Το Κεντρικό Panel (80% Desktop / 95% Mobile) */}
      <div 
        className="fixed z-[50] w-[95vw] md:w-[80vw] h-[85vh] bg-[#050508] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.15)] overflow-hidden flex flex-col animate-fadeInScale"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        {/* Header Panel */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0c]">
          <div>
            <h3 className="text-cyan-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              {category.title}
            </h3>
            <p className="text-gray-500 font-mono text-[10px]">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-red-500/80 flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Image Area */}
        <div 
          className="relative flex-1 w-full bg-black flex items-center justify-center group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Το Next.js Image component, φορτώνει μόνο όταν ανοίγει το panel */}
          <Image 
            key={images[currentIndex]} // Το key κάνει force re-render για το fade effect
            src={images[currentIndex]} 
            fill 
            className="object-contain animate-fadeIn" 
            alt={`${category.title} photo ${currentIndex + 1}`}
            sizes="(max-width: 768px) 95vw, 80vw"
            priority // Φορτώνει γρήγορα την πρώτη εικόνα της σειράς
          />

          {/* Προηγούμενη Φωτογραφία (Hover/Touch Button) */}
          <button 
            onClick={prevImage}
            className="absolute left-2 md:left-6 w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 hover:bg-cyan-500/40 hover:scale-110 transition-all active:scale-95 z-10"
          >
            ←
          </button>

          {/* Επόμενη Φωτογραφία (Hover/Touch Button) */}
          <button 
            onClick={nextImage}
            className="absolute right-2 md:right-6 w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 hover:bg-cyan-500/40 hover:scale-110 transition-all active:scale-95 z-10"
          >
            →
          </button>
          
          {/* Progress Bar στο κάτω μέρος της φωτογραφίας */}
          <div className="absolute bottom-0 left-0 h-1 bg-gray-800 w-full">
            <div 
              className="h-full bg-cyan-400 transition-all duration-500" 
              style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function PortfolioSection({ categories }) {
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  // Αν δεν υπάρχουν δεδομένα (δεν έχει ανεβάσει φωτογραφίες ακόμα)
  if (!categories || categories.length === 0) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#050508] font-mono text-cyan-500">
        <span className="text-4xl mb-4">📷</span>
        <p>No portfolios found.</p>
        <p className="text-xs text-gray-500 mt-2">Add folders with images to public/images/portfolio/</p>
      </div>
    );
  }

  // Δυναμική κατανομή θέσεων των κόμβων γύρω από το κέντρο σε κύκλο (Orbit)
  const radius = 35; // % της οθόνης
  const angleStep = (Math.PI * 2) / categories.length;
  
  const nodesWithPositions = categories.map((cat, index) => {
    // Υπολογισμός γωνίας ώστε να ξεκινάει από πάνω (Math.PI / 2)
    const angle = index * angleStep - Math.PI / 2;
    return {
      ...cat,
      pctX: 50 + radius * Math.cos(angle),
      pctY: 50 + radius * Math.sin(angle)
    };
  });

  const activeCategory = categories.find(c => c.id === activeCategoryId);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden font-sans bg-[#050508]">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-[120px]" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-5xl h-[85vh] mx-4">
        {/* SVG Neural Paths */}
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ${activeCategoryId ? 'opacity-10' : 'opacity-100'}`}
          style={{ zIndex: 1 }}
        >
          {nodesWithPositions.map((node) => (
            <NeuralPath
              key={node.id}
              fromX={50}
              fromY={50}
              toX={node.pctX}
              toY={node.pctY}
              isActive={activeCategoryId === node.id}
            />
          ))}
        </svg>

        {/* Center Hub */}
        <div
          className={`absolute z-10 flex flex-col items-center transition-all duration-500 ${activeCategoryId ? 'opacity-0 scale-90' : 'opacity-100'}`}
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="absolute w-44 h-44 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative w-28 h-28 border-2 border-cyan-500/40 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <span className="text-4xl">📸</span>
          </div>

          <div className="mt-4 text-center">
            <h1 className="text-xl font-bold text-white tracking-widest">GALLERY HUB</h1>
            <p className="text-[10px] text-gray-500 font-mono mt-1 animate-pulse">
              {'// SELECT A MODULE'}
            </p>
          </div>
        </div>

        {/* Orbital Nodes */}
        {nodesWithPositions.map((node) => (
          <OrbitalNode
            key={node.id}
            category={node}
            isActive={activeCategoryId === node.id}
            onClick={setActiveCategoryId}
            pctX={node.pctX}
            pctY={node.pctY}
          />
        ))}

      </div>

      {/* Το Slideshow Modal ανοίγει εδώ */}
      {activeCategory && (
        <SlideshowPanel
          category={activeCategory}
          onClose={() => setActiveCategoryId(null)}
        />
      )}

      {/* Global Animations CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />
    </section>
  );
}
