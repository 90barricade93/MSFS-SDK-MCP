#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { MSFSDocumentationService } from './services/documentationService.js';
import { NaturalLanguageService } from './services/naturalLanguageService.js';

class MSFSSDKServer {
  private server: Server;
  private documentationService: MSFSDocumentationService;

  constructor() {
    this.server = new Server(
      {
        name: 'msfs-sdk-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.documentationService = new MSFSDocumentationService();
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_msfs_docs',
            description: 'Search MSFS SDK documentation for specific topics',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query for MSFS SDK documentation',
                },
                category: {
                  type: 'string',
                  description: 'Optional category filter (e.g., "contents", "index", "glossary")',
                  enum: ['contents', 'index', 'glossary', 'all']
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of results to return',
                  minimum: 1,
                  maximum: 20,
                  default: 10
                }
              },
              required: ['query']
            }
          },
          {
            name: 'get_doc_content',
            description: 'Get detailed content from a specific MSFS SDK documentation page',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'URL of the documentation page to retrieve',
                },
                section: {
                  type: 'string',
                  description: 'Specific section to extract (e.g., "overview", "examples", "api-reference")',
                }
              },
              required: ['url']
            }
          },
          {
            name: 'list_categories',
            description: 'List all available MSFS SDK documentation categories',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'natural_language_query',
            description: 'Process natural language queries like "Search livery op msfs sdk"',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Natural language query (e.g., "Search livery op msfs sdk")',
                }
              },
              required: ['query']
            }
          },
          {
            name: 'list_category_items',
            description: 'Returns all items for a given documentation category',
            inputSchema: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  description: 'Category to list items from (index, contents, or glossary)',
                  enum: ['index', 'contents', 'glossary']
                }
              },
              required: ['category']
            }
          }
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_msfs_docs':
            if (!args?.query) {
              throw new Error('Query parameter is required');
            }
            return await this.documentationService.searchDocumentation(
              String(args.query),
              String(args.category || 'all'),
              Number(args.limit || 10)
            );

          case 'get_doc_content':
            if (!args?.url) {
              throw new Error('URL parameter is required');
            }
            return await this.documentationService.getDocumentationContent(
              String(args.url),
              args.section ? String(args.section) : undefined
            );

          case 'list_categories':
            return await this.documentationService.listCategories();

          case 'natural_language_query':
            if (!args?.query) {
              throw new Error('Query parameter is required');
            }

            // Parse the natural language query
            const parsedCommand = NaturalLanguageService.parse(String(args.query));

            if (!parsedCommand) {
              throw new Error(`Could not parse natural language query: ${args.query}`);
            }

            // Execute the parsed command
            switch (parsedCommand.tool) {
              case 'search_msfs_docs':
                return await this.documentationService.searchDocumentation(
                  String(parsedCommand.arguments.query),
                  String(parsedCommand.arguments.category || 'all'),
                  Number(parsedCommand.arguments.limit || 10)
                );

              case 'get_doc_content':
                return await this.documentationService.getDocumentationContent(
                  String(parsedCommand.arguments.url),
                  parsedCommand.arguments.section ? String(parsedCommand.arguments.section) : undefined
                );

              case 'list_categories':
                return await this.documentationService.listCategories();

              default:
                throw new Error(`Unknown parsed tool: ${parsedCommand.tool}`);
            }

          case 'list_category_items':
            if (!args?.category) {
              throw new Error('Category parameter is required');
            }
            return await this.documentationService.listCategoryItems(String(args.category));

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MSFS SDK MCP server running on stdio');
  }
}

const server = new MSFSSDKServer();
server.run().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
