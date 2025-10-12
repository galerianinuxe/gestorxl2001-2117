import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // No HTML tags allowed by default
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};

/**
 * Sanitizes text input by trimming and removing potential XSS
 */
export const sanitizeText = (input: string): string => {
  return sanitizeHtml(input.trim());
};

/**
 * Sanitizes multi-line text (preserves line breaks)
 */
export const sanitizeMultilineText = (input: string): string => {
  return input
    .split('\n')
    .map(line => sanitizeText(line))
    .join('\n');
};
