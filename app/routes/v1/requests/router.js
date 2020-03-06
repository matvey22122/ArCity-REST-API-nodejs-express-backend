import express from 'express';
const router = express.Router();

import createRouter from './create';
import deleteRouter from './delete';
import postRouter from './shareit';

router.use('/create', createRouter);
router.use('/delete', deleteRouter);
router.use('/post', postRouter);


export default router;