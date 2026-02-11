import React, { useMemo } from 'react';
import { Grid } from '@react-three/drei';
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
export default function Room({ width, depth, wallColor, floorColor, shape = 'rectangle', windows = [] }) {
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