import express from 'express';
const router = express.Router();

import {createNewRequest} from "../../../models/requestModel";

import upload from "../../../services/uploadImage";
import waterMarkImage from "../../../services/waterMarkImage";

router.post('/', upload.single('requestData[image]'), (req, res) => {
    try {
        const { title, type, about, latitude, longitude } = req.body.requestData;
        const uuidUser = req.user.uuid;
        const url = req.protocol + '://' + process.env.HOSTNAME + ':3000';
        const filename = req.file.filename;
        const imageUrl = url + '/images/' + filename;
        const newRequest = createNewRequest(uuidUser, { latitude, longitude}, title, type, about, imageUrl);
        res.sendStatus(200);
        waterMarkImage(imageUrl, 'http://' + process.env.HOSTNAME + ':' + process.env.PORT + "/images/watermark.png", 2).then(image => image.write('public' + imageUrl.replace('http://' + process.env.HOSTNAME + ':' + process.env.PORT, '')))
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
});

export default router;