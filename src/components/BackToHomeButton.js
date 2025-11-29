'use client';

import Link from 'next/link';

export default function BackToHomeButton() {
  return (
    <Link
      href="/"
      className="fixed bottom-8 right-8 z-50 p-5 rounded-full 
                 bg-gray-900/80 backdrop-blur border border-cyan-500/30 
                 text-cyan-400 shadow-xl transition-all duration-300 ease-in-out
                 hover:scale-110 hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] cursor-pointer"
      aria-label="Back to Home"
    >
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
  );
}