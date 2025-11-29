'use client';

import LanguageSwitch from './LanguageSwitch';

export default function Header() {
  return (
    <header className="navbar">
      {/* LanguageSwitch positioned absolutely */}
      <div className="absolute top-0 right-0 p-4 z-[1001] pointer-events-auto">
        <LanguageSwitch />
      </div>
      
      <div className="header-content">
      </div>
      
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          z-index: 900;
          pointer-events: none;
          display: flex;
          justify-content: center; /* Centering the wrapper for its max-width content */
        }

        .header-content {
          width: 100%;
          max-width: 768px; /* Align with blog content (max-w-3xl) */
          margin-left: auto; /* Center the content */
          margin-right: auto; /* Center the content */
          padding: 0 1rem; /* Adjust padding for better alignment with blog p-8 or p-6 */
          display: flex;
          align-items: center;
          /* Keep LanguageSwitch on the right within this aligned container */
          justify-content: flex-end; 
          height: 100%;
        }

        @media (max-width: 768px) {
            .navbar {
                height: 70px;
            }
            .header-content {
                padding: 0 1rem; /* Ensure safe padding on mobile edges */
            }
        }
      `}</style>
    </header>
  );
}
