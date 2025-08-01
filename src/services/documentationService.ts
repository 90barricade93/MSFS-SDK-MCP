import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export interface DocumentationResult {
  title: string;
  url: string;
  description: string;
  category: string;
  lastUpdated?: string;
}

export interface DocumentationContent {
  title: string;
  content: string;
  codeExamples?: string[];
  relatedLinks?: string[];
}

export class MSFSDocumentationService {
  private baseUrl = 'https://docs.flightsimulator.com';

  // Base search URL using the website's search functionality
  private searchBaseUrl = 'https://docs.flightsimulator.com/html/Introduction/Introduction.htm';

  // Available categories with their corresponding agt parameters
  private categories = {
    'contents': '',
    'index': 'index',
    'glossary': 'glossary',
    'all': 'index' // Default to index for 'all'
  };

  private deriveCategoryFromPath(path: string): string {
    if (path.includes('Aircraft')) return 'aircraft';
    if (path.includes('Scenery')) return 'scenery';
    if (path.includes('SimVars')) return 'simvars';
    if (path.includes('Panel')) return 'panels';
    if (path.includes('Missions')) return 'missions';
    if (path.includes('Packaging')) return 'packaging';
    if (path.includes('Tools')) return 'tools';
    return 'general';
  }

  async searchDocumentation(
    query: string,
    category: string = 'all',
    limit: number = 10
  ): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      // Normalize category
      const normalizedCategory = category.toLowerCase();
      const agtParam = this.categories[normalizedCategory as keyof typeof this.categories] || this.categories.all;

      // Build search URL using the website's search functionality
      let searchUrl = `${this.searchBaseUrl}?rhsearch=${encodeURIComponent(query)}`;
      if (agtParam) {
        searchUrl += `&agt=${agtParam}`;
      }

      console.log(`Searching MSFS docs: ${searchUrl}`);

      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'MSFS-SDK-MCP-Server/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch search results: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      console.log(`Search page loaded, length: ${html.length}`);

      // Extract search results from the page
      const searchResults: DocumentationResult[] = [];

      console.log('Analyzing HTML structure for search results...');

      // Debug: Log some of the HTML to understand the structure
      const bodyText = $('body').text();
      if (bodyText.includes('result(s) found')) {
        console.log('Found search results indicator in page');
      }

      // Try multiple approaches to find search results
      const possibleSelectors = [
        '.search-result',
        '.result-item',
        '.topic',
        '.search-hit',
        '.result',
        'li:contains("Samples, Schemas, Tutorials")',
        'li:contains("How To")',
        'li:contains("Content Configuration")',
        'li:contains("Developer Mode")',
        'div:contains("result(s) found") ~ *',
        'a[href*=".htm"]'
      ];

