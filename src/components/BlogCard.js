'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

export default function BlogCard({ slug, date, title, description, basePath = '/blog' }) {
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
    <Link
      href={`${basePath}/${slug}`}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="blog-card"
    >
      <div
        className="spotlight-overlay"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(127, 90, 240, 0.1), transparent 40%)`,
        }}
      />
      <div
        className="spotlight-border"
        style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(127, 90, 240, 0.4), transparent 40%)`,
        }}
      />

      <div className="card-content">
        <time className="date">
          {date}
        </time>

        <h2 className="title">
          {title}
        </h2>

        <p className="description">
          {description}
        </p>
      </div>

      <style jsx>{`
        /* Target the link directly using global selector if scoped one fails to apply to the passed className */
        :global(.blog-card) {
          position: relative;
          display: block;
          width: 100%;
          background: rgba(20, 20, 23, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          text-decoration: none !important;
          overflow: hidden;
          padding: 2.5rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-sizing: border-box;
        }

        :global(.blog-card:hover) {
            transform: translateY(-8px) scale(1.01);
            background: rgba(20, 20, 23, 0.6);
            border-color: rgba(127, 90, 240, 0.3);
            box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5),
                        0 0 20px -5px rgba(127, 90, 240, 0.2);
        }

        .spotlight-overlay {
          pointer-events: none;
          position: absolute;
          inset: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

        .spotlight-border {
            pointer-events: none;
            position: absolute;
            inset: -1px;
            border-radius: inherit;
            padding: 1px;
            background: radial-gradient(600px circle at var(--x) var(--y), rgba(127, 90, 240, 0.4), transparent 40%);
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
          width: 100%;
          text-align: left;
        }

        .date {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #94a1b2 !important;
          margin-bottom: 0.75rem;
          display: block;
        }

        .title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fffffe !important;
          margin-bottom: 0.75rem;
          transition: color 0.3s ease;
        }

        :global(.blog-card:hover) .title {
          color: #a78bfa !important;
        }

        .description {
          font-size: 1rem;
          color: #94a1b2 !important;
          line-height: 1.6;
        }

        :global(.blog-card:hover) .description {
          color: #d1d5db !important;
        }
      `}</style>
    </Link>
  );
}