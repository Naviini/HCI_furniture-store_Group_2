import React, { useRef, useMemo } from 'react';
import { TransformControls, Html, Outlines, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

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
import titanicLampPath    from '../assets/lap and lights/titanic_lamp/scene.gltf?url';
import modernSofaPath     from '../assets/sofa/modern__sofa/scene.gltf?url';
import sofaPath           from '../assets/sofa/sofa/scene.gltf?url';
import sofaChairPath      from '../assets/sofa/sofa_chair/scene.gltf?url';
import computerTablePath  from '../assets/table/computer_table/scene.gltf?url';
import diningSetPath      from '../assets/table/modern_dining_room_table_set/scene.gltf?url';
import diningTablePath    from '../assets/table/simple_dining_table/scene.gltf?url';

/* Lamps that can be placed on top of other furniture (Y > 0) */
const TABLE_LAMP_TYPES = ['Desk Lamp', 'Titanic Lamp'];
const WALL_HEIGHT = 5; // must match Room.jsx WALL_HEIGHT
const WALL_INNER  = 0.1; // half of WALL_THICK (0.2) — inner face offset

/* Approximate XZ footprint radius (metres) per furniture type.
   Used for wall collision margin and inter-item overlap prevention. */
const FURNITURE_RADIUS = {
  'Coffee Table':   0.7,
  'Chair':          0.4,
  'Drawer':         0.4,
  'Bed':            1.1,
  'Poliform Bed':   1.2,
  'Desk Lamp':      0.15,
  'TV Stand':       1.0,
  'TV Stand 3':     0.8,
  'File Cabinet':   0.4,
  'Computer Chair': 0.4,
  'Lounge Chair':   0.6,
  'Titanic Lamp':   0.25,
  'Modern Sofa':    1.2,
  'Sofa':           1.1,
  'Sofa Chair':     0.6,
  'Computer Table': 0.8,
  'Dining Set':     1.3,
  'Dining Table':   1.0,
};
const DEFAULT_RADIUS = 0.5;

const MODEL_MAP = {
  'Coffee Table':   { path: coffeeTablePath,   scale: 2.5,  yOffset: 0 },
  'Chair':          { path: chairPath,         scale: 2,    yOffset: 0 },
  'Drawer':         { path: drawerPath,        scale: 2.5,  yOffset: 0 },
  'Bed':            { path: bed1Path,          scale: 1,    yOffset: 0 },
  'Poliform Bed':   { path: poliformBedPath,   scale: 0.02, yOffset: 0 },
  'Desk Lamp':      { path: deskLampPath,      scale: 0.5,  yOffset: 0 },
  'TV Stand':       { path: tvStandPath,       scale: 0.002,  yOffset: 0 },
  'TV Stand 3':     { path: tvStand3Path,      scale: 0.02, yOffset: 0 },
  'File Cabinet':   { path: fileCabinetPath,   scale: 0.02, yOffset: 0 },
  'Computer Chair': { path: computerChairPath, scale: 1,    yOffset: 0 },
  'Lounge Chair':   { path: loungeChairPath,   scale: 1,    yOffset: 0 },
  'Titanic Lamp':   { path: titanicLampPath,   scale: 1,    yOffset: 0 },
  'Modern Sofa':    { path: modernSofaPath,    scale: 1,    yOffset: 0 },
  'Sofa':           { path: sofaPath,          scale: 1.8,    yOffset: 0 },
  'Sofa Chair':     { path: sofaChairPath,     scale: 1,    yOffset: 0 },
  'Computer Table': { path: computerTablePath, scale: 1,    yOffset: 0 },
  'Dining Set':     { path: diningSetPath,     scale: 0.004,    yOffset: 0 },
  'Dining Table':   { path: diningTablePath,   scale: 0.003,    yOffset: 0 },
};

/* ── Pre‑load all glTF assets so they're cached ── */
useGLTF.preload(coffeeTablePath);
useGLTF.preload(chairPath);
useGLTF.preload(drawerPath);
useGLTF.preload(bed1Path);
useGLTF.preload(poliformBedPath);
useGLTF.preload(deskLampPath);
useGLTF.preload(tvStandPath);
useGLTF.preload(tvStand3Path);
useGLTF.preload(fileCabinetPath);
useGLTF.preload(computerChairPath);
useGLTF.preload(loungeChairPath);
useGLTF.preload(titanicLampPath);
useGLTF.preload(modernSofaPath);
useGLTF.preload(sofaPath);
useGLTF.preload(sofaChairPath);
useGLTF.preload(computerTablePath);
useGLTF.preload(diningSetPath);
useGLTF.preload(diningTablePath);

/* ── Component that renders a loaded glTF scene ── */
function ModelMesh({ modelInfo, color, isSelected, onClick }) {
  const { scene } = useGLTF(modelInfo.path);
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Optionally tint by multiplying the existing material
        if (color && color !== '#888888') {
          child.material = child.material.clone();
          child.material.color.set(color);
        }
      }
    });
    return clone;
  }, [scene, color]);

  return (
    <group onClick={onClick} scale={modelInfo.scale}>
      <primitive object={clonedScene} position={[0, modelInfo.yOffset, 0]} />
    </group>
  );
}

/* ── Fallback primitive geometry for items without a glTF model ── */
function PrimitiveMesh({ type, color, isSelected, onClick }) {
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
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      {isSelected && <Outlines thickness={2} color="#3b82f6" />}
    </mesh>
  );
}

export default function Furniture({
  data, isSelected, onSelect, onChange, mode, setIsDragging, roomConfig, allItems = []
}) {
  const { id, type, position, rotation, scale, color } = data;
  const meshRef = useRef();
  const controlsRef = useRef();
  const modelInfo = MODEL_MAP[type];
  const isEditable = isSelected;

  const isLamp = TABLE_LAMP_TYPES.includes(type);
  const radius = FURNITURE_RADIUS[type] ?? DEFAULT_RADIUS;

  // Room boundary limits (half-extents centred at 0,0)
  const hw = roomConfig && roomConfig.shape !== 'open' ? roomConfig.width / 2 : Infinity;
  const hd = roomConfig && roomConfig.shape !== 'open' ? roomConfig.depth / 2 : Infinity;

  // Clamp position inside room walls, keeping a margin = wall inner face + item radius
  const clampPosition = (pos) => {
    const margin = WALL_INNER + radius;
    const x = isFinite(hw) ? Math.max(-hw + margin, Math.min(hw - margin, pos.x)) : pos.x;
    const z = isFinite(hd) ? Math.max(-hd + margin, Math.min(hd - margin, pos.z)) : pos.z;
    const y = isLamp ? Math.max(0, Math.min(WALL_HEIGHT, pos.y)) : 0;
    return { x, y, z };
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
          <ModelMesh modelInfo={modelInfo} color={color} isSelected={isSelected} onClick={handleClick} />
        ) : (
          <PrimitiveMesh type={type} color={color} isSelected={isSelected} onClick={handleClick} />
        )}

        {/* Light source for Lamps */}
        {(type === 'Lamp' || type === 'Desk Lamp' || type === 'Titanic Lamp') && (
          <pointLight position={[0, 0.5, 0]} intensity={2} distance={8} color="#ffddaa" castShadow />
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