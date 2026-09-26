(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const CONTACT = {
    phone: '01 255 823',
    phoneHref: 'tel:+9611255823',
    email: 'info@medlogservices.com',
    address: 'New Hankash, Dora, Lebanon'
  };

  // Replace with the company's real profile URLs.
  const SOCIAL = [
    { label: 'Facebook', href: 'https://www.facebook.com', icon: 'facebook' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: 'linkedin' },
    { label: 'Instagram', href: 'https://www.instagram.com', icon: 'instagram' },
    { label: 'X (Twitter)', href: 'https://x.com', icon: 'x' }
  ];

  const NAV = [
    { key: 'home', href: 'index.html', label: 'Home' },
    { key: 'about', href: 'about.html', label: 'About' },
    { key: 'services', href: 'services.html', label: 'Services' },
    { key: 'contact', href: 'contact.html', label: 'Contact' }
  ];

  const SERVICES = [
    ['air', 'Air Freight'], ['sea', 'Sea Freight'], ['land', 'Land Transport'], ['customs', 'Customs Clearance'],
    ['warehouse', 'Warehousing'], ['supply-chain', 'Supply Chain'], ['project-cargo', 'Project Cargo'], ['insurance', 'Cargo Insurance']
  ];

  /* ---------- Icon sprite (Lucide-style outlines) ---------- */
  const ICONS = {
    plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    ship: '<path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 10v4M12 2v3"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    customs: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/>',
    warehouse: '<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12M6 14h12"/><rect x="6" y="10" width="12" height="12"/>',
    network: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8"/>',
    package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.7 4.73a2 2 0 0 0 2 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    tag: '<path d="M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.42l8.7 8.7a2.43 2.43 0 0 0 3.42 0l6.58-6.58a2.43 2.43 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r="1"/>',
    eye: '<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',
    headset: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
    'alert-circle': '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    'arrow-right': '<path d="M5 12h14M12 5l7 7-7 7"/>',
    'arrow-up': '<path d="m5 12 7-7 7 7M12 19V5"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    pin: '<path d="M20 10c0 5-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 15 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    star: '<path fill="currentColor" stroke="none" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.8 5.41a2 2 0 0 1-1.27 1.27L7.76 16.24l1.8-5.41a2 2 0 0 1 1.27-1.27z"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
    pill: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    shirt: '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
    cog: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7.5"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/>',
    building: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/>',
    x: '<path d="M4 4l11.73 16H20L8.27 4zM4 20l6.77-6.77M20 4l-6.77 6.77"/>'
  };

  const sprite = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">' +
    Object.entries(ICONS).map(([name, body]) => `<symbol id="i-${name}" viewBox="0 0 24 24">${body}</symbol>`).join('') +
    '</svg>';

  const icon = (name, cls = '') => `<svg class="i ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  /* ---------- Layout: header, mobile menu, footer ---------- */
  const page = document.body.dataset.page || '';
  const navLinks = NAV.map(n =>
    `<a href="${n.href}"${n.key === page ? ' class="active" aria-current="page"' : ''}>${n.label}</a>`).join('');
  const mobileLinks = NAV.concat([{ key: 'quote', href: 'quote.html', label: 'Get a Quote' }]).map((n, i) =>
    `<a class="m-link${n.key === page ? ' active' : ''}" style="--i:${i}" href="${n.href}"${n.key === page ? ' aria-current="page"' : ''}>${n.label}</a>`).join('');

  const headerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="progress" aria-hidden="true"></div>
    <header class="header" id="header">
      <div class="container">
        <a class="brand" href="index.html" aria-label="Med Logistics Services — Home">
          <img class="logo-light" src="images/logo-med-white.webp" alt="Med Logistics Services" width="83" height="52">
          <img class="logo-dark" src="images/logo-med.webp" alt="" width="83" height="52">
        </a>
        <nav class="nav" aria-label="Main">${navLinks}</nav>
        <div class="header-cta">
          <a class="header-phone" href="${CONTACT.phoneHref}">${icon('phone')}${CONTACT.phone}</a>
          <a class="btn btn-primary btn-sm" href="quote.html">Get a Quote ${icon('arrow-right', 'i-arrow')}</a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
    <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
      <nav aria-label="Mobile">${mobileLinks}</nav>
      <div class="m-foot">
        <a href="${CONTACT.phoneHref}">${icon('phone')}${CONTACT.phone}</a>
        <a href="mailto:${CONTACT.email}">${icon('mail')}${CONTACT.email}</a>
      </div>
    </div>`;

  const footerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <img class="footer-logo" src="images/logo-med-white.webp" alt="Med Logistics Services" width="111" height="70" loading="lazy">
            <p>Your trusted partner in global freight forwarding. Connecting Lebanon to the world with precision, speed, and reliability.</p>
            <div class="socials">
              ${SOCIAL.map(s => `<a href="${s.href}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}">${icon(s.icon)}</a>`).join('')}
            </div>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="about.html">About Us</a></li>
              <li><a href="services.html">Our Services</a></li>
              <li><a href="quote.html">Request a Quote</a></li>
              <li><a href="contact.html">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4>Services</h4>
            <ul>${SERVICES.map(([id, label]) => `<li><a href="services.html#${id}">${label}</a></li>`).join('')}</ul>
          </div>
          <div>
            <h4>Get in Touch</h4>
            <ul>
              <li class="contact-line">${icon('pin')}<span>${CONTACT.address}</span></li>
              <li class="contact-line">${icon('phone')}<a href="${CONTACT.phoneHref}">${CONTACT.phone}</a></li>
              <li class="contact-line">${icon('mail')}<a href="mailto:${CONTACT.email}">${CONTACT.email}</a></li>
              <li class="contact-line">${icon('clock')}<span>Mon – Fri: 8:00 AM – 6:00 PM<br>Sat: 9:00 AM – 1:00 PM</span></li>
            </ul>
          </div>
        </div>
        <div class="footer-mark" aria-hidden="true">MED LOGISTICS</div>
        <div class="footer-bottom">
          <span>© <span data-year></span> Med Logistics Services SARL. All rights reserved.</span>
          <em>From Skyline to Shoreline</em>
        </div>
      </div>
    </footer>
    <button class="to-top" type="button" aria-label="Back to top">
      <svg class="ring-svg" viewBox="0 0 54 54" aria-hidden="true"><circle cx="27" cy="27" r="25"/></svg>
      ${icon('arrow-up')}
    </button>`;

  document.body.insertAdjacentHTML('afterbegin', sprite + headerHTML);
  document.body.insertAdjacentHTML('beforeend', footerHTML);

  // Expose the icon helper for page scripts.
  window.MLS = { icon, CONTACT };

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.setAttribute('aria-hidden', String(!open));
  };
  toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  mobileMenu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------- Scroll-driven: header, progress, parallax, back-to-top ---------- */
  const header = document.getElementById('header');
  const progress = document.querySelector('.progress');
  const toTop = document.querySelector('.to-top');
  const parallaxEls = reduceMotion ? [] : [...document.querySelectorAll('[data-parallax]')];
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(y / max, 1) : 0;
    header.classList.toggle('scrolled', y > 30);
    progress.style.setProperty('--p', p.toFixed(4));
    toTop.style.setProperty('--p', p.toFixed(4));
    toTop.classList.toggle('show', y > 600);

    const vh = window.innerHeight;
    parallaxEls.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      el.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * speed).toFixed(1)}px`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* ---------- Reveal on scroll ---------- */
  document.querySelectorAll('[data-stagger]').forEach(group => {
    const step = parseFloat(group.dataset.stagger) || 0.1;
    group.querySelectorAll(':scope > [data-reveal]').forEach((el, i) => el.style.setProperty('--d', `${(i * step).toFixed(2)}s`));
  });

  const formatCount = (el, v) => {
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    return v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + (el.dataset.suffix || '');
  };
  const counters = el => el.querySelectorAll('[data-count]').forEach(countUp);
  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.querySelectorAll('[data-count]').forEach(el => { el.textContent = formatCount(el, 0); });
  }
  const revealTargets = document.querySelectorAll('[data-reveal], [data-observe]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(el => io.observe(el));

    const cio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        cio.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in'));
    counters(document);
  }

  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const target = parseFloat(el.dataset.count);
    const format = v => formatCount(el, v);
    if (reduceMotion) { el.textContent = format(target); return; }
    const duration = 2200;
    const start = performance.now();
    const tick = now => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = format(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Word rotator ---------- */
  document.querySelectorAll('[data-rotator]').forEach(r => {
    const items = [...r.children];
    if (!items.length) return;
    items[0].classList.add('is-active');
    if (reduceMotion || items.length < 2) return;
    let i = 0;
    setInterval(() => {
      const current = items[i];
      current.classList.replace('is-active', 'is-leaving');
      i = (i + 1) % items.length;
      items[i].classList.remove('is-leaving');
      items[i].classList.add('is-active');
      setTimeout(() => current.classList.remove('is-leaving'), 800);
    }, 2600);
  });

  /* ---------- Marquee: duplicate content for a seamless loop ---------- */
  document.querySelectorAll('.marquee-track').forEach(track => {
    [...track.children].forEach(child => {
      const clone = child.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });

  /* ---------- Pointer effects: tilt, spotlight, hero depth ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateX(${((0.5 - y) * 7).toFixed(2)}deg) rotateY(${((x - 0.5) * 9).toFixed(2)}deg) translateY(-6px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    const hero = document.querySelector('.hero');
    if (hero) {
      const layers = hero.querySelectorAll('[data-depth]');
      hero.addEventListener('pointermove', e => {
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        layers.forEach(l => {
          const d = parseFloat(l.dataset.depth) || 10;
          l.style.translate = `${(-dx * d).toFixed(1)}px ${(-dy * d).toFixed(1)}px`;
        });
      });
    }
  }
  if (finePointer) {
    document.querySelectorAll('.spot').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Pause looping effects while off-screen ---------- */
  const setSvgPaused = (root, paused) => root.querySelectorAll('svg.hero-routes').forEach(svg => {
    if (paused) svg.pauseAnimations(); else svg.unpauseAnimations();
  });
  if (reduceMotion) {
    setSvgPaused(document, true);
  } else if ('IntersectionObserver' in window) {
    const pio = new IntersectionObserver(entries => entries.forEach(({ target, isIntersecting }) => {
      target.classList.toggle('is-paused', !isIntersecting);
      setSvgPaused(target, !isIntersecting);
    }));
    document.querySelectorAll('.hero, .page-hero, .partners, .stats-band, .media-stack').forEach(el => pio.observe(el));
  }

  /* ---------- Testimonials slider ---------- */
  document.querySelectorAll('[data-slider]').forEach(slider => {
    const track = slider.querySelector('.t-track');
    const slides = [...track.children];
    const dotsWrap = slider.querySelector('.t-dots');
    let index = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 't-dot';
      b.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      b.addEventListener('click', () => { go(i); restart(); });
      dotsWrap.appendChild(b);
    });
    const dots = [...dotsWrap.children];

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, j) => s.setAttribute('aria-hidden', String(j !== index)));
      dots.forEach((d, j) => {
        d.classList.toggle('active', j === index);
        d.setAttribute('aria-current', j === index ? 'true' : 'false');
      });
    }
    function restart() {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(() => go(index + 1), 6500);
    }

    slider.querySelector('[data-prev]').addEventListener('click', () => { go(index - 1); restart(); });
    slider.querySelector('[data-next]').addEventListener('click', () => { go(index + 1); restart(); });
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', restart);
    slider.addEventListener('focusin', () => clearInterval(timer));

    let startX = null;
    const viewport = slider.querySelector('.t-viewport');
    viewport.addEventListener('pointerdown', e => { startX = e.clientX; });
    viewport.addEventListener('pointerup', e => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 50) { go(index + (dx < 0 ? 1 : -1)); restart(); }
      startX = null;
    });

    go(0);
    restart();
  });

  /* ---------- Track shipment form → contact page ---------- */
  document.querySelectorAll('form[data-track]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      const value = input.value.trim();
      if (!value) {
        form.classList.remove('shake');
        void form.offsetWidth;
        form.classList.add('shake');
        input.focus();
        return;
      }
      window.location.href = `contact.html?tracking=${encodeURIComponent(value.slice(0, 60))}#contact-form`;
    });
  });

  /* ---------- Services page: sticky chip nav ---------- */
  const chipNav = document.querySelector('.chip-nav');
  if (chipNav && 'IntersectionObserver' in window) {
    const chips = [...chipNav.querySelectorAll('a')];
    const sio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        chips.forEach(c => {
          const active = c.getAttribute('href') === `#${entry.target.id}`;
          c.classList.toggle('active', active);
          if (active) chipNav.scrollTo({ left: c.offsetLeft - 20, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('.service-row[id]').forEach(s => sio.observe(s));
  }
})();
