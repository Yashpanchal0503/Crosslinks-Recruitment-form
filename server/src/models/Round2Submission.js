import mongoose from 'mongoose';

const round2SubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    trim: true,
    uppercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Tech', 'Graphic Design', 'Video Editing'],
  },
  submissionData: {
    driveLink: { type: String, trim: true },
    githubLink: { type: String, trim: true },
    websiteLink: { type: String, trim: true },
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index on rollNumber + department to strictly prevent duplicate submissions
round2SubmissionSchema.index({ rollNumber: 1, department: 1 }, { unique: true });
round2SubmissionSchema.index({ submittedAt: -1 });

const Round2Submission = mongoose.model('Round2Submission', round2SubmissionSchema);

export default Round2Submission;
