import xss from 'xss';

/**
 * Sanitize user input to prevent XSS attacks.
 */
export function sanitize(input: string): string {
    return xss(input, {
        whiteList: {},
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script'],
    });
}
