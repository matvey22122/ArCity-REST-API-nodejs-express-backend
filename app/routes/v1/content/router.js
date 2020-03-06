import express from 'express';
const router = express.Router();

import createRouter from './create';
import watchRouter from './watch';
import aboutRouter from './about'

router.use('/create', createRouter);
router.use('/watch', watchRouter);
router.use('/about', aboutRouter);

export default router;