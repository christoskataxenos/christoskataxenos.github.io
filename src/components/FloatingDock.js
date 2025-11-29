'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaArrowLeft } from 'react-icons/fa'; // Added FaArrowLeft, removed FaUser, FaBook, FaGithub
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';

// Tooltip component for hover effect
const Tooltip = ({ children, text }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="group relative flex justify-center">
      <span
        className="absolute bottom-full mb-2 scale-0 rounded bg-gray-800 p-2 text-xs text-white 
                   transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 opacity-0"
      >
        {text}
      </span>
      {children}
    </div>
  );
};

export default function FloatingDock() {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage(); // Destructure 't' for translations
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageToggle = () => {
    toggleLanguage();
  };

  if (!mounted) return null;

  const isEn = language === 'en';

  // Determine if we are on a blog post page
  const isBlogPost = pathname.includes('/blog/') || pathname.includes('/en/blog/');
  // Determine the correct path for "Back to Blog"
  const backToBlogPath = pathname.startsWith('/en/') ? '/en/blog' : '/blog';

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 
                 flex items-center gap-6 px-6 py-3 rounded-full 
                 bg-black/50 backdrop-blur-md border border-white/10 
                 shadow-lg shadow-purple-500/10"
    >
      {/* Home Icon */}
      <Tooltip text={isEn ? 'Home' : 'Αρχική'}>
        <Link href="/" className="hover:scale-110 transition-transform duration-200" aria-label={isEn ? 'Home' : 'Αρχική'}>
          <FaHome size={20} className={pathname === '/' ? 'text-purple-400' : 'text-gray-400 hover:text-white'} />
        </Link>
      </Tooltip>

      {/* Conditional Back to Blog Link */}
      {isBlogPost && (
        <Tooltip text={isEn ? 'Back to Blog' : 'Πίσω στο Ιστολόγιο'}>
          <Link href={backToBlogPath} className="hover:scale-110 transition-transform duration-200 flex items-center gap-2" aria-label={isEn ? 'Back to Blog' : 'Πίσω στο Ιστολόγιο'}>
            <FaArrowLeft size={20} className="text-gray-400 hover:text-white" />
            <span className="font-medium text-gray-400 hover:text-white text-sm">{isEn ? 'Blog' : 'Ιστολόγιο'}</span>
          </Link>
        </Tooltip>
      )}

      {/* Separator (only if Back to Blog is present) */}
      {isBlogPost && <div className="h-4 w-[1px] bg-gray-600"></div>}

      {/* Language Toggle */}
      <div 
        className="flex font-mono text-sm cursor-pointer hover:scale-110 transition-transform duration-200"
        onClick={handleLanguageToggle}
        aria-label="Toggle Language"
      >
        <span className={isEn ? 'text-gray-600 hover:text-gray-400' : 'text-purple-400 font-bold'}>GR</span>
        <span className="mx-1 text-gray-600">/</span>
        <span className={isEn ? 'text-purple-400 font-bold' : 'text-gray-600 hover:text-gray-400'}>EN</span>
      </div>
    </div>
  );
}