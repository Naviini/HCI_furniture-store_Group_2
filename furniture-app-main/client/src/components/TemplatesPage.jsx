import React, { useState, useEffect } from 'react';
import './TemplatesPage.css';
import bgImage from '../assets/background images/modern_living_rooms_with_the_right_furniture.webp';

/* ─────────────────────────────────────────────
   PRE-DESIGNED ROOM TEMPLATES
   Each template defines: roomConfig + items + windows
───────────────────────────────────────────── */
const TEMPLATES = [
    /* ── LIVING ROOM ── */
    {
        id: 'living-cozy',
        category: 'Living Room',
        name: 'Cosy Living Room',
        desc: 'A warm, inviting space with a sofa, coffee table, and ambient lamp.',
        tag: 'Popular',
        tagColor: '#6366f1',
        emoji: '🛋️',
        gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        previewItems: ['🛋️', '☕', '💡', '💺'],
        roomConfig: {
            shape: 'rectangle',
            width: 14,
            depth: 12,
            wallColor: '#f5f0e8',
            floorColor: '#8b6914',
            floorType: 'plank_flooring',
            lightingMode: 'Day',
        },
        items: [
            { id: 1001, type: 'Sofa', position: [0, 0, -4], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#d1fae5' },
            { id: 1002, type: 'Coffee Table', position: [0, 0, -1.5], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#836009' },
            { id: 1003, type: 'Sofa', position: [-3.5, 0, -1.5], rotation: [0, Math.PI / 2, 0], scale: [0.9, 0.9, 0.9], color: '#d1fae5' },
            { id: 1004, type: 'Sofa', position: [3.5, 0, -1.5], rotation: [0, -Math.PI / 2, 0], scale: [0.9, 0.9, 0.9], color: '#d1fae5' },
            { id: 1005, type: 'Floor Lamp', position: [-5, 0, -5], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#fbbf24' },
            { id: 1006, type: 'TV Stand', position: [0, 0, 4.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1], color: '#78350f' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.5, width: 2.5, height: 1.8, sillHeight: 0.9 },
        ],
        doors: [
            { id: 'd1', wall: 'left', position: 0.3, width: 1.0, height: 2.1 },
        ],
    },
    {
        id: 'living-luxury',
        category: 'Living Room',
        name: 'Luxury Entertainment',
        desc: 'Premium living area with complete sofa set, TV stand, and elegant lighting.',
        tag: 'Premium',
        tagColor: '#f59e0b',
        emoji: '✨',
        gradient: 'linear-gradient(135deg, #1c1917 0%, #44403c 40%, #78716c 100%)',
        previewItems: ['🛋️', '📺', '💡', '☕'],
        roomConfig: {
            shape: 'rectangle',
            width: 16,
            depth: 14,
            wallColor: '#fafaf9',
            floorColor: '#a8a29e',
            floorType: 'grey_cartago',
            lightingMode: 'Golden',
        },
        items: [
            { id: 9001, type: 'Couch Complete', position: [-5, 0, 2.5], rotation: [0, -Math.PI / 4, 0], scale: [1, 1, 1], color: '#1c1917' },
            { id: 9002, type: 'Coffee Table', position: [0, 0, 0], rotation: [0, 0, 0], scale: [1.2, 1, 1.2], color: '#292524' },
            { id: 9003, type: 'TV Stand 3', position: [7, 0, -3], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#374151' },
            { id: 9004, type: 'Eric Floor Lamp', position: [7, 0, 2], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#fbbf24' },
            { id: 9005, type: 'Eric Floor Lamp', position: [-6, 0, -5], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#fbbf24' },
            { id: 9006, type: 'Lounge Chair', position: [5, 0, -2], rotation: [0, -Math.PI / 4, 0], scale: [1, 1, 1], color: '#44403c' },
            { id: 9007, type: 'Drawer', position: [6, 0, -5], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#292524' },
        ],
        windows: [
            
            { id: 'w1', wall: 'back', position: 0.7, width: 2, height: 2, sillHeight: 0.8 },
        ],
        doors: [
            { id: 'd1', wall: 'right', position: 0.8, width: 1.0, height: 2.1 },
        ],
    },
    {
        id: 'living-contemporary',
        category: 'Living Room',
        name: 'Contemporary Living',
        desc: 'Stylish modern living room with outdoor sofa and designer furniture.',
        emoji: '🌟',
        gradient: 'linear-gradient(135deg, #18181b 0%, #27272a 40%, #52525b 100%)',
        previewItems: ['🛋️', '📚', '💡', '☕'],
        roomConfig: {
            shape: 'l-shape',
            width: 15,
            depth: 13,
            wallColor: '#fef9c3',
            floorColor: '#a8a29e',
            floorType: 'grey_cartago',
            lightingMode: 'Day',
        },
        items: [
            { id: 9106, type: 'TV Stand',             position: [-2, 0, -5],    rotation: [0, 0, 0],            scale: [1, 1, 1], color: '#78350f' },
            { id: 9101, type: 'Outdoor Sofa',         position: [-2, 0, 1.5],   rotation: [0, Math.PI, 0],      scale: [1, 1, 1], color: '#52525b' },
            { id: 9102, type: 'Coffee Table',         position: [-2, 0, -1.5],  rotation: [0, 0, 0],            scale: [1, 1, 1], color: '#78716c' },
            { id: 9103, type: 'Chocolate Bookshelf',  position: [-6.2, 0, -3],  rotation: [0, Math.PI / 2, 0],  scale: [1, 1, 1], color: '#a16207' },
            { id: 9105, type: 'Floor Lamp',           position: [-5, 0, 2.5],   rotation: [0, 0, 0],            scale: [1, 1, 1], color: '#d6d3d1' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.4, width: 2.5, height: 2, sillHeight: 0.8 },
            { id: 'w2', wall: 'left', position: 0.6, width: 2, height: 1.8, sillHeight: 1 },
        ],
        doors: [
            { id: 'd1', wall: 'right', position: 0.3, width: 1.0, height: 2.1 },
        ],
    },
    {
        id: 'living-modern',
        category: 'Living Room',
        name: 'Modern Lounge',
        desc: 'Minimalist open-plan living with clean lines and neutral tones.',
        emoji: '🏠',
        gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)',
        previewItems: ['🛋️', '☕', '🗄️', '💡'],
        roomConfig: {
            shape: 'l-shape',
            width: 16,
            depth: 14,
            wallColor: '#f8f8f8',
            floorColor: '#c0bdb7',
            floorType: 'grey_cartago',
            lightingMode: 'Golden',
        },
        items: [
            { id: 2001, type: 'Sofa', position: [-2, 0, -3.5], rotation: [0, 0, 0], scale: [1.2, 1, 1.2], color: '#1e293b' },
            { id: 2002, type: 'Coffee Table', position: [-2, 0, -1], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#292524' },
            { id: 2003, type: 'Floor Lamp', position: [3.5, 0, -3.5], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#1c1917' },
            { id: 2004, type: 'Drawer', position: [-6, 0, -5], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#292524' },
            { id: 2005, type: 'Lounge Chair', position: [4, 0, -1], rotation: [0, -Math.PI / 4, 0], scale: [1, 1, 1], color: '#334155' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.35, width: 3, height: 2.2, sillHeight: 0.8 },
            { id: 'w2', wall: 'left', position: 0.5, width: 2, height: 1.8, sillHeight: 1 },
        ],
        doors: [
            { id: 'd1', wall: 'front', position: 0.7, width: 1.0, height: 2.1 },
        ],
    },

    /* ── BEDROOM ── */
    {
        id: 'bedroom-classic',
        category: 'Bedroom',
        name: 'Classic Bedroom',
        desc: 'A timeless bedroom layout with bed, drawer, and reading lamp.',
        tag: 'Starter',
        tagColor: '#059669',
        emoji: '🛏️',
        gradient: 'linear-gradient(135deg, #1a0a00 0%, #431407 40%, #7c2d12 100%)',
        previewItems: ['🛏️', '🗄️', '💡', '💺'],
        roomConfig: {
            shape: 'rectangle',
            width: 12,
            depth: 10,
            wallColor: '#fef3c7',
            floorColor: '#92400e',
            floorType: 'plank_flooring',
            lightingMode: 'Night',
        },
        items: [
            { id: 3001, type: 'Bed', position: [0, 0, -3], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#f5f5f4' },
            { id: 3002, type: 'Drawer', position: [-4, 0, -3.2], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#a16207' },
            { id: 3003, type: 'Drawer', position: [4, 0, -3.2], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#a16207' },
            { id: 3004, type: 'Desk Lamp', position: [-4, 0, -3.2], rotation: [0, 0, 0], scale: [0.8, 0.8, 0.8], color: '#fbbf24' },
            { id: 3005, type: 'Desk Lamp', position: [4, 0, -3.2], rotation: [0, 0, 0], scale: [0.8, 0.8, 0.8], color: '#fbbf24' },
            { id: 3006, type: 'Chair', position: [3, 0, 2], rotation: [0, Math.PI, 0], scale: [1, 1, 1], color: '#e7e5e4' },
            { id: 3007, type: 'Wardrobe', position: [-4.5, 0, 2.5], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#a16207' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.5, width: 1.8, height: 1.4, sillHeight: 1.0 },
        ],
        doors: [
            { id: 'd1', wall: 'front', position: 0.3, width: 0.9, height: 2.1 },
        ],
    },
    {
        id: 'bedroom-scandinavian',
        category: 'Bedroom',
        name: 'Scandinavian Bedroom',
        desc: 'Light, airy Scandi style — white tones and natural wood accents.',
        emoji: '🌿',
        gradient: 'linear-gradient(135deg, #052e16 0%, #14532d 40%, #166534 100%)',
        previewItems: ['🛏️', '🗄️', '💡'],
        roomConfig: {
            shape: 'square',
            width: 11,
            depth: 11,
            wallColor: '#ffffff',
            floorColor: '#d6b899',
            floorType: 'plank_flooring',
            lightingMode: 'Day',
        },
        items: [
            { id: 4001, type: 'Bed', position: [0, 0, -3], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#f8fafc' },
            { id: 4002, type: 'Drawer', position: [-3.5, 0, -4.2], rotation: [0, Math.PI / 2, 0], scale: [0.9, 0.9, 0.9], color: '#fef9c3' },
            { id: 4003, type: 'Drawer', position: [3.5, 0, -4.2], rotation: [0, -Math.PI / 2, 0], scale: [0.9, 0.9, 0.9], color: '#fef9c3' },
            { id: 4004, type: 'Desk Lamp', position: [-3.5, 0, -2], rotation: [0, 0, 0], scale: [0.9, 0.9, 0.9], color: '#e2e8f0' },
            { id: 4005, type: 'Chair', position: [3, 0, 2.5], rotation: [0, -Math.PI / 4, 0], scale: [1, 1, 1], color: '#f8fafc' },
            { id: 4006, type: 'Coffee Table', position: [3.5, 0, 3.5], rotation: [0, 0, 0], scale: [0.7, 1, 0.7], color: '#d6b899' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.4, width: 2.2, height: 1.6, sillHeight: 0.9 },
            { id: 'w2', wall: 'right', position: 0.5, width: 1.5, height: 1.4, sillHeight: 1.0 },
        ],
        doors: [
            { id: 'd1', wall: 'front', position: 0.25, width: 0.9, height: 2.1 },
        ],
    },
    {
        id: 'bedroom-luxury',
        category: 'Bedroom',
        name: 'Luxury Master Bedroom',
        desc: 'Spacious luxury bedroom with premium bed, elegant wardrobe, and reading chair.',
        tag: 'Premium',
        tagColor: '#c026d3',
        emoji: '👑',
        gradient: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 40%, #6366f1 100%)',
        previewItems: ['🛏️', '🚪', '💺', '💡'],
        roomConfig: {
            shape: 'rectangle',
            width: 15,
            depth: 13,
            wallColor: '#faf5ff',
            floorColor: '#92400e',
            floorType: 'plank_flooring',
            lightingMode: 'Golden',
        },
        items: [
            { id: 9201, type: 'Bed Agape', position: [0, 0, -4], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#e7e5e4' },
            { id: 9202, type: 'Modern Wardrobe', position: [-5.5, 0, -3], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#78350f' },
            { id: 9203, type: 'Drawer', position: [5.5, 0, -4.5], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#92400e' },
            { id: 9204, type: 'Lounge Chair', position: [-3, 0, 2.5], rotation: [0, Math.PI / 4, 0], scale: [1, 1, 1], color: '#c4b5fd' },
            { id: 9205, type: 'Coffee Table', position: [-2.5, 0, 4], rotation: [0, 0, 0], scale: [0.6, 1, 0.6], color: '#78350f' },
            { id: 9206, type: 'Eric Floor Lamp', position: [5.5, 0, -1], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#fbbf24' },
            { id: 9207, type: 'Desk Lamp', position: [5.5, 0, -4.5], rotation: [0, 0, 0], scale: [0.8, 0.8, 0.8], color: '#fef08a' },
            { id: 9208, type: 'TV Stand', position: [0, 0, 5], rotation: [0, Math.PI, 0], scale: [0.8, 0.8, 0.8], color: '#78350f' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.3, width: 2, height: 2, sillHeight: 0.8 },
            { id: 'w2', wall: 'back', position: 0.7, width: 2, height: 2, sillHeight: 0.8 },
        ],
        doors: [
            { id: 'd1', wall: 'front', position: 0.2, width: 0.95, height: 2.2 },
        ],
    },

    /* ── KITCHEN ── */
    {
        id: 'kitchen-modern',
        category: 'Kitchen',
        name: 'Modern Kitchen',
        desc: 'Contemporary kitchen with full appliances, cabinets, and dining area.',
        tag: 'New',
        tagColor: '#0ea5e9',
        emoji: '🍳',
        gradient: 'linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 40%, #1e40af 100%)',
        previewItems: ['🗄️', '❄️', '🪑', '☕'],
        roomConfig: {
            shape: 'rectangle',
            width: 14,
            depth: 11,
            wallColor: '#f8fafc',
            floorColor: '#cbd5e1',
            floorType: 'granite_tile',
            lightingMode: 'Day',
        },
        items: [
            { id: 9301, type: 'Kitchen', position: [-4.5, 0, -4.5], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#f8fafc' },
            { id: 9302, type: 'Modern Fridge', position: [5.5, 0, -4.5], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#94a3b8' },
            { id: 9303, type: 'Kitchen Cabinet 1', position: [3.5, 0, -4.8], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#1e293b' },
            { id: 9304, type: 'Dining Table', position: [0, 0, 1.5], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#f5f5f4' },
            { id: 9305, type: 'Dining Chair', position: [-1.8, 0, 1.5], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#475569' },
            { id: 9306, type: 'Dining Chair', position: [1.8, 0, 1.5], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#475569' },
            { id: 9307, type: 'Dining Chair', position: [0, 0, 3], rotation: [0, Math.PI, 0], scale: [1, 1, 1], color: '#475569' },
            { id: 9308, type: 'Dining Chair', position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#475569' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.6, width: 2.2, height: 1.6, sillHeight: 0.9 },
        ],
        doors: [
            { id: 'd1', wall: 'front', position: 0.3, width: 1.0, height: 2.1 },
        ],
    },
    {
        id: 'kitchen-compact',
        category: 'Kitchen',
        name: 'Compact Kitchen',
        desc: 'Smart compact kitchen design with essential appliances and breakfast bar.',
        emoji: '☕',
        gradient: 'linear-gradient(135deg, #431407 0%, #78350f 40%, #a16207 100%)',
        previewItems: ['🗄️', '❄️', '💺', '☕'],
        roomConfig: {
            shape: 'square',
            width: 10,
            depth: 10,
            wallColor: '#fef3c7',
            floorColor: '#b3b3b3',
            floorType: 'granite_tile',
            lightingMode: 'Golden',
        },
        items: [
            { id: 9401, type: 'Small Kitchen', position: [0, 0, -3.8], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#f5f5f4' },
            { id: 9402, type: 'Modern Fridge', position: [-4, 0, -3.5], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#78716c' },
            { id: 9403, type: 'European Cabinet', position: [4, 0, -2.5], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#a16207' },
            { id: 9404, type: 'Coffee Table', position: [0, 0, 1.5], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#fef9c3' },
            { id: 9405, type: 'Chair', position: [-1.5, 0, 1.5], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#d6d3d1' },
            { id: 9406, type: 'Chair', position: [1.5, 0, 1.5], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#d6d3d1' },
            { id: 9407, type: 'Chair', position: [0, 0, 3], rotation: [0, Math.PI, 0], scale: [1, 1, 1], color: '#d6d3d1' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.5, width: 1.8, height: 1.4, sillHeight: 0.9 },
        ],
        doors: [
            { id: 'd1', wall: 'right', position: 0.25, width: 0.9, height: 2.1 },
        ],
    },

    /* ── DINING ROOM ── */
    {
        id: 'dining-formal',
        category: 'Dining',
        name: 'Formal Dining Room',
        desc: 'An elegant dining setup with a central table and matching chairs.',
        tag: 'Classic',
        tagColor: '#d97706',
        emoji: '🍽️',
        gradient: 'linear-gradient(135deg, #1c1400 0%, #451a03 40%, #78350f 100%)',
        previewItems: ['🔲', '💺', '💺', '💡'],
        roomConfig: {
            shape: 'rectangle',
            width: 13,
            depth: 11,
            wallColor: '#fdf4ff',
            floorColor: '#422006',
            floorType: 'plank_flooring',
            lightingMode: 'Golden',
        },
        items: [
            { id: 5001, type: 'Dining Table', position: [0, 0, 0], rotation: [0, 0, 0], scale: [1.3, 1, 1.3], color: '#292524' },
            { id: 5002, type: 'Chair', position: [-2.5, 0, 0], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#1c1917' },
            { id: 5003, type: 'Chair', position: [2.5, 0, 0], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#1c1917' },
            { id: 5004, type: 'Chair', position: [0, 0, 2.2], rotation: [0, Math.PI, 0], scale: [1, 1, 1], color: '#1c1917' },
            { id: 5005, type: 'Chair', position: [0, 0, -2.2], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#1c1917' },
            { id: 5006, type: 'Chair', position: [-1.8, 0, 1.5], rotation: [0, 2.5, 0], scale: [1, 1, 1], color: '#1c1917' },
            { id: 5007, type: 'Chair', position: [1.8, 0, 1.5], rotation: [0, -2.5, 0], scale: [1, 1, 1], color: '#1c1917' },
            { id: 5008, type: 'Desk Lamp', position: [0, 0, 0], rotation: [0, 0, 0], scale: [0.8, 0.8, 0.8], color: '#fef08a' },
            { id: 5009, type: 'Drawer', position: [-5, 0, -4], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#78350f' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.3, width: 1.6, height: 1.4, sillHeight: 1.0 },
            { id: 'w2', wall: 'back', position: 0.7, width: 1.6, height: 1.4, sillHeight: 1.0 },
        ],
        doors: [
            { id: 'd1', wall: 'front', position: 0.3, width: 1.0, height: 2.1 },
        ],
    },
    {
        id: 'dining-casual',
        category: 'Dining',
        name: 'Casual Kitchen Diner',
        desc: 'Relaxed open-plan kitchen feel with a small round table.',
        emoji: '☕',
        gradient: 'linear-gradient(135deg, #0c0a00 0%, #1c1700 40%, #3d2a00 100%)',
        previewItems: ['🔲', '💺', '☕'],
        roomConfig: {
            shape: 'rectangle',
            width: 10,
            depth: 8,
            wallColor: '#ecfdf5',
            floorColor: '#b3b3b3',
            floorType: 'granite_tile',
            lightingMode: 'Day',
        },
        items: [
            { id: 6001, type: 'Coffee Table', position: [0, 0, 0.5], rotation: [0, 0, 0], scale: [1.2, 1, 1.2], color: '#f5f5f4' },
            { id: 6002, type: 'Chair', position: [-1.8, 0, 0.5], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#d6d3d1' },
            { id: 6003, type: 'Chair', position: [1.8, 0, 0.5], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#d6d3d1' },
            { id: 6004, type: 'Chair', position: [0, 0, 2], rotation: [0, Math.PI, 0], scale: [1, 1, 1], color: '#d6d3d1' },
            { id: 6005, type: 'Chair', position: [0, 0, -1], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#d6d3d1' },
            { id: 6006, type: 'Drawer', position: [-4, 0, -3], rotation: [0, Math.PI / 2, 0], scale: [0.9, 0.9, 0.9], color: '#a16207' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.5, width: 2, height: 1.5, sillHeight: 0.8 },
        ],
        doors: [
            { id: 'd1', wall: 'left', position: 0.25, width: 0.9, height: 2.1 },
        ],
    },

    /* ── BATHROOM ── */
    {
        id: 'bathroom-modern',
        category: 'Bathroom',
        name: 'Modern Bathroom',
        desc: 'Sleek modern bathroom with bathtub, vanity, and contemporary fixtures.',
        tag: 'New',
        tagColor: '#06b6d4',
        emoji: '🚿',
        gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 40%, #0ea5e9 100%)',
        previewItems: ['🛁', '🚰', '🚽', '🗄️'],
        roomConfig: {
            shape: 'rectangle',
            width: 11,
            depth: 9,
            wallColor: '#f0fdfa',
            floorColor: '#cbd5e1',
            floorType: 'granite_tile',
            lightingMode: 'Day',
        },
        items: [
            { id: 9501, type: 'Bathtub 2', position: [-4, 0, -3.2], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#e0f2fe' },
            { id: 9502, type: 'Sink & Vanity', position: [3.5, 0, -3.8], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#f5f5f4' },
            { id: 9503, type: 'Toilet', position: [4, 0, 0], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#ffffff' },
            { id: 9504, type: 'Bathroom Closet', position: [-4, 0, 1.5], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#f8fafc' },
            { id: 9505, type: 'Floor Lamp', position: [4, 0, 3], rotation: [0, 0, 0], scale: [0.8, 0.8, 0.8], color: '#e0f2fe' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.7, width: 1.4, height: 1.2, sillHeight: 1.2 },
        ],
        doors: [
            { id: 'd1', wall: 'front', position: 0.25, width: 0.85, height: 2.1 },
        ],
    },
    {
        id: 'bathroom-luxury',
        category: 'Bathroom',
        name: 'Luxury Spa Bathroom',
        desc: 'Luxurious spa-style bathroom with premium bathtub and elegant finishes.',
        tag: 'Premium',
        tagColor: '#c026d3',
        emoji: '💎',
        gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #1e40af 100%)',
        previewItems: ['🛁', '🚰', '🪞', '🗄️'],
        roomConfig: {
            shape: 'rectangle',
            width: 13,
            depth: 10,
            wallColor: '#fdf4ff',
            floorColor: '#a8a29e',
            floorType: 'grey_cartago',
            lightingMode: 'Golden',
        },
        items: [
            { id: 9601, type: 'Bathtub', position: [0, 0, -3.8], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#fafaf9' },
            { id: 9602, type: 'Sink with Faucet', position: [-5, 0, -3.2], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#f5f5f4' },
            { id: 9603, type: 'Sink with Faucet', position: [-5, 0, -1], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#f5f5f4' },
            { id: 9604, type: 'Toilet Vaa', position: [5, 0, -2], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#ffffff' },
            { id: 9605, type: 'Bathroom Asset 1', position: [-3.5, 0, 2.5], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#f8fafc' },
            { id: 9606, type: 'Bathroom Closet', position: [4.5, 0, 2], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#fafaf9' },
            { id: 9607, type: 'Floor Lamp', position: [5, 0, 3.5], rotation: [0, 0, 0], scale: [0.8, 0.8, 0.8], color: '#fef08a' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.5, width: 2, height: 1.6, sillHeight: 1.1 },
        ],
        doors: [
            { id: 'd1', wall: 'front', position: 0.3, width: 0.9, height: 2.2 },
        ],
    },

    /* ── WORKSPACE ── */
    {
        id: 'workspace-home',
        category: 'Workspace',
        name: 'Home Office',
        desc: 'A productive home office with desk, chair, and cabinet storage.',
        tag: 'Popular',
        tagColor: '#0ea5e9',
        emoji: '💻',
        gradient: 'linear-gradient(135deg, #030712 0%, #0f172a 40%, #1e3a5f 100%)',
        previewItems: ['🔲', '💺', '🗄️', '💡'],
        roomConfig: {
            shape: 'square',
            width: 9,
            depth: 9,
            wallColor: '#f1f5f9',
            floorColor: '#c8b89a',
            floorType: 'plank_flooring',
            lightingMode: 'Day',
        },
        items: [
            { id: 7001, type: 'Computer Table', position: [0, 0, -3], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#f5f5f0' },
            { id: 7002, type: 'Computer Chair', position: [0, 0, -1.5], rotation: [0, Math.PI, 0], scale: [1, 1, 1], color: '#1e293b' },
            { id: 7003, type: 'Desk Lamp', position: [1, 0, -3], rotation: [0, 0, 0], scale: [0.9, 0.9, 0.9], color: '#0ea5e9' },
            { id: 7004, type: 'File Cabinet', position: [3.5, 0, -3.5], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#1e293b' },
            { id: 7005, type: 'Chocolate Bookshelf', position: [-3.5, 0, -2.5], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#78350f' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.5, width: 1.8, height: 1.6, sillHeight: 0.9 },
        ],
        doors: [
            { id: 'd1', wall: 'left', position: 0.3, width: 0.9, height: 2.1 },
        ],
    },
    {
        id: 'workspace-executive',
        category: 'Workspace',
        name: 'Executive Office',
        desc: 'Professional executive office with premium furniture and storage solutions.',
        tag: 'Premium',
        tagColor: '#7c3aed',
        emoji: '🏢',
        gradient: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 40%, #4f46e5 100%)',
        previewItems: ['🔲', '💺', '📚', '💡'],
        roomConfig: {
            shape: 'rectangle',
            width: 13,
            depth: 11,
            wallColor: '#faf5ff',
            floorColor: '#92400e',
            floorType: 'plank_flooring',
            lightingMode: 'Golden',
        },
        items: [
            { id: 9701, type: 'Industrial Table', position: [0, 0, -3.5], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#1c1917' },
            { id: 9702, type: 'Computer Chair', position: [0, 0, -2], rotation: [0, Math.PI, 0], scale: [1, 1, 1], color: '#292524' },
            { id: 9703, type: 'File Cabinet', position: [4.5, 0, -4], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1], color: '#44403c' },
            { id: 9704, type: 'Chocolate Bookshelf', position: [-4.5, 0, -3], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#78350f' },
            { id: 9705, type: 'Lounge Chair', position: [-3, 0, 2.5], rotation: [0, Math.PI / 4, 0], scale: [1, 1, 1], color: '#a78bfa' },
            { id: 9706, type: 'Coffee Table', position: [-2.5, 0, 4], rotation: [0, 0, 0], scale: [0.7, 1, 0.7], color: '#78350f' },
            { id: 9707, type: 'Desk Lamp', position: [1.5, 0, -3.5], rotation: [0, 0, 0], scale: [0.9, 0.9, 0.9], color: '#fef08a' },
            { id: 9708, type: 'Floor Lamp', position: [-3.5, 0, 3], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#1c1917' },
            { id: 9709, type: 'Lounge Chair', position: [3, 0, 2.5], rotation: [0, -Math.PI / 4, 0], scale: [1, 1, 1], color: '#a78bfa' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.3, width: 2, height: 1.8, sillHeight: 0.9 },
            { id: 'w2', wall: 'back', position: 0.7, width: 2, height: 1.8, sillHeight: 0.9 },
        ],
        doors: [
            { id: 'd1', wall: 'front', position: 0.3, width: 1.0, height: 2.2 },
        ],
    },

    /* ── STUDIO APARTMENT ── */
    {
        id: 'studio-compact',
        category: 'Studio',
        name: 'Compact Studio',
        desc: 'Multi-functional studio layout — living, sleeping and dining all in one.',
        tag: 'Smart',
        tagColor: '#7c3aed',
        emoji: '🏡',
        gradient: 'linear-gradient(135deg, #0f0820 0%, #1e1040 40%, #3b0764 100%)',
        previewItems: ['🛏️', '🛋️', '🔲', '☕'],
        roomConfig: {
            shape: 'rectangle',
            width: 12,
            depth: 8,
            wallColor: '#f8fafc',
            floorColor: '#b0967a',
            floorType: 'plank_flooring',
            lightingMode: 'Golden',
        },
        items: [
            { id: 8001, type: 'Bed', position: [-3.5, 0, -2.5], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#f8fafc' },
            { id: 8002, type: 'Sofa', position: [2.5, 0, -1.5], rotation: [0, 0, 0], scale: [0.9, 0.9, 0.9], color: '#475569' },
            { id: 8003, type: 'Coffee Table', position: [2.5, 0, 0.8], rotation: [0, 0, 0], scale: [0.8, 1, 0.8], color: '#292524' },
            { id: 8004, type: 'Coffee Table', position: [-3.5, 0, 2], rotation: [0, 0, 0], scale: [0.7, 1, 0.7], color: '#f5f5f4' },
            { id: 8005, type: 'Chair', position: [-3.5, 0, 3], rotation: [0, Math.PI, 0], scale: [0.9, 0.9, 0.9], color: '#e2e8f0' },
            { id: 8006, type: 'Desk Lamp', position: [-5, 0, -2.5], rotation: [0, 0, 0], scale: [0.9, 0.9, 0.9], color: '#fbbf24' },
            { id: 8007, type: 'Drawer', position: [-5, 0, -0.5], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1], color: '#fef9c3' },
            { id: 8008, type: 'TV Stand', position: [2.5, 0, 3], rotation: [0, Math.PI, 0], scale: [0.7, 0.7, 0.7], color: '#78350f' },
        ],
        windows: [
            { id: 'w1', wall: 'back', position: 0.25, width: 1.5, height: 1.4, sillHeight: 0.9 },
            { id: 'w2', wall: 'back', position: 0.75, width: 1.5, height: 1.4, sillHeight: 0.9 },
        ],
        doors: [
            { id: 'd1', wall: 'front', position: 0.25, width: 0.95, height: 2.1 },
        ],
    },
];

const CATEGORIES = ['All', 'Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining', 'Workspace', 'Studio', 'Custom'];

const CAT_META = {
    'All': { icon: '🏠', color: '#6366f1' },
    'Living Room': { icon: '🛋️', color: '#8b5cf6' },
    'Bedroom': { icon: '🛏️', color: '#ec4899' },
    'Kitchen': { icon: '🍳', color: '#f97316' },
    'Bathroom': { icon: '🚿', color: '#06b6d4' },
    'Dining': { icon: '🍽️', color: '#f59e0b' },
    'Workspace': { icon: '💻', color: '#0ea5e9' },
    'Studio': { icon: '🏡', color: '#7c3aed' },
    'Custom': { icon: '⭐', color: '#22c55e' },
};

/* ══════════════════════════════════════════════
   TEMPLATES PAGE COMPONENT
══════════════════════════════════════════════ */
export default function TemplatesPage({ onSelectTemplate, onSkip, onClose, user }) {
    const [activeCategory, setActiveCategory] = useState('All');
    const [hoveredId, setHoveredId] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [userTemplates, setUserTemplates] = useState([]);
    const [allTemplates, setAllTemplates] = useState(TEMPLATES);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch user templates on component mount
    useEffect(() => {
        const fetchUserTemplates = async () => {
            if (!user?._id) return;

            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/templates/${user._id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserTemplates(data.allTemplates || []);

                    // Combine hardcoded templates with user templates
                    setAllTemplates([...TEMPLATES, ...(data.allTemplates || [])]);
                }
            } catch (error) {
                console.error('Failed to load user templates:', error);
                // Continue with hardcoded templates only
                setAllTemplates(TEMPLATES);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserTemplates();
    }, [user]);

    const filtered = activeCategory === 'All'
        ? allTemplates
        : allTemplates.filter(t => t.category === activeCategory);

    const handleSelect = (template) => {
        setSelectedId(template.id || template._id);
        // Short delay for visual feedback, then invoke callback
        setTimeout(() => onSelectTemplate(template), 320);
    };

    return (
        <div className="tp-backdrop" role="dialog" aria-modal="true" aria-label="Choose a room template"
            style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <div className="tp-modal">

                {/* ── Header ── */}
                <header className="tp-header">
                    <div className="tp-header-left">
                        <div className="tp-header-icon">🏠</div>
                        <div>
                            <h2 className="tp-title">Start with a Template</h2>
                            <p className="tp-subtitle">Choose a pre-designed room or start with a blank canvas</p>
                        </div>
                    </div>
                    <button className="tp-close-btn" onClick={onClose} aria-label="Close templates">✕</button>
                </header>

                {/* ── Category tabs ── */}
                <nav className="tp-categories" aria-label="Room categories">
                    {CATEGORIES.map(cat => {
                        const meta = CAT_META[cat];
                        const isActive = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                className={`tp-cat-btn ${isActive ? 'tp-cat-btn--active' : ''}`}
                                style={isActive ? { '--cat-color': meta.color, borderColor: meta.color, color: meta.color, background: `${meta.color}18` } : {}}
                                onClick={() => setActiveCategory(cat)}
                                aria-pressed={isActive}
                            >
                                <span className="tp-cat-icon">{meta.icon}</span>
                                {cat}
                            </button>
                        );
                    })}
                </nav>

                {/* ── Template grid ── */}
                {isLoading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '40px',
                        color: '#8b93a9',
                        fontSize: '0.9rem'
                    }}>
                        Loading templates...
                    </div>
                ) : (
                    <div className="tp-grid" role="list">
                        {filtered.map(template => {
                            const templateId = template.id || template._id;
                            const isHovered = hoveredId === templateId;
                            const isSelected = selectedId === templateId;
                            return (
                                <button
                                    key={templateId}
                                    className={`tp-card ${isSelected ? 'tp-card--selected' : ''}`}
                                    role="listitem"
                                    aria-label={`Load ${template.name} template`}
                                    onMouseEnter={() => setHoveredId(templateId)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    onClick={() => handleSelect(template)}
                                >
                                    {/* Preview area */}
                                    <div className="tp-card-preview" style={{ background: template.gradient }}>
                                        <div className="tp-card-emoji">{template.emoji}</div>

                                        {/* Mini furniture icons */}
                                        <div className="tp-card-mini-items">
                                            {template.previewItems.map((icon, i) => (
                                                <span key={i} className="tp-mini-item"
                                                    style={{ animationDelay: `${i * 0.08}s` }}>
                                                    {icon}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Tag badge */}
                                        {template.tag && (
                                            <div className="tp-card-tag" style={{ background: template.tagColor }}>
                                                {template.tag}
                                            </div>
                                        )}

                                        {/* User template badge */}
                                        {template._id && (
                                            <div className="tp-card-user-badge" style={{
                                                position: 'absolute',
                                                top: '8px',
                                                left: '8px',
                                                background: '#22c55e',
                                                color: 'white',
                                                fontSize: '0.6rem',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontWeight: '600'
                                            }}>
                                                YOUR TEMPLATE
                                            </div>
                                        )}

                                        {/* Selected check */}
                                        {isSelected && <div className="tp-card-check">✓</div>}
                                    </div>

                                    {/* Card body */}
                                    <div className="tp-card-body">
                                        <div className="tp-card-header-row">
                                            <span className="tp-card-category">{template.category}</span>
                                            <span className="tp-card-shape">
                                                {template.roomConfig.shape.replace(/-/g, ' ')}
                                            </span>
                                        </div>
                                        <h3 className="tp-card-name">{template.name}</h3>
                                        <p className="tp-card-desc">{template.description || template.desc}</p>

                                        {/* Detail grid */}
                                        <div className="tp-card-details">
                                            <div className="tp-detail">
                                                <span>📐</span>
                                                <span>{template.roomConfig.width}×{template.roomConfig.depth} m</span>
                                            </div>
                                            <div className="tp-detail">
                                                <span>🪑</span>
                                                <span>{template.items.length} items</span>
                                            </div>
                                            <div className="tp-detail">
                                                <span>🪟</span>
                                                <span>{(template.windows || []).length} window{(template.windows || []).length !== 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="tp-detail">
                                                <span>
                                                    {template.roomConfig.lightingMode === 'Day' ? '☀️' :
                                                        template.roomConfig.lightingMode === 'Golden' ? '🌅' : '🌙'}
                                                </span>
                                                <span>{template.roomConfig.lightingMode}</span>
                                            </div>
                                        </div>

                                        <div className="tp-card-cta">
                                            {isSelected ? '⏳ Loading…' : 'Use Template →'}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ── Footer ── */}
                <footer className="tp-footer">
                    <button className="tp-skip-btn" onClick={onSkip}>
                        Start with blank canvas instead
                    </button>
                </footer>
            </div>
        </div>
    );
}

export { TEMPLATES };
