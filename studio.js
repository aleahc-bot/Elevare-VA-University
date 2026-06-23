/* ============================================================
   Elevare — Design Studio  (live, on-device theme customizer)
   Self-injecting: just add <script src="studio.js" defer></script>
   ============================================================ */
(function () {
  'use strict';
  var STORE = 'elevareStudio.v1';

  /* ---------- helpers ---------- */
  function hx(c){ c=c.replace('#',''); return [parseInt(c.substr(0,2),16),parseInt(c.substr(2,2),16),parseInt(c.substr(4,2),16)]; }
  function mix(a,b,t){ var x=hx(a),y=hx(b),o='#'; for(var i=0;i<3;i++){var v=Math.round(x[i]+(y[i]-x[i])*t).toString(16);o+=('0'+v).slice(-2);} return o; }

  /* ---------- palettes ---------- */
  /* p=primary  d=deep  a=accent/light  bg=page  ink=text */
  var PALETTES = [
    {id:'elevare', name:'Elevare Green', desc:'Olive + lime · brand default', p:'#5C7C1B', d:'#3D5A12', a:'#9DC247', bg:'#F7F8F3', ink:'#1B1B1A'},
    {id:'forest',  name:'Forest & White', desc:'Deep forest green on white', p:'#2E4A0E', d:'#1B2B08', a:'#5C7C1B', bg:'#FFFFFF', ink:'#14160F'},
    {id:'lime',    name:'Lime & Black', desc:'Bright lime + near-black', p:'#5C7C1B', d:'#14160F', a:'#9DC247', bg:'#F6F8F1', ink:'#0E120B'},
    {id:'olive',   name:'Olive & Ivory', desc:'Soft olive · warm ivory', p:'#6B8A2E', d:'#4A6418', a:'#C2D49A', bg:'#FAFAF4', ink:'#1C2110'},
    {id:'emerald', name:'Emerald & Snow', desc:'Fresh emerald + white', p:'#2F7D4F', d:'#1C4A2F', a:'#6FBF8E', bg:'#F5FAF6', ink:'#14241A'},
    {id:'moss',    name:'Moss & Charcoal', desc:'Muted moss + charcoal', p:'#4F6B2A', d:'#2E3D18', a:'#8FA85C', bg:'#F6F7F1', ink:'#16190E'},
    {id:'onyx',    name:'Onyx & Green', desc:'Black-led · green accent', p:'#1B1F16', d:'#0B0C08', a:'#6F9B1E', bg:'#F7F8F3', ink:'#14160F'},
    {id:'mint',    name:'Mint & Ink', desc:'Pale mint + deep green-black', p:'#3D5A12', d:'#14160F', a:'#B7E25A', bg:'#F4F8EC', ink:'#11140B'}
  ];
  function palById(id){ for(var i=0;i<PALETTES.length;i++) if(PALETTES[i].id===id) return PALETTES[i]; return PALETTES[0]; }

  /* ---------- typography ---------- */
  var TYPES = [
    {id:'elevare', name:'Elevare Display', sub:'Garet · DM Sans', head:"'Garet','DM Sans',sans-serif", body:"'DM Sans',sans-serif", accent:"'DM Serif Display',serif", load:['DM Sans','DM Serif Display:ital@1']},
    {id:'grotesk', name:'Grotesk Modern', sub:'Hanken Grotesk · IBM Plex Mono', head:"'Hanken Grotesk',sans-serif", body:"'Hanken Grotesk',sans-serif", load:['Hanken Grotesk']},
    {id:'luxe',    name:'Luxe Sans', sub:'Poppins · Montserrat', head:"'Poppins',sans-serif", body:"'Montserrat',sans-serif", load:['Poppins','Montserrat']},
    {id:'editorial',name:'Editorial Serif', sub:'Fraunces · Inter', head:"'Fraunces',serif", body:"'Inter',sans-serif", accent:"'Fraunces',serif", load:['Fraunces:ital@0;1','Inter']},
    {id:'geometric',name:'Geometric Luxe', sub:'Space Grotesk · Space Mono', head:"'Space Grotesk',sans-serif", body:"'Space Grotesk',sans-serif", load:['Space Grotesk','Space Mono']},
    {id:'classic', name:'Classic Refined', sub:'Playfair Display · DM Sans', head:"'Playfair Display',serif", body:"'DM Sans',sans-serif", accent:"'Playfair Display',serif", load:['Playfair Display:ital@0;1','DM Sans']},
    {id:'clinical',name:'Clinical Inter', sub:'Inter · IBM Plex Mono', head:"'Inter',sans-serif", body:"'Inter',sans-serif", load:['Inter']},
    {id:'humanist',name:'Open Humanist', sub:'Open Sans · IBM Plex Mono', head:"'Open Sans',sans-serif", body:"'Open Sans',sans-serif", load:['Open Sans']},
    {id:'lato',    name:'Friendly Lato', sub:'Lato · IBM Plex Mono', head:"'Lato',sans-serif", body:"'Lato',sans-serif", load:['Lato']},
    {id:'roboto',  name:'Roboto', sub:'Roboto · Roboto Mono', head:"'Roboto',sans-serif", body:"'Roboto',sans-serif", load:['Roboto','Roboto Mono']},
    {id:'arial',   name:'Arial', sub:'Arial · system mono', head:"Arial,Helvetica,sans-serif", body:"Arial,Helvetica,sans-serif", accent:"Georgia,serif", load:[]},
    {id:'nunito',  name:'Friendly Nunito', sub:'Nunito · IBM Plex Mono', head:"'Nunito',sans-serif", body:"'Nunito',sans-serif", load:['Nunito']},
    {id:'manrope', name:'Modern Manrope', sub:'Manrope · IBM Plex Mono', head:"'Manrope',sans-serif", body:"'Manrope',sans-serif", load:['Manrope']}
  ];
  function typeById(id){ for(var i=0;i<TYPES.length;i++) if(TYPES[i].id===id) return TYPES[i]; return TYPES[0]; }

  var WEIGHTS = {light:400, medium:600, bold:700};
  var LETTERS = {tight:'-0.05em', normal:'-0.02em', wide:'0.03em'};
  var LINES   = {snug:'1.4', normal:'1.6', relaxed:'1.85'};

  var DEFAULT = {pal:'elevare', type:'elevare', weight:'bold', letter:'normal', line:'normal', italic:true, radius:'round', device:'live'};

  /* ---------- font loader (Google Fonts, on demand) ---------- */
  var loaded = {};
  function loadFonts(list){
    (list||[]).forEach(function(fam){
      if(loaded[fam]) return; loaded[fam]=true;
      var q = fam.indexOf(':')>-1 ? fam : (fam + ':wght@400;500;600;700;800');
      var l = document.createElement('link'); l.rel='stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=' + q.replace(/ /g,'+') + '&display=swap';
      document.head.appendChild(l);
    });
  }

  /* ---------- state ---------- */
  function load(){ try{ return Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(STORE)||'{}')); }catch(e){ return Object.assign({}, DEFAULT); } }
  function save(s){ try{ localStorage.setItem(STORE, JSON.stringify(s)); }catch(e){} }
  var state = load();

  /* ---------- apply theme to the page ---------- */
  function apply(){
    var r = document.documentElement, st = r.style;
    var pal = palById(state.pal), ty = typeById(state.type);
    state.pal = pal.id; state.type = ty.id;   // heal any removed/old selection
    // palette
    st.setProperty('--blue', pal.p);
    st.setProperty('--purple', pal.d);
    st.setProperty('--teal', pal.a);
    st.setProperty('--bg', pal.bg);
    st.setProperty('--ink', pal.ink);
    st.setProperty('--ink-2', mix(pal.ink, pal.bg, 0.28));
    st.setProperty('--ink-3', mix(pal.ink, pal.bg, 0.46));
    st.setProperty('--line', mix(pal.ink, pal.bg, 0.88));
    st.setProperty('--card', '#FFFFFF');
    document.body && (document.body.style.background = pal.bg);
    // typography
    loadFonts(ty.load);
    st.setProperty('--font-head', ty.head);
    st.setProperty('--font-body', ty.body);
    st.setProperty('--font-accent', ty.accent || ty.head);
    st.setProperty('--head-weight', WEIGHTS[state.weight]);
    st.setProperty('--head-letter', LETTERS[state.letter]);
    st.setProperty('--body-line', LINES[state.line]);
    // modes via data-attrs
    r.setAttribute('data-radius', state.radius);
    r.setAttribute('data-italic', state.italic ? 'on' : 'off');
    r.setAttribute('data-device', state.device);
    save(state);
    syncUI();
  }

  /* ---------- panel UI ---------- */
  var els = {};
  function set(key, val){ state[key]=val; apply(); }

  function svg(p){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'; }
  var IC = {
    pal: svg('<path d="M12 3a9 9 0 100 18c1 0 1.5-.8 1-1.6-.6-1 .1-2.4 1.4-2.4H18a3 3 0 003-3c0-5-4-8-9-8Z"/><circle cx="8" cy="11" r="1"/><circle cx="12" cy="8" r="1"/><circle cx="16" cy="11" r="1"/>'),
    type: svg('<path d="M5 6h14M9 6v13M15 6v13"/>'),
    weight: svg('<path d="M5 7h14M5 12h10M5 17h6"/>'),
    space: svg('<path d="M4 12h16M4 12l3-3M4 12l3 3M20 12l-3-3M20 12l-3 3"/>'),
    radius: svg('<path d="M4 10V7a3 3 0 013-3h3"/><rect x="4" y="4" width="16" height="16" rx="3" opacity="0"/>'),
    device: svg('<rect x="3" y="5" width="14" height="10" rx="1.5"/><path d="M2 19h13"/>'),
    italicI: svg('<path d="M10 5h6M8 19h6M14 5l-4 14"/>'),
    sharp: svg('<rect x="5" y="5" width="14" height="14"/>'),
    soft: svg('<rect x="5" y="5" width="14" height="14" rx="3"/>'),
    round: svg('<rect x="5" y="5" width="14" height="14" rx="7"/>'),
    live: svg('<circle cx="12" cy="12" r="3"/><path d="M5 12a7 7 0 0114 0"/>'),
    phone: svg('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>'),
    tablet: svg('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M11 18h2"/>'),
    desktop: svg('<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M9 20h6M12 16v4"/>'),
    kiosk: svg('<path d="M5 5h4M15 5h4M5 19h4M15 19h4M3 7v3M3 14v3M21 7v3M21 14v3"/>'),
    check: svg('<path d="M5 12l4.5 4.5L19 7"/>'),
    close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    wand: svg('<path d="M15 4V2M15 10V8M11 6H9M21 6h-2M17.8 8.8l1.4 1.4M4 20l9-9M17.8 3.2l1.4-1.4"/>')
  };

  function build(){
    // FAB
    var fab = document.createElement('button');
    fab.className = 'ds-fab'; fab.type='button';
    fab.innerHTML = IC.wand + '<span>Design Studio</span>';
    // overlay + panel
    var ov = document.createElement('div'); ov.className='ds-overlay';
    var panel = document.createElement('aside'); panel.className='ds-panel'; panel.setAttribute('aria-label','Design Studio');

    var palHTML = PALETTES.map(function(p){
      return '<button type="button" class="ds-pal-item" data-pal="'+p.id+'">'+
        '<span class="ds-swatch"><i style="background:'+p.d+'"></i><i style="background:'+p.p+'"></i><i style="background:'+p.a+'"></i><i style="background:'+p.bg+'"></i></span>'+
        '<span class="ds-pal-txt"><b>'+p.name+'</b><span>'+p.desc+'</span></span>'+
        '<span class="ds-check">'+IC.check+'</span></button>';
    }).join('');

    var typeHTML = TYPES.map(function(t){
      return '<button type="button" class="ds-type" data-type="'+t.id+'">'+
        '<div class="ds-aa" style="font-family:'+t.head+'">Aa</div>'+
        '<b>'+t.name+'</b><span>'+t.sub+'</span></button>';
    }).join('');

    panel.innerHTML =
      '<div class="ds-head">'+
        '<span class="ds-mark">'+IC.wand+'</span>'+
        '<div><h3>Design Studio</h3><span class="ds-sub">'+IC.live+' This device only</span></div>'+
        '<button class="ds-close" type="button" aria-label="Close">'+IC.close+'</button>'+
      '</div>'+
      '<div class="ds-body">'+
        '<div class="ds-sec-label">'+IC.pal+' Color palette</div>'+
        '<div class="ds-pal">'+palHTML+'</div>'+

        '<div class="ds-sec-label">'+IC.type+' Typography</div>'+
        '<div class="ds-type-grid">'+typeHTML+'</div>'+

        '<div class="ds-sec-label">'+IC.weight+' Weight &amp; emphasis</div>'+
        '<div class="ds-seg" data-group="weight">'+
          '<button data-v="light">Light</button><button data-v="medium">Medium</button><button data-v="bold">Bold</button></div>'+
        '<div class="ds-row"><span class="ds-row-lab">'+IC.italicI+' Italic headings accent</span>'+
          '<button class="ds-switch" data-toggle="italic" aria-label="Toggle italic accent"></button></div>'+

        '<div class="ds-sec-label">'+IC.space+' Spacing</div>'+
        '<div class="ds-mini-label">Letter spacing</div>'+
        '<div class="ds-seg" data-group="letter">'+
          '<button data-v="tight">Tight</button><button data-v="normal">Normal</button><button data-v="wide">Wide</button></div>'+
        '<div class="ds-mini-label">Line spacing</div>'+
        '<div class="ds-seg" data-group="line">'+
          '<button data-v="snug">Snug</button><button data-v="normal">Normal</button><button data-v="relaxed">Relaxed</button></div>'+

        '<div class="ds-sec-label">'+IC.radius+' Corner radius</div>'+
        '<div class="ds-seg" data-group="radius">'+
          '<button data-v="sharp">'+IC.sharp+'Sharp</button><button data-v="soft">'+IC.soft+'Soft</button><button data-v="round">'+IC.round+'Round</button></div>'+

        '<div class="ds-sec-label">'+IC.device+' Preview device</div>'+
        '<div class="ds-seg" data-group="device" style="grid-auto-flow:row;grid-template-columns:1fr 1fr 1fr;">'+
          '<button data-v="live">'+IC.live+'Live</button><button data-v="phone">'+IC.phone+'Phone</button><button data-v="tablet">'+IC.tablet+'Tablet</button>'+
          '<button data-v="desktop">'+IC.desktop+'Desktop</button><button data-v="kiosk">'+IC.kiosk+'Kiosk</button></div>'+

        '<button class="ds-reset" type="button">Reset to default</button>'+
      '</div>';

    document.body.appendChild(ov);
    document.body.appendChild(panel);
    document.body.appendChild(fab);
    els = {fab:fab, ov:ov, panel:panel};

    function open(o){ panel.classList.toggle('open', o); ov.classList.toggle('open', o); }
    fab.addEventListener('click', function(){ open(true); });
    ov.addEventListener('click', function(){ open(false); });
    panel.querySelector('.ds-close').addEventListener('click', function(){ open(false); });

    panel.querySelectorAll('.ds-pal-item').forEach(function(b){ b.addEventListener('click', function(){ set('pal', b.getAttribute('data-pal')); }); });
    panel.querySelectorAll('.ds-type').forEach(function(b){ b.addEventListener('click', function(){ set('type', b.getAttribute('data-type')); }); });
    panel.querySelectorAll('.ds-seg').forEach(function(g){
      var key = g.getAttribute('data-group');
      g.querySelectorAll('button').forEach(function(b){ b.addEventListener('click', function(){ set(key, b.getAttribute('data-v')); }); });
    });
    panel.querySelector('[data-toggle="italic"]').addEventListener('click', function(){ set('italic', !state.italic); });
    panel.querySelector('.ds-reset').addEventListener('click', function(){ state = Object.assign({}, DEFAULT); apply(); });
  }

  function syncUI(){
    if(!els.panel) return;
    var pp = els.panel;
    pp.querySelectorAll('.ds-pal-item').forEach(function(b){ b.classList.toggle('sel', b.getAttribute('data-pal')===state.pal); });
    pp.querySelectorAll('.ds-type').forEach(function(b){ b.classList.toggle('sel', b.getAttribute('data-type')===state.type); });
    pp.querySelectorAll('.ds-seg').forEach(function(g){
      var key=g.getAttribute('data-group');
      g.querySelectorAll('button').forEach(function(b){ b.classList.toggle('sel', b.getAttribute('data-v')===state[key]); });
    });
    pp.querySelector('[data-toggle="italic"]').classList.toggle('on', !!state.italic);
  }

  /* ---------- device-preview stage (wrap page content) ---------- */
  function makeStage(){
    var stage = document.createElement('div'); stage.id='ds-stage';
    var kids = Array.prototype.slice.call(document.body.childNodes);
    document.body.insertBefore(stage, document.body.firstChild);
    kids.forEach(function(n){ if(n!==stage) stage.appendChild(n); });
  }

  /* ---------- init ---------- */
  function init(){ makeStage(); build(); apply(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
