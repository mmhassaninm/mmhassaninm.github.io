⚠️ ══════════════════════════════════════════════════════════════════════
                  CRITICAL PROTECTED FILE — DO NOT DELETE
══════════════════════════════════════════════════════════════════════ ⚠️

  DELETING THIS FILE IS STRICTLY AND ABSOLUTELY FORBIDDEN UNDER ANY
  CIRCUMSTANCE, BY ANY AGENT, TOOL, SCRIPT, OR MANUAL ACTION.

  Any deletion of content, replacement of any section, or structural
  modification to this file MUST NOT be executed unless the agent has
  verified with 100% certainty that:
    (1) the change is logically sound and strictly necessary,
    (2) the full impact on the rest of the system is understood,
    (3) no historical record or permanent standard is being erased.

  When in doubt — DO NOT EDIT. Abort and report instead.

⚠️ ══════════════════════════════════════════════════════════════════════

# OmniBot — Architecture

## Module Map & Folder Structure
```text
MyBusinessWebsite/
├── public/                    ← Public portfolio website (HTML, CSS, JS)
│   ├── index.html
│   ├── css/style.css
│   └── js/main.js
├── admin/                     ← Secure CMS Admin Panel
│   ├── index.html             ← Login page
│   ├── dashboard.html
│   ├── portfolio.html
│   ├── services.html
│   ├── content.html
│   ├── testimonials.html
│   ├── messages.html
│   ├── media.html
│   └── settings.html
├── api/                       ← Backend API Vercel Serverless Functions
│   ├── auth/login.js
│   ├── portfolio/index.js
│   ├── services/index.js
│   ├── content/index.js
│   ├── messages/index.js
│   ├── testimonials/index.js
│   ├── media/index.js
│   └── settings/index.js
├── lib/                       ← Server-side shared logic and DB connections
│   ├── db.js                  ← Cached MongoDB Mongoose pooling connection
│   ├── auth.js                ← JWT generation and password bcrypt hashing
│   └── cloudinary.js          ← Cloudinary storage upload config
├── models/                    ← Mongoose Schemas & Models
│   ├── Admin.js
│   ├── Portfolio.js
│   ├── Service.js
│   ├── Content.js
│   ├── Message.js
│   ├── Testimonial.js
│   └── Settings.js
├── vercel.json                ← Routing rules configuration
├── package.json
└── .env.example
```

## Data Flow
1. **Public Site Requests**: Served from `public/` folder, requesting data from `/api/*` endpoints.
2. **Admin Operations**: Routed via Vercel configurations to `/admin/*`, enforcing JWT verification via localStorage check.
3. **Backend Database Interactions**: API endpoints leverage Serverless Functions connecting to MongoDB Atlas via `lib/db.js` Mongoose connection caching.
4. **Media Uploads**: Admin image uploads are proxied to Cloudinary.

## MongoDB Collections
- `admins`: Stores username and bcrypt hashes of password.
- `portfolios`: Stores projects metadata (tags, Cloudinary image URLs, order, etc.).
- `services`: Service catalogs for developer services.
- `contents`: Section text details (hero, about, contact, SEO).
- `messages`: Inquiry inbox entries.
- `testimonials`: Client feedback and stars rating.
- `settings`: System settings (social links, contact info).
