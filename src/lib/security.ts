/**
 * @fileOverview Security utilities for PCI-DSS compliance.
 * Handles data masking and secure tokenization for the MDB Core Nexus.
 */

/**
 * Masks sensitive data like card numbers or PII.
 * @param value The raw sensitive string.
 * @param visibleCount Number of visible characters at the end.
 */
export function maskSensitiveData(value: string, visibleCount: number = 4): string {
  if (!value || value.length <= visibleCount) return value;
  const maskedLength = value.length - visibleCount;
  return '•'.repeat(maskedLength) + value.slice(-visibleCount);
}

/**
 * Generates a secure, idempotent token for transaction mapping.
 * In a real scenario, this would involve HMAC or a vault service.
 */
export function generateSecureToken(payload: string): string {
  const hash = btoa(payload).substring(0, 16).toUpperCase();
  return `NEXUS_TK_${hash}`;
}

/**
 * Validates if a string matches a masked pattern.
 */
export function isMasked(value: string): boolean {
  return value.includes('•');
}
