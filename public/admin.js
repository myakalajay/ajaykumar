/* Admin portal client. Talks to /api/* on the same origin; session lives in an
   HttpOnly cookie, so every call is credentials-included. */
(() => {
  const $ = (id) => document.getElementById(id);
  const api = (path, opts = {}) => fetch(path, { credentials: 'same-origin', ...opts });

  const state = { view: 'dashboard', users: [], messages: [], contentKeys: [], experience: [], certifications: [] };

  /* ── helpers ── */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtMs = (ms) => {
    const s = Math.round((ms || 0) / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ${s % 60}s`;
    return `${Math.floor(m / 60)}h ${m % 60}m`;
  };
  const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString() : '—');
  const shortId = (id) => (id && id.length > 12 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id || '—');

  // Human names for ISO-639-1 codes surfaced in the audience analytics.
  const LANG_NAMES = {
    en: 'English', ar: 'العربية', ja: '日本語', ko: '한국어', zh: '中文', de: 'Deutsch',
    fr: 'Français', es: 'Español', pt: 'Português', it: 'Italiano', nl: 'Nederlands',
    ru: 'Русский', tr: 'Türkçe', he: 'עברית', hi: 'हिन्दी', sv: 'Svenska', no: 'Norsk',
    da: 'Dansk', fi: 'Suomi', pl: 'Polski', cs: 'Čeština', vi: 'Tiếng Việt', th: 'ไทย', id: 'Bahasa',
  };

  let toastTimer;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('on'), 2200);
  }

  async function j(res) {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }

  /* ── auth ── */
  $('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('login-btn');
    const err = $('login-err');
    btn.disabled = true;
    err.textContent = '';
    try {
      await j(await api('/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: $('pw').value }) }));
      $('pw').value = '';
      await enter();
    } catch (ex) {
      err.textContent = ex.message;
    } finally {
      btn.disabled = false;
    }
  });

  $('logout').addEventListener('click', async () => {
    await api('/api/auth/logout', { method: 'POST' }).catch(() => {});
    $('app').classList.remove('on');
    $('login').style.display = '';
  });

  async function enter() {
    $('login').style.display = 'none';
    $('app').classList.add('on');
    await load(state.view);
  }

  /* ── navigation ── */
  $('nav').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-view]');
    if (!btn) return;
    state.view = btn.dataset.view;
    [...$('nav').querySelectorAll('button')].forEach((b) => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.section').forEach((s) => s.classList.toggle('on', s.id === `view-${state.view}`));
    $('view-title').textContent = btn.textContent;
    load(state.view);
  });

  async function load(view) {
    try {
      if (view === 'dashboard') await loadDashboard();
      else if (view === 'audience') await loadAudience();
      else if (view === 'visitors') await loadUsers();
      else if (view === 'messages') await loadMessages();
      else if (view === 'experience') await loadExperience();
      else if (view === 'certifications') await loadCertifications();
      else if (view === 'content') await loadContent();
    } catch (ex) {
      if (String(ex.message) === 'Unauthorized') {
        $('app').classList.remove('on');
        $('login').style.display = '';
      } else toast(ex.message);
    }
  }

  /* ── dashboard ── */
  async function loadDashboard() {
    const d = await j(await api('/api/admin/stats'));
    const t = d.totals || {};
    const cards = [
      { k: 'Visitors', v: t.visitors },
      { k: 'Page views', v: t.pageviews },
      { k: 'Views · 7d', v: t.views_7d },
      { k: 'Active · 7d', v: t.active_7d },
      { k: 'Avg time', v: fmtMs(t.avg_ms) },
      { k: 'Messages', v: `${t.messages ?? 0}${t.unread ? ` (${t.unread} new)` : ''}` },
    ];
    $('stat-cards').innerHTML = cards
      .map((c) => `<div class="card"><div class="k">${esc(c.k)}</div><div class="v">${esc(c.v ?? 0)}</div></div>`)
      .join('');

    const days = d.byDay || [];
    const max = Math.max(1, ...days.map((x) => x.views));
    $('chart').innerHTML = days.length
      ? days.map((x) => `<div class="bar" style="height:${Math.max(2, (x.views / max) * 100)}%" title="${esc(x.day)}: ${x.views} views"></div>`).join('')
      : '<div class="empty" style="width:100%">No views recorded yet.</div>';

    $('top-paths').innerHTML = (d.topPaths || []).map((p) => `<tr><td>${esc(p.path)}</td><td>${p.views}</td></tr>`).join('') || '<tr><td colspan="2" class="muted">No data yet.</td></tr>';
  }

  /* ── audience / analytics ── */
  const DONUT_COLORS = ['#ff3d5a', '#4cc9ff', '#46e3a8', '#ffb547', '#b98bff', '#6d6c75'];

  function hbars(el, rows, fmtLabel, total) {
    if (!rows || !rows.length) { el.innerHTML = '<div class="muted" style="padding:8px 0">No data yet.</div>'; return; }
    const max = Math.max(...rows.map((r) => r.v), 1);
    el.innerHTML = rows.map((r) => `
      <div class="hbar" title="${esc(fmtLabel(r.k))}: ${r.v}">
        <span class="lbl">${esc(fmtLabel(r.k))}</span>
        <span class="track"><span class="fill" style="width:${Math.max(2, (r.v / max) * 100)}%"></span></span>
        <span class="num">${r.v}${total ? ` · ${Math.round((r.v / total) * 100)}%` : ''}</span>
      </div>`).join('');
  }

  async function loadAudience() {
    const d = await j(await api('/api/admin/stats'));

    const countries = (d.byCountry || []).map((c) => ({ k: c.country, v: c.visitors }));
    hbars($('geo-countries'), countries, (c) => (c ? c.toUpperCase() : '—'));
    $('geo-empty').hidden = countries.length > 0;

    const langs = (d.byLang || []).map((l) => ({ k: l.lang, v: l.visitors }));
    hbars($('geo-langs'), langs, (l) => (LANG_NAMES[l] || l || '—').toUpperCase());

    // Device donut.
    const devices = (d.byDevice || []).map((x) => ({ k: x.device || 'unknown', v: x.visitors }));
    const devTotal = devices.reduce((n, x) => n + x.v, 0) || 1;
    let acc = 0;
    const stops = devices.map((x, i) => {
      const from = (acc / devTotal) * 360;
      acc += x.v;
      const to = (acc / devTotal) * 360;
      return `${DONUT_COLORS[i % DONUT_COLORS.length]} ${from}deg ${to}deg`;
    });
    $('dev-donut').style.background = devices.length
      ? `conic-gradient(${stops.join(',')})`
      : 'rgba(255,255,255,0.06)';
    $('dev-donut').innerHTML = `<div class="center"><span class="n">${devTotal}</span><span class="t">visitors</span></div>`;
    $('dev-legend').innerHTML = devices.map((x, i) => `
      <li><span class="dot" style="background:${DONUT_COLORS[i % DONUT_COLORS.length]}"></span>
        <span class="lg-name">${esc(x.k)}</span>
        <span class="lg-val">${x.v} · ${Math.round((x.v / devTotal) * 100)}%</span></li>`).join('') || '<li class="muted">No data yet.</li>';

    // Top cities table.
    const cities = d.topCities || [];
    $('top-cities').innerHTML = cities.map((c) => `
      <tr><td>${esc(c.city || '—')}</td><td>${esc((c.country || '').toUpperCase() || '—')}</td><td>${c.visitors}</td></tr>`).join('')
      || '<tr><td colspan="3" class="muted">No city data yet.</td></tr>';
    $('cities-empty').hidden = cities.length > 0;

    // Engagement. These come from named events, which are stored as their own
    // type, so a press is never counted as an arrival.
    const EVENTS = {
      cta: 'Call-to-action press',
      'cv-download': 'CV download / print',
      'project-open': 'Case study opened',
      'profile-switch': 'Viewer profile changed',
      outbound: 'Outbound link',
      contact: 'Contact started',
    };
    const events = (d.byEvent || []).map((x) => ({ k: x.type, v: x.count }));
    hbars($('ev-bars'), events, (k) => EVENTS[k] || k || '—');
    $('ev-empty').hidden = events.length > 0;

    const sections = (d.bySection || []).map((x) => ({ k: x.section, v: x.views }));
    hbars($('sec-bars'), sections, (k) => (k || '—').replace(/^profile:/, 'profile '));
  }

  /* ── visitors ── */
  let uTimer;
  $('u-search').addEventListener('input', () => {
    clearTimeout(uTimer);
    uTimer = setTimeout(loadUsers, 300);
  });

  async function loadUsers() {
    const q = encodeURIComponent($('u-search').value.trim());
    const d = await j(await api(`/api/admin/users?limit=200${q ? `&q=${q}` : ''}`));
    state.users = d.users || [];
    $('u-count').textContent = `${d.total ?? state.users.length} visitor${(d.total ?? state.users.length) === 1 ? '' : 's'}`;
    $('u-empty').hidden = state.users.length > 0;
    $('u-body').innerHTML = state.users
      .map(
        (u) => `<tr data-id="${esc(u.visitor_id)}">
          <td title="${esc(u.visitor_id)}">${esc(shortId(u.visitor_id))}</td>
          <td>${esc([u.city, u.country].filter(Boolean).join(', ') || '—')}</td>
          <td>${esc((u.lang || '').toUpperCase() || '—')}</td>
          <td>${esc(u.device || '—')} · ${esc(u.browser || '—')} · ${esc(u.os || '—')}</td>
          <td>${u.page_views ?? 0}</td>
          <td>${esc(fmtMs(u.total_ms))}</td>
          <td>${esc(fmtDate(u.last_seen))}</td>
        </tr>`,
      )
      .join('');
  }

  $('u-body').addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-id]');
    if (tr) openUser(tr.dataset.id);
  });

  async function openUser(id) {
    const d = await j(await api(`/api/admin/users/${encodeURIComponent(id)}`));
    const u = d.user;
    const kv = [
      ['Visitor ID', u.visitor_id],
      ['First seen', fmtDate(u.first_seen)],
      ['Last seen', fmtDate(u.last_seen)],
      ['Visits', u.visits],
      ['Page views', u.page_views],
      ['Time on site', fmtMs(u.total_ms)],
      ['Location', [u.city, u.country].filter(Boolean).join(', ') || '—'],
      ['Language', u.lang ? (LANG_NAMES[u.lang] || u.lang.toUpperCase()) : '—'],
      ['Device', `${u.device || '—'} · ${u.browser || '—'} · ${u.os || '—'}`],
      ['Referrer', u.referrer || '—'],
      ['Landing page', u.landing_path || '—'],
    ];
    const events = (d.events || [])
      .map((ev) => `<tr><td>${esc(ev.type)}</td><td>${esc(ev.path)}${ev.section ? ` <span class="pill">${esc(ev.section)}</span>` : ''}</td><td>${esc(fmtDate(ev.ts))}</td></tr>`)
      .join('');
    openDrawer(`
      <div class="k" style="color:var(--smoke);font-size:11px;letter-spacing:.18em;text-transform:uppercase">Visitor</div>
      <h2 style="font-family:'Bebas Neue',Impact,sans-serif;letter-spacing:.06em;margin:6px 0 0">${esc(shortId(u.visitor_id))}</h2>
      <dl class="kv">${kv.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
      <div class="k" style="margin-top:22px;color:var(--smoke);font-size:11px;letter-spacing:.18em;text-transform:uppercase">Recent activity</div>
      <table><thead><tr><th>Type</th><th>Path</th><th>When</th></tr></thead><tbody>${events || '<tr><td colspan="3" class="muted">No events.</td></tr>'}</tbody></table>
    `);
  }

  /* ── messages ── */
  async function loadMessages() {
    const d = await j(await api('/api/admin/messages'));
    state.messages = d.messages || [];
    $('m-empty').hidden = state.messages.length > 0;
    $('m-body').innerHTML = state.messages
      .map(
        (m) => `<tr data-id="${m.id}" data-read="${m.read}">
          <td><strong>${esc(m.name)}</strong> <span class="muted">&lt;${esc(m.email)}&gt;</span> ${m.read ? '' : '<span class="pill unread">new</span>'}</td>
          <td>${esc(m.subject || '(no subject)')}</td>
          <td>${esc(fmtDate(m.createdat))}</td>
          <td><button class="btn btn-sm" data-del="${m.id}">Delete</button></td>
        </tr>`,
      )
      .join('');
  }

  $('m-body').addEventListener('click', async (e) => {
    const del = e.target.closest('button[data-del]');
    if (del) {
      e.stopPropagation();
      if (!confirm('Delete this message?')) return;
      await api(`/api/admin/messages/${del.dataset.del}`, { method: 'DELETE' });
      toast('Message deleted');
      loadMessages();
      return;
    }
    const tr = e.target.closest('tr[data-id]');
    if (tr) openMessage(Number(tr.dataset.id));
  });

  async function openMessage(id) {
    const m = state.messages.find((x) => x.id === id);
    if (!m) return;
    if (!m.read) {
      m.read = 1;
      await api(`/api/admin/messages/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ read: true }) }).catch(() => {});
    }
    openDrawer(`
      <div class="k" style="color:var(--smoke);font-size:11px;letter-spacing:.18em;text-transform:uppercase">Message</div>
      <h2 style="margin:8px 0 0">${esc(m.subject || '(no subject)')}</h2>
      <dl class="kv">
        <dt>From</dt><dd>${esc(m.name)}</dd>
        <dt>Email</dt><dd><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></dd>
        <dt>Received</dt><dd>${esc(fmtDate(m.createdat))}</dd>
      </dl>
      <div class="msg-body">${esc(m.body)}</div>
    `);
  }

  /* ── experience ── */
  // Field lists drive both the drawer form and the payload, so a column can never
  // be added to one without the other.
  const X_FIELDS = [
    ['title', 'Job title', 'input'],
    ['org', 'Organisation', 'input'],
    ['place', 'Location', 'input'],
    ['period', 'Period (e.g. Apr 2024 – May 2026)', 'input'],
    ['tagline', 'One-line descriptor', 'input'],
    ['url', 'Case-study URL (optional)', 'input'],
    ['highlight', 'Impact highlight (1–2 sentences)', 'text'],
  ];
  const Z_FIELDS = [
    ['title', 'Credential', 'input'],
    ['issuer', 'Issuer', 'input'],
    ['issued', 'Issued (year or range)', 'input'],
    ['url', 'Link (optional)', 'input'],
  ];

  function formFields(fields) {
    return fields
      .map(([k, label, kind]) =>
        kind === 'text'
          ? `<label for="f-${k}">${esc(label)}</label><textarea id="f-${k}" rows="4"></textarea>`
          : `<label for="f-${k}">${esc(label)}</label><input id="f-${k}" type="text" />`,
      )
      .join('');
  }

  function fillFields(fields, row) {
    for (const [k] of fields) $('f-' + k).value = row && row[k] != null ? row[k] : '';
  }

  function collect(fields) {
    const out = {};
    for (const [k] of fields) out[k] = $('f-' + k).value.trim();
    return out;
  }

  async function loadExperience() {
    const d = await j(await api('/api/admin/experience'));
    state.experience = d.experience || [];
    $('x-empty').hidden = state.experience.length > 0;
    $('x-body').innerHTML = state.experience
      .map(
        (x) => `<tr data-id="${x.id}">
          <td><strong>${esc(x.title)}</strong>${x.tagline ? `<div class="muted">${esc(x.tagline)}</div>` : ''}</td>
          <td>${esc(x.org)}${x.place ? `<div class="muted">${esc(x.place)}</div>` : ''}</td>
          <td>${esc(x.period || '—')}</td>
          <td><button class="btn btn-sm" data-edit="${x.id}">Edit</button>
              <button class="btn btn-sm" data-del="${x.id}">Delete</button></td>
        </tr>`,
      )
      .join('');
    $('x-msg').textContent = `${state.experience.length} role${state.experience.length === 1 ? '' : 's'}`;
  }

  $('x-add').addEventListener('click', () => {
    openDrawer(`
      <div class="k" style="color:var(--smoke);font-size:11px;letter-spacing:.18em;text-transform:uppercase">New role</div>
      <h2 style="margin:8px 0 0">Add experience</h2>
      ${formFields(X_FIELDS)}
      <div class="row" style="margin-top:18px">
        <button class="btn btn-primary" style="width:auto;margin:0;padding:10px 22px" data-save-exp="new">Save role</button>
      </div>
      <p class="muted err" id="f-err"></p>
    `);
    fillFields(X_FIELDS, null);
  });

  $('x-body').addEventListener('click', async (e) => {
    const edit = e.target.closest('button[data-edit]');
    const del = e.target.closest('button[data-del]');
    if (edit) {
      const row = state.experience.find((x) => String(x.id) === edit.dataset.edit);
      if (!row) return;
      openDrawer(`
        <div class="k" style="color:var(--smoke);font-size:11px;letter-spacing:.18em;text-transform:uppercase">Role</div>
        <h2 style="margin:8px 0 0">${esc(row.title)}</h2>
        ${formFields(X_FIELDS)}
        <div class="row" style="margin-top:18px">
          <button class="btn btn-primary" style="width:auto;margin:0;padding:10px 22px" data-save-exp="${row.id}">Save changes</button>
        </div>
        <p class="muted err" id="f-err"></p>
      `);
      fillFields(X_FIELDS, row);
      return;
    }
    if (del) {
      if (!confirm('Delete this role from the published CV?')) return;
      await j(await api(`/api/admin/experience/${del.dataset.del}`, { method: 'DELETE' }));
      toast('Role deleted');
      loadExperience();
    }
  });

  /* ── certifications ── */
  async function loadCertifications() {
    const d = await j(await api('/api/admin/certifications'));
    state.certifications = d.certifications || [];
    $('z-empty').hidden = state.certifications.length > 0;
    $('z-body').innerHTML = state.certifications
      .map(
        (x) => `<tr data-id="${x.id}">
          <td><strong>${esc(x.title)}</strong></td>
          <td>${esc(x.issuer || '—')}</td>
          <td>${esc(x.issued || '—')}</td>
          <td><button class="btn btn-sm" data-edit="${x.id}">Edit</button>
              <button class="btn btn-sm" data-del="${x.id}">Delete</button></td>
        </tr>`,
      )
      .join('');
    $('z-msg').textContent = `${state.certifications.length} credential${state.certifications.length === 1 ? '' : 's'}`;
  }

  $('z-add').addEventListener('click', () => {
    openDrawer(`
      <div class="k" style="color:var(--smoke);font-size:11px;letter-spacing:.18em;text-transform:uppercase">New credential</div>
      <h2 style="margin:8px 0 0">Add certification</h2>
      ${formFields(Z_FIELDS)}
      <div class="row" style="margin-top:18px">
        <button class="btn btn-primary" style="width:auto;margin:0;padding:10px 22px" data-save-cert="new">Save credential</button>
      </div>
      <p class="muted err" id="f-err"></p>
    `);
    fillFields(Z_FIELDS, null);
  });

  $('z-body').addEventListener('click', async (e) => {
    const edit = e.target.closest('button[data-edit]');
    const del = e.target.closest('button[data-del]');
    if (edit) {
      const row = state.certifications.find((x) => String(x.id) === edit.dataset.edit);
      if (!row) return;
      openDrawer(`
        <div class="k" style="color:var(--smoke);font-size:11px;letter-spacing:.18em;text-transform:uppercase">Credential</div>
        <h2 style="margin:8px 0 0">${esc(row.title)}</h2>
        ${formFields(Z_FIELDS)}
        <div class="row" style="margin-top:18px">
          <button class="btn btn-primary" style="width:auto;margin:0;padding:10px 22px" data-save-cert="${row.id}">Save changes</button>
        </div>
        <p class="muted err" id="f-err"></p>
      `);
      fillFields(Z_FIELDS, row);
      return;
    }
    if (del) {
      if (!confirm('Delete this credential?')) return;
      await j(await api(`/api/admin/certifications/${del.dataset.del}`, { method: 'DELETE' }));
      toast('Credential deleted');
      loadCertifications();
    }
  });

  /* ── content ── */
  async function refreshContentList() {
    const d = await j(await api('/api/admin/content'));
    const content = d.content || {};
    state.contentKeys = Object.keys(content);
    $('c-list').innerHTML = state.contentKeys.length
      ? state.contentKeys.map((k) => `<button class="btn btn-sm" data-key="${esc(k)}">${esc(k)}</button>`).join('')
      : '<span class="muted">No content saved yet.</span>';
  }

  async function loadContent() {
    await refreshContentList().catch(() => {});
    const key = $('c-key').value.trim();
    if (!key) return;
    try {
      const d = await j(await api('/api/admin/content'));
      const val = (d.content || {})[key];
      $('c-value').value = val === undefined ? '' : JSON.stringify(val, null, 2);
      $('c-msg').textContent = val === undefined ? 'New key' : '';
    } catch (ex) {
      $('c-msg').textContent = ex.message;
    }
  }

  $('c-load').addEventListener('click', loadContent);
  $('c-new').addEventListener('click', () => {
    $('c-key').value = '';
    $('c-value').value = '';
    $('c-msg').textContent = 'Enter a new key, then Save';
  });
  $('c-list').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-key]');
    if (b) {
      $('c-key').value = b.dataset.key;
      loadContent();
    }
  });

  $('c-save').addEventListener('click', async () => {
    const key = $('c-key').value.trim();
    if (!/^[a-z][a-z0-9-]{0,40}$/.test(key)) {
      $('c-msg').textContent = 'Key must be lowercase letters, digits or dashes';
      return;
    }
    let value;
    try {
      value = JSON.parse($('c-value').value || 'null');
    } catch {
      $('c-msg').textContent = 'Invalid JSON';
      return;
    }
    try {
      await api(`/api/admin/content/${encodeURIComponent(key)}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ value }) });
      $('c-msg').textContent = 'Saved';
      toast(`Saved “${key}”`);
      refreshContentList();
    } catch (ex) {
      $('c-msg').textContent = ex.message;
    }
  });

  /* ── drawer ── */
  function openDrawer(html) {
    $('drawer-content').innerHTML = html;
    $('drawer').classList.add('on');
    $('drawer-bg').classList.add('on');
  }
  function closeDrawer() {
    $('drawer').classList.remove('on');
    $('drawer-bg').classList.remove('on');
    if (state.view === 'messages') loadMessages();
    if (state.view === 'visitors') loadUsers();
    if (state.view === 'experience') loadExperience();
    if (state.view === 'certifications') loadCertifications();
  }

  /** Save handlers live on the drawer so they survive re-rendering its contents. */
  $('drawer').addEventListener('click', async (e) => {
    const exp = e.target.closest('button[data-save-exp]');
    const cert = e.target.closest('button[data-save-cert]');
    if (!exp && !cert) return;
    const btn = exp || cert;
    const isNew = btn.dataset.saveExp === 'new' || btn.dataset.saveCert === 'new';
    const base = exp ? '/api/admin/experience' : '/api/admin/certifications';
    const fields = exp ? X_FIELDS : Z_FIELDS;
    const id = exp ? btn.dataset.saveExp : btn.dataset.saveCert;
    btn.disabled = true;
    try {
      const payload = collect(fields);
      await j(
        await api(isNew ? base : `${base}/${id}`, {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        }),
      );
      closeDrawer();
      toast(isNew ? 'Saved' : 'Changes saved');
    } catch (ex) {
      const err = $('f-err');
      if (err) err.textContent = ex.message;
      else toast(ex.message);
    } finally {
      btn.disabled = false;
    }
  });
  $('drawer-close').addEventListener('click', closeDrawer);
  $('drawer-bg').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ── clock ── */
  const tick = () => {
    $('clock').textContent = new Date().toLocaleString();
  };
  tick();
  setInterval(tick, 30_000);

  /* ── boot: are we already signed in? ── */
  api('/api/auth/me', { method: 'POST' })
    .then((r) => r.json())
    .then((d) => {
      if (d.authenticated) enter();
    })
    .catch(() => {});
})();
