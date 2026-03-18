import React, { useEffect, useId, useMemo, useState } from 'react';
import ndLogo from '../assets/LOGO/logo.jpeg';
import coffeeTableImg from '../assets/table/coffee_table_round_01_1k/coffee table1.jpg';
import chairImg from '../assets/chair/plastic_monobloc_chair_01/Chair1.jpg';

// Furniture thumbnails from texture files
import drawerImg from '../assets/Drawer/drawer.jpg';
import tvStand3Img from '../assets/Tv stand/tv_stand_3/tv_stand_3.jpg';
import fileCabinetImg from '../assets/cabinet/file_cabinets/file_cabinets.jpg';
import tvStandImg from '../assets/tv Stand/modern_tv_entertainment_center/tvstand.jpg';
import computerChairImg from '../assets/chair/black_computer_chair_-_mesh_back_support/computerchair.jpg';
import modernSofaImg from '../assets/sofa/modern__sofa/modern_sofa.jpg';
import sofaImg from '../assets/sofa/sofa/sofa.jpg';
import loungechairimg from '../assets/chair/lounge_chair/lounge_chair.jpg';
import bedImg from '../assets/Bed/bed 1/bed.jpg';
import poliformBedImg from '../assets/Bed/poliform_bed/poliform_bed.jpg';
import diningtableimg from '../assets/table/simple_dining_table/dining_table.jpg';
import diningsetimg from '../assets/table/modern_dining_room_table_set/dining_set.jpg';
import computertableimg from '../assets/table/computer_table/computer_table.jpg';
import tableimg from '../assets/table/table/table.jpg';
import intableimg from '../assets/table/industrial_table/industrial_table.jpg';
import sofachairimg from '../assets/sofa/sofa_chair/sofa_chair.jpg';
import deskLampimg from '../assets/lap and lights/desk_lamp/deskLamp.jpg';
import outdoorssofaImg from '../assets/chair/outdoors_sofa/outdoors_sofa.jpg';
import floorLampimg from '../assets/lap and lights/floor_lamp/floor_lamp.jpg';
import ericlampimg from '../assets/lap and lights/eric_floor_lamp_white/eric_lamp.jpg';
import diningchairimg from '../assets/chair/dining_chair/diningchair.jpg';
import wardrobe1img from '../assets/cabinet/modern_wooden_wardrobe/wardobeM.jpg'  
// Bathroom thumbnails
import bathroomAsset1Img from '../assets/bathroom/bathroom_asset_part_1/bathroom Asset 1.jpg';
import bathroomclosetimg from '../assets/bathroom/bathroom_closet/bathroom_closet.jpg';
import bathtubimg from '../assets/bathroom/bathtub/bathtub.jpg';
import bathtub1img from '../assets/bathroom/bathtub (1)/bathtub1.jpg';
import sinkVanityimg from '../assets/bathroom/sink_and_vanity/sink_vanity.jpg';
import sinkimg from '../assets/bathroom/sink_with_faucet/sink.jpg';
import toiletimg from '../assets/bathroom/toilet/toilet.jpg';
import toilet1img from '../assets/bathroom/toilet_vaa-772662wh/toilet11.jpg';
import bathtub3img from '../assets/cabinet/banheira_de_imersao_maestri_-_b1203w/bathtub3.jpg'
import warbod1img from '../assets/cabinet/wardrobe/warbod1.jpg'
import cabnetnew from '../assets/kitchen/european_style_dining_cabinet/cabnetnew.jpg'
import warbod12  from '../assets/cabinet/wardrobe (1)/warbod12.jpg'
import newkichen from '../assets/kitchen/kitchen/newkichen.jpg'
import countertop from '../assets/kitchen/kitchen_cabinet_1/countertop.jpg'
import fridge from '../assets/kitchen/modern_fridge/fridge.jpg'
import kitchenwithoven from '../assets/kitchen/small_kitchen_with_oven/kitchenwithoven.jpg'
// Cabinet/Storage thumbnails
import chocolateBookshelfImg from '../assets/cabinet/chocolate_beech_bookshelf_free/bookrack.jpg';

// Seating thumbnails
import couchCompleteImg from '../assets/chair/couch_complete_set/couch.jpg';

