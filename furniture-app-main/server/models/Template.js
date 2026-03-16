const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Custom' },
  emoji: { type: String, default: '🏠' },
  tag: { type: String, default: '' },
  tagColor: { type: String, default: '#6366f1' },
  gradient: { type: String, default: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)' },
  previewItems: { type: [String], default: ['🏠'] },
  items: { type: Array, required: true }, // Furniture data
  roomConfig: {
    shape: { type: String, default: 'rectangle' },
    width: { type: Number, default: 10 },
    depth: { type: Number, default: 10 },
    wallColor: { type: String, default: '#f0f0f0' },
    floorColor: { type: String, default: '#8B4513' },
    floorType: { type: String, default: 'plank_flooring' },
    lightingMode: { type: String, default: 'Day' }
  },
  windows: { type: Array, default: [] }, // Window data
  doors: { type: Array, default: [] },   // Door data
  thumbnail: { type: String }, // Base64 string for preview
  isPublic: { type: Boolean, default: false }, // Allow others to use this template
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
TemplateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Template', TemplateSchema);