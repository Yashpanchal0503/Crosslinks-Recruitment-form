import express from 'express';
import {
  submitRound2Task,
  checkRound2Status,
} from '../controllers/round2Controller.js';

const router = express.Router();

router.post('/submit', submitRound2Task);
router.get('/check', checkRound2Status);

export default router;
