/**
 * Kit.com (ConvertKit) API integration
 * Supports both V3 (api_secret) and V4 (Bearer token)
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

const KIT_API_SECRET = process.env.KIT_API_SECRET || '';
const KIT_API_KEY = process.env.KIT_API_KEY || '';

/**
 * Fetch broadcasts using V3 API (uses api_secret as query param)
 * V3 endpoint: GET https://api.convertkit.com/v3/broadcasts?api_secret=XXX
 */
async function fetchBroadcastsV3(): Promise<any[]> {
  if (!KIT_API_SECRET) return [];

  try {
    const url = `https://api.convertkit.com/v3/broadcasts?api_secret=${KIT_API_SECRET}`;
    console.log('[Kit V3] Fetching broadcasts...');

    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[Kit V3] API error ${res.status}: ${body}`);
      return [];
    }

    const data = await res.json();
    console.log(`[Kit V3] Response keys: ${Object.keys(data).join(', ')}`);

    // V3 returns { broadcasts: [...] }
    const broadcasts = data.broadcasts || [];
    console.log(`[Kit V3] Got ${broadcasts.length} broadcasts`);

    if (broadcasts.length > 0) {
      console.log(`[Kit V3] First broadcast keys: ${Object.keys(broadcasts[0]).join(', ')}`);
    }

    return broadcasts;
  } catch (err) {
    console.error('[Kit V3] Fetch failed:', err);
    return [];
  }
}

/**
 * Fetch broadcasts using V4 API (uses Bearer token)
 */
async function fetchBroadcastsV4(): Promise<any[]> {
  if (!KIT_API_KEY) return [];

  const allBroadcasts: any[] = [];
  let cursor: string | null = null;
  let hasMore = true;

  while (hasMore) {
    try {
      let url = `https://api.kit.com/v4/broadcasts?per_page=50`;
      if (cursor) {
        url += `&after=${encodeURIComponent(cursor)}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${KIT_API_KEY}`,
          Accept: 'application/json',
        },
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        const body = await res.text();
        console.error(`[Kit V4] API error ${res.status}: ${body}`);
        break;
      }

      const data = await res.json();
      const broadcasts = data.broadcasts || data.data || [];
      const pagination = data.pagination || {};

      allBroadcasts.push(...broadcasts);

      if (pagination.has_next_page && pagination.end_cursor) {
        cursor = pagination.end_cursor;
      } else {
        hasMore = false;
      }
    } catch (err) {
      console.error('[Kit V4] Fetch failed:', err);
      break;
    }
  }

  return allBroadcasts;
}

/**
 * Fetch broadcasts - tries V3 first (more reliable), falls back to V4
 */
async function fetchBroadcasts(): Promise<any[]> {
  // Try V3 first (simpler, more reliable)
  const v3 = await fetchBroadcastsV3();
  if (v3.length > 0) return v3;

  // Fall back to V4
  const v4 = await fetchBroadcastsV4();
  return v4;
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
 */
function transformBroadcast(b: any): Edition | null {
  const title = b.subject || b.title || b.name || '';
  if (!title) return null;

  const content = b.content || b.body || b.email_content || '';
  const dateStr = b.published_at || b.sent_at || b.send_at || b.created_at || '';
  if (!dateStr) return null;

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
