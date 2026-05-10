const express = require('express');
const router = express.Router();
const {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  applyToCompany,
  getPlacementAnalytics,
} = require('../controllers/companyController');
const { protect, admin, staff } = require('../middleware/authMiddleware');

router.get('/', protect, getCompanies);
router.post('/', protect, staff, createCompany);
router.put('/:id', protect, staff, updateCompany);
router.delete('/:id', protect, admin, deleteCompany);
router.post('/:id/apply', protect, applyToCompany);
router.get('/analytics', protect, staff, getPlacementAnalytics);

module.exports = router;
