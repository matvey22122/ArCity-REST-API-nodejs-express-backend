import express from 'express';
const router = express.Router();

import * as oauth from '../services/oauth2';

import v1Router from './v1/router';
import registerRouter from './v1/register/router';

router.use('/api/v1/register', registerRouter);
router.use('/api/v1/oauth/tokens', oauth.token);
router.use('/api/v1/oauth/refresh', oauth.refresh);

router.use('/api/v1', oauth.authorize, v1Router);


export default router;