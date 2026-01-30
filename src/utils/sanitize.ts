/**
 * Input Sanitization Utilities
 * Protects against XSS, HTML injection, and SQL injection attempts
 */

/**
 * Sanitize HTML content - removes dangerous tags and attributes
 * Used for rich text editor content
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';
  
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.textContent = html;
  
  // Allow only safe HTML tags for rich text (defined for reference, ReactQuill handles this)
  // const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'a'];
  // const allowedAttributes = ['href', 'title', 'target'];
  
  // For now, return the content as-is since ReactQuill handles sanitization
  // But strip any script tags as extra protection
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers like onclick=
}

/**
 * Sanitize plain text input - removes HTML tags
 * Used for titles, names, etc.
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
}

/**
 * Sanitize URL - ensures it's a valid HTTP/HTTPS URL
 * Used for image URLs, links, etc.
 */
export function sanitizeURL(url: string): string {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    return url;
  } catch {
    // Invalid URL
    return '';
  }
}

/**
 * Sanitize slug - only alphanumeric and hyphens
 * Used for URL slugs
 */
export function sanitizeSlug(slug: string): string {
  if (!slug) return '';
  
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Rate limiting helper (client-side)
 * Prevents spam submissions
 */
const rateLimitMap = new Map<string, number>();

export function checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
  const attempts = rateLimitMap.get(key) || 0;
  
  if (attempts >= maxAttempts) {
    return false; // Rate limited
  }
  
  rateLimitMap.set(key, attempts + 1);
  
  // Clear after window
  setTimeout(() => {
    rateLimitMap.delete(key);
  }, windowMs);
  
  return true; // Allowed
}

/**
 * Detect potential SQL injection attempts
 * NOTE: This is just a basic check. Real protection comes from parameterized queries (Supabase handles this)
 */
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\bUNION\b.*\bSELECT\b)/i,
    /(\bDROP\b.*\bTABLE\b)/i,
    /(\bINSERT\b.*\bINTO\b)/i,
    /(\bDELETE\b.*\bFROM\b)/i,
    /(\bUPDATE\b.*\bSET\b)/i,
    /--/,
    /;.*()/,
    /\/\*/,
    /\*\//
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Comprehensive input validator
 */
export function validateInput(input: string, type: 'text' | 'html' | 'url' | 'email' = 'text'): { valid: boolean; sanitized: string; error?: string } {
  if (!input) {
    return { valid: false, sanitized: '', error: 'Input is required' };
  }
  
  // Check for SQL injection attempts
  if (detectSQLInjection(input)) {
    console.warn('⚠️ Potential SQL injection detected:', input.substring(0, 50));
    return { valid: false, sanitized: '', error: 'Invalid input detected' };
  }
  
  // Sanitize based on type
  let sanitized = '';
  let valid = true;
  
  switch (type) {
    case 'html':
      sanitized = sanitizeHTML(input);
      break;
    case 'url':
      sanitized = sanitizeURL(input);
      valid = sanitized !== '';
      break;
    case 'email':
      sanitized = sanitizeText(input);
      valid = isValidEmail(sanitized);
      break;
    default:
      sanitized = sanitizeText(input);
  }
  
  return { valid, sanitized, error: valid ? undefined : 'Invalid input format' };
}
