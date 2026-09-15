import express from 'express';
import { submitApplication, getShortlistedCandidates } from '../controllers/applicationController.js';
import { validateApplication } from '../validators/applicationValidator.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.post('/', validateApplication, validate, submitApplication);
router.get('/results', getShortlistedCandidates);

export default router;

