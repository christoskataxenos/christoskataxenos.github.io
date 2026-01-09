'use client';

/**
 * A premium comparison table component for MDX posts
 */
export default function ComparisonTable({ headers, rows }) {
    return (
        <div className="my-8 overflow-hidden rounded-xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800/50 border-b border-gray-700">
                            {headers.map((header, i) => (
                                <th
                                    key={i}
                                    className="px-6 py-4 text-sm font-bold tracking-wider text-purple-400 uppercase"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                        {rows.map((row, i) => (
                            <tr
                                key={i}
                                className="hover:bg-purple-500/5 transition-colors duration-200"
                            >
                                {row.map((cell, j) => (
                                    <td
                                        key={j}
                                        className={`px-6 py-4 text-sm ${j === 0 ? 'font-medium text-white' : 'text-gray-300'
                                            }`}
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
