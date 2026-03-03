'use client';

/**
 * Terminal Component
 * Σκοπός: Προσομοίωση παραθύρου τερματικού για προβολή εντολών.
 * Λειτουργία: Overflow-x για μεγάλες εντολές, διακοσμητικά κουμπιά ελέγχου.
 * Δεδομένα: children (περιεχόμενο), title (τίτλος παραθύρου).
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
            <div className="terminal-body p-4 font-mono text-[11px] sm:text-[13px] leading-relaxed overflow-x-auto text-gray-300">
                <style jsx>{`
                    .terminal-body :global(*) {
                        font-size: inherit !important;
                        color: inherit !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        line-height: inherit !important;
                        display: inline !important;
                        font-weight: normal !important;
                        text-shadow: none !important;
                        border: none !important;
                    }
                `}</style>
                <div className="flex items-start">
                    <span className="mr-3 text-green-400 select-none shrink-0">$</span>
                    <div className="whitespace-pre overflow-x-auto m-0 p-0 w-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
