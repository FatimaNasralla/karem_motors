// Store settings
const CONFIG = {
  showPrices: true,  // set to false to hide prices
  showStock: true,   // set to false to hide quantities
  currency: '$',
};

const products = window.PRODUCTS || [];
const state = { query: '', category: 'All', sort: 'item' };

const $ = (sel) => document.querySelector(sel);
const grid = $('#grid');
const empty = $('#empty');
const dialog = $('#detail');

const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

// "OIL SEAL( VITON )" -> "Oil Seal (Viton)"
function titleCase(name) {
  return name
    .replace(/\s*\(\s*/g, ' (').replace(/\s*\)/g, ')')
    .toLowerCase()
    .replace(/(^|[\s(/+-])([a-z])/g, (m, p, c) => p + c.toUpperCase())
    .replace(/\b(Pto|Rh|Lh|Std|Kph|Bspp)\b/g, (w) => w.toUpperCase())
    .trim();
}

function formatPrice(p) {
  if (!CONFIG.showPrices) return '';
  if (p == null) return '<span class="price ask">Ask for price</span>';
  return `<span class="price">${CONFIG.currency}${p.toFixed(2)}</span>`;
}

function formatModel(m) {
  if (!m) return 'Universal';
  if (/T[ÜU]M MODELLER/i.test(m)) return 'All models';
  return m.replace(/-/g, ' · ');
}

function matches(p, q) {
  if (!q) return true;
  const hay = `${p.name} ${p.original} ${p.ceylan} ${p.model} ${p.category}`.toLowerCase();
  return q.split(/\s+/).every((t) => hay.includes(t));
}

function sorted(list) {
  const s = [...list];
  const price = (p) => p.price ?? Infinity;
  switch (state.sort) {
    case 'name': return s.sort((a, b) => a.name.localeCompare(b.name));
    case 'price-asc': return s.sort((a, b) => price(a) - price(b));
    case 'price-desc': return s.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    default: return s.sort((a, b) => a.item - b.item);
  }
}

function renderCategories() {
  const counts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const cats = ['All', ...Object.keys(counts).sort()];
  $('#categories').innerHTML = cats.map((c) => `
    <button class="chip${c === state.category ? ' active' : ''}" data-cat="${escapeHtml(c)}">
      ${escapeHtml(c)} <span>${c === 'All' ? products.length : counts[c]}</span>
    </button>`).join('');
}

function card(p) {
  return `
    <article class="card" tabindex="0" data-item="${p.item}">
      <div class="thumb"><img src="${p.image}" alt="${escapeHtml(titleCase(p.name))}" loading="lazy"></div>
      <div class="card-body">
        <span class="cat">${escapeHtml(p.category)}</span>
        <h3>${escapeHtml(titleCase(p.name))}</h3>
        <p class="partno">${escapeHtml(p.original)}</p>
        <p class="model">${escapeHtml(formatModel(p.model))}</p>
        <div class="card-foot">
          ${formatPrice(p.price)}
          ${CONFIG.showStock ? `<span class="stock">${p.qty} in stock</span>` : ''}
        </div>
      </div>
    </article>`;
}

function render() {
  const q = state.query.trim().toLowerCase();
  const list = sorted(products.filter((p) =>
    (state.category === 'All' || p.category === state.category) && matches(p, q)));
  grid.innerHTML = list.map(card).join('');
  empty.hidden = list.length > 0;
  $('#result-count').textContent = `${list.length} part${list.length === 1 ? '' : 's'}`;
}

function openDetail(item) {
  const p = products.find((x) => x.item === item);
  if (!p) return;
  $('#detail-body').innerHTML = `
    <div class="detail-img"><img src="${p.image}" alt=""></div>
    <div class="detail-info">
      <span class="cat">${escapeHtml(p.category)}</span>
      <h2>${escapeHtml(titleCase(p.name))}</h2>
      ${formatPrice(p.price)}
      <dl>
        <dt>Part number</dt><dd>${escapeHtml(p.original)}</dd>
        <dt>Ceylan code</dt><dd>${escapeHtml(p.ceylan)}</dd>
        <dt>Fits models</dt><dd>${escapeHtml(formatModel(p.model))}</dd>
        ${CONFIG.showStock ? `<dt>Available</dt><dd>${p.qty} pcs</dd>` : ''}
      </dl>
    </div>`;
  dialog.showModal();
}

// Events
$('#search').addEventListener('input', (e) => { state.query = e.target.value; render(); });
$('#sort').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
$('#categories').addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  state.category = btn.dataset.cat;
  renderCategories();
  render();
});
grid.addEventListener('click', (e) => {
  const c = e.target.closest('.card');
  if (c) openDetail(Number(c.dataset.item));
});
grid.addEventListener('keydown', (e) => {
  const c = e.target.closest('.card');
  if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openDetail(Number(c.dataset.item)); }
});
$('#detail-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

// Init
$('#total-count').textContent = products.length;
$('#year').textContent = new Date().getFullYear();
renderCategories();
render();
