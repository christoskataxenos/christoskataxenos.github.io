'use client';

import Link from 'next/link';

export default function BackButton({ href = '/blog', label = 'Back to Blog' }) {
  return (
    <Link 
      href={href}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-8 py-3 
                 bg-[#16161a]/90 backdrop-blur-md border border-[#242629] rounded-full 
                 text-[#94a1b2] text-sm font-medium shadow-2xl 
                 transition-all duration-300 hover:scale-105 hover:bg-[#242629] hover:text-[#fffffe] hover:border-[#7f5af0] hover:shadow-[#7f5af0]/30
                 group"
      aria-label={label}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="transition-transform duration-300 group-hover:-translate-x-1"
      >
        <path d="M19 12H5" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      <span>{label}</span>
    </Link>
  );
}
