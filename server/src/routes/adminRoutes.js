import express from 'express';
import { getAllApplications, getApplication, updateApplicationStatus, getStats } from '../controllers/applicationController.js';
import { getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/applications', getAllApplications);
router.get('/applications/:id', getApplication);
router.patch('/applications/:id/status', updateApplicationStatus);
router.get('/stats', getStats);
router.get('/profile', getProfile);

export default router;
