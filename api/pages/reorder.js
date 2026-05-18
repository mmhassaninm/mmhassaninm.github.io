const dbConnect = require('../../lib/db');
const Page = require('../../models/Page');
const { withAdminAuth } = require('../../lib/auth');

const handler = withAdminAuth(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { pageId, sectionOrder } = req.body || {};
  if (!pageId || !Array.isArray(sectionOrder)) {
    return res.status(400).json({ success: false, message: 'pageId and sectionOrder[] are required' });
  }

  const page = await Page.findById(pageId);
  if (!page) return res.status(404).json({ success: false, message: 'Page not found' });

  const byId = new Map(page.sections.map(s => [s.id, s]));
  const reordered = [];
  sectionOrder.forEach((sid, idx) => {
    const s = byId.get(sid);
    if (s) {
      s.order = idx;
      reordered.push(s);
      byId.delete(sid);
    }
  });
  // Append any sections not included in the order list (defensive)
  for (const remaining of byId.values()) {
    remaining.order = reordered.length;
    reordered.push(remaining);
  }

  page.sections = reordered;
  page.updatedAt = new Date();
  await page.save();

  return res.status(200).json({ success: true, page });
});

module.exports = async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    await dbConnect();
    return handler(req, res);
  } catch (err) {
    console.error('Reorder Endpoint Error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
