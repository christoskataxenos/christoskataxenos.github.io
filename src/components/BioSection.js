'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function BioSection() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center p-4 lg:p-12 overflow-hidden font-sans">
      
      {/* --- Main Grid Layout --- */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 w-full max-w-7xl items-start pt-20">
        
        {/* --- LEFT COLUMN: Professional Experience --- */}
        <div className="order-2 lg:order-1 flex flex-col gap-6">
          <div className="group relative p-6 bg-[#0a0a0c]/80 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:border-cyan-400/50 cursor-pointer">
            {/* Corner Accent */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl-md" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400 rounded-br-md" />

            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              {t.experienceTitle}
            </h3>
            
            <ul className="space-y-6">
              <li className="border-l-2 border-purple-500/50 pl-4">
                <h4 className="text-white font-semibold text-lg">{t.roles.technician.title}</h4>
                <p className="text-xs text-gray-500 mb-2">{t.roles.technician.dateLocation}</p>
                <div className="text-sm text-gray-300 space-y-2">
                  <p className="font-semibold text-white">{t.roles.technician.responsibilities}</p>
                  <ul className="list-disc list-inside ml-2 text-gray-400 space-y-2">
                    {t.roles.technician.responsibilitiesList.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <p className="font-semibold text-white mt-2">{t.roles.technician.skillsLabel}</p>
                  <ul className="list-disc list-inside ml-2 text-gray-400 space-y-2">
                    {t.roles.technician.skillsList.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <p className="font-semibold text-white mt-2">{t.roles.technician.achievementsLabel}</p>
                  <ul className="list-disc list-inside ml-2 text-gray-400 space-y-2">
                    {t.roles.technician.achievementsList.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="border-l-2 border-gray-700 pl-4 group-hover:border-purple-500/50 transition-colors duration-300">
                <h4 className="text-white font-semibold text-lg">{t.roles.security.title}</h4>
                <p className="text-xs text-gray-500 mb-2">{t.roles.security.date}</p>
                <p className="text-sm text-gray-300">{t.roles.security.description}</p>
              </li>
            </ul>
          </div>
        </div>

        {/* --- CENTER COLUMN: Avatar (Vertically Centered on Desktop) --- */}
        <div className="order-1 lg:order-2 flex justify-center relative lg:self-center py-8 lg:py-0">
          {/* Glowing Ring Behind */}
          <div className="absolute w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer">
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
          </div>
        </div>

        {/* --- RIGHT COLUMN: Education & Skills --- */}
        <div className="order-3 lg:order-3 flex flex-col gap-6">
          
          {/* Education Card */}
          <div className="group relative p-6 bg-[#0a0a0c]/80 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:border-cyan-400/50 cursor-pointer">
             {/* Corner Accent */}
             <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400 rounded-tr-md" />
            
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full" />
              {t.educationTitle}
            </h3>
            <ul className="space-y-4">
               <li className="flex justify-between items-baseline border-b border-white/5 pb-2">
                 <div>
                    <span className="text-white font-medium block">{t.education.university}</span>
                    <span className="text-sm text-gray-300 italic">{t.education.degree}</span>
                 </div>
                 <span className="text-xs text-gray-500 font-mono">2025</span>
               </li>
               <li className="flex justify-between items-baseline border-b border-white/5 pb-2">
                 <div>
                    <span className="text-white font-medium block">{t.education.iek}</span>
                    <span className="text-sm text-gray-300 italic">{t.education.iekDegree}</span>
                 </div>
                 <span className="text-xs text-gray-500 font-mono">2008-2010</span>
               </li>
            </ul>
          </div>

          {/* Skills Card */}
          <div className="group relative p-6 bg-[#0a0a0c]/80 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:border-cyan-400/50 cursor-pointer">
             {/* Corner Accent */}
             <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400 rounded-bl-md" />
            
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full" />
              {t.skillsTitle}
            </h3>
            
            <div className="space-y-6">
              {Object.entries(t.skillGroups).map(([key, group]) => (
                <div key={key}>
                  <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-1">
                    {group.title}
                  </h4>
                  <div className="space-y-4">
                    {group.skills.map((skill, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-xs font-mono text-gray-300 mb-1.5">
                          <span>{skill.label}</span>
                          <span className={`
                            ${skill.level === 'Loading...' ? 'text-yellow-400 animate-pulse' : ''}
                            ${skill.level === 'Intermediate' ? 'text-cyan-400' : ''}
                            ${skill.level === 'Production Ready' ? 'text-green-400' : ''}
                          `}>
                            {skill.level}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden border border-white/5 relative">
                          <div 
                            className={`h-full bg-gradient-to-r from-purple-600 to-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000 ease-out`}
                            style={{ width: skill.width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
