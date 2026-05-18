const dbConnect = require('../lib/db');
const Portfolio = require('../models/Portfolio');
const { withAdminAuth } = require('../lib/auth');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function normalizeTags(input) {
  if (Array.isArray(input)) return input.map(t => String(t).trim()).filter(Boolean);
  if (typeof input === 'string') {
    return input.split(',').map(t => t.trim()).filter(Boolean);
  }
  return [];
}

function buildPayload(body) {
  const payload = {};
  if (typeof body.title === 'string') payload.title = body.title.trim();
  if (typeof body.category === 'string') payload.category = body.category.trim();
  if (typeof body.description === 'string') payload.description = body.description;
  if (body.tags !== undefined) payload.tags = normalizeTags(body.tags);
  if (typeof body.imageUrl === 'string') payload.imageUrl = body.imageUrl.trim();
  if (typeof body.liveUrl === 'string') payload.liveUrl = body.liveUrl.trim();
  if (typeof body.featured === 'boolean') payload.featured = body.featured;
  if (typeof body.order === 'number') payload.order = body.order;
  return payload;
}

async function handleGet(req, res) {
  const items = await Portfolio.find({}).sort({ order: 1, createdAt: -1 }).lean();
  return res.status(200).json(items);
}

const handlePost = withAdminAuth(async (req, res) => {
  const payload = buildPayload(req.body || {});
  if (!payload.title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }
  const item = await Portfolio.create(payload);
  return res.status(201).json({ success: true, item });
});

const handlePut = withAdminAuth(async (req, res) => {
  const id = (req.query && req.query.id) || null;
  if (!id) return res.status(400).json({ success: false, message: 'Missing id' });
  const payload = buildPayload(req.body || {});
  const item = await Portfolio.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: 'Project not found' });
  return res.status(200).json({ success: true, item });
});

const handleDelete = withAdminAuth(async (req, res) => {
  const id = (req.query && req.query.id) || null;
  if (!id) return res.status(400).json({ success: false, message: 'Missing id' });
  const item = await Portfolio.findByIdAndDelete(id);
  if (!item) return res.status(404).json({ success: false, message: 'Project not found' });
  return res.status(200).json({ success: true, message: 'Project deleted' });
});

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await dbConnect();
    if (req.method === 'GET') return handleGet(req, res);
    if (req.method === 'POST') return handlePost(req, res);
    if (req.method === 'PUT') return handlePut(req, res);
    if (req.method === 'DELETE') return handleDelete(req, res);
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err) {
    console.error('Portfolio Endpoint Error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
