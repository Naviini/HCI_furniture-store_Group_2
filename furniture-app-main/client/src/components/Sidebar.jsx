import React, { useState, useMemo } from 'react';
import ndLogo from '../assets/LOGO/logo.jpeg';
import coffeeTableImg from '../assets/table/coffee_table_round_01_1k/coffee table.jpg';
import chairImg from '../assets/chair/plastic_monobloc_chair_01/Chair.jpg';

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────────────────── */
const C = {
  bg:         '#080912',
  bgPanel:    'rgba(255,255,255,0.03)',
  bgCard:     'rgba(255,255,255,0.045)',
  bgHover:    'rgba(255,255,255,0.07)',
  border:     'rgba(255,255,255,0.07)',
  borderSoft: 'rgba(255,255,255,0.04)',
  accent:     '#6366f1',
  accentDim:  'rgba(99,102,241,0.15)',
  accentGlow: '0 0 20px rgba(99,102,241,0.35)',
  violet:     '#8b5cf6',
  cyan:       '#22d3ee',
  gold:       '#fbbf24',
  greenLive:  '#22c55e',
  red:        '#ef4444',
  textMain:   '#f0f2f7',
  textSub:    '#a8b2cc',
  textMuted:  '#5a6380',
  textAccent: '#a5b4fc',
  mono:       "'SF Mono','Fira Code','Cascadia Code',monospace",
  tr:         'all 0.2s cubic-bezier(0.4,0,0.2,1)',
  trFast:     'all 0.14s cubic-bezier(0.4,0,0.2,1)',
};

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const TABS = {
  LIBRARY: 'library', PROPERTIES: 'properties',
  ROOM: 'room', PRICING: 'pricing', GLOBAL: 'global',
};

const FURNITURE_ITEMS = [
  { name: 'Coffee Table',   icon: '☕', thumbnail: coffeeTableImg, desc: 'LACK – Round coffee table',          model: true, category: 'Tables',   material: 'Wood',    color: 'Brown',  price: 49.99  },
  { name: 'Chair',          icon: '💺', thumbnail: chairImg,       desc: 'TEODORES – Monobloc chair',          model: true, category: 'Seating',  material: 'Plastic', color: 'White',  price: 29.99  },
  { name: 'Drawer',         icon: '🗄️',                            desc: 'HEMNES – Vintage wooden drawer',    model: true, category: 'Storage',  material: 'Wood',    color: 'Walnut', price: 149.99 },
  { name: 'TV Stand',       icon: '📺',                            desc: 'Modern TV entertainment center',    model: true, category: 'Living',   material: 'Wood',    color: 'Black',  price: 199.99 },
  { name: 'TV Stand 3',     icon: '🖥️',                            desc: 'Sleek TV stand with shelf',         model: true, category: 'Living',   material: 'Wood',    color: 'Walnut', price: 149.99 },
  { name: 'File Cabinet',   icon: '🗂️',                            desc: 'Office file cabinet – 3 drawers',  model: true, category: 'Storage',  material: 'Metal',   color: 'Grey',   price: 89.99  },
  { name: 'Computer Chair', icon: '🖥️',                            desc: 'Mesh back ergonomic office chair', model: true, category: 'Seating',  material: 'Fabric',  color: 'Black',  price: 129.99 },
  { name: 'Lounge Chair',   icon: '🛋️',                            desc: 'Luxury lounge chair',              model: true, category: 'Seating',  material: 'Leather', color: 'Brown',  price: 349.99 },
  { name: 'Dining Table',   icon: '🍽️',                            desc: 'Extendable dining table',          model: true, category: 'Dining',   material: 'Wood',    color: 'Oak',    price: 299.99 },
  { name: 'Dining Chair',   icon: '🪑',                            desc: 'Scandinavian dining chair',        model: true, category: 'Dining',   material: 'Wood',    color: 'Natural',price: 79.99  },
  { name: 'Sofa',           icon: '🛋️',                            desc: 'KIVIK – 3-seat sofa',              model: true, category: 'Living',   material: 'Fabric',  color: 'Navy',   price: 599.99 },
  { name: 'Bookshelf',      icon: '📚',                            desc: 'BILLY – Bookcase collection',      model: true, category: 'Storage',  material: 'Wood',    color: 'White',  price: 119.99 },
  { name: 'Bed',            icon: '🛏️',                            desc: 'MALM – Queen size bed frame',      model: true, category: 'Bedroom',  material: 'Wood',    color: 'White',  price: 399.99 },
  { name: 'Nightstand',     icon: '🕯️',                            desc: 'HEMNES – Nightstand 2 drawers',    model: true, category: 'Bedroom',  material: 'Wood',    color: 'Walnut', price: 89.99  },
  { name: 'Wardrobe',       icon: '🚪',                            desc: 'PAX – Wardrobe combination',       model: true, category: 'Bedroom',  material: 'Wood',    color: 'White',  price: 499.99 },
  { name: 'Lamp',           icon: '💡',                            desc: 'HEKTAR – Floor lamp',              model: true, category: 'Lighting', material: 'Metal',   color: 'Dark',   price: 69.99  },
  { name: 'Table Lamp',     icon: '🔦',                            desc: 'FADO – Table lamp',                model: true, category: 'Lighting', material: 'Glass',   color: 'White',  price: 39.99  },
  { name: 'Rug',            icon: '🟫',                            desc: 'ÅDUM – High pile rug',             model: true, category: 'Living',   material: 'Fabric',  color: 'Beige',  price: 149.99 },
];

const ITEM_PRICES = FURNITURE_ITEMS.reduce((acc, f) => ({ ...acc, [f.name]: f.price }), {
  Table: 89.99, Cabinet: 79.99,
});

const CATEGORIES = ['All', 'Tables', 'Seating', 'Storage', 'Living', 'Lighting', 'Dining', 'Bedroom'];
const MATERIALS  = ['All', 'Wood', 'Plastic', 'Metal', 'Fabric', 'Leather', 'Glass'];

const FLOOR_TYPES = [
  { id: 'plank_flooring', emoji: '🪵', label: 'Plank'    },
  { id: 'cartago',        emoji: '🧱', label: 'Cartago'  },
  { id: 'granite',        emoji: '🪨', label: 'Granite'  },
  { id: 'gravel',         emoji: '⬜', label: 'Gravel'   },
  { id: 'laminate',       emoji: '📋', label: 'Laminate' },
  { id: 'linoleum',       emoji: '🟩', label: 'Linoleum' },
  { id: 'pebble',         emoji: '🔵', label: 'Pebble'   },
  { id: 'rubber',         emoji: '⚫', label: 'Rubber'   },
];

