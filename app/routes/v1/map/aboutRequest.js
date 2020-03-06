import express from 'express';
const router = express.Router();

import {aboutRequest} from "../../../models/requestModel";

router.get('/', async (req, res) => {
    try{
        const request = await aboutRequest(req.query.uuid, {_id: false});
        res.status(200).json(request)
    }catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
});

export default router;