export class NaturalLanguageService {
  static parse(command: string): { tool: string; arguments: any } | null {
    // Match "Search [term] op msfs sdk"
    const searchPattern = /^Search\s+(.+?)\s+op\s+msfs\s+sdk\s*$/i;
    const match = command.match(searchPattern);
    
    if (match) {
      const query = match[1];
      return {
        tool: "search_msfs_docs",
        arguments: {
          query: query,
          category: "all",
          limit: 5
        }
      };
    }
    
    // Match "Get content for [url]"
    const contentPattern = /^Get\s+content\s+for\s+(https?:\/\/.+)$/i;
    const contentMatch = command.match(contentPattern);
    
    if (contentMatch) {
      const url = contentMatch[1];
      return {
        tool: "get_doc_content",
        arguments: {
          url: url
        }
      };
    }
    
    // Match "List categories"
    if (command.toLowerCase() === "list categories") {
      return {
        tool: "list_categories",
        arguments: {}
      };
    }
    
    // Match "Show categories"
    if (command.toLowerCase() === "show categories") {
      return {
        tool: "list_categories",
        arguments: {}
      };
    }
    
    // Match "Search [term] in [category]"
    const categorySearchPattern = /^Search\s+(.+?)\s+in\s+(aircraft|scenery|simvars|panels|missions|packaging|tools|general)$/i;
    const categoryMatch = command.match(categorySearchPattern);
    
    if (categoryMatch) {
      const query = categoryMatch[1];
      const category = categoryMatch[2].toLowerCase();
      return {
        tool: "search_msfs_docs",
        arguments: {
          query: query,
          category: category,
          limit: 5
        }
      };
    }
    
    return null; // Onbekend commando
  }
}
