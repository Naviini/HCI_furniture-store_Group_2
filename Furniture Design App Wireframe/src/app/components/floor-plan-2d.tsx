import { useRef, useState, useEffect } from 'react';
import { Room, FurnitureItem } from '../types/furniture';
import { Trash2, RotateCw } from 'lucide-react';
import { useTheme } from './theme-context';

interface FloorPlan2DProps {
  room: Room;
  onFurnitureUpdate: (furniture: FurnitureItem[]) => void;
  onFurnitureSelect: (item: FurnitureItem | null) => void;
  selectedFurniture: FurnitureItem | null;
}

export function FloorPlan2D({ room, onFurnitureUpdate, onFurnitureSelect, selectedFurniture }: FloorPlan2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggingItem, setDraggingItem] = useState<FurnitureItem | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const padding = 60;
    const availableWidth = canvas.width - padding * 2;
    const availableHeight = canvas.height - padding * 2;
    const scaleX = availableWidth / room.width;
    const scaleY = availableHeight / room.depth;
    setScale(Math.min(scaleX, scaleY, 1));
  }, [room.width, room.depth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = isDark ? '#0d0d14' : '#f1f5f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const offsetX = (canvas.width - room.width * scale) / 2;
    const offsetY = (canvas.height - room.depth * scale) / 2;

    // Room floor
    ctx.fillStyle = room.color;
    ctx.fillRect(offsetX, offsetY, room.width * scale, room.depth * scale);

    // Grid
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
    ctx.lineWidth = 0.8;
    const gridSize = 50 * scale;
    for (let x = offsetX; x <= offsetX + room.width * scale; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, offsetY);
      ctx.lineTo(x, offsetY + room.depth * scale);
      ctx.stroke();
    }
    for (let y = offsetY; y <= offsetY + room.depth * scale; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(offsetX, y);
      ctx.lineTo(offsetX + room.width * scale, y);
      ctx.stroke();
    }

    // Room border
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.30)';
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, room.width * scale, room.depth * scale);

    // Furniture
    room.furniture.forEach((item) => {
      const x = offsetX + (item.x || 0) * scale;
      const y = offsetY + (item.y || 0) * scale;
      const width = item.width * scale;
      const depth = item.depth * scale;
      const rotation = (item.rotation || 0) * (Math.PI / 180);

      ctx.save();
      ctx.translate(x + width / 2, y + depth / 2);
      ctx.rotate(rotation);

      const isSelected = selectedFurniture?.id === item.id;

      // Shadow for selected
      if (isSelected) {
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 12;
      }

      ctx.fillStyle = item.color;
      ctx.fillRect(-width / 2, -depth / 2, width, depth);

      ctx.shadowBlur = 0;
      ctx.strokeStyle = isSelected ? '#ec4899' : isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)';
      ctx.lineWidth = isSelected ? 2.5 : 1;
      ctx.strokeRect(-width / 2, -depth / 2, width, depth);

      // Label
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.75)';
      ctx.font = `${Math.max(9, Math.min(12, width / 5))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(item.name.split(' ')[0], 0, 4);

      ctx.restore();
    });

    // Dimensions
    const dimColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.40)';
    ctx.fillStyle = dimColor;
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${room.width} cm`, offsetX + (room.width * scale) / 2, offsetY - 14);
    ctx.save();
    ctx.translate(offsetX - 20, offsetY + (room.depth * scale) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${room.depth} cm`, 0, 0);
    ctx.restore();
  }, [room, scale, selectedFurniture, isDark]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const offsetX = (canvas.width - room.width * scale) / 2;
    const offsetY = (canvas.height - room.depth * scale) / 2;

    for (let i = room.furniture.length - 1; i >= 0; i--) {
      const item = room.furniture[i];
      const x = offsetX + (item.x || 0) * scale;
      const y = offsetY + (item.y || 0) * scale;
      const width = item.width * scale;
      const depth = item.depth * scale;
      if (mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + depth) {
        setDraggingItem(item);
        setOffset({ x: mouseX - x, y: mouseY - y });
        onFurnitureSelect(item);
        return;
      }
    }
    onFurnitureSelect(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingItem || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const offsetX = (canvasRef.current.width - room.width * scale) / 2;
    const offsetY = (canvasRef.current.height - room.depth * scale) / 2;
    const newX = Math.max(0, Math.min((mouseX - offset.x - offsetX) / scale, room.width - draggingItem.width));
    const newY = Math.max(0, Math.min((mouseY - offset.y - offsetY) / scale, room.depth - draggingItem.depth));
    const updatedFurniture = room.furniture.map((item) =>
      item.id === draggingItem.id ? { ...item, x: newX, y: newY } : item
    );
    onFurnitureUpdate(updatedFurniture);
  };

  const handleMouseUp = () => setDraggingItem(null);

  const handleRotate = () => {
    if (!selectedFurniture) return;
    const updatedFurniture = room.furniture.map((item) =>
      item.id === selectedFurniture.id
        ? { ...item, rotation: ((item.rotation || 0) + 90) % 360 }
        : item
    );
    onFurnitureUpdate(updatedFurniture);
  };

  const handleDelete = () => {
    if (!selectedFurniture) return;
    const updatedFurniture = room.furniture.filter((item) => item.id !== selectedFurniture.id);
    onFurnitureUpdate(updatedFurniture);
    onFurnitureSelect(null);
  };

  const toolBtn = isDark
    ? 'bg-white/10 hover:bg-white/20 border border-white/15 text-white backdrop-blur-md'
    : 'bg-white/80 hover:bg-white/95 border border-black/10 text-slate-700 backdrop-blur-md shadow-sm';

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className={`w-full h-full rounded-2xl cursor-move border ${
          isDark ? 'border-white/10' : 'border-black/8'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {selectedFurniture && (
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={handleRotate}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all ${toolBtn}`}
          >
            <RotateCw className="w-4 h-4" />
            Rotate
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all bg-red-500/80 hover:bg-red-500 border border-red-400/30 text-white backdrop-blur-md"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
