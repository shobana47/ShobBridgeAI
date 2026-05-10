const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String },
    industry: { type: String },
    website: { type: String },
    description: { type: String },
    location: { type: String },
    requiredSkills: [{ type: String }],
    minCGPA: { type: Number, default: 6.0 },
    minAtsScore: { type: Number, default: 60 },
    package: { type: String },
    positions: { type: Number, default: 1 },
    jobDescription: { type: String },
    status: { type: String, enum: ['Active', 'Inactive', 'Completed'], default: 'Active' },
    driveDate: { type: Date },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
