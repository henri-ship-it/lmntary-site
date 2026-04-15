/**
 * Kit.com (ConvertKit) V4 API integration
 * Fetches published broadcasts for the newsletter pages
 */

export interface Broadcast {
  id: number;
  created_at: string;
  subject: string;
  description: string | null;
  content: string;
  public: boolean;
  published_at: string | null;
  send_at: string | null;
  thumbnail_alt: string | null;
  thumbnail_url: string | null;
  email_address: string | null;
  email_layout_template: string | null;
  preview_text: string | null;
}

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
 * Fetch all published broadcasts from Kit.com
 */
async function fetchBroadcasts(): Promise<Broadcast[]> {
  if (!KIT_API_KEY) {
    console.warn('KIT_API_KEY not set, returning empty broadcasts');
    return [];
  }

  const allBroadcasts: Broadcast[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const res = await fetch(
        `${KIT_API_BASE}/broadcasts?page=${page}&per_page=50&sort_order=desc`,
        {
          headers: {
            Authorization: `Bearer ${KIT_API_KEY}`,
            Accept: 'application/json',
          },
          next: { revalidate: 3600 }, // Revalidate every hour
        }
      );

      if (!res.ok) {
        console.error(`Kit.com API error: ${res.status} ${res.statusText}`);
        break;
      }

      const data = await res.json();
      const broadcasts: Broadcast[] = data.broadcasts || [];

      if (broadcasts.length === 0) {
        hasMore = false;
      } else {
        allBroadcasts.push(...broadcasts);
        // If we got fewer than 50, we're on the last page
        if (broadcasts.length < 50) {
          hasMore = false;
        }
        page++;
      }
    } catch (err) {
      console.error('Kit.com API fetch failed:', err);
      break;
    }
  }

  // Only return published/sent broadcasts
  return allBroadcasts.filter(
    (b) => b.published_at || b.send_at
  );
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
 * Can be refined later with Kit.com tags or manual mapping
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
  // Strip HTML tags
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

  // Cut at last space before maxLength
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
 * Transform raw broadcasts into Edition objects for the site
 */
function transformBroadcast(broadcast: Broadcast): Edition {
  const dateStr = broadcast.published_at || broadcast.send_at || broadcast.created_at;

  return {
    id: broadcast.id,
    slug: slugify(broadcast.subject),
    date: formatDate(dateStr),
    title: broadcast.subject,
    desc: broadcast.preview_text || extractDescription(broadcast.content),
    tag: guessTag(broadcast.subject, broadcast.content),
    content: broadcast.content,
    publishedAt: dateStr,
  };
}

/**
 * Get all newsletter editions, sorted newest first
 * Uses ISR - revalidates every hour
 */
export async function getEditions(): Promise<Edition[]> {
  const broadcasts = await fetchBroadcasts();

  return broadcasts
    .map(transformBroadcast)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
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
