/* ================================================================
   TRIPORBIT — Main JavaScript (Fixed & Complete)
   All pages: index, tours, cars, about, contact, privacy
   ================================================================ */
(function() {

// ── CONSTANTS ─────────────────────────────────────────────────
var WA_NUM  = '917889693186';
var WA_BASE = 'https://wa.me/' + WA_NUM + '?text=Hi%20TripOrbit!%20I%20want%20to%20enquire%20about%20a%20Kashmir%20trip.';

// ── FIREBASE (loaded dynamically) ─────────────────────────────
var db = null;
var fbReady = false;

var FB_CFG = {
   apiKey: "AIzaSyDtfrU0CjLtZJ_MAMinagfynegNL9eQYWQ",
  authDomain: "trip-orbit.firebaseapp.com",
  projectId: "trip-orbit",
  storageBucket: "trip-orbit.firebasestorage.app",
  messagingSenderId: "892020500031",
  appId: "1:892020500031:web:dd67a5b7047405e87bfa8a"
};

// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg, type) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast' + (type ? ' ' + type : '');
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 3000);
}
window.showToast = showToast;

// ── LOADER ────────────────────────────────────────────────────
window.addEventListener('load', function() {
  setTimeout(function() {
    var ldr = document.getElementById('pageLoader');
    if (ldr) ldr.classList.add('out');
  }, 1000);
});

// ── NAVBAR ────────────────────────────────────────────────────
var nav   = document.getElementById('nav');
var hbg   = document.getElementById('navHbg');
var links = document.getElementById('navLinks');
var sct   = document.getElementById('sct');
var sbb   = document.getElementById('sbb');

window.addEventListener('scroll', function() {
  var sy = window.scrollY;
  if (nav) nav.classList.toggle('sc', sy > 80);
  if (sct) sct.classList.toggle('show', sy > 500);
  if (sbb) sbb.classList.toggle('show', sy > 700);
}, { passive: true });

if (hbg && links) {
  hbg.addEventListener('click', function(e) {
    e.stopPropagation();
    var open = hbg.classList.toggle('open');
    links.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  links.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      hbg.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  document.addEventListener('click', function(e) {
    if (links.classList.contains('open') && !links.contains(e.target) && !hbg.contains(e.target)) {
      hbg.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (hbg) hbg.classList.remove('open');
    if (links) links.classList.remove('open');
    document.body.style.overflow = '';
    closeTourModal();
  }
});
if (sct) sct.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });

// ── REVEAL ────────────────────────────────────────────────────
var revObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      var parent = e.target.parentElement;
      var siblings = parent ? Array.from(parent.querySelectorAll('.rv,.rvl,.rvr')) : [];
      var delay = siblings.indexOf(e.target) * 80;
      setTimeout(function() { e.target.classList.add('in'); }, delay);
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.07 });
document.querySelectorAll('.rv,.rvl,.rvr').forEach(function(el) { revObs.observe(el); });

// ── COUNTERS ──────────────────────────────────────────────────
var cntObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.count').forEach(function(el) {
        var end = parseInt(el.getAttribute('data-to') || '0');
        var n = 0;
        var step = Math.ceil(end / 40);
        var timer = setInterval(function() {
          n = Math.min(n + step, end);
          el.textContent = n + (end >= 100 ? '+' : '');
          if (n >= end) clearInterval(timer);
        }, 40);
      });
      cntObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.trust-grid').forEach(function(el) { cntObs.observe(el); });

// ── HERO SLIDER ───────────────────────────────────────────────
(function() {
  var slides = document.querySelectorAll('.h-slide');
  var dots   = document.getElementById('heroDots');
  if (!slides.length || !dots) return;
  var cur = 0, timer;
  slides.forEach(function(_, i) {
    var d = document.createElement('button');
    d.className = 'h-dot' + (i === 0 ? ' on' : '');
    d.setAttribute('aria-label', 'Slide ' + (i+1));
    d.addEventListener('click', function() { goSlide(i); clearInterval(timer); startT(); });
    dots.appendChild(d);
  });
  function goSlide(i) {
    slides[cur].style.opacity = '0';
    dots.querySelectorAll('.h-dot')[cur].classList.remove('on');
    cur = i;
    slides[cur].style.opacity = '1';
    dots.querySelectorAll('.h-dot')[cur].classList.add('on');
  }
  function startT() { timer = setInterval(function() { goSlide((cur + 1) % slides.length); }, 5500); }
  startT();
})();

