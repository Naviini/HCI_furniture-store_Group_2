import React, { useMemo, useRef, useEffect } from 'react';
import { Grid, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Floor texture images (directly imported for Vite resolution) ── */
import plankDiff  from '../assets/textures/plank_flooring_04_diff_1k.jpg';
import plankNor   from '../assets/textures/plank_flooring_04_nor_gl_1k.jpg';
import plankArm   from '../assets/textures/plank_flooring_04_arm_1k.jpg';
import cartDiff   from '../assets/textures/grey_cartago_03_diff_1k.jpg';
import cartNor    from '../assets/textures/grey_cartago_03_nor_gl_1k.jpg';
import cartArm    from '../assets/textures/grey_cartago_03_arm_1k.jpg';
import graniteDiff from '../assets/textures/granite_tile_diff_1k.jpg';
import graniteNor  from '../assets/textures/granite_tile_nor_gl_1k.jpg';
import graniteArm  from '../assets/textures/granite_tile_arm_1k.jpg';

/* Lookup map: floorType → { diff, nor, arm } texture paths */
const FLOOR_TEX_MAP = {
  plank_flooring: { diff: plankDiff,   nor: plankNor,   arm: plankArm,   roughness: 0.6,  metalness: 0.0 },
  grey_cartago:   { diff: cartDiff,    nor: cartNor,    arm: cartArm,    roughness: 0.4,  metalness: 0.05 },
  granite_tile:   { diff: graniteDiff, nor: graniteNor, arm: graniteArm, roughness: 0.25, metalness: 0.08 },
};

const WALL_HEIGHT = 5;
const WALL_THICK = 0.2;

/* ────────────────────────────────────────────
   Wall: a box between two XZ points
   If windows are supplied, we create cutouts visually using multiple segments +
   glass panes. If doors are supplied, we create door openings and frames.
   Front wall is rendered semi-transparent for better visibility.
   ──────────────────────────────────────────── */
function Wall({ from, to, color, wallId, windows = [], doors = [] }) {
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  const cx = (from[0] + to[0]) / 2;
  const cz = (from[1] + to[1]) / 2;

  const groupRef = useRef();
  const stateRef = useRef({ isTransparent: undefined });

  // When wall config changes, force re-evaluation on next frame
  useEffect(() => {
    stateRef.current.isTransparent = undefined;
  }, [color, windows, doors, wallId]);

  useFrame(({ camera }) => {
    const group = groupRef.current;
    if (!group) return;
    // Determine which single outer wall the camera currently faces
    const camAngle = Math.atan2(camera.position.x, camera.position.z);
    let facingWall;
    if      (camAngle >= -Math.PI / 4 && camAngle <  Math.PI / 4)       facingWall = 'front';
    else if (camAngle >=  Math.PI / 4 && camAngle <  3 * Math.PI / 4)   facingWall = 'right';
    else if (camAngle >= -3 * Math.PI / 4 && camAngle < -Math.PI / 4)   facingWall = 'left';
    else                                                                   facingWall = 'back';
    const shouldBeTransparent = (wallId === facingWall);
    if (shouldBeTransparent === stateRef.current.isTransparent) return;
    stateRef.current.isTransparent = shouldBeTransparent;
    group.traverse(child => {
      if (!child.isMesh || !child.material) return;
      if (shouldBeTransparent) {
        if (child.userData.savedOpacity === undefined) {
          child.userData.savedOpacity = child.material.opacity;
          child.userData.savedTransparent = child.material.transparent;
          child.userData.savedDepthWrite = child.material.depthWrite;
        }
        child.material.transparent = true;
        child.material.opacity = 0.1;
        child.material.depthWrite = false;
      } else {
        child.material.transparent = child.userData.savedTransparent ?? false;
        child.material.opacity    = child.userData.savedOpacity    ?? 1.0;
        child.material.depthWrite = child.userData.savedDepthWrite ?? true;
        child.userData.savedOpacity    = undefined;
        child.userData.savedTransparent = undefined;
        child.userData.savedDepthWrite  = undefined;
      }
      child.material.needsUpdate = true;
    });
  });

  // Filter windows and doors for this wall
  const wallWindows = windows.filter(w => w.wall === wallId);
  const wallDoors = doors.filter(d => d.wall === wallId);

  if (wallWindows.length === 0 && wallDoors.length === 0) {
    // Simple solid wall
    return (
      <group ref={groupRef} position={[cx, 0, cz]} rotation={[0, angle, 0]}>
        <mesh position={[0, WALL_HEIGHT / 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[WALL_THICK, WALL_HEIGHT, len]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    );
  }

  // Combine windows and doors into openings
  const openings = [
    ...wallWindows.map(w => ({ ...w, type: 'window' })),
    ...wallDoors.map(d => ({ ...d, type: 'door', sillHeight: 0 })) // doors start at floor
  ].sort((a, b) => a.position - b.position);

  const segments = [];
  const glassElements = [];
  const sunlightElements = [];

  openings.forEach((opening, i) => {
    const openingCenter = opening.position * len;
    const openingHalfW = Math.min(opening.width, len * 0.8) / 2;
    const openingBottom = opening.sillHeight || 0;
    const openingTop = Math.min(openingBottom + opening.height, WALL_HEIGHT - 0.1);
    const openingH = openingTop - openingBottom;

    // Wall segment BELOW opening (for windows only, doors start at floor)
    if (openingBottom > 0.05) {
      segments.push(
        <mesh key={`below-${i}`} position={[0, openingBottom / 2, openingCenter - len / 2]} receiveShadow castShadow>
          <boxGeometry args={[WALL_THICK, openingBottom, openingHalfW * 2]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
    }
    
    // Wall segment ABOVE opening
    const aboveH = WALL_HEIGHT - openingTop;
    if (aboveH > 0.05) {
      segments.push(
        <mesh key={`above-${i}`} position={[0, openingTop + aboveH / 2, openingCenter - len / 2]} receiveShadow castShadow>
          <boxGeometry args={[WALL_THICK, aboveH, openingHalfW * 2]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
    }

    if (opening.type === 'window') {
      // Glass pane
      glassElements.push(
        <mesh key={`glass-${i}`} position={[0, openingBottom + openingH / 2, openingCenter - len / 2]} receiveShadow>
          <boxGeometry args={[WALL_THICK * 0.3, openingH, openingHalfW * 2]} />
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

      // Window frame
      const frameThick = 0.06;
      const frameColor = '#555555';
      // Horizontal top & bottom bars
      glassElements.push(
        <mesh key={`frame-t-${i}`} position={[0, openingTop, openingCenter - len / 2]}>
          <boxGeometry args={[WALL_THICK + 0.02, frameThick, openingHalfW * 2 + frameThick]} />
          <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.3} />
        </mesh>
      );
      glassElements.push(
        <mesh key={`frame-b-${i}`} position={[0, openingBottom, openingCenter - len / 2]}>
          <boxGeometry args={[WALL_THICK + 0.02, frameThick, openingHalfW * 2 + frameThick]} />
          <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.3} />
        </mesh>
      );
      // Vertical left & right bars
      glassElements.push(
        <mesh key={`frame-l-${i}`} position={[0, openingBottom + openingH / 2, openingCenter - len / 2 - openingHalfW]}>
          <boxGeometry args={[WALL_THICK + 0.02, openingH, frameThick]} />
          <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.3} />
        </mesh>
      );
      glassElements.push(
        <mesh key={`frame-r-${i}`} position={[0, openingBottom + openingH / 2, openingCenter - len / 2 + openingHalfW]}>
          <boxGeometry args={[WALL_THICK + 0.02, openingH, frameThick]} />
          <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.3} />
        </mesh>
      );
      // Center cross-bars
      glassElements.push(
        <mesh key={`frame-cx-${i}`} position={[0, openingBottom + openingH / 2, openingCenter - len / 2]}>
          <boxGeometry args={[WALL_THICK + 0.02, frameThick, openingHalfW * 2]} />
          <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.3} />
        </mesh>
      );
      glassElements.push(
        <mesh key={`frame-cy-${i}`} position={[0, openingBottom + openingH / 2, openingCenter - len / 2]}>
          <boxGeometry args={[WALL_THICK + 0.02, openingH, frameThick]} />
          <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.3} />
        </mesh>
      );

      // Sunlight beam for windows
      const sunBeamLength = Math.max(3, openingH * 2.5);
      const sunBeamWidth = openingHalfW * 2;
      sunlightElements.push(
        <mesh
          key={`sunbeam-${i}`}
          position={[WALL_THICK / 2 + sunBeamLength / 2, 0.02, openingCenter - len / 2]}
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
    } else if (opening.type === 'door') {
      const frameThick = 0.08;
      const frameColor = '#654321';
      const doorColor = '#8B4513';

      // Door panel
      glassElements.push(
        <mesh key={`door-panel-${i}`} position={[0, openingH / 2, openingCenter - len / 2]} receiveShadow castShadow>
          <boxGeometry args={[WALL_THICK * 0.5, openingH - 0.1, openingHalfW * 2 - 0.08]} />
          <meshStandardMaterial color={doorColor} metalness={0.1} roughness={0.7} />
        </mesh>
      );

      // Door frame - top, left, right
      glassElements.push(
        <mesh key={`door-frame-t-${i}`} position={[0, openingTop, openingCenter - len / 2]}>
          <boxGeometry args={[WALL_THICK + 0.02, frameThick, openingHalfW * 2 + frameThick]} />
          <meshStandardMaterial color={frameColor} metalness={0.2} roughness={0.6} />
        </mesh>
      );
      glassElements.push(
        <mesh key={`door-frame-l-${i}`} position={[0, openingH / 2, openingCenter - len / 2 - openingHalfW]}>
          <boxGeometry args={[WALL_THICK + 0.02, openingH, frameThick]} />
          <meshStandardMaterial color={frameColor} metalness={0.2} roughness={0.6} />
        </mesh>
      );
      glassElements.push(
        <mesh key={`door-frame-r-${i}`} position={[0, openingH / 2, openingCenter - len / 2 + openingHalfW]}>
          <boxGeometry args={[WALL_THICK + 0.02, openingH, frameThick]} />
          <meshStandardMaterial color={frameColor} metalness={0.2} roughness={0.6} />
        </mesh>
      );

      // Door handle
      glassElements.push(
        <mesh
          key={`door-handle-${i}`}
          position={[WALL_THICK * 0.35, openingH * 0.45, openingCenter - len / 2 + openingHalfW * 0.7]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.025, 0.025, 0.15]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.2} />
        </mesh>
      );
    }
  });

  // Build left/right solid wall sections (parts of the wall where there are no openings)
  const wallParts = [];
  let cursor = 0;
  openings.forEach((opening, i) => {
    const openingCenter = opening.position * len;
    const openingHalfW = Math.min(opening.width, len * 0.8) / 2;
    const openingStart = openingCenter - openingHalfW;
    const openingEnd = openingCenter + openingHalfW;

    // Segment from cursor to opening start
    const segLen = openingStart - cursor;
    if (segLen > 0.01) {
      const segCenter = cursor + segLen / 2;
      wallParts.push(
        <mesh key={`wseg-${i}-l`} position={[0, WALL_HEIGHT / 2, segCenter - len / 2]} receiveShadow castShadow>
          <boxGeometry args={[WALL_THICK, WALL_HEIGHT, segLen]} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
    }
    cursor = openingEnd;
  });
  // Remaining wall after last opening
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
    <group ref={groupRef} position={[cx, 0, cz]} rotation={[0, angle, 0]}>
      {wallParts}
      {segments}
      {glassElements}
      {sunlightElements}
    </group>
  );
}

/* ────────────────────────────────────────────
   TexturedFloorTile: renders a floor plane with
   real PBR textures (diff + normal + ARM).
   Uses useTexture for reliable Vite asset handling.
   ──────────────────────────────────────────── */
function TexturedFloorTile({ cx, cz, w, d, floorType }) {
  const texInfo = FLOOR_TEX_MAP[floorType];
  const [diffMap, norMap, armMap] = useTexture([texInfo.diff, texInfo.nor, texInfo.arm]);

  // Configure tiling & color-space once textures are ready
  useMemo(() => {
    const repeatX = w / 3;
    const repeatY = d / 3;
    [diffMap, norMap, armMap].forEach(tex => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeatX, repeatY);
      tex.needsUpdate = true;
    });
    diffMap.colorSpace = THREE.SRGBColorSpace;
  }, [diffMap, norMap, armMap, w, d]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, -0.01, cz]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial
        map={diffMap}
        normalMap={norMap}
        roughnessMap={armMap}
        metalnessMap={armMap}
        roughness={texInfo.roughness}
        metalness={texInfo.metalness}
        envMapIntensity={0.5}
      />
    </mesh>
  );
}

