'use client';

import HeroTitle from '../components/HeroTitle';
import { useLanguage } from '../context/LanguageContext';
import SpotlightCard from '../components/SpotlightCard';
import { useRef, useState } from 'react'; // Import useRef and useState
import { FaUser, FaTerminal, FaCamera } from 'react-icons/fa'; // Import icons from react-icons/fa

export default function Home() {
  const { t } = useLanguage();

  // Logic for the hover effect on hero-content
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div className="scroll-container">
      {/* Section 1: Hero */}
      <section id="hero" className="section hero-section">
        <div 
          className="hero-content relative p-8 md:p-12 rounded-2xl bg-black/30 backdrop-blur-lg border border-white/10 shadow-xl mx-auto max-w-4xl overflow-hidden" // Added relative and overflow-hidden
          ref={divRef} // Added ref
          onMouseMove={handleMouseMove} // Added event handlers
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Spotlight Overlay for hero-content */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0" //z-0 so text is above
            style={{
              opacity,
              background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(127, 90, 240, 0.15), transparent 40%)`,
            }}
          />
          <HeroTitle />
          <p className="hero-description relative z-10 max-w-2xl mx-auto mt-4 text-white text-lg"> {/* Added relative z-10 */}
            {t.heroDescription}
          </p>
        </div>
        <div className="scroll-down-indicator">
          <span></span>
        </div>
      </section>

      {/* Section 2: Biography */}
      <section id="bio" className="section content-section">
        <div className="card-wrapper">
          <SpotlightCard href="/bio">
            <FaUser className="text-5xl text-gray-600 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300 ease-in-out group-hover:scale-110" />
            <span className="card-title font-mono uppercase tracking-widest">{t.bioTitle}</span>
          </SpotlightCard>
          <p className="code-caption">{'//'} {t.bioCaption}</p>
        </div>
      </section>

      {/* Section 3: Dev Blog */}
      <section id="blog" className="section content-section">
        <div className="card-wrapper">
          <SpotlightCard href="/blog">
            <FaTerminal className="text-5xl text-gray-600 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300 ease-in-out group-hover:scale-110" />
            <span className="card-title font-mono uppercase tracking-widest">{t.blogTitle}</span>
          </SpotlightCard>
          <p className="code-caption">{'//'} {t.blogCaption}</p>
        </div>
      </section>

      {/* Section 4: Photography Portfolio */}
      <section id="portfolio" className="section content-section">
        <div className="card-wrapper">
          <SpotlightCard href="/portfolio">
            <FaCamera className="text-5xl text-gray-600 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300 ease-in-out group-hover:scale-110" />
            <span className="card-title font-mono uppercase tracking-widest">{t.photoTitle}</span>
          </SpotlightCard>
          <p className="code-caption">{'//'} {t.photoCaption}</p>
        </div>
      </section>

    </div>
  );
}