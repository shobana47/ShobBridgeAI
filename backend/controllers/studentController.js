const Student = require('../models/Student');
const User = require('../models/User');

// @desc Get student profile
// @route GET /api/student/profile
// @access Private (Student)
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('user', 'name email role');
    if (!student) {
      // Auto-create minimal profile
      const newStudent = await Student.create({ user: req.user._id });
      return res.json(newStudent);
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc Update student profile
// @route PUT /api/student/profile
// @access Private (Student)
const updateStudentProfile = async (req, res) => {
  try {
    const updated = await Student.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body, profileComplete: true },
      { new: true, upsert: true }
    ).populate('user', 'name email');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc Get all students (Admin/Staff)
// @route GET /api/student/all
// @access Private (Admin/Staff)
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('user', 'name email createdAt');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc Analyze resume and compute AI scores (simulated)
// @route POST /api/student/analyze-resume
// @access Private (Student)
const analyzeResume = async (req, res) => {
  try {
    const { skills, certifications, projects, education, cgpa } = req.body;

    const skillScore = Math.min(100, (skills?.length || 0) * 7 + 40);
    const certScore = Math.min(100, (certifications?.length || 0) * 12 + 50);
    const projectScore = Math.min(100, (projects?.length || 0) * 15 + 40);
    const educationScore = Math.min(100, cgpa ? cgpa * 10 : 60);
    const atsScore = Math.round((skillScore * 0.35 + certScore * 0.2 + projectScore * 0.25 + educationScore * 0.2));
    const placementReadiness = Math.round(
      skillScore * 0.3 + certScore * 0.15 + projectScore * 0.25 + educationScore * 0.2 + 70 * 0.1
    );

    // Save scores to student profile
    await Student.findOneAndUpdate(
      { user: req.user._id },
      {
        atsScore,
        placementReadinessScore: placementReadiness,
        technicalScore: skillScore,
        communicationScore: Math.min(100, 65 + Math.random() * 20),
      },
      { new: true, upsert: true }
    );

    res.json({
      atsScore,
      placementReadiness,
      skillScore,
      certScore,
      projectScore,
      educationScore,
      missingKeywords: ['Docker', 'REST APIs', 'SQL', 'System Design'].slice(0, Math.max(1, 4 - (skills?.length || 0))),
      suggestions: [
        'Add more industry-relevant technical skills',
        'Include quantifiable achievements in projects',
        'Add professional certifications (AWS, Google, etc.)',
        'Strengthen your GitHub profile links',
      ],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc Get skill gap analysis
// @route POST /api/student/skill-gap
// @access Private (Student)
const getSkillGap = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const { targetCompany } = req.body;

    const companyRequirements = {
      TCS: ['Java', 'SQL', 'Communication', 'Problem Solving'],
      Infosys: ['Python', 'Java', 'SQL', 'REST APIs'],
      Zoho: ['React', 'Node.js', 'SQL', 'System Design'],
      Wipro: ['Java', 'Spring Boot', 'SQL', 'REST APIs'],
      default: ['Data Structures', 'Algorithms', 'SQL', 'OOP', 'REST APIs'],
    };

    const required = companyRequirements[targetCompany] || companyRequirements.default;
    const studentSkills = (student?.skills || []).map((s) => s.toLowerCase());
    const missing = required.filter((s) => !studentSkills.includes(s.toLowerCase()));
    const matched = required.filter((s) => studentSkills.includes(s.toLowerCase()));

    res.json({
      targetCompany: targetCompany || 'General',
      required,
      matched,
      missing,
      matchPercentage: Math.round((matched.length / required.length) * 100),
      learningRoadmap: missing.map((skill) => ({
        skill,
        resources: [`Master ${skill} – Udemy`, `${skill} Crash Course – YouTube`, `${skill} Official Docs`],
        estimatedTime: '2-4 weeks',
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc Get company recommendations
// @route GET /api/student/recommendations
// @access Private (Student)
const getRecommendations = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });

    const companies = [
      { name: 'TCS', minCGPA: 6.0, minAts: 60, package: '3.5 LPA', requiredSkills: ['Java', 'SQL'] },
      { name: 'Infosys', minCGPA: 6.5, minAts: 65, package: '4.0 LPA', requiredSkills: ['Python', 'SQL'] },
      { name: 'Wipro', minCGPA: 6.0, minAts: 60, package: '3.5 LPA', requiredSkills: ['Java', 'Communication'] },
      { name: 'Zoho', minCGPA: 7.5, minAts: 75, package: '7.0 LPA', requiredSkills: ['React', 'Node.js'] },
      { name: 'Hexaware', minCGPA: 6.0, minAts: 55, package: '4.5 LPA', requiredSkills: ['Python', 'ML'] },
      { name: 'Cognizant', minCGPA: 6.5, minAts: 60, package: '4.0 LPA', requiredSkills: ['Java', 'Spring Boot'] },
    ];

    const cgpa = student?.cgpa || 0;
    const ats = student?.atsScore || 0;
    const skills = student?.skills || [];

    const recommendations = companies.map((company) => {
      const cgpaMatch = cgpa >= company.minCGPA;
      const atsMatch = ats >= company.minAts;
      const skillMatch = company.requiredSkills.filter((s) =>
        skills.map((sk) => sk.toLowerCase()).includes(s.toLowerCase())
      );
      const matchScore = Math.round(
        (cgpaMatch ? 30 : 0) + (atsMatch ? 30 : 0) + (skillMatch.length / company.requiredSkills.length) * 40
      );
      return { ...company, matchScore, eligible: cgpaMatch && atsMatch, skillMatch };
    });

    recommendations.sort((a, b) => b.matchScore - a.matchScore);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  getAllStudents,
  analyzeResume,
  getSkillGap,
  getRecommendations,
};
