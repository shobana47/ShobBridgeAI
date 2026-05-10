const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    type: { type: String, enum: ['HR', 'Technical', 'Aptitude', 'Coding'], default: 'HR' },
    questions: [{
      question: String,
      answer: String,
      score: Number,
      feedback: String,
    }],
    totalScore: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    technicalScore: { type: Number, default: 0 },
    duration: { type: Number },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    feedback: { type: String },
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