// Bedroom thumbnails
import bedAgapeImg from '../assets/Bed/bed_agape (1)/bed14.jpg';

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS - Purple & Hot Pink Theme
───────────────────────────────────────────────────────────────────────────── */
const C = {
  bg:         '#1a0b2e',
  bgPanel:    'rgba(233,53,199,0.05)',
  bgCard:     'rgba(139,92,246,0.08)',
  bgHover:    'rgba(233,53,199,0.12)',
  border:     'rgba(233,53,199,0.15)',
  borderSoft: 'rgba(139,92,246,0.08)',
  accent:     '#E935C7',
  accentDim:  'rgba(233,53,199,0.15)',
  accentGlow: '0 0 24px rgba(233,53,199,0.45)',
  violet:     '#8b5cf6',
  cyan:       '#22d3ee',
  gold:       '#fbbf24',
  greenLive:  '#22c55e',
  red:        '#ef4444',
  textMain:   '#f0f2f7',
  textSub:    '#d8b4fe',
  textMuted:  '#9f7aea',
  textAccent: '#f5d0fe',
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
  { name: 'Coffee Table',     icon: '☕', thumbnail: coffeeTableImg,    desc: 'LACK – Round coffee table',            model: true, category: 'Tables',   material: 'Wood',    color: 'Brown',  price: 49.99  },
  { name: 'Chair',            icon: '💺', thumbnail: chairImg,          desc: 'TEODORES – Monobloc chair',            model: true, category: 'Seating',  material: 'Plastic', color: 'White',  price: 29.99  },
  { name: 'Drawer',           icon: '🗄️', thumbnail: drawerImg,         desc: 'HEMNES – Vintage wooden drawer',       model: true, category: 'Storage',  material: 'Wood',    color: 'Walnut', price: 149.99 },
  { name: 'TV Stand',         icon: '📺', thumbnail: tvStandImg,        desc: 'Modern TV entertainment center',        model: true, category: 'Living',   material: 'Wood',    color: 'Black',  price: 199.99 },
  { name: 'TV Stand 3',       icon: '🖥️', thumbnail: tvStand3Img,       desc: 'Sleek TV stand with shelf',             model: true, category: 'Living',   material: 'Wood',    color: 'Walnut', price: 149.99 },
  { name: 'File Cabinet',     icon: '🗂️', thumbnail: fileCabinetImg,    desc: 'Office file cabinet – 3 drawers',      model: true, category: 'Storage',  material: 'Metal',   color: 'Grey',   price: 89.99  },
  { name: 'Computer Chair',   icon: '🪑', thumbnail: computerChairImg,   desc: 'Mesh back ergonomic office chair',     model: true, category: 'Seating',  material: 'Fabric',  color: 'Black',  price: 129.99 },
  { name: 'Lounge Chair',     icon: '🛋️', thumbnail:loungechairimg,      desc: 'Luxury lounge chair',                   model: true, category: 'Seating',  material: 'Leather', color: 'Brown',  price: 349.99 },
  { name: 'Dining Table',     icon: '🍽️', thumbnail:diningtableimg,     desc: 'Extendable dining table',               model: true, category: 'Dining',   material: 'Wood',    color: 'Oak',    price: 299.99 },
  { name: 'Dining Set',       icon: '🍴', thumbnail:diningsetimg,       desc: 'Modern dining room table set',          model: true, category: 'Dining',   material: 'Wood',    color: 'Dark',   price: 699.99 },
  { name: 'Computer Table',   icon: '💻', thumbnail:computertableimg,    desc: 'Office computer desk',                  model: true, category: 'Tables',   material: 'Wood',    color: 'White',  price: 199.99 },
  { name: 'Table',            icon: '🍽️', thumbnail:tableimg,            desc: 'Simple dining table',                   model: true, category: 'Tables',   material: 'Wood',    color: 'Natural',price: 129.99 },
  { name: 'Industrial Table', icon: '🔧', thumbnail:intableimg,          desc: 'Modern industrial style table',         model: true, category: 'Tables',   material: 'Metal',   color: 'Black',  price: 249.99 },
  { name: 'Modern Sofa',      icon: '🛋️', thumbnail: modernSofaImg,     desc: 'KIVIK – Modern 3-seat sofa',           model: true, category: 'Living',   material: 'Fabric',  color: 'Gray',   price: 699.99 },
  { name: 'Sofa',             icon: '🛋️', thumbnail: sofaImg,           desc: 'Classic 3-seat sofa',                   model: true, category: 'Living',   material: 'Fabric',  color: 'Navy',   price: 599.99 },
  { name: 'Sofa Chair',       icon: '🪑', thumbnail:sofachairimg,        desc: 'Single-seat sofa chair',                model: true, category: 'Living',   material: 'Fabric',  color: 'Beige',  price: 299.99 },
  { name: 'Bed',              icon: '🛏️', thumbnail: bedImg,            desc: 'MALM – Queen size bed frame',          model: true, category: 'Bedroom',  material: 'Wood',    color: 'White',  price: 399.99 },
  { name: 'Poliform Bed',     icon: '🛌', thumbnail: poliformBedImg,    desc: 'Designer platform bed',                 model: true, category: 'Bedroom',  material: 'Wood',    color: 'Dark',   price: 899.99 },
  { name: 'Desk Lamp',        icon: '💡', thumbnail: deskLampimg,       desc: 'HEKTAR – Adjustable desk lamp (place on surfaces)',        model: true, category: 'Lighting', material: 'Metal',   color: 'Black',  price: 69.99  },
  { name: 'Floor Lamp',       icon: '🏮', thumbnail: floorLampimg,        desc: 'Modern floor lamp',                     model: true, category: 'Lighting', material: 'Metal',   color: 'White',  price: 89.99  },
  { name: 'Eric Floor Lamp',  icon: '💡', thumbnail: ericlampimg,        desc: 'Designer white floor lamp',             model: true, category: 'Lighting', material: 'Metal',   color: 'White',  price: 159.99 },

  /* ── NEW BATHROOM FURNITURE ── */
  { name: 'Bathroom Asset 1',  icon: '🚿', thumbnail: bathroomAsset1Img,  desc: 'Complete bathroom set',                 model: true, category: 'Bathroom', material: 'Ceramic', color: 'White',  price: 1299.99 },
  { name: 'Bathroom Closet',   icon: '🚪', thumbnail: bathroomclosetimg,  desc: 'Bathroom storage closet',               model: true, category: 'Bathroom', material: 'Wood',    color: 'White',  price: 299.99 },
  { name: 'Bathtub',           icon: '🛁', thumbnail: bathtubimg,         desc: 'Modern bathtub',                        model: true, category: 'Bathroom', material: 'Ceramic', color: 'White',  price: 799.99 },
  { name: 'Bathtub 2',         icon: '🛁', thumbnail: bathtub1img,       desc: 'Designer bathtub',                      model: true, category: 'Bathroom', material: 'Ceramic', color: 'White',  price: 899.99 },
  { name: 'Sink & Vanity',     icon: '🚰', thumbnail: sinkVanityimg,      desc: 'Bathroom sink with vanity',             model: true, category: 'Bathroom', material: 'Ceramic', color: 'White',  price: 599.99 },
  { name: 'Sink with Faucet',  icon: '🚿', thumbnail: sinkimg,             desc: 'Modern sink with faucet',               model: true, category: 'Bathroom', material: 'Ceramic', color: 'White',  price: 399.99 },
  { name: 'Toilet',            icon: '🚽', thumbnail: toiletimg,             desc: 'Modern toilet',                         model: true, category: 'Bathroom', material: 'Ceramic', color: 'White',  price: 299.99 },
  { name: 'Toilet Vaa',        icon: '🚽', thumbnail: toilet1img,                   desc: 'Designer toilet VAA model',             model: true, category: 'Bathroom', material: 'Ceramic', color: 'White',  price: 399.99 },

  /* ── NEW BEDROOM FURNITURE ── */
  { name: 'Bed Agape',         icon: '🛏️', thumbnail: bedAgapeImg,         desc: 'Agape designer bed',                    model: true, category: 'Bedroom',  material: 'Wood',    color: 'Dark',   price: 1199.99 },

  /* ── NEW CABINET/STORAGE FURNITURE ── */
  { name: 'Chocolate Bookshelf', icon: '📚', thumbnail: chocolateBookshelfImg, desc: 'Chocolate beech bookshelf',        model: true, category: 'Storage',  material: 'Wood',    color: 'Brown',  price: 249.99 },
  { name: 'Modern Wardrobe',   icon: '🚪',   thumbnail: wardrobe1img,                            desc: 'Modern wooden wardrobe',                model: true, category: 'Bedroom',  material: 'Wood',    color: 'Dark',   price: 699.99 },
  { name: 'Wardrobe',          icon: '👔',   thumbnail: warbod1img,                            desc: 'Classic wardrobe',                      model: true, category: 'Bedroom',  material: 'Wood',    color: 'White',  price: 599.99 },
  { name: 'Wardrobe 2',        icon: '👗',   thumbnail: warbod12,                 desc: 'Double door wardrobe',                  model: true, category: 'Bedroom',  material: 'Wood',    color: 'Oak',    price: 749.99 },
  { name: 'Banheira Maestri',  icon: '🛁',   thumbnail:bathtub3img,        desc: 'Maestri luxury bathtub',                model: true, category: 'Bathroom', material: 'Ceramic', color: 'White',  price: 1499.99 },

  /* ── NEW KITCHEN FURNITURE ── */
  { name: 'European Cabinet',  icon: '🍽️',   thumbnail:cabnetnew,                           desc: 'European style dining cabinet',         model: true, category: 'Kitchen',  material: 'Wood',    color: 'Dark',   price: 899.99 },
  { name: 'Kitchen',           icon: '🍳',   thumbnail:newkichen,                  desc: 'Complete kitchen set',                  model: true, category: 'Kitchen',  material: 'Wood',    color: 'White',  price: 2999.99 },
  { name: 'Kitchen Cabinet 1', icon: '🗄️',   thumbnail:countertop,                 desc: 'Kitchen wall cabinet',                  model: true, category: 'Kitchen',  material: 'Wood',    color: 'White',  price: 199.99 },
  { name: 'Modern Fridge',     icon: '❄️',   thumbnail:fridge,                            desc: 'Modern refrigerator',                   model: true, category: 'Kitchen',  material: 'Metal',   color: 'Silver', price: 1299.99 },
  { name: 'Small Kitchen',     icon: '🏠',   thumbnail:kitchenwithoven,                  desc: 'Compact kitchen with oven',             model: true, category: 'Kitchen',  material: 'Wood',    color: 'White',  price: 1999.99 },

  /* ── NEW SEATING FURNITURE ── */
  { name: 'Couch Complete',    icon: '🛋️', thumbnail: couchCompleteImg,    desc: 'Complete couch set with cushions',      model: true, category: 'Living',   material: 'Fabric',  color: 'Beige',  price: 1299.99 },
  { name: 'Dining Chair',      icon: '🪑', thumbnail: diningchairimg,         desc: 'Modern dining chair',                   model: true, category: 'Dining',   material: 'Wood',    color: 'Natural',price: 89.99  },
  { name: 'Outdoor Sofa',      icon: '🏖️', thumbnail: outdoorssofaImg,                            desc: 'Weather-resistant outdoor sofa',        model: true, category: 'Outdoor',  material: 'Fabric',  color: 'Gray',   price: 899.99 },
  // { name: 'Bookshelf',        icon: '📚',                               desc: 'BILLY – Bookcase collection',           model: false, category: 'Storage', material: 'Wood',    color: 'White',  price: 119.99 },
  // { name: 'Nightstand',       icon: '🕯️',                              desc: 'HEMNES – Nightstand 2 drawers',        model: false, category: 'Bedroom', material: 'Wood',    color: 'Walnut', price: 89.99  },
  // { name: 'Wardrobe',         icon: '🚪',                               desc: 'PAX – Wardrobe combination',           model: false, category: 'Bedroom', material: 'Wood',    color: 'White',  price: 499.99 },
  // { name: 'Table Lamp',       icon: '🔦',                               desc: 'FADO – Table lamp',                     model: false, category: 'Lighting', material: 'Glass',  color: 'White',  price: 39.99  },
  // { name: 'Rug',              icon: '🟫',                               desc: 'ÅDUM – High pile rug',                 model: false, category: 'Living',  material: 'Fabric',  color: 'Beige',  price: 149.99 },
];

