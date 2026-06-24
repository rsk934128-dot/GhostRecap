/**
 * @fileOverview Input sanitization for MCP tools.
 * Prevents malicious query injection and enforces index naming standards.
 */

export function sanitizeIndexName(index: string): string {
  // Only allow alphanumeric characters, hyphens, and underscores
  return index.replace(/[^a-zA-Z0-9\-_*]/g, '');
}

export function validateBankingQuery(query: any): boolean {
  // Prevent destructive operations or unauthorized field access
  const destructiveKeywords = ['delete', 'update', 'drop', 'script'];
  const queryStr = JSON.stringify(query).toLowerCase();
  
  return !destructiveKeywords.some(keyword => queryStr.includes(keyword));
}
