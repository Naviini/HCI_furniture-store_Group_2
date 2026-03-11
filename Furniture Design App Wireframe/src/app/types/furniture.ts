export type FurnitureType = 'chair' | 'dining-table' | 'side-table' | 'coffee-table' | 'armchair';

export interface FurnitureItem {
  id: string;
  type: FurnitureType;
  name: string;
  width: number; // in cm
  depth: number; // in cm
  height: number; // in cm
  color: string;
  x?: number; // position in 2D canvas
  y?: number; // position in 2D canvas
  rotation?: number; // rotation in degrees
}

export interface Room {
  id: string;
  name: string;
  width: number; // in cm
  depth: number; // in cm
  height: number; // in cm
  color: string;
  furniture: FurnitureItem[];
}

export const FURNITURE_CATALOG: Omit<FurnitureItem, 'id' | 'x' | 'y' | 'rotation'>[] = [
  {
    type: 'dining-table',
    name: 'Rectangular Dining Table',
    width: 180,
    depth: 90,
    height: 75,
    color: '#8B4513',
  },
  {
    type: 'dining-table',
    name: 'Round Dining Table',
    width: 120,
    depth: 120,
    height: 75,
    color: '#8B4513',
  },
  {
    type: 'side-table',
    name: 'Side Table',
    width: 50,
    depth: 50,
    height: 60,
    color: '#A0522D',
  },
  {
    type: 'coffee-table',
    name: 'Coffee Table',
    width: 120,
    depth: 60,
    height: 45,
    color: '#8B4513',
  },
  {
    type: 'chair',
    name: 'Dining Chair',
    width: 45,
    depth: 50,
    height: 90,
    color: '#654321',
  },
  {
    type: 'armchair',
    name: 'Armchair',
    width: 80,
    depth: 85,
    height: 95,
    color: '#4A5568',
  },
];

export const COLORS = [
  { name: 'Walnut', value: '#8B4513' },
  { name: 'Oak', value: '#D2B48C' },
  { name: 'Mahogany', value: '#A0522D' },
  { name: 'Black', value: '#1A202C' },
  { name: 'White', value: '#F7FAFC' },
  { name: 'Gray', value: '#718096' },
  { name: 'Navy', value: '#2C5282' },
  { name: 'Beige', value: '#E6D5B8' },
];
