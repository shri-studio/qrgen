// ─────────────────────────────────────────────────────
// Cloudflare Worker: qrgen-counter
// Deploy this at: workers.shri.life or qrgen-counter.shri.workers.dev
//
// Setup:
//   1. wrangler kv:namespace create QRGEN_KV
//   2. Paste the returned id into wrangler.toml
//   3. wrangler deploy
// ─────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === '/count') {
      if (request.method === 'GET') {
        // Return current count
        const count = parseInt(await env.QRGEN_KV.get('total') || '0');
        return new Response(JSON.stringify({ count }), { headers: cors });
      }

      if (request.method === 'POST') {
        // Increment count atomically using KV
        const current = parseInt(await env.QRGEN_KV.get('total') || '0');
        const next = current + 1;
        await env.QRGEN_KV.put('total', String(next));

        // Also store today's count for analytics
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const todayCount = parseInt(await env.QRGEN_KV.get('day:' + today) || '0');
        await env.QRGEN_KV.put('day:' + today, String(todayCount + 1), {
          expirationTtl: 60 * 60 * 24 * 90 // keep 90 days
        });

        return new Response(JSON.stringify({ count: next }), { headers: cors });
      }
    }

    if (url.pathname === '/stats') {
      // Simple stats endpoint — extend later with auth
      const total = parseInt(await env.QRGEN_KV.get('total') || '0');
      const today = new Date().toISOString().slice(0, 10);
      const todayCount = parseInt(await env.QRGEN_KV.get('day:' + today) || '0');

      // Get last 7 days
      const days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = 'day:' + d.toISOString().slice(0, 10);
        const c = parseInt(await env.QRGEN_KV.get(key) || '0');
        days.push({ date: key.replace('day:', ''), count: c });
      }

      return new Response(JSON.stringify({ total, today: todayCount, daily: days }), { headers: cors });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: cors });
  }
};
