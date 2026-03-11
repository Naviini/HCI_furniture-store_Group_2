import { useRef, useEffect, useState } from 'react';
import { Room } from '../types/furniture';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from './theme-context';

interface Room3DViewerProps {
  room: Room;
}

export function Room3DViewer({ room }: Room3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(45);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = isDark ? '#0b0b12' : '#e8edf2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scale = 0.8;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const toIso = (x: number, y: number, z: number) => {
      const angle = (rotation * Math.PI) / 180;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const rotX = x * cos - y * sin;
      const rotY = x * sin + y * cos;
      const isoX = (rotX - z) * Math.cos(Math.PI / 6);
      const isoY = (rotX + z) * Math.sin(Math.PI / 6) - rotY;
      return { x: centerX + isoX * scale, y: centerY - isoY * scale };
    };

    const shadeColor = (color: string, percent: number) => {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = ((num >> 8) & 0x00ff) + amt;
      const B = (num & 0x0000ff) + amt;
      return (
        '#' +
        (
          0x1000000 +
          (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
          (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
          (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
          .toString(16)
          .slice(1)
      );
    };

    const drawBox = (
      x: number, y: number, z: number,
      width: number, height: number, depth: number,
      color: string, label?: string
    ) => {
      const corners = [
        toIso(x, y, z), toIso(x + width, y, z),
        toIso(x + width, y + height, z), toIso(x, y + height, z),
        toIso(x, y, z + depth), toIso(x + width, y, z + depth),
        toIso(x + width, y + height, z + depth), toIso(x, y + height, z + depth),
      ];

      // Top face
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(corners[3].x, corners[3].y);
      ctx.lineTo(corners[2].x, corners[2].y);
      ctx.lineTo(corners[6].x, corners[6].y);
      ctx.lineTo(corners[7].x, corners[7].y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Right face
      ctx.fillStyle = shadeColor(color, -20);
      ctx.beginPath();
      ctx.moveTo(corners[1].x, corners[1].y);
      ctx.lineTo(corners[2].x, corners[2].y);
      ctx.lineTo(corners[6].x, corners[6].y);
      ctx.lineTo(corners[5].x, corners[5].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Front face
      ctx.fillStyle = shadeColor(color, -40);
      ctx.beginPath();
      ctx.moveTo(corners[4].x, corners[4].y);
      ctx.lineTo(corners[5].x, corners[5].y);
      ctx.lineTo(corners[6].x, corners[6].y);
      ctx.lineTo(corners[7].x, corners[7].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (label) {
        const center = toIso(x + width / 2, y + height + 5, z + depth / 2);
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, center.x, center.y);
      }
    };

    const wallColor = isDark ? '#1e1e2e' : '#dde1e7';
    drawBox(0, 0, 0, room.width, 2, room.depth, room.color);
    drawBox(0, 2, 0, room.width, room.height, 2, wallColor);
    drawBox(0, 2, 0, 2, room.height, room.depth, shadeColor(wallColor, -5));

    room.furniture.forEach((item) => {
      drawBox(
        item.x || 0, 2, item.y || 0,
        item.width, item.height, item.depth,
        item.color, item.name.split(' ')[0]
      );
    });

    // Info text
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${room.width} × ${room.depth} × ${room.height} cm`, 16, 28);
    ctx.fillText(`${room.furniture.length} item${room.furniture.length !== 1 ? 's' : ''}`, 16, 46);
  }, [room, rotation, isDark]);

  const toolBtn = isDark
    ? 'bg-white/10 hover:bg-white/20 border border-white/15 text-white backdrop-blur-md'
    : 'bg-white/80 hover:bg-white/95 border border-black/10 text-slate-700 backdrop-blur-md shadow-sm';

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        className="w-full h-full rounded-2xl"
      />

      {/* Rotation controls */}
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={() => setRotation((r) => (r - 45 + 360) % 360)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${toolBtn}`}
          title="Rotate left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => setRotation((r) => (r + 45) % 360)}
          className={`flex items-center gap-1.5 px-3 h-9 rounded-xl text-sm transition-all ${toolBtn}`}
          title="Rotate view"
        >
          <RotateCcw className="w-4 h-4" />
          Rotate
        </button>
        <button
          onClick={() => setRotation((r) => (r + 45) % 360)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${toolBtn}`}
          title="Rotate right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Rotation indicator */}
      <div className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-lg text-xs backdrop-blur-md ${
        isDark
          ? 'bg-white/8 border border-white/10 text-white/50'
          : 'bg-white/70 border border-black/8 text-slate-500'
      }`}>
        Rotation: {rotation}°
      </div>
    </div>
  );
}
