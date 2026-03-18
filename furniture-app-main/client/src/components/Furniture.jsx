import React, { useRef, useMemo } from 'react';
import { TransformControls, Html, Outlines, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── glTF model paths (from /src/assets) ── */
import coffeeTablePath    from '../assets/table/coffee_table_round_01_1k/coffee_table_round_01_1k.gltf?url';
import chairPath          from '../assets/chair/plastic_monobloc_chair_01/plastic_monobloc_chair_01_1k.gltf?url';
import drawerPath         from '../assets/Drawer/vintage_wooden_drawer_01_1k.gltf?url';
import bed1Path           from '../assets/Bed/bed 1/scene.gltf?url';
import poliformBedPath    from '../assets/Bed/poliform_bed/scene.gltf?url';
import deskLampPath       from '../assets/lap and lights/desk_lamp/scene.gltf?url';
import tvStandPath        from '../assets/Tv stand/modern_tv_entertainment_center/scene.gltf?url';
import tvStand3Path       from '../assets/Tv stand/tv_stand_3/scene.gltf?url';
import fileCabinetPath    from '../assets/cabinet/file_cabinets/scene.gltf?url';
import computerChairPath  from '../assets/chair/black_computer_chair_-_mesh_back_support/scene.gltf?url';
import loungeChairPath    from '../assets/chair/lounge_chair/scene.gltf?url';
import modernSofaPath     from '../assets/sofa/modern__sofa/scene.gltf?url';
import sofaPath           from '../assets/sofa/sofa/scene.gltf?url';
import sofaChairPath      from '../assets/sofa/sofa_chair/scene.gltf?url';
import computerTablePath  from '../assets/table/computer_table/scene.gltf?url';
import diningSetPath      from '../assets/table/modern_dining_room_table_set/scene.gltf?url';
import diningTablePath    from '../assets/table/simple_dining_table/scene.gltf?url';
import tablePath          from '../assets/table/table/scene.gltf?url';
import industrialTablePath from '../assets/table/industrial_table/scene.gltf?url';
import floorLampPath      from '../assets/lap and lights/floor_lamp/scene.gltf?url';
import ericFloorLampPath  from '../assets/lap and lights/eric_floor_lamp_white/scene.gltf?url';

/* ── NEW BATHROOM ASSETS ── */
import bathroomAsset1Path     from '../assets/bathroom/bathroom_asset_part_1/scene.gltf?url';
import bathroomClosetPath     from '../assets/bathroom/bathroom_closet/scene.gltf?url';
import bathtubPath            from '../assets/bathroom/bathtub/scene.gltf?url';
import bathtub2Path           from '../assets/bathroom/bathtub (1)/scene.gltf?url';
import sinkVanityPath         from '../assets/bathroom/sink_and_vanity/scene.gltf?url';
import sinkFaucetPath         from '../assets/bathroom/sink_with_faucet/scene.gltf?url';
import toiletPath             from '../assets/bathroom/toilet/scene.gltf?url';
import toiletVaaPath          from '../assets/bathroom/toilet_vaa-772662wh/scene.gltf?url';

/* ── NEW BEDROOM ASSETS ── */
import bedAgapePath           from '../assets/Bed/bed_agape (1)/scene.gltf?url';

/* ── NEW CABINET/STORAGE ASSETS ── */
import chocolateBookshelfPath from '../assets/cabinet/chocolate_beech_bookshelf_free/scene.gltf?url';
import modernWardrobePath     from '../assets/cabinet/modern_wooden_wardrobe/scene.gltf?url';
import wardrobePath           from '../assets/cabinet/wardrobe/scene.gltf?url';
import wardrobe2Path          from '../assets/cabinet/wardrobe (1)/scene.gltf?url';
import banheiraMaestriPath    from '../assets/cabinet/banheira_de_imersao_maestri_-_b1203w/scene.gltf?url';

/* ── NEW KITCHEN ASSETS ── */
import europeanCabinetPath    from '../assets/kitchen/european_style_dining_cabinet/scene.gltf?url';
import kitchenPath            from '../assets/kitchen/kitchen/scene.gltf?url';
import kitchenCabinet1Path    from '../assets/kitchen/kitchen_cabinet_1/scene.gltf?url';
import modernFridgePath       from '../assets/kitchen/modern_fridge/scene.gltf?url';
import smallKitchenPath       from '../assets/kitchen/small_kitchen_with_oven/scene.gltf?url';

/* ── NEW SEATING ASSETS ── */
import couchCompletePath      from '../assets/chair/couch_complete_set/scene.gltf?url';
import diningChairPath        from '../assets/chair/dining_chair/scene.gltf?url';
import outdoorSofaPath        from '../assets/chair/outdoors_sofa/scene.gltf?url';

/* Lamps that can be placed on top of other furniture (Y > 0) - FLOOR LAMPS ONLY */
const TABLE_LAMP_TYPES = ['Desk Lamp']; // Only desk lamp needs to be placed on surfaces
const FLOOR_LAMP_TYPES = ['Floor Lamp', 'Eric Floor Lamp']; // These can be placed on floor
const WALL_HEIGHT = 5; // must match Room.jsx WALL_HEIGHT
const WALL_INNER  = 0.1; // half of WALL_THICK (0.2) — inner face offset

/* Approximate XZ footprint radius (metres) per furniture type.
   Used for wall collision margin and inter-item overlap prevention. */
const FURNITURE_RADIUS = {
  'Coffee Table':     0.7,
  'Chair':            0.4,
  'Drawer':           0.4,
  'Bed':              1.1,
  'Poliform Bed':     1.2,
  'Desk Lamp':        0.15,
  'Floor Lamp':       0.2,
  'Eric Floor Lamp':  0.2,
  'TV Stand':         1.0,
  'TV Stand 3':       0.8,
  'File Cabinet':     0.4,
  'Computer Chair':   0.4,
  'Lounge Chair':     0.6,
  'Modern Sofa':      1.2,
  'Sofa':             1.1,
  'Sofa Chair':       0.6,
  'Computer Table':   0.8,
  'Dining Set':       1.3,
  'Dining Table':     1.0,
  'Table':            0.8,
  'Industrial Table': 1.2,
  /* ── NEW BATHROOM ── */
  'Bathroom Asset 1':  0.8,
  'Bathroom Closet':   0.6,
  'Bathtub':           1.5,
  'Bathtub 2':         1.4,
  'Sink & Vanity':     0.8,
  'Sink with Faucet':  0.6,
  'Toilet':            0.5,
  'Toilet Vaa':        0.5,
  /* ── NEW BEDROOM ── */
  'Bed Agape':         1.3,
  /* ── NEW CABINET/STORAGE ── */
  'Chocolate Bookshelf': 0.6,
  'Modern Wardrobe':   0.8,
  'Wardrobe':          0.8,
  'Wardrobe 2':        0.8,
  'Banheira Maestri':  1.6,
  /* ── NEW KITCHEN ── */
  'European Cabinet':  1.0,
  'Kitchen':           2.0,
  'Kitchen Cabinet 1': 0.8,
  'Modern Fridge':     0.7,
  'Small Kitchen':     1.5,
  /* ── NEW SEATING ── */
  'Couch Complete':    1.8,
  'Dining Chair':      0.4,
  'Outdoor Sofa':      1.6,
};
const DEFAULT_RADIUS = 0.5;

const MODEL_MAP = {
  'Coffee Table':     { path: coffeeTablePath,   scale: 2.5,   yOffset: 0 },
  'Chair':            { path: chairPath,         scale: 2,     yOffset: 0 },
  'Drawer':           { path: drawerPath,        scale: 2.5,   yOffset: 0 },
  'Bed':              { path: bed1Path,          scale: 1,     yOffset: 0 },
  'Poliform Bed':     { path: poliformBedPath,   scale: 0.02,  yOffset: 0 },
  'Desk Lamp':        { path: deskLampPath,      scale: 0.5,   yOffset: 0 },
  'Floor Lamp':       { path: floorLampPath,     scale: 1.1,   yOffset: 0 },
  'Eric Floor Lamp':  { path: ericFloorLampPath, scale: 0.014, yOffset: 0 },
  'TV Stand':         { path: tvStandPath,       scale: 0.002, yOffset: 0 },
  'TV Stand 3':       { path: tvStand3Path,      scale: 0.02,  yOffset: 0 },
  'File Cabinet':     { path: fileCabinetPath,   scale: 0.02,  yOffset: 0 },
  'Computer Chair':   { path: computerChairPath, scale: 1.4,   yOffset: 0 },
  'Lounge Chair':     { path: loungeChairPath,   scale: 2,     yOffset: 0 },
  'Modern Sofa':      { path: modernSofaPath,    scale: 1.2,   yOffset: 0 },
  'Sofa':             { path: sofaPath,          scale: 1.8,   yOffset: 0 },
  'Sofa Chair':       { path: sofaChairPath,     scale: 1,     yOffset: 0 },
  'Computer Table':   { path: computerTablePath, scale: 1,     yOffset: 0 },
  'Dining Set':       { path: diningSetPath,     scale: 0.004, yOffset: 0 },
  'Dining Table':     { path: diningTablePath,   scale: 0.002, yOffset: 0 },
  'Table':            { path: tablePath,         scale: 0.02,  yOffset: 0 },
  'Industrial Table': { path: industrialTablePath, scale: 2,   yOffset: 0 },
  /* ── NEW BATHROOM ── */
  'Bathroom Asset 1':  { path: bathroomAsset1Path,     scale: 1,     yOffset: 1.5 },
  'Bathroom Closet':   { path: bathroomClosetPath,     scale: 1.5,   yOffset: 0 },
  'Bathtub':           { path: bathtubPath,            scale: 0.02,  yOffset: 0.1 },
  'Bathtub 2':         { path: bathtub2Path,           scale: 1.4,   yOffset: 0 },
  'Sink & Vanity':     { path: sinkVanityPath,         scale: 1,     yOffset: 1 },
  'Sink with Faucet':  { path: sinkFaucetPath,         scale: 1.5,   yOffset: 0 },
  'Toilet':            { path: toiletPath,             scale: 1.8,   yOffset: 0 },
  'Toilet Vaa':        { path: toiletVaaPath,          scale: 0.02,  yOffset: 0.1 },
  /* ── NEW BEDROOM ── */
  'Bed Agape':         { path: bedAgapePath,           scale: 0.02,  yOffset: 0.1 },
  /* ── NEW CABINET/STORAGE ── */
  'Chocolate Bookshelf': { path: chocolateBookshelfPath, scale: 0.009, yOffset: 0.1 },
  'Modern Wardrobe':   { path: modernWardrobePath,     scale: 1,     yOffset: 0 },
  'Wardrobe':          { path: wardrobePath,           scale: 0.01,  yOffset: 0.1 },
  'Wardrobe 2':        { path: wardrobe2Path,          scale: 1,     yOffset: 0 },
  'Banheira Maestri':  { path: banheiraMaestriPath,    scale: 0.002, yOffset: 0.1 },
  /* ── NEW KITCHEN ── */
  'European Cabinet':  { path: europeanCabinetPath,    scale: 0.01,  yOffset: 0.1 },
  'Kitchen':           { path: kitchenPath,            scale: 0.6,   yOffset: 0 },
  'Kitchen Cabinet 1': { path: kitchenCabinet1Path,    scale: 8,     yOffset: 0 },
  'Modern Fridge':     { path: modernFridgePath,       scale: 2,     yOffset: 0 },
  'Small Kitchen':     { path: smallKitchenPath,       scale: 2,     yOffset: 0 },
  /* ── NEW SEATING ── */
  'Couch Complete':    { path: couchCompletePath,      scale: 0.03,  yOffset: 0.1 },
  'Dining Chair':      { path: diningChairPath,        scale: 1,     yOffset: 1 },
  'Outdoor Sofa':      { path: outdoorSofaPath,        scale: 1,     yOffset: 0 },
};

/* ── Pre‑load all glTF assets so they're cached ── */
useGLTF.preload(coffeeTablePath);
useGLTF.preload(chairPath);
useGLTF.preload(drawerPath);
useGLTF.preload(bed1Path);
useGLTF.preload(poliformBedPath);
useGLTF.preload(deskLampPath);
useGLTF.preload(floorLampPath);
useGLTF.preload(ericFloorLampPath);
useGLTF.preload(tvStandPath);
useGLTF.preload(tvStand3Path);
useGLTF.preload(fileCabinetPath);
useGLTF.preload(computerChairPath);
useGLTF.preload(loungeChairPath);
useGLTF.preload(modernSofaPath);
useGLTF.preload(sofaPath);
useGLTF.preload(sofaChairPath);
useGLTF.preload(computerTablePath);
useGLTF.preload(diningSetPath);
useGLTF.preload(diningTablePath);
useGLTF.preload(tablePath);
useGLTF.preload(industrialTablePath);

/* ── Pre‑load NEW bathroom assets ── */
useGLTF.preload(bathroomAsset1Path);
useGLTF.preload(bathroomClosetPath);
useGLTF.preload(bathtubPath);
useGLTF.preload(bathtub2Path);
useGLTF.preload(sinkVanityPath);
useGLTF.preload(sinkFaucetPath);
useGLTF.preload(toiletPath);
useGLTF.preload(toiletVaaPath);

/* ── Pre‑load NEW bedroom assets ── */
useGLTF.preload(bedAgapePath);

/* ── Pre‑load NEW cabinet/storage assets ── */
useGLTF.preload(chocolateBookshelfPath);
useGLTF.preload(modernWardrobePath);
useGLTF.preload(wardrobePath);
useGLTF.preload(wardrobe2Path);
useGLTF.preload(banheiraMaestriPath);

/* ── Pre‑load NEW kitchen assets ── */
useGLTF.preload(europeanCabinetPath);
useGLTF.preload(kitchenPath);
useGLTF.preload(kitchenCabinet1Path);
useGLTF.preload(modernFridgePath);
useGLTF.preload(smallKitchenPath);

/* ── Pre‑load NEW seating assets ── */
useGLTF.preload(couchCompletePath);
useGLTF.preload(diningChairPath);
useGLTF.preload(outdoorSofaPath);

/* ── Component that renders a loaded glTF scene ── */
function ModelMesh({ modelInfo, color, brightness = 1, roughness, metalness, isSelected, onClick }) {
  const { scene } = useGLTF(modelInfo.path);
  const groundedYOffset = useMemo(() => {
    const bbox = new THREE.Box3().setFromObject(scene);
    // Lift models whose geometry origin is below floor level.
    const autoLift = Math.max(0, -bbox.min.y);
    return modelInfo.yOffset + autoLift;
  }, [scene, modelInfo.yOffset]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = child.material.clone();
        if (color && color !== '#888888') {
          child.material.color.set(color);
        }
        if (roughness !== undefined) child.material.roughness = roughness;
        if (metalness !== undefined) child.material.metalness = metalness;
        /* ── Shading: darken or brighten via multiplier / emissive ── */
        if (brightness < 1) {
          child.material.color.multiplyScalar(Math.max(0.05, brightness));
        }
        child.material.emissiveIntensity = brightness > 1 ? (brightness - 1) * 0.45 : 0;
        if (!child.material.emissive) child.material.emissive = new THREE.Color(0, 0, 0);
        if (brightness > 1) child.material.emissive.set('#ffffff');
      }
    });
    return clone;
  }, [scene, color, brightness, roughness, metalness]);

  return (
    <group onClick={onClick} scale={modelInfo.scale}>
      <primitive object={clonedScene} position={[0, groundedYOffset, 0]} />
    </group>
  );
}

