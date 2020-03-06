import express from 'express';
const router = express.Router();

import {aboutRequest} from "../../../models/requestModel";

import requestp from 'request';
import easyvk from "easyvk";

import fs from 'fs';


router.post('/:uuidRequest', async (req, res) => {
    try {
        console.log(req.body)
        //const { username, password, uuidRequest } = req.body;
        const uuidRequest = req.query.uuidRequest;
        const request = await aboutRequest(uuidRequest, {_id: false});
        easyvk({
            username: '89126592930',
            password: '22122003sadman'
        }).then(async vk => {
            const data = await vk.call('photos.getWallUploadServer', {
            });
            const url = data.vkr.upload_url;
            const formData = {
                photo: fs.createReadStream(__dirname + '/public/images/' + request.path.replace('http://' + process.env.HOSTNAME + ':' + process.env.PORT + '/images/', ''))
            };
            requestp.post({
                url: url,
                formData: formData
            }, async (err, httpResponse, body) => {
                if (err) {
                    return console.error('upload failed:', err);
                }
                const server = JSON.parse(body).server;
                const photo = JSON.parse(body).photo;
                const hash = JSON.parse(body).hash;
                const dataImages = await vk.call('photos.saveWallPhoto', {
                    user_id: vk.session.user_id,
                    photo: photo,
                    server: server,
                    hash: hash
                });
                await vk.call('wall.post', {
                    owner_id: dataImages.vkr[0].owner_id,
                    message: request.about,
                    attachments:  "photo" + dataImages.vkr[0].owner_id + "_" + dataImages.vkr[0].id

                });
            })
        });
    }catch (e) {
        console.log(e)
    }
});

export default router