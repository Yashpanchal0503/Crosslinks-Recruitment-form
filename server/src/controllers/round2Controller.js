import Round2Submission from '../models/Round2Submission.js';

/**
 * Submit Round 2 Task
 * Prevents multiple submissions by rollNumber + department
 */
export const submitRound2Task = async (req, res) => {
  // Check deadline: 12th October 2026, 11:59:59 PM IST
  const DEADLINE = new Date('2026-10-12T23:59:59+05:30');
  if (new Date() > DEADLINE) {
    return res.status(403).json({
      success: false,
      message: 'Round 2 submissions have officially closed on 12th October at 11:59 PM.',
    });
  }

  try {
    const { name, rollNumber, phone, department, submissionData } = req.body;

    if (!name || !rollNumber || !department) {
      return res.status(400).json({
        success: false,
        message: 'Name, roll number, and department are required.',
      });
    }

    const cleanRoll = rollNumber.trim().toUpperCase();

    // Create submission (allows multiple submissions)
    let submission;
    try {
      submission = await Round2Submission.create({
        name: name.trim(),
        rollNumber: cleanRoll,
        phone: (phone || '').trim(),
        department,
        submissionData: submissionData || {},
      });
    } catch (createErr) {
      if (createErr.code === 11000) {
        // Fallback if unique index still exists in MongoDB Atlas: update record with latest submission
        submission = await Round2Submission.findOneAndUpdate(
          { rollNumber: cleanRoll, department },
          {
            name: name.trim(),
            phone: (phone || '').trim(),
            submissionData: submissionData || {},
            submittedAt: new Date(),
          },
          { new: true }
        );
      } else {
        throw createErr;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Task submitted successfully!',
      submission,
    });
  } catch (error) {
    console.error('Error in submitRound2Task:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * Check candidate status (Allows multiple submissions)
 */
export const checkRound2Status = async (req, res) => {
  try {
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
    const { department, status, search, page = 1, limit = 50 } = req.query;
    let query = {};

    if (department && department !== 'All') {
      query.department = department;
    }

    if (status && status !== 'All') {
      if (status === 'pending') {
        query.status = { $in: ['submitted', 'under-review'] };
      } else {
        query.status = status;
      }
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

/**
 * Update Round 2 submission status (Admin)
 */
export const updateRound2Status = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['submitted', 'under-review', 'shortlisted', 'rejected', 'selected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const submission = await Round2Submission.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Round 2 submission not found' });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      submission,
    });
  } catch (error) {
    console.error('Error in updateRound2Status:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

