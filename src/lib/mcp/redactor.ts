/**
 * @fileOverview PII Redaction for MCP Tool outputs.
 * Masks sensitive financial fragments before they reach the LLM layer.
 */

export function redactPII(data: any): { redactedData: any; redactionCount: number } {
  let count = 0;
  const sensitiveRegex = {
    creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phoneNumber: /\b(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/g,
  };

  const traverseAndRedact = (obj: any): any => {
    if (typeof obj === 'string') {
      let redacted = obj;
      Object.entries(sensitiveRegex).forEach(([_, regex]) => {
        const matches = redacted.match(regex);
        if (matches) {
          count += matches.length;
          redacted = redacted.replace(regex, '[REDACTED]');
        }
      });
      return redacted;
    } else if (Array.isArray(obj)) {
      return obj.map(traverseAndRedact);
    } else if (typeof obj === 'object' && obj !== null) {
      const newObj: any = {};
      for (const key in obj) {
        newObj[key] = traverseAndRedact(obj[key]);
      }
      return newObj;
    }
    return obj;
  };

  return {
    redactedData: traverseAndRedact(data),
    redactionCount: count,
  };
}
