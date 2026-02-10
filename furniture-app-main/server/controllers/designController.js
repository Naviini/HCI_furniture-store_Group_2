const Design = require('../models/Design');

// @desc    Save a new design
// @route   POST /api/designs
exports.saveDesign = async (req, res) => {
  try {
    const { userId, name, items, roomConfig, thumbnail } = req.body;
    const design = await Design.create({ userId, name, items, roomConfig, thumbnail });
    res.status(201).json({ success: true, design });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all designs for a user
// @route   GET /api/designs/:userId
exports.getDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single design by ID
// @route   GET /api/designs/single/:designId
exports.getDesignById = async (req, res) => {
  try {
    const design = await Design.findById(req.params.designId);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }
    res.json(design);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an entire design (name, items, roomConfig, thumbnail)
// @route   PUT /api/designs/:designId
exports.updateDesign = async (req, res) => {
  try {
    const { name, items, roomConfig, thumbnail } = req.body;
    const design = await Design.findById(req.params.designId);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    if (name !== undefined) design.name = name;
    if (items !== undefined) design.items = items;
    if (roomConfig !== undefined) design.roomConfig = roomConfig;
    if (thumbnail !== undefined) design.thumbnail = thumbnail;

    design.markModified('items');
    design.markModified('roomConfig');
    await design.save();

    res.json({ success: true, design });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a design
// @route   DELETE /api/designs/:designId
exports.deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.designId);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    await Design.findByIdAndDelete(req.params.designId);
    res.json({ success: true, message: 'Design deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a single furniture item in a design
// @route   PATCH /api/designs/:designId/furniture/:itemId
exports.updateFurnitureItem = async (req, res) => {
  try {
    const { designId, itemId } = req.params;
    const { color, scale, position, rotation } = req.body;

    const design = await Design.findById(designId);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    const itemIndex = design.items.findIndex(item => item.id == itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Furniture item not found' });
    }

    const itemToUpdate = design.items[itemIndex];
    if (color) itemToUpdate.color = color;
    if (scale) itemToUpdate.scale = scale;
    if (position) itemToUpdate.position = position;
    if (rotation) itemToUpdate.rotation = rotation;

    design.items[itemIndex] = itemToUpdate;
    design.markModified('items');
    await design.save();

    res.status(200).json({ success: true, data: design });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
