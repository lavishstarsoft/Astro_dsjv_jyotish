import { Router } from 'express';

import authRoutes from './auth.routes';
import astrologyRoutes from './astrology.routes';

const router = Router();

// Routes
router.use('/auth', authRoutes);
// router.use('/kundli', kundliRoutes);
router.use('/astrology', astrologyRoutes);

export default router;
