import uid from 'uuid/v4';
import * as AccessTokenAPI from '../models/accessTocken';
import * as RefreshTokenAPI from '../models/resfreshTocken';
import * as UserAPI from '../models/userModel';

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

function createToken() {
    return uid();
}

function parseBearer(req) {
    let authHeader = req.get('Authorization');
    let bearer = '';

    if (authHeader)
        bearer = authHeader.split(' ')[1];

    return bearer;
}

async function token(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    try {
        let user = await UserAPI.findByNicknameOrEmail(email, email);
        if (!user) {
            res.sendStatus(404);
            return;
        }

        let hashParams = await(hashPromise({ password: password, salt: user.salt }));
        if (hashParams.hash === user.passwordHash) {
            await AccessTokenAPI.deleteByUserId(user._id);
            await RefreshTokenAPI.deleteByUserId(user._id);

            //create tokens
            let accessToken = await AccessTokenAPI.create(createToken(), user);
            let refreshToken = await RefreshTokenAPI.create(createToken(), user);

            res.status(200).json({
                accessToken: accessToken.value,
                refreshToken: refreshToken.value
            });
        }
        else
            res.sendStatus(404);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

async function authorize(req, res, next) {
    let bearer = parseBearer(req);

    try {
        let accessToken = await AccessTokenAPI.findByValue(bearer);
        if (!accessToken) { //if accessToken not found
            res.sendStatus(401);
            return;
        }

        let user = await UserAPI.findById(accessToken.user);
        if (!user) { //if accessToken doesn't linked with user
            res.sendStatus(401);
            return
        }

        req.user = user;
        next();
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}





async function refresh(req, res) {
    let token = req.body.refreshToken;
    try {
        //find refresh token
        let refreshToken = await RefreshTokenAPI.findByValue(token);
        if (!refreshToken) {
            res.sendStatus(404);
            return;
        }

        //find user
        let user = await UserAPI.findById(refreshToken.user);
        if (!user) {
            res.sendStatus(404);
            return;
        }

        //remove old access token
        await AccessTokenAPI.deleteByUserId(user._id);

        //create new access token
        let newAccessToken = await AccessTokenAPI.create(createToken(), user);
        res.status(200).json({
            accessToken: newAccessToken.value
        });
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export {
    token,
    authorize,
    refresh
}