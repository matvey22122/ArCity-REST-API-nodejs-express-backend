import express from 'express';
const router = express.Router();
import * as UserAPI from '../../../models/userModel';

import uuid from 'uuid/v4'
import sharp from 'sharp';
import upload from "../../../services/uploadImage";
import fs from 'fs';

import hachpas from 'pbkdf2-password';
let hash = hachpas();
const hashPromise = (hashingData) => {
    return new Promise((resolve, reject) => {
        hash(hashingData, (err, pass, salt, hash) => {
            if (err) reject(err);
            resolve({ hash: hash, salt: salt });
        });
    });
};

const checkInput = (input) => {
    if (input.email === null || input.login === null || input.password === null || input.name === null || input.surname === null) return false;
    else return true
};

router.post('/', upload.single('requestData[image]'), async (req, res) => {
    const data = req.body;
    if (!checkInput(data)) {
        res.sendStatus(400);
        return
    }

    const {email, name, surname, password} = data.requestData;
    try {
        const { loginFound, emailFound } = await UserAPI.checkLoginAndEmail(email, email);
        if (emailFound) {
            res.status(409).json({loginFound, emailFound});
            return
        }

        const hashParams = await(hashPromise({ password: password }));

        const url = req.protocol + '://' + process.env.HOSTNAME + ':3000';
        const filename = req.file.filename;
        const photoSmall = url + '/images/' + uuid() + '.' + filename.split('.')[1];
        const photoNormal = url + '/images/' + uuid() + '.' + filename.split('.')[1];
        const newUserData = {
            email: email,
            passwordHash: hashParams.hash,
            name: name,
            surname: surname,
            salt: hashParams.salt,
            uuid: uuid(),
            photoSmall: photoSmall,
            photoNormal: photoNormal
        };
        await UserAPI.creatUserAPI(newUserData);
        res.sendStatus(201);
        await sharp(req.file.path)
            .resize(504, 504)
            .toFile('public' + photoNormal.replace('http://' + process.env.HOSTNAME + ':3000', ''));
        await sharp(req.file.path)
            .resize(87, 87)
            .toFile('public' + photoSmall.replace('http://' + process.env.HOSTNAME + ':3000', ''));
        fs.unlinkSync(req.file.path);
    } catch (e) {
        console.error(e);
        res.sendStatus(500)
    }
});

export default router;