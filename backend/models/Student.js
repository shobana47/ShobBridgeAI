const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rollNumber: { type: String },
    department: { type: String },
    batch: { type: String },
    cgpa: { type: Number, default: 0 },
    phone: { type: String },
    address: { type: String },
    skills: [{ type: String }],
    certifications: [{ name: String, issuer: String, year: Number }],
    projects: [{ title: String, description: String, techStack: [String] }],
    education: [{
      degree: String,
      institution: String,
      year: Number,
      percentage: Number
    }],
    resumeUrl: { type: String },
    atsScore: { type: Number, default: 0 },
    placementReadinessScore: { type: Number, default: 0 },
    technicalScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    profileComplete: { type: Boolean, default: false },
    linkedIn: { type: String },
    github: { type: String },
    portfolio: { type: String },
    isEligible: { type: Boolean, default: false },
    isPlaced: { type: Boolean, default: false },
    placedCompany: { type: String },
    placedPackage: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
