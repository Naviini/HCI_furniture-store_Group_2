import { Room, COLORS, FurnitureItem } from '../types/furniture';
import { useTheme } from './theme-context';

interface RoomSettingsProps {
  room: Room;
  onRoomUpdate: (room: Partial<Room>) => void;
  selectedFurniture: FurnitureItem | null;
  onFurnitureUpdate: (furniture: FurnitureItem[]) => void;
  allFurniture: FurnitureItem[];
}

export function RoomSettings({
  room,
  onRoomUpdate,
  selectedFurniture,
  onFurnitureUpdate,
  allFurniture,
}: RoomSettingsProps) {
  const { isDark } = useTheme();

  const handleRoomDimensionChange = (key: 'width' | 'depth' | 'height', value: string) => {
    const numValue = parseInt(value) || 0;
    onRoomUpdate({ [key]: Math.max(100, Math.min(1000, numValue)) });
  };

  const handleFurnitureColorChange = (color: string) => {
    if (!selectedFurniture) return;
    const updatedFurniture = allFurniture.map((item) =>
      item.id === selectedFurniture.id ? { ...item, color } : item
    );
    onFurnitureUpdate(updatedFurniture);
  };

  const handleFurnitureSizeChange = (key: 'width' | 'depth' | 'height', value: string) => {
    if (!selectedFurniture) return;
    const numValue = parseInt(value) || 0;
    const updatedFurniture = allFurniture.map((item) =>
      item.id === selectedFurniture.id
        ? { ...item, [key]: Math.max(10, Math.min(500, numValue)) }
        : item
    );
    onFurnitureUpdate(updatedFurniture);
  };

  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-white/50' : 'text-slate-500';
  const divider = isDark ? 'border-white/10' : 'border-black/8';
  const inputClass = isDark
    ? 'bg-white/8 border border-white/15 text-white'
    : 'bg-white/60 border border-black/10 text-slate-900';
  const labelClass = `text-xs ${textSecondary}`;
  const sectionTitle = `text-sm ${textPrimary}`;

  return (
    <div className="h-full flex flex-col gap-5 overflow-y-auto pr-1 -mr-1">
      {/* Header */}
      <div>
        <h2 className={`text-base tracking-tight ${textPrimary}`}>Settings</h2>
        <p className={`text-xs mt-0.5 ${textSecondary}`}>Room & furniture properties</p>
      </div>

      {/* Room Dimensions */}
      <section className="space-y-3">
        <h3 className={sectionTitle}>Room Dimensions</h3>
        <div className="space-y-2.5">
          {([
            { id: 'room-width', label: 'Width (cm)', key: 'width' as const },
            { id: 'room-depth', label: 'Depth (cm)', key: 'depth' as const },
            { id: 'room-height', label: 'Height (cm)', key: 'height' as const },
          ]).map(({ id, label, key }) => (
            <div key={id} className="space-y-1">
              <label htmlFor={id} className={labelClass}>{label}</label>
              <input
                id={id}
                type="number"
                value={room[key]}
                onChange={(e) => handleRoomDimensionChange(key, e.target.value)}
                min={key === 'height' ? '200' : '100'}
                max={key === 'height' ? '400' : '1000'}
                className={`w-full px-3 py-2 rounded-lg outline-none text-sm transition-all ${inputClass}`}
              />
            </div>
          ))}
        </div>

        <div>
          <label className={labelClass}>Floor Color</label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => onRoomUpdate({ color: color.value })}
                title={color.name}
                className={`h-9 rounded-lg border-2 transition-all ${
                  room.color === color.value
                    ? 'border-pink-500 scale-105 shadow-md shadow-pink-500/30'
                    : isDark
                      ? 'border-white/15 hover:border-white/40'
                      : 'border-black/10 hover:border-black/30'
                }`}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`border-t ${divider}`} />

      {/* Furniture Settings */}
      <section className="space-y-3">
        <h3 className={sectionTitle}>
          {selectedFurniture ? `Edit: ${selectedFurniture.name}` : 'Furniture Properties'}
        </h3>

        {selectedFurniture ? (
          <div className="space-y-2.5">
            {([
              { id: 'fw', label: 'Width (cm)', key: 'width' as const },
              { id: 'fd', label: 'Depth (cm)', key: 'depth' as const },
              { id: 'fh', label: 'Height (cm)', key: 'height' as const },
            ]).map(({ id, label, key }) => (
              <div key={id} className="space-y-1">
                <label htmlFor={id} className={labelClass}>{label}</label>
                <input
                  id={id}
                  type="number"
                  value={selectedFurniture[key]}
                  onChange={(e) => handleFurnitureSizeChange(key, e.target.value)}
                  min="10"
                  max="500"
                  className={`w-full px-3 py-2 rounded-lg outline-none text-sm transition-all ${inputClass}`}
                />
              </div>
            ))}

            <div>
              <label className={labelClass}>Furniture Color</label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleFurnitureColorChange(color.value)}
                    title={color.name}
                    className={`h-9 rounded-lg border-2 transition-all ${
                      selectedFurniture.color === color.value
                        ? 'border-pink-500 scale-105 shadow-md shadow-pink-500/30'
                        : isDark
                          ? 'border-white/15 hover:border-white/40'
                          : 'border-black/10 hover:border-black/30'
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={`rounded-xl p-4 text-center text-sm ${
            isDark ? 'bg-white/4 border border-white/8' : 'bg-black/4 border border-black/8'
          } ${textSecondary}`}>
            Click a furniture item in the 2D view to edit its properties
          </div>
        )}
      </section>
    </div>
  );
}
