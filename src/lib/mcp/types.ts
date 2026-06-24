/**
 * @fileOverview MCP (Model Context Protocol) type definitions.
 * Discriminated unions for tool execution results and secure banking logic.
 */

import { z } from 'zod';

export type Model<TName extends string, TProps extends Record<string, any>> = {
  type: TName;
} & TProps;

export type ToolSuccess<T> = Model<
  'success',
  { data: T; total?: number; aggregations?: Record<string, any> }
>;

export type ToolError = Model<'error', { error: string }>;

export type ToolResult<T> = ToolSuccess<T> | ToolError;

export const ElasticSearchInputSchema = z.object({
  index: z.string().describe('The Elasticsearch index to query.'),
  query: z.record(z.any()).describe('The query DSL object.'),
  size: z.number().optional().default(10),
});

export type ElasticSearchInput = z.infer<typeof ElasticSearchInputSchema>;

export interface MCPToolDefinition<TInput, TOutput> {
  name: string;
  description: string;
  inputSchema: z.ZodType<TInput>;
  execute: (input: TInput) => Promise<ToolResult<TOutput>>;
}
