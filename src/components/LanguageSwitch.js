'use client';

import { useLanguage } from '../context/LanguageContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LanguageSwitch() {
  const { language, toggleLanguage } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    if (pathname.includes('/blog')) {
      if (pathname.startsWith('/en/blog')) {
        const newPath = pathname.replace('/en', '');
        router.push(newPath);
      } else {
        const newPath = `/en${pathname}`;
        router.push(newPath);
      }
      if (language === 'en') toggleLanguage(); 
      else if (language === 'el') toggleLanguage();
    } else {
      toggleLanguage();
    }
  };

  const isEn = mounted ? (pathname.startsWith('/en') || (language === 'en' && !pathname.startsWith('/blog'))) : false;

  if (!mounted) return null;

  return (
    <button 
      onClick={handleToggle}
      className="lang-switch"
      aria-label="Switch Language"
    >
      <div className="toggle-track">
        <span className={`lang-label ${!isEn ? 'active' : ''}`}>GR</span>
        <span className={`lang-label ${isEn ? 'active' : ''}`}>EN</span>
        <div className={`toggle-thumb ${isEn ? 'right' : 'left'}`} />
      </div>

      <style jsx>{`
        .lang-switch {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          z-index: 1000;
        }

        .toggle-track {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 96px; /* Increased width */
          height: 40px; 
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          padding: 4px; /* Uniform padding */
          box-sizing: border-box;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }
        
        .lang-switch:hover .toggle-track {
          border-color: rgba(127, 90, 240, 0.5);
          background: rgba(255, 255, 255, 0.08);
        }

        .lang-label {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          font-weight: 600;
          color: #94a1b2;
          z-index: 2;
          transition: color 0.3s ease;
          width: 50%;
          text-align: center;
          user-select: none;
        }

        .lang-label.active {
          color: #fffffe;
        }

        .toggle-thumb {
          position: absolute;
          top: 4px;
          left: 4px;
          width: 42px; /* Calculated: (96 - 8) / 2 - gap? No, (96-8)/2 = 44. Let's use 42 to leave a tiny gap */
          height: 30px;
          background: #7f5af0;
          border-radius: 999px;
          z-index: 1;
          transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .toggle-thumb.left {
          transform: translateX(0);
        }

        .toggle-thumb.right {
          transform: translateX(44px); /* 96 - 4 - 4 - 42 = 46? No. 4 + 44 = 48. Width 96. Right edge 96-4=92. Thumb right: 48+42=90. */
          /* Let's do exact math. 
             Container Inner Width = 96 - 8 = 88.
             Thumb Width = 44.
             Travel = 88 - 44 = 44.
          */
          width: 44px;
        }

        @media (max-width: 768px) {
           .lang-switch {
             margin-right: 0.5rem;
           }
           .toggle-track {
             width: 84px;
             height: 36px;
             padding: 3px;
           }
           /* Inner width: 84 - 6 = 78 */
           /* Thumb width: 39 */
           .toggle-thumb {
             top: 3px;
             left: 3px;
             width: 39px; 
             height: 28px;
           }
           .toggle-thumb.right {
             transform: translateX(39px);
             width: 39px;
           }
           .lang-label {
             font-size: 0.75rem;
           }
        }
      `}</style>
    </button>
  );
}