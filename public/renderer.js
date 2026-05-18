/**
 * Public Page Renderer
 * Renders a Page object (with .sections) into HTML, using a registry of
 * section render functions. Each render function takes the section's `data`
 * and returns an HTML string.
 */
(function (global) {
  function esc(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>'"]/g, t => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[t]));
  }

  function safeArr(v) { return Array.isArray(v) ? v : []; }

  function buttonHTML(text, link, kind) {
    if (!text) return '';
    const cls = kind === 'primary' ? 'btn btn-primary' : 'btn btn-secondary';
    const href = link || '#';
    return `<a class="${cls}" href="${esc(href)}">${esc(text)}</a>`;
  }

  // -------- Section Renderers --------

  function renderHero(d) {
    const bg = d.backgroundStyle || 'dark';
    let bgStyle = '';
    if (bg === 'image' && d.backgroundImage) {
      bgStyle = `background: linear-gradient(rgba(10,10,15,0.7), rgba(10,10,15,0.85)), url('${esc(d.backgroundImage)}') center/cover;`;
    } else if (bg === 'gradient') {
      bgStyle = `background: linear-gradient(135deg, #1a1a26 0%, #2d1b4e 50%, #6c63ff 100%);`;
    }
    return `
      <section class="section section-hero ${bg === 'image' ? 'has-bg-image' : ''}" style="${bgStyle}">
        <div class="container hero-inner">
          ${d.heading ? `<h1 class="hero-heading">${esc(d.heading)}</h1>` : ''}
          ${d.subheading ? `<p class="hero-subheading">${esc(d.subheading)}</p>` : ''}
          ${d.description ? `<p class="hero-description">${esc(d.description)}</p>` : ''}
          <div class="hero-buttons">
            ${buttonHTML(d.primaryButtonText, d.primaryButtonLink, 'primary')}
            ${buttonHTML(d.secondaryButtonText, d.secondaryButtonLink, 'secondary')}
          </div>
        </div>
      </section>`;
  }

  function renderStats(d) {
    const items = safeArr(d.items).slice(0, 4);
    if (!items.length) return '';
    return `
      <section class="section section-stats">
        <div class="container">
          <div class="stats-grid">
            ${items.map(s => `
              <div class="stat-item reveal">
                <div class="stat-value">${esc(s.value)}</div>
                <div class="stat-label">${esc(s.label)}</div>
              </div>`).join('')}
          </div>
        </div>
      </section>`;
  }

  function renderAbout(d) {
    const layout = d.layout || 'text-only';
    const skills = safeArr(d.skills);
    const bodyHTML = `
      <div class="about-text reveal">
        ${d.heading ? `<h2 class="section-heading">${esc(d.heading)}</h2>` : ''}
        ${d.body ? `<p class="about-body">${esc(d.body)}</p>` : ''}
        ${skills.length ? `<div class="skills">${skills.map(s => `<span class="skill-tag">${esc(s)}</span>`).join('')}</div>` : ''}
      </div>`;
    const imgHTML = d.imageUrl ? `<div class="about-image reveal"><img src="${esc(d.imageUrl)}" alt="${esc(d.heading || 'About')}"></div>` : '';
    let inner;
    if (layout === 'text-left-image-right') inner = `<div class="about-split">${bodyHTML}${imgHTML}</div>`;
    else if (layout === 'text-right-image-left') inner = `<div class="about-split">${imgHTML}${bodyHTML}</div>`;
    else inner = bodyHTML;
    return `<section class="section section-about" id="about"><div class="container">${inner}</div></section>`;
  }

  function renderServices(d) {
    const items = safeArr(d.items);
    const cols = Number(d.columns) || 3;
    return `
      <section class="section section-services" id="services">
        <div class="container">
          ${d.heading ? `<h2 class="section-heading reveal">${esc(d.heading)}</h2>` : ''}
          ${d.subheading ? `<p class="section-subheading reveal">${esc(d.subheading)}</p>` : ''}
          <div class="services-grid" style="--cols:${cols}">
            ${items.map(s => `
              <div class="service-card reveal">
                <div class="service-icon">${esc(s.icon || '✨')}</div>
                <h3>${esc(s.title)}</h3>
                <p>${esc(s.description)}</p>
              </div>`).join('')}
          </div>
        </div>
      </section>`;
  }

  async function renderPortfolioGrid(d) {
    let items = safeArr(d.items);
    if (d.source === 'database') {
      try {
        const res = await fetch('/api/portfolio');
        const data = await res.json();
        if (Array.isArray(data)) items = data;
        else if (data && Array.isArray(data.items)) items = data.items;
      } catch (e) { /* fall back to manual */ }
    }
    const cols = Number(d.columns) || 2;
    const cards = items.map(it => `
      <a class="portfolio-card reveal" href="${esc(it.url || it.liveUrl || '#')}" target="_blank" rel="noopener">
        ${it.imageUrl ? `<div class="portfolio-image" style="background-image:url('${esc(it.imageUrl)}')"></div>` : '<div class="portfolio-image placeholder">📷</div>'}
        <div class="portfolio-body">
          ${it.category ? `<div class="portfolio-category">${esc(it.category)}</div>` : ''}
          <h3>${esc(it.title)}</h3>
          ${it.description ? `<p>${esc(it.description)}</p>` : ''}
          ${safeArr(it.tags).length ? `<div class="tags">${it.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
        </div>
      </a>`).join('');
    return `
      <section class="section section-portfolio" id="portfolio-grid">
        <div class="container">
          ${d.heading ? `<h2 class="section-heading reveal">${esc(d.heading)}</h2>` : ''}
          ${d.subheading ? `<p class="section-subheading reveal">${esc(d.subheading)}</p>` : ''}
          <div class="portfolio-grid" style="--cols:${cols}">
            ${cards || `<p class="empty-note">No projects yet.</p>`}
          </div>
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
      } catch (e) { /* fall back */ }
    }
    if (!items.length) {
      return `<section class="section section-testimonials"><div class="container">${d.heading ? `<h2 class="section-heading reveal">${esc(d.heading)}</h2>` : ''}<p class="empty-note">No testimonials yet.</p></div></section>`;
    }
    return `
      <section class="section section-testimonials">
        <div class="container">
          ${d.heading ? `<h2 class="section-heading reveal">${esc(d.heading)}</h2>` : ''}
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
    const fieldHTML = fields.map(f => {
      const name = esc(f.name);
      const label = esc(f.label);
      const required = f.required ? 'required' : '';
      if (f.type === 'textarea') {
        return `<div class="field"><label for="cf_${name}">${label}</label><textarea id="cf_${name}" name="${name}" ${required}></textarea></div>`;
      }
      if (f.type === 'select') {
        const opts = safeArr(f.options).map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('');
        return `<div class="field"><label for="cf_${name}">${label}</label><select id="cf_${name}" name="${name}" ${required}><option value="">— Select —</option>${opts}</select></div>`;
      }
      const type = f.type === 'email' ? 'email' : 'text';
      return `<div class="field"><label for="cf_${name}">${label}</label><input type="${type}" id="cf_${name}" name="${name}" ${required}></div>`;
    }).join('');

    return `
      <section class="section section-contact" id="contact-form">
        <div class="container narrow">
          ${d.heading ? `<h2 class="section-heading reveal">${esc(d.heading)}</h2>` : ''}
          ${d.subheading ? `<p class="section-subheading reveal">${esc(d.subheading)}</p>` : ''}
          <form class="contact-form reveal" onsubmit="event.preventDefault(); this.querySelector('.success-msg').style.display='block'; this.reset();">
            ${fieldHTML}
            <button type="submit" class="btn btn-primary">${esc(d.submitLabel || 'Send')}</button>
            <p class="success-msg" style="display:none">${esc(d.successMessage || 'Thanks!')}</p>
          </form>
        </div>
      </section>`;
  }

  function renderTextBlock(d) {
    const align = d.alignment || 'left';
    const width = d.maxWidth === 'narrow' ? 'narrow' : (d.maxWidth === 'wide' ? 'wide' : 'medium');
    return `
      <section class="section section-text">
        <div class="container ${width}" style="text-align:${align}">
          ${d.heading ? `<h2 class="section-heading reveal">${esc(d.heading)}</h2>` : ''}
          ${d.body ? `<div class="text-body reveal">${esc(d.body).replace(/\n\n+/g, '</p><p>').replace(/^/, '<p>') + '</p>'}</div>` : ''}
        </div>
      </section>`;
  }

  function renderImageText(d) {
    const pos = d.imagePosition === 'right' ? 'right' : 'left';
    const img = d.imageUrl ? `<div class="image-text-image reveal"><img src="${esc(d.imageUrl)}" alt="${esc(d.heading || '')}"></div>` : '';
    const text = `
      <div class="image-text-body reveal">
        ${d.heading ? `<h2 class="section-heading">${esc(d.heading)}</h2>` : ''}
        ${d.body ? `<p>${esc(d.body)}</p>` : ''}
        ${d.buttonText ? buttonHTML(d.buttonText, d.buttonLink, 'primary') : ''}
      </div>`;
    return `
      <section class="section section-image-text">
        <div class="container image-text-split image-${pos}">
          ${pos === 'left' ? img + text : text + img}
        </div>
      </section>`;
  }

  function renderCtaBanner(d) {
    const style = d.style || 'accent';
    return `
      <section class="section section-cta cta-${esc(style)}">
        <div class="container narrow" style="text-align:center">
          ${d.heading ? `<h2 class="cta-heading reveal">${esc(d.heading)}</h2>` : ''}
          ${d.subheading ? `<p class="cta-subheading reveal">${esc(d.subheading)}</p>` : ''}
          ${buttonHTML(d.buttonText, d.buttonLink, 'primary')}
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

  async function renderPage(page, mountEl) {
    const sections = safeArr(page.sections)
      .slice()
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .filter(s => s.visible !== false);

    const htmlParts = await Promise.all(sections.map(async s => {
      const fn = RENDERERS[s.type];
      if (!fn) return '';
      try {
        const result = fn(s.data || {});
        return (result && typeof result.then === 'function') ? await result : result;
      } catch (err) {
        console.error('Section render error:', s.type, err);
        return '';
      }
    }));

    mountEl.innerHTML = htmlParts.join('\n');

    // Intersection observer for reveal animations
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

    // Update SEO
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