/* ── Fallback primitive geometry for items without a glTF model ── */
function PrimitiveMesh({ type, color, brightness = 1, roughness, metalness, isSelected, onClick }) {
  const shadedColor = useMemo(() => {
    if (brightness >= 1) return color;
    return '#' + new THREE.Color(color).multiplyScalar(Math.max(0.05, brightness)).getHexString();
  }, [color, brightness]);

  const getGeometry = () => {
    switch (type) {
      case 'Table': return <boxGeometry args={[1.5, 0.1, 1]} />;
      case 'Bed': return <boxGeometry args={[2, 0.5, 3]} />;
      case 'Cabinet': return <boxGeometry args={[1, 2, 0.8]} />;
      case 'Lamp': return <coneGeometry args={[0.3, 1, 32]} />;
      case 'Sofa': return <boxGeometry args={[2.5, 0.6, 1]} />;
      default: return <boxGeometry args={[0.5, 0.5, 0.5]} />;
    }
  };

  return (
    <mesh onClick={onClick} castShadow receiveShadow>
      {getGeometry()}
      <meshStandardMaterial
        color={shadedColor}
        roughness={roughness ?? 0.3}
        metalness={metalness ?? 0.1}
        emissive="#ffffff"
        emissiveIntensity={brightness > 1 ? (brightness - 1) * 0.45 : 0}
      />
      {isSelected && <Outlines thickness={2} color="#3b82f6" />}
    </mesh>
  );
}

