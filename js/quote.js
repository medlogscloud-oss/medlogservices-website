(() => {
  'use strict';

  const API_URL = 'https://adlltzwerpmsojwumhim.databasepad.com/rest/v1/quote_requests';
  // Public anon key: the table's row-level security must allow INSERT only for this role.
  const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImU5Yzg4ZThmLWY3Y2UtNDM0My04YzVjLWIzOTZmYmVkNjVkMiJ9.eyJwcm9qZWN0SWQiOiJhZGxsdHp3ZXJwbXNvand1bWhpbSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzcyMzc0MTk0LCJleHAiOjIwODc3MzQxOTQsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.vAnQ8-0lEaOPZB9zW6jcSJ_nSqODVsDJ910kV3yZ_Fk';

  const CARGO_TYPES = ['General Cargo', 'Electronics', 'Machinery & Equipment', 'Automotive Parts', 'Textiles & Garments',
    'Food & Beverages', 'Pharmaceuticals', 'Chemicals', 'Raw Materials', 'Furniture', 'Construction Materials',
    'Agricultural Products', 'Personal Effects', 'Other'];
  const INCOTERMS = ['EXW - Ex Works', 'FCA - Free Carrier', 'FAS - Free Alongside Ship', 'FOB - Free on Board',
    'CFR - Cost and Freight', 'CIF - Cost, Insurance & Freight', 'CPT - Carriage Paid To', 'CIP - Carriage & Insurance Paid To',
    'DAP - Delivered at Place', 'DPU - Delivered at Place Unloaded', 'DDP - Delivered Duty Paid'];
  const COUNTRIES = ['Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bahrain', 'Bangladesh', 'Belgium',
    'Brazil', 'Bulgaria', 'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Egypt',
    'Estonia', 'Ethiopia', 'Finland', 'France', 'Germany', 'Ghana', 'Greece', 'Hong Kong', 'Hungary', 'India', 'Indonesia',
    'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon', 'Libya',
    'Lithuania', 'Luxembourg', 'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Oman',
    'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Senegal',
    'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Tanzania', 'Thailand', 'Tunisia', 'Turkey', 'UAE', 'Ukraine', 'USA', 'Uruguay', 'Vietnam', 'Yemen'];
  const MODES = { air: 'Air Freight', sea: 'Sea Freight', land: 'Land Transport', multimodal: 'Multimodal' };
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const TOTAL = 4;

  const form = document.getElementById('quote-form');
  if (!form) return;
  const $ = id => document.getElementById(id);
  const el = form.elements;

  const fill = (select, items) => items.forEach(v => select.add(new Option(v, v)));
  fill(el.cargo_type, CARGO_TYPES);
  fill(el.incoterm, INCOTERMS);
  form.querySelectorAll('[data-countries]').forEach(s => fill(s, COUNTRIES));
  el.destination_country.value = 'Lebanon';
  el.delivery_date.min = new Date().toISOString().split('T')[0];

  // Preselect from ?service= links on the services page.
  const service = new URLSearchParams(location.search).get('service');
  const presets = {
    air: () => { el.transport_mode.value = 'air'; },
    sea: () => { el.transport_mode.value = 'sea'; },
    land: () => { el.transport_mode.value = 'land'; },
    'supply-chain': () => { el.transport_mode.value = 'multimodal'; },
    'project-cargo': () => { el.is_oversized.checked = true; },
    customs: () => { el.customs_clearance_needed.checked = true; },
    warehouse: () => { el.warehousing_needed.checked = true; },
    insurance: () => { el.insurance_needed.checked = true; }
  };
  if (presets[service]) presets[service]();

  const insuranceField = $('insurance-value-field');
  const syncInsurance = () => { insuranceField.hidden = !el.insurance_needed.checked; };
  el.insurance_needed.addEventListener('change', syncInsurance);
  syncInsurance();

  /* ---------- Validation ---------- */
  const setError = (name, message) => {
    const err = $(`err-${name}`);
    if (err) err.textContent = message || '';
    const target = name === 'transport_mode' ? $('transport_mode_group') : el[name];
    const field = target && (target.closest('.field') || target);
    if (field) field.classList.toggle('invalid', Boolean(message));
    if (el[name] && el[name].setAttribute) el[name].setAttribute('aria-invalid', message ? 'true' : 'false');
  };

  const rules = {
    1: {
      contact_name: () => el.contact_name.value.trim() ? '' : 'Name is required',
      contact_email: () => {
        const v = el.contact_email.value.trim();
        if (!v) return 'Email is required';
        return EMAIL_RE.test(v) ? '' : 'Invalid email address';
      },
      cargo_type: () => el.cargo_type.value ? '' : 'Select a cargo type',
      quantity: () => parseInt(el.quantity.value, 10) >= 1 ? '' : 'Minimum quantity is 1',
      weight_kg: () => parseFloat(el.weight_kg.value) > 0 ? '' : 'Enter a valid weight'
    },
    2: {
      origin_country: () => el.origin_country.value ? '' : 'Select origin country',
      origin_city: () => el.origin_city.value.trim() ? '' : 'Enter origin city',
      destination_country: () => el.destination_country.value ? '' : 'Select destination country',
      destination_city: () => el.destination_city.value.trim() ? '' : 'Enter destination city'
    },
    3: {
      transport_mode: () => el.transport_mode.value ? '' : 'Select a transport mode'
    }
  };

  const validate = step => {
    const stepRules = rules[step] || {};
    let firstInvalid = null;
    Object.entries(stepRules).forEach(([name, check]) => {
      const msg = check();
      setError(name, msg);
      if (msg && !firstInvalid) firstInvalid = name;
    });
    if (firstInvalid) {
      const target = firstInvalid === 'transport_mode' ? form.querySelector('input[name="transport_mode"]') : el[firstInvalid];
      target.focus();
    }
    return !firstInvalid;
  };

  // Clear a field's error as soon as the user fixes it.
  form.addEventListener('input', e => {
    const name = e.target.name;
    Object.values(rules).forEach(stepRules => {
      if (stepRules[name] && !stepRules[name]()) setError(name, '');
    });
  });
  form.addEventListener('change', e => {
    if (e.target.name === 'transport_mode') setError('transport_mode', '');
  });

  /* ---------- Steps ---------- */
  let current = 1;
  const panels = [...form.querySelectorAll('.q-panel')];
  const indicators = [...form.querySelectorAll('[data-step-indicator]')];
  const stepper = form.querySelector('.stepper');
  const backBtn = $('q-back');
  const nextBtn = $('q-next');
  const submitBtn = $('q-submit');
  const count = $('q-count');

  const goTo = step => {
    current = step;
    panels.forEach(p => p.classList.toggle('active', Number(p.dataset.step) === step));
    indicators.forEach(li => {
      const n = Number(li.dataset.stepIndicator);
      li.classList.toggle('active', n === step);
      li.classList.toggle('done', n < step);
      if (n === step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    stepper.style.setProperty('--progress', ((step - 1) / (TOTAL - 1)).toFixed(3));
    backBtn.hidden = step === 1;
    nextBtn.hidden = step === TOTAL;
    submitBtn.hidden = step !== TOTAL;
    count.textContent = `Step ${step} of ${TOTAL}`;
    if (step === TOTAL) renderReview();
    const top = form.closest('.form-card').getBoundingClientRect().top + window.scrollY - 100;
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
  };

  nextBtn.addEventListener('click', () => { if (validate(current)) goTo(Math.min(current + 1, TOTAL)); });
  backBtn.addEventListener('click', () => goTo(Math.max(current - 1, 1)));

  // Enter in a text input advances instead of submitting early.
  form.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && current < TOTAL) {
      e.preventDefault();
      nextBtn.click();
    }
  });

  /* ---------- Review ---------- */
  const val = name => (el[name].value || '').trim();
  const yesNo = name => (el[name].checked ? 'Yes' : 'No');

  function renderReview() {
    const dims = ['length_cm', 'width_cm', 'height_cm'].map(val);
    const blocks = [
      {
        title: 'Contact Information', step: 1, rows: [
          ['Full Name', val('contact_name')], ['Email', val('contact_email')],
          ['Phone', val('contact_phone')], ['Company', val('company_name')]
        ]
      },
      {
        title: 'Cargo Details', step: 1, rows: [
          ['Cargo Type', val('cargo_type')], ['Quantity', val('quantity')],
          ['Weight', val('weight_kg') ? `${val('weight_kg')} kg` : ''],
          ['Dimensions', dims.some(Boolean) ? `${dims.map(d => d || '—').join(' × ')} cm` : ''],
          ['Hazardous', yesNo('is_hazardous')], ['Fragile', yesNo('is_fragile')],
          ['Perishable', yesNo('is_perishable')], ['Oversized', yesNo('is_oversized')],
          ['Description', val('cargo_description'), true]
        ]
      },
      {
        title: 'Shipping Route', step: 2, rows: [
          ['Origin', [val('origin_city'), val('origin_country')].filter(Boolean).join(', ')],
          ['Destination', [val('destination_city'), val('destination_country')].filter(Boolean).join(', ')],
          ['Origin Port / Airport', val('origin_port')], ['Destination Port / Airport', val('destination_port')],
          ['Pickup Address', val('origin_address')], ['Delivery Address', val('destination_address')]
        ]
      },
      {
        title: 'Schedule & Services', step: 3, rows: [
          ['Transport Mode', MODES[el.transport_mode.value] || ''], ['Incoterm', val('incoterm')],
          ['Delivery Date', val('delivery_date')], ['Flexible Date', yesNo('is_flexible_date')],
          ['Cargo Insurance', yesNo('insurance_needed')],
          ...(el.insurance_needed.checked && val('insurance_value') ? [['Declared Value', `USD ${val('insurance_value')}`]] : []),
          ['Customs Clearance', yesNo('customs_clearance_needed')], ['Warehousing', yesNo('warehousing_needed')],
          ['Special Instructions', val('special_instructions'), true]
        ]
      }
    ];

    const review = $('review');
    review.replaceChildren();
    blocks.forEach(block => {
      const wrap = document.createElement('section');
      wrap.className = 'review-block';
      const head = document.createElement('div');
      head.className = 'review-head';
      const h = document.createElement('h3');
      h.textContent = block.title;
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'review-edit';
      edit.textContent = 'Edit';
      edit.setAttribute('aria-label', `Edit ${block.title}`);
      edit.addEventListener('click', () => goTo(block.step));
      head.append(h, edit);

      const dl = document.createElement('dl');
      dl.className = 'review-list';
      block.rows.forEach(([label, value, full]) => {
        if (full && !value) return;
        const row = document.createElement('div');
        if (full) row.className = 'full';
        const dt = document.createElement('dt');
        dt.textContent = label;
        const dd = document.createElement('dd');
        dd.textContent = value || 'Not specified';
        row.append(dt, dd);
        dl.appendChild(row);
      });
      wrap.append(head, dl);
      review.appendChild(wrap);
    });
    $('review-email').textContent = val('contact_email');
  }

  /* ---------- Submit ---------- */
  const num = name => (val(name) ? parseFloat(val(name)) : null);
  const orNull = name => val(name) || null;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (current !== TOTAL) return;
    for (let s = 1; s < TOTAL; s++) {
      if (!validate(s)) { goTo(s); validate(s); return; }
    }

    const payload = {
      contact_name: val('contact_name'),
      contact_email: val('contact_email'),
      contact_phone: orNull('contact_phone'),
      company_name: orNull('company_name'),
      cargo_type: val('cargo_type'),
      cargo_description: orNull('cargo_description'),
      quantity: parseInt(val('quantity'), 10),
      weight_kg: num('weight_kg'),
      length_cm: num('length_cm'),
      width_cm: num('width_cm'),
      height_cm: num('height_cm'),
      is_hazardous: el.is_hazardous.checked,
      is_fragile: el.is_fragile.checked,
      is_perishable: el.is_perishable.checked,
      is_oversized: el.is_oversized.checked,
      origin_country: val('origin_country'),
      origin_city: val('origin_city'),
      origin_address: orNull('origin_address'),
      origin_port: orNull('origin_port'),
      destination_country: val('destination_country'),
      destination_city: val('destination_city'),
      destination_address: orNull('destination_address'),
      destination_port: orNull('destination_port'),
      transport_mode: el.transport_mode.value,
      incoterm: orNull('incoterm'),
      delivery_date: orNull('delivery_date'),
      is_flexible_date: el.is_flexible_date.checked,
      insurance_needed: el.insurance_needed.checked,
      insurance_value: el.insurance_needed.checked ? num('insurance_value') : null,
      customs_clearance_needed: el.customs_clearance_needed.checked,
      warehousing_needed: el.warehousing_needed.checked,
      special_instructions: orNull('special_instructions'),
      status: 'pending'
    };

    const errorBox = $('submit-error');
    errorBox.hidden = true;
    submitBtn.disabled = true;
    backBtn.disabled = true;
    const label = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Submitting...';

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify([payload])
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      $('success-name').textContent = payload.contact_name;
      $('success-email').textContent = payload.contact_email;
      form.hidden = true;
      const success = $('quote-success');
      success.hidden = false;
      success.focus();
    } catch (err) {
      console.error('Quote submit error:', err);
      errorBox.querySelector('span').textContent =
        'We couldn\'t submit your request. Please try again, or contact us at info@medlogservices.com / 01 255 823.';
      errorBox.hidden = false;
    } finally {
      submitBtn.disabled = false;
      backBtn.disabled = false;
      submitBtn.innerHTML = label;
    }
  });

  goTo(1);
})();
