import express from 'express';
const router = express.Router();

import {getAllMessages} from "../../../models/messageModel";

router.get('/', async (req, res) => {
    try {
        const chat = req.query.uuid;
        const messages = await getAllMessages(chat);
        res.status(200).json(messages);
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
});

export default router;