const ITEM_PRICES = FURNITURE_ITEMS.reduce((acc, f) => ({ ...acc, [f.name]: f.price }), {
  Table: 89.99, Cabinet: 79.99,
});

const CATEGORIES = ['Tables', 'Seating', 'Storage', 'Living', 'Lighting', 'Dining', 'Bedroom', 'Bathroom', 'Kitchen', 'Outdoor'];
const MATERIALS  = ['All', 'Wood', 'Plastic', 'Metal', 'Fabric', 'Leather', 'Glass', 'Ceramic'];

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
  { id: 'cut',       label: 'Cut',
    svg: <svg viewBox="0 0 30 28" fill="currentColor"><path d="M2 2h18l8 8v16H2Z" opacity="0.25"/><path d="M2 2h18l8 8v16H2Z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>},
  { id: 'rounded',   label: 'Round',
    svg: <svg viewBox="0 0 30 28" fill="currentColor"><path d="M2 26V12a13 13 0 1 1 26 0v14Z" opacity="0.25"/><path d="M2 26V12a13 13 0 1 1 26 0v14Z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>},
  { id: 'u-shape',   label: 'U-Shape',
    svg: <svg viewBox="0 0 30 28" fill="currentColor"><path d="M2 2h8v18h10V2h8v24H2Z" opacity="0.25"/><path d="M2 2h8v18h10V2h8v24H2Z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>},
  { id: 'z-shape',   label: 'Z-Shape',
    svg: <svg viewBox="0 0 30 28" fill="currentColor"><path d="M2 2h14v8h12v16H14v-8H2Z" opacity="0.25"/><path d="M2 2h14v8h12v16H14v-8H2Z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>},
  { id: 'custom',    label: 'Custom',
    svg: <svg viewBox="0 0 30 28" fill="currentColor"><path d="M4 3v22h10" opacity="0.25"/><path d="M4 3v22h10" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M18 10l8 8M26 10l-8 8" stroke="currentColor" strokeWidth="2" fill="none"/></svg>},
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

const SbSearchSelect = ({ value, onChange, options, placeholder }) => {
  const listId = useId();
  const normalizedOptions = useMemo(
    () => options.map(o => ({ value: String(o.value ?? o), label: String(o.label ?? o) })),
    [options]
  );

  const selectedLabel = useMemo(() => {
    const selected = normalizedOptions.find(o => o.value === String(value));
    return selected ? selected.label : '';
  }, [normalizedOptions, value]);

  const [inputValue, setInputValue] = useState(selectedLabel);

  useEffect(() => {
    setInputValue(selectedLabel);
  }, [selectedLabel]);

  const commitValue = (raw) => {
    const normalizedRaw = String(raw || '').trim().toLowerCase();
    const match = normalizedOptions.find(
      o => o.label.toLowerCase() === normalizedRaw || o.value.toLowerCase() === normalizedRaw
    );

    if (match) {
      setInputValue(match.label);
      onChange(match.value);
      return;
    }

    if (!normalizedRaw) {
      const fallback = normalizedOptions[0];
      if (fallback) {
        setInputValue(fallback.label);
        onChange(fallback.value);
      }
      return;
    }

    setInputValue(selectedLabel);
  };

  return (
    <>
      <input
        type="text"
        list={listId}
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => {
          const next = e.target.value;
          setInputValue(next);
          const exactMatch = normalizedOptions.find(o => o.label.toLowerCase() === next.trim().toLowerCase());
          if (exactMatch) onChange(exactMatch.value);
        }}
        onBlur={(e) => commitValue(e.target.value)}
        style={{ width:'100%', padding:'8px 10px', background:'rgba(255,255,255,0.04)', border:`1px solid ${C.border}`, borderRadius:8, color:C.textSub, fontSize:'0.75rem', fontFamily:'inherit', outline:'none', transition:C.tr, boxSizing:'border-box' }}
      />
      <datalist id={listId}>
        {normalizedOptions.map(o => (
          <option key={o.value} value={o.label} />
        ))}
      </datalist>
    </>
  );
};

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
  const [catFilter, setCatFilter] = useState('');
  const [matFilter, setMatFilter] = useState('All');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [modelFilter, setModelFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [hovered, setHovered] = useState(null);
  const quickCategories = useMemo(() => ['All', 'Living', 'Bedroom', 'Dining', 'Storage', 'Lighting'], []);

  const categoryOptions = useMemo(() => CATEGORIES, []);
  const materialOptions = useMemo(() => MATERIALS, []);

  const filtered = useMemo(() => {
    let r = FURNITURE_ITEMS;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      r = r.filter(f => `${f.name} ${f.desc} ${f.category} ${f.material}`.toLowerCase().includes(q));
    }
    if (catFilter) r = r.filter(f => f.category === catFilter);
    if (matFilter !== 'All') r = r.filter(f => f.material === matFilter);

    if (modelFilter === '3d') r = r.filter(f => !!f.model);
    if (modelFilter === 'no-3d') r = r.filter(f => !f.model);

    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (minPrice !== '' && !Number.isNaN(min)) r = r.filter(f => Number(f.price) >= min);
    if (maxPrice !== '' && !Number.isNaN(max)) r = r.filter(f => Number(f.price) <= max);

    if (colorFilter) {
      const c = colorFilter.toLowerCase();
      r = r.filter(f => (f.color || '').toLowerCase().includes(c));
    }

    if (sortBy === 'price-asc') r = [...r].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') r = [...r].sort((a, b) => b.price - a.price);
    if (sortBy === 'name-asc') r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'name-desc') r = [...r].sort((a, b) => b.name.localeCompare(a.name));

    return r;
  }, [searchQuery, catFilter, matFilter, modelFilter, minPrice, maxPrice, colorFilter, sortBy]);

  const hasActiveAdvanced = modelFilter !== 'all' || colorFilter || minPrice !== '' || maxPrice !== '' || sortBy !== 'relevance';
  const hasAnyFilter = Boolean(searchQuery || catFilter || matFilter !== 'All' || hasActiveAdvanced);

  const clearAllFilters = () => {
    setSearchQuery('');
    setCatFilter('');
    setMatFilter('All');
    setModelFilter('all');
    setColorFilter('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('relevance');
  };

  return (
    <div className="sb-fade" style={{ paddingBottom:8 }}>
      <div style={{ position:'sticky', top:-14, zIndex:20, margin:'-2px -2px 12px', padding:'2px 2px 10px', background:'linear-gradient(180deg, rgba(6,7,15,0.98) 0%, rgba(6,7,15,0.9) 85%, rgba(6,7,15,0) 100%)', backdropFilter:'blur(8px)' }}>
        {/* Search + Filter toggle */}
        <div style={{ display:'flex', gap:8, alignItems:'stretch', marginBottom:10 }}>
          <div style={{ position:'relative', flex:1 }}>
            <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:C.textMuted, display:'flex', pointerEvents:'none' }}>
              <Ico size={14} sw={2}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Ico>
            </span>
            <input
              type="text" value={searchQuery} placeholder="Search furniture..."
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

          <button
            type="button"
            onClick={() => setShowAdvanced(v => !v)}
            style={{ minWidth:88, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, padding:'8px 10px', borderRadius:10, border:`1px solid ${showAdvanced ? 'rgba(99,102,241,0.45)' : C.borderSoft}`, background:showAdvanced ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)', color:showAdvanced ? '#c7d2fe' : C.textSub, fontSize:'0.72rem', fontWeight:700, fontFamily:'inherit', cursor:'pointer', transition:C.tr }}
          >
            <span>Filter</span>
            <span>{showAdvanced ? '−' : '+'}</span>
          </button>
        </div>

        {/* Quick category chips */}
        <div className="sb-chip-row" style={{ marginBottom:10 }}>
          {quickCategories.map(cat => {
            const isAll = cat === 'All';
            const active = isAll ? catFilter === '' : catFilter === cat;
            return (
              <Chip
                key={cat}
                active={active}
                onClick={() => setCatFilter(isAll ? '' : cat)}
              >
                {cat}
              </Chip>
            );
          })}
        </div>

        {/* Advanced filtering */}
        <div style={{ marginBottom:10 }}>
          {showAdvanced && (
            <div style={{ padding:'10px', borderRadius:10, border:`1px solid ${C.borderSoft}`, background:'rgba(255,255,255,0.02)', display:'grid', gap:8 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <div>
                  <Label style={{ marginBottom:4 }}>Min Price</Label>
                  <NumInput value={minPrice} min={0} step={1} onChange={v => setMinPrice(Number.isNaN(v) ? '' : v)} prefix="$" />
                </div>
                <div>
                  <Label style={{ marginBottom:4 }}>Max Price</Label>
                  <NumInput value={maxPrice} min={0} step={1} onChange={v => setMaxPrice(Number.isNaN(v) ? '' : v)} prefix="$" />
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <div>
                  <Label style={{ marginBottom:4 }}>Model Type</Label>
                  <SbSelect
                    value={modelFilter}
                    onChange={setModelFilter}
                    options={[
                      { value:'all', label:'All items' },
                      { value:'3d', label:'3D only' },
                      { value:'no-3d', label:'Non-3D only' },
                    ]}
                  />
                </div>
                <div>
                  <Label style={{ marginBottom:4 }}>Sort By</Label>
                  <SbSelect
                    value={sortBy}
                    onChange={setSortBy}
                    options={[
                      { value:'relevance', label:'Relevance' },
                      { value:'price-asc', label:'Price: Low to High' },
                      { value:'price-desc', label:'Price: High to Low' },
                      { value:'name-asc', label:'Name: A to Z' },
                      { value:'name-desc', label:'Name: Z to A' },
                    ]}
                  />
                </div>
              </div>

              <div>
                <Label style={{ marginBottom:4 }}>Color Keyword</Label>
                <input
                  type="text"
                  value={colorFilter}
                  onChange={e => setColorFilter(e.target.value)}
                  placeholder="e.g. white, brown"
                  style={{ width:'100%', padding:'8px 10px', background:'rgba(255,255,255,0.04)', border:`1px solid ${C.border}`, borderRadius:8, color:C.textMain, fontSize:'0.75rem', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
                />
              </div>

              <button
                type="button"
                onClick={clearAllFilters}
                style={{ marginTop:2, width:'100%', padding:'8px 10px', borderRadius:8, border:`1px solid ${C.border}`, background:'rgba(239,68,68,0.09)', color:'#fca5a5', fontSize:'0.72rem', fontWeight:700, fontFamily:'inherit', cursor:'pointer' }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Category + Material dropdown filters */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <div style={{ minWidth:0 }}>
            <Label style={{ marginBottom:5 }}>Category</Label>
            <SbSearchSelect
              value={catFilter}
              onChange={setCatFilter}
              options={[{ value:'', label:'All categories' }, ...categoryOptions.map(c => ({ value:c, label:c }))]}
              placeholder="Select category"
            />
          </div>

          <div style={{ minWidth:0 }}>
            <Label style={{ marginBottom:5 }}>Material</Label>
            <SbSearchSelect
              value={matFilter}
              onChange={setMatFilter}
              options={materialOptions.map(m => ({ value:m, label:m }))}
              placeholder="Select material"
            />
          </div>
        </div>
      </div>

      {hasAnyFilter && (
        <div style={{ marginBottom:10, display:'flex', gap:6, flexWrap:'wrap' }}>
          {searchQuery && <span style={{ fontSize:'0.58rem', fontWeight:700, color:C.textAccent, background:'rgba(99,102,241,0.16)', borderRadius:999, padding:'3px 8px' }}>Search: {searchQuery}</span>}
          {catFilter && <span style={{ fontSize:'0.58rem', fontWeight:700, color:C.textAccent, background:'rgba(99,102,241,0.16)', borderRadius:999, padding:'3px 8px' }}>Category: {catFilter}</span>}
          {matFilter !== 'All' && <span style={{ fontSize:'0.58rem', fontWeight:700, color:C.textAccent, background:'rgba(99,102,241,0.16)', borderRadius:999, padding:'3px 8px' }}>Material: {matFilter}</span>}
          {modelFilter !== 'all' && <span style={{ fontSize:'0.58rem', fontWeight:700, color:C.textAccent, background:'rgba(99,102,241,0.16)', borderRadius:999, padding:'3px 8px' }}>{modelFilter === '3d' ? '3D only' : 'Non-3D only'}</span>}
        </div>
      )}

      {/* Result count */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
        <span style={{ fontSize:'0.63rem', color:C.textMuted, fontWeight:500 }}>
          {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          {hasAnyFilter && (
            <button
              onClick={clearAllFilters}
              style={{ border:`1px solid ${C.borderSoft}`, background:'rgba(255,255,255,0.03)', color:C.textMuted, borderRadius:99, padding:'2px 8px', fontSize:'0.58rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}
            >
              Clear
            </button>
          )}
          {items.length > 0 && (
            <span style={{ fontSize:'0.63rem', color:C.textAccent, fontWeight:600, background:C.accentDim, padding:'2px 9px', borderRadius:99 }}>
              {items.length} on canvas
            </span>
          )}
        </div>
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
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); addItem(f.name); }}
                    style={{ marginTop:7, width:'100%', padding:'6px 8px', borderRadius:8, border:`1px solid rgba(99,102,241,0.35)`, background:'rgba(99,102,241,0.12)', color:'#c7d2fe', fontSize:'0.66rem', fontWeight:700, fontFamily:'inherit', cursor:'pointer' }}
                  >
                    Add to canvas
                  </button>
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
  const fmtPrice = Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const roundAxis = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? Number(n.toFixed(2)) : 0;
  };
  const cardStyle = {
    background: 'linear-gradient(180deg, rgba(233,53,199,0.06) 0%, rgba(139,92,246,0.03) 100%)',
    borderRadius: 14,
    border: `1px solid ${C.borderSoft}`,
    overflow: 'hidden',
    marginBottom: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
  };

  return (
    <div className="sb-fade">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 14px', background:'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(233,53,199,0.05))', borderRadius:12, border:`1px solid ${C.borderSoft}`, marginBottom:14, boxShadow:'0 8px 20px rgba(0,0,0,0.16)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:44, height:44, borderRadius:11, background:C.accentDim, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0, overflow:'hidden', border:'1px solid rgba(255,255,255,0.18)' }}>
            {catalogItem.thumbnail ? (
              <img src={catalogItem.thumbnail} alt={selectedItem.type} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            ) : (
              <span>{catalogItem.icon || '🪑'}</span>
            )}
          </div>
          <div>
            <div style={{ fontSize:'1rem', fontWeight:800, color:C.textMain, letterSpacing:'-0.01em' }}>{selectedItem.type}</div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
              <span style={{ fontSize:'0.63rem', color:C.textMuted, fontFamily:C.mono }}>#{String(selectedItem.id).slice(-6)}</span>
              {price > 0 && <span style={{ fontSize:'0.62rem', fontWeight:700, color:C.gold }}>${fmtPrice}</span>}
            </div>
          </div>
        </div>
        <button onClick={() => setShowConfirm(true)}
          style={{ width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, color:C.red, cursor:'pointer', transition:C.tr }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor='rgba(239,68,68,0.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.07)'; e.currentTarget.style.borderColor='rgba(239,68,68,0.15)'; }}>
          <Ico size={15} sw={2}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/></Ico>
        </button>
      </div>

      {/* Price tag */}
      {price > 0 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 14px', background:'linear-gradient(135deg,rgba(251,191,36,0.11),rgba(245,158,11,0.04))', borderRadius:12, border:'1px solid rgba(251,191,36,0.28)', marginBottom:14, boxShadow:'0 6px 18px rgba(245,158,11,0.12)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, color:C.gold }}>
            <Ico size={14} sw={2}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></Ico>
            <span style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>Catalog Price</span>
          </div>
          <span style={{ fontSize:'1.15rem', fontWeight:800, color:C.gold, fontFamily:C.mono, fontVariantNumeric:'tabular-nums', textShadow:'0 0 14px rgba(251,191,36,0.25)' }}>${fmtPrice}</span>
        </div>
      )}

      {/* Material meta */}
      {(catalogItem.material || catalogItem.color) && (
        <div style={{ display:'flex', gap:7, flexWrap:'wrap', padding:'8px 12px', background:'rgba(255,255,255,0.02)', borderRadius:10, border:`1px solid ${C.borderSoft}`, marginBottom:14 }}>
          {catalogItem.material && <span style={{ fontSize:'0.66rem', color:C.textAccent, fontWeight:700, background:'rgba(99,102,241,0.14)', borderRadius:999, padding:'3px 8px' }}>⬡ {catalogItem.material}</span>}
          {catalogItem.color && <span style={{ fontSize:'0.66rem', color:C.textMuted, fontWeight:700, background:'rgba(255,255,255,0.04)', borderRadius:999, padding:'3px 8px' }}>🎨 {catalogItem.color}</span>}
        </div>
      )}

      {/* Color section */}
      <div style={cardStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', borderBottom:`1px solid ${C.borderSoft}` }}>
          <span style={{ color:C.textMuted, display:'flex' }}><Ico size={13} sw={2}><circle cx="13.5" cy="6.5" r="0.5"/><circle cx="17.5" cy="10.5" r="0.5"/><circle cx="8.5" cy="7.5" r="0.5"/><circle cx="6.5" cy="12.5" r="0.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.17-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></Ico></span>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:C.textSub, textTransform:'uppercase', letterSpacing:'0.4px' }}>Material Color</span>
        </div>
        <div style={{ padding:'11px 12px' }}>
          {/* Swatches */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:10 }}>
            {COLOR_SWATCHES.map(sw => (
              <button key={sw} onClick={() => updateItem(selectedId, { color: sw })}
                title={sw}
                style={{ width:27, height:27, borderRadius:8, background:sw, border: selectedItem.color === sw ? '2px solid rgba(255,255,255,0.95)' : '2px solid transparent', cursor:'pointer', transition:C.tr, flexShrink:0, boxShadow: selectedItem.color === sw ? `0 0 14px ${sw}` : '0 2px 8px rgba(0,0,0,0.22)' }} />
            ))}
          </div>
          {/* Native color picker */}
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <input type="color" value={selectedItem.color || '#888888'}
              onChange={e => updateItem(selectedId, { color: e.target.value })}
              style={{ width:34, height:34, borderRadius:9, border:'1px solid rgba(255,255,255,0.18)', cursor:'pointer', background:'transparent', flexShrink:0 }} />
            <span style={{ fontSize:'0.74rem', color:C.textMuted, fontFamily:C.mono }}>{selectedItem.color || '#888888'}</span>
          </div>
        </div>
      </div>

      {/* Position */}
      <div style={cardStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', borderBottom:`1px solid ${C.borderSoft}` }}>
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
                  <NumInput value={pos[i]} step={0.01}
                    onChange={v => { const p=[...pos]; p[i]=roundAxis(v); updateItem(selectedId,{position:p}); }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rotation */}
      <div style={cardStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', borderBottom:`1px solid ${C.borderSoft}` }}>
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
      <div style={cardStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', borderBottom:`1px solid ${C.borderSoft}` }}>
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
      <div style={cardStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', borderBottom:`1px solid ${C.borderSoft}` }}>
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

  const roomCard = {
    background: 'linear-gradient(180deg, rgba(233,53,199,0.06) 0%, rgba(139,92,246,0.03) 100%)',
    border: `1px solid ${C.borderSoft}`,
    borderRadius: 14,
    padding: 12,
    marginBottom: 18,
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  };

  const floorGridEnabled = roomConfig.showFloorGrid ?? true;

  return (
    <div className="sb-fade">
      {/* Room shape */}
      <SectionDivider title="Room Shape" />
      <div style={roomCard}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
          {ROOM_SHAPES.map(s => {
            const active = roomConfig.shape === s.id;
            return (
              <button key={s.id} onClick={() => updateRoom('shape', s.id)}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, padding:'12px 6px', borderRadius:12, border:`1.5px solid ${active ? 'rgba(99,102,241,0.55)' : C.border}`, background: active ? C.accentDim : 'rgba(255,255,255,0.02)', color: active ? C.accent : C.textMuted, cursor:'pointer', transition:C.tr, fontFamily:'inherit', boxShadow: active ? C.accentGlow : 'none', position:'relative' }}>
                <span style={{ width:28 }}>{s.svg}</span>
                <span style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.2px' }}>{s.label}</span>
                {active && <span style={{ position:'absolute', top:6, right:6, width:7, height:7, borderRadius:'50%', background:C.accent, boxShadow:`0 0 8px ${C.accent}` }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dimensions */}
      <SectionDivider title="Dimensions" />
      <div style={roomCard}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginBottom:10 }}>
          <span style={{ fontSize:'0.63rem', color:C.textMuted }}>Quick presets</span>
          <div className="sb-chip-row" style={{ gap:5 }}>
            {[10, 12, 15, 20].map(size => (
              <Chip key={size} active={roomConfig.width === size && roomConfig.depth === size} onClick={() => { updateRoom('width', size); updateRoom('depth', size); }}>
                {size}m x {size}m
              </Chip>
            ))}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <div>
            <Label>Width (m)</Label>
            <NumInput value={roomConfig.width} min={3} max={50} step={0.5} onChange={v => updateRoom('width', v)} />
          </div>
          <div>
            <Label>Depth (m)</Label>
            <NumInput value={roomConfig.depth} min={3} max={50} step={0.5} onChange={v => updateRoom('depth', v)} />
          </div>
        </div>
      </div>

      {/* Colors */}
      <SectionDivider title="Materials & Colors" />
      <div style={roomCard}>
        {/* Wall color */}
        <div style={{ marginBottom:14 }}>
          <Label>Wall Color</Label>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
            {WALL_PRESETS.map(c => (
              <button key={c} onClick={() => updateRoom('wallColor', c)}
                style={{ width:27, height:27, borderRadius:8, background:c, border: roomConfig.wallColor === c ? '2px solid white' : '2px solid transparent', cursor:'pointer', flexShrink:0, transition:C.tr, boxShadow: roomConfig.wallColor === c ? `0 0 10px ${c}aa` : '0 2px 8px rgba(0,0,0,0.25)' }} />
            ))}
            <input type="color" value={roomConfig.wallColor}
              onChange={e => updateRoom('wallColor', e.target.value)}
              style={{ width:27, height:27, borderRadius:8, border:'1px solid rgba(255,255,255,0.2)', cursor:'pointer', background:'transparent', padding:0 }} />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:36, height:24, borderRadius:7, background:roomConfig.wallColor, border:`1px solid ${C.border}` }} />
            <span style={{ fontSize:'0.7rem', color:C.textMuted, fontFamily:C.mono }}>{roomConfig.wallColor}</span>
          </div>
        </div>

        {/* Floor color */}
        <div>
          <Label>Floor Color</Label>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
            {FLOOR_PRESETS.map(c => (
              <button key={c} onClick={() => updateRoom('floorColor', c)}
                style={{ width:27, height:27, borderRadius:8, background:c, border: roomConfig.floorColor === c ? '2px solid white' : '2px solid transparent', cursor:'pointer', flexShrink:0, transition:C.tr, boxShadow: roomConfig.floorColor === c ? `0 0 10px ${c}aa` : '0 2px 8px rgba(0,0,0,0.25)' }} />
            ))}
            <input type="color" value={roomConfig.floorColor}
              onChange={e => updateRoom('floorColor', e.target.value)}
              style={{ width:27, height:27, borderRadius:8, border:'1px solid rgba(255,255,255,0.2)', cursor:'pointer', background:'transparent', padding:0 }} />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:36, height:24, borderRadius:7, background:roomConfig.floorColor, border:`1px solid ${C.border}` }} />
            <span style={{ fontSize:'0.7rem', color:C.textMuted, fontFamily:C.mono }}>{roomConfig.floorColor}</span>
          </div>
        </div>
      </div>

      {/* Floor type */}
      <SectionDivider title="Floor Texture" />
      <div style={roomCard}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:7 }}>
          {FLOOR_TYPES.map(f => {
            const active = roomConfig.floorType === f.id;
            return (
              <button key={f.id} onClick={() => updateRoom('floorType', f.id)}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'10px 4px', borderRadius:11, border:`1.5px solid ${active ? 'rgba(99,102,241,0.5)' : C.border}`, background: active ? C.accentDim : 'rgba(255,255,255,0.02)', color: active ? C.accent : C.textMuted, cursor:'pointer', transition:C.tr, fontFamily:'inherit', boxShadow: active ? C.accentGlow : 'none' }}>
                <span style={{ fontSize:'1rem' }}>{f.emoji}</span>
                <span style={{ fontSize:'0.56rem', fontWeight:700, letterSpacing:'0.2px' }}>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floor grid */}
      <SectionDivider title="Floor Grid" />
      <div style={roomCard}>
        <button
          onClick={() => updateRoom('showFloorGrid', !floorGridEnabled)}
          style={{
            width:'100%',
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between',
            padding:'10px 12px',
            borderRadius:11,
            border:`1.5px solid ${floorGridEnabled ? 'rgba(99,102,241,0.5)' : C.border}`,
            background: floorGridEnabled ? C.accentDim : 'rgba(255,255,255,0.02)',
            color: floorGridEnabled ? C.accent : C.textMuted,
            cursor:'pointer',
            transition:C.tr,
            fontFamily:'inherit',
            boxShadow: floorGridEnabled ? C.accentGlow : 'none'
          }}
        >
          <span style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.3px' }}>Show floor grid</span>
          <span style={{ width:46, height:24, borderRadius:99, background: floorGridEnabled ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', position:'relative', transition:C.tr, display:'inline-block' }}>
            <span style={{ position:'absolute', top:2, left: floorGridEnabled ? 24 : 2, width:18, height:18, borderRadius:'50%', background:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.25)', transition:C.tr }} />
          </span>
        </button>
      </div>

      {/* Windows */}
      <SectionDivider title="Windows" badge={windows.length} />
      <div style={roomCard}>
        <div style={{ fontSize:'0.66rem', color:C.textMuted, marginBottom:10 }}>Add a window to any wall, then fine-tune its style and position below.</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
          {WALLS.map(w => {
            const cnt = windows.filter(win => win.wall === w.id).length;
            return (
              <button key={w.id} onClick={() => addWindow(w.id)}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'11px 8px', borderRadius:11, border:`1.5px dashed ${w.color}40`, background:`${w.color}08`, color:w.color, cursor:'pointer', transition:C.tr, fontFamily:'inherit', fontSize:'0.72rem', fontWeight:700, position:'relative' }}
                onMouseEnter={e => { e.currentTarget.style.background=`${w.color}15`; e.currentTarget.style.borderColor=`${w.color}70`; }}
                onMouseLeave={e => { e.currentTarget.style.background=`${w.color}08`; e.currentTarget.style.borderColor=`${w.color}40`; }}>
                <Ico size={14} sw={1.5}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></Ico>
                + {w.label}
                {cnt > 0 && <span style={{ position:'absolute', top:4, right:4, fontSize:'0.5rem', fontWeight:800, background:w.color, color:'#000', padding:'1px 5px', borderRadius:99 }}>{cnt}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {windows.length === 0 && (
        <div style={{ marginBottom:12, borderRadius:11, border:`1px dashed ${C.border}`, background:'rgba(255,255,255,0.02)', padding:'10px 12px', fontSize:'0.68rem', color:C.textMuted }}>
          No windows added yet.
        </div>
      )}

      {windows.map(win => (
        <div key={win.id} style={{ marginBottom:10, borderRadius:12, border:'1px solid rgba(96,165,250,0.2)', background:'linear-gradient(180deg, rgba(96,165,250,0.09), rgba(96,165,250,0.03))', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 10px', borderBottom:'1px solid rgba(96,165,250,0.1)' }}>
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
      <div style={roomCard}>
        <div style={{ fontSize:'0.66rem', color:C.textMuted, marginBottom:10 }}>Place doors by wall and adjust size/position for accurate layout plans.</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
          {WALLS.map(w => {
            const cnt = doors.filter(d => d.wall === w.id).length;
            return (
              <button key={w.id} onClick={() => addDoor(w.id)}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'11px 8px', borderRadius:11, border:'1.5px dashed rgba(245,158,11,0.3)', background:'rgba(245,158,11,0.05)', color:'#f59e0b', cursor:'pointer', transition:C.tr, fontFamily:'inherit', fontSize:'0.72rem', fontWeight:700, position:'relative' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(245,158,11,0.12)'; e.currentTarget.style.borderColor='rgba(245,158,11,0.55)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(245,158,11,0.05)'; e.currentTarget.style.borderColor='rgba(245,158,11,0.3)'; }}>
                <Ico size={14} sw={1.5}><path d="M3 2h18v20H3z"/><line x1="12" y1="12" x2="14" y2="12"/></Ico>
                + {w.label}
                {cnt > 0 && <span style={{ position:'absolute', top:4, right:4, fontSize:'0.5rem', fontWeight:800, background:'#f59e0b', color:'#000', padding:'1px 5px', borderRadius:99 }}>{cnt}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {doors.length === 0 && (
        <div style={{ marginBottom:12, borderRadius:11, border:`1px dashed ${C.border}`, background:'rgba(255,255,255,0.02)', padding:'10px 12px', fontSize:'0.68rem', color:C.textMuted }}>
          No doors added yet.
        </div>
      )}

      {doors.map(door => (
        <div key={door.id} style={{ marginBottom:10, borderRadius:12, border:'1px solid rgba(245,158,11,0.2)', background:'linear-gradient(180deg, rgba(245,158,11,0.09), rgba(245,158,11,0.03))', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 10px', borderBottom:'1px solid rgba(245,158,11,0.1)' }}>
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
  const lineItems   = Object.keys(grouped).length;
  const avgPerItem  = items.length ? subtotal / items.length : 0;
  const catalogItem = (name) => FURNITURE_ITEMS.find(f => f.name === name) || {};

  return (
    <div className="sb-fade">
      <SectionDivider title="Order Summary" badge={items.length} />

      {/* Cart items */}
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
        {Object.values(grouped).map(g => {
          const ci = catalogItem(g.type);
          return (
            <div key={g.type} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 12px', background:'linear-gradient(180deg, rgba(233,53,199,0.06), rgba(139,92,246,0.03))', borderRadius:12, border:`1px solid ${C.borderSoft}`, transition:C.tr, boxShadow:'0 6px 18px rgba(0,0,0,0.18)' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(99,102,241,0.06)'; e.currentTarget.style.borderColor='rgba(99,102,241,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='linear-gradient(180deg, rgba(233,53,199,0.06), rgba(139,92,246,0.03))'; e.currentTarget.style.borderColor=C.borderSoft; }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, minWidth:0 }}>
                <div style={{ width:46, height:46, borderRadius:11, background:C.accentDim, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0, overflow:'hidden', border:'1px solid rgba(255,255,255,0.16)' }}>
                  {ci.thumbnail ? (
                    <img src={ci.thumbnail} alt={g.type} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  ) : (
                    <span>{ci.icon || '🪑'}</span>
                  )}
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:'0.9rem', fontWeight:800, color:C.textMain, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{g.type}</div>
                  <div style={{ fontSize:'0.63rem', color:C.textMuted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:1 }}>{ci.desc || ''}</div>
                  {ci.material && <div style={{ fontSize:'0.58rem', color:'rgba(129,140,248,0.75)', fontWeight:700, marginTop:2 }}>{ci.material}</div>}
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:2, flexShrink:0, paddingLeft:10 }}>
                {g.qty > 1 && <span style={{ fontSize:'0.6rem', fontWeight:700, color:C.textMuted, background:'rgba(255,255,255,0.06)', padding:'1px 7px', borderRadius:99 }}>×{g.qty}</span>}
                <span style={{ fontSize:'0.98rem', fontWeight:800, color:C.gold, fontFamily:C.mono }}>${g.total.toFixed(2)}</span>
                {g.qty > 1 && <span style={{ fontSize:'0.55rem', color:C.textMuted }}>${(ITEM_PRICES[g.type]||0).toFixed(2)} each</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, marginBottom:12 }}>
        <div style={{ padding:'7px 8px', borderRadius:9, border:`1px solid ${C.borderSoft}`, background:'rgba(255,255,255,0.03)' }}>
          <div style={{ fontSize:'0.55rem', color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.4px' }}>Items</div>
          <div style={{ marginTop:2, fontSize:'0.78rem', fontWeight:700, color:C.textMain }}>{items.length}</div>
        </div>
        <div style={{ padding:'7px 8px', borderRadius:9, border:`1px solid ${C.borderSoft}`, background:'rgba(255,255,255,0.03)' }}>
          <div style={{ fontSize:'0.55rem', color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.4px' }}>Types</div>
          <div style={{ marginTop:2, fontSize:'0.78rem', fontWeight:700, color:C.textMain }}>{lineItems}</div>
        </div>
        <div style={{ padding:'7px 8px', borderRadius:9, border:`1px solid ${C.borderSoft}`, background:'rgba(255,255,255,0.03)' }}>
          <div style={{ fontSize:'0.55rem', color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.4px' }}>Avg</div>
          <div style={{ marginTop:2, fontSize:'0.78rem', fontWeight:700, color:C.textMain, fontFamily:C.mono }}>${avgPerItem.toFixed(2)}</div>
        </div>
      </div>

      {/* Order summary card */}
      <div style={{ background:'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(233,53,199,0.03))', borderRadius:14, border:`1px solid ${C.borderSoft}`, overflow:'hidden', boxShadow:'0 10px 24px rgba(0,0,0,0.24)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 14px', background:'rgba(99,102,241,0.06)', borderBottom:`1px solid ${C.borderSoft}` }}>
          <Ico size={13} sw={2}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></Ico>
          <span style={{ fontSize:'0.7rem', fontWeight:800, color:C.textAccent, textTransform:'uppercase', letterSpacing:'0.5px' }}>Price Breakdown</span>
        </div>

        <PriceLine label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
        <PriceLine label="Delivery" value="FREE" valueColor={C.greenLive} />
        <PriceLine label="Assembly (10%)" value={`$${assembly.toFixed(2)}`} />
        <PriceLine label="Est. Tax (8%)" value={`$${tax.toFixed(2)}`} muted />

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:'linear-gradient(135deg,rgba(251,191,36,0.11),rgba(245,158,11,0.04))', borderTop:`1px solid rgba(251,191,36,0.15)` }}>
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
    <span style={{ fontSize:'0.77rem', fontWeight:600, color: muted ? C.textMuted : C.textSub }}>{label}</span>
    <span style={{ fontSize:'0.8rem', fontWeight:700, color: valueColor || C.textMain, fontFamily:C.mono }}>{value}</span>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL / SETTINGS PANEL
───────────────────────────────────────────────────────────────────────────── */
function GlobalPanel({ roomConfig, setRoomConfig, saveDesign, loadDesigns, downloadScreenshot, undo, redo, canUndo, canRedo }) {
  const updateRoom = (key, val) => setRoomConfig(p => ({ ...p, [key]: val }));
  const panelCard = {
    background:'linear-gradient(180deg, rgba(233,53,199,0.06), rgba(139,92,246,0.03))',
    border:`1px solid ${C.borderSoft}`,
    borderRadius:12,
    boxShadow:'0 8px 20px rgba(0,0,0,0.2)'
  };
  const ambientValue = roomConfig.ambientIntensity ?? 0.6;
  const sunValue = roomConfig.sunIntensity ?? 1.2;
  const shadingPresets = [
    { id:'soft', label:'Soft', ambient:0.85, sun:0.7 },
    { id:'balanced', label:'Balanced', ambient:0.6, sun:1.2 },
    { id:'dramatic', label:'Dramatic', ambient:0.35, sun:2.0 },
  ];
  const activeShadingPreset = shadingPresets.find(
    p => Math.abs(ambientValue - p.ambient) <= 0.05 && Math.abs(sunValue - p.sun) <= 0.1
  )?.id;

  const applyShadingPreset = (preset) => {
    updateRoom('ambientIntensity', preset.ambient);
    updateRoom('sunIntensity', preset.sun);
  };

  return (
    <div className="sb-fade">
      {/* Lighting */}
      <SectionDivider title="Environment" />
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
        <span style={{ fontSize:'0.62rem', color:C.textMuted }}>Current mode:</span>
        <span style={{ fontSize:'0.62rem', fontWeight:700, color:C.textAccent, background:'rgba(99,102,241,0.14)', borderRadius:999, padding:'2px 8px' }}>{roomConfig.lightingMode || 'Day'}</span>
      </div>
      <div style={{ ...panelCard, padding:10, display:'flex', flexDirection:'column', gap:8, marginBottom:18 }}>
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
      <div style={{ ...panelCard, padding:'12px 14px', marginBottom:18 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <span style={{ fontSize:'0.62rem', color:C.textMuted }}>Quick presets</span>
          <div className="sb-chip-row" style={{ gap:5 }}>
            {shadingPresets.map(p => (
              <Chip key={p.id} active={activeShadingPreset === p.id} onClick={() => applyShadingPreset(p)}>{p.label}</Chip>
            ))}
          </div>
        </div>

        <SliderRow
          value={ambientValue}
          min={0.0} max={1.5} step={0.05}
          onChange={v => updateRoom('ambientIntensity', v)}
          label="Ambient Brightness" icon="💡"
          displayFn={v => `${Math.round(v * 100)}%`}
        />
        <SliderRow
          value={sunValue}
          min={0.0} max={3.0} step={0.1}
          onChange={v => updateRoom('sunIntensity', v)}
          label="Sun Intensity" icon="☀️"
          displayFn={v => `${v.toFixed(1)}×`}
        />
        <div style={{ marginTop:2, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            <span style={{ fontSize:'0.58rem', color:C.textMuted, background:'rgba(255,255,255,0.04)', border:`1px solid ${C.borderSoft}`, borderRadius:999, padding:'2px 7px' }}>Ambient {Math.round(ambientValue * 100)}%</span>
            <span style={{ fontSize:'0.58rem', color:C.textMuted, background:'rgba(255,255,255,0.04)', border:`1px solid ${C.borderSoft}`, borderRadius:999, padding:'2px 7px' }}>Sun {sunValue.toFixed(1)}x</span>
          </div>
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
      <div style={{ ...panelCard, padding:9, display:'flex', flexDirection:'column', gap:7 }}>
        <ActionBtn onClick={saveDesign} primary
          icon={<Ico size={15} sw={2}><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></Ico>}
          label="Save Project" />
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
  undo,
  redo,
  canUndo = false,
  canRedo = false,
}) {
  const [activeTab, setActiveTab]   = useState(TABS.LIBRARY);
  const [collapsed, setCollapsed]   = useState(false);
  const lastSelectedIdRef = React.useRef(null);

  const selectedItem = items.find(i => i.id === selectedId);

  // Jump to Properties only when selection changes.
  React.useEffect(() => {
    if (selectedId && selectedId !== lastSelectedIdRef.current) {
      setActiveTab(TABS.PROPERTIES);
    }
    lastSelectedIdRef.current = selectedId;
  }, [selectedId]);

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
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            {/* Collapse button */}
            <button onClick={() => setCollapsed(true)}
              style={{ width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent', border:'none', borderRadius:8, color:C.textMuted, cursor:'pointer', transition:C.tr }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color=C.textMain; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=C.textMuted; }}
              title="Collapse sidebar">
              <Ico size={15} sw={2}><polyline points="15 18 9 12 15 6"/></Ico>
            </button>
          </div>
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
            undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo}
          />
        )}
      </div>

    </aside>
  );
}
