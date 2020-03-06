import express from 'express';
const router = express.Router();

import {minDataRequest} from "../../../models/requestModel";

router.get('/', async (req, res) => {
    try{
        const requests = await minDataRequest();
        res.status(200).json(requests)
    }catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
});

export default router;