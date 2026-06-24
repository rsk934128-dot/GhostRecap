/**
 * @fileOverview Elastic PII Proxy.
 * Acts as a middleware between LLM Agents and the Native Elastic MCP server.
 * Implements Stage 1 Regex Redaction and Structured Auditing.
 */

import { redactPII } from './redactor';
import { logAuditTrial } from './audit';
import { ToolResult } from './types';

/**
 * Wraps a tool execution with security protocols.
 */
export async function executeProxiedTool<T>(
  toolName: string,
  parameters: any,
  executionFn: () => Promise<ToolResult<T>>
): Promise<ToolResult<T>> {
  const startTime = Date.now();
  
  try {
    // 1. Execute the native tool
    const result = await executionFn();

    if (result.type === 'success') {
      // 2. Perform PII Redaction on the data fragment
      const { redactedData, redactionCount } = redactPII(result.data);
      
      const executionTime = Date.now() - startTime;

      // 3. Log Structured Audit Trial
      logAuditTrial({
        tool: toolName,
        status: 'success',
        executionTimeMs: executionTime,
        redactionCount,
        parameters: JSON.stringify(parameters).substring(0, 100),
      });

      return {
        ...result,
        data: redactedData,
      };
    }

    return result;
  } catch (error: any) {
    logAuditTrial({
      tool: toolName,
      status: 'error',
      executionTimeMs: Date.now() - startTime,
      redactionCount: 0,
      parameters: JSON.stringify(parameters),
    });
    
    return {
      type: 'error',
      error: error.message || 'Node execution failed in proxy layer.',
    };
  }
}
