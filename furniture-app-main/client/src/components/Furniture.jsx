import React, { useRef, useMemo } from 'react';
import { TransformControls, Html, Outlines, useGLTF } from '@react-three/drei';

/* ── glTF model paths (from /src/assets) ── */
import coffeeTablePath from '../assets/coffee_table_round_01_1k.gltf?url';
import chairPath from '../assets/plastic_monobloc_chair_01_1k.gltf?url';
import drawerPath from '../assets/vintage_wooden_drawer_01_1k.gltf?url';

const MODEL_MAP = {
  'Coffee Table': { path: coffeeTablePath, scale: 2.5, yOffset: 0 },
  'Chair':        { path: chairPath,       scale: 2,   yOffset: 0 },
  'Drawer':       { path: drawerPath,      scale: 2.5, yOffset: 0 },
};

/* ── Pre‑load all glTF assets so they're cached ── */
useGLTF.preload(coffeeTablePath);
useGLTF.preload(chairPath);
useGLTF.preload(drawerPath);

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
  data, isSelected, onSelect, onChange, mode, setIsDragging 
}) {
  const { id, type, position, rotation, scale, color } = data;
  const meshRef = useRef();
  const controlsRef = useRef();
  const modelInfo = MODEL_MAP[type];
  const isEditable = isSelected && mode !== 'Tour';

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(id);
  };

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
        {type === 'Lamp' && (
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