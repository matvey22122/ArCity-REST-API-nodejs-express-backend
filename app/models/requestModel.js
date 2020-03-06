import mongoose from 'mongoose';
import uuidv4 from "uuid/v4";

import {createMessage} from "./messageModel";
import {changeReputation, getUserUuid} from "./userModel";
import {newChatActivities} from "./userModel";
import {getLastMsg} from "./messageModel";
import asyncForEach from "../services/asyncForEach";
import {removeChatActivities} from "./userModel";

import request from 'request';

import fs from 'fs';

const Schema = mongoose.Schema;

const requestSchema = new Schema({
    postType: {
        type: String,
        default: 'request'
    },
    uuid: String,
    uuidUser: String,
    title: String,
    type: {
        type: String,
        enum: ['bench',  'lamp', 'urn', 'flowerbed', 'ramp', 'other'],
        default: 'other'
    },
    about: String,
    date: {
        type: Date,
        default: Date.now()
    },
    geolocation: {
        latitude: Number,
        longitude: Number
    },
    address: String,
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    path: String
},  { versionKey: false });

const Request = mongoose.model("Request", requestSchema);


const getAllRequestsForWatch = async () => {
    const requests =   await Request.find({}, {likes: false, dislikes: false, about: false, _id: false, geolocation: false});
    return requests
};

const createNewRequest = async (uuidUser, geolocation, title, type, about, path) => {
    await request('https://geocode-maps.yandex.ru/1.x/?apikey=6913878e-21a3-48de-963e-c45b75215bfe&format=json&geocode=' + geolocation.longitude + ',' + geolocation.latitude, async (err, response, body) => {
        const address = await (JSON.parse(body).response.GeoObjectCollection.featureMember)[0].GeoObject.metaDataProperty.GeocoderMetaData.text;
        const newRequest = await Request.create({
            uuidUser: uuidUser,
            geolocation: geolocation,
            title: title,
            type: type,
            about: about,
            path: path,
            uuid: uuidv4(),
            address: address
        });
        await newChatActivities(uuidUser, newRequest.uuid.toString());
        await createMessage(newRequest.uuid.toString(), uuidUser, "Создан новый чат.");
        return newRequest
    });
};

const minDataRequest = async () => {
    const data = await Request.find({}, {address: true, geolocation: true, uuid: true, _id: false});
    return data
};

const aboutRequest = async (uuid, exceptions) => {
    const request = await Request.findOne({uuid: uuid}, exceptions);
    const user = await getUserUuid(request.uuidUser, {_id: false, reputation: false, email: false, passwordHash: false, salt: false, chatActivities: false, photoNormal: false});
    const data = { ...request._doc, ...user._doc };
    return data
};

const getRequestForChat = async (uuidChat) => {
    let request = await Request.findOne({uuid: uuidChat}, {_id: false, uuid: true, title: true, path: true});
    let lastMsg = await getLastMsg(uuidChat);
    const answer = { ...request._doc, ...lastMsg._doc};
    return answer
};

const emotionRequest = async (uuid, uuidUser, emotion) => {
    const doc = await Request.findOne({uuid: uuid});
    if (emotion === "like") {
        await Request.updateOne({uuid: uuid}, {likes: doc.likes + 1});
    }
    else if (emotion === "dislike") {
        await Request.updateOne({uuid: uuid}, {dislikes: doc.dislikes + 1})
    }
    else return false;
    return await changeReputation(uuidUser, emotion);
};

const filterGeoRequests = async (radius, latitude, longitude, types) => {
    let requestsType = [];
    await asyncForEach(types, async (type) => {
        if (await Request.find({type: type})) {
            await asyncForEach(await Request.find({type: type}, {geolocation: true, uuid: true, _id: false}), async (request) => {
                requestsType.push(request)
            })
        }
    });
    let requests = [];
    await asyncForEach(requestsType, async (request) => {
         if (Math.sqrt(Math.pow((request.geolocation.latitude - latitude), 2) + Math.pow((request.geolocation.longitude - longitude), 2)) <= radius){
             requests.push(request)
         }
    });
    return requests
};

const deleteRequest = async (uuid) => {
    const request = await Request.findOneAndDelete({uuid: uuid});
    await removeChatActivities(request.uuidUser, uuid);
    fs.unlinkSync('public' + request.path.replace('http://10.10.201.59:3000', ''));
    return
};


export {
    createNewRequest,
    minDataRequest,
    emotionRequest,
    aboutRequest,
    filterGeoRequests,
    getAllRequestsForWatch,
    getRequestForChat,
    deleteRequest
}