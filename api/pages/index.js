const dbConnect = require('../../lib/db');
const Page = require('../../models/Page');
const Template = require('../../models/Template');
const { withAdminAuth } = require('../../lib/auth');
const { SECTION_TYPES, createSection } = require('../../lib/sectionTypes');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Public GET — list pages (optionally filtered for nav/public consumption)
async function handleGet(req, res) {
  const { slug, status, nav } = req.query || {};

  // Single page by slug (public renderer uses this)
  if (slug) {
    const query = { slug: slugify(slug) };
    if (status) query.status = status;
    const page = await Page.findOne(query).lean();
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    return res.status(200).json({ success: true, page });
  }

  // List pages
  const query = {};
  if (status) query.status = status;
  if (nav === 'true') query.showInNav = true;

  const pages = await Page.find(query)
    .select('_id slug title status isHome templateId showInNav updatedAt')
    .sort({ isHome: -1, updatedAt: -1 })
    .lean();

  return res.status(200).json({ success: true, pages });
}

// Authenticated POST — create new page
const handlePost = withAdminAuth(async (req, res) => {
  const { slug, title, templateId, defaultSections } = req.body || {};

  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  const finalSlug = slugify(slug || title);
  if (!finalSlug) {
    return res.status(400).json({ success: false, message: 'Invalid slug' });
  }

  const existing = await Page.findOne({ slug: finalSlug });
  if (existing) {
    return res.status(409).json({ success: false, message: 'A page with this slug already exists' });
  }

  // Resolve sections: explicit defaults > template defaults > empty
  let sections = [];
  if (Array.isArray(defaultSections) && defaultSections.length > 0) {
    sections = defaultSections.map((s, i) => ({
      id: s.id || `sect_${Math.random().toString(36).slice(2, 10)}`,
      type: s.type,
      order: typeof s.order === 'number' ? s.order : i,
      visible: s.visible !== false,
      data: s.data || (SECTION_TYPES[s.type] ? SECTION_TYPES[s.type].defaults : {})
    })).filter(s => SECTION_TYPES[s.type]);
  } else if (templateId) {
    const tpl = await Template.findOne({ id: templateId }).lean();
    if (tpl && Array.isArray(tpl.defaultSections)) {
      sections = tpl.defaultSections.map((s, i) => ({
        id: `sect_${Math.random().toString(36).slice(2, 10)}`,
        type: s.type,
        order: i,
        visible: true,
        data: s.data || (SECTION_TYPES[s.type] ? SECTION_TYPES[s.type].defaults : {})
      })).filter(s => SECTION_TYPES[s.type]);
    }
  }

  const page = await Page.create({
    slug: finalSlug,
    title,
    templateId: templateId || 'default',
    sections,
    seo: { title, description: '' },
    status: 'draft',
    isHome: false
  });

  return res.status(201).json({ success: true, page });
});

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await dbConnect();

    if (req.method === 'GET') return handleGet(req, res);
    if (req.method === 'POST') return handlePost(req, res);

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err) {
    console.error('Pages Endpoint Error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
