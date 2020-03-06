import express from 'express';
const router = express.Router();

import profileRouter from './profile';

router.use('/profile', profileRouter);

export default router;