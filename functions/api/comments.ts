/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
  TURNSTILE_SECRET: string;
}

interface Comment {
  id: string;
  node_id: string;
  author: string;
  body: string;
  created_at: number;
}

interface PostBody {
  nodeId: string;
  author: string;
  body: string;
  token: string;
}

interface TurnstileResponse {
  success: boolean;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const nodeId = url.searchParams.get('nodeId');
  if (!nodeId) {
    return new Response('Missing nodeId', { status: 400 });
  }

  const { results } = await env.DB.prepare(
    'SELECT id, author, body, created_at FROM comments WHERE node_id = ? AND hidden = 0 ORDER BY created_at ASC LIMIT 200',
  )
    .bind(nodeId)
    .all<Comment>();

  return Response.json(results, {
    headers: { 'Cache-Control': 'public, max-age=10' },
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: PostBody;
  try {
    body = await request.json<PostBody>();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (!body.nodeId || !body.author || !body.body || !body.token) {
    return new Response('Missing fields', { status: 400 });
  }
  if (body.author.trim().length > 60) {
    return new Response('Author name too long (max 60)', { status: 400 });
  }
  if (body.body.trim().length > 2000) {
    return new Response('Message too long (max 2000)', { status: 400 });
  }
  if (body.author.trim().length === 0 || body.body.trim().length === 0) {
    return new Response('Fields cannot be empty', { status: 400 });
  }

  // Verify Turnstile.
  const tsRes = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET,
        response: body.token,
      }),
    },
  );
  const tsData = await tsRes.json<TurnstileResponse>();
  if (!tsData.success) {
    return new Response('Bot check failed', { status: 403 });
  }

  // Rate-limit: 5 posts per SHA-256(ip+ua) per hour.
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const ua = request.headers.get('User-Agent') ?? '';
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(ip + ua),
  );
  const ipHash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const oneHourAgo = Date.now() - 3_600_000;
  const rateResult = await env.DB.prepare(
    'SELECT COUNT(*) as count FROM comments WHERE ip_hash = ? AND created_at > ?',
  )
    .bind(ipHash, oneHourAgo)
    .first<{ count: number }>();

  if ((rateResult?.count ?? 0) >= 5) {
    return new Response('Rate limited — try again later', { status: 429 });
  }

  // Insert.
  const id = crypto.randomUUID();
  const createdAt = Date.now();
  await env.DB.prepare(
    'INSERT INTO comments (id, node_id, author, body, created_at, ip_hash) VALUES (?, ?, ?, ?, ?, ?)',
  )
    .bind(id, body.nodeId, body.author.trim(), body.body.trim(), createdAt, ipHash)
    .run();

  return Response.json(
    { id, author: body.author.trim(), body: body.body.trim(), created_at: createdAt },
    { status: 201 },
  );
};
