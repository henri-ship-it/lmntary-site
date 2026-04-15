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
 * Fetch ALL broadcast IDs from V3 API (paginated)
 * V3 returns 50 per page by default, sorted oldest first.
 * We paginate through all pages to get every broadcast.
 */
async function fetchBroadcastIds(): Promise<number[]> {
  if (!KIT_API_SECRET) return [];

  const allIds: number[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const url = `https://api.convertkit.com/v3/broadcasts?api_secret=${KIT_API_SECRET}&page=${page}&per_page=50`;
      console.log(`[Kit] Fetching broadcast list page ${page}...`);

      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 },
      });

      if (!res.ok) {
        const body = await res.text();
        console.error(`[Kit] List API error ${res.status}: ${body}`);
        break;
      }

      const data = await res.json();
      const broadcasts = data.broadcasts || [];
      console.log(`[Kit] Page ${page}: ${broadcasts.length} broadcasts`);

      if (broadcasts.length === 0) {
        hasMore = false;
      } else {
        allIds.push(...broadcasts.map((b: any) => b.id));
        page++;
        // Safety: stop after 20 pages (1000 broadcasts max)
        if (page > 20) hasMore = false;
      }
    } catch (err) {
      console.error('[Kit] List fetch failed:', err);
      break;
    }
  }

  console.log(`[Kit] Total broadcast IDs found: ${allIds.length}`);
  return allIds;
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

  // Filter for published AND public broadcasts only
  // "public" flag = shown on Kit.com profile /posts page
  const published = allBroadcasts.filter((b) => b.published_at && b.public === true);
  console.log(`[Kit] ${published.length} public+published out of ${allBroadcasts.length} total`);

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
 * Strip email wrapper cruft from Kit.com HTML content.
 * Kit.com broadcasts are full email HTML with table layouts,
 * style blocks, header images, and tracking pixels.
 *
 * Structure:
 * - <style> blocks (email CSS)
 * - First ck-section div = header/banner image (alt="Header Image")
 * - Subsequent ck-section divs = actual newsletter content
 * - Wrapped in black background table layout
 */
function cleanEmailContent(html: string): string {
  if (!html) return '';
  return html
    // Remove all <style> blocks
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // Remove HTML comments (including conditional Outlook comments like <!--[if mso]>)
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove the first ck-section (header/banner image section)
    // It contains the branded logo/Mindset Matters image
    .replace(/<div[^>]*class="ck-section"[^>]*>[\s\S]*?<\/div>\s*(?=<div[^>]*class="ck-section")/i, '')
    // Remove any remaining images with alt="Header Image"
    .replace(/<figure[^>]*>[\s\S]*?<img[^>]*alt=["']Header Image["'][^>]*>[\s\S]*?<\/figure>/gi, '')
    .replace(/<img[^>]*alt=["']Header Image["'][^>]*>/gi, '')
    // Remove images from embed.filekitcdn.com that are the header logo (small images ≤80px)
    .replace(/<figure[^>]*>[\s\S]*?<img[^>]*width=["']?(?:[1-9]|[1-7]\d|80)["']?[^>]*embed\.filekitcdn\.com[^>]*>[\s\S]*?<\/figure>/gi, '')
    // Remove tracking pixels
    .replace(/<img[^>]*(?:width=["']?1["']?|height=["']?1["']?|tracking|beacon|open\.convertkit)[^>]*>/gi, '')
    // Remove Unsubscribe / Preferences footer links and surrounding section
    .replace(/<[^>]*>[\s]*(?:Unsubscribe|Preferences|Update your profile|Powered by Kit)[\s]*<\/[^>]+>/gi, '')
    .replace(/Unsubscribe\s*[·|•]\s*Preferences/gi, '')
    .replace(/Unsubscribe/gi, '')
    .replace(/Preferences/gi, '')
    // Remove "Powered by" links
    .replace(/<a[^>]*kit\.com[^>]*>[\s\S]*?<\/a>/gi, '')
    .trim();
}

/**
 * Decode all HTML entities (named and numeric)
 */
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013')
    .replace(/&hellip;/g, '\u2026')
    // Decode hex entities like &#x27; &#x2019; etc.
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    // Decode decimal entities like &#39; &#8217; etc.
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
}

/**
 * Extract a description/preview from HTML content
 */
function extractDescription(content: string, maxLength = 160): string {
  if (!content) return '';
  const text = content
    // Remove style blocks first (before stripping tags)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove all HTML tags
    .replace(/<[^>]+>/g, '')
    // Decode all HTML entities
    .replace(/\s+/g, ' ')
    .trim();

  const decoded = decodeHtmlEntities(text);

  if (decoded.length <= maxLength) return decoded;
  const truncated = decoded.slice(0, maxLength);
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

  const rawContent = b.content || b.body || '';
  const content = cleanEmailContent(rawContent);
  const dateStr = b.published_at || b.sent_at || b.send_at || '';
  if (!dateStr) return null;

  const desc = b.description || extractDescription(rawContent);

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
