import { useEffect, useId, useRef, useState } from 'react';

interface CommentRow {
  id: string;
  author: string;
  body: string;
  created_at: number;
}

type Props = {
  nodeId: string;
  laneColor: string;
  open: boolean;
};

// Turnstile test-mode sitekey (always passes). Replace with your real sitekey in production.
const SITEKEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA';

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

export default function Comments({ nodeId, laneColor, open }: Props) {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const widgetIdRef = useRef<string | null>(null);
  const turnstileContainerId = useId();

  // Fetch comments when dialog opens.
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`/api/comments?nodeId=${encodeURIComponent(nodeId)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json() as Promise<CommentRow[]>;
      })
      .then((data) => setComments(data))
      .catch(() => {
        // API not available in local dev without `wrangler pages dev` — silently show empty.
        setComments([]);
      })
      .finally(() => setLoading(false));
  }, [open, nodeId]);

  // Render Turnstile widget after dialog opens.
  useEffect(() => {
    if (!open) return;
    const safeId = turnstileContainerId.replace(/:/g, '-');
    const interval = setInterval(() => {
      if (!window.turnstile) return;
      const container = document.getElementById(safeId);
      if (!container || container.childElementCount > 0) {
        clearInterval(interval);
        return;
      }
      clearInterval(interval);
      const id = window.turnstile.render(container, {
        sitekey: SITEKEY,
        theme: 'dark',
        size: 'compact',
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
      });
      widgetIdRef.current = id;
    }, 200);

    return () => {
      clearInterval(interval);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
        setTurnstileToken('');
      }
    };
  }, [open, turnstileContainerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !body.trim()) return;
    if (!turnstileToken) {
      setSubmitError('Please complete the bot check.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeId,
          author: author.trim(),
          body: body.trim(),
          token: turnstileToken,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `${res.status}`);
      }
      const newComment = (await res.json()) as CommentRow;
      setComments((prev) => [...prev, newComment]);
      setBody('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken('');
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to post. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const safeId = turnstileContainerId.replace(/:/g, '-');

  return (
    <div className="mt-6">
      <div className="mb-3 text-[11px] uppercase tracking-[0.25em] text-ink-500">
        Notes &amp; Comments
      </div>

      {loading ? (
        <div className="text-xs text-ink-500">Loading…</div>
      ) : comments.length === 0 ? (
        <div className="text-xs text-ink-500 italic">No notes yet. Be the first.</div>
      ) : (
        <ul className="mb-4 space-y-2">
          {comments.map((c) => (
            <li
              key={c.id}
              className="rounded-lg border border-ink-800 bg-ink-950/50 px-3 py-2"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-ink-100">{c.author}</span>
                <span className="text-[11px] text-ink-500">{relativeTime(c.created_at)}</span>
              </div>
              <div className="mt-1 text-[13px] leading-relaxed text-ink-300">{c.body}</div>
            </li>
          ))}
        </ul>
      )}

      {/* Post form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={60}
          required
          className="w-full rounded-lg border border-ink-700 bg-ink-950/60 px-3 py-2 text-sm text-ink-100 placeholder-ink-500 outline-none focus:border-ink-500 transition"
        />
        <textarea
          placeholder="Leave a note, memory, or question…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={2000}
          required
          rows={3}
          className="w-full resize-none rounded-lg border border-ink-700 bg-ink-950/60 px-3 py-2 text-sm text-ink-100 placeholder-ink-500 outline-none focus:border-ink-500 transition"
        />
        <div className="flex items-center gap-3">
          <div id={safeId} className="shrink-0" />
          <button
            type="submit"
            disabled={submitting || !turnstileToken}
            className="rounded-lg px-4 py-1.5 text-sm font-medium text-ink-950 transition disabled:opacity-40"
            style={{ background: laneColor }}
          >
            {submitting ? 'Posting…' : submitted ? 'Posted!' : 'Post note'}
          </button>
        </div>
        {submitError && (
          <div className="text-xs text-red-400">{submitError}</div>
        )}
      </form>
    </div>
  );
}
