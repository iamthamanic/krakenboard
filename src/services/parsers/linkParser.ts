
export class LinkParser {
  static extractLinks(html: string, baseUrl: string): string[] {
    const links: string[] = [];
    const regex = /href="([^"]+)"/g;
    let match;
    
    while ((match = regex.exec(html)) !== null) {
      const href = match[1];
      if (href.startsWith('/') || href.startsWith(baseUrl)) {
        const fullUrl = href.startsWith('/') ? `${baseUrl}${href}` : href;
        if (!fullUrl.includes('#') && !fullUrl.endsWith('.pdf')) {
          links.push(fullUrl);
        }
      }
    }
    
    return [...new Set(links)];
  }
}