// ── GALLERY ───────────────────────────────────────────────────
var galCache = [];
var lbIdx = 0;

var DEF_GAL = [
  { url:'https://images.unsplash.com/photo-1626714638456-5f14c9427ad4?w=800&q=85', caption:'Gurez Valley', cat:'gurez' },
  { url:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85', caption:'Kashmir Mountains', cat:'kashmir' },
  { url:'https://images.unsplash.com/photo-1591649462430-c88aeea56a4f?w=800&q=85', caption:'Dal Lake Srinagar', cat:'kashmir' },
  { url:'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=85', caption:'Scenic Kashmir', cat:'kashmir' },
  { url:'https://images.unsplash.com/photo-1584732200355-486a95263014?w=800&q=85', caption:'Snow Peaks', cat:'gurez' },
  { url:'https://images.unsplash.com/photo-1692287731328-58f55e8950cd?w=800&q=85', caption:'Mountain Meadow', cat:'gurez' },
  { url:'https://images.unsplash.com/photo-1623996732821-66f739df7280?w=800&q=85', caption:'Green Valley', cat:'kashmir' },
  { url:'https://images.unsplash.com/photo-1593417376544-4c4201061e22?w=800&q=85', caption:'River View', cat:'gurez' },
  { url:'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&q=85', caption:'Adventure Travel', cat:'adventure' }
];

function renderGallery(cat) {
  var grid = document.getElementById('galGrid');
  if (!grid) return;
  var list = (cat === 'all' || !cat) ? galCache : galCache.filter(function(g) { return g.cat === cat; });
  if (!list.length) list = galCache;
  grid.innerHTML = list.map(function(g, i) {
    return '<div class="gal-item" data-i="' + i + '">'
      + '<img src="' + g.url + '" alt="' + (g.caption || '') + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800\'">'
      + '<div class="gal-ov"><i class="fas fa-expand"></i><span class="gal-cap">' + (g.caption || '') + '</span></div>'
      + '</div>';
  }).join('');
  grid.querySelectorAll('.gal-item').forEach(function(item) {
    item.addEventListener('click', function() { openLb(parseInt(item.getAttribute('data-i'))); });
  });
  grid.querySelectorAll('.gal-item').forEach(function(el) { revObs.observe(el); });
}

function loadGallery() {
  galCache = DEF_GAL.slice();
  renderGallery('all');
  // Try Firebase
  tryFirebase(function(db, fns) {
    fns.getDocs(fns.query(fns.collection(db, 'triporbit_gallery'), fns.orderBy('order','asc'))).then(function(s) {
      if (!s.empty) {
        galCache = [];
        s.forEach(function(d) { galCache.push(Object.assign({ id: d.id }, d.data())); });
        renderGallery('all');
      }
    }).catch(function(){});
  });
}

var galFilters = document.getElementById('galFilters');
if (galFilters) {
  galFilters.addEventListener('click', function(e) {
    var btn = e.target.closest('.gal-btn');
    if (!btn) return;
    galFilters.querySelectorAll('.gal-btn').forEach(function(b) { b.classList.remove('on'); });
    btn.classList.add('on');
    renderGallery(btn.getAttribute('data-cat'));
  });
}

// Lightbox
function openLb(i) {
  lbIdx = i;
  var lb  = document.getElementById('lb');
  var img = document.getElementById('lbImg');
  var cap = document.getElementById('lbCap');
  if (!lb || !galCache[i]) return;
  img.src = galCache[i].url;
  if (cap) cap.textContent = galCache[i].caption || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLb() {
  var lb = document.getElementById('lb');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}
var lbClose = document.getElementById('lbClose');
if (lbClose) lbClose.addEventListener('click', closeLb);
var lb = document.getElementById('lb');
if (lb) lb.addEventListener('click', function(e) { if (e.target === lb) closeLb(); });
var lbPrev = document.getElementById('lbPrev');
var lbNext = document.getElementById('lbNext');
if (lbPrev) lbPrev.addEventListener('click', function() { openLb((lbIdx - 1 + galCache.length) % galCache.length); });
if (lbNext) lbNext.addEventListener('click', function() { openLb((lbIdx + 1) % galCache.length); });
document.addEventListener('keydown', function(e) {
  if (!document.getElementById('lb')?.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') openLb((lbIdx - 1 + galCache.length) % galCache.length);
  if (e.key === 'ArrowRight') openLb((lbIdx + 1) % galCache.length);
});

// ── TOURS ─────────────────────────────────────────────────────
var toursCache = [];

var DEF_TOURS = [
  { id:'t1', title:'Gurez Valley Expedition', cat:'gurez', duration:'4N/5D', groupSize:'Any',
    badge:'badge-gold', badgeText:'Popular',
    image:'https://images.unsplash.com/photo-1626714638456-5f14c9427ad4?w=600&q=85',
    desc:"Explore the breathtaking Gurez Valley — one of Kashmir's most pristine destinations. Experience Dard culture, Kishanganga River and majestic Himalayan peaks.",
    includes:['Hotel/Homestay','Daily Meals','AC Vehicle','Expert Guide','All Sightseeing'],
    itinerary:['Arrival Srinagar, drive to Gurez (4-5 hrs)','Habba Khatoon Peak, Dawar town','Tulail Valley, Kishanganga River trek','Razdan Pass, local village visit','Return Srinagar, departure'] },
  { id:'t2', title:'Classic Kashmir Tour', cat:'kashmir', duration:'5N/6D', groupSize:'Families',
    badge:'badge-royal', badgeText:'Best Seller',
    image:'https://images.unsplash.com/photo-1591649462430-c88aeea56a4f?w=600&q=85',
    desc:"Classic Kashmir itinerary covering Srinagar, Gulmarg, Pahalgam and Sonamarg — the four pillars of a perfect Kashmir holiday.",
    includes:['Hotel Stay','Breakfast & Dinner','Cab Services','Tour Guide','Shikara Ride'],
    itinerary:['Arrival Srinagar, Dal Lake shikara ride','Mughal Gardens, Shankaracharya Temple','Gulmarg Gondola & snow activities','Pahalgam, Betaab Valley, Aru Valley','Sonamarg, Thajiwas Glacier','Shopping & departure'] },
  { id:'t3', title:'Honeymoon Kashmir Special', cat:'honeymoon', duration:'6N/7D', groupSize:'Couples',
    badge:'badge-gold', badgeText:'Romantic',
    image:'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&q=85',
    desc:'A dreamy honeymoon in paradise — luxury houseboat stays, private shikara rides, candlelit dinners and exclusive couple experiences.',
    includes:['Luxury Houseboat','All Meals','Couple Activities','Private Vehicle','Rose Decoration'],
    itinerary:['Arrival, houseboat check-in, sunset shikara','Dal Lake morning, Mughal Gardens','Gulmarg gondola, romantic dinner','Pahalgam, Betaab Valley','Sonamarg glacier','Shopping & departure'] },
  { id:'t4', title:'Adventure Gurez Trek', cat:'adventure', duration:'3N/4D', groupSize:'4–12',
    badge:'badge-green', badgeText:'Adventure',
    image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=85',
    desc:'An adrenaline-filled adventure in the Gurez Himalayan wilderness — trekking, camping, river crossings and untouched mountain scenery.',
    includes:['Camping Equipment','All Meals','Trek Guide','Transport','Safety Gear'],
    itinerary:['Drive Srinagar to Gurez, base camp setup','Razdan Pass trek, panoramic views','Kishanganga River trek & camping','Return Srinagar & departure'] },
  { id:'t5', title:'Family Kashmir Package', cat:'family', duration:'7N/8D', groupSize:'Families',
    badge:'badge-royal', badgeText:'Family',
    image:'https://images.unsplash.com/photo-1623996732821-66f739df7280?w=600&q=85',
    desc:'A perfectly crafted family holiday covering all Kashmir highlights with kid-friendly activities and comfortable hotels.',
    includes:['Hotel Stay','Breakfast & Dinner','Family Vehicle','Expert Guide','All Entry Fees'],
    itinerary:['Arrival Srinagar, houseboat & shikara','Mughal Gardens, Pari Mahal','Gulmarg gondola & snow play','Pahalgam valleys, Lidder River','Sonamarg glacier','Shopping & departure'] },
  { id:'t6', title:'Group Kashmir Tour', cat:'group', duration:'5N/6D', groupSize:'10–30',
    badge:'badge-green', badgeText:'Group',
    image:'https://images.unsplash.com/photo-1593417376544-4c4201061e22?w=600&q=85',
    desc:'Expertly managed group tours for large families, corporate retreats and school trips — cost-effective without compromising comfort.',
    includes:['Hotel Stay','All Meals','Group Transport','Guide','Sightseeing'],
    itinerary:['Group arrival, check-in','Dal Lake shikara, Mughal Gardens','Gulmarg full day','Pahalgam, Betaab Valley','Sonamarg & farewell dinner','Group departure'] }
];

function renderTours(f) {
  var grid = document.getElementById('toursGrid');
  if (!grid) return;
  var list = (!f || f === 'all') ? toursCache : toursCache.filter(function(t) { return t.cat === f; });
  if (!list.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text2);padding:40px;grid-column:span 3">No tours in this category.</p>';
    return;
  }
  grid.innerHTML = list.map(function(t) {
    var waLink = 'https://wa.me/' + WA_NUM + '?text=Hi!%20I%20want%20to%20enquire%20about%20' + encodeURIComponent(t.title);
    return '<div class="tour-card rv">'
      + '<div class="tour-img">'
      + '<img src="' + (t.image||'') + '" alt="' + (t.title||'') + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600\'">'
      + (t.badge ? '<span class="tour-badge ' + t.badge + '">' + (t.badgeText||t.badge_text||'') + '</span>' : '')
      + '</div>'
      + '<div class="tour-body">'
      + '<div class="tour-cat">' + (t.cat||'') + '</div>'
      + '<h3>' + (t.title||'') + '</h3>'
      + '<div class="tour-meta"><span><i class="fas fa-clock"></i>' + (t.duration||'') + '</span><span><i class="fas fa-users"></i>' + (t.groupSize||t.group_size||'') + '</span></div>'
      + '<p class="tour-desc">' + (t.desc||t.description||'') + '</p>'
      + '<div class="tour-footer"><div class="tour-acts">'
      + '<a href="' + waLink + '" target="_blank" class="btn btn-wa btn-sm"><i class="fab fa-whatsapp"></i> Inquire</a>'
      + '<button class="btn btn-royal btn-sm" data-tour-id="' + t.id + '"><i class="fas fa-info-circle"></i> Details</button>'
      + '</div></div></div></div>';
  }).join('');

  // Attach detail modal triggers
  grid.querySelectorAll('[data-tour-id]').forEach(function(btn) {
    btn.addEventListener('click', function() { openTourModal(btn.getAttribute('data-tour-id')); });
  });
  grid.querySelectorAll('.rv').forEach(function(el) { revObs.observe(el); });
}

function loadTours() {
  toursCache = DEF_TOURS.slice();
  renderTours('all');
  tryFirebase(function(db, fns) {
    fns.getDocs(fns.query(fns.collection(db, 'triporbit_tours'), fns.orderBy('order','asc'))).then(function(s) {
      if (!s.empty) {
        toursCache = [];
        s.forEach(function(d) { toursCache.push(Object.assign({ id: d.id }, d.data())); });
        var activeBtn = document.querySelector('#tourFilters .gal-btn.on');
        renderTours(activeBtn ? activeBtn.getAttribute('data-f') : 'all');
      }
    }).catch(function(){});
  });
}

// Tour filter
var tourFilters = document.getElementById('tourFilters');
if (tourFilters) {
  tourFilters.addEventListener('click', function(e) {
    var btn = e.target.closest('.gal-btn');
    if (!btn) return;
    tourFilters.querySelectorAll('.gal-btn').forEach(function(b) { b.classList.remove('on'); });
    btn.classList.add('on');
    renderTours(btn.getAttribute('data-f'));
  });
}

// Tour modal
function openTourModal(id) {
  var t = toursCache.find(function(x) { return x.id === id; });
  if (!t) return;
  var tmo     = document.getElementById('tmo');
  var tmoImg  = document.getElementById('tmoImg');
  var tmBody  = document.getElementById('tmBody');
  if (!tmo) return;
  tmoImg.src = t.image || '';
  var includes = (t.includes || []).map(function(x) {
    return '<span><i class="fas fa-check" style="color:var(--gold);margin-right:4px;font-size:9px"></i>' + x + '</span>';
  }).join('');
  var itinerary = (t.itinerary || []).map(function(d, i) {
    return '<div class="itin-row"><div class="itin-n">' + (i+1) + '</div><p>' + d + '</p></div>';
  }).join('');
  var waLink = 'https://wa.me/' + WA_NUM + '?text=Hi!%20I%20want%20to%20book%20' + encodeURIComponent(t.title);
  tmBody.innerHTML = '<h2>' + (t.title||'') + '</h2>'
    + '<div class="tour-meta" style="margin:10px 0">'
    + '<span><i class="fas fa-clock" style="color:var(--gold)"></i>' + (t.duration||'') + '</span>'
    + '<span><i class="fas fa-users" style="color:var(--gold)"></i>' + (t.groupSize||t.group_size||'') + '</span>'
    + '</div>'
    + '<p style="font-size:14px;color:var(--text2);line-height:1.85;margin-bottom:14px">' + (t.desc||t.description||'') + '</p>'
    + (itinerary ? '<div style="margin:14px 0"><h4 style="font-family:\'Cormorant Garamond\',serif;font-size:16px;color:var(--charcoal);margin-bottom:10px">Day-by-Day Itinerary</h4>' + itinerary + '</div>' : '')
    + '<div class="tm-inc">' + includes + '</div>'
    + '<div class="tm-btns">'
    + '<a href="' + waLink + '" target="_blank" class="btn btn-wa"><i class="fab fa-whatsapp"></i> Inquire on WhatsApp</a>'
    + '<a href="tel:+917889693186" class="btn btn-royal"><i class="fas fa-phone-alt"></i> Call Now</a>'
    + '</div>';
  tmo.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeTourModal() {
  var tmo = document.getElementById('tmo');
  if (tmo) tmo.classList.remove('open');
  document.body.style.overflow = '';
}
window.closeTourModal = closeTourModal;
var tmClose = document.getElementById('tmClose');
if (tmClose) tmClose.addEventListener('click', closeTourModal);
var tmo = document.getElementById('tmo');
if (tmo) tmo.addEventListener('click', function(e) { if (e.target === tmo) closeTourModal(); });

// ── CARS ──────────────────────────────────────────────────────
var DEF_CARS = [
  { id:'c1', name:'Toyota Innova Crysta', sub:'Premium MPV', featured:true,
    image:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=85',
    specs:['7 Passengers','4 Large Bags','AC + Heater','GPS Tracked','Local Driver'],
    desc:'Our most popular vehicle for Kashmir tours — comfortable, spacious and reliable for mountain roads.' },
  { id:'c2', name:'Maruti Suzuki Ertiga', sub:'Family MPV', featured:false,
    image:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=85',
    specs:['6 Passengers','3 Bags','AC','Smooth Ride','Experienced Driver'],
    desc:'Perfect for small families and couples. Fuel-efficient and comfortable for sightseeing tours.' },
  { id:'c3', name:'Force Tempo Traveller', sub:'Group Vehicle', featured:false,
    image:'https://images.unsplash.com/photo-1464219551459-ac14ae01fbe0?w=600&q=85',
    specs:['12–17 Passengers','Group Luggage','AC','4WD Option','Professional Driver'],
    desc:'Ideal for large groups, corporate tours and school trips across Kashmir and Gurez Valley.' },
  { id:'c4', name:'Tata Safari / Scorpio', sub:'SUV · 4WD', featured:false,
    image:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=85',
    specs:['6 Passengers','4WD','AC + Heater','Off-road Capable','Expert Driver'],
    desc:'For rugged Gurez mountain roads and adventure trips — powerful 4WD with comfort.' },
  { id:'c5', name:'Suzuki Dzire / Swift', sub:'Economy Sedan', featured:false,
    image:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=85',
    specs:['4 Passengers','2 Bags','AC','Fuel Efficient','City & Highway'],
    desc:'Budget-friendly option for couples for city sightseeing in Srinagar.' },
  { id:'c6', name:'Minibus (20 Seater)', sub:'Large Group', featured:false,
    image:'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=85',
    specs:['20 Passengers','Full Luggage','AC','Professional Driver','Group Tours'],
    desc:'Our 20-seater for large group tours, school trips and corporate travel across Kashmir.' }
];

function loadCars() {
  var grid = document.getElementById('carsGrid');
  if (!grid) return;
  var cars = DEF_CARS.slice();
  function renderCars(list) {
    grid.innerHTML = list.map(function(c) {
      var waLink = 'https://wa.me/' + WA_NUM + '?text=Hi!%20I%20need%20' + encodeURIComponent(c.name) + '%20for%20Kashmir%20trip.';
      var specs = (c.specs||[]).map(function(s) {
        return '<span class="car-spec"><i class="fas fa-check"></i>' + s + '</span>';
      }).join('');
      return '<div class="car-card rv">'
        + '<div class="car-img">'
        + (c.featured ? '<div style="position:absolute;top:12px;left:12px;z-index:2"><span class="car-feat"><i class="fas fa-star"></i> Most Popular</span></div>' : '')
        + '<img src="' + (c.image||'') + '" alt="' + (c.name||'') + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600\'">'
        + '</div>'
        + '<div class="car-body">'
        + '<span class="car-sub">' + (c.sub||'') + '</span>'
        + '<h3>' + (c.name||'') + '</h3>'
        + '<div class="car-specs">' + specs + '</div>'
        + '<p style="font-size:13px;color:var(--text2);line-height:1.75;margin-bottom:14px">' + (c.desc||c.description||'') + '</p>'
        + '<a href="' + waLink + '" target="_blank" class="btn btn-wa" style="width:100%;justify-content:center"><i class="fab fa-whatsapp"></i> Inquire on WhatsApp</a>'
        + '</div></div>';
    }).join('');
    grid.querySelectorAll('.rv').forEach(function(el) { revObs.observe(el); });
  }
  renderCars(cars);
  tryFirebase(function(db, fns) {
    fns.getDocs(fns.query(fns.collection(db, 'triporbit_cars'), fns.orderBy('order','asc'))).then(function(s) {
      if (!s.empty) { cars = []; s.forEach(function(d) { cars.push(Object.assign({ id: d.id }, d.data())); }); renderCars(cars); }
    }).catch(function(){});
  });
}

// ── CONTACT FORM ──────────────────────────────────────────────
var contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var name  = (document.getElementById('cfName')  || {}).value || '';
    var phone = (document.getElementById('cfPhone') || {}).value || '';
    if (!name.trim() || !phone.trim()) {
      showToast('Please enter your name and phone number.', 'err'); return;
    }
    var btn = document.getElementById('cfSubmit');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…'; }
    var data = {};
    new FormData(contactForm).forEach(function(val, key) { data[key] = val; });
    tryFirebase(function(db, fns) {
      data.source = 'contact_page';
      data.status = 'new';
      data.createdAt = fns.serverTimestamp();
      fns.addDoc(fns.collection(db, 'triporbit_enquiries'), data).catch(function(){});
    });
    setTimeout(function() {
      contactForm.style.display = 'none';
      var ok = document.getElementById('formSuccess');
      if (ok) ok.style.display = 'block';
    }, 600);
  });
}

