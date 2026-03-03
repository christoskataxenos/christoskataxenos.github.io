/**
 * ReadingProgress Component
 * Σκοπός: Μπάρα προόδου ανάγνωσης στην κορυφή των blog posts.
 * Λειτουργία: Υπολογισμός ποσοστού scroll και δυναμική ενημέρωση width.
 * Edge cases: Μηδενικό ύψος εγγράφου ή window.
 */
'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        // handleScroll: Υπολογίζει την πρόοδο κύλισης και ενημερώνει το state.
        const handleScroll = () => {
            // windowHeight: Το ορατό ύψος του παραθύρου προβολής.
            const windowHeight = window.innerHeight;
            // documentHeight: Το συνολικό ύψος του εγγράφου.
            const documentHeight = document.documentElement.scrollHeight;
            // scrollTop: Η τρέχουσα θέση κύλισης από την κορυφή.
            const scrollTop = window.scrollY;

            // totalScroll: Το συνολικό ύψος που μπορεί να κυλιστεί.
            const totalScroll = documentHeight - windowHeight;
            // progress: Το ποσοστό κύλισης. Αν totalScroll είναι 0, η πρόοδος είναι 0.
            const progress = totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0;

            setScrollProgress(Math.min(100, Math.max(0, progress)));
        };

        // Initial calculation
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className="fixed top-0 left-0 right-0 z-50 h-1"
            style={{ pointerEvents: 'none' }}
        >
            <div
                className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 transition-all duration-100 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                style={{ width: `${scrollProgress}%` }}
            />
        </div>
    );
}
