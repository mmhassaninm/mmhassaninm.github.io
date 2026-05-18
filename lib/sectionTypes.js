/**
 * Section Types Registry
 *
 * Single source of truth for all section types supported by the page builder.
 * Used by:
 *   - Admin page builder (to render forms)
 *   - Template seeder (to create default sections)
 *   - Public renderer (to validate type)
 */

const SECTION_TYPES = {
  hero: {
    label: 'Hero Banner',
    icon: '🚀',
    description: 'Large header with heading, description, and CTA buttons.',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'subheading', label: 'Subheading', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'primaryButtonText', label: 'Primary Button Text', type: 'text' },
      { name: 'primaryButtonLink', label: 'Primary Button Link', type: 'text' },
      { name: 'secondaryButtonText', label: 'Secondary Button Text', type: 'text' },
      { name: 'secondaryButtonLink', label: 'Secondary Button Link', type: 'text' },
      { name: 'backgroundStyle', label: 'Background Style', type: 'select', options: ['dark', 'gradient', 'image'] },
      { name: 'backgroundImage', label: 'Background Image URL', type: 'text' }
    ],
    defaults: {
      heading: 'Your Heading Here',
      subheading: '',
      description: '',
      primaryButtonText: 'Get Started',
      primaryButtonLink: '#',
      secondaryButtonText: '',
      secondaryButtonLink: '',
      backgroundStyle: 'dark',
      backgroundImage: ''
    }
  },

  stats: {
    label: 'Stats Bar',
    icon: '📊',
    description: 'Row of headline statistics (up to 4).',
    fields: [
      { name: 'items', label: 'Stats', type: 'list', max: 4, itemFields: [
        { name: 'value', label: 'Value', type: 'text' },
        { name: 'label', label: 'Label', type: 'text' }
      ]}
    ],
    defaults: {
      items: [
        { value: '10+', label: 'Years Experience' },
        { value: '50+', label: 'Projects' }
      ]
    }
  },

  about: {
    label: 'About / Bio',
    icon: '👤',
    description: 'About section with body text, skills, and optional image.',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Body', type: 'textarea' },
      { name: 'skills', label: 'Skills (comma-separated)', type: 'tags' },
      { name: 'imageUrl', label: 'Image URL', type: 'text' },
      { name: 'layout', label: 'Layout', type: 'select', options: ['text-only', 'text-left-image-right', 'text-right-image-left'] }
    ],
    defaults: {
      heading: 'About Me',
      body: '',
      skills: [],
      imageUrl: '',
      layout: 'text-only'
    }
  },

  services: {
    label: 'Services Grid',
    icon: '⚙️',
    description: 'Grid of services with icon, title, and description.',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'subheading', label: 'Subheading', type: 'text' },
      { name: 'columns', label: 'Columns', type: 'select', options: ['2', '3', '4'] },
      { name: 'items', label: 'Services', type: 'list', itemFields: [
        { name: 'icon', label: 'Icon (emoji)', type: 'text' },
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' }
      ]}
    ],
    defaults: {
      heading: 'What I Do',
      subheading: '',
      columns: 3,
      items: []
    }
  },

  'portfolio-grid': {
    label: 'Portfolio Grid',
    icon: '🖼️',
    description: 'Grid of portfolio projects (from database or manual).',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'subheading', label: 'Subheading', type: 'text' },
      { name: 'source', label: 'Source', type: 'select', options: ['database', 'manual'] },
      { name: 'columns', label: 'Columns', type: 'select', options: ['2', '3'] },
      { name: 'items', label: 'Manual Items', type: 'list', itemFields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'category', label: 'Category', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'tags', label: 'Tags (comma-separated)', type: 'tags' },
        { name: 'imageUrl', label: 'Image URL', type: 'text' },
        { name: 'url', label: 'Project URL', type: 'text' }
      ]}
    ],
    defaults: {
      heading: 'Selected Work',
      subheading: '',
      source: 'database',
      columns: 2,
      items: []
    }
  },

  testimonials: {
    label: 'Testimonials',
    icon: '💬',
    description: 'Client testimonials (from database or manual).',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'source', label: 'Source', type: 'select', options: ['database', 'manual'] },
      { name: 'items', label: 'Manual Items', type: 'list', itemFields: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'company', label: 'Company', type: 'text' },
        { name: 'text', label: 'Quote', type: 'textarea' },
        { name: 'rating', label: 'Rating (1-5)', type: 'text' },
        { name: 'imageUrl', label: 'Image URL', type: 'text' }
      ]}
    ],
    defaults: {
      heading: 'What Clients Say',
      source: 'database',
      items: []
    }
  },

  'contact-form': {
    label: 'Contact Form',
    icon: '📧',
    description: 'Configurable contact form with custom fields.',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'subheading', label: 'Subheading', type: 'text' },
      { name: 'fields', label: 'Fields', type: 'list', itemFields: [
        { name: 'name', label: 'Field Name', type: 'text' },
        { name: 'label', label: 'Field Label', type: 'text' },
        { name: 'type', label: 'Type', type: 'select', options: ['text', 'email', 'textarea', 'select'] },
        { name: 'required', label: 'Required', type: 'checkbox' },
        { name: 'options', label: 'Options (comma-separated, for select)', type: 'tags' }
      ]},
      { name: 'submitLabel', label: 'Submit Button Label', type: 'text' },
      { name: 'successMessage', label: 'Success Message', type: 'text' }
    ],
    defaults: {
      heading: 'Get in Touch',
      subheading: '',
      fields: [
        { name: 'name', label: 'Your Name', type: 'text', required: true, options: [] },
        { name: 'email', label: 'Email', type: 'email', required: true, options: [] },
        { name: 'message', label: 'Message', type: 'textarea', required: true, options: [] }
      ],
      submitLabel: 'Send Message',
      successMessage: 'Thanks! I will get back to you shortly.'
    }
  },

  'text-block': {
    label: 'Text / Rich Content',
    icon: '📄',
    description: 'Simple text block with heading and body.',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Body', type: 'textarea' },
      { name: 'alignment', label: 'Alignment', type: 'select', options: ['left', 'center'] },
      { name: 'maxWidth', label: 'Width', type: 'select', options: ['narrow', 'medium', 'wide'] }
    ],
    defaults: {
      heading: '',
      body: '',
      alignment: 'left',
      maxWidth: 'medium'
    }
  },

  'image-text': {
    label: 'Image + Text',
    icon: '🖼️',
    description: 'Side-by-side image and text block.',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Body', type: 'textarea' },
      { name: 'imageUrl', label: 'Image URL', type: 'text' },
      { name: 'imagePosition', label: 'Image Position', type: 'select', options: ['left', 'right'] },
      { name: 'buttonText', label: 'Button Text', type: 'text' },
      { name: 'buttonLink', label: 'Button Link', type: 'text' }
    ],
    defaults: {
      heading: '',
      body: '',
      imageUrl: '',
      imagePosition: 'left',
      buttonText: '',
      buttonLink: ''
    }
  },

  'cta-banner': {
    label: 'Call to Action',
    icon: '📣',
    description: 'Bold call-to-action banner.',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'subheading', label: 'Subheading', type: 'text' },
      { name: 'buttonText', label: 'Button Text', type: 'text' },
      { name: 'buttonLink', label: 'Button Link', type: 'text' },
      { name: 'style', label: 'Style', type: 'select', options: ['accent', 'dark', 'gradient'] }
    ],
    defaults: {
      heading: 'Ready to Get Started?',
      subheading: '',
      buttonText: 'Contact Me',
      buttonLink: '#contact',
      style: 'accent'
    }
  }
};

function generateSectionId(prefix = 'sect') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function createSection(type, overrides = {}) {
  const config = SECTION_TYPES[type];
  if (!config) return null;
  return {
    id: generateSectionId(),
    type,
    order: 0,
    visible: true,
    data: { ...config.defaults, ...overrides }
  };
}

module.exports = {
  SECTION_TYPES,
  generateSectionId,
  createSection
};
