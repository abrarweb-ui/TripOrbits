// ================================================================
//   TRIPORBIT — Main JavaScript
// ================================================================

const WA   = '+917889693186';
const CALL = '+917889693186';
const WA_URL = `https://wa.me/${WA}?text=Hi%20TripOrbit!%20I%20want%20to%20enquire%20about%20a%20Kashmir%2FGurez%20trip.`;

// Firebase Config — same as Aadi Tour & Travel
const FB_CFG = {
  apiKey:            "AIzaSyADiBZe0V5gTnB89Ik1Bby2NDo-9nRxAHc",
  authDomain:        "insta-web-upload.firebaseapp.com",
  databaseURL:       "https://insta-web-upload-default-rtdb.firebaseio.com",
  projectId:         "insta-web-upload",
  storageBucket:     "insta-web-upload.firebasestorage.app",
  messagingSenderId: "1092302887537",
  appId:             "1:1092302887537:web:a1bb7595868c84c30999d0"
};

// ── FIREBASE INIT ─────────────────────────────────────────────
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs,
  query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let db = null;
try {
  const app = initializeApp(FB_CFG);
  db = getFirestore(app);
} catch(e) { console.warn('Firebase init error', e); }

// ── TOAST ─────────────────────────────────────────────────────
function toast(msg, type = '') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast ' + type;
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ── LOADER ────────────────────────────────────────────────────
window.addEventListener('load', () =>
  setTimeout(() => document.getElementById('pageLoader')?.classList.add('out'), 1100)
);

// ── NAVBAR ────────────────────────────────────────────────────
(function initNav() {
  const nav = document.getElementById('nav');
  const hbg = document.getElementById('navHbg');
  const nl  = document.getElementById('navLinks');
  const sct = document.getElementById('sct');
  const sbb = document.getElementById('sbb');

  if (!nav) return;

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    nav.classList.toggle('sc', sy > 80);
    sct?.classList.toggle('show', sy > 500);
    sbb?.classList.toggle('show', sy > 700);
  }, { passive: true });

  hbg?.addEventListener('click', e => {
    e.stopPropagation();
    const o = hbg.classList.toggle('open');
    nl?.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });

  nl?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hbg?.classList.remove('open');
    nl?.classList.remove('open');
    document.body.style.overflow = '';
  }));

  document.addEventListener('click', e => {
    if (nl?.classList.contains('open') && !nl.contains(e.target) && !hbg?.contains(e.target)) {
      hbg?.classList.remove('open');
      nl?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      hbg?.classList.remove('open');
      nl?.classList.remove('open');
      document.body.style.overflow = '';
      closeTourModal();
    }
  });

  sct?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ── REVEAL ANIMATIONS ─────────────────────────────────────────
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const sib = e.target.parentElement?.querySelectorAll('.rv,.rvl,.rvr') || [];
      let d = 0;
      sib.forEach((el, i) => { if (el === e.target) d = i * 80; });
      setTimeout(() => e.target.classList.add('in'), d);
      ro.unobserve(e.target);
    }
  });
}, { threshold: 0.07 });
document.querySelectorAll('.rv,.rvl,.rvr').forEach(el => ro.observe(el));

// ── COUNTERS ──────────────────────────────────────────────────
const co = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.count').forEach(el => {
        const end = parseInt(el.dataset.to);
        let n = 0;
        const step = Math.ceil(end / 40);
        const t = setInterval(() => {
          n = Math.min(n + step, end);
          el.textContent = n + (end >= 100 ? '+' : '');
          if (n >= end) clearInterval(t);
        }, 40);
      });
      co.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.trust-grid').forEach(el => co.observe(el));

// ── GALLERY ───────────────────────────────────────────────────
let galCache = [];
let lbIdx = 0;

