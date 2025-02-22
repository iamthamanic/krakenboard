
export class LinkParser {
  constructor(private baseUrl: string) {}

  parseLinks(html: string): string[] {
    const links: string[] = [];
    const regex = /href="([^"]+)"/g;
    let match;
    
    while ((match = regex.exec(html)) !== null) {
      const href = match[1];
      if (href.startsWith('/') || href.startsWith(this.baseUrl)) {
        const fullUrl = href.startsWith('/') ? `${this.baseUrl}${href}` : href;
        if (!fullUrl.includes('#') && !fullUrl.endsWith('.pdf')) {
          links.push(fullUrl);
        }
      }
    }
    
    return [...new Set(links)];
  }
}
