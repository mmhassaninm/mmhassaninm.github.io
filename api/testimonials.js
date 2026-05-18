const dbConnect = require('../lib/db');
const Testimonial = require('../models/Testimonial');
const { withAdminAuth } = require('../lib/auth');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function clampRating(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return 5;
  return Math.max(1, Math.min(5, Math.round(v)));
}

function buildPayload(body) {
  const payload = {};
  if (typeof body.clientName === 'string') payload.clientName = body.clientName.trim();
  if (typeof body.clientTitle === 'string') payload.clientTitle = body.clientTitle.trim();
  if (typeof body.company === 'string') payload.company = body.company.trim();
  if (typeof body.text === 'string') payload.text = body.text;
  if (body.rating !== undefined) payload.rating = clampRating(body.rating);
  if (typeof body.imageUrl === 'string') payload.imageUrl = body.imageUrl.trim();
  if (typeof body.featured === 'boolean') payload.featured = body.featured;
  if (typeof body.order === 'number') payload.order = body.order;
  return payload;
}

async function handleGet(req, res) {
  const items = await Testimonial.find({}).sort({ order: 1 }).lean();
  return res.status(200).json(items);
}

const handlePost = withAdminAuth(async (req, res) => {
  const payload = buildPayload(req.body || {});
  if (!payload.clientName) {
    return res.status(400).json({ success: false, message: 'Client name is required' });
  }
  if (!payload.text) {
    return res.status(400).json({ success: false, message: 'Testimonial text is required' });
  }
  if (payload.rating == null) payload.rating = 5;
  const item = await Testimonial.create(payload);
  return res.status(201).json({ success: true, item });
});

const handlePut = withAdminAuth(async (req, res) => {
  const id = (req.query && req.query.id) || null;
  if (!id) return res.status(400).json({ success: false, message: 'Missing id' });
  const payload = buildPayload(req.body || {});
  const item = await Testimonial.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: 'Testimonial not found' });
  return res.status(200).json({ success: true, item });
});

const handleDelete = withAdminAuth(async (req, res) => {
  const id = (req.query && req.query.id) || null;
  if (!id) return res.status(400).json({ success: false, message: 'Missing id' });
  const item = await Testimonial.findByIdAndDelete(id);
  if (!item) return res.status(404).json({ success: false, message: 'Testimonial not found' });
  return res.status(200).json({ success: true, message: 'Testimonial deleted' });
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
    console.error('Testimonials Endpoint Error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
