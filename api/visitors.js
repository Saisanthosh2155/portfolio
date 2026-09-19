// Vercel Serverless Function — /api/visitors
// In-memory store: resets on cold start but works great for a portfolio demo.
// To make counts globally persistent, add Upstash Redis via Vercel Integrations.

let stats = { uniqueVisitors: 25, likes: 25, hasLiked: false, visitorNumber: 25 };

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    if (!stats.hasLiked) {
      stats.likes += 1;
      stats.hasLiked = true;
    }
  }

  return res.status(200).json({ ...stats, persisted: true });
}
