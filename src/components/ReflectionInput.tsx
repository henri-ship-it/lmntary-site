'use client';

import { useState, useEffect } from 'react';
import { saveReflection, getReflections } from '@/lib/actions/reflection-actions';

interface Reflection {
  id: string;
  prompt: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  courseSlug: string;
  lessonSlug: string;
  prompt?: string;
  dominantStyle?: string | null;
}

/**
 * Reflection input with saved history.
 * Shows a textarea for the current reflection and a list of past entries.
 */
export default function ReflectionInput({
  courseSlug,
  lessonSlug,
  prompt = 'What\'s one insight or action you\'re taking from this lesson?',
  dominantStyle,
}: Props) {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pastReflections, setPastReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);

  // Load past reflections on mount
  useEffect(() => {
    getReflections(courseSlug, lessonSlug)
      .then((data) => setPastReflections(data as Reflection[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseSlug, lessonSlug]);

  async function handleSave() {
    if (!content.trim() || saving) return;
    setSaving(true);
    setSaved(false);

    try {
      const result = await saveReflection(courseSlug, lessonSlug, content.trim(), prompt);
      if (result.saved) {
        // Add to top of list
        setPastReflections((prev) => [
          {
            id: result.id!,
            prompt,
            content: content.trim(),
            created_at: result.createdAt!,
            updated_at: result.createdAt!,
          },
          ...prev,
        ]);
        setContent('');
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save reflection:', err);
    } finally {
      setSaving(false);
    }
  }

  // Style-specific hints
  const styleHints: Record<string, string> = {
    Dynamo: 'As a Dynamo, think about how you can turn this into immediate action.',
    Analyst: 'As an Analyst, consider what data or evidence supports this insight.',
    Caretaker: 'As a Caretaker, reflect on how this could help the people around you.',
    Energiser: 'As an Energiser, think about who you could share this with.',
  };

  return (
    <div style={{
      marginTop: '40px',
      padding: '32px',
      border: '1px solid var(--color-border-light)',
      background: 'var(--color-surface)',
    }}>
      <h3 style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.12em',
        fontWeight: 600,
        color: 'var(--color-accent)',
        marginBottom: '12px',
      }}>
        Your Reflection
      </h3>

      <p style={{
        fontSize: '15px',
        fontWeight: 600,
        marginBottom: '16px',
        lineHeight: 1.4,
      }}>
        {prompt}
      </p>

      {dominantStyle && styleHints[dominantStyle] && (
        <p style={{
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          marginBottom: '16px',
          fontStyle: 'italic',
        }}>
          {styleHints[dominantStyle]}
        </p>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your reflection here..."
        rows={4}
        style={{
          width: '100%',
          padding: '12px 14px',
          border: '1px solid var(--color-border)',
          borderRadius: '0',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          lineHeight: 1.7,
          color: 'var(--color-text)',
          resize: 'vertical' as const,
          outline: 'none',
          marginBottom: '12px',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={handleSave}
          disabled={saving || !content.trim()}
          className="btn btn--primary"
          style={{ fontSize: '11px', padding: '10px 20px' }}
        >
          {saving ? 'Saving...' : 'Save Reflection'}
        </button>
        {saved && (
          <span style={{
            fontSize: '13px',
            color: 'var(--color-accent)',
            fontWeight: 500,
          }}>
            Saved
          </span>
        )}
      </div>

      {/* Past reflections */}
      {!loading && pastReflections.length > 0 && (
        <div style={{ marginTop: '32px', borderTop: '1px solid var(--color-border-light)', paddingTop: '24px' }}>
          <h4 style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            marginBottom: '16px',
          }}>
            Past Reflections
          </h4>
          {pastReflections.map((r) => (
            <div
              key={r.id}
              style={{
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--color-border-light)',
              }}
            >
              <p style={{
                fontSize: '14px',
                lineHeight: 1.7,
                color: 'var(--color-text)',
                marginBottom: '6px',
              }}>
                {r.content}
              </p>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.04em',
              }}>
                {new Date(r.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
