import express from 'express';
const router = express.Router();

import {filterGeoRequests} from "../../../models/requestModel";

router.get('/', async (req, res) => {
    try {
        const {radius, latitude, longitude, types} = req.body;
        const requests = await filterGeoRequests(radius, latitude, longitude, types);
        res.status(200).json(requests);
    }catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
});

export default router;