import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Room, FurnitureItem } from '../types/furniture';
import { FloorPlan2D } from '../components/floor-plan-2d';
import { Room3DViewer } from '../components/room-3d-viewer';
import { FurnitureCatalog } from '../components/furniture-catalog';
import { RoomSettings } from '../components/room-settings';
import { AnimatedBackground } from '../components/animated-background';
import { ThemeToggle } from '../components/theme-toggle';
import { useTheme } from '../components/theme-context';
import { LogOut, Save, FilePlus2, Grid2X2, Box } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';

export function DesignerDashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [designer, setDesigner] = useState<{ email: string; name: string } | null>(null);
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureItem | null>(null);
  const [activeView, setActiveView] = useState<'2d' | '3d'>('2d');
  const [room, setRoom] = useState<Room>({
    id: '1',
    name: 'Living Room',
    width: 500,
    depth: 400,
    height: 270,
    color: '#F5E6D3',
    furniture: [],
  });

  useEffect(() => {
    const stored = localStorage.getItem('designer');
    if (stored) {
      setDesigner(JSON.parse(stored));
    } else {
      navigate('/');
      return;
    }
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (!onboardingCompleted) {
      navigate('/onboarding');
      return;
    }
    const savedRoom = localStorage.getItem('currentRoom');
    if (savedRoom) {
      setRoom(JSON.parse(savedRoom));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('designer');
    localStorage.removeItem('currentRoom');
    navigate('/');
  };

  const handleAddFurniture = (item: Omit<FurnitureItem, 'id' | 'x' | 'y' | 'rotation'>) => {
    const newItem: FurnitureItem = {
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      x: Math.random() * (room.width - item.width),
      y: Math.random() * (room.depth - item.depth),
      rotation: 0,
    };
    setRoom((prev) => ({ ...prev, furniture: [...prev.furniture, newItem] }));
    toast.success(`${item.name} added to room`);
  };

  const handleFurnitureUpdate = (furniture: FurnitureItem[]) => {
    setRoom((prev) => ({ ...prev, furniture }));
    if (selectedFurniture) {
      const updated = furniture.find((f) => f.id === selectedFurniture.id);
      setSelectedFurniture(updated || null);
    }
  };

  const handleRoomUpdate = (updates: Partial<Room>) => {
    setRoom((prev) => ({ ...prev, ...updates }));
  };

  const handleSaveRoom = () => {
    localStorage.setItem('currentRoom', JSON.stringify(room));
    toast.success('Room design saved!');
  };

  const handleNewRoom = () => {
    setRoom({
      id: `${Date.now()}`,
      name: 'New Room',
      width: 500,
      depth: 400,
      height: 270,
      color: '#F5E6D3',
      furniture: [],
    });
    setSelectedFurniture(null);
    toast.success('New room created');
  };

  if (!designer) return null;

  // Shared class helpers
  const glass = isDark
    ? 'bg-white/5 backdrop-blur-xl border-white/10'
    : 'bg-white/75 backdrop-blur-xl border-black/8 shadow-sm';

  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-white/50' : 'text-slate-500';

  const tabActive = isDark
    ? 'bg-white/15 text-white shadow-sm'
    : 'bg-white text-slate-900 shadow-sm';
  const tabInactive = isDark
    ? 'text-white/50 hover:text-white/80 hover:bg-white/8'
    : 'text-slate-500 hover:text-slate-700 hover:bg-black/5';

  const headerBtn = isDark
    ? 'bg-white/8 hover:bg-white/15 border border-white/12 text-white/80 hover:text-white'
    : 'bg-black/4 hover:bg-black/8 border border-black/8 text-slate-600 hover:text-slate-900';

  const saveBtn = isDark
    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-purple-500/20'
    : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-purple-500/20';

  return (
    <div className={`min-h-screen relative flex flex-col ${isDark ? 'bg-neutral-950' : 'bg-slate-100'} font-sans overflow-hidden`}>
      <AnimatedBackground />
      <Toaster />

      {/* Header */}
      <header className={`relative z-20 flex items-center justify-between px-6 py-3.5 border-b ${glass}`}>
        {/* Logo + Room info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-500/25">
              <span className="text-lg">🪑</span>
            </div>
            <span className={`font-bold text-base tracking-tight ${textPrimary}`}>ND Furniture</span>
          </div>
          <div className={`h-5 w-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
          <div className="flex items-center gap-2">
            <span className={`text-sm ${textPrimary}`}>{room.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isDark ? 'bg-white/8 text-white/50' : 'bg-black/5 text-slate-500'
            }`}>
              {room.furniture.length} items
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <span className={`text-sm mr-2 hidden md:inline ${textSecondary}`}>
            {designer.name}
          </span>
          <ThemeToggle />
          <button
            onClick={handleNewRoom}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all ${headerBtn}`}
          >
            <FilePlus2 className="w-4 h-4" />
            <span className="hidden sm:inline">New Room</span>
          </button>
          <button
            onClick={handleSaveRoom}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all ${saveBtn}`}
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all ${headerBtn}`}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="relative z-10 flex flex-1 h-[calc(100vh-57px)] overflow-hidden">

        {/* Left Sidebar – Catalog */}
        <aside className={`w-72 flex-shrink-0 border-r ${glass} p-4 overflow-hidden flex flex-col`}>
          <FurnitureCatalog onAddFurniture={handleAddFurniture} />
        </aside>

        {/* Center – Canvas */}
        <main className="flex-1 flex flex-col p-4 gap-3 overflow-hidden min-w-0">
          {/* View toggle */}
          <div className={`flex items-center justify-between`}>
            <div className={`flex items-center gap-1 p-1 rounded-xl ${
              isDark ? 'bg-white/8 border border-white/10' : 'bg-black/5 border border-black/8'
            }`}>
              <button
                onClick={() => setActiveView('2d')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  activeView === '2d' ? tabActive : tabInactive
                }`}
              >
                <Grid2X2 className="w-4 h-4" />
                2D Floor Plan
              </button>
              <button
                onClick={() => setActiveView('3d')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  activeView === '3d' ? tabActive : tabInactive
                }`}
              >
                <Box className="w-4 h-4" />
                3D Preview
              </button>
            </div>

            <span className={`text-xs ${textSecondary}`}>
              {room.width} × {room.depth} cm
            </span>
          </div>

          {/* Canvas area */}
          <div className={`flex-1 rounded-2xl overflow-hidden border ${
            isDark ? 'border-white/8' : 'border-black/8'
          }`}>
            {activeView === '2d' ? (
              <div className="w-full h-full flex items-center justify-center p-2">
                <FloorPlan2D
                  room={room}
                  onFurnitureUpdate={handleFurnitureUpdate}
                  onFurnitureSelect={setSelectedFurniture}
                  selectedFurniture={selectedFurniture}
                />
              </div>
            ) : (
              <Room3DViewer room={room} />
            )}
          </div>
        </main>

        {/* Right Sidebar – Settings */}
        <aside className={`w-72 flex-shrink-0 border-l ${glass} p-4 overflow-hidden flex flex-col`}>
          <RoomSettings
            room={room}
            onRoomUpdate={handleRoomUpdate}
            selectedFurniture={selectedFurniture}
            onFurnitureUpdate={handleFurnitureUpdate}
            allFurniture={room.furniture}
          />
        </aside>
      </div>
    </div>
  );
}
