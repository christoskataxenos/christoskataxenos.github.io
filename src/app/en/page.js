'use client';

import HeroTitle from '../../components/HeroTitle';
import { useLanguage } from '../../context/LanguageContext';
import SpotlightCard from '../../components/SpotlightCard';
import { useRef, useEffect } from 'react';
import { FaUser, FaTerminal, FaCamera } from 'react-icons/fa';

export default function EnHomePage() {
  const { t, setLanguage } = useLanguage();

  useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Section 1: Hero */}
      <section id="hero" className="section hero-section mb-16">
        <div 
          className="hero-content relative p-8 md:p-12 rounded-2xl bg-gray-900/50 backdrop-blur-md border border-purple-500/30 shadow-lg mx-auto max-w-4xl overflow-hidden" 
          ref={divRef} 
          onMouseMove={handleMouseMove} 
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={heroSpotlightRef}
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 z-0" 
            style={{
              background: `radial-gradient(600px circle at 0px 0px, rgba(168, 85, 247, 0.15), transparent 40%)`,
            }}
          />
          <div className="relative z-10 text-center">
            <HeroTitle />
          </div>
          <p className="hero-description relative z-10 max-w-3xl mx-auto mt-6 text-gray-300 text-sm md:text-base leading-relaxed font-['Courier_New',_Courier,_monospace]"> 
            {t.heroDescription}
          </p>
        </div>
      </section>

      {/* Section for Cards */}
      <section id="cards-section" className="section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <SpotlightCard href="/en/bio" className="h-full" iconType="user">
              <span className="card-title font-mono uppercase tracking-widest">{t.bioTitle}</span>
            </SpotlightCard>
            
            <SpotlightCard href="/en/blog" className="h-full" iconType="terminal">
              <span className="card-title font-mono uppercase tracking-widest">{t.blogTitle}</span>
            </SpotlightCard>
            
            <SpotlightCard href="/en/portfolio" className="h-full" iconType="camera">
              <span className="card-title font-mono uppercase tracking-widest">{t.photoTitle}</span>
            </SpotlightCard>
          </div>
        </div>
      </section>
    </div>
  );
}
