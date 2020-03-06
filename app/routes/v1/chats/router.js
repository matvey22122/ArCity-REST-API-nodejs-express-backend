import express from 'express';
const router = express.Router();

import allChatsRouter from './allChats';
import messagesRouter from './messages';

router.use('/allChats', allChatsRouter);
router.use('/messages', messagesRouter);


export default router;