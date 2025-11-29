'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaUser, FaBook, FaGithub } from 'react-icons/fa';
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
  const { language, toggleLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageToggle = () => {
    // This logic should ideally be similar to the previous LanguageSwitch
    // but simplified for the minimalist text slider.
    // For now, it will just toggle the language context.
    toggleLanguage();
  };

  if (!mounted) return null;

  const isEn = language === 'en'; // Directly use the language context

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 
                 flex items-center gap-6 px-6 py-3 rounded-full 
                 bg-black/50 backdrop-blur-md border border-white/10 
                 shadow-lg shadow-cyan-500/10"
    >
      {/* Home Icon */}
      <Tooltip text={isEn ? 'Home' : 'Αρχική'}>
        <Link href="/" className="hover:scale-110 transition-transform duration-200" aria-label={isEn ? 'Home' : 'Αρχική'}>
          <FaHome size={20} className={pathname === '/' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'} />
        </Link>
      </Tooltip>

      {/* User Icon (Bio) */}
      <Tooltip text={isEn ? 'About Me' : 'Προσωπικά'}>
        <Link href="/bio" className="hover:scale-110 transition-transform duration-200" aria-label={isEn ? 'About Me' : 'Προσωπικά'}>
          <FaUser size={20} className={pathname === '/bio' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'} />
        </Link>
      </Tooltip>

      {/* Book Icon (Blog) */}
      <Tooltip text={isEn ? 'Blog' : 'Ιστολόγιο'}>
        <Link href="/blog" className="hover:scale-110 transition-transform duration-200" aria-label={isEn ? 'Blog' : 'Ιστολόγιο'}>
          <FaBook size={20} className={pathname.startsWith('/blog') || pathname.startsWith('/en/blog') ? 'text-cyan-400' : 'text-gray-400 hover:text-white'} />
        </Link>
      </Tooltip>

      {/* Github Icon */}
      <Tooltip text="GitHub">
        <a href="https://github.com/christoskataxenos" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200" aria-label="GitHub">
          <FaGithub size={20} className="text-gray-400 hover:text-white" />
        </a>
      </Tooltip>

      {/* Separator */}
      <div className="h-4 w-[1px] bg-gray-600"></div>

      {/* Language Toggle */}
      <div 
        className="flex font-mono text-sm cursor-pointer hover:scale-110 transition-transform duration-200"
        onClick={handleLanguageToggle}
        aria-label="Toggle Language"
      >
        <span className={isEn ? 'text-gray-600 hover:text-gray-400' : 'text-cyan-400 font-bold'}>GR</span>
        <span className="mx-1 text-gray-600">/</span>
        <span className={isEn ? 'text-cyan-400 font-bold' : 'text-gray-600 hover:text-gray-400'}>EN</span>
      </div>
    </div>
  );
}