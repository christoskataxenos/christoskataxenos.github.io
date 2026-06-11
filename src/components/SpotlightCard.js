'use client';

import { useRef } from 'react';

export default function SpotlightCard({ children, href, className = "" }) {
  const divRef = useRef(null);
  const spotlightRef = useRef(null); // Ref for direct DOM manipulation to avoid state re-renders

  const handleMouseMove = (e) => {
    if (!divRef.current || !spotlightRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Direct DOM styling updates the gradient position on every frame at 120Hz without React re-renders
    spotlightRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(127, 90, 240, 0.15), transparent 40%)`;
  };

  const handleFocus = () => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = '1';
  };

  const handleBlur = () => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
  };

  const handleMouseEnter = () => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
  };

  return (
    <a
      href={href}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative flex flex-col items-center justify-center gap-6 p-6
        w-full md:w-[300px] h-[200px]
        bg-gray-900/50 backdrop-blur-md border border-purple-500/30 rounded-xl
        text-decoration-none overflow-hidden transition-all duration-300 ease-in-out
        hover:scale-105 shadow-lg shadow-[0_0_20px_rgba(168,85,247,0.3)] ${className}
      `}
    >
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
        style={{
          opacity: 0,
          background: `radial-gradient(600px circle at 0px 0px, rgba(127, 90, 240, 0.15), transparent 40%)`,
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        {children}
      </div>
    </a>
  );
}
