
const PROXY_URL = "https://api.allorigins.win/raw?url=";

export async function fetchWithProxy(url: string): Promise<string> {
  const response = await fetch(PROXY_URL + encodeURIComponent(url));
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.text();
}
