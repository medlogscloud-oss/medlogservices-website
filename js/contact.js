(() => {
  'use strict';

  const form = document.getElementById('message-form');
  if (!form) return;
  const el = form.elements;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const TO = 'info@medlogservices.com';

  const params = new URLSearchParams(location.search);
  const service = params.get('service');
  if (service && [...el.service.options].some(o => o.value === service)) el.service.value = service;
  const tracking = (params.get('tracking') || '').trim().slice(0, 60);
  if (tracking) {
    el.service.value = 'tracking';
    el.message.value = `Hello, I would like a status update for shipment ${tracking}.`;
  }

  const setError = (name, msg) => {
    document.getElementById(`err-${name}`).textContent = msg;
    el[name].closest('.field').classList.toggle('invalid', Boolean(msg));
    el[name].setAttribute('aria-invalid', msg ? 'true' : 'false');
  };

  const checks = {
    name: () => (el.name.value.trim() ? '' : 'Name is required'),
    email: () => {
      const v = el.email.value.trim();
      if (!v) return 'Email is required';
      return EMAIL_RE.test(v) ? '' : 'Invalid email address';
    },
    message: () => (el.message.value.trim() ? '' : 'Message is required')
  };

  form.addEventListener('input', e => {
    const check = checks[e.target.name];
    if (check && !check()) setError(e.target.name, '');
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let first = null;
    Object.entries(checks).forEach(([name, check]) => {
      const msg = check();
      setError(name, msg);
      if (msg && !first) first = name;
    });
    if (first) { el[first].focus(); return; }

    const serviceLabel = el.service.value ? el.service.selectedOptions[0].text : 'General enquiry';
    const subject = `Website enquiry: ${serviceLabel} — ${el.name.value.trim()}`;
    const body = [
      el.message.value.trim(),
      '',
      '---',
      `Name: ${el.name.value.trim()}`,
      `Email: ${el.email.value.trim()}`,
      `Phone: ${el.phone.value.trim() || 'Not provided'}`,
      `Service: ${serviceLabel}`
    ].join('\n');

    window.location.href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.getElementById('contact-status').hidden = false;
  });
})();
