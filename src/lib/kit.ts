/**
 * Kit.com (ConvertKit) V4 API integration
 * Fetches published broadcasts for the newsletter pages
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

const KIT_API_KEY = process.env.KIT_API_KEY || '';
const KIT_API_BASE = 'https://api.kit.com/v4';

/**
 * Fetch all broadcasts from Kit.com V4 API
 * V4 uses cursor-based pagination (after/before), not page numbers
 */
async function fetchBroadcasts(): Promise<any[]> {
  if (!KIT_API_KEY) {
    console.warn('[Kit] KIT_API_KEY not set, returning empty broadcasts');
    return [];
  }

  const allBroadcasts: any[] = [];
  let cursor: string | null = null;
  let hasMore = true;

  while (hasMore) {
    try {
      let url = `${KIT_API_BASE}/broadcasts?per_page=50`;
      if (cursor) {
        url += `&after=${encodeURIComponent(cursor)}`;
      }

      console.log(`[Kit] Fetching: ${url}`);

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${KIT_API_KEY}`,
          Accept: 'application/json',
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        const body = await res.text();
        console.error(`[Kit] API error ${res.status}: ${body}`);
        break;
      }

      const data = await res.json();

      // Log the response structure so we can debug
      console.log(`[Kit] Response keys: ${Object.keys(data).join(', ')}`);

      // V4 returns { broadcasts: [...], pagination: { ... } }
      const broadcasts = data.broadcasts || data.data || [];
      const pagination = data.pagination || {};

      console.log(`[Kit] Got ${broadcasts.length} broadcasts`);

      if (broadcasts.length > 0) {
        // Log first broadcast keys to understand the shape
        console.log(`[Kit] Broadcast keys: ${Object.keys(broadcasts[0]).join(', ')}`);
      }

      allBroadcasts.push(...broadcasts);

      // Cursor-based pagination
      if (pagination.has_next_page && pagination.end_cursor) {
        cursor = pagination.end_cursor;
      } else {
        hasMore = false;
      }
    } catch (err) {
      console.error('[Kit] Fetch failed:', err);
      break;
    }
  }

  return allBroadcasts;
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
 * Transform a raw broadcast (any shape) into an Edition
 * Handles multiple possible field names from the API
 */
function transformBroadcast(b: any): Edition | null {
  // Try different field names for the subject/title
  const title = b.subject || b.title || b.name || '';
  if (!title) return null;

  // Try different field names for content
  const content = b.content || b.body || b.email_content || '';

  // Try different field names for dates
  const dateStr = b.published_at || b.sent_at || b.send_at || b.created_at || '';
  if (!dateStr) return null;

  // Try different field names for description/preview
  const desc = b.preview_text || b.description || extractDescription(content);

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
 * Uses ISR - revalidates every hour
 */
export async function getEditions(): Promise<Edition[]> {
  const broadcasts = await fetchBroadcasts();
  console.log(`[Kit] Total broadcasts fetched: ${broadcasts.length}`);

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
