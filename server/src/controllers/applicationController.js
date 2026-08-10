import Application from '../models/Application.js';

export const submitApplication = async (req, res) => {
  try {
    const existing = await Application.findOne({ 
      'personalDetails.email': req.body.personalDetails.email,
      'department': req.body.department
    });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted an application for this department.' });
    }
    const application = await Application.create(req.body);
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const { department, status, search, page = 1, limit = 20 } = req.query;
    let query = {};
    
    if (department) query.department = department;
    if (status) query.status = status;
    if (search) {
      query['$or'] = [
        { 'personalDetails.name': { $regex: search, $options: 'i' } },
        { 'personalDetails.email': { $regex: search, $options: 'i' } },
        { 'personalDetails.rollNumber': { $regex: search, $options: 'i' } }
      ];
    }
    
    const count = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
      
    res.json({
      applications,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalCount: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['submitted', 'under-review', 'shortlisted', 'rejected', 'selected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = ['Tech', 'Graphic Design', 'Photography', 'Content', 'Video Editing'];
    const counts = await Application.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);
    
    const result = departments.map(dept => {
      const found = counts.find(c => c._id === dept);
      return {
        name: dept,
        count: found ? found.count : 0
      };
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const departmentWise = await Application.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);
    
    const submitted = await Application.countDocuments({ status: 'submitted' });
    const underReview = await Application.countDocuments({ status: 'under-review' });
    const shortlisted = await Application.countDocuments({ status: 'shortlisted' });
    const rejected = await Application.countDocuments({ status: 'rejected' });
    const selected = await Application.countDocuments({ status: 'selected' });
    
    res.json({
      totalApplications,
      departmentWise,
      pending: submitted + underReview,
      shortlisted,
      selected,
      rejected
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
