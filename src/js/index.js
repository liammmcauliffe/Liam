
// helper functions because I'm lazy
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

// app state
const state = {
  theme: localStorage.getItem('theme') || 'dark',
  commands: [],
  projects: [
    { id: 'proj-3d', label: 'Open: Low‑poly Living Room', hint: 'View project card', action: () => location.hash = '#projects' },
    { id: 'proj-impact', label: 'Open: MyHomeImpact case study', hint: 'Scroll to Projects', action: () => location.hash = '#projects' },
    { id: 'proj-arch', label: 'Open: Arch‑Minimal Desktop', hint: 'Scroll to Projects', action: () => location.hash = '#projects' },
  ],
};

// theme switching (dark mode is better for your eyes)
function applyTheme() {
  const html = document.documentElement;
  if (state.theme === 'dark') {
    html.classList.remove('light');
    html.classList.add('dark');
    $('#iconMoon').classList.add('hidden');
    $('#iconSun').classList.remove('hidden');
  } else {
    html.classList.remove('dark');
    html.classList.add('light');
    $('#iconMoon').classList.remove('hidden');
    $('#iconSun').classList.add('hidden');
  }
  localStorage.setItem('theme', state.theme);
}
$('#themeToggle').addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme();
});

// command palette - the coolest part of this site
const palette = {
  open: false,
  el: $('#commandPalette'),
  input: $('#cmdInput'),
  list: $('#cmdResults'),
  results: [],
  index: -1,
  commands: [
    { id: 'about', label: 'Open: About', hint: 'Scroll to section', keywords: ['bio', 'who'], action: () => document.querySelector('#about').scrollIntoView({ behavior: 'smooth' }) },
    { id: 'resume', label: 'Open: Resume Drawer', hint: 'Quick view', keywords: ['cv', 'experience'], action: () => openResume() },
    { id: 'projects', label: 'Open: Projects', hint: 'Scroll to section', keywords: ['work', 'builds'], action: () => document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' }) },
    { id: 'contact', label: 'Copy: Email to clipboard', hint: 'liam@example.com', keywords: ['email', 'reach'], action: () => copyText('liam@example.com') },
    { id: 'theme', label: 'Toggle: Theme', hint: 'Dark/Light', keywords: ['dark', 'light', 'color'], action: () => { $('#themeToggle').click(); toast('Theme toggled'); } },
    // project shortcuts get added below
  ]
};

palette.commands.push(...state.projects);

function openPalette() {
  palette.open = true;
  palette.el.classList.remove('hidden');
  palette.input.value = '';
  renderResults(palette.commands);
  setTimeout(() => palette.input.focus(), 20);
  $('#openCmd').setAttribute('aria-expanded', 'true');
}
function closePalette() {
  palette.open = false;
  palette.el.classList.add('hidden');
  palette.index = -1;
  $('#openCmd').setAttribute('aria-expanded', 'false');
}

$('#openCmd').addEventListener('click', openPalette);

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    palette.open ? closePalette() : openPalette();
  }
  if (e.key === 'Escape' && palette.open) closePalette();
});

// fuzzy search - wrote this myself because I didn't want another dependency
function score(item, query) {
  query = query.toLowerCase();
  const target = (item.label + ' ' + (item.keywords || []).join(' ')).toLowerCase();
  let ti = 0, qi = 0, bonus = 0;
  while (ti < target.length && qi < query.length) {
    if (target[ti] === query[qi]) { qi++; bonus += 2; }
    ti++;
  }
  // give bonus points for keyword matches
  if ((item.keywords || []).some(k => query && k.includes(query))) bonus += 3;
  // prefix matches get highest priority
  if (target.startsWith(query)) bonus += 5;
  return qi === query.length ? bonus + Math.max(0, 10 - (target.length - query.length)) : -1;
}

function renderResults(items) {
  palette.results = items;
  palette.list.innerHTML = items.map((item, i) => `
        <li class="group flex items-center gap-3 p-3 hover:bg-white/5 ${i === 0 ? 'bg-white/5' : ''} command-item" data-index="${i}" role="button" tabindex="0" aria-label="${item.label}">
          <div class="size-2 rounded-full bg-emerald-400/70 group-hover:bg-emerald-300"></div>
          <div>
            <div class="text-sm">${item.label}</div>
            <div class="text-[11px] text-white/50">${item.hint || ''}</div>
          </div>
          <div class="ml-auto text-[10px] text-white/40">→</div>
        </li>
      `).join('');
  palette.index = items.length ? 0 : -1;
}

palette.input.addEventListener('input', (e) => {
  const q = e.target.value.trim();
  if (!q) return renderResults(palette.commands);
  const ranked = palette.commands
    .map(item => ({ item, s: score(item, q) }))
    .filter(x => x.s >= 0)
    .sort((a, b) => b.s - a.s)
    .map(x => x.item);
  renderResults(ranked);
});

palette.list.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  const idx = +li.dataset.index;
  const item = palette.results[idx];
  if (item) { item.action(); closePalette(); }
});

document.addEventListener('keydown', (e) => {
  if (!palette.open) return;
  const max = palette.results.length - 1;
  if (['ArrowDown', 'Tab'].includes(e.key)) {
    e.preventDefault();
    palette.index = Math.min(max, palette.index + 1);
    focusResult();
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    palette.index = Math.max(0, palette.index - 1);
    focusResult();
  }
  if (e.key === 'Enter') {
    const item = palette.results[palette.index];
    if (item) { item.action(); closePalette(); }
  }
  if (e.key === 'ArrowRight') {
    const item = palette.results[palette.index];
    if (item && item.hint) { toast(item.hint); }
  }
});

function focusResult() {
  const items = $$('#cmdResults > li');
  items.forEach((el, i) => el.classList.toggle('bg-white/5', i === palette.index));
  if (items[palette.index]) items[palette.index].focus();
}

// resume drawer functions
function openResume() { $('#resumeDrawer').classList.remove('translate-y-full'); }
function closeResume() { $('#resumeDrawer').classList.add('translate-y-full'); }
$('#openResume').addEventListener('click', openResume);
$('#closeResume').addEventListener('click', closeResume);

// utility functions
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => toast('Copied email to clipboard'));
}
function toast(msg) {
  const n = document.createElement('div');
  n.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-sm shadow-glow';
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 1600);
}

// update age display to match the age counter
function updateAgeDisplay() {
  const birth = new Date("2005-10-19T12:30:00");
  const now = new Date();
  const diffMs = now - birth;
  const years = diffMs / (1000 * 60 * 60 * 24 * 365.2425);

  // update the main age display
  const ageElement = $('#ageDisplay');
  if (ageElement) {
    ageElement.textContent = Math.floor(years);
  }

  // update the detailed age counter
  const ageCounterElement = $('#ageCounter');
  if (ageCounterElement) {
    ageCounterElement.textContent = years.toFixed(21);
  }
}

// add some interactive hover effects for the skill cards
function initSkillCards() {
  const skillCards = document.querySelectorAll('#about .group');
  skillCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // add a subtle glow effect
      card.style.transform = 'translateY(-2px)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
}

// initialize everything
$('#year').textContent = new Date().getFullYear();
updateAgeDisplay();
applyTheme();
initSkillCards();

// update age counter every 100ms for smooth animation
setInterval(updateAgeDisplay, 100);
