import React, { useMemo, useEffect, useRef } from 'react';
import { Grid, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const WALL_HEIGHT = 5;
const WALL_THICK = 0.2;

/* ────────────────────────────────────────────
   Wall: a box between two XZ points
   If windows are supplied, we create cutouts visually using multiple segments +
   glass panes.
   ──────────────────────────────────────────── */
function Wall({ from, to, color, wallId, windows = [] }) {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  const cx = (from[0] + to[0]) / 2;
  const cz = (from[1] + to[1]) / 2;

  // Filter windows for this wall
  const wallWindows = windows.filter(w => w.wall === wallId);

  if (wallWindows.length === 0) {
    // Simple solid wall
    return (
      <mesh position={[cx, WALL_HEIGHT / 2, cz]} rotation={[0, angle, 0]} receiveShadow castShadow>
        <boxGeometry args={[WALL_THICK, WALL_HEIGHT, len]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }

  // Wall with window holes: build wall segments around windows
  // Sort windows by position along the wall
  const sorted = [...wallWindows].sort((a, b) => a.position - b.position);

  const segments = [];
  const glassElements = [];
  const sunlightElements = [];

  sorted.forEach((win, i) => {
    const winCenter = win.position * len;         // distance along wall
    const winHalfW = Math.min(win.width, len * 0.8) / 2;
    const winBottom = win.sillHeight;
    const winTop = Math.min(win.sillHeight + win.height, WALL_HEIGHT - 0.1);
    const winH = winTop - winBottom;

    // Left of window hole  
    const winStart = winCenter - winHalfW;
    const winEnd = winCenter + winHalfW;

    // Wall segment BELOW window
    if (winBottom > 0.05) {
      segments.push(
        <mesh key={`below-${i}`} position={[0, winBottom / 2, winCenter - len / 2]} receiveShadow castShadow>
          <boxGeometry args={[WALL_THICK, winBottom, winHalfW * 2]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
    }
    // Wall segment ABOVE window
    const aboveH = WALL_HEIGHT - winTop;
    if (aboveH > 0.05) {
      segments.push(
        <mesh key={`above-${i}`} position={[0, winTop + aboveH / 2, winCenter - len / 2]} receiveShadow castShadow>
          <boxGeometry args={[WALL_THICK, aboveH, winHalfW * 2]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
    }

    // Glass pane
    glassElements.push(
      <mesh key={`glass-${i}`} position={[0, winBottom + winH / 2, winCenter - len / 2]} receiveShadow>
        <boxGeometry args={[WALL_THICK * 0.3, winH, winHalfW * 2]} />
        <meshPhysicalMaterial
          color="#b3d9ff"
          transparent
          opacity={0.25}
          roughness={0.05}
          metalness={0.1}
          transmission={0.8}
          thickness={0.05}
        />
      </mesh>
    );

    // Window frame (thin border)
    const frameThick = 0.06;
    const frameColor = '#555555';
    // Horizontal top & bottom bars
    glassElements.push(
      <mesh key={`frame-t-${i}`} position={[0, winTop, winCenter - len / 2]}>
        <boxGeometry args={[WALL_THICK + 0.02, frameThick, winHalfW * 2 + frameThick]} />
        <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.3} />
      </mesh>
    );
    glassElements.push(
      <mesh key={`frame-b-${i}`} position={[0, winBottom, winCenter - len / 2]}>
        <boxGeometry args={[WALL_THICK + 0.02, frameThick, winHalfW * 2 + frameThick]} />
        <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.3} />
      </mesh>
    );
    // Vertical left & right bars
    glassElements.push(
      <mesh key={`frame-l-${i}`} position={[0, winBottom + winH / 2, winCenter - len / 2 - winHalfW]}>
        <boxGeometry args={[WALL_THICK + 0.02, winH, frameThick]} />
        <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.3} />
      </mesh>
    );
    glassElements.push(
      <mesh key={`frame-r-${i}`} position={[0, winBottom + winH / 2, winCenter - len / 2 + winHalfW]}>
        <boxGeometry args={[WALL_THICK + 0.02, winH, frameThick]} />
        <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.3} />
      </mesh>
    );
    // Center cross-bar
    glassElements.push(
      <mesh key={`frame-cx-${i}`} position={[0, winBottom + winH / 2, winCenter - len / 2]}>
        <boxGeometry args={[WALL_THICK + 0.02, frameThick, winHalfW * 2]} />
        <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.3} />
      </mesh>
    );
    glassElements.push(
      <mesh key={`frame-cy-${i}`} position={[0, winBottom + winH / 2, winCenter - len / 2]}>
        <boxGeometry args={[WALL_THICK + 0.02, winH, frameThick]} />
        <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.3} />
      </mesh>
    );

    // Sunlight beam (volumetric light cone coming through window)
    // Rendered as a transparent slanted mesh on the floor
    const sunBeamLength = Math.max(3, winH * 2.5);  // how far light projects
    const sunBeamWidth = winHalfW * 2;
    sunlightElements.push(
      <mesh
        key={`sunbeam-${i}`}
        position={[WALL_THICK / 2 + sunBeamLength / 2, 0.02, winCenter - len / 2]}
        rotation={[- Math.PI / 2, 0, 0]}
        receiveShadow={false}
      >
        <planeGeometry args={[sunBeamLength, sunBeamWidth]} />
        <meshBasicMaterial
          color="#fff8e1"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    );
  });

  // Build left/right solid wall sections (parts of the wall where there are no windows)
  // Full-height left & right wall pieces bounding the window openings
  const wallParts = [];
  let cursor = 0;
  sorted.forEach((win, i) => {
    const winCenter = win.position * len;
    const winHalfW = Math.min(win.width, len * 0.8) / 2;
    const winStart = winCenter - winHalfW;
    const winEnd = winCenter + winHalfW;

    // Segment from cursor to winStart
    const segLen = winStart - cursor;
    if (segLen > 0.01) {
      const segCenter = cursor + segLen / 2;
      wallParts.push(
        <mesh key={`wseg-${i}-l`} position={[0, WALL_HEIGHT / 2, segCenter - len / 2]} receiveShadow castShadow>
          <boxGeometry args={[WALL_THICK, WALL_HEIGHT, segLen]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
    }
    cursor = winEnd;
  });
  // Remaining wall after last window
  const remaining = len - cursor;
  if (remaining > 0.01) {
    wallParts.push(
      <mesh key="wseg-end" position={[0, WALL_HEIGHT / 2, cursor + remaining / 2 - len / 2]} receiveShadow castShadow>
        <boxGeometry args={[WALL_THICK, WALL_HEIGHT, remaining]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }

  return (
    <group position={[cx, 0, cz]} rotation={[0, angle, 0]}>
      {wallParts}
      {segments}
      {glassElements}
      {sunlightElements}
    </group>
  );
}

/* ────────────────────────────────────────────
   Simplex-like noise for realistic textures
   ──────────────────────────────────────────── */
const _perm = new Uint8Array(512);
(function initPerm() {
  const p = [];
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor((i + 1) * (Math.sin(i * 127.1 + 311.7) * 0.5 + 0.5));
    [p[i], p[j % 256]] = [p[j % 256], p[i]];
  }
  for (let i = 0; i < 512; i++) _perm[i] = p[i & 255];
})();

function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a, b, t) { return a + t * (b - a); }
function grad(hash, x, y) {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
}

function noise2D(x, y) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x), yf = y - Math.floor(y);
  const u = fade(xf), v = fade(yf);
  const aa = _perm[_perm[X] + Y], ab = _perm[_perm[X] + Y + 1];
  const ba = _perm[_perm[X + 1] + Y], bb = _perm[_perm[X + 1] + Y + 1];
  return lerp(
    lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u), v
  );
}

