const mongoose = require('mongoose');
const dbConnect = require('../../lib/db');
const Page = require('../../models/Page');
const { withAdminAuth } = require('../../lib/auth');
const { SECTION_TYPES } = require('../../lib/sectionTypes');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function getId(req) {
  // Vercel dynamic param OR ?id= query fallback
  return (req.query && (req.query.id || req.query.pageId)) || null;
}

function isObjectId(s) {
  return typeof s === 'string' && /^[a-f0-9]{24}$/i.test(s);
}

async function findPage(idOrSlug) {
  if (!idOrSlug) return null;
  if (isObjectId(idOrSlug)) {
    return Page.findById(idOrSlug);
  }
  return Page.findOne({ slug: String(idOrSlug).toLowerCase() });
}

async function handleGet(req, res) {
  const id = getId(req);
  const page = await findPage(id);
  if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
  return res.status(200).json({ success: true, page });
}

const handlePut = withAdminAuth(async (req, res) => {
  const id = getId(req);
  const page = await findPage(id);
  if (!page) return res.status(404).json({ success: false, message: 'Page not found' });

  const body = req.body || {};
  const { title, slug, sections, seo, status, isHome, showInNav, templateId } = body;

  if (typeof title === 'string' && title.trim()) page.title = title.trim();
  if (typeof slug === 'string' && slug.trim()) {
    page.slug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  if (typeof templateId === 'string') page.templateId = templateId;
  if (typeof showInNav === 'boolean') page.showInNav = showInNav;

  if (Array.isArray(sections)) {
    page.sections = sections
      .filter(s => s && s.type && SECTION_TYPES[s.type])
      .map((s, i) => ({
        id: s.id || `sect_${Math.random().toString(36).slice(2, 10)}`,
        type: s.type,
        order: typeof s.order === 'number' ? s.order : i,
        visible: s.visible !== false,
        data: s.data || {}
      }));
  }

  if (seo && typeof seo === 'object') {
    page.seo = {
      title: typeof seo.title === 'string' ? seo.title : (page.seo && page.seo.title) || '',
      description: typeof seo.description === 'string' ? seo.description : (page.seo && page.seo.description) || ''
    };
  }

  if (status === 'draft' || status === 'published') page.status = status;

  // Enforce: only one home page
  if (isHome === true) {
    await Page.updateMany({ _id: { $ne: page._id } }, { $set: { isHome: false } });
    page.isHome = true;
  } else if (isHome === false) {
    page.isHome = false;
  }

  page.updatedAt = new Date();
  await page.save();

  return res.status(200).json({ success: true, page });
});

const handleDelete = withAdminAuth(async (req, res) => {
  const id = getId(req);
  const page = await findPage(id);
  if (!page) return res.status(404).json({ success: false, message: 'Page not found' });

  if (page.isHome) {
    return res.status(400).json({ success: false, message: 'Cannot delete the home page. Set another page as home first.' });
  }

  await page.deleteOne();
  return res.status(200).json({ success: true, message: 'Page deleted' });
});

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await dbConnect();
    if (req.method === 'GET') return handleGet(req, res);
    if (req.method === 'PUT') return handlePut(req, res);
    if (req.method === 'DELETE') return handleDelete(req, res);
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (err) {
    console.error('Page [id] Endpoint Error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