// ── FIREBASE LAZY LOADER ──────────────────────────────────────
var fbCallbacks = [];
var fbLoaded = false;

function tryFirebase(cb) {
  if (fbLoaded && db) { cb(db, window._fbFns); return; }
  fbCallbacks.push(cb);
  if (fbLoaded) return; // already loading
  fbLoaded = true;
  // Load Firebase dynamically
  var s = document.createElement('script');
  s.type = 'module';
  s.textContent = [
    'import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";',
    'import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp }',
    '  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";',
    'try {',
    '  var app = initializeApp(' + JSON.stringify(FB_CFG) + ');',
    '  var db  = getFirestore(app);',
    '  window._fbDB = db;',
    '  window._fbFns = { collection, addDoc, getDocs, query, orderBy, serverTimestamp };',
    '  window.dispatchEvent(new Event("fbReady"));',
    '} catch(e) { console.warn("Firebase init:", e); }',
  ].join('\n');
  document.head.appendChild(s);
  window.addEventListener('fbReady', function() {
    db = window._fbDB;
    fbCallbacks.forEach(function(fn) { try { fn(db, window._fbFns); } catch(e){} });
    fbCallbacks = [];
  }, { once: true });
}

// ── INIT PAGE ─────────────────────────────────────────────────
var path = window.location.pathname;
var page = path.split('/').pop() || 'index.html';

if (page === 'index.html' || page === '') {
  loadGallery();
  loadTours();
}
if (page === 'tours.html') {
  loadTours();
}
if (page === 'cars.html') {
  loadCars();
}
if (page === 'about.html' || page === 'contact.html' || page === 'privacy.html') {
  // Static pages — nothing extra needed
}

// Also run all if elements exist (handles any page with these grids)
if (document.getElementById('galGrid') && page !== 'index.html') loadGallery();
if (document.getElementById('toursGrid') && page !== 'index.html') loadTours();
if (document.getElementById('carsGrid') && page !== 'cars.html') loadCars();
