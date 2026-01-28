export const sanitizeInput = (input: unknown): string => {
    if (input == null) return '';
    const str = String(input);
    return str
        .trim()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};
