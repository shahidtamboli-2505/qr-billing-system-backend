import express from 'express';
import { getSummary } from '../controllers/reportController.js';

const router = express.Router();
router.route('/summary').get(getSummary);

export default router;