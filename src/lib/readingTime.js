/**
 * Υπολογισμός χρόνου ανάγνωσης για blog post
 * Calculate reading time for blog post
 * 
 * @param {string} content - The MDX/text content
 * @returns {number} - Estimated reading time in minutes
 */
export function calculateReadingTime(content) {
    if (!content || typeof content !== 'string') {
        return 1;
    }

    // Αφαιρούμε frontmatter
    // Remove frontmatter
    let cleanedContent = content.replace(/^---[\s\S]*?---/, '');

    // Αφαιρούμε JSX/HTML tags αλλά κρατάμε το κείμενο μέσα
    // Remove JSX/HTML tags but keep text content
    cleanedContent = cleanedContent.replace(/<[^>]+>/g, ' ');

    // Αφαιρούμε τα code blocks μόνο (αλλά προσθέτουμε μέτριο βάρος)
    // Remove code blocks only (but add moderate weight for them)
    const codeBlocks = (cleanedContent.match(/```[\s\S]*?```/g) || []);
    const codeBlockWords = codeBlocks.reduce((sum, block) => {
        // Κάθε code block μετράει ως ~30 λέξεις (χρόνος ανάγνωσης/κατανόησης)
        // Each code block counts as ~30 words (reading/comprehension time)
        return sum + 30;
    }, 0);

    cleanedContent = cleanedContent.replace(/```[\s\S]*?```/g, ' ');

    // Αφαιρούμε inline code
    // Remove inline code
    cleanedContent = cleanedContent.replace(/`[^`]+`/g, ' ');

    // Αφαιρούμε URLs
    // Remove URLs
    cleanedContent = cleanedContent.replace(/https?:\/\/[^\s]+/g, ' ');

    // Αφαιρούμε markdown σύνταξη
    // Remove markdown syntax
    cleanedContent = cleanedContent
        .replace(/#{1,6}\s/g, '') // Headers
        .replace(/[*_]{1,2}/g, '') // Bold/italic
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links (keep text)
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Images
        .trim();

    // Μέτρηση λέξεων
    // Word count
    const words = cleanedContent.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length + codeBlockWords;

    // Debugging - θα το αφαιρέσουμε μετά
    // Debugging - we'll remove this later
    console.log(`Reading time debug: ${wordCount} words total (${words.length} text + ${codeBlockWords} from code)`);

    // Μέσος όρος ανάγνωσης: 200 λέξεις/λεπτό (πιο συντηρητικό)
    // Average reading speed: 200 words per minute (more conservative)
    const wordsPerMinute = 200;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    // Ελάχιστος χρόνος 1 λεπτό
    // Minimum 1 minute
    return Math.max(1, readingTime);
}

/**
 * Μορφοποίηση του χρόνου ανάγνωσης
 * Format reading time for display
 * 
 * @param {number} minutes - Reading time in minutes
 * @param {string} locale - Language locale ('el' or 'en')
 * @returns {string} - Formatted string
 */
export function formatReadingTime(minutes, locale = 'el') {
    if (locale === 'en') {
        return `${minutes} min read`;
    }
    // Greek
    return `${minutes} λεπτά ανάγνωσης`;
}
