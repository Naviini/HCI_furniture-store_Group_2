const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  saveDesign,
  getDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
  updateFurnitureItem
} = require('../controllers/designController');

// All design routes are protected with JWT
router.post('/', protect, saveDesign);
router.get('/:userId', protect, getDesigns);
router.get('/single/:designId', protect, getDesignById);
router.put('/:designId', protect, updateDesign);
router.delete('/:designId', protect, deleteDesign);
router.patch('/:designId/furniture/:itemId', protect, updateFurnitureItem);

module.exports = router;