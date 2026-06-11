'use client';

import HeroTitle from '../components/HeroTitle';
import { useLanguage } from '../context/LanguageContext';
import SpotlightCard from '../components/SpotlightCard';
import { useRef } from 'react'; // Import useRef
import { FaUser, FaTerminal, FaCamera } from 'react-icons/fa'; // Import icons from react-icons/fa

export default function Home() {
  const { t } = useLanguage();

  // Logic for the hover effect on hero-content (Refs to avoid state re-renders)
  const divRef = useRef(null);
  const heroSpotlightRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!divRef.current || !heroSpotlightRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    heroSpotlightRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(127, 90, 240, 0.15), transparent 40%)`;
  };

  const handleFocus = () => {
    if (heroSpotlightRef.current) heroSpotlightRef.current.style.opacity = '1';
  };

  const handleBlur = () => {
    if (heroSpotlightRef.current) heroSpotlightRef.current.style.opacity = '0';
  };

  const handleMouseEnter = () => {
    if (heroSpotlightRef.current) heroSpotlightRef.current.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    if (heroSpotlightRef.current) heroSpotlightRef.current.style.opacity = '0';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4"> {/* New container for overall centering */}
      {/* Section 1: Hero */}
      <section id="hero" className="section hero-section mb-16">
        <div 
          className="hero-content relative p-8 md:p-12 rounded-2xl bg-black/30 backdrop-blur-lg border border-white/10 shadow-xl mx-auto max-w-4xl overflow-hidden" 
          ref={divRef} 
          onMouseMove={handleMouseMove} 
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Spotlight Overlay for hero-content (optimized with refs) */}
          <div
            ref={heroSpotlightRef}
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0" 
            style={{
              opacity: 0,
              background: `radial-gradient(600px circle at 0px 0px, rgba(127, 90, 240, 0.15), transparent 40%)`,
            }}
          />
          <div className="relative z-10 text-center">
            <HeroTitle />
          </div>
          <p className="hero-description relative z-10 max-w-2xl mx-auto mt-4 text-white text-lg"> 
            {t.heroDescription}
          </p>
        </div>
      </section>

      {/* Section for Cards */}
      <section id="cards-section" className="section"> {/* Removed mt-24, now handled by overall flex gap */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <SpotlightCard href="/bio" className="h-full">
              <FaUser className="text-5xl text-gray-600 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300 ease-in-out group-hover:scale-110" />
              <span className="card-title font-mono uppercase tracking-widest">{t.bioTitle}</span>
            </SpotlightCard>
            
            <SpotlightCard href="/blog" className="h-full">
              <FaTerminal className="text-5xl text-gray-600 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300 ease-in-out group-hover:scale-110" />
              <span className="card-title font-mono uppercase tracking-widest">{t.blogTitle}</span>
            </SpotlightCard>
            
            <SpotlightCard href="/portfolio" className="h-full">
              <FaCamera className="text-5xl text-gray-600 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300 ease-in-out group-hover:scale-110" />
              <span className="card-title font-mono uppercase tracking-widest">{t.photoTitle}</span>
            </SpotlightCard>
          </div>
        </div>
      </section>
    </div>
  );
}