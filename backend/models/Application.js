const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    appliedAt: { type: Date, default: Date.now },
    interviewDate: { type: Date },
    notes: { type: String },
    offeredPackage: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
