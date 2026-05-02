'use client';

import React, { useRef, useState, useEffect } from 'react';

/**
 * MagneticText Component
 * A lightweight, high-performance magnetic effect using React hooks and CSS transforms.
 * Demonstrates low-level DOM manipulation for smooth UI interactions.
 */
export default function MagneticText({ children, strength = 0.3, className = "" }) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Distance from center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Check if mouse is within a reasonable distance (e.g., 200px)
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      
      if (distance < 250) {
        // Apply magnetic pull
        setPosition({
          x: deltaX * strength,
          y: deltaY * strength,
        });
      } else {
        // Return to origin
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [strength]);

  const transformStyle = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition: position.x === 0 ? 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' : 'transform 0.3s ease-out',
    display: 'inline-block',
    willChange: 'transform',
  };

  return (
    <span ref={containerRef} style={transformStyle} className={className}>
      {children}
    </span>
  );
}
