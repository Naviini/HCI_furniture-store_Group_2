import React, { useMemo } from 'react';
import { Grid } from '@react-three/drei';

const WALL_HEIGHT = 5;
const WALL_THICK = 0.2;

/* ────────────────────────────────────────────
   Wall: a box between two XZ points
   ──────────────────────────────────────────── */
function Wall({ from, to, color }) {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  const cx = (from[0] + to[0]) / 2;
  const cz = (from[1] + to[1]) / 2;

  return (
    <mesh position={[cx, WALL_HEIGHT / 2, cz]} rotation={[0, angle, 0]} receiveShadow castShadow>
      <boxGeometry args={[WALL_THICK, WALL_HEIGHT, len]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

/* ────────────────────────────────────────────
   FloorTile: a single rectangular floor piece
   ──────────────────────────────────────────── */
function FloorTile({ cx, cz, w, d, color }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, -0.01, cz]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color={color} />
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
          [[-hs, -hs], [hs, -hs]],   // back
          [[-hs, hs], [-hs, -hs]],    // left
          [[hs, -hs], [hs, hs]],      // right
        ],
      };
    }

    /* ── L-Shape (top-right cutout) ─────── */
    case 'l-shape': {
      // Split at the midpoint: bottom strip is full width, top-left strip is partial
      const splitZ = 0;
      const splitX = 0;
      return {
        floors: [
          // Bottom strip: z from -hd to splitZ, full width
          { cx: 0, cz: (-hd + splitZ) / 2, w: w, d: splitZ + hd },
          // Top-left strip: z from splitZ to hd, x from -hw to splitX
          { cx: (-hw + splitX) / 2, cz: (splitZ + hd) / 2, w: splitX + hw, d: hd - splitZ },
        ],
        walls: [
          [[-hw, -hd], [hw, -hd]],         // back (full width)
          [[hw, -hd], [hw, splitZ]],         // right lower
          [[hw, splitZ], [splitX, splitZ]],   // inner horizontal step
          [[splitX, splitZ], [splitX, hd]],   // inner vertical step
          [[-hw, hd], [-hw, -hd]],           // left (full height)
        ],
      };
    }

    /* ── T-Shape (top bar + stem) ──────── */
    case 't-shape': {
      const barD = d * 0.35;                // depth of the top bar
      const stemHW = w * 0.25;              // half-width of the stem
      const barZ = -hd + barD;              // z where the bar ends
      return {
        floors: [
          // Top bar: full width
          { cx: 0, cz: (-hd + barZ) / 2, w: w, d: barD },
          // Stem: centered, narrower
          { cx: 0, cz: (barZ + hd) / 2, w: stemHW * 2, d: hd - barZ },
        ],
        walls: [
          [[-hw, -hd], [hw, -hd]],                   // top bar back
          [[hw, -hd], [hw, barZ]],                    // top bar right
          [[hw, barZ], [stemHW, barZ]],               // step right
          [[stemHW, barZ], [stemHW, hd]],              // stem right
          [[-stemHW, hd], [-stemHW, barZ]],            // stem left
          [[-stemHW, barZ], [-hw, barZ]],              // step left
          [[-hw, barZ], [-hw, -hd]],                  // top bar left
        ],
      };
    }

    /* ── U-Shape (bottom bar + two arms) ── */
    case 'u-shape': {
      const armW = w * 0.25;                // width of each arm
      const barD = d * 0.3;                 // depth of the bottom bar
      const innerZ = hd - barD;             // z where the inner gap starts
      return {
        floors: [
          // Bottom bar: full width
          { cx: 0, cz: (innerZ + hd) / 2, w: w, d: barD },
          // Left arm
          { cx: -hw + armW / 2, cz: (-hd + innerZ) / 2, w: armW, d: innerZ + hd },
          // Right arm
          { cx: hw - armW / 2, cz: (-hd + innerZ) / 2, w: armW, d: innerZ + hd },
        ],
        walls: [
          [[-hw, -hd], [-hw + armW, -hd]],                     // left arm top
          [[-hw + armW, -hd], [-hw + armW, innerZ]],            // left arm inner
          [[-hw + armW, innerZ], [hw - armW, innerZ]],          // inner bottom
          [[hw - armW, innerZ], [hw - armW, -hd]],              // right arm inner
          [[hw - armW, -hd], [hw, -hd]],                        // right arm top
          [[hw, -hd], [hw, hd]],                                // right outer
          [[-hw, hd], [-hw, -hd]],                              // left outer
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
          [[-hw, -hd], [hw, -hd]],   // back
          [[-hw, hd], [-hw, -hd]],    // left
          [[hw, -hd], [hw, hd]],      // right
        ],
      };
  }
}

/* ════════════════════════════════════════════
   Room Component
   ════════════════════════════════════════════ */
export default function Room({ width, depth, wallColor, floorColor, shape = 'rectangle' }) {
  const { floors, walls } = useMemo(
    () => getShapeGeometry(shape, width, depth),
    [shape, width, depth]
  );

  return (
    <group>
      {/* Floor tiles */}
      {floors.map((f, i) => (
        <FloorTile key={`floor-${shape}-${i}`} cx={f.cx} cz={f.cz} w={f.w} d={f.d} color={floorColor} />
      ))}

      {/* Walls */}
      {walls.map((seg, i) => (
        <Wall key={`wall-${shape}-${i}`} from={seg[0]} to={seg[1]} color={wallColor} />
      ))}
    </group>
  );
}