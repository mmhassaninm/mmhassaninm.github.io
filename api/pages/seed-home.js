/**
 * Seed Home Page endpoint — creates the default Home page for Moustafa's portfolio
 * if no pages exist yet. Idempotent: returns existing home page if one is already present.
 */
const dbConnect = require('../../lib/db');
const Page = require('../../models/Page');
const { withAdminAuth } = require('../../lib/auth');

function sid(p = 'sect') {
  return `${p}_${Math.random().toString(36).slice(2, 10)}`;
}

const HOME_SECTIONS = [
  {
    id: sid(),
    type: 'hero',
    order: 0,
    visible: true,
    data: {
      heading: 'Shopify Theme Developer',
      subheading: '& E-Commerce Specialist',
      description: 'I build and customize Shopify OS 2.0 stores for the Saudi & Gulf market — from theme development to full catalog management and On-Page SEO.',
      primaryButtonText: 'View My Work',
      primaryButtonLink: '#portfolio-grid',
      secondaryButtonText: "Let's Talk",
      secondaryButtonLink: '#contact-form',
      backgroundStyle: 'dark',
      backgroundImage: ''
    }
  },
  {
    id: sid(),
    type: 'stats',
    order: 1,
    visible: true,
    data: {
      items: [
        { value: '10 Years', label: 'Front-End Experience' },
        { value: '7+ Years', label: 'Shopify Specialist' },
        { value: 'SAR 1M+', label: 'Generated for Clients' }
      ]
    }
  },
  {
    id: sid(),
    type: 'about',
    order: 2,
    visible: true,
    data: {
      heading: 'About Me',
      body: 'Started in 2015 converting PSD designs into HTML and CSS. Since 2018, Shopify has been my main focus. I build and customize Shopify OS 2.0 themes using Liquid, HTML, CSS, and Vanilla JS — developing custom sections, managing metafields, and handling complete store operations. Deep expertise in the Saudi & Gulf market: RTL implementation, Salla platform, and local payment gateways.',
      skills: [
        'Shopify OS 2.0', 'Liquid', 'HTML/CSS', 'Vanilla JS', 'Custom Sections',
        'Metafields', 'On-Page SEO', 'Catalog Management', 'RTL / Arabic',
        'Salla Platform', 'AI-Augmented Workflow'
      ],
      imageUrl: '',
      layout: 'text-only'
    }
  },
  {
    id: sid(),
    type: 'services',
    order: 3,
    visible: true,
    data: {
      heading: 'What I Do',
      subheading: '',
      columns: 2,
      items: [
        { icon: '⚙️', title: 'Shopify Theme Development', description: 'Build or customize Shopify OS 2.0 themes using Liquid, HTML, CSS, and Vanilla JS. Custom sections, metafields, pixel-perfect results.' },
        { icon: '📦', title: 'Store Operations & Catalog', description: 'Complete catalog setup: products, variants, AI-optimized images, alt-text, pricing, tags, and collection structure.' },
        { icon: '🔍', title: 'On-Page SEO & Meta Data', description: 'Full SEO setup: meta titles, descriptions, alt-texts, URL structure, and Google Search Console configuration.' },
        { icon: '🌍', title: 'Saudi & Gulf Market Setup', description: 'RTL implementation, Arabic content, Salla platform, local payment gateways, and GCC consumer behavior expertise.' }
      ]
    }
  },
  {
    id: sid(),
    type: 'portfolio-grid',
    order: 4,
    visible: true,
    data: {
      heading: 'Selected Work',
      subheading: "Projects I've built and managed",
      source: 'database',
      columns: 2,
      items: []
    }
  },
  {
    id: sid(),
    type: 'testimonials',
    order: 5,
    visible: true,
    data: {
      heading: 'What Clients Say',
      source: 'database',
      items: []
    }
  },
  {
    id: sid(),
    type: 'contact-form',
    order: 6,
    visible: true,
    data: {
      heading: "Let's Work Together",
      subheading: 'Available for Shopify projects in the Saudi & Gulf market',
      fields: [
        { name: 'name', label: 'Your Name', type: 'text', required: true, options: [] },
        { name: 'email', label: 'Email Address', type: 'email', required: true, options: [] },
        {
          name: 'projectType',
          label: 'Project Type',
          type: 'select',
          required: true,
          options: ['Shopify Theme Development', 'Store Operations & Catalog', 'On-Page SEO Setup', 'Saudi/Gulf Market Setup', 'Other']
        },
        { name: 'message', label: 'Tell me about your project', type: 'textarea', required: true, options: [] }
      ],
      submitLabel: 'Send Message',
      successMessage: "Thanks! I'll get back to you shortly."
    }
  }
];

const handler = withAdminAuth(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const existing = await Page.findOne({ slug: 'home' });
  if (existing) {
    return res.status(200).json({ success: true, page: existing, message: 'Home page already exists' });
  }

  // Make sure no other isHome=true page exists
  await Page.updateMany({}, { $set: { isHome: false } });

  const page = await Page.create({
    slug: 'home',
    title: 'Home Page',
    templateId: 'default',
    sections: HOME_SECTIONS,
    seo: {
      title: 'Moustafa Hassanin — Shopify Theme Developer',
      description: 'Shopify OS 2.0 theme developer and e-commerce specialist for the Saudi & Gulf market.'
    },
    status: 'published',
    isHome: true,
    showInNav: true
  });

  return res.status(201).json({ success: true, page });
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
    console.error('Seed Home Endpoint Error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