/* ────────────────────────────────────────────
   FloorTile: delegates to TexturedFloorTile for
   the 3 real material types; solid color fallback.
   ──────────────────────────────────────────── */
function FloorTile({ cx, cz, w, d, color, floorType = 'plank_flooring' }) {
  if (FLOOR_TEX_MAP[floorType]) {
    return <TexturedFloorTile cx={cx} cz={cz} w={w} d={d} floorType={floorType} />;
  }
  // Fallback: solid color plane
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, -0.01, cz]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.0} />
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
          { from: [hs, -hs], to: [hs, hs], id: 'right' },
          { from: [hs, hs], to: [-hs, hs], id: 'front' },
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
          { from: [-hw, -hd], to: [hw, -hd], id: 'back' },
          { from: [hw, -hd], to: [hw, splitZ], id: 'right' },
          { from: [hw, splitZ], to: [splitX, splitZ], id: 'l-inner-h' },
          { from: [splitX, splitZ], to: [splitX, hd], id: 'l-inner-v' },
          { from: [splitX, hd], to: [-hw, hd], id: 'front' },
          { from: [-hw, hd], to: [-hw, -hd], id: 'left' },
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
          { from: [-hw, -hd], to: [hw, -hd], id: 'back' },
          { from: [hw, -hd], to: [hw, barZ], id: 'right' },
          { from: [hw, barZ], to: [stemHW, barZ], id: 't-step-r' },
          { from: [stemHW, barZ], to: [stemHW, hd], id: 't-stem-r' },
          { from: [stemHW, hd], to: [-stemHW, hd], id: 'front' },
          { from: [-stemHW, hd], to: [-stemHW, barZ], id: 't-stem-l' },
          { from: [-stemHW, barZ], to: [-hw, barZ], id: 't-step-l' },
          { from: [-hw, barZ], to: [-hw, -hd], id: 'left' },
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
          { from: [-hw, -hd], to: [-hw + armW, -hd], id: 'u-back-l' },
          { from: [-hw + armW, -hd], to: [-hw + armW, innerZ], id: 'u-inner-l' },
          { from: [-hw + armW, innerZ], to: [hw - armW, innerZ], id: 'u-inner-b' },
          { from: [hw - armW, innerZ], to: [hw - armW, -hd], id: 'u-inner-r' },
          { from: [hw - armW, -hd], to: [hw, -hd], id: 'u-back-r' },
          { from: [hw, -hd], to: [hw, hd], id: 'right' },
          { from: [hw, hd], to: [-hw, hd], id: 'front' },
          { from: [-hw, hd], to: [-hw, -hd], id: 'left' },
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
          { from: [hw, -hd], to: [hw, hd], id: 'right' },    // right
          { from: [hw, hd], to: [-hw, hd], id: 'front' },   // front (transparent)
        ],
      };
  }
}

/* ════════════════════════════════════════════
   Room Component
   ════════════════════════════════════════════ */
export default function Room({ width, depth, wallColor, floorColor, floorType = 'solid', shape = 'rectangle', windows = [], doors = [] }) {
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

      {/* Walls (with optional window/door cutouts) */}
      {walls.map((seg, i) => (
        <Wall
          key={`wall-${shape}-${i}`}
          from={seg.from}
          to={seg.to}
          color={wallColor}
          wallId={seg.id}
          windows={windows}
          doors={doors}
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