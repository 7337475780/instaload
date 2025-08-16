/**
 * Sanitizes a string to be used as a safe filename.
 * @param {string} filename The original filename string.
 * @returns {string} The sanitized filename.
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[/\\?%*:|"<>]/g, "-").trim();
}
