import express from 'express';
import { getTables } from '../controllers/tableController.js';

const router = express.Router();
router.route('/').get(getTables);

export default router;