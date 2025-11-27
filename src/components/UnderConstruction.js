'use client';
// src/components/UnderConstruction.js
import Link from 'next/link';
import styles from './HeroTitle.module.css'; // Reuse the glow effects

export default function UnderConstruction({ title, Icon, SpotlightCard }) {
  const CardLink = SpotlightCard || Link; // Use SpotlightCard if provided, else Link

  return (
    <div className="scroll-container">
      <section className="section hero-section">
        <div className="hero-content" style={{ gap: '2rem' }}>
          
          {/* Animated Icon */}
          <div style={{ 
            color: '#7f5af0', 
            width: '120px', 
            height: '120px',
            filter: 'drop-shadow(0 0 15px rgba(127, 90, 240, 0.4))',
            animation: 'pulse 3s infinite ease-in-out'
          }}>
            <Icon />
          </div>

          {/* Title */}
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            color: '#7f5af0',
            textShadow: '0 0 20px rgba(127, 90, 240, 0.6)',
            textAlign: 'center'
          }}>
            {title}
          </h1>

          {/* Status Badge */}
          <div style={{
            padding: '0.5rem 1rem',
            border: '1px solid #7f5af0',
            borderRadius: '50px',
            color: '#fffffe',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            background: 'rgba(127, 90, 240, 0.1)'
          }}>
            🚧 UNDER CONSTRUCTION
          </div>

          <p className="hero-description" style={{ maxWidth: '500px', margin: '0' }}>
            I'm currently building this part of my digital home. 
            Check back soon for updates or return to the main landing page.
          </p>

          {/* Back Button */}
          <CardLink href="/" className="back-to-home-card">
            <span style={{color: '#fffffe', transition: 'color 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              ← Return Home
            </span>
            <style jsx>{`
              .back-to-home-card {
                margin-top: 2rem;
                text-decoration: none;
                padding: 1rem 2rem;
                background: rgba(127, 90, 240, 0.1);
                border-radius: 1rem;
                border: 1px solid rgba(127, 90, 240, 0.3);
                transition: all 0.3s ease;
                box-shadow: 0 0 15px rgba(127, 90, 240, 0.1);
                display: flex; /* For centering content */
                align-items: center;
                justify-content: center;
                height: auto; /* Allow content to dictate height */
              }
              .back-to-home-card:hover {
                border-color: rgba(127, 90, 240, 0.6);
                box-shadow: 0 0 25px rgba(127, 90, 240, 0.4);
                transform: translateY(-2px);
              }
              .back-to-home-card:hover span {
                color: #7f5af0;
              }
            `}</style>
          </CardLink>

        
        </div>
      </section>
    </div>
  );
}
