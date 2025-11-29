'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { useState } from 'react';

// Tooltip component for hover effect (re-using the one from FloatingDock)
const Tooltip = ({ children, text }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="group relative flex justify-center">
      <span
        className="absolute left-full ml-2 scale-0 rounded bg-gray-800 p-2 text-xs text-white 
                   transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 opacity-0"
      >
        {text}
      </span>
      {children}
    </div>
  );
};

export default function SocialMediaDock() {
  return (
    <div
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 
                 flex flex-col items-center gap-4 py-4 px-3 rounded-full 
                 bg-black/50 backdrop-blur-md border border-white/10 
                 shadow-lg shadow-purple-500/10"
    >
      {/* GitHub Icon */}
      <Tooltip text="GitHub">
        <a href="https://github.com/christoskataxenos" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200" aria-label="GitHub">
          <FaGithub size={20} className="text-gray-400 hover:text-white" />
        </a>
      </Tooltip>

      {/* LinkedIn Icon */}
      <Tooltip text="LinkedIn">
        <a href="https://www.linkedin.com/in/christos-kataxenos-4b57a586" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200" aria-label="LinkedIn">
          <FaLinkedinIn size={20} className="text-gray-400 hover:text-white" />
        </a>
      </Tooltip>

      {/* Instagram Icon */}
      <Tooltip text="Instagram">
        <a href="https://www.instagram.com/christoskataxenos/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200" aria-label="Instagram">
          <FaInstagram size={20} className="text-gray-400 hover:text-white" />
        </a>
      </Tooltip>
    </div>
  );
}