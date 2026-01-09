'use client';

/**
 * Terminal component for displaying command line scripts and outputs
 */
export default function Terminal({ children, title = 'terminal' }) {
    return (
        <div className="my-8 overflow-hidden rounded-xl border border-gray-800 bg-[#0d1117] shadow-2xl">
            {/* Terminal Title Bar */}
            <div className="flex items-center justify-between bg-gray-900/50 px-4 py-2 border-b border-gray-800">
                <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs font-mono text-gray-400 select-none">
                    {title}
                </div>
                <div className="w-12"></div> {/* Spacer for symmetry */}
            </div>

            {/* Terminal Content */}
            <div className="p-4 font-mono text-sm sm:text-base leading-relaxed overflow-x-auto text-gray-300">
                <div className="flex">
                    <span className="mr-4 text-green-400 select-none">$</span>
                    <pre className="inline-block">{children}</pre>
                </div>
            </div>
        </div>
    );
}
