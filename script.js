/* ================================================================
   TRIPORBIT — script.js  (Firebase Connected — v2)
   All public pages pull live data from Firestore.
   Admin panel writes → pages reflect changes instantly on reload.
   ================================================================ */
(function () {
  'use strict';

  var WA_NUM  = '917889693186';
  var TEL     = 'tel:+917889693186';

  var FB_CFG = {
    apiKey:            "AIzaSyDtfrU0CjLtZJ_MAMinagfynegNL9eQYWQ",
    authDomain:        "trip-orbit.firebaseapp.com",
    projectId:         "trip-orbit",
    storageBucket:     "trip-orbit.firebasestorage.app",
    messagingSenderId: "892020500031",
    appId:             "1:892020500031:web:a1bb7595868c84c30999d0"
  };

  var COLS = {
    tours: 'triporbit_tours', cars: 'triporbit_cars',
    gallery: 'triporbit_gallery', enquiries: 'triporbit_enquiries'
  };

  /* ── DEFAULTS ─────────────────────────────────────────────── */
  var DEF_TOURS = [
    { id:'t1', title:'Gurez Valley Expedition', cat:'gurez', duration:'4N/5D', groupSize:'Any',
      badge:'badge-gold', badgeText:'Popular', order:1,
      image:'https://images.unsplash.com/photo-1626714638456-5f14c9427ad4?w=600&q=85',
      desc:'Explore the breathtaking Gurez Valley — pristine destinations, Dard culture, Kishanganga River and majestic Himalayan peaks.',
      includes:['Hotel/Homestay','Daily Meals','AC Vehicle','Expert Guide','All Sightseeing'],
      itinerary:['Arrival Srinagar, drive to Gurez','Habba Khatoon Peak, Dawar town','Tulail Valley, Kishanganga River trek','Razdan Pass, local village visit','Return Srinagar, departure'] },
    { id:'t2', title:'Classic Kashmir Tour', cat:'kashmir', duration:'5N/6D', groupSize:'Families',
      badge:'badge-royal', badgeText:'Best Seller', order:2,
      image:'https://images.unsplash.com/photo-1591649462430-c88aeea56a4f?w=600&q=85',
      desc:'Classic Kashmir covering Srinagar, Gulmarg, Pahalgam and Sonamarg.',
      includes:['Hotel Stay','Breakfast & Dinner','Cab Services','Tour Guide','Shikara Ride'],
      itinerary:['Arrival Srinagar, Dal Lake shikara','Mughal Gardens, Shankaracharya Temple','Gulmarg Gondola & snow','Pahalgam, Betaab Valley','Sonamarg, Thajiwas Glacier','Shopping & departure'] },
    { id:'t3', title:'Honeymoon Kashmir Special', cat:'honeymoon', duration:'6N/7D', groupSize:'Couples',
      badge:'badge-gold', badgeText:'Romantic', order:3,
      image:'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&q=85',
      desc:'Dreamy honeymoon — luxury houseboat, private shikara rides and candlelit dinners.',
      includes:['Luxury Houseboat','All Meals','Couple Activities','Private Vehicle','Rose Decoration'],
      itinerary:['Arrival, houseboat check-in, sunset shikara','Dal Lake, Mughal Gardens','Gulmarg gondola, romantic dinner','Pahalgam, Betaab Valley','Sonamarg glacier','Shopping & departure'] },
    { id:'t4', title:'Adventure Gurez Trek', cat:'adventure', duration:'3N/4D', groupSize:'4-12',
      badge:'badge-green', badgeText:'Adventure', order:4,
      image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=85',
      desc:'Adrenaline-filled adventure — trekking, camping, river crossings in the Gurez Himalayas.',
      includes:['Camping Equipment','All Meals','Trek Guide','Transport','Safety Gear'],
      itinerary:['Drive Srinagar to Gurez, base camp','Razdan Pass trek, panoramic views','Kishanganga River trek & camping','Return Srinagar, departure'] },
    { id:'t5', title:'Family Kashmir Package', cat:'family', duration:'7N/8D', groupSize:'Families',
      badge:'badge-royal', badgeText:'Family', order:5,
      image:'https://images.unsplash.com/photo-1623996732821-66f739df7280?w=600&q=85',
      desc:'Kid-friendly family holiday covering all Kashmir highlights.',
      includes:['Hotel Stay','Breakfast & Dinner','Family Vehicle','Expert Guide','All Entry Fees'],
      itinerary:['Arrival Srinagar, houseboat & shikara','Mughal Gardens, Pari Mahal','Gulmarg gondola & snow play','Pahalgam valleys','Sonamarg glacier','Shopping & departure'] },
    { id:'t6', title:'Group Kashmir Tour', cat:'group', duration:'5N/6D', groupSize:'10-30',
      badge:'badge-green', badgeText:'Group', order:6,
      image:'https://images.unsplash.com/photo-1593417376544-4c4201061e22?w=600&q=85',
      desc:'Managed group tours for large families, corporate retreats and school trips.',
      includes:['Hotel Stay','All Meals','Group Transport','Guide','Sightseeing'],
      itinerary:['Group arrival, check-in','Dal Lake, Mughal Gardens','Gulmarg full day','Pahalgam, Betaab Valley','Sonamarg & farewell dinner','Group departure'] }
  ];

  var DEF_CARS = [
    { id:'c1', name:'Toyota Innova Crysta', sub:'Premium MPV', featured:true, order:1,
      image:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=85',
      specs:['7 Passengers','4 Large Bags','AC + Heater','GPS Tracked','Local Driver'],
      desc:'Most popular vehicle for Kashmir tours — comfortable, spacious, reliable for mountain roads.' },
    { id:'c2', name:'Maruti Suzuki Ertiga', sub:'Family MPV', featured:false, order:2,
      image:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=85',
      specs:['6 Passengers','3 Bags','AC','Smooth Ride','Experienced Driver'],
      desc:'Perfect for small families and couples. Fuel-efficient and comfortable.' },
    { id:'c3', name:'Force Tempo Traveller', sub:'Group Vehicle', featured:false, order:3,
      image:'https://images.unsplash.com/photo-1464219551459-ac14ae01fbe0?w=600&q=85',
      specs:['12-17 Passengers','Group Luggage','AC','4WD Option','Professional Driver'],
      desc:'Ideal for large groups, corporate tours and school trips.' },
    { id:'c4', name:'Tata Safari / Scorpio', sub:'SUV 4WD', featured:false, order:4,
      image:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=85',
      specs:['6 Passengers','4WD','AC + Heater','Off-road Capable','Expert Driver'],
      desc:'For rugged Gurez mountain roads and adventure trips.' },
    { id:'c5', name:'Suzuki Dzire / Swift', sub:'Economy Sedan', featured:false, order:5,
      image:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=85',
      specs:['4 Passengers','2 Bags','AC','Fuel Efficient','City & Highway'],
      desc:'Budget-friendly for couples and city sightseeing.' },
    { id:'c6', name:'Minibus (20 Seater)', sub:'Large Group', featured:false, order:6,
      image:'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=85',
      specs:['20 Passengers','Full Luggage','AC','Professional Driver','Group Tours'],
      desc:'20-seater for large group tours and corporate travel.' }
  ];

  var DEF_GAL = [
    { id:'g1', url:'https://images.unsplash.com/photo-1626714638456-5f14c9427ad4?w=800&q=85', caption:'Gurez Valley', cat:'gurez', order:1 },
    { id:'g2', url:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85', caption:'Kashmir Mountains', cat:'kashmir', order:2 },
    { id:'g3', url:'https://images.unsplash.com/photo-1591649462430-c88aeea56a4f?w=800&q=85', caption:'Dal Lake Srinagar', cat:'kashmir', order:3 },
    { id:'g4', url:'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=85', caption:'Scenic Kashmir', cat:'kashmir', order:4 },
    { id:'g5', url:'https://images.unsplash.com/photo-1584732200355-486a95263014?w=800&q=85', caption:'Snow Peaks Gurez', cat:'gurez', order:5 },
    { id:'g6', url:'https://images.unsplash.com/photo-1692287731328-58f55e8950cd?w=800&q=85', caption:'Mountain Meadow', cat:'gurez', order:6 },
    { id:'g7', url:'https://images.unsplash.com/photo-1623996732821-66f739df7280?w=800&q=85', caption:'Green Valley Kashmir', cat:'kashmir', order:7 },
    { id:'g8', url:'https://images.unsplash.com/photo-1593417376544-4c4201061e22?w=800&q=85', caption:'River View Gurez', cat:'gurez', order:8 },
    { id:'g9', url:'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&q=85', caption:'Adventure Travel', cat:'adventure', order:9 }
  ];

  /* ── STATE ─────────────────────────────────────────────────── */
  var toursData = DEF_TOURS.slice();
  var carsData  = DEF_CARS.slice();
  var galData   = DEF_GAL.slice();
  var lbIdx     = 0;
  var lbList    = galData;

  /* ── FIREBASE LAZY LOADER ──────────────────────────────────── */
  var db = null, _fns = null, _cbs = [], _loading = false;

  function onFB(cb) {
    if (db && _fns) { try { cb(db, _fns); } catch(e) {} return; }
    _cbs.push(cb);
    if (_loading) return;
    _loading = true;
    var s = document.createElement('script');
    s.type = 'module';
    s.textContent = [
      'import{initializeApp}from"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";',
      'import{getFirestore,collection,addDoc,getDocs,query,orderBy,serverTimestamp}',
      'from"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";',
      'try{',
      'const a=initializeApp(' + JSON.stringify(FB_CFG) + ');',
      'window._TO_DB=getFirestore(a);',
      'window._TO_FNS={collection,addDoc,getDocs,query,orderBy,serverTimestamp};',
      'window.dispatchEvent(new CustomEvent("to_fb_ready"));',
      '}catch(e){console.warn("Firebase init:",e);}'
    ].join('');
    document.head.appendChild(s);
    window.addEventListener('to_fb_ready', function() {
      db = window._TO_DB; _fns = window._TO_FNS;
      _cbs.forEach(function(fn) { try { fn(db, _fns); } catch(e) {} });
      _cbs = [];
    }, { once: true });
  }

  /* ── UTILITIES ─────────────────────────────────────────────── */
  function fbImg(url, fallback) {
    return url || fallback || 'https://images.unsplash.com/photo-1626714638456-5f14c9427ad4?w=600&q=85';
  }

  /* ── LOADER ────────────────────────────────────────────────── */
  window.addEventListener('load', function() {
    setTimeout(function() {
      var l = document.getElementById('pageLoader');
      if (l) l.classList.add('out');
    }, 900);
  });

  /* ── TOAST ─────────────────────────────────────────────────── */
  function toast(msg, type) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast' + (type ? ' ' + type : '');
    t.classList.add('show');
    setTimeout(function() { t.classList.remove('show'); }, 3000);
  }

  /* ── NAVBAR ────────────────────────────────────────────────── */
  var nav  = document.getElementById('nav');
  var hbg  = document.getElementById('navHbg');
  var nl   = document.getElementById('navLinks');
  var sct  = document.getElementById('sct');
  var sbb  = document.getElementById('sbb');

  window.addEventListener('scroll', function() {
    var sy = window.scrollY;
    if (nav) nav.classList.toggle('sc', sy > 80);
    if (sct) sct.classList.toggle('show', sy > 500);
    if (sbb) sbb.classList.toggle('show', sy > 700);
  }, { passive: true });

  if (hbg && nl) {
    hbg.addEventListener('click', function(e) {
      e.stopPropagation();
      var o = hbg.classList.toggle('open');
      nl.classList.toggle('open', o);
      document.body.style.overflow = o ? 'hidden' : '';
    });
    nl.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        hbg.classList.remove('open'); nl.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('click', function(e) {
      if (nl.classList.contains('open') && !nl.contains(e.target) && !hbg.contains(e.target)) {
        hbg.classList.remove('open'); nl.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (hbg) hbg.classList.remove('open');
      if (nl)  nl.classList.remove('open');
      document.body.style.overflow = '';
      closeTM();
    }
  });
  if (sct) sct.addEventListener('click', function() { window.scrollTo({ top:0, behavior:'smooth' }); });

  /* ── REVEAL ────────────────────────────────────────────────── */
  var rv = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      var siblings = e.target.parentElement
        ? Array.from(e.target.parentElement.querySelectorAll('.rv,.rvl,.rvr')) : [];
      var d = siblings.indexOf(e.target) * 80;
      setTimeout(function() { e.target.classList.add('in'); }, d);
      rv.unobserve(e.target);
    });
  }, { threshold: 0.07 });
  function obs(root) { (root || document).querySelectorAll('.rv,.rvl,.rvr').forEach(function(el) { rv.observe(el); }); }
  obs();

  /* ── COUNTERS ──────────────────────────────────────────────── */
  var co = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.count').forEach(function(el) {
        var end = parseInt(el.getAttribute('data-to') || '0'), n = 0, step = Math.ceil(end / 40);
        var t = setInterval(function() {
          n = Math.min(n + step, end);
          el.textContent = n + (end >= 100 ? '+' : '');
          if (n >= end) clearInterval(t);
        }, 40);
      });
      co.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.trust-grid').forEach(function(el) { co.observe(el); });

  /* ── HERO SLIDER ───────────────────────────────────────────── */
  (function() {
    var slides = document.querySelectorAll('.h-slide');
    var dots   = document.getElementById('heroDots');
    if (!slides.length || !dots) return;
    var cur = 0, timer;
    slides.forEach(function(_, i) {
      var d = document.createElement('button');
      d.className = 'h-dot' + (i === 0 ? ' on' : '');
      d.addEventListener('click', function() { go(i); clearInterval(timer); start(); });
      dots.appendChild(d);
    });
    function go(i) {
      slides[cur].style.opacity = '0';
      dots.querySelectorAll('.h-dot')[cur].classList.remove('on');
      cur = i;
      slides[cur].style.opacity = '1';
      dots.querySelectorAll('.h-dot')[cur].classList.add('on');
    }
    function start() { timer = setInterval(function() { go((cur + 1) % slides.length); }, 5500); }
    start();
  })();

  /* ══════════════════════════════════════════════════
     TOURS
  ══════════════════════════════════════════════════ */
  function renderTours(filter) {
    var grid = document.getElementById('toursGrid');
    if (!grid) return;
    var list = (!filter || filter === 'all')
      ? toursData
      : toursData.filter(function(t) { return t.cat === filter; });

    if (!list.length) {
      grid.innerHTML = '<p style="text-align:center;color:var(--text2);padding:40px;grid-column:span 3">No packages in this category yet.</p>';
      return;
    }
    grid.innerHTML = list.map(function(t) {
      var wa = 'https://wa.me/' + WA_NUM + '?text=Hi!%20I%20want%20to%20enquire%20about%20' + encodeURIComponent(t.title || '');
      return '<div class="tour-card rv">'
        + '<div class="tour-img"><img src="' + fbImg(t.image) + '" alt="' + (t.title || '') + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1626714638456-5f14c9427ad4?w=600\'">'
        + (t.badge ? '<span class="tour-badge ' + t.badge + '">' + (t.badgeText || '') + '</span>' : '')
        + '</div>'
        + '<div class="tour-body">'
        + '<div class="tour-cat">' + (t.cat || '') + '</div>'
        + '<h3>' + (t.title || '') + '</h3>'
        + '<div class="tour-meta"><span><i class="fas fa-clock"></i>' + (t.duration || '') + '</span>'
        + '<span><i class="fas fa-users"></i>' + (t.groupSize || '') + '</span></div>'
        + '<p class="tour-desc">' + (t.desc || t.description || '') + '</p>'
        + '<div class="tour-footer"><div class="tour-acts">'
        + '<a href="' + wa + '" target="_blank" class="btn btn-wa btn-sm"><i class="fab fa-whatsapp"></i> Inquire</a>'
        + '<button class="btn btn-royal btn-sm" data-tid="' + t.id + '"><i class="fas fa-info-circle"></i> Details</button>'
        + '</div></div></div></div>';
    }).join('');

    grid.querySelectorAll('[data-tid]').forEach(function(btn) {
      btn.addEventListener('click', function() { openTM(btn.getAttribute('data-tid')); });
    });
    obs(grid);
  }

  function loadTours() {
    renderTours('all');
    onFB(function(db, f) {
      f.getDocs(f.collection(db, COLS.tours))
        .then(function(snap) {
          if (!snap.empty) {
            toursData = [];
            snap.forEach(function(d) { toursData.push(Object.assign({ id: d.id }, d.data())); });
            toursData.sort(function(a,b){ return (parseInt(a.order)||99) - (parseInt(b.order)||99); });
            var a = document.querySelector('#tourFilters .gal-btn.on');
            renderTours(a ? a.getAttribute('data-f') : 'all');
          }
        }).catch(function(err) { console.warn('Tours load error:', err); });
    });
  }

  var tf = document.getElementById('tourFilters');
  if (tf) {
    tf.addEventListener('click', function(e) {
      var btn = e.target.closest('.gal-btn');
      if (!btn) return;
      tf.querySelectorAll('.gal-btn').forEach(function(b) { b.classList.remove('on'); });
      btn.classList.add('on');
      renderTours(btn.getAttribute('data-f'));
    });
  }

  /* Tour modal */
  function openTM(id) {
    var t = toursData.find(function(x) { return x.id === id; });
    var tmo = document.getElementById('tmo');
    var img = document.getElementById('tmoImg');
    var bdy = document.getElementById('tmBody');
    if (!t || !tmo) return;
    img.src = fbImg(t.image);
    img.onerror = function() { this.src = 'https://images.unsplash.com/photo-1626714638456-5f14c9427ad4?w=600'; };
    var inc = (t.includes || []).map(function(x) {
      return '<span><i class="fas fa-check" style="color:var(--gold);margin-right:4px;font-size:9px"></i>' + x + '</span>';
    }).join('');
    var itin = (t.itinerary || []).map(function(d, i) {
      return '<div class="itin-row"><div class="itin-n">' + (i+1) + '</div><p>' + d + '</p></div>';
    }).join('');
    var wa = 'https://wa.me/' + WA_NUM + '?text=Hi!%20I%20want%20to%20book%20' + encodeURIComponent(t.title || '');
    bdy.innerHTML = '<h2>' + (t.title || '') + '</h2>'
      + '<div class="tour-meta" style="margin:10px 0">'
      + '<span><i class="fas fa-clock" style="color:var(--gold)"></i>' + (t.duration || '') + '</span>'
      + '<span><i class="fas fa-users" style="color:var(--gold)"></i>' + (t.groupSize || '') + '</span>'
      + '<span style="text-transform:capitalize"><i class="fas fa-tag" style="color:var(--gold)"></i>' + (t.cat || '') + '</span>'
      + '</div>'
      + '<p style="font-size:14px;color:var(--text2);line-height:1.85;margin-bottom:14px">' + (t.desc || t.description || '') + '</p>'
      + (itin ? '<div style="margin:14px 0"><h4 style="font-family:\'Cormorant Garamond\',serif;font-size:16px;color:var(--charcoal);margin-bottom:10px">Day-by-Day Itinerary</h4>' + itin + '</div>' : '')
      + (inc ? '<div class="tm-inc">' + inc + '</div>' : '')
      + '<div class="tm-btns">'
      + '<a href="' + wa + '" target="_blank" class="btn btn-wa"><i class="fab fa-whatsapp"></i> Inquire on WhatsApp</a>'
      + '<a href="' + TEL + '" class="btn btn-royal"><i class="fas fa-phone-alt"></i> Call Now</a>'
      + '</div>';
    tmo.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeTM() {
    var tmo = document.getElementById('tmo');
    if (tmo) tmo.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.closeTourModal = closeTM;
  var tmClose = document.getElementById('tmClose');
  if (tmClose) tmClose.addEventListener('click', closeTM);
  var tmo = document.getElementById('tmo');
  if (tmo) tmo.addEventListener('click', function(e) { if (e.target === tmo) closeTM(); });

  /* ══════════════════════════════════════════════════
     CARS
  ══════════════════════════════════════════════════ */
  function renderCars(data) {
    var grid = document.getElementById('carsGrid');
    if (!grid) return;
    grid.innerHTML = data.map(function(c) {
      var wa = 'https://wa.me/' + WA_NUM + '?text=Hi!%20I%20need%20' + encodeURIComponent(c.name || '') + '%20for%20Kashmir.';
      var specs = (c.specs || []).map(function(s) {
        return '<span class="car-spec"><i class="fas fa-check"></i>' + s + '</span>';
      }).join('');
      return '<div class="car-card rv">'
        + '<div class="car-img">'
        + (c.featured ? '<div style="position:absolute;top:12px;left:12px;z-index:2"><span class="car-feat"><i class="fas fa-star"></i> Most Popular</span></div>' : '')
        + '<img src="' + fbImg(c.image, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600') + '" alt="' + (c.name || '') + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600\'">'
        + '</div>'
        + '<div class="car-body">'
        + '<span class="car-sub">' + (c.sub || '') + '</span>'
        + '<h3>' + (c.name || '') + '</h3>'
        + '<div class="car-specs">' + specs + '</div>'
        + '<p style="font-size:13px;color:var(--text2);line-height:1.75;margin-bottom:14px">' + (c.desc || c.description || '') + '</p>'
        + '<a href="' + wa + '" target="_blank" class="btn btn-wa" style="width:100%;justify-content:center"><i class="fab fa-whatsapp"></i> Inquire on WhatsApp</a>'
        + '</div></div>';
    }).join('');
    obs(grid);
  }

  function loadCars() {
    renderCars(carsData);
    onFB(function(db, f) {
      f.getDocs(f.collection(db, COLS.cars))
        .then(function(snap) {
          if (!snap.empty) {
            carsData = [];
            snap.forEach(function(d) { carsData.push(Object.assign({ id: d.id }, d.data())); });
            carsData.sort(function(a,b){ return (parseInt(a.order)||99) - (parseInt(b.order)||99); });
            renderCars(carsData);
          }
        }).catch(function(err) { console.warn('Cars load error:', err); });
    });
  }

  /* ══════════════════════════════════════════════════
     GALLERY
  ══════════════════════════════════════════════════ */
  function renderGal(cat) {
    var grid = document.getElementById('galGrid');
    if (!grid) return;
    var list = (!cat || cat === 'all')
      ? galData : galData.filter(function(g) { return g.cat === cat; });
    if (!list.length) list = galData;
    lbList = list;

    grid.innerHTML = list.map(function(g, i) {
      return '<div class="gal-item" data-gi="' + i + '">'
        + '<img src="' + (g.url || '') + '" alt="' + (g.caption || '') + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800\'">'
        + '<div class="gal-ov"><i class="fas fa-expand"></i><span class="gal-cap">' + (g.caption || '') + '</span></div>'
        + '</div>';
    }).join('');

    grid.querySelectorAll('.gal-item').forEach(function(item) {
      item.addEventListener('click', function() { openLb(parseInt(item.getAttribute('data-gi'))); });
    });
  }

  function loadGallery() {
    renderGal('all');
    onFB(function(db, f) {
      f.getDocs(f.collection(db, COLS.gallery))
        .then(function(snap) {
          if (!snap.empty) {
            galData = [];
            snap.forEach(function(d) { galData.push(Object.assign({ id: d.id }, d.data())); });
            galData.sort(function(a,b){ return (parseInt(a.order)||99) - (parseInt(b.order)||99); });
            var a = document.querySelector('#galFilters .gal-btn.on');
            renderGal(a ? a.getAttribute('data-cat') : 'all');
          }
        }).catch(function(err) { console.warn('Gallery load error:', err); });
    });
  }

  var gf = document.getElementById('galFilters');
  if (gf) {
    gf.addEventListener('click', function(e) {
      var btn = e.target.closest('.gal-btn');
      if (!btn) return;
      gf.querySelectorAll('.gal-btn').forEach(function(b) { b.classList.remove('on'); });
      btn.classList.add('on');
      renderGal(btn.getAttribute('data-cat'));
    });
  }

  /* Lightbox */
  function openLb(i) {
    lbIdx = i;
    var lb  = document.getElementById('lb');
    var img = document.getElementById('lbImg');
    var cap = document.getElementById('lbCap');
    if (!lb || !lbList[i]) return;
    img.src = lbList[i].url || '';
    img.onerror = function() { this.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'; };
    if (cap) cap.textContent = lbList[i].caption || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    var lb = document.getElementById('lb');
    if (lb) lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  var lbEl    = document.getElementById('lb');
  var lbClose = document.getElementById('lbClose');
  var lbPrev  = document.getElementById('lbPrev');
  var lbNext  = document.getElementById('lbNext');
  if (lbClose) lbClose.addEventListener('click', closeLb);
  if (lbPrev)  lbPrev.addEventListener('click', function() { openLb((lbIdx - 1 + lbList.length) % lbList.length); });
  if (lbNext)  lbNext.addEventListener('click', function() { openLb((lbIdx + 1) % lbList.length); });
  if (lbEl)    lbEl.addEventListener('click', function(e) { if (e.target === lbEl) closeLb(); });
  document.addEventListener('keydown', function(e) {
    var lb = document.getElementById('lb');
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  openLb((lbIdx - 1 + lbList.length) % lbList.length);
    if (e.key === 'ArrowRight') openLb((lbIdx + 1) % lbList.length);
    if (e.key === 'Escape')     closeLb();
  });

  /* ══════════════════════════════════════════════════
     CONTACT FORM
  ══════════════════════════════════════════════════ */
  var cForm = document.getElementById('contactForm');
  if (cForm) {
    cForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var name  = (document.getElementById('cfName')  || {}).value || '';
      var phone = (document.getElementById('cfPhone') || {}).value || '';
      if (!name.trim() || !phone.trim()) { toast('Please enter your name and phone number.', 'err'); return; }
      var btn = document.getElementById('cfSubmit');
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…'; }
      var data = { source: 'contact_page', status: 'new' };
      new FormData(cForm).forEach(function(v, k) { data[k] = v; });
      onFB(function(db, f) {
        data.createdAt = f.serverTimestamp();
        f.addDoc(f.collection(db, COLS.enquiries), data).catch(function() {});
      });
      setTimeout(function() {
        cForm.style.display = 'none';
        var ok = document.getElementById('formSuccess');
        if (ok) ok.style.display = 'block';
      }, 700);
    });
  }

  /* ══════════════════════════════════════════════════
     PAGE INIT
  ══════════════════════════════════════════════════ */
  var page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  if (page === 'index.html' || page === '') { loadTours(); loadGallery(); }
  if (page === 'tours.html')                { loadTours(); }
  if (page === 'cars.html')                 { loadCars(); }

  // Safety catch-all — if grids exist on page, load data
  if (document.getElementById('toursGrid') && page !== 'index.html' && page !== 'tours.html') loadTours();
  if (document.getElementById('carsGrid')  && page !== 'cars.html')  loadCars();
  if (document.getElementById('galGrid')   && page !== 'index.html') loadGallery();

})();
