import React, { useRef, useState, useCallback, useEffect } from 'react';


/* ────────────────────────────────────────────
   Room outline points for each shape (same logic as Room.jsx)
   Returns an array of [x, z] forming a closed polygon
   ──────────────────────────────────────────── */
function getRoomOutline(shape, w, d, customPoints = []) {
  const hw = w / 2;
  const hd = d / 2;

  switch (shape) {
    case 'square': {
      const s = Math.min(w, d);
      const hs = s / 2;
      return [[-hs, -hs], [hs, -hs], [hs, hs], [-hs, hs]];
    }
    case 'l-shape':
      return [
        [-hw, -hd], [hw, -hd], [hw, 0],
        [0, 0], [0, hd], [-hw, hd],
      ];
    case 't-shape': {
      const barZ = -hd + d * 0.35;
      const stemHW = w * 0.25;
      return [
        [-hw, -hd], [hw, -hd], [hw, barZ],
        [stemHW, barZ], [stemHW, hd],
        [-stemHW, hd], [-stemHW, barZ],
        [-hw, barZ],
      ];
    }
    case 'u-shape': {
      const armW = w * 0.25;
      const innerZ = hd - d * 0.3;
      return [
        [-hw, -hd], [-hw + armW, -hd], [-hw + armW, innerZ],
        [hw - armW, innerZ], [hw - armW, -hd], [hw, -hd],
        [hw, hd], [-hw, hd],
      ];
    }
    case 'z-shape': {
      const topW = w * 0.42;
      const rightW = w * 0.32;
      const notchDepth = d * 0.3;
      const innerZ1 = -hd + notchDepth;
      const innerZ2 = hd - notchDepth;
      return [
        [-hw, -hd],
        [-hw + topW, -hd],
        [-hw + topW, innerZ1],
        [hw, innerZ1],
        [hw, hd],
        [hw - rightW, hd],
        [hw - rightW, innerZ2],
        [-hw, innerZ2],
      ];
    }
    case 'cut': {
      const cutW = w * 0.32;
      const cutD = d * 0.32;
      return [
        [-hw, -hd],
        [hw - cutW, -hd],
        [hw, -hd + cutD],
        [hw, hd],
        [-hw, hd],
      ];
    }
    case 'rounded': {
      const segments = 7;
      const rx = hw;
      const rz = d * 0.58;
      const topCenterZ = hd - rz;
      const pts = [[-hw, hd], [-hw, -hd]];
      for (let i = 0; i <= segments; i += 1) {
        const t = i / segments;
        const a = Math.PI - t * Math.PI;
        const x = Math.cos(a) * rx;
        const z = topCenterZ + Math.sin(a) * rz;
        pts.push([x, z]);
      }
      pts.push([hw, hd]);
      return pts;
    }
    case 'custom':
      if (Array.isArray(customPoints) && customPoints.length >= 3) {
        return customPoints;
      }
      return [];
    case 'open':
    case 'rectangle':
    default:
      return [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]];
  }
}

/* ────────────────────────────────────────────
   Furniture icon shapes (returns SVG children)
   ──────────────────────────────────────────── */
const ITEM_SIZES = {
  'Coffee Table': { w: 1.2, d: 1.2 },
  'Chair':        { w: 0.6, d: 0.6 },
  'Drawer':       { w: 1.0, d: 0.5 },
  'Table':        { w: 1.5, d: 1.0 },
  'Bed':          { w: 2.0, d: 3.0 },
  'Lamp':         { w: 0.4, d: 0.4 },
  'Sofa':         { w: 2.5, d: 1.0 },
  'Cabinet':      { w: 1.0, d: 0.8 },
};

const ITEM_COLORS = {
  'Coffee Table': '#a0522d',
  'Chair':        '#4a90d9',
  'Drawer':       '#8b6914',
  'Table':        '#7c6f64',
  'Bed':          '#6a5acd',
  'Lamp':         '#ffa500',
  'Sofa':         '#3cb371',
  'Cabinet':      '#808080',
};

/* ════════════════════════════════════════════
   BlueprintView Component
   ════════════════════════════════════════════ */
