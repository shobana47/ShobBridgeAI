const express = require('express');
const router = express.Router();
const {
  getStudentProfile,
  updateStudentProfile,
  getAllStudents,
  analyzeResume,
  getSkillGap,
  getRecommendations,
} = require('../controllers/studentController');
const { protect, staff } = require('../middleware/authMiddleware');

router.get('/profile', protect, getStudentProfile);
router.put('/profile', protect, updateStudentProfile);
router.get('/all', protect, staff, getAllStudents);
router.post('/analyze-resume', protect, analyzeResume);
router.post('/skill-gap', protect, getSkillGap);
router.get('/recommendations', protect, getRecommendations);

module.exports = router;
