'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ScrollProgressIndicator() {
  const [activeSection, setActiveSection] = useState('hero');
  const pathname = usePathname();

  useEffect(() => {
    const sections = ['hero', 'bio', 'blog', 'portfolio'];
    const observerOptions = {
      root: null, // viewport
      rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle 50% of viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  if (pathname !== '/') {
    return null;
  }

  return (
    <div className="scroll-progress-indicator">
      <Link href="#hero" className={`indicator ${activeSection === 'hero' ? 'active' : ''}`} aria-label="Go to Hero Section"></Link>
      <Link href="#bio" className={`indicator ${activeSection === 'bio' ? 'active' : ''}`} aria-label="Go to Biography Section"></Link>
      <Link href="#blog" className={`indicator ${activeSection === 'blog' ? 'active' : ''}`} aria-label="Go to Dev Blog Section"></Link>
      <Link href="#portfolio" className={`indicator ${activeSection === 'portfolio' ? 'active' : ''}`} aria-label="Go to Photography Section"></Link>

      <style jsx>{`
        .scroll-progress-indicator {
          position: fixed;
          right: 2.5rem;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          z-index: 999;
        }

        .indicator {
          display: block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.2); /* Faint white */
          border: 1px solid transparent;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .indicator:hover {
          background-color: #7f5af0;
          box-shadow: 0 0 10px rgba(127, 90, 240, 0.6);
        }

        .indicator.active {
          background-color: #7f5af0;
          box-shadow: 0 0 15px rgba(127, 90, 240, 0.8), 0 0 5px rgba(255, 255, 255, 0.5);
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .scroll-progress-indicator {
            display: none; /* Hide on mobile */
          }
        }
      `}</style>
    </div>
  );
}
