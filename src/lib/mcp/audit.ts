/**
 * @fileOverview Structured Audit Logging for MCP Proxy.
 * Logs execution metadata for compliance (GDPR/DORA).
 */

export interface AuditLogEntry {
  tool: string;
  status: 'success' | 'error';
  executionTimeMs: number;
  redactionCount: number;
  parameters: string;
}

/**
 * Logs a structured audit trail to the stderr stream.
 */
export function logAuditTrial(entry: AuditLogEntry) {
  const timestamp = new Date().toISOString();
  const logMsg = JSON.stringify({
    timestamp,
    ...entry,
    module: 'ELASTIC-PII-PROXY',
  });
  
  // In a real environment, this would go to a secure logging node
  console.log(`[AUDIT] ${logMsg}`);
}