const ROOM_SHAPES = [
  { id: 'rectangle', label: 'Rect',
    svg: <svg viewBox="0 0 30 22" fill="currentColor"><rect x="2" y="3" width="26" height="16" rx="1.5" opacity="0.25"/><rect x="2" y="3" width="26" height="16" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2"/></svg>},
  { id: 'square',    label: 'Square',
    svg: <svg viewBox="0 0 26 26" fill="currentColor"><rect x="2" y="2" width="22" height="22" rx="1.5" opacity="0.25"/><rect x="2" y="2" width="22" height="22" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2"/></svg>},
  { id: 'l-shape',   label: 'L-Shape',
    svg: <svg viewBox="0 0 28 28" fill="currentColor"><path d="M2 2h16v12H14v12H2Z" opacity="0.25"/><path d="M2 2h16v12H14v12H2Z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>},
  { id: 't-shape',   label: 'T-Shape',
    svg: <svg viewBox="0 0 30 28" fill="currentColor"><path d="M2 2h26v10H17v16H13V12H2Z" opacity="0.25"/><path d="M2 2h26v10H17v16H13V12H2Z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>},
  { id: 'u-shape',   label: 'U-Shape',
    svg: <svg viewBox="0 0 30 28" fill="currentColor"><path d="M2 2h8v18h10V2h8v24H2Z" opacity="0.25"/><path d="M2 2h8v18h10V2h8v24H2Z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>},
  { id: 'open',      label: 'Open',
    svg: <svg viewBox="0 0 30 28" fill="currentColor"><path d="M2 2h26v24H2V2zm6 6v12h14V8H8z" opacity="0.25"/><path d="M2 2h26v24H2V2zm6 6v12h14V8H8z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>},
];

const LIGHTING_MODES = [
  { id: 'Day',    icon: '☀️', label: 'Daylight',   gradient: 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 50%, #bfdbfe 100%)' },
  { id: 'Golden', icon: '🌇', label: 'Golden Hour', gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fcd34d 100%)' },
  { id: 'Night',  icon: '🌙', label: 'Night Mode',  gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' },
];

const WALL_PRESETS = ['#e8e4dc','#d4c5b0','#c8d4c0','#c8d0dc','#e0d4c8','#f0ece4'];
const FLOOR_PRESETS = ['#c8a882','#a07850','#e4dcd0','#8c6840','#d4c4a8','#60483c'];

/* ─────────────────────────────────────────────────────────────────────────────
   ICON COMPONENTS
───────────────────────────────────────────────────────────────────────────── */
const Ico = ({ d, size = 18, stroke = 'currentColor', fill = 'none', sw = 1.75, children, vb = '0 0 24 24' }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d ? <path d={d} /> : children}
  </svg>
);

const LibraryIcon  = ({ s }) => <Ico size={s} sw={1.75}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></Ico>;
const PropIcon     = ({ s }) => <Ico size={s} sw={1.75}><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></Ico>;
const RoomIcon     = ({ s }) => <Ico size={s} sw={1.75}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Ico>;
const CartIcon     = ({ s }) => <Ico size={s} sw={1.75}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></Ico>;
const SettingsIcon = ({ s }) => <Ico size={s} sw={1.75}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></Ico>;

const NAV = [
  { id: TABS.LIBRARY,    Icon: LibraryIcon,  label: 'Library'    },
  { id: TABS.PROPERTIES, Icon: PropIcon,     label: 'Properties' },
  { id: TABS.ROOM,       Icon: RoomIcon,     label: 'Room'       },
  { id: TABS.PRICING,    Icon: CartIcon,     label: 'Cart'       },
  { id: TABS.GLOBAL,     Icon: SettingsIcon, label: 'Settings'   },
];

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL KEYFRAME INJECTION
───────────────────────────────────────────────────────────────────────────── */
const KEYFRAMES = `
@keyframes sb-fade-in  { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
@keyframes sb-slide-in { from { opacity:0; transform:translateX(-6px) } to { opacity:1; transform:translateX(0) } }
@keyframes sb-pulse    { 0%,100% { opacity:1 } 50% { opacity:.45 } }
@keyframes sb-glow-ring{ 0%,100% { box-shadow:0 0 0 0 rgba(99,102,241,0) } 50% { box-shadow:0 0 0 4px rgba(99,102,241,0.25) } }
.sb-fade  { animation: sb-fade-in 0.22s ease-out both }
.sb-slide { animation: sb-slide-in 0.18s ease-out both }
input[type=range].sb-range { -webkit-appearance:none; height:4px; border-radius:99px; outline:none; cursor:pointer; background:rgba(255,255,255,0.08) }
input[type=range].sb-range::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:linear-gradient(135deg,#6366f1,#8b5cf6); border:2px solid rgba(255,255,255,0.8); box-shadow:0 0 8px rgba(99,102,241,0.5); cursor:pointer; transition:transform 0.15s }
input[type=range].sb-range::-webkit-slider-thumb:hover { transform:scale(1.2) }
input[type=range].sb-range:focus::-webkit-slider-thumb { box-shadow:0 0 0 3px rgba(99,102,241,0.35) }
::-webkit-scrollbar{width:3px;height:3px}.sb-scroll::-webkit-scrollbar-track{background:transparent}.sb-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:99px}
.sb-scroll::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.2)}
.sb-chip-row{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}.sb-chip-row::-webkit-scrollbar{display:none}
`;

if (typeof document !== 'undefined' && !document.getElementById('sb-kf')) {
  const el = document.createElement('style');
  el.id = 'sb-kf';
  el.textContent = KEYFRAMES;
  document.head.appendChild(el);
}

/* ─────────────────────────────────────────────────────────────────────────────
   SMALL HELPERS
───────────────────────────────────────────────────────────────────────────── */
const Label = ({ children, style }) => (
  <span style={{ display:'block', fontSize:'0.63rem', fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:6, ...style }}>
    {children}
  </span>
);

const SectionDivider = ({ title, badge }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', margin:'18px 0 10px', paddingBottom:8, borderBottom:`1px solid ${C.borderSoft}` }}>
    <span style={{ fontSize:'0.63rem', fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.8px' }}>{title}</span>
    {badge != null && <span style={{ fontSize:'0.6rem', fontWeight:700, background:C.accentDim, color:C.textAccent, padding:'2px 9px', borderRadius:99 }}>{badge}</span>}
  </div>
);

const Chip = ({ active, onClick, children }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flexShrink:0, padding:'4px 11px', borderRadius:99,
        border: active ? `1.5px solid rgba(99,102,241,0.75)` : `1.5px solid ${C.border}`,
        background: active
          ? 'linear-gradient(135deg,rgba(99,102,241,0.65),rgba(139,92,246,0.5))'
          : hov ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.025)',
        color: active ? '#fff' : hov ? C.textSub : C.textMuted,
        fontSize:'0.67rem', fontWeight: active ? 700 : 600,
        cursor:'pointer', fontFamily:'inherit',
        transition: C.trFast, whiteSpace:'nowrap',
        boxShadow: active ? '0 0 12px rgba(99,102,241,0.45)' : 'none',
        letterSpacing: active ? '0.01em' : '0',
      }}>
      {children}
    </button>
  );
};

const NumInput = ({ value, onChange, min, max, step = 1, prefix }) => (
  <div style={{ position:'relative' }}>
    {prefix && <span style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)', fontSize:'0.64rem', fontWeight:800, color:C.textMuted, pointerEvents:'none', zIndex:1 }}>{prefix}</span>}
    <input type="number" value={value} min={min} max={max} step={step}
      onChange={e => onChange(parseFloat(e.target.value))}
      style={{ width:'100%', padding:`7px ${prefix?'7px':'9px'} 7px ${prefix?'22px':'9px'}`, background:'rgba(255,255,255,0.04)', border:`1px solid ${C.border}`, borderRadius:8, color:C.textMain, fontSize:'0.78rem', fontFamily:'inherit', outline:'none', transition:C.tr, boxSizing:'border-box' }}
      onFocus={e => { e.target.style.borderColor='rgba(99,102,241,0.5)'; e.target.style.background='rgba(99,102,241,0.06)'; }}
      onBlur={e => { e.target.style.borderColor=C.border; e.target.style.background='rgba(255,255,255,0.04)'; }}
    />
  </div>
);

const SbSelect = ({ value, onChange, options }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{ width:'100%', padding:'8px 10px', background:'rgba(255,255,255,0.04)', border:`1px solid ${C.border}`, borderRadius:8, color:C.textSub, fontSize:'0.75rem', fontFamily:'inherit', outline:'none', cursor:'pointer', appearance:'none', WebkitAppearance:'none', transition:C.tr }}>
    {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
  </select>
);

const SliderRow = ({ value, min, max, step, onChange, displayFn, label, icon }) => (
  <div style={{ marginBottom:12 }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
      <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.68rem', fontWeight:600, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.4px' }}>
        {icon && <span style={{ opacity:.7 }}>{icon}</span>}{label}
      </span>
      <span style={{ fontSize:'0.72rem', fontWeight:700, color:C.textAccent, fontFamily:C.mono }}>{displayFn ? displayFn(value) : value}</span>
    </div>
    <input type="range" className="sb-range" value={value} min={min} max={max} step={step}
      onChange={e => onChange(parseFloat(e.target.value))}
      style={{ width:'100%', accentColor:C.accent }}
    />
  </div>
);

const ActionBtn = ({ onClick, icon, label, primary, danger }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:'flex', alignItems:'center', gap:10, width:'100%', padding:'11px 14px',
        borderRadius:10, cursor:'pointer', fontFamily:'inherit', fontSize:'0.82rem', fontWeight:600, textAlign:'left',
        transition: C.tr,
        background: primary ? (hov ? 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.22))' : 'linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.12))')
                  : danger  ? (hov ? 'rgba(239,68,68,0.14)' : 'rgba(239,68,68,0.07)')
                  :          (hov ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)'),
        border: primary ? `1px solid rgba(99,102,241,${hov?'0.45':'0.25'})`
              : danger  ? `1px solid rgba(239,68,68,${hov?'0.35':'0.18'})`
              :           `1px solid ${hov ? 'rgba(255,255,255,0.1)' : C.border}`,
        color: primary ? (hov ? '#c7d2fe' : '#a5b4fc')
             : danger  ? (hov ? '#fca5a5' : '#f87171')
             :           (hov ? C.textMain : C.textSub),
        transform: hov ? 'translateY(-1px)' : 'none',
        boxShadow: primary && hov ? '0 4px 16px rgba(99,102,241,0.25)' : 'none',
      }}>
      <span style={{ opacity:.85, display:'flex' }}>{icon}</span>
      {label}
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   LIBRARY PANEL
───────────────────────────────────────────────────────────────────────────── */
function LibraryPanel({ items, addItem }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [matFilter, setMatFilter] = useState('All');
  const [hovered, setHovered] = useState(null);

  const filtered = useMemo(() => {
    let r = FURNITURE_ITEMS;
    if (searchQuery) r = r.filter(f => (f.name + f.desc).toLowerCase().includes(searchQuery.toLowerCase()));
    if (catFilter !== 'All') r = r.filter(f => f.category === catFilter);
    if (matFilter !== 'All') r = r.filter(f => f.material === matFilter);
    return r;
  }, [searchQuery, catFilter, matFilter]);

  return (
    <div className="sb-fade" style={{ paddingBottom:8 }}>

      {/* Search */}
      <div style={{ position:'relative', marginBottom:12 }}>
        <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:C.textMuted, display:'flex', pointerEvents:'none' }}>
          <Ico size={14} sw={2}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Ico>
        </span>
        <input
          type="text" value={searchQuery} placeholder="Search furniture…"
          onChange={e => setSearchQuery(e.target.value)}
          style={{ width:'100%', padding:'9px 34px 9px 34px', background:'rgba(255,255,255,0.04)', border:`1px solid ${C.border}`, borderRadius:10, color:C.textMain, fontSize:'0.82rem', fontFamily:'inherit', outline:'none', transition:C.tr, boxSizing:'border-box' }}
          onFocus={e => { e.target.style.borderColor='rgba(99,102,241,0.5)'; e.target.style.background='rgba(99,102,241,0.06)'; e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,0.12)'; }}
          onBlur={e => { e.target.style.borderColor=C.border; e.target.style.background='rgba(255,255,255,0.04)'; e.target.style.boxShadow='none'; }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')}
            style={{ position:'absolute', right:9, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:C.textMuted, cursor:'pointer', fontSize:'1.1rem', lineHeight:1, padding:'2px 4px', borderRadius:4 }}>
            ×
          </button>
        )}
      </div>

      {/* Category chips */}
      <div style={{ marginBottom:10 }}>
        <span style={{ display:'block', fontSize:'0.6rem', fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:6 }}>Category</span>
        <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
          {CATEGORIES.map(cat => (
            <Chip key={cat} active={catFilter === cat} onClick={() => setCatFilter(cat)}>{cat}</Chip>
          ))}
        </div>
      </div>

      {/* Material chips */}
      <div style={{ marginBottom:14 }}>
        <span style={{ display:'block', fontSize:'0.6rem', fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:6 }}>Material</span>
        <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
          {MATERIALS.map(mat => (
            <Chip key={mat} active={matFilter === mat} onClick={() => setMatFilter(mat)}>{mat}</Chip>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
        <span style={{ fontSize:'0.63rem', color:C.textMuted, fontWeight:500 }}>
          {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
        </span>
        {items.length > 0 && (
          <span style={{ fontSize:'0.63rem', color:C.textAccent, fontWeight:600, background:C.accentDim, padding:'2px 9px', borderRadius:99 }}>
            {items.length} on canvas
          </span>
        )}
      </div>

      {/* Furniture grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'32px 12px' }}>
          <div style={{ fontSize:'2rem', marginBottom:10 }}>🔍</div>
          <p style={{ fontSize:'0.82rem', color:C.textMuted, margin:0 }}>No results found</p>
          <p style={{ fontSize:'0.72rem', color:C.textMuted, opacity:.7, marginTop:6 }}>Try a different search or filter</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {filtered.map(f => {
            const isHov = hovered === f.name;
            return (
              <button key={f.name} onClick={() => addItem(f.name)}
                onMouseEnter={() => setHovered(f.name)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isHov ? 'rgba(99,102,241,0.08)' : C.bgCard,
                  border: `1px solid ${isHov ? 'rgba(99,102,241,0.35)' : C.border}`,
                  borderRadius:14, padding:0, display:'flex', flexDirection:'column',
                  cursor:'pointer', color:C.textMain, position:'relative', overflow:'hidden',
                  textAlign:'left', fontFamily:'inherit',
                  transition: C.tr,
                  transform: isHov ? 'translateY(-2px)' : 'none',
                  boxShadow: isHov ? `0 8px 24px rgba(0,0,0,0.35), ${C.accentGlow}` : '0 2px 8px rgba(0,0,0,0.2)',
                }}>
                {/* Thumbnail */}
                <div style={{ position:'relative', width:'100%', height:110, overflow:'hidden', background: f.thumbnail ? '#f0ede8' : 'linear-gradient(135deg,rgba(30,32,50,0.9),rgba(50,40,80,0.7))', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {f.thumbnail ? (
                    <img src={f.thumbnail} alt={f.name} style={{ width:'100%', height:'100%', objectFit:'cover', transition:C.tr, transform: isHov ? 'scale(1.06)' : 'scale(1)' }} />
                  ) : (
                    <span style={{ fontSize:'2.2rem', filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}>{f.icon}</span>
                  )}
                  {f.model && (
                    <span style={{ position:'absolute', top:6, right:6, fontSize:'0.46rem', fontWeight:800, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', padding:'2px 7px', borderRadius:5, letterSpacing:'0.5px', textTransform:'uppercase' }}>
                      3D
                    </span>
                  )}
                  {/* Hover overlay */}
                  <div style={{ position:'absolute', inset:0, background:'rgba(99,102,241,0.15)', opacity: isHov ? 1 : 0, transition:C.tr, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:'0.68rem', fontWeight:700, color:'white', background:'rgba(99,102,241,0.7)', padding:'4px 10px', borderRadius:8, backdropFilter:'blur(4px)' }}>+ Add</span>
                  </div>
                </div>
                {/* Info */}
                <div style={{ padding:'9px 10px 11px', display:'flex', flexDirection:'column', gap:2 }}>
                  <span style={{ fontSize:'0.78rem', fontWeight:700, color:'#f0f4ff', lineHeight:1.25 }}>{f.name}</span>
                  <span style={{ fontSize:'0.61rem', color:'rgba(168,178,204,0.65)', lineHeight:1.35, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.desc}</span>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:5 }}>
                    <span style={{ fontSize:'0.57rem', color:'rgba(129,140,248,0.7)', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 6px', borderRadius:5 }}>{f.material}</span>
                    <span style={{ fontSize:'0.85rem', fontWeight:800, color:C.gold }}>${f.price}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROPERTIES PANEL
───────────────────────────────────────────────────────────────────────────── */
const COLOR_SWATCHES = ['#6b7280','#ef4444','#f59e0b','#22c55e','#3b82f6','#8b5cf6','#ec4899','#f97316','#06b6d4','#84cc16','#d97706','#78716c'];
const PRICES_MAP = ITEM_PRICES;

function PropertiesPanel({ selectedItem, updateItem, deleteItem, selectedId }) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!selectedItem) return (
    <div className="sb-fade" style={{ textAlign:'center', padding:'40px 12px' }}>
      <div style={{ width:64, height:64, borderRadius:16, background:'rgba(255,255,255,0.03)', border:`1px solid ${C.borderSoft}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'1.8rem' }}>🪑</div>
      <p style={{ fontSize:'0.9rem', fontWeight:600, color:C.textSub, marginBottom:8 }}>Nothing selected</p>
      <p style={{ fontSize:'0.75rem', color:C.textMuted, lineHeight:1.6, margin:0 }}>Click a furniture item on the canvas to edit its properties</p>
      <div style={{ display:'flex', alignItems:'flex-start', gap:8, marginTop:20, padding:'11px 14px', background:C.accentDim, borderRadius:10, border:`1px solid rgba(99,102,241,0.15)`, textAlign:'left' }}>
        <span style={{ fontSize:'0.85rem' }}>💡</span>
        <span style={{ fontSize:'0.72rem', color:C.textAccent, lineHeight:1.5 }}>Switch to 2D Blueprint mode for precision placement and top-down editing</span>
      </div>
    </div>
  );

  const catalogItem = FURNITURE_ITEMS.find(f => f.name === selectedItem.type) || {};
  const price = PRICES_MAP[selectedItem.type] || 0;
  const pos = selectedItem.position || [0,0,0];
  const rot = selectedItem.rotation || [0,0,0];
  const scl = selectedItem.scale || [1,1,1];

  return (
    <div className="sb-fade">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 14px', background:'rgba(255,255,255,0.03)', borderRadius:12, border:`1px solid ${C.borderSoft}`, marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:C.accentDim, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>
            {catalogItem.icon || '🪑'}
          </div>
          <div>
            <div style={{ fontSize:'0.88rem', fontWeight:700, color:C.textMain }}>{selectedItem.type}</div>
            <div style={{ fontSize:'0.6rem', color:C.textMuted, fontFamily:C.mono }}>#{String(selectedItem.id).slice(-6)}</div>
          </div>
        </div>
        <button onClick={() => setShowConfirm(true)}
          style={{ width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:8, color:C.red, cursor:'pointer', transition:C.tr }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor='rgba(239,68,68,0.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.07)'; e.currentTarget.style.borderColor='rgba(239,68,68,0.15)'; }}>
          <Ico size={15} sw={2}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/></Ico>
        </button>
      </div>

      {/* Price tag */}
      {price > 0 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'linear-gradient(135deg,rgba(251,191,36,0.07),rgba(245,158,11,0.03))', borderRadius:11, border:'1px solid rgba(251,191,36,0.18)', marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, color:C.gold }}>
            <Ico size={14} sw={2}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></Ico>
            <span style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>Catalog Price</span>
          </div>
          <span style={{ fontSize:'1.1rem', fontWeight:800, color:C.gold, fontFamily:C.mono, textShadow:'0 0 14px rgba(251,191,36,0.25)' }}>${price}</span>
        </div>
      )}

      {/* Material meta */}
      {(catalogItem.material || catalogItem.color) && (
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', padding:'7px 12px', background:'rgba(255,255,255,0.02)', borderRadius:8, marginBottom:14 }}>
          {catalogItem.material && <span style={{ fontSize:'0.66rem', color:C.textAccent, fontWeight:500 }}>⬡ {catalogItem.material}</span>}
          {catalogItem.material && catalogItem.color && <span style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.12)' }}>|</span>}
          {catalogItem.color && <span style={{ fontSize:'0.66rem', color:C.textMuted }}>🎨 {catalogItem.color}</span>}
        </div>
      )}

      {/* Color section */}
      <div style={{ background:C.bgPanel, borderRadius:11, border:`1px solid ${C.borderSoft}`, overflow:'hidden', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderBottom:`1px solid ${C.borderSoft}` }}>
          <span style={{ color:C.textMuted, display:'flex' }}><Ico size={13} sw={2}><circle cx="13.5" cy="6.5" r="0.5"/><circle cx="17.5" cy="10.5" r="0.5"/><circle cx="8.5" cy="7.5" r="0.5"/><circle cx="6.5" cy="12.5" r="0.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.17-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></Ico></span>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:C.textSub, textTransform:'uppercase', letterSpacing:'0.4px' }}>Material Color</span>
        </div>
        <div style={{ padding:'11px 12px' }}>
          {/* Swatches */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:10 }}>
            {COLOR_SWATCHES.map(sw => (
              <button key={sw} onClick={() => updateItem(selectedId, { color: sw })}
                title={sw}
                style={{ width:22, height:22, borderRadius:6, background:sw, border: selectedItem.color === sw ? '2px solid white' : '2px solid transparent', cursor:'pointer', transition:C.tr, flexShrink:0, boxShadow: selectedItem.color === sw ? `0 0 8px ${sw}` : 'none' }} />
            ))}
          </div>
          {/* Native color picker */}
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <input type="color" value={selectedItem.color || '#888888'}
              onChange={e => updateItem(selectedId, { color: e.target.value })}
              style={{ width:32, height:32, borderRadius:8, border:'none', cursor:'pointer', background:'transparent', flexShrink:0 }} />
            <span style={{ fontSize:'0.72rem', color:C.textMuted, fontFamily:C.mono }}>{selectedItem.color || '#888888'}</span>
          </div>
        </div>
      </div>

      {/* Position */}
      <div style={{ background:C.bgPanel, borderRadius:11, border:`1px solid ${C.borderSoft}`, overflow:'hidden', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderBottom:`1px solid ${C.borderSoft}` }}>
          <span style={{ color:C.textMuted, display:'flex' }}><Ico size={13} sw={2}><path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/></Ico></span>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:C.textSub, textTransform:'uppercase', letterSpacing:'0.4px' }}>Position</span>
        </div>
        <div style={{ padding:'11px 12px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:7 }}>
            {['X','Y','Z'].map((axis, i) => {
              const axisColors = { X:'#ef4444', Y:'#22c55e', Z:'#3b82f6' };
              return (
                <div key={axis}>
                  <label style={{ display:'block', fontSize:'0.6rem', fontWeight:800, color:axisColors[axis], marginBottom:4, textAlign:'center' }}>{axis}</label>
                  <NumInput value={pos[i]} step={0.1}
                    onChange={v => { const p=[...pos]; p[i]=v; updateItem(selectedId,{position:p}); }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rotation */}
      <div style={{ background:C.bgPanel, borderRadius:11, border:`1px solid ${C.borderSoft}`, overflow:'hidden', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderBottom:`1px solid ${C.borderSoft}` }}>
          <span style={{ color:C.textMuted, display:'flex' }}><Ico size={13} sw={2}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></Ico></span>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:C.textSub, textTransform:'uppercase', letterSpacing:'0.4px' }}>Rotation</span>
        </div>
        <div style={{ padding:'11px 12px' }}>
          <SliderRow value={rot[1]} min={0} max={Math.PI * 2} step={0.05}
            onChange={v => { const r=[...rot]; r[1]=v; updateItem(selectedId,{rotation:r}); }}
            label="Y-Axis" icon="🔄"
            displayFn={v => `${Math.round(v * 180 / Math.PI)}°`}
          />
        </div>
      </div>

      {/* Scale */}
      <div style={{ background:C.bgPanel, borderRadius:11, border:`1px solid ${C.borderSoft}`, overflow:'hidden', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderBottom:`1px solid ${C.borderSoft}` }}>
          <span style={{ color:C.textMuted, display:'flex' }}><Ico size={13} sw={2}><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></Ico></span>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:C.textSub, textTransform:'uppercase', letterSpacing:'0.4px' }}>Scale</span>
        </div>
        <div style={{ padding:'11px 12px' }}>
          <SliderRow value={scl[0]} min={0.3} max={3} step={0.05}
            onChange={v => updateItem(selectedId, { scale:[v,v,v] })}
            label="Uniform" icon="📐"
            displayFn={v => `${v.toFixed(2)}×`}
          />
        </div>
      </div>

      {/* Surface Shading */}
      <div style={{ background:C.bgPanel, borderRadius:11, border:`1px solid ${C.borderSoft}`, overflow:'hidden', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderBottom:`1px solid ${C.borderSoft}` }}>
          <span style={{ color:C.textMuted, display:'flex' }}><Ico size={13} sw={2}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></Ico></span>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:C.textSub, textTransform:'uppercase', letterSpacing:'0.4px' }}>Surface Shading</span>
        </div>
        <div style={{ padding:'11px 12px' }}>
          <SliderRow
            value={selectedItem.roughness ?? 0.3} min={0} max={1} step={0.05}
            onChange={v => updateItem(selectedId, { roughness: v })}
            label="Roughness" icon="🪨"
            displayFn={v => v <= 0.2 ? 'Glossy' : v <= 0.5 ? 'Satin' : v <= 0.75 ? 'Matte' : 'Rough'}
          />
          <SliderRow
            value={selectedItem.metalness ?? 0.1} min={0} max={1} step={0.05}
            onChange={v => updateItem(selectedId, { metalness: v })}
            label="Metalness" icon="⚙️"
            displayFn={v => v <= 0.1 ? 'None' : v <= 0.4 ? 'Low' : v <= 0.7 ? 'Medium' : 'High'}
          />
          <SliderRow
            value={selectedItem.brightness ?? 1} min={0.2} max={2.0} step={0.05}
            onChange={v => updateItem(selectedId, { brightness: v })}
            label="Brightness" icon="🔆"
            displayFn={v => v < 0.5 ? 'Dark' : v < 0.9 ? 'Dim' : v <= 1.1 ? 'Normal' : v <= 1.5 ? 'Bright' : 'Glowing'}
          />
        </div>
      </div>
      {showConfirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
          <div style={{ background:'#0e0f1e', border:`1px solid ${C.border}`, borderRadius:18, padding:'32px', maxWidth:340, width:'90%', textAlign:'center', boxShadow:C.shadowLg }}>
            <div style={{ width:56, height:56, borderRadius:14, background:'rgba(239,68,68,0.08)', border:'1.5px solid rgba(239,68,68,0.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'1.5rem' }}>🗑️</div>
            <h3 style={{ margin:'0 0 8px', fontSize:'1.05rem', fontWeight:800, color:C.textMain }}>Delete {selectedItem.type}?</h3>
            <p style={{ margin:'0 0 24px', fontSize:'0.78rem', color:C.textMuted, lineHeight:1.6 }}>This action cannot be undone.</p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setShowConfirm(false)}
                style={{ flex:1, padding:'10px', borderRadius:10, background:'rgba(255,255,255,0.05)', border:`1px solid ${C.border}`, color:C.textSub, fontSize:'0.82rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:C.tr }}>
                Cancel
              </button>
              <button onClick={() => { deleteItem(selectedId); setShowConfirm(false); }}
                style={{ flex:1, padding:'10px', borderRadius:10, background:'linear-gradient(135deg,#ef4444,#dc2626)', border:'none', color:'white', fontSize:'0.82rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 14px rgba(239,68,68,0.35)', transition:C.tr }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ROOM PANEL
───────────────────────────────────────────────────────────────────────────── */
function RoomPanel({ roomConfig, setRoomConfig, windows, addWindow, updateWindow, deleteWindow, doors, addDoor, updateDoor, deleteDoor }) {
  const updateRoom = (key, val) => setRoomConfig(p => ({ ...p, [key]: val }));

  const WALLS = [
    { id: 'back',  label: 'Back',  color: '#60a5fa' },
    { id: 'left',  label: 'Left',  color: '#4ade80' },
    { id: 'right', label: 'Right', color: '#fb923c' },
    { id: 'front', label: 'Front', color: '#a78bfa' },
  ];

  return (
    <div className="sb-fade">

      {/* Room shape */}
      <SectionDivider title="Room Shape" />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, marginBottom:18 }}>
        {ROOM_SHAPES.map(s => {
          const active = roomConfig.shape === s.id;
          return (
            <button key={s.id} onClick={() => updateRoom('shape', s.id)}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, padding:'11px 5px', borderRadius:11, border:`1.5px solid ${active ? 'rgba(99,102,241,0.55)' : C.border}`, background: active ? C.accentDim : 'rgba(255,255,255,0.02)', color: active ? C.accent : C.textMuted, cursor:'pointer', transition:C.tr, fontFamily:'inherit', boxShadow: active ? C.accentGlow : 'none' }}>
              <span style={{ width:28 }}>{s.svg}</span>
              <span style={{ fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.2px' }}>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dimensions */}
      <SectionDivider title="Dimensions" />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:18 }}>
        <div>
          <Label>Width (m)</Label>
          <NumInput value={roomConfig.width} min={3} max={50} step={0.5} onChange={v => updateRoom('width', v)} />
        </div>
        <div>
          <Label>Depth (m)</Label>
          <NumInput value={roomConfig.depth} min={3} max={50} step={0.5} onChange={v => updateRoom('depth', v)} />
        </div>
      </div>

      {/* Colors */}
      <SectionDivider title="Materials & Colors" />
      <div style={{ marginBottom:18 }}>
        {/* Wall color */}
        <div style={{ marginBottom:14 }}>
          <Label>Wall Color</Label>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:8 }}>
            {WALL_PRESETS.map(c => (
              <button key={c} onClick={() => updateRoom('wallColor', c)}
                style={{ width:24, height:24, borderRadius:6, background:c, border: roomConfig.wallColor === c ? '2px solid white' : '2px solid transparent', cursor:'pointer', flexShrink:0, transition:C.tr, boxShadow: roomConfig.wallColor === c ? `0 0 6px ${c}aa` : 'none' }} />
            ))}
            <input type="color" value={roomConfig.wallColor}
              onChange={e => updateRoom('wallColor', e.target.value)}
              style={{ width:24, height:24, borderRadius:6, border:'none', cursor:'pointer', background:'transparent', padding:0 }} />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:32, height:22, borderRadius:6, background:roomConfig.wallColor, border:`1px solid ${C.border}` }} />
            <span style={{ fontSize:'0.7rem', color:C.textMuted, fontFamily:C.mono }}>{roomConfig.wallColor}</span>
          </div>
        </div>

        {/* Floor color */}
        <div>
          <Label>Floor Color</Label>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:8 }}>
            {FLOOR_PRESETS.map(c => (
              <button key={c} onClick={() => updateRoom('floorColor', c)}
                style={{ width:24, height:24, borderRadius:6, background:c, border: roomConfig.floorColor === c ? '2px solid white' : '2px solid transparent', cursor:'pointer', flexShrink:0, transition:C.tr, boxShadow: roomConfig.floorColor === c ? `0 0 6px ${c}aa` : 'none' }} />
            ))}
            <input type="color" value={roomConfig.floorColor}
              onChange={e => updateRoom('floorColor', e.target.value)}
              style={{ width:24, height:24, borderRadius:6, border:'none', cursor:'pointer', background:'transparent', padding:0 }} />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:32, height:22, borderRadius:6, background:roomConfig.floorColor, border:`1px solid ${C.border}` }} />
            <span style={{ fontSize:'0.7rem', color:C.textMuted, fontFamily:C.mono }}>{roomConfig.floorColor}</span>
          </div>
        </div>
      </div>

      {/* Floor type */}
      <SectionDivider title="Floor Texture" />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:6, marginBottom:18 }}>
        {FLOOR_TYPES.map(f => {
          const active = roomConfig.floorType === f.id;
          return (
            <button key={f.id} onClick={() => updateRoom('floorType', f.id)}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'9px 4px', borderRadius:10, border:`1.5px solid ${active ? 'rgba(99,102,241,0.5)' : C.border}`, background: active ? C.accentDim : 'rgba(255,255,255,0.02)', color: active ? C.accent : C.textMuted, cursor:'pointer', transition:C.tr, fontFamily:'inherit', boxShadow: active ? C.accentGlow : 'none' }}>
              <span style={{ fontSize:'1rem' }}>{f.emoji}</span>
              <span style={{ fontSize:'0.55rem', fontWeight:700, letterSpacing:'0.2px' }}>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Windows */}
      <SectionDivider title="Windows" badge={windows.length} />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:12 }}>
        {WALLS.map(w => {
          const cnt = windows.filter(win => win.wall === w.id).length;
          return (
            <button key={w.id} onClick={() => addWindow(w.id)}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'10px 8px', borderRadius:10, border:`1.5px dashed ${w.color}40`, background:`${w.color}08`, color:w.color, cursor:'pointer', transition:C.tr, fontFamily:'inherit', fontSize:'0.7rem', fontWeight:600, position:'relative' }}
              onMouseEnter={e => { e.currentTarget.style.background=`${w.color}15`; e.currentTarget.style.borderColor=`${w.color}70`; }}
              onMouseLeave={e => { e.currentTarget.style.background=`${w.color}08`; e.currentTarget.style.borderColor=`${w.color}40`; }}>
              <Ico size={14} sw={1.5}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></Ico>
              + {w.label}
              {cnt > 0 && <span style={{ position:'absolute', top:4, right:4, fontSize:'0.5rem', fontWeight:800, background:w.color, color:'#000', padding:'1px 5px', borderRadius:99 }}>{cnt}</span>}
            </button>
          );
        })}
      </div>
      {windows.map(win => (
        <div key={win.id} style={{ marginBottom:8, borderRadius:10, border:'1px solid rgba(96,165,250,0.18)', background:'rgba(96,165,250,0.04)', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 10px', borderBottom:'1px solid rgba(96,165,250,0.1)' }}>
            <span style={{ fontSize:'0.68rem', fontWeight:700, color:'#60a5fa' }}>Window · {win.wall}</span>
            <button onClick={() => deleteWindow(win.id)}
              style={{ width:26, height:26, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:6, color:C.red, cursor:'pointer', transition:C.tr }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.08)'; }}>
              <Ico size={12} sw={2}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></Ico>
            </button>
          </div>
          <div style={{ padding:'10px' }}>
            <div style={{ marginBottom:8 }}>
              <Label>Style</Label>
              <SbSelect value={win.style || 'single'} onChange={v => updateWindow(win.id, { style:v })}
                options={[{value:'single',label:'Single Pane'},{value:'double',label:'Double Pane'},{value:'bay',label:'Bay Window'},{value:'arched',label:'Arched Top'}]} />
            </div>
            <SliderRow value={win.position ?? 0.5} min={0.1} max={0.9} step={0.05}
              onChange={v => updateWindow(win.id, { position:v })} label="Position" displayFn={v => `${Math.round(v*100)}%`} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <div><Label>Width (m)</Label><NumInput value={win.width ?? 2} min={0.5} max={6} step={0.1} onChange={v => updateWindow(win.id,{width:v})} /></div>
              <div><Label>Height (m)</Label><NumInput value={win.height ?? 2} min={0.5} max={4} step={0.1} onChange={v => updateWindow(win.id,{height:v})} /></div>
            </div>
            <div style={{ marginTop:8 }}>
              <SliderRow value={win.sillHeight ?? 1} min={0.3} max={3} step={0.05}
                onChange={v => updateWindow(win.id,{sillHeight:v})} label="Sill Height" displayFn={v => `${v.toFixed(1)} m`} />
            </div>
          </div>
        </div>
      ))}

      {/* Doors */}
      <SectionDivider title="Doors" badge={doors.length} />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:12 }}>
        {WALLS.map(w => {
          const cnt = doors.filter(d => d.wall === w.id).length;
          return (
            <button key={w.id} onClick={() => addDoor(w.id)}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'10px 8px', borderRadius:10, border:'1.5px dashed rgba(245,158,11,0.3)', background:'rgba(245,158,11,0.05)', color:'#f59e0b', cursor:'pointer', transition:C.tr, fontFamily:'inherit', fontSize:'0.7rem', fontWeight:600, position:'relative' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(245,158,11,0.12)'; e.currentTarget.style.borderColor='rgba(245,158,11,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(245,158,11,0.05)'; e.currentTarget.style.borderColor='rgba(245,158,11,0.3)'; }}>
              <Ico size={14} sw={1.5}><path d="M3 2h18v20H3z"/><line x1="12" y1="12" x2="14" y2="12"/></Ico>
              + {w.label}
              {cnt > 0 && <span style={{ position:'absolute', top:4, right:4, fontSize:'0.5rem', fontWeight:800, background:'#f59e0b', color:'#000', padding:'1px 5px', borderRadius:99 }}>{cnt}</span>}
            </button>
          );
        })}
      </div>
      {doors.map(door => (
        <div key={door.id} style={{ marginBottom:8, borderRadius:10, border:'1px solid rgba(245,158,11,0.18)', background:'rgba(245,158,11,0.04)', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 10px', borderBottom:'1px solid rgba(245,158,11,0.1)' }}>
            <span style={{ fontSize:'0.68rem', fontWeight:700, color:'#f59e0b' }}>Door · {door.wall}</span>
            <button onClick={() => deleteDoor(door.id)}
              style={{ width:26, height:26, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:6, color:C.red, cursor:'pointer', transition:C.tr }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.08)'; }}>
              <Ico size={12} sw={2}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></Ico>
            </button>
          </div>
          <div style={{ padding:'10px' }}>
            <SliderRow value={door.position ?? 0.5} min={0.1} max={0.9} step={0.05}
              onChange={v => updateDoor(door.id, { position:v })} label="Position" displayFn={v => `${Math.round(v*100)}%`} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <div><Label>Width (m)</Label><NumInput value={door.width ?? 1.2} min={0.6} max={2.5} step={0.1} onChange={v => updateDoor(door.id,{width:v})} /></div>
              <div><Label>Height (m)</Label><NumInput value={door.height ?? 2.4} min={1.8} max={3} step={0.1} onChange={v => updateDoor(door.id,{height:v})} /></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PRICING PANEL
───────────────────────────────────────────────────────────────────────────── */
function PricingPanel({ items }) {
  if (items.length === 0) return (
    <div className="sb-fade" style={{ textAlign:'center', padding:'40px 12px' }}>
      <div style={{ fontSize:'2.5rem', marginBottom:14 }}>🛒</div>
      <p style={{ fontSize:'0.9rem', fontWeight:600, color:C.textSub, marginBottom:6 }}>Cart is empty</p>
      <p style={{ fontSize:'0.75rem', color:C.textMuted, lineHeight:1.6, margin:0 }}>Add furniture from the Library to see your cost breakdown here</p>
    </div>
  );

  // Group by type
  const grouped = items.reduce((acc, item) => {
    acc[item.type] = acc[item.type] || { ...item, qty: 0, total: 0 };
    acc[item.type].qty += 1;
    acc[item.type].total += ITEM_PRICES[item.type] ?? 0;
    return acc;
  }, {});

  const subtotal    = Object.values(grouped).reduce((s, g) => s + g.total, 0);
  const assembly    = subtotal * 0.10;
  const tax         = subtotal * 0.08;
  const total       = subtotal + assembly + tax;
  const savings     = subtotal * 0.05;
  const catalogItem = (name) => FURNITURE_ITEMS.find(f => f.name === name) || {};

  return (
    <div className="sb-fade">
      <SectionDivider title="Order Summary" badge={items.length} />

      {/* Cart items */}
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
        {Object.values(grouped).map(g => {
          const ci = catalogItem(g.type);
          return (
            <div key={g.type} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 12px', background:C.bgCard, borderRadius:12, border:`1px solid ${C.border}`, transition:C.tr }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(99,102,241,0.06)'; e.currentTarget.style.borderColor='rgba(99,102,241,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background=C.bgCard; e.currentTarget.style.borderColor=C.border; }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, minWidth:0 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:C.accentDim, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>
                  {ci.icon || '🪑'}
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:'0.8rem', fontWeight:700, color:C.textMain, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{g.type}</div>
                  <div style={{ fontSize:'0.6rem', color:C.textMuted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:1 }}>{ci.desc || ''}</div>
                  {ci.material && <div style={{ fontSize:'0.55rem', color:'rgba(129,140,248,0.6)', fontWeight:600, marginTop:2 }}>{ci.material}</div>}
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:2, flexShrink:0, paddingLeft:10 }}>
                {g.qty > 1 && <span style={{ fontSize:'0.6rem', fontWeight:700, color:C.textMuted, background:'rgba(255,255,255,0.06)', padding:'1px 7px', borderRadius:99 }}>×{g.qty}</span>}
                <span style={{ fontSize:'0.92rem', fontWeight:800, color:C.gold }}>${g.total.toFixed(2)}</span>
                {g.qty > 1 && <span style={{ fontSize:'0.55rem', color:C.textMuted }}>${(ITEM_PRICES[g.type]||0).toFixed(2)} each</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Order summary card */}
      <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 14px', background:'rgba(99,102,241,0.06)', borderBottom:`1px solid ${C.borderSoft}` }}>
          <Ico size={13} sw={2}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></Ico>
          <span style={{ fontSize:'0.7rem', fontWeight:800, color:C.textAccent, textTransform:'uppercase', letterSpacing:'0.5px' }}>Price Breakdown</span>
        </div>

        <PriceLine label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
        <PriceLine label="Delivery" value="FREE" valueColor={C.greenLive} />
        <PriceLine label="Assembly (10%)" value={`$${assembly.toFixed(2)}`} />
        <PriceLine label="Est. Tax (8%)" value={`$${tax.toFixed(2)}`} muted />

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:'linear-gradient(135deg,rgba(251,191,36,0.07),rgba(245,158,11,0.03))', borderTop:`1px solid rgba(251,191,36,0.15)` }}>
          <span style={{ fontSize:'0.85rem', fontWeight:800, color:C.textMain }}>Estimated Total</span>
          <span style={{ fontSize:'1.15rem', fontWeight:800, color:C.gold, fontFamily:C.mono, textShadow:'0 0 16px rgba(251,191,36,0.25)' }}>${total.toFixed(2)}</span>
        </div>

        {/* Savings badge */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', background:'rgba(34,197,94,0.04)', borderTop:'1px solid rgba(34,197,94,0.1)' }}>
          <span style={{ fontSize:'1rem' }}>🎁</span>
          <div>
            <div style={{ fontSize:'0.7rem', fontWeight:700, color:C.greenLive }}>ND Family Member Price</div>
            <div style={{ fontSize:'0.62rem', color:C.textMuted, marginTop:2, lineHeight:1.4 }}>Save an extra <strong style={{ color:'#4ade80' }}>${savings.toFixed(2)}</strong> with ND Membership</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PriceLine = ({ label, value, muted, valueColor }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 16px', borderBottom:`1px solid ${C.borderSoft}` }}>
    <span style={{ fontSize:'0.75rem', color: muted ? C.textMuted : C.textSub }}>{label}</span>
    <span style={{ fontSize:'0.78rem', fontWeight:700, color: valueColor || C.textMain, fontFamily:C.mono }}>{value}</span>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL / SETTINGS PANEL
───────────────────────────────────────────────────────────────────────────── */
function GlobalPanel({ roomConfig, setRoomConfig, saveDesign, loadDesigns, downloadScreenshot, saveAsTemplate, undo, redo, canUndo, canRedo }) {
  const updateRoom = (key, val) => setRoomConfig(p => ({ ...p, [key]: val }));

  return (
    <div className="sb-fade">
      {/* Undo / Redo */}
      <SectionDivider title="History" />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:18 }}>
        <button onClick={undo} disabled={!canUndo}
          aria-label="Undo last action"
          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px', borderRadius:10, cursor: canUndo ? 'pointer' : 'not-allowed', fontFamily:'inherit', fontSize:'0.82rem', fontWeight:700, transition:C.tr, border:`1px solid ${canUndo ? 'rgba(99,102,241,0.35)' : C.borderSoft}`, background: canUndo ? C.accentDim : 'rgba(255,255,255,0.02)', color: canUndo ? C.textAccent : C.textMuted, opacity: canUndo ? 1 : 0.45 }}>
          <Ico size={14} sw={2}><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 00-4-4H4"/></Ico>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo}
          aria-label="Redo last action"
          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px', borderRadius:10, cursor: canRedo ? 'pointer' : 'not-allowed', fontFamily:'inherit', fontSize:'0.82rem', fontWeight:700, transition:C.tr, border:`1px solid ${canRedo ? 'rgba(34,211,238,0.35)' : C.borderSoft}`, background: canRedo ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.02)', color: canRedo ? C.cyan : C.textMuted, opacity: canRedo ? 1 : 0.45 }}>
          <Ico size={14} sw={2}><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 014-4h12"/></Ico>
          Redo
        </button>
      </div>
      <div style={{ fontSize:'0.62rem', color:C.textMuted, textAlign:'center', marginBottom:18, opacity:.7 }}>Ctrl+Z · Ctrl+Y</div>

      {/* Lighting */}
      <SectionDivider title="Environment" />
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
        {LIGHTING_MODES.map(m => {
          const active = roomConfig.lightingMode === m.id;
          return (
            <button key={m.id} onClick={() => updateRoom('lightingMode', m.id)}
              style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 14px', borderRadius:12, border:`1.5px solid ${active ? 'rgba(99,102,241,0.5)' : C.border}`, background: active ? C.accentDim : 'rgba(255,255,255,0.025)', cursor:'pointer', fontFamily:'inherit', transition:C.tr, boxShadow: active ? C.accentGlow : 'none', textAlign:'left', width:'100%' }}
              onMouseEnter={e => { if(!active){ e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'; } }}
              onMouseLeave={e => { if(!active){ e.currentTarget.style.background='rgba(255,255,255,0.025)'; e.currentTarget.style.borderColor=C.border; } }}>
              {/* Sky gradient preview */}
              <div style={{ width:42, height:42, borderRadius:10, background:m.gradient, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', boxShadow:'0 4px 14px rgba(0,0,0,0.3)' }}>
                {m.icon}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'0.82rem', fontWeight:700, color: active ? C.textMain : C.textSub }}>{m.label}</div>
                <div style={{ fontSize:'0.63rem', color:C.textMuted, marginTop:2 }}>
                  {m.id === 'Day' && 'Bright natural sunlight environment'}
                  {m.id === 'Golden' && 'Warm sunset amber lighting'}
                  {m.id === 'Night' && 'Cool ambient night atmosphere'}
                </div>
              </div>
              {active && (
                <span style={{ width:8, height:8, borderRadius:'50%', background:C.accent, boxShadow:`0 0 8px ${C.accent}`, flexShrink:0 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Scene Shading */}
      <SectionDivider title="Scene Shading" />
      <div style={{ background:C.bgPanel, borderRadius:11, border:`1px solid ${C.borderSoft}`, padding:'12px 14px', marginBottom:18 }}>
        <SliderRow
          value={roomConfig.ambientIntensity ?? 0.6}
          min={0.0} max={1.5} step={0.05}
          onChange={v => updateRoom('ambientIntensity', v)}
          label="Ambient Brightness" icon="💡"
          displayFn={v => `${Math.round(v * 100)}%`}
        />
        <SliderRow
          value={roomConfig.sunIntensity ?? 1.2}
          min={0.0} max={3.0} step={0.1}
          onChange={v => updateRoom('sunIntensity', v)}
          label="Sun Intensity" icon="☀️"
          displayFn={v => `${v.toFixed(1)}×`}
        />
        <div style={{ marginTop:4 }}>
          <button
            onClick={() => { updateRoom('ambientIntensity', undefined); updateRoom('sunIntensity', undefined); }}
            style={{ fontSize:'0.65rem', color:C.textMuted, background:'none', border:`1px solid ${C.border}`, borderRadius:7, padding:'4px 10px', cursor:'pointer', fontFamily:'inherit', transition:C.trFast }}
            onMouseEnter={e => { e.currentTarget.style.color=C.textSub; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.color=C.textMuted; e.currentTarget.style.borderColor=C.border; }}>
            Reset to defaults
          </button>
        </div>
      </div>

      {/* Project actions */}
      <SectionDivider title="Project Actions" />
      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
        <ActionBtn onClick={saveDesign} primary
          icon={<Ico size={15} sw={2}><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></Ico>}
          label="Save Project" />
        <ActionBtn onClick={saveAsTemplate}
          icon={<Ico size={15} sw={2}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></Ico>}
          label="Save as Template" />
        <ActionBtn onClick={loadDesigns}
          icon={<Ico size={15} sw={2}><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></Ico>}
          label="Load Previous" />
        <ActionBtn onClick={downloadScreenshot}
          icon={<Ico size={15} sw={2}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></Ico>}
          label="Download Screenshot" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN SIDEBAR COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function Sidebar({
  user,
  onLogout,
  addItem,
  selectedId,
  items,
  updateItem,
  deleteItem,
  roomConfig,
  setRoomConfig,
  windows = [],
  addWindow,
  updateWindow,
  deleteWindow,
  doors = [],
  addDoor,
  updateDoor,
  deleteDoor,
  saveDesign,
  loadDesigns,
  downloadScreenshot,
  saveAsTemplate,
  undo,
  redo,
  canUndo = false,
  canRedo = false,
}) {
  const [activeTab, setActiveTab]   = useState(TABS.LIBRARY);
  const [collapsed, setCollapsed]   = useState(false);
  const [hovLogout, setHovLogout]   = useState(false);

  const selectedItem = items.find(i => i.id === selectedId);

  // Each tab gets a live badge
  const BADGES = {
    [TABS.LIBRARY]:    items.length > 0 ? items.length : null,
    [TABS.PROPERTIES]: selectedItem ? '●' : null,
    [TABS.ROOM]:       (windows.length + doors.length) > 0 ? (windows.length + doors.length) : null,
    [TABS.PRICING]:    items.length > 0 ? items.length : null,
    [TABS.GLOBAL]:     null,
  };

  /* ── COLLAPSED RAIL ── */
  if (collapsed) return (
    <aside style={{ width:60, height:'100%', background:C.bg, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', alignItems:'center', paddingTop:14, gap:4, flexShrink:0, zIndex:100 }}>
      {/* Expand toggle */}
      <button onClick={() => setCollapsed(false)}
        style={{ width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent', border:`1px solid ${C.border}`, borderRadius:10, color:C.textMuted, cursor:'pointer', transition:C.tr, marginBottom:10 }}
        onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color=C.textMain; }}
        onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=C.textMuted; }}
        title="Expand sidebar">
        <Ico size={16} sw={2}><polyline points="9 18 15 12 9 6"/></Ico>
      </button>

      {/* Rail nav icons */}
      {NAV.map(n => {
        const active = activeTab === n.id;
        return (
          <button key={n.id}
            onClick={() => { setActiveTab(n.id); setCollapsed(false); }}
            title={n.label}
            style={{ width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', background: active ? C.accentDim : 'transparent', border: `1px solid ${active ? 'rgba(99,102,241,0.35)' : 'transparent'}`, borderRadius:10, color: active ? C.accent : C.textMuted, cursor:'pointer', transition:C.tr, position:'relative' }}
            onMouseEnter={e => { if(!active){ e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color=C.textSub; } }}
            onMouseLeave={e => { if(!active){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color=C.textMuted; } }}>
            <n.Icon s={17} />
            {BADGES[n.id] && (
              <span style={{ position:'absolute', top:4, right:4, width:7, height:7, borderRadius:'50%', background:C.accent, boxShadow:`0 0 6px ${C.accent}` }} />
            )}
          </button>
        );
      })}
    </aside>
  );

  /* ── EXPANDED SIDEBAR ── */
  return (
    <aside style={{ width:310, height:'100%', background:`linear-gradient(180deg, rgba(8,9,18,0.98) 0%, rgba(6,7,15,0.99) 100%)`, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', flexShrink:0, zIndex:100, backdropFilter:'blur(20px)' }}>

      {/* ── HEADER ── */}
      <div style={{ padding:'16px 16px 12px', borderBottom:`1px solid ${C.borderSoft}`, flexShrink:0 }}>

        {/* Logo row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, overflow:'hidden', border:`1px solid rgba(99,102,241,0.2)`, flexShrink:0, boxShadow:'0 0 14px rgba(99,102,241,0.2)' }}>
              <img src={ndLogo} alt="ND Logo" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
            <div>
              <div style={{ fontSize:'0.9rem', fontWeight:800, color:C.textMain, letterSpacing:'-0.02em' }}>ND Furniture</div>
              <div style={{ fontSize:'0.58rem', color:C.textMuted, fontWeight:600, letterSpacing:'1px', textTransform:'uppercase' }}>Design Studio</div>
            </div>
          </div>
          {/* Collapse button */}
          <button onClick={() => setCollapsed(true)}
            style={{ width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent', border:'none', borderRadius:8, color:C.textMuted, cursor:'pointer', transition:C.tr }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color=C.textMain; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=C.textMuted; }}
            title="Collapse sidebar">
            <Ico size={15} sw={2}><polyline points="15 18 9 12 15 6"/></Ico>
          </button>
        </div>

        {/* User card */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', background:'rgba(255,255,255,0.03)', borderRadius:10, border:`1px solid ${C.borderSoft}` }}>
          <div style={{ width:34, height:34, borderRadius:10, background: user?.role === 'admin' ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.82rem', fontWeight:800, color:'white', flexShrink:0, boxShadow: user?.role === 'admin' ? '0 0 10px rgba(245,158,11,0.35)' : '0 0 10px rgba(99,102,241,0.35)' }}>
            {(user?.username || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:'0.82rem', fontWeight:700, color:'#e8ecf4', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {(user?.username || user?.email || '').split('@')[0]}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:C.greenLive, boxShadow:`0 0 6px ${C.greenLive}`, flexShrink:0 }} />
              <span style={{ fontSize:'0.6rem', color:C.textMuted, fontWeight:500 }}>
                {user?.role === 'admin' ? '👑 Admin' : 'User'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div style={{ display:'flex', padding:'0 8px', gap:1, borderBottom:`1px solid ${C.borderSoft}`, flexShrink:0, background:'rgba(0,0,0,0.2)' }}>
        {NAV.map(n => {
          const active = activeTab === n.id;
          return (
            <button key={n.id}
              onClick={() => setActiveTab(n.id)}
              aria-pressed={active}
              style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'11px 3px 9px', background:'transparent', border:'none', color: active ? C.accent : C.textMuted, cursor:'pointer', transition:C.tr, fontFamily:'inherit', position:'relative', borderRadius:'0 0 0 0' }}
              onMouseEnter={e => { if(!active) e.currentTarget.style.color=C.textSub; }}
              onMouseLeave={e => { if(!active) e.currentTarget.style.color=C.textMuted; }}>
              <div style={{ position:'relative' }}>
                <n.Icon s={16} />
                {BADGES[n.id] && (
                  <span style={{ position:'absolute', top:-4, right:-6, fontSize:'0.45rem', fontWeight:800, background:C.accent, color:'white', padding:'1px 4px', borderRadius:99, lineHeight:1.4, pointerEvents:'none' }}>
                    {typeof BADGES[n.id] === 'number' ? BADGES[n.id] : ''}
                  </span>
                )}
              </div>
              <span style={{ fontSize:'0.55rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>{n.label}</span>
              {active && (
                <span style={{ position:'absolute', bottom:0, left:'15%', right:'15%', height:2, background:`linear-gradient(90deg,${C.accent},${C.violet})`, borderRadius:'2px 2px 0 0', boxShadow:`0 0 8px ${C.accent}` }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="sb-scroll" style={{ flex:1, overflowY:'auto', padding:'14px 14px 20px' }}>
        {activeTab === TABS.LIBRARY && (
          <LibraryPanel items={items} addItem={addItem} />
        )}
        {activeTab === TABS.PROPERTIES && (
          <PropertiesPanel
            selectedItem={selectedItem}
            updateItem={updateItem}
            deleteItem={deleteItem}
            selectedId={selectedId}
          />
        )}
        {activeTab === TABS.ROOM && (
          <RoomPanel
            roomConfig={roomConfig} setRoomConfig={setRoomConfig}
            windows={windows} addWindow={addWindow} updateWindow={updateWindow} deleteWindow={deleteWindow}
            doors={doors} addDoor={addDoor} updateDoor={updateDoor} deleteDoor={deleteDoor}
          />
        )}
        {activeTab === TABS.PRICING && (
          <PricingPanel items={items} />
        )}
        {activeTab === TABS.GLOBAL && (
          <GlobalPanel
            roomConfig={roomConfig} setRoomConfig={setRoomConfig}
            saveDesign={saveDesign} loadDesigns={loadDesigns} downloadScreenshot={downloadScreenshot}
            saveAsTemplate={saveAsTemplate}
            undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo}
          />
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ padding:'10px 12px', borderTop:`1px solid ${C.borderSoft}`, flexShrink:0 }}>
        <button
          onClick={onLogout}
          onMouseEnter={() => setHovLogout(true)}
          onMouseLeave={() => setHovLogout(false)}
          style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'9px 11px', background: hovLogout ? 'rgba(239,68,68,0.08)' : 'transparent', border:`1px solid ${hovLogout ? 'rgba(239,68,68,0.2)' : 'transparent'}`, borderRadius:9, color: hovLogout ? '#f87171' : C.textMuted, cursor:'pointer', transition:C.tr, fontFamily:'inherit', fontSize:'0.8rem', fontWeight:600 }}>
          <Ico size={14} sw={2}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Ico>
          Sign out
        </button>
      </div>
    </aside>
  );
}
