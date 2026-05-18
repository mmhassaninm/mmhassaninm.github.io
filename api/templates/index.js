const dbConnect = require('../../lib/db');
const Template = require('../../models/Template');
const { SECTION_TYPES } = require('../../lib/sectionTypes');

const DEFAULT_TEMPLATES = [
  {
    id: 'default',
    name: 'Default Portfolio',
    description: 'Full portfolio layout with hero, about, services, and contact',
    thumbnail: '',
    allowedSections: Object.keys(SECTION_TYPES),
    defaultSections: [
      { type: 'hero', data: SECTION_TYPES['hero'].defaults },
      { type: 'stats', data: SECTION_TYPES['stats'].defaults },
      { type: 'about', data: SECTION_TYPES['about'].defaults },
      { type: 'services', data: SECTION_TYPES['services'].defaults },
      { type: 'portfolio-grid', data: SECTION_TYPES['portfolio-grid'].defaults },
      { type: 'testimonials', data: SECTION_TYPES['testimonials'].defaults },
      { type: 'contact-form', data: SECTION_TYPES['contact-form'].defaults }
    ]
  },
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Simple landing page with hero, features, and CTA',
    thumbnail: '',
    allowedSections: Object.keys(SECTION_TYPES),
    defaultSections: [
      { type: 'hero', data: SECTION_TYPES['hero'].defaults },
      { type: 'stats', data: SECTION_TYPES['stats'].defaults },
      { type: 'services', data: SECTION_TYPES['services'].defaults },
      { type: 'cta-banner', data: SECTION_TYPES['cta-banner'].defaults },
      { type: 'contact-form', data: SECTION_TYPES['contact-form'].defaults }
    ]
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean page with just a header and text content',
    thumbnail: '',
    allowedSections: Object.keys(SECTION_TYPES),
    defaultSections: [
      { type: 'hero', data: SECTION_TYPES['hero'].defaults },
      { type: 'text-block', data: SECTION_TYPES['text-block'].defaults },
      { type: 'contact-form', data: SECTION_TYPES['contact-form'].defaults }
    ]
  }
];

async function seedIfEmpty() {
  const count = await Template.countDocuments();
  if (count > 0) return;
  await Template.insertMany(DEFAULT_TEMPLATES);
}

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
    await seedIfEmpty();
    const templates = await Template.find({}).lean();
    return res.status(200).json({ success: true, templates });
  } catch (err) {
    console.error('Templates Endpoint Error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
