const Company = require('../models/Company');
const Application = require('../models/Application');
const Student = require('../models/Student');

// @desc Get all companies
// @route GET /api/companies
// @access Private
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ status: 'Active' });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc Create company
// @route POST /api/companies
// @access Private (Admin/Staff)
const createCompany = async (req, res) => {
  try {
    const company = await Company.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc Update company
// @route PUT /api/companies/:id
// @access Private (Admin/Staff)
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc Delete company
// @route DELETE /api/companies/:id
// @access Private (Admin)
const deleteCompany = async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc Apply to company
// @route POST /api/companies/:id/apply
// @access Private (Student)
const applyToCompany = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    const existing = await Application.findOne({ student: student._id, company: req.params.id });
    if (existing) return res.status(400).json({ message: 'Already applied' });
    const application = await Application.create({ student: student._id, company: req.params.id });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc Get analytics (Admin)
// @route GET /api/companies/analytics
// @access Private (Admin/Staff)
const getPlacementAnalytics = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const placedStudents = await Student.countDocuments({ isPlaced: true });
    const totalCompanies = await Company.countDocuments();
    const totalApplications = await Application.countDocuments();
    const selected = await Application.countDocuments({ status: 'Selected' });

    const departmentStats = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 }, placed: { $sum: { $cond: ['$isPlaced', 1, 0] } } } }
    ]);

    res.json({
      totalStudents,
      placedStudents,
      totalCompanies,
      totalApplications,
      selected,
      placementRate: totalStudents ? Math.round((placedStudents / totalStudents) * 100) : 0,
      departmentStats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getCompanies, createCompany, updateCompany, deleteCompany, applyToCompany, getPlacementAnalytics };
