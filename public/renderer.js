/**
 * Catalyst Public Page Renderer
 * Renders a Page object (with .sections) into HTML matching the Catalyst design system.
 * Each section render function returns an HTML string; the registry is keyed by section.type.
 */
(function (global) {
  function esc(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>'"]/g, t => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[t]));
  }
  function safeArr(v) { return Array.isArray(v) ? v : []; }
  function attr(href) { return esc(href || '#'); }

  // -------- Inline icons --------
  const ICON_ARROW = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function btn(text, link, kind) {
    if (!text) return '';
    const cls = kind === 'primary' ? 'btn btn-grad btn-lg' : 'btn btn-ghost btn-lg';
    return `<a class="${cls}" href="${attr(link)}">${esc(text)}${kind === 'primary' ? '' : ' ' + ICON_ARROW}</a>`;
  }

  // -------- Hero: isometric grid SVG illustration --------
  function isoGridSvg() {
    const tiles = [
      { x: -70, y: 0,  c: '#7c3aed', o: 0.35 },
      { x: -10, y: 30, c: '#06b6d4', o: 0.30 },
      { x:  50, y: 0,  c: '#7c3aed', o: 0.25 },
      { x: -40, y: 60, c: '#06b6d4', o: 0.40 },
      { x:  20, y: 60, c: '#7c3aed', o: 0.30 }
    ];
    const tilesSvg = tiles.map(t => `
      <g transform="translate(${t.x} ${t.y - 30})">
        <polygon points="0,0 60,30 0,60 -60,30" fill="${t.c}" fill-opacity="${t.o}" stroke="${t.c}" stroke-opacity="0.8" stroke-width="1"/>
        <polygon points="0,0 60,30 0,60 -60,30" fill="none" stroke="url(#g-edge)" stroke-opacity="0.4" stroke-width="0.6"/>
      </g>`).join('');
    const horizLines = [-3,-2,-1,0,1,2,3].map(i => `<line x1="-140" y1="${70 + i*22*0.5}" x2="140" y2="${70 + i*22*0.5}" stroke="rgba(124,58,237,0.18)" stroke-width="0.6"/>`).join('');
    const vertLines = [-6,-4,-2,0,2,4,6].map(i => `<line x1="${i*22}" y1="-10" x2="${i*22}" y2="150" stroke="rgba(6,182,212,0.10)" stroke-width="0.6"/>`).join('');

    return `
      <div class="iso-wrap">
        <div class="iso-glow"></div>
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g-purple" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed" stop-opacity="0.95"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0.25"/></linearGradient>
            <linearGradient id="g-cyan" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#06b6d4" stop-opacity="0.95"/><stop offset="1" stop-color="#06b6d4" stop-opacity="0.25"/></linearGradient>
            <linearGradient id="g-edge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#06b6d4"/></linearGradient>
            <radialGradient id="g-face" cx="0.5" cy="0.5" r="0.7"><stop offset="0" stop-color="#7c3aed" stop-opacity="0.18"/><stop offset="1" stop-color="#06b6d4" stop-opacity="0.04"/></radialGradient>
            <filter id="iso-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5"/></filter>
          </defs>
          <g transform="translate(200 210)" stroke-linecap="round" stroke-linejoin="round">
            <g opacity="0.55">${horizLines}${vertLines}</g>
            <polygon points="0,-80 140,-10 0,60 -140,-10" fill="url(#g-face)" stroke="url(#g-edge)" stroke-width="1.6"/>
            <polygon points="-140,-10 0,60 0,180 -140,110" fill="rgba(124,58,237,0.08)" stroke="url(#g-purple)" stroke-width="1.6"/>
            <polygon points="0,60 140,-10 140,110 0,180" fill="rgba(6,182,212,0.06)" stroke="url(#g-cyan)" stroke-width="1.6"/>
            ${tilesSvg}
            <g filter="url(#iso-glow)" opacity="0.9">
              <polygon points="-150,-50 -135,-42 -150,-34 -165,-42" fill="#7c3aed"/>
              <polygon points="160,-30 175,-22 160,-14 145,-22" fill="#06b6d4"/>
              <polygon points="0,-120 12,-114 0,-108 -12,-114" fill="url(#g-edge)"/>
            </g>
            <g stroke="url(#g-edge)" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.6" fill="none">
              <path d="M0,-120 Q 30,-100 0,-80"/>
              <path d="M-150,-42 Q -100,-30 -70,-10"/>
              <path d="M160,-22 Q 120,-10 80,-10"/>
            </g>
            <circle cx="0" cy="0" r="6" fill="url(#g-edge)" filter="url(#iso-glow)"/>
            <circle cx="0" cy="0" r="3" fill="#fff"/>
          </g>
          <g stroke="rgba(255,255,255,0.18)" stroke-width="1">
            <path d="M20 20 h22 M20 20 v22"/>
            <path d="M380 20 h-22 M380 20 v22"/>
            <path d="M20 380 h22 M20 380 v-22"/>
            <path d="M380 380 h-22 M380 380 v-22"/>
          </g>
          <g fill="rgba(255,255,255,0.35)" font-family="JetBrains Mono, monospace" font-size="9">
            <text x="20" y="50">x.01</text>
            <text x="345" y="50">y.02</text>
            <text x="20" y="372">z.03</text>
            <text x="345" y="372">∞</text>
          </g>
        </svg>
      </div>`;
  }

  // Geo overlay pattern (very subtle 8-point star, hero only)
  function geoOverlaySvg() {
    return `
      <svg class="geo-overlay" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <pattern id="islamic" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#a78bfa" stroke-width="0.6">
              <polygon points="60,10 70,40 100,40 76,58 86,90 60,72 34,90 44,58 20,40 50,40"/>
              <rect x="10" y="10" width="100" height="100"/>
              <polygon points="60,10 110,60 60,110 10,60"/>
            </g>
          </pattern>
        </defs>
        <rect width="600" height="600" fill="url(#islamic)"/>
      </svg>`;
  }

  // -------- Section Renderers --------

  function renderHero(d) {
    // Split heading into "all but last word" + "last word" for gradient.
    const heading = String(d.heading || '').trim();
    let mainPart = heading, lastPart = '';
    if (heading) {
      const idx = heading.lastIndexOf(' ');
      if (idx > 0) { mainPart = heading.slice(0, idx); lastPart = heading.slice(idx + 1); }
      else { lastPart = heading; mainPart = ''; }
    }
    const headingHTML = `${mainPart ? esc(mainPart) + ' ' : ''}<span class="grad-text">${esc(lastPart)}</span>`;

    const useImage = d.backgroundStyle === 'image' && d.backgroundImage;
    const heroBgStyle = useImage
      ? `background: linear-gradient(rgba(5,5,8,0.7), rgba(5,5,8,0.9)), url('${esc(d.backgroundImage)}') center/cover;`
      : '';

    return `
      <section class="hero" id="hero" style="${heroBgStyle}">
        <div class="hero-bg">
          <div class="blob purple"></div>
          <div class="blob cyan"></div>
          <div class="dotgrid"></div>
          ${geoOverlaySvg()}
        </div>
        <div class="container hero-inner">
          <div>
            <span class="pill"><span class="pulse"></span>Available for new projects</span>
            <h1 class="hero-heading">${headingHTML}</h1>
            ${d.subheading ? `<p class="hero-sub">${esc(d.subheading)}</p>` : ''}
            ${d.description ? `<p class="hero-desc">${esc(d.description)}</p>` : ''}
            <div class="hero-buttons">
              ${d.primaryButtonText ? `<a class="btn btn-grad btn-lg" href="${attr(d.primaryButtonLink)}">${esc(d.primaryButtonText)}</a>` : ''}
              ${d.secondaryButtonText ? `<a class="btn btn-ghost btn-lg" href="${attr(d.secondaryButtonLink)}">${esc(d.secondaryButtonText)} ${ICON_ARROW}</a>` : ''}
            </div>
          </div>
          ${isoGridSvg()}
        </div>
      </section>`;
  }

  function renderStats(d) {
    const items = safeArr(d.items).slice(0, 4);
    if (!items.length) return '';
    const parts = [];
    items.forEach((s, i) => {
      if (i > 0) parts.push('<div class="stat-divider"></div>');
      parts.push(`
        <div class="stat reveal">
          <div class="stat-n">${esc(s.value)}</div>
          <div class="stat-l">${esc(s.label)}</div>
        </div>`);
    });
    return `
      <section class="section section-stats">
        <div class="container">
          <div class="stats">${parts.join('')}</div>
        </div>
      </section>`;
  }

  function renderAbout(d) {
    const layout = d.layout || 'text-only';
    const skills = safeArr(d.skills);
    const textHTML = `
      <div class="about-text reveal">
        <span class="section-label">About</span>
        ${d.heading ? `<h2 class="section-heading">${esc(d.heading)}</h2>` : ''}
        ${d.body ? `<p class="about-body">${esc(d.body)}</p>` : ''}
        ${skills.length ? `<div class="skills">${skills.map(s => `<span class="skill-tag">${esc(s)}</span>`).join('')}</div>` : ''}
      </div>`;
    const imgHTML = d.imageUrl ? `<div class="about-image reveal"><img src="${esc(d.imageUrl)}" alt="${esc(d.heading || 'About')}"></div>` : '';
    let inner;
    if (layout === 'text-left-image-right') inner = `<div class="about-split">${textHTML}${imgHTML}</div>`;
    else if (layout === 'text-right-image-left') inner = `<div class="about-split">${imgHTML}${textHTML}</div>`;
    else inner = textHTML;
    return `<section class="section section-about" id="about"><div class="container">${inner}</div></section>`;
  }

  function renderServices(d) {
    const items = safeArr(d.items);
    const cols = String(d.columns || 2);
    const gridCls = cols === '3' ? 'services-grid cols-3' : (cols === '4' ? 'services-grid cols-4' : 'services-grid');
    return `
      <section class="section section-services" id="services">
        <div class="container">
          <div class="section-head reveal">
            <span class="section-label">What I Do</span>
            ${d.heading ? `<h2 class="section-heading">${esc(d.heading)}</h2>` : ''}
            ${d.subheading ? `<p class="section-sub">${esc(d.subheading)}</p>` : ''}
          </div>
          <div class="${gridCls}">
            ${items.map(s => `
              <div class="svc-card reveal" data-svc>
                <div class="svc-icon">${esc(s.icon || '✦')}</div>
                <h3>${esc(s.title)}</h3>
                <p>${esc(s.description)}</p>
              </div>`).join('')}
          </div>
        </div>
      </section>`;
  }

  function renderMockShot(title) {
    return `
      <div class="proj-shot">
        <div class="mock">
          <div class="mock-bar">
            <i></i><i></i><i></i>
            <span class="url">${esc((title || 'project').toLowerCase().replace(/\s+/g, '-'))}.myshopify.com</span>
          </div>
          <div class="mock-body">
            <div class="mock-hero"></div>
            <div class="mock-row">
              <div class="mock-tile"></div><div class="mock-tile"></div><div class="mock-tile"></div>
            </div>
            <div class="mock-line"></div>
            <div class="mock-line short"></div>
          </div>
        </div>
      </div>`;
  }

  async function renderPortfolioGrid(d) {
    let items = safeArr(d.items);
    if (d.source === 'database') {
      try {
        const res = await fetch('/api/portfolio');
        const data = await res.json();
        if (Array.isArray(data)) items = data;
        else if (data && Array.isArray(data.items)) items = data.items;
      } catch (e) { /* fall through */ }
    }

    const cards = items.map((it, i) => {
      const mirror = i % 2 === 1;
      const tags = safeArr(it.tags);
      const featured = it.featured || it.metric;
      const statusKind = (it.status === 'wip' || it.status === 'in-progress') ? 'wip' : 'live';
      const statusLabel = statusKind === 'wip' ? 'In Progress' : 'Live';

      const info = `
        <div class="proj-info reveal">
          <span class="proj-status ${statusKind}"><span class="dot"></span>${statusLabel}</span>
          <h3>${esc(it.title)}</h3>
          ${it.category ? `<span class="tag" style="align-self:flex-start">${esc(it.category)}</span>` : ''}
          ${it.description ? `<p class="proj-desc">${esc(it.description)}</p>` : ''}
          ${tags.length ? `<div class="proj-tags">${tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
          ${it.url || it.liveUrl ? `<a class="btn btn-ghost" style="align-self:flex-start" href="${attr(it.url || it.liveUrl)}" target="_blank" rel="noopener">View project ${ICON_ARROW}</a>` : ''}
        </div>`;

      const shot = it.imageUrl
        ? `<div class="proj-shot reveal"><img src="${esc(it.imageUrl)}" alt="${esc(it.title)}"></div>`
        : `<div class="reveal">${renderMockShot(it.title)}</div>`;

      return `
        <div class="proj-card ${mirror ? 'mirror' : ''}">
          ${mirror ? shot + info : info + shot}
        </div>`;
    }).join('');

    return `
      <section class="section section-portfolio" id="portfolio-grid">
        <div class="container">
          <div class="section-head reveal">
            <span class="section-label">Selected Work</span>
            ${d.heading ? `<h2 class="section-heading">${esc(d.heading)}</h2>` : ''}
            ${d.subheading ? `<p class="section-sub">${esc(d.subheading)}</p>` : ''}
          </div>
          ${cards || '<p class="empty-note">No projects yet.</p>'}
        </div>
      </section>`;
  }

  async function renderTestimonials(d) {
    let items = safeArr(d.items);
    if (d.source === 'database') {
      try {
        const res = await fetch('/api/testimonials');
        const data = await res.json();
        if (Array.isArray(data)) items = data.map(t => ({
          name: t.clientName, title: t.clientTitle, company: t.company,
          text: t.text, rating: t.rating, imageUrl: t.imageUrl
        }));
      } catch (e) { /* fall through */ }
    }
    const head = `
      <div class="section-head reveal">
        <span class="section-label">Testimonials</span>
        ${d.heading ? `<h2 class="section-heading">${esc(d.heading)}</h2>` : ''}
      </div>`;
    if (!items.length) {
      return `<section class="section section-testimonials"><div class="container">${head}<p class="empty-note">No testimonials yet.</p></div></section>`;
    }
    return `
      <section class="section section-testimonials">
        <div class="container">
          ${head}
          <div class="testimonials-grid">
            ${items.map(t => {
              const rating = Math.max(0, Math.min(5, parseInt(t.rating, 10) || 0));
              return `
                <div class="testimonial-card reveal">
                  ${rating ? `<div class="rating">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</div>` : ''}
                  <p class="testimonial-text">"${esc(t.text)}"</p>
                  <div class="testimonial-author">
                    ${t.imageUrl ? `<img src="${esc(t.imageUrl)}" alt="${esc(t.name)}">` : ''}
                    <div>
                      <div class="author-name">${esc(t.name)}</div>
                      <div class="author-title">${esc([t.title, t.company].filter(Boolean).join(' · '))}</div>
                    </div>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>
      </section>`;
  }

  function renderContactForm(d) {
    const fields = safeArr(d.fields);

    // Pair first two text-like fields side by side (Name + Email) per design.
    const fieldHTML = [];
    let i = 0;
    while (i < fields.length) {
      const f = fields[i];
      const nextF = fields[i + 1];
      const isPair = f && nextF && f.type !== 'textarea' && f.type !== 'select'
        && nextF.type !== 'textarea' && nextF.type !== 'select';
      if (isPair && i === 0) {
        fieldHTML.push(`<div class="field-row">${fieldEl(f)}${fieldEl(nextF)}</div>`);
        i += 2;
      } else {
        fieldHTML.push(fieldEl(f));
        i += 1;
      }
    }

    return `
      <section class="section section-contact" id="contact-form">
        <div class="container">
          <div class="contact-head">
            ${d.heading ? `<h2><span class="grad-text">${esc(d.heading)}</span></h2>` : ''}
            ${d.subheading ? `<p>${esc(d.subheading)}</p>` : ''}
          </div>
          <form class="contact-card" onsubmit="event.preventDefault(); var m=this.querySelector('.success-msg'); if(m){m.style.display='flex';} this.reset();">
            ${fieldHTML.join('')}
            <button type="submit" class="submit-btn">${esc(d.submitLabel || 'Send Message')} ${ICON_ARROW}</button>
            <div class="success-msg" style="display:none">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 8px #4ade80"></span>
              ${esc(d.successMessage || 'Thanks — your message landed.')}
            </div>
          </form>
        </div>
      </section>`;
  }

  function fieldEl(f) {
    if (!f) return '';
    const name = esc(f.name);
    const label = esc(f.label);
    const required = f.required ? 'required' : '';
    if (f.type === 'textarea') {
      return `<div class="field"><label for="cf_${name}">${label}</label><textarea id="cf_${name}" name="${name}" placeholder="Tell me about your project, timeline, and goals…" ${required}></textarea></div>`;
    }
    if (f.type === 'select') {
      const opts = safeArr(f.options).map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('');
      return `<div class="field"><label for="cf_${name}">${label}</label><select id="cf_${name}" name="${name}" ${required}><option value="">— Select —</option>${opts}</select></div>`;
    }
    const type = f.type === 'email' ? 'email' : 'text';
    const placeholder = type === 'email' ? 'you@studio.com' : 'Your name';
    return `<div class="field"><label for="cf_${name}">${label}</label><input type="${type}" id="cf_${name}" name="${name}" placeholder="${placeholder}" ${required}></div>`;
  }

  function renderTextBlock(d) {
    const align = d.alignment || 'left';
    const width = d.maxWidth === 'narrow' ? 'narrow' : '';
    const body = d.body
      ? `<div class="text-body reveal"><p>${esc(d.body).replace(/\n\n+/g, '</p><p>')}</p></div>`
      : '';
    return `
      <section class="section section-text">
        <div class="container ${width}" style="text-align:${align}">
          ${d.heading ? `<h2 class="section-heading reveal">${esc(d.heading)}</h2>` : ''}
          ${body}
        </div>
      </section>`;
  }

  function renderImageText(d) {
    const pos = d.imagePosition === 'right' ? 'image-right' : '';
    const img = d.imageUrl ? `<div class="image-text-image reveal"><img src="${esc(d.imageUrl)}" alt="${esc(d.heading || '')}"></div>` : '';
    const text = `
      <div class="image-text-body reveal">
        ${d.heading ? `<h2 class="section-heading">${esc(d.heading)}</h2>` : ''}
        ${d.body ? `<p>${esc(d.body)}</p>` : ''}
        ${d.buttonText ? `<a class="btn btn-grad btn-lg" href="${attr(d.buttonLink)}">${esc(d.buttonText)}</a>` : ''}
      </div>`;
    return `
      <section class="section section-image-text">
        <div class="container">
          <div class="image-text-split ${pos}">
            ${pos ? text + img : img + text}
          </div>
        </div>
      </section>`;
  }

  function renderCtaBanner(d) {
    const style = d.style || 'accent';
    return `
      <section class="section section-cta cta-${esc(style)}">
        <div class="container">
          ${d.heading ? `<h2 class="cta-heading reveal">${esc(d.heading)}</h2>` : ''}
          ${d.subheading ? `<p class="cta-subheading reveal">${esc(d.subheading)}</p>` : ''}
          ${d.buttonText ? `<a class="btn btn-grad btn-lg" href="${attr(d.buttonLink)}">${esc(d.buttonText)} ${ICON_ARROW}</a>` : ''}
        </div>
      </section>`;
  }

  const RENDERERS = {
    'hero': renderHero,
    'stats': renderStats,
    'about': renderAbout,
    'services': renderServices,
    'portfolio-grid': renderPortfolioGrid,
    'testimonials': renderTestimonials,
    'contact-form': renderContactForm,
    'text-block': renderTextBlock,
    'image-text': renderImageText,
    'cta-banner': renderCtaBanner
  };

  // Sections that should NOT get the alternating `.alt` background (they have their own bg).
  const NO_ALT = new Set(['hero', 'portfolio-grid', 'contact-form', 'cta-banner', 'stats']);

  async function renderPage(page, mountEl) {
    const sections = safeArr(page.sections)
      .slice()
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .filter(s => s.visible !== false);

    let altIndex = 0;
    const htmlParts = await Promise.all(sections.map(async s => {
      const fn = RENDERERS[s.type];
      if (!fn) return '';
      try {
        let result = fn(s.data || {});
        if (result && typeof result.then === 'function') result = await result;
        // Alternate background on "neutral" sections to get the diagonal cut effect
        if (!NO_ALT.has(s.type) && result) {
          if (altIndex % 2 === 1 && result.startsWith('<section class="section')) {
            result = result.replace('<section class="section', '<section class="section alt');
          }
          altIndex++;
        }
        return result;
      } catch (err) {
        console.error('Section render error:', s.type, err);
        return '';
      }
    }));

    mountEl.innerHTML = htmlParts.join('\n');

    // Reveal animations
    const reveals = mountEl.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      reveals.forEach(el => obs.observe(el));
    } else {
      reveals.forEach(el => el.classList.add('visible'));
    }

    // Cursor-follow glow on service cards
    mountEl.querySelectorAll('[data-svc]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const mx = ((e.clientX - r.left) / r.width) * 100;
        const my = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty('--mx', mx + '%');
        card.style.setProperty('--my', my + '%');
      });
    });

    // SEO
    if (page.seo) {
      if (page.seo.title) document.title = page.seo.title;
      if (page.seo.description) {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
        meta.content = page.seo.description;
      }
    } else if (page.title) {
      document.title = page.title;
    }
  }

  global.CatalystRenderer = { renderPage, RENDERERS };
})(window);
