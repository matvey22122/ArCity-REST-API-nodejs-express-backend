import express from 'express';
const router = express.Router();

import {getRequestForChat} from "../../../models/requestModel";
import asyncForEach from "../../../services/asyncForEach";

router.get('/', async (req, res) => {
    try{
        let chats = req.user.chatActivities;
        let requests = [];

        const getAllChats = async () => {
            await asyncForEach(chats, async (uuidChat) => {
                let chat = await getRequestForChat(uuidChat);
                requests.push(chat)
            })
        };

        await getAllChats();

        res.status(200).json(requests)
    }catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
});


export default router;