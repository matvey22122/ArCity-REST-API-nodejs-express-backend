import express from 'express';
const router = express.Router();

import {deleteRequest} from "../../../models/requestModel";
import {deleteChat} from "../../../models/messageModel";

router.delete('/', async (req, res) => {
    try {
        const uuid = req.query.uuid;
        await deleteChat(uuid);
        await deleteRequest(uuid);
        res.sendStatus(200)
    }catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
});

export default router;