const express = require('express');
const router = express.Router();
const {
  saveTemplate,
  getTemplates,
  getPublicTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate
} = require('../controllers/templateController');

// @route   POST /api/templates
// @desc    Save a new template
router.post('/', saveTemplate);

// @route   GET /api/templates/public
// @desc    Get all public templates
router.get('/public', getPublicTemplates);

// @route   GET /api/templates/:userId
// @desc    Get all templates for a user (including public ones)
router.get('/:userId', getTemplates);

// @route   GET /api/templates/single/:templateId
// @desc    Get a single template by ID
router.get('/single/:templateId', getTemplateById);

// @route   PUT /api/templates/:templateId
// @desc    Update an entire template
router.put('/:templateId', updateTemplate);

// @route   DELETE /api/templates/:templateId
// @desc    Delete a template
router.delete('/:templateId', deleteTemplate);

// @route   POST /api/templates/:templateId/duplicate
// @desc    Duplicate a template (create a copy)
router.post('/:templateId/duplicate', duplicateTemplate);

module.exports = router;