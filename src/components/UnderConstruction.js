/**
 * UnderConstruction Component
 * Σκοπός: Bilingual placeholder για σελίδες υπό κατασκευή (π.χ. /portfolio).
 * Λειτουργία: Animated circuit badge, typewriter status line, status pill,
 *             staggered fade-in — όλα με inaktive στα prefers-reduced-motion.
 * Δεδομένα: t.underConstruction (context) ή props (title, subtitle, status,
 *           description, ctaLabel) για reuse σε άλλες σελίδες.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { FaCamera } from 'react-icons/fa';

export default function UnderConstruction({
  title,
  subtitle,
  status,
  description,
  ctaLabel,
}) {
  const { t, language } = useLanguage();
  const copy = t.underConstruction || {};

  const pageTitle = title ?? copy.title;
  const pageSubtitle = subtitle ?? copy.subtitle;
  const statusText = status ?? copy.status;
  const descriptionText = description ?? copy.description;
  const ctaText = ctaLabel ?? copy.ctaLabel;
  const homeHref = language === 'el' ? '/' : '/en';

  // Typewriter status line: instant text under prefers-reduced-motion.
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (!statusText) return undefined;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let i = 0;
    const step = () => {
      // Reduced motion: reveal the full line on the first tick.
      i += reduced ? statusText.length : 1;
      setTyped(statusText.slice(0, i));
      if (i >= statusText.length) clearInterval(timer);
    };
    const timer = setInterval(step, reduced ? 0 : 40);

    return () => clearInterval(timer);
  }, [statusText]);

  return (
    <div className="scroll-container">
      <section className="section hero-section">
        <div className="hero-content uc-stack" style={{ gap: '1.5rem' }}>
          {/* Circuit badge with floating camera icon */}
          <div className="uc-badge uc-fade-1">
            <svg
              className="uc-circuit"
              viewBox="0 0 200 200"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="100" cy="100" r="88" className="uc-ring" />
              <circle cx="100" cy="100" r="70" className="uc-ring uc-ring-2" />
              <path d="M100 12 v26" className="uc-wire" />
              <path d="M100 162 v26" className="uc-wire uc-wire-2" />
              <path d="M12 100 h26" className="uc-wire uc-wire-3" />
              <path d="M162 100 h26" className="uc-wire uc-wire-4" />
              <path d="M38 38 l18 18" className="uc-wire uc-wire-2" />
              <path d="M162 38 l-18 18" className="uc-wire uc-wire-4" />
              <path d="M38 162 l18 -18" className="uc-wire uc-wire-3" />
              <path d="M162 162 l-18 -18" className="uc-wire" />
              <circle cx="100" cy="12" r="4" className="uc-node" />
              <circle cx="100" cy="188" r="4" className="uc-node uc-node-2" />
              <circle cx="12" cy="100" r="4" className="uc-node uc-node-3" />
              <circle cx="188" cy="100" r="4" className="uc-node uc-node-4" />
              <circle cx="38" cy="38" r="4" className="uc-node uc-node-2" />
              <circle cx="162" cy="38" r="4" className="uc-node uc-node-3" />
              <circle cx="38" cy="162" r="4" className="uc-node uc-node-4" />
              <circle cx="162" cy="162" r="4" className="uc-node" />
            </svg>
            <div className="uc-badge-icon">
              <FaCamera />
            </div>
          </div>

          {/* Title + subtitle */}
          <h1 className="uc-title uc-fade-2">{pageTitle}</h1>
          {pageSubtitle && (
            <p className="uc-subtitle uc-fade-3">{'// '}{pageSubtitle}</p>
          )}

          {/* Amber status pill */}
          <div className="uc-pill uc-fade-4">
            <span className="uc-dot" />
            <span className="uc-pill-text">{copy.badge}</span>
          </div>

          {/* Typewriter status line */}
          <p className="uc-status uc-fade-5">
            <span className="uc-status-prompt">&gt; // </span>
            {typed}
            <span className="uc-caret" />
          </p>

          {/* Description */}
          <p className="uc-description uc-fade-6">{descriptionText}</p>

          {/* CTA */}
          <Link href={homeHref} className="uc-cta uc-fade-7">
            <span>← {ctaText}</span>
          </Link>
        </div>
      </section>

      <style jsx>{`
        .uc-stack {
          max-width: 640px;
          margin: 0 auto;
          text-align: center;
        }

        /* --- Circuit badge --- */
        .uc-badge {
          position: relative;
          width: 180px;
          height: 180px;
          margin: 0 auto;
        }
        .uc-circuit {
          width: 100%;
          height: 100%;
        }
        .uc-ring {
          stroke: rgba(127, 90, 240, 0.25);
          stroke-width: 1;
        }
        .uc-ring-2 {
          stroke-dasharray: 4 10;
          animation: uc-dash 20s linear infinite;
        }
        .uc-wire {
          stroke: rgba(127, 90, 240, 0.5);
          stroke-width: 2;
          stroke-dasharray: 6 10;
          animation: uc-dash 2.5s linear infinite;
        }
        .uc-wire-2 { animation-delay: 0.3s; }
        .uc-wire-3 { animation-delay: 0.6s; }
        .uc-wire-4 { animation-delay: 0.9s; }
        .uc-node {
          fill: #7f5af0;
          animation: uc-node-pulse 2.5s ease-in-out infinite;
        }
        .uc-node-2 { animation-delay: 0.4s; }
        .uc-node-3 { animation-delay: 0.8s; }
        .uc-node-4 { animation-delay: 1.2s; }

        .uc-badge-icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 56px;
          color: #7f5af0;
          filter: drop-shadow(0 0 15px rgba(127, 90, 240, 0.4));
          animation: uc-float 3s ease-in-out infinite;
        }

        /* --- Text --- */
        .uc-title {
          font-size: clamp(2rem, 6vw, 3.5rem);
          font-weight: 700;
          color: #7f5af0;
          text-shadow: 0 0 20px rgba(127, 90, 240, 0.6);
          margin: 0;
        }
        .uc-subtitle {
          font-family: var(--font-mono, 'Courier New', monospace);
          font-size: 0.9rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #94a1b2;
          margin: 0;
        }

        /* --- Status pill --- */
        .uc-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.45rem 1.2rem;
          border: 1px solid rgba(251, 191, 36, 0.45);
          border-radius: 50px;
          background: rgba(251, 191, 36, 0.08);
          font-family: var(--font-mono, 'Courier New', monospace);
          font-size: 0.8rem;
          letter-spacing: 0.15em;
        }
        .uc-pill-text {
          color: #fbbf24;
        }
        .uc-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #fbbf24;
          box-shadow: 0 0 8px rgba(251, 191, 36, 0.8);
          animation: uc-dot-pulse 1.6s ease-in-out infinite;
        }

        /* --- Typewriter line --- */
        .uc-status {
          font-family: var(--font-mono, 'Courier New', monospace);
          font-size: 0.95rem;
          color: #94a1b2;
          min-height: 1.4em;
          margin: 0;
        }
        .uc-status-prompt {
          color: #7f5af0;
        }
        .uc-caret {
          display: inline-block;
          width: 0.55em;
          height: 1.05em;
          margin-left: 2px;
          vertical-align: text-bottom;
          background: #7f5af0;
          animation: uc-blink 1s step-end infinite;
        }

        /* --- Description --- */
        .uc-description {
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.7;
          color: #94a1b2;
        }

        /* --- CTA --- */
        .uc-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          padding: 1rem 2rem;
          background: rgba(127, 90, 240, 0.1);
          border-radius: 1rem;
          border: 1px solid rgba(127, 90, 240, 0.3);
          box-shadow: 0 0 15px rgba(127, 90, 240, 0.1);
          transition: all 0.3s ease;
        }
        .uc-cta span {
          color: #fffffe;
          font-family: var(--font-mono, 'Courier New', monospace);
          transition: color 0.3s ease;
        }
        .uc-cta:hover {
          border-color: rgba(127, 90, 240, 0.6);
          box-shadow: 0 0 25px rgba(127, 90, 240, 0.4);
          transform: translateY(-2px);
        }
        .uc-cta:hover span {
          color: #7f5af0;
        }

        /* --- Staggered entrance --- */
        .uc-fade-1 { animation: uc-fade-up 0.6s ease both; }
        .uc-fade-2 { animation: uc-fade-up 0.6s ease 0.15s both; }
        .uc-fade-3 { animation: uc-fade-up 0.6s ease 0.3s both; }
        .uc-fade-4 { animation: uc-fade-up 0.6s ease 0.45s both; }
        .uc-fade-5 { animation: uc-fade-up 0.6s ease 0.6s both; }
        .uc-fade-6 { animation: uc-fade-up 0.6s ease 0.75s both; }
        .uc-fade-7 { animation: uc-fade-up 0.6s ease 0.9s both; }

        /* --- Keyframes --- */
        @keyframes uc-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes uc-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes uc-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes uc-dash {
          to { stroke-dashoffset: -16; }
        }
        @keyframes uc-node-pulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }
        @keyframes uc-dot-pulse {
          0%, 100% { opacity: 0.5; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
        }

        /* --- Reduced motion: everything visible, nothing animates --- */
        @media (prefers-reduced-motion: reduce) {
          .uc-badge-icon,
          .uc-ring-2,
          .uc-wire,
          .uc-node,
          .uc-dot,
          .uc-caret,
          .uc-fade-1, .uc-fade-2, .uc-fade-3, .uc-fade-4,
          .uc-fade-5, .uc-fade-6, .uc-fade-7,
          .uc-cta {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .uc-caret {
            opacity: 0.8 !important;
          }
        }

        /* --- Mobile --- */
        @media (max-width: 480px) {
          .uc-badge {
            width: 130px;
            height: 130px;
          }
          .uc-badge-icon {
            font-size: 40px;
          }
        }
      `}</style>
    </div>
  );
}
