const dbConnect = require('../lib/db');
const Testimonial = require('../models/Testimonial');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    await dbConnect();
    const items = await Testimonial.find({}).sort({ order: 1 }).lean();
    return res.status(200).json(items);
  } catch (err) {
    console.error('Testimonials Endpoint Error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