async function loadGallery() {
  const grid = document.getElementById('galGrid');
  if (!grid) return;

  // Default gallery images
  const DEF_GAL = [
    { url: 'https://images.unsplash.com/photo-1626714638456-5f14c9427ad4?w=800&q=85', caption: 'Gurez Valley', cat: 'gurez' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85', caption: 'Kashmir Mountains', cat: 'kashmir' },
    { url: 'https://images.unsplash.com/photo-1591649462430-c88aeea56a4f?w=800&q=85', caption: 'Dal Lake Srinagar', cat: 'kashmir' },
    { url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=85', caption: 'Scenic Kashmir', cat: 'kashmir' },
    { url: 'https://images.unsplash.com/photo-1584732200355-486a95263014?w=800&q=85', caption: 'Snow Peaks', cat: 'gurez' },
    { url: 'https://images.unsplash.com/photo-1692287731328-58f55e8950cd?w=800&q=85', caption: 'Mountain Meadow', cat: 'gurez' },
    { url: 'https://images.unsplash.com/photo-1623996732821-66f739df7280?w=800&q=85', caption: 'Green Valley', cat: 'kashmir' },
    { url: 'https://images.unsplash.com/photo-1593417376544-4c4201061e22?w=800&q=85', caption: 'River View', cat: 'gurez' },
    { url: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&q=85', caption: 'Adventure Travel', cat: 'adventure' },
  ];

  try {
    if (db) {
      const s = await getDocs(query(collection(db, 'triporbit_gallery'), orderBy('order', 'asc')));
      if (!s.empty) {
        galCache = [];
        s.forEach(d => galCache.push({ id: d.id, ...d.data() }));
      } else { galCache = DEF_GAL; }
    } else { galCache = DEF_GAL; }
  } catch(e) { galCache = DEF_GAL; }

  renderGallery('all');
}

function renderGallery(cat) {
  const grid = document.getElementById('galGrid');
  if (!grid) return;
  const list = cat === 'all' ? galCache : galCache.filter(g => g.cat === cat);
  grid.innerHTML = list.map((g, i) => `
    <div class="gal-item" data-i="${i}">
      <img src="${g.url}" alt="${g.caption||''}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'"/>
      <div class="gal-ov"><i class="fas fa-expand"></i><span class="gal-cap">${g.caption||''}</span></div>
    </div>`).join('');

  grid.querySelectorAll('.gal-item').forEach(item => {
    item.addEventListener('click', () => openLb(parseInt(item.dataset.i)));
  });
}

// Gallery filter buttons
document.getElementById('galFilters')?.addEventListener('click', e => {
  const btn = e.target.closest('.gal-btn');
  if (!btn) return;
  document.querySelectorAll('.gal-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderGallery(btn.dataset.cat);
});

// Lightbox
function openLb(i) {
  lbIdx = i;
  const lb = document.getElementById('lb');
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCap');
  if (!lb || !galCache[i]) return;
  img.src = galCache[i].url;
  if (cap) cap.textContent = galCache[i].caption || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLb() {
  document.getElementById('lb')?.classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('lbClose')?.addEventListener('click', closeLb);
document.getElementById('lb')?.addEventListener('click', e => { if (e.target === document.getElementById('lb')) closeLb(); });
document.getElementById('lbPrev')?.addEventListener('click', () => openLb((lbIdx - 1 + galCache.length) % galCache.length));
document.getElementById('lbNext')?.addEventListener('click', () => openLb((lbIdx + 1) % galCache.length));
document.addEventListener('keydown', e => {
  if (!document.getElementById('lb')?.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  openLb((lbIdx - 1 + galCache.length) % galCache.length);
  if (e.key === 'ArrowRight') openLb((lbIdx + 1) % galCache.length);
});

// ── TOURS ─────────────────────────────────────────────────────
let toursCache = [];

const DEF_TOURS = [
  { id:'t1', title:'Gurez Valley Expedition', cat:'gurez', duration:'4N/5D', groupSize:'Any', badge:'badge-gold', badgeText:'Popular',
    image:'https://images.unsplash.com/photo-1626714638456-5f14c9427ad4?w=600&q=85',
    desc:'Explore the breathtaking Gurez Valley — one of Kashmir\'s most pristine and untouched destinations. Experience local Dard culture, Kishanganga River and majestic Himalayan peaks.',
    includes:['Hotel/Homestay Stay','Daily Breakfast & Dinner','AC Vehicle','Expert Local Guide','All Sightseeing'],
    itinerary:['Arrival Srinagar, drive to Gurez (4-5 hrs)','Habba Khatoon Peak viewpoint, Dawar town','Tulail Valley, Kishanganga River trek','Razdan Pass viewpoint, local village visit','Return Srinagar, departure'] },
  { id:'t2', title:'Classic Kashmir Tour', cat:'kashmir', duration:'5N/6D', groupSize:'Families', badge:'badge-royal', badgeText:'Best Seller',
    image:'https://images.unsplash.com/photo-1591649462430-c88aeea56a4f?w=600&q=85',
    desc:'A classic Kashmir itinerary covering Srinagar, Gulmarg, Pahalgam and Sonamarg — the four pillars of a perfect Kashmir holiday.',
    includes:['Hotel Stay','Breakfast & Dinner','Cab Services','Tour Guide','Shikara Ride'],
    itinerary:['Arrival Srinagar, Dal Lake shikara ride','Mughal Gardens, Shankaracharya Temple','Gulmarg Gondola & snow activities','Pahalgam, Betaab Valley, Aru Valley','Sonamarg, Thajiwas Glacier','Shopping & departure'] },
  { id:'t3', title:'Honeymoon Kashmir Special', cat:'honeymoon', duration:'6N/7D', groupSize:'Couples', badge:'badge-gold', badgeText:'Romantic',
    image:'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&q=85',
    desc:'A dreamy honeymoon in paradise — luxury houseboat stays, private shikara rides, candlelit dinners and exclusive couple experiences across Kashmir.',
    includes:['Luxury Houseboat','All Meals','Couple Activities','Private Vehicle','Rose Decoration'],
    itinerary:['Arrival, luxury houseboat check-in, sunset shikara','Dal Lake morning, Mughal Gardens tour','Gulmarg gondola, romantic mountain dinner','Pahalgam, river walk, Betaab Valley','Sonamarg day trip, glacier visit','Shopping, spa & leisure','Farewell & departure'] },
  { id:'t4', title:'Adventure Gurez Trek', cat:'adventure', duration:'3N/4D', groupSize:'4–12', badge:'badge-green', badgeText:'Adventure',
    image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=85',
    desc:'An adrenaline-filled adventure in the Gurez Himalayan wilderness — trekking, camping, river crossings and untouched mountain scenery.',
    includes:['Camping Equipment','All Meals','Expert Trek Guide','Transport','Safety Gear'],
    itinerary:['Drive Srinagar to Gurez, base camp setup','Razdan Pass trek, panoramic views','Kishanganga River trek & camping','Return to Srinagar & departure'] },
  { id:'t5', title:'Family Kashmir Package', cat:'family', duration:'7N/8D', groupSize:'Families', badge:'badge-royal', badgeText:'Family',
    image:'https://images.unsplash.com/photo-1623996732821-66f739df7280?w=600&q=85',
    desc:'A perfectly crafted family holiday covering all Kashmir highlights with kid-friendly activities, comfortable hotels and memory-making experiences.',
    includes:['Hotel Stay','Breakfast & Dinner','Family Vehicle','Expert Guide','All Entry Fees'],
    itinerary:['Arrival Srinagar, houseboat & shikara','Mughal Gardens, Pari Mahal, Zero Bridge','Gulmarg gondola & snow play','Pahalgam valleys, Lidder River','Sonamarg glacier visit','Gurez day trip (optional)','Shopping & departure'] },
  { id:'t6', title:'Group Kashmir Tour', cat:'group', duration:'5N/6D', groupSize:'10–30', badge:'badge-green', badgeText:'Group',
    image:'https://images.unsplash.com/photo-1593417376544-4c4201061e22?w=600&q=85',
    desc:'Expertly managed group tours for large families, corporate retreats, school trips and friend groups — cost-effective without compromising comfort.',
    includes:['Hotel Stay','All Meals','Group Transport','Guide','All Sightseeing'],
    itinerary:['Group arrival Srinagar, group check-in','Dal Lake shikara, Mughal Gardens tour','Gulmarg full day trip','Pahalgam, Betaab Valley & Aru Valley','Sonamarg & farewell dinner','Group departure'] },
];

async function loadTours() {
  const grid = document.getElementById('toursGrid');
  if (!grid) return;

  try {
    if (db) {
      const s = await getDocs(query(collection(db, 'triporbit_tours'), orderBy('order', 'asc')));
      if (!s.empty) {
        toursCache = [];
        s.forEach(d => toursCache.push({ id: d.id, ...d.data() }));
      } else { toursCache = DEF_TOURS; }
    } else { toursCache = DEF_TOURS; }
  } catch(e) { toursCache = DEF_TOURS; }

  renderTours('all');
}

function renderTours(f) {
  const grid = document.getElementById('toursGrid');
  if (!grid) return;
  const list = f === 'all' ? toursCache : toursCache.filter(t => t.cat === f);
  if (!list.length) { grid.innerHTML = '<p style="grid-column:span 3;text-align:center;color:var(--text2);padding:40px">No tours in this category yet.</p>'; return; }
  grid.innerHTML = list.map((t, i) => `
    <div class="tour-card rv">
      <div class="tour-img">
        <img src="${t.image||''}" alt="${t.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'"/>
        ${t.badge ? `<span class="tour-badge ${t.badge}">${t.badgeText}</span>` : ''}
      </div>
      <div class="tour-body">
        <div class="tour-cat">${t.cat||''}</div>
        <h3>${t.title||''}</h3>
        <div class="tour-meta">
          <span><i class="fas fa-clock"></i>${t.duration||''}</span>
          <span><i class="fas fa-users"></i>${t.groupSize||''}</span>
        </div>
        <p class="tour-desc">${t.desc||''}</p>
        <div class="tour-footer">
          <div class="tour-acts">
            <a href="https://wa.me/${WA}?text=Hi!%20I%20want%20to%20enquire%20about%20${encodeURIComponent(t.title)}" target="_blank" class="btn btn-wa btn-sm"><i class="fab fa-whatsapp"></i> Inquire</a>
            <button class="btn btn-royal btn-sm" onclick="openTourModal('${t.id}')"><i class="fas fa-info-circle"></i> Details</button>
          </div>
        </div>
      </div>
    </div>`).join('');
  grid.querySelectorAll('.rv').forEach(el => ro.observe(el));
}

// Tour filter
document.getElementById('tourFilters')?.addEventListener('click', e => {
  const btn = e.target.closest('.gal-btn');
  if (!btn) return;
  document.querySelectorAll('#tourFilters .gal-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderTours(btn.dataset.f);
});

// Tour modal
window.openTourModal = function(id) {
  const t = toursCache.find(x => x.id === id);
  if (!t) return;
  document.getElementById('tmoImg').src = t.image || '';
  document.getElementById('tmBody').innerHTML = `
    <h2>${t.title}</h2>
    <div class="tour-meta" style="margin:10px 0">
      <span><i class="fas fa-clock" style="color:var(--gold)"></i>${t.duration}</span>
      <span><i class="fas fa-users" style="color:var(--gold)"></i>${t.groupSize}</span>
      <span style="text-transform:capitalize"><i class="fas fa-tag" style="color:var(--gold)"></i>${t.cat}</span>
    </div>
    <p style="font-size:14px;color:var(--text2);line-height:1.85;margin-bottom:14px">${t.desc||''}</p>
    ${t.itinerary?.length ? `<div style="margin:14px 0"><h4 style="font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--charcoal);margin-bottom:10px">Day-by-Day Itinerary</h4>${t.itinerary.map((d,i) => `<div class="itin-row"><div class="itin-n">${i+1}</div><p>${d}</p></div>`).join('')}</div>` : ''}
    <div class="tm-inc">${(t.includes||[]).map(x => `<span><i class="fas fa-check" style="color:var(--gold);margin-right:4px;font-size:9px"></i>${x}</span>`).join('')}</div>
    <div class="tm-btns">
      <a href="https://wa.me/${WA}?text=Hi!%20I%20want%20to%20book%20${encodeURIComponent(t.title)}" target="_blank" class="btn btn-wa"><i class="fab fa-whatsapp"></i> Inquire on WhatsApp</a>
      <a href="tel:${CALL}" class="btn btn-royal"><i class="fas fa-phone-alt"></i> Call Now</a>
    </div>`;
  document.getElementById('tmo').classList.add('open');
  document.body.style.overflow = 'hidden';
};

function closeTourModal() {
  document.getElementById('tmo')?.classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('tmClose')?.addEventListener('click', closeTourModal);
document.getElementById('tmo')?.addEventListener('click', e => { if (e.target === document.getElementById('tmo')) closeTourModal(); });

// ── CARS ──────────────────────────────────────────────────────
const DEF_CARS = [
  { id:'c1', name:'Toyota Innova Crysta', sub:'Premium MPV', featured: true,
    image:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=85',
    specs:['7 Passengers','4 Large Bags','AC + Heater','GPS Tracked','Local Driver'],
    desc:'Our most popular vehicle for Kashmir tours — comfortable, spacious and reliable for mountain roads.' },
  { id:'c2', name:'Maruti Suzuki Ertiga', sub:'Family MPV',
    image:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=85',
    specs:['6 Passengers','3 Bags','AC','Smooth Ride','Experienced Driver'],
    desc:'Perfect for small families and couples. Fuel-efficient and comfortable for sightseeing tours.' },
  { id:'c3', name:'Force Tempo Traveller', sub:'Group Vehicle',
    image:'https://images.unsplash.com/photo-1464219551459-ac14ae01fbe0?w=600&q=85',
    specs:['12–17 Passengers','Group Luggage','AC','4WD Option','Professional Driver'],
    desc:'Ideal for large groups, corporate tours and school trips across Kashmir and Gurez Valley.' },
  { id:'c4', name:'Tata Safari / Scorpio', sub:'SUV · 4WD',
    image:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=85',
    specs:['6 Passengers','4WD','AC + Heater','Off-road Capable','Expert Driver'],
    desc:'For rugged Gurez mountain roads and adventure trips — powerful 4WD capability with comfort.' },
  { id:'c5', name:'Suzuki Dzire / Swift', sub:'Economy Sedan',
    image:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=85',
    specs:['4 Passengers','2 Bags','AC','Fuel Efficient','City & Highway'],
    desc:'Budget-friendly option for couples and small groups for city sightseeing in Srinagar.' },
  { id:'c6', name:'Minibus (20 Seater)', sub:'Large Group',
    image:'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=85',
    specs:['20 Passengers','Full Luggage','AC','Professional Driver','Group Tours'],
    desc:'Our 20-seater minibus for large group tours, school trips and corporate travel across Kashmir.' },
];

async function loadCars() {
  const grid = document.getElementById('carsGrid');
  if (!grid) return;

  let cars = DEF_CARS;
  try {
    if (db) {
      const s = await getDocs(query(collection(db, 'triporbit_cars'), orderBy('order', 'asc')));
      if (!s.empty) { cars = []; s.forEach(d => cars.push({ id: d.id, ...d.data() })); }
    }
  } catch(e) {}

  grid.innerHTML = cars.map(c => `
    <div class="car-card rv">
      <div class="car-img">
        <img src="${c.image||''}" alt="${c.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600'"/>
        ${c.featured ? `<div style="position:absolute;top:12px;left:12px"><span class="car-feat"><i class="fas fa-star"></i> Most Popular</span></div>` : ''}
      </div>
      <div class="car-body">
        <span class="car-sub">${c.sub||''}</span>
        <h3>${c.name||''}</h3>
        <div class="car-specs">${(c.specs||[]).map(s => `<span class="car-spec"><i class="fas fa-check"></i>${s}</span>`).join('')}</div>
        <p style="font-size:13px;color:var(--text2);line-height:1.75;margin-bottom:14px">${c.desc||''}</p>
        <a href="https://wa.me/${WA}?text=Hi!%20I%20need%20${encodeURIComponent(c.name)}%20for%20Kashmir%20trip." target="_blank" class="btn btn-wa" style="width:100%;justify-content:center"><i class="fab fa-whatsapp"></i> Inquire on WhatsApp</a>
      </div>
    </div>`).join('');
  grid.querySelectorAll('.rv').forEach(el => ro.observe(el));
}

// ── CONTACT FORM ──────────────────────────────────────────────
document.getElementById('contactForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const name  = document.getElementById('cfName')?.value.trim();
  const phone = document.getElementById('cfPhone')?.value.trim();
  if (!name || !phone) { toast('Please enter your name and phone number.', 'err'); return; }

  const btn = document.getElementById('cfSubmit');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…'; }

  const data = Object.fromEntries(new FormData(e.target));
  try {
    if (db) await addDoc(collection(db, 'triporbit_enquiries'), {
      ...data, source: 'contact_page', createdAt: serverTimestamp(), status: 'new'
    });
  } catch(err) {}

  e.target.style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
});

// ── HERO SLIDER ───────────────────────────────────────────────
(function initSlider() {
  const slides = document.querySelectorAll('.h-slide');
  const dots   = document.getElementById('heroDots');
  if (!slides.length || !dots) return;

  let cur = 0, timer;
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'h-dot' + (i === 0 ? ' on' : '');
    d.setAttribute('aria-label', `Slide ${i+1}`);
    d.addEventListener('click', () => { goSlide(i); clearInterval(timer); startTimer(); });
    dots.appendChild(d);
  });

  function goSlide(i) {
    slides[cur].classList.remove('on');
    dots.querySelectorAll('.h-dot')[cur].classList.remove('on');
    cur = i;
    slides[cur].classList.add('on');
    dots.querySelectorAll('.h-dot')[cur].classList.add('on');
  }
  function startTimer() { timer = setInterval(() => goSlide((cur + 1) % slides.length), 5500); }
  startTimer();
})();

// ── INIT ──────────────────────────────────────────────────────
loadGallery();
loadTours();
loadCars();
