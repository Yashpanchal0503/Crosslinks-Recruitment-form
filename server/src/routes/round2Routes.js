import express from 'express';
import {
  submitRound2Task,
  checkRound2Status,
  getRound2Results,
} from '../controllers/round2Controller.js';

const router = express.Router();

router.post('/submit', submitRound2Task);
router.get('/check', checkRound2Status);
router.get('/results', getRound2Results);

export default router;
