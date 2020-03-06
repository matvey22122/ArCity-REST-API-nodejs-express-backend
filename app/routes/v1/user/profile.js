import express from 'express';
const router = express.Router();

import {getUserUuid} from "../../../models/userModel";

router.get('/', async (req, res) => {
    try {
        const dataUser = await getUserUuid(req.query.uuid, {_id: false, salt: false, passwordHash: false, photoSmall: false});
        res.status(200).json(dataUser)
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
});

export default router;