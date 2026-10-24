// Cloudflare Pages Function: tiny key/value store on D1 for the synced app state.
// GET /api/kv/:key -> 200 { value, updatedAt } | 404
// PUT /api/kv/:key  body { value } -> 200
// Auth: send header "x-pantry-key" equal to the PANTRY_KEY secret (Pages > Settings > Variables and Secrets).
// Requests that came through Cloudflare Access are also accepted. With neither, everything is refused.

const ALLOWED = new Set([
  "_check",
  "pantry-pocket-items",
  "pantry-pocket-basket",
  "pantry-pocket-shelves",
  "pantry-pocket-settings"
]);
const MAX_BYTES = 1_000_000;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });

export async function onRequest({ request, env, params }) {
  // Fail closed: need the secret passcode, or a request that Cloudflare Access let through.
  const viaAccess = !!request.headers.get("Cf-Access-Jwt-Assertion");
  const sent = request.headers.get("x-pantry-key") || "";
  if (!viaAccess && !(env.PANTRY_KEY && safeEqual(sent, env.PANTRY_KEY))) {
    return json({ error: "Unauthorized" }, 401);
  }
  if (params.key === "_check") return json({ ok: true });
  if (!env.DB) return json({ error: "D1 binding 'DB' is missing." }, 500);

  const key = params.key;
  if (!ALLOWED.has(key)) return json({ error: "Unknown key" }, 400);

  if (request.method === "GET") {
    const row = await env.DB.prepare("SELECT value, updated_at FROM kv WHERE key = ?").bind(key).first();
    return row ? json({ value: row.value, updatedAt: row.updated_at }) : json({ error: "Not found" }, 404);
  }

  if (request.method === "PUT") {
    const text = await request.text();
    if (text.length > MAX_BYTES) return json({ error: "Too large" }, 413);
    let value;
    try { value = JSON.parse(text).value; } catch { return json({ error: "Bad JSON" }, 400); }
    if (typeof value !== "string") return json({ error: "value must be a string" }, 400);
    await env.DB
      .prepare("INSERT INTO kv (key, value, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(key) DO UPDATE SET value = ?2, updated_at = ?3")
      .bind(key, value, Date.now())
      .run();
    return json({ ok: true });
  }

  return json({ error: "Method not allowed" }, 405);
}

function safeEqual(a, b) {
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}
