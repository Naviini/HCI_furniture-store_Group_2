const Template = require('../models/Template');

// @desc    Save a new template
// @route   POST /api/templates
exports.saveTemplate = async (req, res) => {
  try {
    const { userId, name, description, category, emoji, tag, tagColor, gradient, previewItems, items, roomConfig, windows, doors, thumbnail, isPublic } = req.body;
    const template = await Template.create({
      userId,
      name,
      description,
      category,
      emoji,
      tag,
      tagColor,
      gradient,
      previewItems,
      items,
      roomConfig,
      windows,
      doors,
      thumbnail,
      isPublic
    });
    res.status(201).json({ success: true, template });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all templates for a user (including public ones)
// @route   GET /api/templates/:userId
exports.getTemplates = async (req, res) => {
  try {
    // Get user's own templates and all public templates
    const userTemplates = await Template.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    const publicTemplates = await Template.find({ isPublic: true, userId: { $ne: req.params.userId } }).sort({ createdAt: -1 });

    res.json({
      userTemplates,
      publicTemplates,
      allTemplates: [...userTemplates, ...publicTemplates]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all public templates
// @route   GET /api/templates/public
exports.getPublicTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ isPublic: true }).sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single template by ID
// @route   GET /api/templates/single/:templateId
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an entire template
// @route   PUT /api/templates/:templateId
exports.updateTemplate = async (req, res) => {
  try {
    const { name, description, category, emoji, tag, tagColor, gradient, previewItems, items, roomConfig, windows, doors, thumbnail, isPublic } = req.body;
    const template = await Template.findById(req.params.templateId);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Check if the user owns this template
    if (template.userId.toString() !== req.body.userId) {
      return res.status(403).json({ message: 'Unauthorized to edit this template' });
    }

    if (name !== undefined) template.name = name;
    if (description !== undefined) template.description = description;
    if (category !== undefined) template.category = category;
    if (emoji !== undefined) template.emoji = emoji;
    if (tag !== undefined) template.tag = tag;
    if (tagColor !== undefined) template.tagColor = tagColor;
    if (gradient !== undefined) template.gradient = gradient;
    if (previewItems !== undefined) template.previewItems = previewItems;
    if (items !== undefined) template.items = items;
    if (roomConfig !== undefined) template.roomConfig = roomConfig;
    if (windows !== undefined) template.windows = windows;
    if (doors !== undefined) template.doors = doors;
    if (thumbnail !== undefined) template.thumbnail = thumbnail;
    if (isPublic !== undefined) template.isPublic = isPublic;

    template.markModified('items');
    template.markModified('roomConfig');
    template.markModified('windows');
    template.markModified('doors');
    await template.save();

    res.json({ success: true, template });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a template
// @route   DELETE /api/templates/:templateId
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.templateId);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Check if the user owns this template (from request body or auth)
    const userId = req.body.userId || req.user?.id;
    if (template.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this template' });
    }

    await Template.findByIdAndDelete(req.params.templateId);
    res.json({ success: true, message: 'Template deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Duplicate a template (create a copy)
// @route   POST /api/templates/:templateId/duplicate
exports.duplicateTemplate = async (req, res) => {
  try {
    const originalTemplate = await Template.findById(req.params.templateId);

    if (!originalTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Create a copy with new userId and modified name
    const duplicateData = {
      ...originalTemplate.toObject(),
      _id: undefined,
      userId: req.body.userId,
      name: `${originalTemplate.name} (Copy)`,
      isPublic: false, // Duplicates start as private
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newTemplate = await Template.create(duplicateData);
    res.status(201).json({ success: true, template: newTemplate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};