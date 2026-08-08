import express from 'express';
import { submitApplication, getDepartments } from '../controllers/applicationController.js';
import { validateApplication } from '../validators/applicationValidator.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.post('/', validateApplication, validate, submitApplication);

export default router;
