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
      className={`spotlight-card ${className}`}
    >
      <div
        className="spotlight-overlay"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(127, 90, 240, 0.15), transparent 40%)`,
        }}
      />
      <div 
        className="spotlight-border"
        style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(127, 90, 240, 0.6), transparent 40%)`,
        }}
      />
      <div className="card-content">{children}</div>

      <style jsx>{`
        .spotlight-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          width: 300px;
          height: 400px;
          background: rgba(20, 20, 23, 0.6); /* Slightly darker base */
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          text-decoration: none;
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .spotlight-card:hover {
            transform: scale(1.02);
        }

        /* The inner glow content */
        .spotlight-overlay {
          pointer-events: none;
          position: absolute;
          inset: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

        /* The glowing border effect */
        .spotlight-border {
            pointer-events: none;
            position: absolute;
            inset: -1px; /* Hug the border */
            border-radius: inherit;
            padding: 1px; /* Thickness of the border glow */
            background: radial-gradient(600px circle at var(--x) var(--y), rgba(127, 90, 240, 0.6), transparent 40%); 
            z-index: 2;
            mask: 
                linear-gradient(#fff 0 0) content-box, 
                linear-gradient(#fff 0 0);
            mask-composite: xor;
            mask-composite: exclude;
        }

        .card-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
      `}</style>
    </a>
  );
}
