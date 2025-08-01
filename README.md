# MSFS SDK MCP Server

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E=18.0-blue.svg)](https://nodejs.org/)

A Model Context Protocol (MCP) server for fast, structured access to the Microsoft Flight Simulator SDK documentation via natural language and structured queries.

---

## Features

- **Real-time documentation search** on the official MSFS SDK documentation
- **Multiple search categories**: contents, index, glossary, all
- **Natural language processing**: queries like "Search livery op msfs sdk"
- **Structured results**: titles, URLs, descriptions, categories
- **Detailed content retrieval** from specific documentation pages
- **Full MCP compatibility** with AI assistants and tools

## Installation

### Requirements

- Node.js 18+
- npm (or yarn)

### Setup

1. Download or clone this project:

    ```bash
    # If you have a git repository:
    git clone <your-repository-url>
    cd msfs-sdk-mcp
    
    # Or download and extract the project files
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Build the project:

    ```bash
    npm run build
    ```

4. Start the server:

    ```bash
    npm start
    ```

## Usage

### Available tools

- **search_msfs_docs**: Search the MSFS SDK documentation
- **get_doc_content**: Retrieve detailed content from a documentation page
- **list_categories**: Show all search categories
- **list_category_items**: List all items within a specific category (index, contents, glossary)
- **natural_language_query**: Execute natural language queries

See the “API Reference” section below for example API calls.

### Search categories

- `contents`: Main documentation content
- `index`: Documentation index entries
- `glossary`: Technical terms and definitions
- `all`: Search across all categories (default: index)

## Integration with AI assistants

This server works with MCP-compatible AI assistants such as:

- Claude Desktop
- Windsurf IDE

Configuration example:

```json
{
  "mcpServers": {
    "msfs-sdk": {
      "command": "node",
      "args": ["path/to/msfs-sdk-mcp/dist/index.js"]
    }
  }
}
```

## Project structure

```plaintext
src/
├── index.ts                    # Main server implementation
└── services/
    ├── documentationService.ts # Documentation search logic
    └── naturalLanguageService.ts # Natural language processing
```

## Development

- Build: `npm run build`
- Development mode: `npm run dev`

## API Reference

### Tool Examples

#### search_msfs_docs

```json
{
  "name": "search_msfs_docs",
  "arguments": {
    "query": "livery",
    "category": "all",
    "limit": 10
  }
}
```

#### list_category_items

```json
{
  "name": "list_category_items",
  "arguments": {
    "category": "glossary"
  }
}
```

#### get_doc_content

```json
{
  "name": "get_doc_content",
  "arguments": {
    "url": "https://docs.flightsimulator.com/html/...",
    "section": "overview"
  }
}
```

### Search URL format

```plaintext
https://docs.flightsimulator.com/html/Introduction/Introduction.htm?rhsearch={query}&agt={category}
```

- `{query}`: search term (URL-encoded)
- `{category}`: optional category (`index`, `glossary`, or empty for contents)

### Response format

```json
{
  "content": [
    {
      "type": "text",
      "text": "**Title**\n- Category: category\n- URL: url\n- Description: description"
    }
  ]
}
```

## Contributing

1. Fork this repository
2. Create a feature branch: `git checkout -b feature-name`
3. Implement and test your changes
4. Commit: `git commit -am 'Add new feature'`
5. Push: `git push origin feature-name`
6. Open a pull request

## License

MIT License – see the [LICENSE file](./LICENSE) for details.

## Support

- Check the [Issues](../../issues)
- Consult the official MSFS SDK documentation
- New issue? Please provide clear information

## Changelog

### v1.0.0

- Initial release
- Real-time documentation search
- Multiple search categories
- Natural language processing
- MCP standard support

---

**Note:** This is an unofficial tool, not affiliated with Microsoft or Microsoft Flight Simulator. Provides access to public documentation via the official MSFS SDK website.

## Contact

90barricade93  – All rights reserved – 2025