      // First, try to find structured search results
      for (const selector of possibleSelectors.slice(0, -1)) {
        $(selector).each((i, elem) => {
          if (searchResults.length >= limit) return false;

          const $elem = $(elem);
          const href = $elem.attr('href') || $elem.find('a').attr('href');
          const text = $elem.text().trim();

          if (href && href.includes('.htm') && text) {
            // Clean up the href and construct proper absolute URL
            let cleanHref = href;
            if (href.startsWith('../')) {
              cleanHref = href.replace(/^\.\.\//, '/html/');
            } else if (!href.startsWith('/') && !href.startsWith('http')) {
              cleanHref = `/html/${href}`;
            }

            const absoluteUrl = cleanHref.startsWith('http') ? cleanHref : `${this.baseUrl}${cleanHref}`;

            // Skip if we already have this URL
            if (searchResults.some(r => r.url === absoluteUrl)) {
              return;
            }

            const categoryFromPath = this.deriveCategoryFromPath(href);

            searchResults.push({
              title: text.substring(0, 100), // Limit title length
              url: absoluteUrl,
              description: `Documentation page containing "${query}"`,
              category: categoryFromPath
            });

            console.log(`Found result via ${selector}: ${text.substring(0, 50)}...`);
          }
        });

        if (searchResults.length > 0) {
          console.log(`Found ${searchResults.length} results using selector: ${selector}`);
          break;
        }
      }

      // If no structured results found, fall back to all links
      if (searchResults.length === 0) {
        console.log('No structured results found, trying all links...');

        $('a[href*=".htm"]').each((i, elem) => {
          if (searchResults.length >= limit) return false;

          const $elem = $(elem);
          const href = $elem.attr('href');
          const text = $elem.text().trim();

          if (href && text && text.toLowerCase().includes(query.toLowerCase())) {
            // Clean up the href and construct proper absolute URL
            let cleanHref = href;
            if (href.startsWith('../')) {
              cleanHref = href.replace(/^\.\.\//, '/html/');
            } else if (!href.startsWith('/') && !href.startsWith('http')) {
              cleanHref = `/html/${href}`;
            }

            const absoluteUrl = cleanHref.startsWith('http') ? cleanHref : `${this.baseUrl}${cleanHref}`;

            // Skip if we already have this URL
            if (searchResults.some(r => r.url === absoluteUrl)) {
              return;
            }

            const categoryFromPath = this.deriveCategoryFromPath(href);

            searchResults.push({
              title: text.substring(0, 100),
              url: absoluteUrl,
              description: `Found "${query}" in link text`,
              category: categoryFromPath
            });
          }
        });
      }

      // If no specific search results found, try to extract any documentation links
      if (searchResults.length === 0) {
        $('a[href*=".htm"]').each((i, elem) => {
          if (searchResults.length >= limit) return false;

          const $elem = $(elem);
          const href = $elem.attr('href');
          const text = $elem.text().trim();

          if (href && text && text.toLowerCase().includes(query.toLowerCase())) {
            // Clean up the href and construct proper absolute URL
            let cleanHref = href;
            if (href.startsWith('../')) {
              cleanHref = href.replace(/^\.\.\//, '/html/');
            } else if (!href.startsWith('/') && !href.startsWith('http')) {
              cleanHref = `/html/${href}`;
            }

            const absoluteUrl = cleanHref.startsWith('http') ? cleanHref : `${this.baseUrl}${cleanHref}`;

            // Skip if we already have this URL
            if (searchResults.some(r => r.url === absoluteUrl)) {
              return;
            }

            const categoryFromPath = this.deriveCategoryFromPath(href);

            searchResults.push({
              title: text.substring(0, 100),
              url: absoluteUrl,
              description: `Found "${query}" in link text`,
              category: categoryFromPath
            });
          }
        });
      }

      if (searchResults.length > 0) {
        const formattedResults = searchResults.map((result: DocumentationResult) =>
          `**${result.title}**\n- Category: ${result.category}\n- URL: ${result.url}\n- Description: ${result.description}\n`
        ).join('\n---\n');

        return {
          content: [
            {
              type: 'text',
              text: `Search results for "${query}" in category "${category}":\n\n${formattedResults}`
            },
          ],
        };
      }

      // If still no results, return a message
      return {
        content: [
          {
            type: 'text',
            text: `No results found for "${query}" in category "${category}". The search was performed on the MSFS documentation website.`
          },
        ],
      };

    } catch (error) {
      console.error('Search error:', error);

      return {
        content: [
          {
            type: 'text',
            text: `Error searching MSFS documentation: ${(error as Error).message}. Please try a different search term or check your internet connection.`
          },
        ],
      };
    }
  }

  async getDocumentationContent(
    url: string,
    section?: string
  ): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const fetchResponse = await fetch(url);

      if (!fetchResponse.ok) {
        throw new Error(`Failed to fetch documentation: ${fetchResponse.status}`);
      }

      const html = await fetchResponse.text();
      const $ = cheerio.load(html);

      // Remove navigation and headers
      $('nav, header, footer, .navigation, .toc').remove();

      let contentText = '';
      let title = $('title').text() || 'MSFS SDK Documentation';

      if (section) {
        // Try to find specific section
        const sectionElement = $(`#${section}, .${section}, [data-section="${section}"]`);
        if (sectionElement.length > 0) {
          contentText = sectionElement.text().trim();
        } else {
          contentText = $('main, .content, body').text().trim();
        }
      } else {
        contentText = $('main, .content, body').text().trim();
      }

      // Extract code examples
      const codeExamples: string[] = [];
      $('code, pre').each((_, element) => {
        const code = $(element).text().trim();
        if (code.length > 10) { // Filter out small snippets
          codeExamples.push(code);
        }
      });

      const formattedContent = `**${title}**\n\nURL: ${url}\n\n${contentText.substring(0, 4000)}${contentText.length > 4000 ? '...' : ''}`;

      let finalResponse = formattedContent;

      if (codeExamples.length > 0) {
        finalResponse += '\n\n**Code Examples:**\n';
        codeExamples.slice(0, 3).forEach((example, index) => {
          finalResponse += `\n\nExample ${index + 1}:\n\`\`\`\n${example}\n\`\`\``;
        });
      }

      return {
        content: [
          {
            type: 'text',
            text: finalResponse,
          },
        ],
      };

    } catch (error) {
      throw new Error(`Failed to get documentation content: ${error}`);
    }
  }

  async listCategories(): Promise<{ content: Array<{ type: string; text: string }> }> {
    const categoriesList = [
      '- **contents**: Search in documentation contents',
      '- **index**: Search in documentation index',
      '- **glossary**: Search in documentation glossary',
      '- **all**: Search in all categories (default: index)',
    ].join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Available MSFS SDK Documentation Categories:\n\n${categoriesList}\n\nUsage examples:\n- Search for "livery" in all categories: use category "all" or "index"\n- Search for "livery" in contents: use category "contents"\n- Search for "livery" in glossary: use category "glossary"`,
        },
      ],
    };
  }

  async close() {
    // No browser to close in HTTP version
    return Promise.resolve();
  }

  async listCategoryItems(category: string): Promise<{ content: Array<{ type: string; text: string }> }> {
    const validCategories = ['index', 'contents', 'glossary'];
    if (!validCategories.includes(category)) {
      throw new Error(`Invalid category: ${category}. Must be one of: ${validCategories.join(', ')}`);
    }

    // Embedded data - geen externe bestanden nodig!
    const categoryData = {
      index: [
        'Introduction',
        'SDK Contents',
        'SDK Overview',
        'Using The SDK',
        'SDK EULA',
        'Release Notes',
        'Samples, Schemas, Tutorials and Primers',
        'Developer Mode',
        'Menus',
        'The Project Editor',
        'The Scenery Editor',
        'The Material Editor',
        'The Script Editor',
        'The Aircraft Editor',
        'Aircraft Debug Menu',
        'The Aircraft Tab',
        'The Flight Model Tab',
        'The AI Tab',
        'The Cockpit Tab',
        'The Gameplay Tab',
        'The Engines Tab',
        'The Systems Tab',
        'The Cameras Tab',
        'The Custom Parameters Tab',
        'The Visual Effects Editor',
        'External Asset Creation',
        'Content Configuration',
        'Programming APIs',
        'Additional Information',
        'How To Create An Aircraft',
        'World Hub'
      ],
      contents: [
        'Introduction',
        'SDK Contents',
        'SDK Overview',
        'Using The SDK',
        'SDK EULA',
        'Release Notes',
        'Samples, Schemas, Tutorials and Primers',
        'Developer Mode',
        'Menus',
        'The Project Editor',
        'The Scenery Editor',
        'The Material Editor',
        'The Script Editor',
        'The Aircraft Editor',
        'Aircraft Debug Menu',
        'The Aircraft Tab',
        'The Flight Model Tab',
        'The AI Tab',
        'The Cockpit Tab',
        'The Gameplay Tab',
        'The Engines Tab',
        'The Systems Tab',
        'The Cameras Tab',
        'The Custom Parameters Tab',
        'The Visual Effects Editor',
        'External Asset Creation',
        'Content Configuration',
        'Programming APIs',
        'Additional Information',
        'How To Create An Aircraft',
        'World Hub'
      ],
      glossary: [
        'ADC',
        'add-ons',
        'ADF',
        'ADI',
        'ADPCM',
        'AFM',
        'AGL',
        'AH',
        'AHRS',
        'ambisonic',
        'AMSL',
        'AoA',
        'AOC',
        'API',
        'APU',
        'ATC',
        'BGL',
        'bpp',
        'Camber',
        'CAS',
        'CFD',
        'CG',
        'CGL',
        'Chord',
        'CoL',
        'dB',
        'dBTP',
        'DDS',
        'de-crab',
        'DEM',
        'Dihedral',
        'DME',
        'DoF',
        'DRM',
        'EAS',
        'ECU',
        'EGT',
        'ELT',
        'EPR',
        'FAF',
        'FIS',
        'FL',
        'flaps',
        'FLC',
        'FOV',
        'FSUIPC',
        'ft',
        'ftlbs',
        'GA',
        'Gallon',
        'GDI+',
        'glTF',
        'GPS',
        'GPWS',
        'GUID',
        'hp',
        'hPa',
        'IAF',
        'IAS',
        'ICAO',
        'ICAO code',
        'ICU',
        'IFR',
        'ILS',
        'Incidence',
        'inHg',
        'ISA',
        'ITT',
        'kcas',
        'kias',
        'Knot',
        'ktas',
        'lbf',
        'lbs',
        'LDA',
        'LKFS',
        'LOD',
        'LU',
        'MAC',
        'Mach',
        'Makefile',
        'MFD',
        'MOI',
        'mph',
        'MSL',
        'MTOW',
        'N1',
        'N2',
        'NDB',
        'nm',
        'OOI',
        'OSM',
        'Oswald Efficiency Factor',
        'Pa',
        'pbh',
        'PBR',
        'PCM',
        'Percent Over 100',
        'PFD',
        'PID',
        'POH',
        'POI',
        'psf',
        'psi',
        'quadkey',
        'Rankine',
        'RNAV',
        'ROC',
        'RPM',
        'RTO',
        'RTPC',
        'SDF',
        'slug',
        'Slug sqft',
        'sqft',
        'STOL',
        'Sweep',
        'Tacan',
        'TAS',
        'TCAS',
        'TIN',
        'TOGA',
        'Twist',
        'UI',
        'VASI',
        'VFR',
        'VFS',
        'VMO',
        'VOR',
        'WASM',
        'WEP',
        'Zulu Time'
      ]
    };

    const items = categoryData[category as keyof typeof categoryData];
    
    return {
      content: [
        {
          type: 'text',
          text: items.join('\n')
        }
      ]
    };
  }
}
