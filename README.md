# MSFS SDK MCP Server

[![Node.js](https://img.shields.io/badge/Node.js-18.0+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-purple?style=flat-square)](https://modelcontextprotocol.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)](https://github.com)

A modern, performant MCP server for fast, structured access to Microsoft Flight Simulator SDK documentation via natural language and structured queries.

## 🚀 Features

- ⚡️ **Real-time documentation search** in the official MSFS SDK documentation
- 📚 **Multiple search categories**: contents, index, glossary, all
- 🧠 **Natural language processing**: queries like "Search livery op msfs sdk"
- 📊 **Structured results**: titles, URLs, descriptions, categories
- 📄 **Detailed content retrieval** from specific documentation pages
- 🔌 **Full MCP compatibility** with AI assistants and tools
- 💾 **Embedded data**: no external files needed
- 🛡️ **Robust error handling** and logging

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Language:** TypeScript 5.0
- **Framework:** Model Context Protocol (MCP)
- **HTTP Client:** node-fetch
- **HTML Parser:** Cheerio
- **Browser Automation:** Puppeteer (optional)
- **Build Tool:** TypeScript Compiler

## 📋 Requirements

- Node.js 18.x or higher
- npm 8.x or higher
- TypeScript 5.x

## 🚀 Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/msfs-sdk-mcp.git
    cd msfs-sdk-mcp
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Build the project:**

    ```bash
    npm run build
      ```

4. **Start the server:**

    ```bash
    npm start
    ```

## 🔧 Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `search_msfs_docs` | 🔍 Search MSFS SDK documentation | `query`, `category`, `limit` |
| `get_doc_content` | 📄 Retrieve detailed content | `url`, `section` |
| `list_categories` | 📚 Show all search categories | - |
| `list_category_items` | 📋 List items per category | `category` |
| `natural_language_query` | 🧠 Natural language queries | `query` |

### 🏷️ Search Categories

- `contents` - 📖 Main documentation content
- `index` - 📇 Documentation index entries  
- `glossary` - 📚 Technical terms and definitions
- `all` - 🌐 Search across all categories (default: index)

## 🔌 Integration with AI Assistants

This server works with MCP-compatible AI assistants such as:

- 🤖 **Claude Desktop** - Official MCP support
- 🌊 **Windsurf IDE** - Built-in MCP integration
- 🔧 **Other MCP clients** - All MCP-compatible tools

### ⚙️ Configuration Example

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

## 📁 Project Structure

```plaintext
msfs-sdk-mcp/
├── 📄 package.json             # Dependencies and scripts
├── 📄 tsconfig.json            # TypeScript configuration
├── 📄 README.md               # Project documentation
├── 📄 LICENSE                 # MIT License
├── 📂 src/
│   ├── 📄 index.ts            # 🚀 Main MCP server
│   └── 📂 services/
│       ├── 📄 documentationService.ts  # 🔍 Search logic
│       └── 📄 naturalLanguageService.ts # 🧠 NLP processing
└── 📂 dist/                   # 🏗️ Compiled JavaScript
```

## 🧪 Development & Scripts

| Script | Description | Command |
|--------|-------------|----------|
| 🏗️ **Build** | Compile TypeScript | `npm run build` |
| 👀 **Dev** | Watch mode development | `npm run dev` |
| 🚀 **Start** | Start MCP server | `npm start` |
| 🔍 **Type Check** | TypeScript validation | `npx tsc --noEmit` |

## 📚 API Reference

### 📈 Tool Examples

#### 🔍 search_msfs_docs

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

#### 📋 list_category_items

```json
{
  "name": "list_category_items",
  "arguments": {
    "category": "glossary"
  }
}
```

#### 📄 get_doc_content

```json
{
  "name": "get_doc_content",
  "arguments": {
    "url": "https://docs.flightsimulator.com/html/...",
    "section": "overview"
  }
}
```

### 🌐 Search URL Format

```plaintext
https://docs.flightsimulator.com/html/Introduction/Introduction.htm?rhsearch={query}&agt={category}
```

**Parameters:**

- `{query}` - 🔍 Search term (URL-encoded)
- `{category}` - 🏷️ Optional category (`index`, `glossary`, or empty for contents)

### 📊 Response Format

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

## 🤝 Contributing

1. 🍴 **Fork** this repository
2. 🌱 **Create** a feature branch: `git checkout -b feature-name`
3. ✨ **Implement** and test your changes
4. 📝 **Commit** with clear message: `git commit -am 'Add new feature'`
5. 🚀 **Push** to your branch: `git push origin feature-name`
6. 📩 **Open** a Pull Request

### 📅 Commit Convention

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `refactor:` - Code refactoring
- `test:` - Test additions

## 📄 License

**MIT License** – See [LICENSE](./LICENSE) file for details.

## 📞 Support & Contact

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/msfs-sdk-mcp/issues)
- 📚 **MSFS SDK Docs**: [Official documentation](https://docs.flightsimulator.com)
- ❓ **New issue?** Provide clear information and reproducible steps

## 📅 Changelog

### v1.0.0 - 🎉 Initial Release

- ✨ **Initial release** - Complete MCP server implementation
- 🔍 **Real-time documentation search** - Fast access to MSFS SDK docs
- 📚 **Multiple search categories** - Contents, index, glossary support
- 🧠 **Natural language processing** - Intuitive query processing
- 🔌 **MCP standard support** - Full compatibility
- 💾 **Embedded data** - No external dependencies

---

## ⚠️ Disclaimer

**This is an unofficial tool**, not affiliated with Microsoft or Microsoft Flight Simulator.
Provides access to public documentation via the official MSFS SDK website.

🚀 **Happy Flying!** ✈️

---

<div align="center">

![GitHub forks](https://img.shields.io/github/forks/90barricade93/MSFS_SDK_MCP) &ensp; © 90barricade93 - Aero-AI Solutions &ensp; ![GitHub stars](https://img.shields.io/github/stars/90barricade93/MSFS_SDK_MCP)

</div>
