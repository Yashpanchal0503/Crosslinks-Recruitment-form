import Round2Submission from '../models/Round2Submission.js';

/**
 * Submit Round 2 Task
 * Prevents multiple submissions by rollNumber + department
 */
export const submitRound2Task = async (req, res) => {
  try {
    const { name, rollNumber, phone, department, submissionData } = req.body;

    if (!name || !rollNumber || !department) {
      return res.status(400).json({
        success: false,
        message: 'Name, roll number, and department are required.',
      });
    }

    const cleanRoll = rollNumber.trim().toUpperCase();

    // Check if the candidate has already submitted for this department
    const existing = await Round2Submission.findOne({
      rollNumber: cleanRoll,
      department: department,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        alreadySubmitted: true,
        message: `You have already submitted your Round 2 task for ${department}. Each student can only submit once per department.`,
        submittedAt: existing.submittedAt,
      });
    }

    // Create new submission
    const submission = await Round2Submission.create({
      name: name.trim(),
      rollNumber: cleanRoll,
      phone: (phone || '').trim(),
      department,
      submissionData: submissionData || {},
    });

    res.status(201).json({
      success: true,
      message: 'Task submitted successfully!',
      submission,
    });
  } catch (error) {
    // Handle MongoDB duplicate key error code 11000
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        alreadySubmitted: true,
        message: 'You have already submitted your Round 2 task for this department.',
      });
    }
    console.error('Error in submitRound2Task:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * Check if candidate already submitted for rollNumber + department
 */
export const checkRound2Status = async (req, res) => {
  try {
    const { rollNumber, department } = req.query;

    if (!rollNumber || !department) {
      return res.status(400).json({
        success: false,
        message: 'Roll number and department are required.',
      });
    }

    const cleanRoll = rollNumber.trim().toUpperCase();

    const existing = await Round2Submission.findOne({
      rollNumber: cleanRoll,
      department: department,
    });

    if (existing) {
      return res.json({
        success: true,
        alreadySubmitted: true,
        message: `A Round 2 submission already exists for Roll No. ${cleanRoll} in ${department}.`,
        submittedAt: existing.submittedAt,
      });
    }

    return res.json({
      success: true,
      alreadySubmitted: false,
    });
  } catch (error) {
    console.error('Error in checkRound2Status:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * Get all Round 2 submissions (Admin)
 */
export const getAllRound2Submissions = async (req, res) => {
  try {
    const { department, search, page = 1, limit = 50 } = req.query;
    let query = {};

    if (department && department !== 'All') {
      query.department = department;
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query['$or'] = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { rollNumber: { $regex: escapedSearch, $options: 'i' } },
        { phone: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    const count = await Round2Submission.countDocuments(query);
    const submissions = await Round2Submission.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      submissions,
      totalSubmissions: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error('Error in getAllRound2Submissions:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
