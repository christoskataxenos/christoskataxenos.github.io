'use client';

import { useRef, useState } from 'react';

export default function SpotlightCard({ children, href, className = "" }) {
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
        w-full md:w-[300px] h-[400px]
        bg-gray-900/50 backdrop-blur-md border border-purple-500/30 rounded-xl
        text-decoration-none overflow-hidden transition-all duration-300 ease-in-out
        hover:scale-105 shadow-lg shadow-[0_0_20px_rgba(168,85,247,0.3)] ${className}
      `}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(127, 90, 240, 0.15), transparent 40%)`,
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        {children}
      </div>
    </a>
  );
}
