import Image from "next/image";

export default function BioPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 md:p-10 flex items-center justify-center font-mono">
      
      {/* Main Grid Container */}
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 relative">

        {/* --- LEFT COLUMN: Experience --- */}
        <div className="space-y-6 order-2 lg:order-1">
          <div className="relative p-6 rounded-xl border border-purple-500/30 bg-black/40 backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:border-purple-400 transition-colors">
            {/* Decorative Corner */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500 rounded-tl-lg"></div>
            
            <h2 className="text-xl font-bold text-purple-400 mb-6 flex items-center">
              <span className="mr-2">??</span> Επαγγελματική Εμπειρία
            </h2>

            <div className="space-y-8 relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-1 top-2 bottom-2 w-0.5 bg-purple-500/20"></div>

              {/* Job 1 */}
              <div className="pl-6 relative">
                <div className="absolute left-0 top-1.5 w-2.5 h-2.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                <h3 className="text-lg font-bold text-gray-200">Senior Frontend Dev</h3>
                <p className="text-sm text-gray-500 mb-2">Tech Corp ? 2023 - Present</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Leading frontend architecture and cyberpunk UI implementation. Next.js mastery.
                </p>
              </div>

              {/* Job 2 */}
              <div className="pl-6 relative">
                <div className="absolute left-0 top-1.5 w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-200">Web Engineer</h3>
                <p className="text-sm text-gray-500 mb-2">StartUp Inc ? 2021 - 2023</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Developed scalable React applications and drank way too much coffee.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- CENTER COLUMN: Profile & Status --- */}
        <div className="flex flex-col items-center justify-start pt-10 order-1 lg:order-2 relative">
          
          {/* Connecting Lines (CSS Pseudo-wires) visible only on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-purple-500/20 -z-10"></div>
          <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px h-full bg-purple-500/20 -z-10"></div>

          {/* Hexagon/Circle Container */}
          <div className="relative w-48 h-48 mb-6 group">
            {/* Glowing Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/50 animate-spin-slow"></div>
            <div className="absolute inset-2 rounded-full border border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)] bg-black overflow-hidden">
               {/* Replace with your actual image path */}
               <Image 
                 src="https://github.com/christoskataxenos.png" 
                 alt="Christos Profile" 
                 width={200} 
                 height={200}
                 className="object-cover w-full h-full opacity-90 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
               />
            </div>
            
            {/* Status Badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black border border-cyan-500 px-3 py-1 rounded-full text-xs text-cyan-400 font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              ONLINE
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white tracking-widest uppercase text-center">
            Christos<br/>Kataxenos
          </h1>
          <p className="text-purple-400 text-sm mt-2 tracking-widest">SYSTEM_ADMIN</p>
        </div>

        {/* --- RIGHT COLUMN: Education & Skills --- */}
        <div className="space-y-6 order-3 lg:order-3">
          
          {/* Education Card */}
          <div className="relative p-6 rounded-xl border border-cyan-500/30 bg-black/40 backdrop-blur-sm hover:border-cyan-400 transition-colors">
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500 rounded-tr-lg"></div>
            <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
              <span className="mr-2">??</span> Εκπαίδευση
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-200 font-bold">Πληροφορική (BSc)</h3>
                <p className="text-sm text-gray-500">Ελληνικό Ανοικτό Πανεπιστήμιο</p>
                <p className="text-xs text-cyan-600 mt-1">2025 (Expected)</p>
              </div>
            </div>
          </div>

          {/* Skills Card */}
          <div className="relative p-6 rounded-xl border border-green-500/30 bg-black/40 backdrop-blur-sm hover:border-green-400 transition-colors">
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500 rounded-br-lg"></div>
            <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center">
              <span className="mr-2">?</span> Δεξιότητες
            </h2>
            
            <div className="space-y-3 text-sm">
              {/* Skill 1 */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">React / Next.js</span>
                  <span className="text-green-400">90%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[90%] shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                </div>
              </div>

              {/* Skill 2 */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Python</span>
                  <span className="text-green-400">85%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[85%]"></div>
                </div>
              </div>

              {/* Skill 3 */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">CSS / Tailwind</span>
                  <span className="text-green-400">95%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[95%]"></div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}