import { Router } from 'express';
import { calculateChart } from '../controllers/astrology.controller';

const router = Router();

router.post('/calculate', calculateChart);

export default router;
