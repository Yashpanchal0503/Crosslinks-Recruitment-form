import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  personalDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    rollNumber: { type: String, required: true },
    contact: { type: String, required: true },
    campus: { type: String, enum: ['Main', 'East', 'West'], required: true },
    branch: { type: String, required: true },
    introduction: { type: String, required: true },
    reasonToJoin: { type: String, required: true }
  },
  department: { type: String, enum: ['Tech', 'Graphic Design', 'Photography', 'Content', 'Video Editing'], required: true },
  departmentAnswers: { type: mongoose.Schema.Types.Mixed, required: true },
  status: { type: String, enum: ['submitted', 'under-review', 'shortlisted', 'rejected', 'selected'], default: 'submitted' },
  createdAt: { type: Date, default: Date.now }
});

applicationSchema.index({ 'personalDetails.email': 1, 'department': 1 }, { unique: true });
applicationSchema.index({ createdAt: -1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
