import express from 'express';
const router = express.Router();

import {sortFn} from "../../../services/sortObjects";

import {getAllUsers} from "../../../models/userModel";

router.get('/', async (req, res) => {
    try {
        let data = await getAllUsers();
        let dataUsers = data.sort(sortFn('reputation'));
        res.status(200).json(dataUsers);
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
});

export default router;