/**
 * Kit.com (ConvertKit) API integration
 * Uses V3 API (api_secret) to fetch published broadcasts
 *
 * Strategy:
 * 1. GET /v3/broadcasts → returns list with only {id, created_at, subject}
 * 2. GET /v3/broadcasts/:id → returns full broadcast with content, published_at, etc.
 * 3. Filter for published broadcasts only (published_at is not null)
 */

export interface Edition {
  id: number;
  slug: string;
  date: string;
  title: string;
  desc: string;
  tag: string;
  content: string;
  publishedAt: string;
}

const KIT_API_SECRET = process.env.KIT_API_SECRET || '';

/**
 * Fetch the list of all broadcast IDs from V3 API
 */
async function fetchBroadcastIds(): Promise<number[]> {
  if (!KIT_API_SECRET) return [];

  try {
    const url = `https://api.convertkit.com/v3/broadcasts?api_secret=${KIT_API_SECRET}`;
    console.log('[Kit] Fetching broadcast list...');

    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[Kit] List API error ${res.status}: ${body}`);
      return [];
    }

    const data = await res.json();
    const broadcasts = data.broadcasts || [];
    console.log(`[Kit] Found ${broadcasts.length} broadcast IDs`);

    return broadcasts.map((b: any) => b.id);
  } catch (err) {
    console.error('[Kit] List fetch failed:', err);
    return [];
  }
}

/**
 * Fetch a single broadcast by ID (returns full data with content)
 */
async function fetchBroadcastById(id: number): Promise<any | null> {
  try {
    const url = `https://api.convertkit.com/v3/broadcasts/${id}?api_secret=${KIT_API_SECRET}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.broadcast || data;
  } catch {
    return null;
  }
}

/**
 * Fetch all broadcasts with full content, in parallel batches
 */
async function fetchFullBroadcasts(): Promise<any[]> {
  const ids = await fetchBroadcastIds();
  if (ids.length === 0) return [];

  console.log(`[Kit] Fetching ${ids.length} individual broadcasts...`);

  // Fetch in batches of 10 to avoid hammering the API
  const batchSize = 10;
  const allBroadcasts: any[] = [];

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(fetchBroadcastById));
    allBroadcasts.push(...results.filter(Boolean));
  }

  // Filter for published broadcasts only
  const published = allBroadcasts.filter((b) => b.published_at);
  console.log(`[Kit] ${published.length} published out of ${allBroadcasts.length} total`);

  return published;
}

/**
 * Generate a URL-safe slug from a broadcast subject line
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

/**
 * Guess a tag from the subject/content
 */
function guessTag(subject: string, content: string): string {
  const text = `${subject} ${content}`.toLowerCase();
  if (text.includes('framework') || text.includes('model') || text.includes('system')) return 'Framework';
  if (text.includes('case study') || text.includes('story') || text.includes("'s journey")) return 'Case Study';
  if (text.includes('performance') || text.includes('pressure') || text.includes('flow')) return 'Performance';
  return 'Mindset';
}

/**
 * Extract a description/preview from HTML content
 */
function extractDescription(content: string, maxLength = 160): string {
  if (!content) return '';
  const text = content
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
}

/**
 * Format a date string to a readable format
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Transform a raw broadcast into an Edition
 */
function transformBroadcast(b: any): Edition | null {
  const title = b.subject || b.title || b.name || '';
  if (!title) return null;

  const content = b.content || b.body || '';
  const dateStr = b.published_at || b.sent_at || b.send_at || '';
  if (!dateStr) return null;

  const desc = b.description || extractDescription(content);

  return {
    id: b.id,
    slug: slugify(title),
    date: formatDate(dateStr),
    title,
    desc,
    tag: guessTag(title, content),
    content,
    publishedAt: dateStr,
  };
}

/**
 * Get all newsletter editions, sorted newest first
 */
export async function getEditions(): Promise<Edition[]> {
  const broadcasts = await fetchFullBroadcasts();
  console.log(`[Kit] Total published broadcasts: ${broadcasts.length}`);

  const editions = broadcasts
    .map(transformBroadcast)
    .filter((e): e is Edition => e !== null)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  console.log(`[Kit] Editions after transform: ${editions.length}`);
  return editions;
}

/**
 * Get a single edition by slug
 */
export async function getEditionBySlug(slug: string): Promise<Edition | undefined> {
  const editions = await getEditions();
  return editions.find((e) => e.slug === slug);
}

/**
 * Get related editions (excluding the current one)
 */
export async function getRelatedEditions(currentSlug: string, limit = 3): Promise<Edition[]> {
  const editions = await getEditions();
  return editions.filter((e) => e.slug !== currentSlug).slice(0, limit);
}
