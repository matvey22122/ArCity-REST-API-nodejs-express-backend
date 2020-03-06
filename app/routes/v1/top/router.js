import express from 'express';
const router = express.Router();

import topRouter from './top';

router.use('/', topRouter);

export default router;