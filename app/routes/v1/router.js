import express from 'express';
const router = express.Router();

import requestsRouter from './requests/router';
import mapRouter from './map/router';
import chatsRouter from './chats/router';
import contentRouter from './content/router';
import topRouter from './top/router';
import userRouter from './user/router';

router.use('/sync', async (req, res) => {
    res.sendStatus(200)
});
router.use('/requests', requestsRouter);
router.use('/map', mapRouter);
router.use('/chats', chatsRouter);
router.use('/content', contentRouter);
router.use('/top', topRouter);
router.use('/user', userRouter);

export default router;