export default function BlueprintView({
  roomConfig,
  items,
  selectedId,
  setSelectedId,
  updateItem,
  windows = [],
  doors = [],
  drawWallEnabled = false,
  onCustomRoomCreated,
  onCancelDrawWall,
}) {
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(null); // { id, offsetX, offsetZ }
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });
  const [draftPoints, setDraftPoints] = useState([]);

  // Observe container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { width: roomW, depth: roomD, shape, floorColor, wallColor, customPoints } = roomConfig;
  const outline = getRoomOutline(shape, roomW, roomD, customPoints);

  // Compute scale: fit room into container with padding
  const PAD = 80;
  const availW = containerSize.w - PAD * 2;
  const availH = containerSize.h - PAD * 2;
  const scale = Math.min(availW / roomW, availH / roomD);

  // Transform: world (meters) → SVG px. Origin is center of SVG.
  const cx = containerSize.w / 2;
  const cy = containerSize.h / 2;
  const toSvgX = (worldX) => cx + worldX * scale;
  const toSvgY = (worldZ) => cy + worldZ * scale;   // Z maps to Y on screen
  const toWorldX = (svgX) => (svgX - cx) / scale;
  const toWorldZ = (svgY) => (svgY - cy) / scale;

  // Room outline as SVG polygon points string
  const outlinePoints = outline.map(([x, z]) => `${toSvgX(x)},${toSvgY(z)}`).join(' ');
  const draftPointsSvg = draftPoints.map(([x, z]) => `${toSvgX(x)},${toSvgY(z)}`).join(' ');

  // Drag handlers
  const handlePointerDown = useCallback((e, item) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedId(item.id);
    const svgRect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - svgRect.left;
    const my = e.clientY - svgRect.top;
    setDragging({
      id: item.id,
      offsetX: mx - toSvgX(item.position[0]),
      offsetZ: my - toSvgY(item.position[2]),
    });
  }, [setSelectedId, scale, cx, cy]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return;
    const svgRect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - svgRect.left;
    const my = e.clientY - svgRect.top;
    const newX = toWorldX(mx - dragging.offsetX);
    const newZ = toWorldZ(my - dragging.offsetZ);
    const item = items.find(i => i.id === dragging.id);
    if (item) {
      updateItem(dragging.id, { position: [newX, item.position[1], newZ] });
    }
  }, [dragging, items, updateItem, scale, cx, cy]);

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  const finishDrawing = useCallback(() => {
    if (!drawWallEnabled || draftPoints.length < 3) return;
    onCustomRoomCreated?.(draftPoints);
    setDraftPoints([]);
  }, [drawWallEnabled, draftPoints, onCustomRoomCreated]);

  const cancelDrawing = useCallback(() => {
    setDraftPoints([]);
    onCancelDrawWall?.();
  }, [onCancelDrawWall]);

  const handleBgClick = useCallback((e) => {
    if (!drawWallEnabled) {
      setSelectedId(null);
      return;
    }

    const svgRect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - svgRect.left;
    const my = e.clientY - svgRect.top;

    const rawX = toWorldX(mx);
    const rawZ = toWorldZ(my);
    const clampedX = Math.max(-roomW / 2, Math.min(roomW / 2, rawX));
    const clampedZ = Math.max(-roomD / 2, Math.min(roomD / 2, rawZ));
    const nextPoint = [Number(clampedX.toFixed(3)), Number(clampedZ.toFixed(3))];

    if (draftPoints.length >= 3) {
      const [fx, fz] = draftPoints[0];
      const dx = fx - nextPoint[0];
      const dz = fz - nextPoint[1];
      if (Math.sqrt(dx * dx + dz * dz) < 0.5) {
        finishDrawing();
        return;
      }
    }

    setDraftPoints(prev => [...prev, nextPoint]);
  }, [drawWallEnabled, setSelectedId, toWorldX, toWorldZ, roomW, roomD, draftPoints, finishDrawing]);

  useEffect(() => {
    if (!drawWallEnabled) {
      setDraftPoints([]);
    }
  }, [drawWallEnabled]);

  // Grid lines
  const gridLines = [];
  const gridStep = 1; // 1 meter
  const hw = roomW / 2;
  const hd = roomD / 2;
  for (let x = -Math.floor(hw); x <= Math.floor(hw); x += gridStep) {
    gridLines.push(
      <line key={`gx${x}`} x1={toSvgX(x)} y1={toSvgY(-hd)} x2={toSvgX(x)} y2={toSvgY(hd)}
        stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
    );
  }
  for (let z = -Math.floor(hd); z <= Math.floor(hd); z += gridStep) {
    gridLines.push(
      <line key={`gz${z}`} x1={toSvgX(-hw)} y1={toSvgY(z)} x2={toSvgX(hw)} y2={toSvgY(z)}
        stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
    );
  }

  // Dimension labels
  const dimStyle = { fill: '#888', fontSize: 11, fontFamily: 'monospace', textAnchor: 'middle' };

  return (
    <div
      ref={containerRef}
      style={styles.container}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendTitle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
            <line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" />
          </svg>
          2D Blueprint
        </div>
        <div style={styles.legendInfo}>
          {roomConfig.shape} • {roomW}m × {roomD}m • {items.length} items
        </div>
        <div style={styles.legendHint}>{drawWallEnabled ? 'Wall drawing enabled: click points to draw walls' : 'Click & drag items to reposition'}</div>
      </div>

      {drawWallEnabled && (
        <div style={styles.drawPanel}>
          <span style={styles.drawMeta}>Points: {draftPoints.length}</span>
          <button style={styles.drawBtn} onClick={finishDrawing} disabled={draftPoints.length < 3}>Finish Drawing</button>
          <button style={styles.cancelBtn} onClick={cancelDrawing}>Cancel</button>
        </div>
      )}

      <svg
        width={containerSize.w}
        height={containerSize.h}
        style={{ position: 'absolute', top: 0, left: 0 }}
        onClick={handleBgClick}
      >
        {/* Grid */}
        {gridLines}

        {/* Room outline fill */}
        {outline.length >= 3 && (
          <polygon
            points={outlinePoints}
            fill={floorColor}
            fillOpacity={0.25}
            stroke="none"
          />
        )}

        {/* Room outline border */}
        {outline.length >= 3 && (
          <polygon
            points={outlinePoints}
            fill="none"
            stroke={wallColor}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        )}

        {/* Wall hatch marks (thick line on outside) */}
        {outline.length >= 3 && (
          <polygon
            points={outlinePoints}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={8}
            strokeLinejoin="round"
          />
        )}
        {outline.length >= 3 && (
          <polygon
            points={outlinePoints}
            fill="none"
            stroke={wallColor}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        )}

        {drawWallEnabled && draftPoints.length >= 1 && (
          <>
            <polyline
              points={draftPointsSvg}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={3}
              strokeDasharray="6 6"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {draftPoints.map(([x, z], idx) => (
              <circle
                key={`draft-${idx}`}
                cx={toSvgX(x)}
                cy={toSvgY(z)}
                r={idx === 0 && draftPoints.length >= 3 ? 6 : 4.5}
                fill={idx === 0 && draftPoints.length >= 3 ? '#22c55e' : '#38bdf8'}
                stroke="white"
                strokeWidth={1.5}
              />
            ))}
          </>
        )}

        {/* Dimension: width */}
        <text x={cx} y={toSvgY(hd) + 24} style={dimStyle}>
          {roomW}m
        </text>
        {/* Dimension: depth */}
        <text
          x={toSvgX(-hw) - 20}
          y={cy}
          style={{ ...dimStyle, textAnchor: 'end' }}
          transform={`rotate(-90, ${toSvgX(-hw) - 20}, ${cy})`}
        >
          {roomD}m
        </text>

        {/* Dimension arrows - width */}
        <line x1={toSvgX(-hw)} y1={toSvgY(hd) + 14} x2={toSvgX(hw)} y2={toSvgY(hd) + 14}
          stroke="#666" strokeWidth="1" markerStart="url(#arrowL)" markerEnd="url(#arrowR)" />

        {/* Windows on 2D blueprint */}
        {windows.map((win) => {
          // Determine wall endpoints for placement
          let wallFrom, wallTo;
          if (win.wall === 'back')  { wallFrom = [-hw, -hd]; wallTo = [hw, -hd]; }
          else if (win.wall === 'left')  { wallFrom = [-hw, hd]; wallTo = [-hw, -hd]; }
          else if (win.wall === 'right') { wallFrom = [hw, -hd]; wallTo = [hw, hd]; }
          else if (win.wall === 'front') { wallFrom = [hw, hd]; wallTo = [-hw, hd]; }
          else return null;

          const wdx = wallTo[0] - wallFrom[0];
          const wdz = wallTo[1] - wallFrom[1];
          const wlen = Math.sqrt(wdx * wdx + wdz * wdz);
          const t = win.position;
          // Center of window on the wall
          const wcx = wallFrom[0] + wdx * t;
          const wcz = wallFrom[1] + wdz * t;
          // Window half-width along wall direction
          const whalf = Math.min(win.width, wlen * 0.8) / 2;
          const udx = wdx / wlen;
          const udz = wdz / wlen;
          const x1 = toSvgX(wcx - udx * whalf);
          const y1 = toSvgY(wcz - udz * whalf);
          const x2 = toSvgX(wcx + udx * whalf);
          const y2 = toSvgY(wcz + udz * whalf);

          // Normal direction for sun rays
          const nx = -udz;
          const nz = udx;
          const rayLen = 20; // px

          return (
            <g key={win.id}>
              {/* Window gap (bright blue line) */}
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#60a5fa" strokeWidth={6} strokeLinecap="round" />
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#93c5fd" strokeWidth={2} strokeLinecap="round" />
              {/* Sun ray indicators */}
              {[0.2, 0.4, 0.6, 0.8].map((p, ri) => {
                const rx = toSvgX(wcx - udx * whalf + udx * whalf * 2 * p);
                const ry = toSvgY(wcz - udz * whalf + udz * whalf * 2 * p);
                return (
                  <line key={ri}
                    x1={rx} y1={ry}
                    x2={rx + nx * rayLen} y2={ry + nz * rayLen}
                    stroke="rgba(255,245,160,0.35)" strokeWidth={1.5}
                    strokeDasharray="3 3"
                  />
                );
              })}
            </g>
          );
        })}

        {/* Doors on 2D blueprint */}
        {doors.map((door) => {
          // Determine wall endpoints for placement
          let wallFrom, wallTo;
          if (door.wall === 'back')  { wallFrom = [-hw, -hd]; wallTo = [hw, -hd]; }
          else if (door.wall === 'left')  { wallFrom = [-hw, hd]; wallTo = [-hw, -hd]; }
          else if (door.wall === 'right') { wallFrom = [hw, -hd]; wallTo = [hw, hd]; }
          else if (door.wall === 'front') { wallFrom = [hw, hd]; wallTo = [-hw, hd]; }
          else return null;

          const wdx = wallTo[0] - wallFrom[0];
          const wdz = wallTo[1] - wallFrom[1];
          const wlen = Math.sqrt(wdx * wdx + wdz * wdz);
          const t = door.position;
          // Center of door on the wall
          const dcx = wallFrom[0] + wdx * t;
          const dcz = wallFrom[1] + wdz * t;
          // Door half-width along wall direction
          const dhalf = Math.min(door.width, wlen * 0.8) / 2;
          const udx = wdx / wlen;
          const udz = wdz / wlen;
          const x1 = toSvgX(dcx - udx * dhalf);
          const y1 = toSvgY(dcz - udz * dhalf);
          const x2 = toSvgX(dcx + udx * dhalf);
          const y2 = toSvgY(dcz + udz * dhalf);

          // Door arc for swing visualization
          const arcRadius = dhalf * scale;
          const centerX = x1;
          const centerY = y1;

          return (
            <g key={door.id}>
              {/* Door gap (orange line) */}
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#f59e0b" strokeWidth={8} strokeLinecap="round" />
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#fbbf24" strokeWidth={3} strokeLinecap="round" />
              {/* Door swing arc */}
              <path
                d={`M ${x1} ${y1} Q ${centerX + arcRadius * 0.7} ${centerY - arcRadius * 0.7} ${x1 + arcRadius} ${y1}`}
                fill="none"
                stroke="rgba(245,158,11,0.3)"
                strokeWidth={1.5}
                strokeDasharray="4 2"
              />
            </g>
          );
        })}

        {/* Arrow markers */}
        <defs>
          <marker id="arrowR" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#666" />
          </marker>
          <marker id="arrowL" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
            <path d="M6,0 L0,3 L6,6" fill="#666" />
          </marker>
        </defs>

        {/* Compass */}
        <g transform={`translate(${containerSize.w - 50}, 50)`}>
          <circle r="18" fill="rgba(0,0,0,0.4)" stroke="#555" strokeWidth="1" />
          <text x="0" y="-5" textAnchor="middle" fill="#aaa" fontSize="10" fontWeight="bold">N</text>
          <polygon points="0,-14 -3,-6 3,-6" fill="#ef4444" />
          <polygon points="0,14 -3,6 3,6" fill="#555" />
        </g>

        {/* Furniture items */}
        {items.map((item) => {
          const size = ITEM_SIZES[item.type] || { w: 0.5, d: 0.5 };
          const itemColor = item.color !== '#888888' ? item.color : (ITEM_COLORS[item.type] || '#888');
          const iw = size.w * scale;
          const id_ = size.d * scale;
          const ix = toSvgX(item.position[0]) - iw / 2;
          const iy = toSvgY(item.position[2]) - id_ / 2;
          const isSelected = selectedId === item.id;
          const rotY = item.rotation?.[1] || 0;

          return (
            <g
              key={item.id}
              onPointerDown={(e) => handlePointerDown(e, item)}
              style={{ cursor: dragging?.id === item.id ? 'grabbing' : 'grab' }}
            >
              {/* Selection glow */}
              {isSelected && (
                <rect
                  x={ix - 3} y={iy - 3} width={iw + 6} height={id_ + 6}
                  rx={4} fill="none" stroke="#6366f1" strokeWidth={2}
                  strokeDasharray="4 2"
                  transform={`rotate(${(rotY * 180) / Math.PI}, ${ix + iw / 2}, ${iy + id_ / 2})`}
                >
                  <animate attributeName="stroke-dashoffset" values="0;-12" dur="1s" repeatCount="indefinite" />
                </rect>
              )}

              {/* Item rectangle */}
              <rect
                x={ix} y={iy} width={iw} height={id_}
                rx={3}
                fill={itemColor}
                fillOpacity={isSelected ? 0.85 : 0.65}
                stroke={isSelected ? '#fff' : 'rgba(255,255,255,0.3)'}
                strokeWidth={isSelected ? 2 : 1}
                transform={`rotate(${(rotY * 180) / Math.PI}, ${ix + iw / 2}, ${iy + id_ / 2})`}
              />

              {/* Item label */}
              <text
                x={ix + iw / 2}
                y={iy + id_ / 2 + 4}
                textAnchor="middle"
                fill="white"
                fontSize={Math.max(9, Math.min(11, iw / 4))}
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
                style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
              >
                {item.type}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: '#0d1117',
    overflow: 'hidden',
    userSelect: 'none',
  },
  legend: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    background: 'rgba(13, 17, 23, 0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  legendTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: '#e0e0e0',
    fontSize: 13,
    fontWeight: 600,
  },
  legendInfo: {
    color: '#888',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  legendHint: {
    color: '#555',
    fontSize: 10,
    fontStyle: 'italic',
  },
  drawPanel: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 10px',
    borderRadius: 10,
    background: 'rgba(13, 17, 23, 0.92)',
    border: '1px solid rgba(56, 189, 248, 0.35)',
    backdropFilter: 'blur(8px)',
  },
  drawMeta: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: 600,
  },
  drawBtn: {
    border: 'none',
    borderRadius: 8,
    background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    padding: '7px 10px',
    cursor: 'pointer',
  },
  cancelBtn: {
    border: '1px solid rgba(148, 163, 184, 0.4)',
    borderRadius: 8,
    background: 'rgba(15, 23, 42, 0.72)',
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: 600,
    padding: '7px 10px',
    cursor: 'pointer',
  },
};
