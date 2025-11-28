'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="navbar">
      <Link href="/" className="home-link" aria-label="Home">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </Link>

      {/* Language Switcher is positioned absolutely via its own component styles, 
          so we don't render it here to avoid layout conflicts, 
          but this header reserves the visual space if needed. 
          The "CK" text has been removed as requested. 
      */}
      
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px; /* Increased slightly to not crowd top elements */
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 900; /* Below LanguageSwitch (z-100) but above content */
          pointer-events: none; /* Let clicks pass through empty areas */
        }

        .home-link {
          pointer-events: auto;
          color: #94a1b2;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(5px);
        }

        .home-link:hover {
          color: #7f5af0;
          background: rgba(127, 90, 240, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 0 15px rgba(127, 90, 240, 0.3);
        }

        @media (max-width: 768px) {
            .navbar {
                padding: 0 1rem;
                height: 70px;
            }
        }
      `}</style>
    </header>
  );
}