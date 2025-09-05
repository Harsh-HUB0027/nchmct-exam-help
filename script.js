/* Global UI */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('hidden');
  });
}

// Smooth scroll (enhanced)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id && id.startsWith('#') && document.querySelector(id)) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// Swiper (Gallery)
const swiper = new Swiper('.swiper-container', {
  loop: true,
  autoplay: { delay: 2500 },
  pagination: { el: '.swiper-pagination', clickable: true },
});

/* Table Search + Filters */
const searchInput = document.getElementById('searchInput');
const catFilter = document.getElementById('catFilter');
const stateFilter = document.getElementById('stateFilter');
const resetBtn = document.getElementById('resetFilters');
const rows = Array.from(document.querySelectorAll('#collegeTable tbody tr'));

function matches(row, term, cat, state) {
  const text = row.innerText.toLowerCase();
  const okTerm = term ? text.includes(term) : true;
  const okCat = cat ? (row.dataset.cat === cat) : true;
  const okState = state ? (row.dataset.state === state) : true;
  return okTerm && okCat && okState;
}

function applyFilters() {
  const term = searchInput.value.trim().toLowerCase();
  const cat = catFilter.value;
  const state = stateFilter.value;
  let visible = 0;
  rows.forEach(r => {
    if (matches(r, term, cat, state)) { r.classList.remove('hidden'); visible++; }
    else { r.classList.add('hidden'); }
  });
  let msg = document.getElementById('noResultsRow');
  if (!msg) {
    msg = document.createElement('tr');
    msg.id = 'noResultsRow';
    msg.innerHTML = '<td colspan="9" class="px-4 py-6 text-center text-gray-500">No colleges match your filters. Try clearing the filters.</td>';
    document.querySelector('#collegeTable tbody').appendChild(msg);
  }
  msg.classList.toggle('hidden', visible !== 0);
}
if (searchInput && catFilter && stateFilter) {
  searchInput.addEventListener('input', applyFilters);
  catFilter.addEventListener('change', applyFilters);
  stateFilter.addEventListener('change', applyFilters);
  resetBtn.addEventListener('click', () => {
    searchInput.value=''; catFilter.value=''; stateFilter.value=''; applyFilters();
  });
  applyFilters();
}

/* Sortable columns */
const head = document.querySelector('#collegeTable thead');
let sortState = { key: null, dir: 1 };
function getCellValue(row, key) {
  const map = { name:'[data-name]', cat:'[data-cat]', state:'[data-state]', seats:'[data-seats]' };
  const el = row.querySelector(map[key]);
  return el ? el.textContent.trim() : '';
}
function parseNum(v) {
  const n = parseInt(String(v).replace(/[^0-9]/g,''),10);
  return isNaN(n) ? -Infinity : n;
}
function sortTable(key, type='str') {
  const tbody = document.querySelector('#collegeTable tbody');
  const list = rows.slice().filter(r => !r.id || r.id !== 'noResultsRow');
  const dir = (sortState.key === key) ? -sortState.dir : 1;
  sortState = { key, dir };
  list.sort((a,b) => {
    const va = getCellValue(a, key);
    const vb = getCellValue(b, key);
    if (type === 'num') return dir * (parseNum(va) - parseNum(vb));
    return dir * va.localeCompare(vb);
  });
  list.forEach(r => tbody.appendChild(r));
}
if (head) {
  head.addEventListener('click', (e) => {
    const th = e.target.closest('.sortable');
    if (!th) return;
    const key = th.dataset.key;
    const type = th.dataset.type || 'str';
    sortTable(key, type);
  });
}

/* Contact Form
   To send to Telegram:
   1) Create a bot @BotFather, get BOT_TOKEN
   2) Start a chat with your bot to get CHAT_ID (or use @RawDataBot)
   3) Fill the constants below
*/
const BOT_TOKEN = ""; // e.g., '123456:ABC-...'
const CHAT_ID = "";   // e.g., 123456789

async function sendToTelegram(text) {
  if (!BOT_TOKEN || !CHAT_ID) return false;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const resp = await fetch(url, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ chat_id: CHAT_ID, text })
  });
  return resp.ok;
}

const form = document.getElementById('contactForm');
const mailBtn = document.getElementById('mailtoBtn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const text = `New enquiry from NCHMCT site:%0AName: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
    let ok = false;
    try { ok = await sendToTelegram(decodeURIComponent(text)); } catch {}
    if (ok) alert('Thanks! We have received your message on Telegram.');
    else window.location.href = `mailto:you@example.com?subject=NCHMCT%20Enquiry&body=${text}`;
  });
}

if (mailBtn) {
  mailBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const text = `New enquiry from NCHMCT site:%0AName: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
    window.location.href = `mailto:you@example.com?subject=NCHMCT%20Enquiry&body=${text}`;
  });
}