export default function Furniture({
  data, isSelected, onSelect, onChange, mode, setIsDragging, roomConfig, allItems = []
}) {
  const { id, type, position, rotation, scale, color, roughness, metalness, brightness = 1 } = data;
  const meshRef = useRef();
  const controlsRef = useRef();
  const modelInfo = MODEL_MAP[type];
  const isEditable = isSelected;

  const isTableLamp = TABLE_LAMP_TYPES.includes(type);
  const isFloorLamp = FLOOR_LAMP_TYPES.includes(type);
  const isLamp = isTableLamp || isFloorLamp;
  const radius = FURNITURE_RADIUS[type] ?? DEFAULT_RADIUS;

  // Room boundary limits (half-extents centred at 0,0)
  const hw = roomConfig && roomConfig.shape !== 'open' ? roomConfig.width / 2 : Infinity;
  const hd = roomConfig && roomConfig.shape !== 'open' ? roomConfig.depth / 2 : Infinity;

  // Clamp position inside room walls, keeping a margin = wall inner face + item radius
  const clampPosition = (pos) => {
    const margin = WALL_INNER + radius;
    const x = isFinite(hw) ? Math.max(-hw + margin, Math.min(hw - margin, pos.x)) : pos.x;
    const z = isFinite(hd) ? Math.max(-hd + margin, Math.min(hd - margin, pos.z)) : pos.z;

    let y = 0; // Default floor level for most furniture

    if (isTableLamp) {
      // Table lamps must be placed on surfaces (Y > 0.5 to be on top of tables/drawers)
      y = Math.max(1, Math.min(WALL_HEIGHT, pos.y));
    } else if (isFloorLamp) {
      // Floor lamps can be placed at floor level or elevated
      y = Math.max(0, Math.min(WALL_HEIGHT, pos.y));
    } else {
      // All other furniture stays at floor level
      y = 0;
    }

    return { x, y, z };
  };

  // Check if table lamp is being placed on a valid surface (table, drawer, cabinet, etc.)
  const findSurfaceBelow = (pos) => {
    if (!isTableLamp) return null;

    const SURFACE_TYPES = ['Coffee Table', 'Computer Table', 'Dining Table', 'Table', 'Industrial Table',
                          'Drawer', 'File Cabinet', 'TV Stand', 'TV Stand 3', 'Kitchen Cabinet 1'];

    for (const other of allItems) {
      if (other.id === id || !SURFACE_TYPES.includes(other.type)) continue;

      const [ox, oy, oz] = other.position;
      const otherRadius = FURNITURE_RADIUS[other.type] ?? DEFAULT_RADIUS;

      // Check if lamp is within the surface area (X and Z) and at appropriate height (Y)
      const dx = Math.abs(pos.x - ox);
      const dz = Math.abs(pos.z - oz);
      const dy = pos.y - oy;

      if (dx <= otherRadius && dz <= otherRadius && dy > 0.3 && dy < 1.5) {
        return other; // Found a valid surface
      }
    }
    return null;
  };

  // Push this item away from any overlapping items
  const resolveOverlap = (pos) => {
    let x = pos.x;
    let z = pos.z;
    for (const other of allItems) {
      if (other.id === id) continue;
      const otherRadius = FURNITURE_RADIUS[other.type] ?? DEFAULT_RADIUS;
      const minDist = radius + otherRadius;
      const dx = x - other.position[0];
      const dz = z - other.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < minDist && dist > 0.001) {
        const push = (minDist - dist) / dist;
        x += dx * push;
        z += dz * push;
      }
    }
    return { x, y: pos.y, z };
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(id);
  };

  // Enforce boundaries every frame
  useFrame(() => {
    if (meshRef.current) {
      const p = meshRef.current.position;
      const c = clampPosition(p);
      if (p.x !== c.x || p.y !== c.y || p.z !== c.z) {
        p.set(c.x, c.y, c.z);
      }
    }
  });

  return (
    <>
      {isEditable && (
        <TransformControls
          ref={controlsRef}
          object={meshRef}
          mode="translate"
          onMouseDown={() => { if (setIsDragging) setIsDragging(true); }}
          onMouseUp={() => {
            if (setIsDragging) setIsDragging(false);
            if (meshRef.current) {
              const p = meshRef.current.position;
              let c = clampPosition(p);

              // Special handling for table lamps - snap to surface if available
              if (isTableLamp) {
                const surface = findSurfaceBelow(c);
                if (surface) {
                  // Snap to surface height
                  c.y = surface.position[1] + 0.8; // Place on top of surface
                } else {
                  // No valid surface found - keep lamp at minimum height for tables
                  c.y = Math.max(0.8, c.y);
                }
              }

              c = resolveOverlap(c);
              c = clampPosition(c); // re-clamp in case overlap push hit a wall
              p.set(c.x, c.y, c.z);
              onChange(id, {
                position: meshRef.current.position.toArray(),
                rotation: meshRef.current.rotation.toArray(),
                scale: meshRef.current.scale.toArray(),
              });
            }
          }}
        />
      )}

      <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
        {modelInfo ? (
          <ModelMesh modelInfo={modelInfo} color={color} brightness={brightness} roughness={roughness} metalness={metalness} isSelected={isSelected} onClick={handleClick} />
        ) : (
          <PrimitiveMesh type={type} color={color} brightness={brightness} roughness={roughness} metalness={metalness} isSelected={isSelected} onClick={handleClick} />
        )}

        {/* Light source for Lamps */}
        {(type === 'Lamp' || type === 'Desk Lamp' || type === 'Floor Lamp' || type === 'Eric Floor Lamp') && (
          <pointLight position={[0., 0.5, 0]} intensity={2} distance={8} color="#f1dab8" castShadow />
        )}

        {/* Label when selected */}
        {isSelected && (
          <Html position={[0, 1.5, 0]} center>
            <div style={{ 
              background: '#3b82f6', color: 'white', padding: '4px 8px', 
              borderRadius: '4px', fontSize: '12px', pointerEvents: 'none',
              whiteSpace: 'nowrap'
            }}>
              {type}
            </div>
          </Html>
        )}
      </group>
    </>
  );
}