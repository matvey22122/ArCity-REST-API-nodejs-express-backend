import express from 'express';
const router = express.Router();

import {getAllContent} from "../../../models/contentModel";
import {getAllRequestsForWatch} from "../../../models/requestModel";

import {sortFn} from "../../../services/sortObjects";

router.get('/', async (req, res) => {
    try{
        const dataOfContent = await getAllContent();
        const dataOfRequest = await getAllRequestsForWatch();
        let data = dataOfContent.concat(dataOfRequest);
        res.status(200).json(data.sort(sortFn('date')))
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
});

export default router;