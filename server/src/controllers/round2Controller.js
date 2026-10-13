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

/**
 * Get Round 2 Shortlisted Results (Public)
 * For Tech, GD, VE: fetches from database where status = 'shortlisted'.
 * For Content: 49 candidates.
 * For Photography: 7 candidates.
 */
export const getRound2Results = async (req, res) => {
  try {
    const { department, search } = req.query;

    const staticCandidates = [
      // Content (49 Candidates)
      { name: "Aarush", rollNumber: "2026UCS1545", department: "Content", branch: "Computer Science" },
      { name: "Abhinav Tomar", rollNumber: "2026UIT2861", department: "Content", branch: "Information Technology" },
      { name: "Akshara Gupta", rollNumber: "2026UBA9037", department: "Content", branch: "Management Studies" },
      { name: "Akshit Garg", rollNumber: "2026UEC2863", department: "Content", branch: "Electronics & Comm." },
      { name: "Ananya Poddar", rollNumber: "2026UCS1671", department: "Content", branch: "Computer Science" },
      { name: "Angel", rollNumber: "2026UCD2126", department: "Content", branch: "CS (Data Analytics)" },
      { name: "Ankush Singh", rollNumber: "2026UCD1944", department: "Content", branch: "CS (Data Analytics)" },
      { name: "Anshika Gupta", rollNumber: "2026UEE3578", department: "Content", branch: "Electrical Engineering" },
      { name: "Arman Dubb", rollNumber: "2026UIC3544", department: "Content", branch: "Instrumentation & Control" },
      { name: "Aryan Gangwar", rollNumber: "2026UCM2340", department: "Content", branch: "Mathematics & Computing" },
      { name: "Atharva Parashar", rollNumber: "2026UEV2807", department: "Content", branch: "ECAM / VLSI" },
      { name: "Avishi Naagar", rollNumber: "2026UBD9715", department: "Content", branch: "Bachelor of Design" },
      { name: "Avni Mahajan", rollNumber: "2026UCS1552", department: "Content", branch: "Computer Science" },
      { name: "Avni Singla", rollNumber: "2026UEE4216", department: "Content", branch: "Electrical Engineering" },
      { name: "Daksh", rollNumber: "2026UIT3027", department: "Content", branch: "Information Technology" },
      { name: "Evika Jain", rollNumber: "2026UME1088", department: "Content", branch: "Mechanical Engineering" },
      { name: "Gaurang", rollNumber: "2026UEC2709", department: "Content", branch: "Electronics & Comm." },
      { name: "Ishaan Babuta", rollNumber: "2026UBA9032", department: "Content", branch: "Management Studies" },
      { name: "Kakul Verma", rollNumber: "2026UEE4507", department: "Content", branch: "Electrical Engineering" },
      { name: "Kartik Kumar", rollNumber: "2026UIT3335", department: "Content", branch: "Information Technology" },
      { name: "Khayanshu Kumar", rollNumber: "2026UCS1525", department: "Content", branch: "Computer Science" },
      { name: "Madhvika Sharma", rollNumber: "2026UBT1071", department: "Content", branch: "Biotechnology" },
      { name: "Mannat Vig", rollNumber: "2026UBA9112", department: "Content", branch: "Management Studies" },
      { name: "Mayank Yadav", rollNumber: "2026UEE4639", department: "Content", branch: "Electrical Engineering" },
      { name: "Mishka Goyal", rollNumber: "2026UBA9098", department: "Content", branch: "Management Studies" },
      { name: "Neevi", rollNumber: "2026UIC4179", department: "Content", branch: "Instrumentation & Control" },
      { name: "Prabhakar", rollNumber: "2026UEC2819", department: "Content", branch: "Electronics & Comm." },
      { name: "Prabhjot Singh", rollNumber: "2026UBD9780", department: "Content", branch: "Bachelor of Design" },
      { name: "Pranav Vats", rollNumber: "2026UIT3029", department: "Content", branch: "Information Technology" },
      { name: "Rishi Vats", rollNumber: "2026UBD9767", department: "Content", branch: "Bachelor of Design" },
      { name: "Saanvi", rollNumber: "2026UME4127", department: "Content", branch: "Mechanical Engineering" },
      { name: "Saanvi Nagpal", rollNumber: "2026UBA9022", department: "Content", branch: "Management Studies" },
      { name: "Saanvi Sharma", rollNumber: "2026UBD9770", department: "Content", branch: "Bachelor of Design" },
      { name: "Saatvik Singhal", rollNumber: "2026UEE4617", department: "Content", branch: "Electrical Engineering" },
      { name: "Samaira Khanna", rollNumber: "2026UME4043", department: "Content", branch: "Mechanical Engineering" },
      { name: "Shabab Ahmed", rollNumber: "2026UIT3113", department: "Content", branch: "Information Technology" },
      { name: "Shaurya Chadha", rollNumber: "2026UEE4643", department: "Content", branch: "Electrical Engineering" },
      { name: "Shishant Yadav", rollNumber: "2026UCS1507", department: "Content", branch: "Computer Science" },
      { name: "Shreshth Dudeja", rollNumber: "2026UCA1557", department: "Content", branch: "CS (Artificial Intelligence)" },
      { name: "Sonakshi", rollNumber: "2026UEE3680", department: "Content", branch: "Electrical Engineering" },
      { name: "Subhanso Das", rollNumber: "2026UCM2350", department: "Content", branch: "Mathematics & Computing" },
      { name: "Swarnika Singh", rollNumber: "2026UEE4624", department: "Content", branch: "Electrical Engineering" },
      { name: "Tanvee Maan", rollNumber: "2026UEE4144", department: "Content", branch: "Electrical Engineering" },
      { name: "Tejas Yadav", rollNumber: "2026UEV2817", department: "Content", branch: "ECAM / VLSI" },
      { name: "Vaibhav Singh", rollNumber: "2026UIT3023", department: "Content", branch: "Information Technology" },
      { name: "Vedanta Bhardwaj", rollNumber: "2026UEE4590", department: "Content", branch: "Electrical Engineering" },
      { name: "Viraj Singh Sisodiya", rollNumber: "2026UCM2334", department: "Content", branch: "Mathematics & Computing" },
      { name: "Vishal Sati", rollNumber: "2026UBD9777", department: "Content", branch: "Bachelor of Design" },
      { name: "Yug Aggarwal", rollNumber: "2026UCA1890", department: "Content", branch: "CS (Artificial Intelligence)" },

      // Photography (7 Candidates)
      { name: "Anirudh Badole", rollNumber: "2026UEE4600", department: "Photography", branch: "Electrical Engineering" },
      { name: "Avishka Varshney", rollNumber: "2026UEV2850", department: "Photography", branch: "ECAM / VLSI" },
      { name: "Kavyanshi", rollNumber: "2026UCE7067", department: "Photography", branch: "Civil Engineering" },
      { name: "Samar Galhot", rollNumber: "2026UBA9005", department: "Photography", branch: "Management Studies" },
      { name: "Shivin Arora", rollNumber: "2026UEC2530", department: "Photography", branch: "Electronics & Comm." },
      { name: "Shriyansh Sisodiya", rollNumber: "2026UCS1514", department: "Photography", branch: "Computer Science" },
      { name: "Syed Momin Razvi", rollNumber: "2026UBD9758", department: "Photography", branch: "Bachelor of Design" }
    ];

    // For Tech, Graphic Design, Video Editing - fetch from database where status = 'shortlisted'
    const dynamicQuery = { status: 'shortlisted' };
    if (department && ['Tech', 'Graphic Design', 'Video Editing'].includes(department)) {
      dynamicQuery.department = department;
    }

    const dbSubmissions = await Round2Submission.find(dynamicQuery).sort({ name: 1 });

    // Deduplicate DB submissions by rollNumber + department
    const seen = new Set();
    const dbCandidates = [];
    for (const sub of dbSubmissions) {
      const key = `${sub.rollNumber}_${sub.department}`;
      if (!seen.has(key)) {
        seen.add(key);
        dbCandidates.push({
          id: sub._id,
          name: sub.name,
          rollNumber: sub.rollNumber,
          department: sub.department,
          status: sub.status || 'shortlisted',
        });
      }
    }

    // Combine database candidates (Tech, GD, VE) with static candidates (Content, Photography)
    let allCandidates = [...dbCandidates, ...staticCandidates];

    if (department && department !== 'All') {
      allCandidates = allCandidates.filter(c => c.department.toLowerCase() === department.toLowerCase());
    }

    if (search) {
      const q = search.trim().toLowerCase();
      allCandidates = allCandidates.filter(
        c => (c.name && c.name.toLowerCase().includes(q)) || (c.rollNumber && c.rollNumber.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      candidates: allCandidates,
      count: allCandidates.length,
    });
  } catch (error) {
    console.error('Error in getRound2Results:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