function fbm(x, y, octaves = 4) {
  let val = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * noise2D(x * freq, y * freq);
    amp *= 0.5; freq *= 2;
  }
  return val;
}

/* ── Parse hex color to RGB ── */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbStr(r, g, b) {
  return `rgb(${Math.max(0, Math.min(255, r | 0))},${Math.max(0, Math.min(255, g | 0))},${Math.max(0, Math.min(255, b | 0))})`;
}

/* ────────────────────────────────────────────
   Realistic procedural floor texture generators
   1024×1024 with proper patterns and bump detail
   ──────────────────────────────────────────── */
function createFloorTexture(type, color) {
  const S = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');
  const base = hexToRgb(color);

  switch (type) {
    /* ═══ WOOD: Realistic planks with grain, knots, color variation ═══ */
    case 'wood': {
      const plankCount = 6;
      const plankH = S / plankCount;
      const gapW = 2;

      for (let p = 0; p < plankCount; p++) {
        const py = p * plankH;
        // Per-plank color shift for realism
        const shift = (Math.sin(p * 3.7 + 1.2) * 0.5 + 0.5) * 30 - 15;
        const pr = base.r + shift, pg = base.g + shift * 0.7, pb = base.b + shift * 0.4;

        // Fill plank base
        for (let y = Math.ceil(py + gapW); y < py + plankH - gapW && y < S; y++) {
          for (let x = 0; x < S; x++) {
            // Noise-based grain
            const nx = x / S, ny = y / S;
            const grain = fbm(nx * 40 + p * 7, ny * 2.5, 5);
            const ring = Math.sin((nx * 30 + grain * 8) * Math.PI) * 0.5 + 0.5;
            const detail = noise2D(x * 0.08, y * 0.3) * 12;
            const lum = ring * 25 - 12 + detail;

            const cr = Math.max(0, Math.min(255, pr + lum));
            const cg = Math.max(0, Math.min(255, pg + lum * 0.8));
            const cb = Math.max(0, Math.min(255, pb + lum * 0.5));
            ctx.fillStyle = rgbStr(cr, cg, cb);
            ctx.fillRect(x, y, 1, 1);
          }
        }

        // Plank gap (dark line)
        ctx.fillStyle = `rgba(0,0,0,0.45)`;
        ctx.fillRect(0, py, S, gapW);

        // Staggered vertical joints
        const jointX = p % 2 === 0 ? S * 0.48 : S * 0.72;
        ctx.fillStyle = `rgba(0,0,0,0.3)`;
        ctx.fillRect(jointX - 1, py + gapW, 2, plankH - gapW * 2);

        // Occasional knot (1 in 3 planks)
        if ((p * 17 + 3) % 3 === 0) {
          const kx = S * (0.2 + (Math.sin(p * 5.1) * 0.5 + 0.5) * 0.6);
          const ky = py + plankH * (0.3 + Math.sin(p * 2.3) * 0.2);
          const kr = 8 + Math.sin(p) * 4;
          const gradient = ctx.createRadialGradient(kx, ky, 0, kx, ky, kr);
          gradient.addColorStop(0, `rgba(${(base.r * 0.4)|0},${(base.g * 0.3)|0},${(base.b * 0.2)|0},0.7)`);
          gradient.addColorStop(0.5, `rgba(${(base.r * 0.6)|0},${(base.g * 0.5)|0},${(base.b * 0.3)|0},0.4)`);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.ellipse(kx, ky, kr * 1.3, kr, 0.3, 0, Math.PI * 2);
          ctx.fill();
          // Ring detail
          for (let r = 2; r < kr; r += 2.5) {
            ctx.strokeStyle = `rgba(0,0,0,${0.08 + (r / kr) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.ellipse(kx, ky, r * 1.3, r, 0.3, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      // Subtle varnish sheen
      const varnish = ctx.createLinearGradient(0, 0, S, S);
      varnish.addColorStop(0, 'rgba(255,255,255,0.03)');
      varnish.addColorStop(0.5, 'rgba(255,255,255,0.07)');
      varnish.addColorStop(1, 'rgba(0,0,0,0.02)');
      ctx.fillStyle = varnish;
      ctx.fillRect(0, 0, S, S);
      break;
    }

    /* ═══ TILES: Ceramic/porcelain tiles with beveled edges and grout ═══ */
    case 'tiles': {
      const gridN = 4;
      const tileSize = S / gridN;
      const grout = 6;
      const bevel = 4;

      // Fill grout base
      const groutR = Math.max(0, base.r - 60), groutG = Math.max(0, base.g - 55), groutB = Math.max(0, base.b - 50);
      ctx.fillStyle = rgbStr(groutR, groutG, groutB);
      ctx.fillRect(0, 0, S, S);
      // Grout noise
      for (let n = 0; n < 6000; n++) {
        const nx = Math.random() * S, ny = Math.random() * S;
        ctx.fillStyle = `rgba(${Math.random() > 0.5 ? 0 : 60},${Math.random() > 0.5 ? 0 : 40},${Math.random() > 0.5 ? 0 : 30},0.04)`;
        ctx.fillRect(nx, ny, 1 + Math.random(), 1 + Math.random());
      }

      for (let r = 0; r < gridN; r++) {
        for (let c = 0; c < gridN; c++) {
          const tx = c * tileSize + grout / 2;
          const ty = r * tileSize + grout / 2;
          const tw = tileSize - grout;

          // Per-tile color variation
          const seed = r * gridN + c;
          const vShift = Math.sin(seed * 4.7 + 2.3) * 8;
          const tr = base.r + vShift, tg = base.g + vShift, tb = base.b + vShift;

          // Draw tile face pixel-by-pixel with subtle noise
          for (let y = 0; y < tw; y++) {
            for (let x = 0; x < tw; x++) {
              const px = tx + x, py = ty + y;
              if (px >= S || py >= S) continue;
              const n = noise2D(px * 0.02 + seed, py * 0.02) * 6;
              ctx.fillStyle = rgbStr(tr + n, tg + n, tb + n);
              ctx.fillRect(px, py, 1, 1);
            }
          }

          // Beveled highlight (top & left edges)
          const highlightGrad = ctx.createLinearGradient(tx, ty, tx, ty + bevel);
          highlightGrad.addColorStop(0, 'rgba(255,255,255,0.25)');
          highlightGrad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = highlightGrad;
          ctx.fillRect(tx, ty, tw, bevel);

          const highlightGradL = ctx.createLinearGradient(tx, ty, tx + bevel, ty);
          highlightGradL.addColorStop(0, 'rgba(255,255,255,0.15)');
          highlightGradL.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = highlightGradL;
          ctx.fillRect(tx, ty, bevel, tw);

          // Shadow (bottom & right edges)
          const shadowGrad = ctx.createLinearGradient(tx, ty + tw - bevel, tx, ty + tw);
          shadowGrad.addColorStop(0, 'rgba(0,0,0,0)');
          shadowGrad.addColorStop(1, 'rgba(0,0,0,0.15)');
          ctx.fillStyle = shadowGrad;
          ctx.fillRect(tx, ty + tw - bevel, tw, bevel);

          const shadowGradR = ctx.createLinearGradient(tx + tw - bevel, ty, tx + tw, ty);
          shadowGradR.addColorStop(0, 'rgba(0,0,0,0)');
          shadowGradR.addColorStop(1, 'rgba(0,0,0,0.12)');
          ctx.fillStyle = shadowGradR;
          ctx.fillRect(tx + tw - bevel, ty, bevel, tw);
        }
      }
      break;
    }

    /* ═══ MARBLE: Veined marble with Perlin noise ═══ */
    case 'marble': {
      for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
          const nx = x / S, ny = y / S;
          // Turbulent marble veining
          const turb = fbm(nx * 6, ny * 6, 6);
          const vein = Math.sin((nx * 10 + turb * 5) * Math.PI);
          const veinAbs = Math.abs(vein);
          // Sharp veins
          const veinStrength = Math.pow(1 - veinAbs, 3);

          // Secondary veins at different angle
          const turb2 = fbm(nx * 8 + 50, ny * 8 + 50, 4);
          const vein2 = Math.sin((ny * 12 + turb2 * 4) * Math.PI);
          const vein2Strength = Math.pow(1 - Math.abs(vein2), 4) * 0.5;

          // Base color with subtle noise variation
          const baseNoise = noise2D(x * 0.01, y * 0.01) * 8;
          const veinDark = (veinStrength + vein2Strength) * 50;

          const cr = Math.max(0, Math.min(255, base.r + baseNoise - veinDark));
          const cg = Math.max(0, Math.min(255, base.g + baseNoise - veinDark * 0.9));
          const cb = Math.max(0, Math.min(255, base.b + baseNoise - veinDark * 0.7));
          ctx.fillStyle = rgbStr(cr, cg, cb);
          ctx.fillRect(x, y, 1, 1);
        }
      }
      // Polish sheen
      const sheen = ctx.createRadialGradient(S * 0.35, S * 0.35, 0, S * 0.5, S * 0.5, S * 0.8);
      sheen.addColorStop(0, 'rgba(255,255,255,0.1)');
      sheen.addColorStop(0.6, 'rgba(255,255,255,0.02)');
      sheen.addColorStop(1, 'rgba(0,0,0,0.03)');
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, S, S);
      break;
    }

    /* ═══ CONCRETE: Industrial concrete with aggregate ═══ */
    case 'concrete': {
      // Pixel-level noise for rough surface
      for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
          const nx = x / S, ny = y / S;
          const coarse = fbm(nx * 8, ny * 8, 4) * 18;
          const fine = noise2D(x * 0.15, y * 0.15) * 6;
          const micro = (Math.random() - 0.5) * 10;
          const lum = coarse + fine + micro;
          ctx.fillStyle = rgbStr(base.r + lum, base.g + lum, base.b + lum);
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // Aggregate specks (small stones)
      for (let i = 0; i < 200; i++) {
        const ax = Math.random() * S, ay = Math.random() * S;
        const ar = 1.5 + Math.random() * 3;
        const brightness = (Math.random() - 0.5) * 40;
        ctx.fillStyle = rgbStr(base.r + brightness + 20, base.g + brightness + 15, base.b + brightness + 10);
        ctx.beginPath();
        ctx.arc(ax, ay, ar, 0, Math.PI * 2);
        ctx.fill();
      }

      // Hairline cracks
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 0.8;
      for (let c = 0; c < 4; c++) {
        ctx.beginPath();
        let cx2 = Math.random() * S, cy2 = Math.random() * S;
        ctx.moveTo(cx2, cy2);
        for (let s = 0; s < 8; s++) {
          cx2 += (Math.random() - 0.5) * 150;
          cy2 += (Math.random() - 0.5) * 150;
          ctx.lineTo(cx2, cy2);
        }
        ctx.stroke();
      }

      // Subtle stain patches
      for (let s = 0; s < 5; s++) {
        const sx = Math.random() * S, sy = Math.random() * S;
        const sr = 30 + Math.random() * 80;
        const stain = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
        stain.addColorStop(0, `rgba(0,0,0,${0.02 + Math.random() * 0.03})`);
        stain.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = stain;
        ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
      }
      break;
    }

    /* ═══ CARPET: Dense woven textile with pile texture ═══ */
    case 'carpet': {
      // Base with noise
      for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
          const nx = x / S, ny = y / S;
          const pile = fbm(nx * 20, ny * 20, 3) * 14;
          const weave = Math.sin(x * 0.8) * Math.sin(y * 0.8) * 5;
          const fuzz = (Math.random() - 0.5) * 12;
          const lum = pile + weave + fuzz;
          ctx.fillStyle = rgbStr(base.r + lum, base.g + lum, base.b + lum);
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // Woven grid pattern (subtle)
      ctx.globalAlpha = 0.06;
      for (let y = 0; y < S; y += 4) {
        ctx.strokeStyle = y % 8 === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(S, y);
        ctx.stroke();
      }
      for (let x = 0; x < S; x += 4) {
        ctx.strokeStyle = x % 8 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, S);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Soft overall shading
      const carpetGrad = ctx.createRadialGradient(S * 0.5, S * 0.5, 0, S * 0.5, S * 0.5, S * 0.7);
      carpetGrad.addColorStop(0, 'rgba(255,255,255,0.04)');
      carpetGrad.addColorStop(1, 'rgba(0,0,0,0.03)');
      ctx.fillStyle = carpetGrad;
      ctx.fillRect(0, 0, S, S);
      break;
    }

    case 'solid':
    default:
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, S, S);
      break;
  }

  return canvas;
}

/* ────────────────────────────────────────────
   Generate a bump map canvas for the floor type
   ──────────────────────────────────────────── */
function createFloorBumpMap(type) {
  const S = 512;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#808080'; // neutral bump
  ctx.fillRect(0, 0, S, S);

  switch (type) {
    case 'wood': {
      const plankH = S / 6;
      for (let p = 0; p < 6; p++) {
        // Plank gap = low
        ctx.fillStyle = '#404040';
        ctx.fillRect(0, p * plankH, S, 2);
        // Joint
        const jx = p % 2 === 0 ? S * 0.48 : S * 0.72;
        ctx.fillRect(jx - 1, p * plankH, 2, plankH);
        // Grain bumps
        for (let g = 0; g < 20; g++) {
          const gy = p * plankH + 4 + Math.random() * (plankH - 8);
          ctx.strokeStyle = `rgba(${100 + Math.random() * 50},${100 + Math.random() * 50},${100 + Math.random() * 50},0.3)`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.bezierCurveTo(S * 0.3, gy + (Math.random() - 0.5) * 3, S * 0.7, gy + (Math.random() - 0.5) * 3, S, gy);
          ctx.stroke();
        }
      }
      break;
    }
    case 'tiles': {
      const gridN = 4;
      const ts = S / gridN;
      const grout = 4;
      ctx.fillStyle = '#606060'; // grout is recessed
      ctx.fillRect(0, 0, S, S);
      for (let r = 0; r < gridN; r++) {
        for (let c = 0; c < gridN; c++) {
          ctx.fillStyle = '#909090'; // tile surface is raised
          ctx.fillRect(c * ts + grout, r * ts + grout, ts - grout * 2, ts - grout * 2);
          // Bevel highlight
          ctx.fillStyle = '#b0b0b0';
          ctx.fillRect(c * ts + grout, r * ts + grout, ts - grout * 2, 3);
          ctx.fillRect(c * ts + grout, r * ts + grout, 3, ts - grout * 2);
          // Bevel shadow
          ctx.fillStyle = '#707070';
          ctx.fillRect(c * ts + grout, (r + 1) * ts - grout - 3, ts - grout * 2, 3);
          ctx.fillRect((c + 1) * ts - grout - 3, r * ts + grout, 3, ts - grout * 2);
        }
      }
      break;
    }
    case 'marble': {
      for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
          const n = noise2D(x * 0.015, y * 0.015) * 20 + 128;
          const val = Math.max(0, Math.min(255, n | 0));
          ctx.fillStyle = rgbStr(val, val, val);
          ctx.fillRect(x, y, 1, 1);
        }
      }
      break;
    }
    case 'concrete': {
      for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
          const n = fbm(x * 0.02, y * 0.02, 4) * 30 + (Math.random() - 0.5) * 15 + 128;
          const val = Math.max(0, Math.min(255, n | 0));
          ctx.fillStyle = rgbStr(val, val, val);
          ctx.fillRect(x, y, 1, 1);
        }
      }
      break;
    }
    case 'carpet': {
      for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
          const pile = Math.sin(x * 0.8) * Math.sin(y * 0.8) * 8;
          const fuzz = (Math.random() - 0.5) * 16;
          const val = Math.max(0, Math.min(255, (128 + pile + fuzz) | 0));
          ctx.fillStyle = rgbStr(val, val, val);
          ctx.fillRect(x, y, 1, 1);
        }
      }
      break;
    }
    default:
      break;
  }
  return canvas;
}

/* ────────────────────────────────────────────
   FloorTile: a single rectangular floor piece
   with realistic PBR materials + bump maps
   ──────────────────────────────────────────── */
function FloorTile({ cx, cz, w, d, color, floorType = 'solid' }) {
  const meshRef = useRef();

  const { diffuseTexture, bumpTexture } = useMemo(() => {
    const diffCanvas = createFloorTexture(floorType, color);
    const diffTex = new THREE.CanvasTexture(diffCanvas);
    diffTex.wrapS = THREE.RepeatWrapping;
    diffTex.wrapT = THREE.RepeatWrapping;
    diffTex.colorSpace = THREE.SRGBColorSpace;
    // Anisotropic filtering for sharper textures at angles
    diffTex.anisotropy = 16;

    let bumpTex = null;
    if (floorType !== 'solid') {
      const bumpCanvas = createFloorBumpMap(floorType);
      bumpTex = new THREE.CanvasTexture(bumpCanvas);
      bumpTex.wrapS = THREE.RepeatWrapping;
      bumpTex.wrapT = THREE.RepeatWrapping;
      bumpTex.anisotropy = 16;
    }

    // Scale repeat so pattern tiles naturally across the floor
    const repeatX = floorType === 'solid' ? 1 : w / 4;
    const repeatY = floorType === 'solid' ? 1 : d / 4;
    diffTex.repeat.set(repeatX, repeatY);
    if (bumpTex) bumpTex.repeat.set(repeatX, repeatY);

    diffTex.needsUpdate = true;
    if (bumpTex) bumpTex.needsUpdate = true;

    return { diffuseTexture: diffTex, bumpTexture: bumpTex };
  }, [floorType, color, w, d]);

  // Cleanup textures on unmount
  useEffect(() => {
    return () => {
      diffuseTexture.dispose();
      if (bumpTexture) bumpTexture.dispose();
    };
  }, [diffuseTexture, bumpTexture]);

  const materialProps = useMemo(() => {
    switch (floorType) {
      case 'wood':
        return {
          map: diffuseTexture,
          bumpMap: bumpTexture,
          bumpScale: 0.015,
          roughness: 0.45,
          metalness: 0.05,
          envMapIntensity: 0.4,
        };
      case 'tiles':
        return {
          map: diffuseTexture,
          bumpMap: bumpTexture,
          bumpScale: 0.025,
          roughness: 0.25,
          metalness: 0.08,
          envMapIntensity: 0.6,
        };
      case 'marble':
        return {
          map: diffuseTexture,
          bumpMap: bumpTexture,
          bumpScale: 0.005,
          roughness: 0.1,
          metalness: 0.15,
          envMapIntensity: 0.8,
        };
      case 'concrete':
        return {
          map: diffuseTexture,
          bumpMap: bumpTexture,
          bumpScale: 0.04,
          roughness: 0.85,
          metalness: 0.0,
          envMapIntensity: 0.15,
        };
      case 'carpet':
        return {
          map: diffuseTexture,
          bumpMap: bumpTexture,
          bumpScale: 0.02,
          roughness: 0.95,
          metalness: 0.0,
          envMapIntensity: 0.05,
        };
      case 'solid':
      default:
        return { color, roughness: 0.5, metalness: 0.0 };
    }
  }, [floorType, color, diffuseTexture, bumpTexture]);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[cx, -0.01, cz]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
}

/* ────────────────────────────────────────────
   Shape definitions
   Returns { floors: [{cx,cz,w,d}], walls: [[[x1,z1],[x2,z2]]] }
   Coordinate system: X = left/right, Z = back(-) / front(+)
   ──────────────────────────────────────────── */
function getShapeGeometry(shape, w, d) {
  const hw = w / 2;
  const hd = d / 2;

  switch (shape) {
    /* ── Square ─────────────────────────── */
    case 'square': {
      const s = Math.min(w, d);
      const hs = s / 2;
      return {
        floors: [{ cx: 0, cz: 0, w: s, d: s }],
        walls: [
          { from: [-hs, -hs], to: [hs, -hs], id: 'back' },
          { from: [-hs, hs], to: [-hs, -hs], id: 'left' },
          { from: [hs, -hs], to: [hs, hs],   id: 'right' },
        ],
      };
    }

    /* ── L-Shape (top-right cutout) ─────── */
    case 'l-shape': {
      const splitZ = 0;
      const splitX = 0;
      return {
        floors: [
          { cx: 0, cz: (-hd + splitZ) / 2, w: w, d: splitZ + hd },
          { cx: (-hw + splitX) / 2, cz: (splitZ + hd) / 2, w: splitX + hw, d: hd - splitZ },
        ],
        walls: [
          { from: [-hw, -hd], to: [hw, -hd],         id: 'back' },
          { from: [hw, -hd], to: [hw, splitZ],         id: 'right' },
          { from: [hw, splitZ], to: [splitX, splitZ],   id: 'l-inner-h' },
          { from: [splitX, splitZ], to: [splitX, hd],   id: 'l-inner-v' },
          { from: [-hw, hd], to: [-hw, -hd],           id: 'left' },
        ],
      };
    }

    /* ── T-Shape (top bar + stem) ──────── */
    case 't-shape': {
      const barD = d * 0.35;
      const stemHW = w * 0.25;
      const barZ = -hd + barD;
      return {
        floors: [
          { cx: 0, cz: (-hd + barZ) / 2, w: w, d: barD },
          { cx: 0, cz: (barZ + hd) / 2, w: stemHW * 2, d: hd - barZ },
        ],
        walls: [
          { from: [-hw, -hd], to: [hw, -hd],           id: 'back' },
          { from: [hw, -hd], to: [hw, barZ],             id: 'right' },
          { from: [hw, barZ], to: [stemHW, barZ],         id: 't-step-r' },
          { from: [stemHW, barZ], to: [stemHW, hd],       id: 't-stem-r' },
          { from: [-stemHW, hd], to: [-stemHW, barZ],     id: 't-stem-l' },
          { from: [-stemHW, barZ], to: [-hw, barZ],       id: 't-step-l' },
          { from: [-hw, barZ], to: [-hw, -hd],           id: 'left' },
        ],
      };
    }

    /* ── U-Shape (bottom bar + two arms) ── */
    case 'u-shape': {
      const armW = w * 0.25;
      const barD = d * 0.3;
      const innerZ = hd - barD;
      return {
        floors: [
          { cx: 0, cz: (innerZ + hd) / 2, w: w, d: barD },
          { cx: -hw + armW / 2, cz: (-hd + innerZ) / 2, w: armW, d: innerZ + hd },
          { cx: hw - armW / 2, cz: (-hd + innerZ) / 2, w: armW, d: innerZ + hd },
        ],
        walls: [
          { from: [-hw, -hd], to: [-hw + armW, -hd],           id: 'back' },
          { from: [-hw + armW, -hd], to: [-hw + armW, innerZ],  id: 'u-inner-l' },
          { from: [-hw + armW, innerZ], to: [hw - armW, innerZ], id: 'u-inner-b' },
          { from: [hw - armW, innerZ], to: [hw - armW, -hd],    id: 'u-inner-r' },
          { from: [hw - armW, -hd], to: [hw, -hd],              id: 'u-back-r' },
          { from: [hw, -hd], to: [hw, hd],                      id: 'right' },
          { from: [-hw, hd], to: [-hw, -hd],                    id: 'left' },
        ],
      };
    }

    /* ── Open (floor only, no walls) ────── */
    case 'open':
      return {
        floors: [{ cx: 0, cz: 0, w, d }],
        walls: [],
      };

    /* ── Rectangle (default) ──────────── */
    case 'rectangle':
    default:
      return {
        floors: [{ cx: 0, cz: 0, w, d }],
        walls: [
          { from: [-hw, -hd], to: [hw, -hd], id: 'back' },    // back
          { from: [-hw, hd], to: [-hw, -hd], id: 'left' },     // left
          { from: [hw, -hd], to: [hw, hd],   id: 'right' },    // right
        ],
      };
  }
}

/* ════════════════════════════════════════════
   Room Component
   ════════════════════════════════════════════ */
export default function Room({ width, depth, wallColor, floorColor, floorType = 'solid', shape = 'rectangle', windows = [] }) {
  const { floors, walls } = useMemo(
    () => getShapeGeometry(shape, width, depth),
    [shape, width, depth]
  );

  return (
    <group>
      {/* Floor tiles */}
      {floors.map((f, i) => (
        <FloorTile key={`floor-${shape}-${floorType}-${i}`} cx={f.cx} cz={f.cz} w={f.w} d={f.d} color={floorColor} floorType={floorType} />
      ))}

      {/* Walls (with optional window cutouts) */}
      {walls.map((seg, i) => (
        <Wall
          key={`wall-${shape}-${i}`}
          from={seg.from}
          to={seg.to}
          color={wallColor}
          wallId={seg.id}
          windows={windows}
        />
      ))}

      {/* Sunlight directional lights through windows */}
      {windows.map((win, i) => (
        <WindowSunlight key={`sunlight-${win.id}`} win={win} roomWidth={width} roomDepth={depth} shape={shape} walls={walls} />
      ))}
    </group>
  );
}

/* ────────────────────────────────────────────
   WindowSunlight: directional light that casts
   realistic shadows through each window
   ──────────────────────────────────────────── */
function WindowSunlight({ win, roomWidth, roomDepth, shape, walls }) {
  // Find the wall this window is on to position the light outside
  const wall = walls.find(w => w.id === win.wall);
  if (!wall) return null;

  const dx = wall.to[0] - wall.from[0];
  const dz = wall.to[1] - wall.from[1];
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  
  // Position along the wall
  const t = win.position;
  const wx = wall.from[0] + dx * t;
  const wz = wall.from[1] + dz * t;
  
  // Light position: outside the wall, angled down
  // Normal to wall (pointing outward)
  const nx = -Math.cos(angle);
  const nz = Math.sin(angle);
  const lightDist = 6;
  const lightHeight = win.sillHeight + win.height + 3;

  return (
    <group>
      {/* Directional light that casts shadow through the window */}
      <directionalLight
        position={[wx + nx * lightDist, lightHeight, wz + nz * lightDist]}
        target-position={[wx - nx * 2, 0, wz - nz * 2]}
        intensity={0.8}
        color="#fff5e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-win.width}
        shadow-camera-right={win.width}
        shadow-camera-top={win.height + 2}
        shadow-camera-bottom={-1}
        shadow-bias={-0.002}
      />
      {/* Warm point-light glow inside at window position */}
      <pointLight
        position={[wx - nx * 0.5, win.sillHeight + win.height * 0.5, wz - nz * 0.5]}
        intensity={0.4}
        distance={8}
        color="#fff8e1"
        decay={2}
      />
    </group>
  );
}