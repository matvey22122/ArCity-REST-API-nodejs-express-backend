import express from 'express';
const router = express.Router();

import allRequestsRouter from './allRequests';
import aboutRequest from './aboutRequest';
import filterRequest from './filterRequests'

router.use('/allRequests', allRequestsRouter);
router.use('/aboutRequest', aboutRequest);
router.use('/filterRequest', filterRequest);


export default router;