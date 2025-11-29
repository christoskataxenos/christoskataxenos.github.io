'use client';

import React from 'react';

export default function BioSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center p-4 lg:p-12 overflow-hidden font-sans">
      
      {/* --- Background Grid is assumed global, but we add a subtle overlay here if needed --- */}
      
      {/* --- Circuit Board SVG Wires (Desktop Only) --- */}
      <div className="absolute inset-0 hidden lg:block pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="wire-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Center to Left (Experience) */}
          <path 
            d="M 600 400 L 500 400 L 450 400 L 350 400" 
            stroke="url(#wire-gradient)" 
            strokeWidth="2" 
            fill="none"
            filter="url(#glow)"
            className="opacity-60"
          />
          <circle cx="350" cy="400" r="3" fill="#06b6d4" filter="url(#glow)" />

          {/* Center to Top Right (Education) */}
          <path 
            d="M 600 400 L 700 400 L 750 250 L 850 250" 
            stroke="url(#wire-gradient)" 
            strokeWidth="2" 
            fill="none"
            filter="url(#glow)"
            className="opacity-60"
          />
          <circle cx="850" cy="250" r="3" fill="#06b6d4" filter="url(#glow)" />

          {/* Center to Bottom Right (Skills) */}
          <path 
            d="M 600 400 L 700 400 L 750 550 L 850 550" 
            stroke="url(#wire-gradient)" 
            strokeWidth="2" 
            fill="none"
            filter="url(#glow)"
            className="opacity-60"
          />
          <circle cx="850" cy="550" r="3" fill="#06b6d4" filter="url(#glow)" />
        </svg>
      </div>

      {/* --- Main Grid Layout --- */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl items-center">
        
        {/* --- LEFT CARD: Professional Experience --- */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="group relative p-6 bg-[#0a0a0c]/80 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:border-cyan-400/50 transition-all duration-500">
            {/* Corner Accent */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl-md" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400 rounded-br-md" />

            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              Επαγγελματική Εμπειρία
            </h3>
            
            <ul className="space-y-4">
              <li className="border-l-2 border-purple-500/50 pl-4">
                <h4 className="text-white font-semibold">Network and Computer Technician (Freelancer)</h4>
                <p className="text-sm text-cyan-300">2007 - Present • Remote/Client Sites</p>
                <div className="text-xs text-gray-400 mt-1 space-y-1">
                  <p className="font-semibold text-white">Responsibilities:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>System administration</li>
                    <li>Network setup/support</li>
                    <li>Hardware/software troubleshooting</li>
                    <li>Client consultation</li>
                  </ul>
                  <p className="font-semibold text-white mt-2">Skills:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>TCP/IP, DNS, DHCP</li>
                    <li>Windows Server, Linux</li>
                    <li>Hardware diagnostics</li>
                  </ul>
                  <p className="font-semibold text-white mt-2">Achievements:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Improved network uptime by 15%</li>
                    <li>Reduced support tickets by 10%</li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* --- CENTER: Portrait (Hexagon) --- */}
        <div className="lg:col-span-4 order-1 lg:order-2 flex justify-center relative">
          {/* Glowing Ring Behind */}
          <div className="absolute w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative w-56 h-56 sm:w-64 sm:h-64">
            {/* Hexagon Border Container */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-[2px]"
              style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            >
              <div className="w-full h-full bg-[#0a0a0c] flex items-center justify-center" 
                   style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                {/* Placeholder for Image */}
                <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center text-center p-4">
                  <span className="text-4xl mb-2">👨‍💻</span>
                  <span className="text-cyan-400 font-mono text-xs">USER_ID: CHRIS</span>
                  <span className="text-purple-400 font-mono text-[10px]">STATUS: ONLINE</span>
                </div>
              </div>
            </div>
            
            {/* Floating HUD Elements around portrait */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-cyan-500 font-mono animate-bounce">SCANNING...</div>
            <div className="absolute bottom-4 -right-4 text-[10px] text-purple-500 font-mono rotate-90">SYS.VER.2.0</div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Education & Skills --- */}
        <div className="lg:col-span-4 order-3 lg:order-3 flex flex-col gap-6">
          
          {/* TOP RIGHT: Education */}
          <div className="group relative p-6 bg-[#0a0a0c]/80 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:border-cyan-400/50 transition-all duration-500">
             {/* Corner Accent */}
             <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400 rounded-tr-md" />
            
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full" />
              Εκπαίδευση
            </h3>
            <ul className="space-y-3">
               <li className="flex justify-between items-baseline border-b border-white/5 pb-2">
                 <span className="text-white font-medium">Ελληνικό Ανοικτό Πανεπιστήμιο</span>
                 <span className="text-xs text-gray-400 font-mono">2025</span>
               </li>
               <li className="text-sm text-gray-400 italic">Πληροφορική (BSc)</li>
               <li className="flex justify-between items-baseline border-b border-white/5 pb-2 mt-3">
                 <span className="text-white font-medium">ΙΕΚ Ρόδου</span>
                 <span className="text-xs text-gray-400 font-mono">2008-2010</span>
               </li>
               <li className="text-sm text-gray-400 italic">Τεχνικός ηλεκτρονικών υπολογιστών και δικτύων</li>
            </ul>
          </div>

          {/* BOTTOM RIGHT: Skills */}
          <div className="group relative p-6 bg-[#0a0a0c]/80 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:border-cyan-400/50 transition-all duration-500">
             {/* Corner Accent */}
             <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400 rounded-bl-md" />
            
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full" />
              Δεξιότητες
            </h3>
            
            <div className="space-y-3">
              {/* Skill 1 */}
              <div>
                <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                  <span>REACT / NEXT.JS</span>
                  <span>90%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 w-[90%] shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                </div>
              </div>
              
              {/* Skill 2 */}
              <div>
                <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                  <span>PYTHON</span>
                  <span>85%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 w-[85%] shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                </div>
              </div>

              {/* Skill 3 */}
              <div>
                <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                  <span>CSS / TAILWIND</span>
                  <span>95%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 w-[95%] shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
