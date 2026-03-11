import { useState } from 'react';
import { FURNITURE_CATALOG, FurnitureItem } from '../types/furniture';
import { Plus, Search } from 'lucide-react';
import { useTheme } from './theme-context';

interface FurnitureCatalogProps {
  onAddFurniture: (item: Omit<FurnitureItem, 'id' | 'x' | 'y' | 'rotation'>) => void;
}

export function FurnitureCatalog({ onAddFurniture }: FurnitureCatalogProps) {
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');

  const getFurnitureIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      'dining-table': '🍽️',
      'side-table': '🪑',
      'coffee-table': '☕',
      'chair': '💺',
      'armchair': '🛋️',
    };
    return iconMap[type] || '🪑';
  };

  const filtered = FURNITURE_CATALOG.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-white/50' : 'text-slate-500';
  const itemBorder = isDark
    ? 'border border-white/8 bg-white/4 hover:bg-white/8 hover:border-pink-400/40'
    : 'border border-black/8 bg-white/60 hover:bg-white/90 hover:border-purple-400/60';
  const inputClass = isDark
    ? 'bg-white/8 border border-white/15 text-white placeholder:text-white/30'
    : 'bg-white/60 border border-black/10 text-slate-900 placeholder:text-slate-400';
  const addBtnClass = isDark
    ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white hover:opacity-90'
    : 'bg-gradient-to-br from-pink-500 to-purple-600 text-white hover:opacity-90';

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className={`text-base tracking-tight ${textPrimary}`}>Furniture Catalog</h2>
        <p className={`text-xs mt-0.5 ${textSecondary}`}>Click + to add pieces to your room</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textSecondary}`} />
        <input
          type="text"
          placeholder="Search furniture…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`w-full pl-9 pr-3 py-2.5 rounded-xl outline-none text-sm transition-all ${inputClass}`}
        />
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 -mr-1">
        {filtered.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl p-3 transition-all cursor-default ${itemBorder}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${
                isDark ? 'bg-white/8' : 'bg-black/5'
              }`}>
                {getFurnitureIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${textPrimary}`}>{item.name}</p>
                <p className={`text-xs mt-0.5 ${textSecondary}`}>
                  {item.width} × {item.depth} × {item.height} cm
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className="w-5 h-5 rounded-full border-2 border-white/20 flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <button
                  onClick={() => onAddFurniture(item)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-95 ${addBtnClass}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className={`text-center py-8 text-sm ${textSecondary}`}>
            No items match your search
          </div>
        )}
      </div>
    </div>
  );
}
