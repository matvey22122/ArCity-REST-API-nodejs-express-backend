import mongoose from 'mongoose';
import uuidv4 from "uuid/v4";

import {getUserUuid} from "./userModel";

const Schema = mongoose.Schema;

const contentSchema = new Schema({
    postType: {
        type: String,
        default: 'content'
    },
    likes: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now()
    },
    dislikes: {
        type: Number,
        default: 0
    },
    uuidUser: String,
    header: String,
    text: String,
    imagesUrl: Array,
    uuid: String
},  { versionKey: false });

const Content = mongoose.model("Content", contentSchema);

const createNewContent = async (uuidUser, header, text, imagesUrl) => {
    const content = await Content.create({
        uuidUser: uuidUser,
        header: header,
        text: text,
        imagesUrl: imagesUrl,
        uuid: uuidv4()
    });
    return content;
};

const getAllContent = async () => {
    const contents = await Content.find({}, {_id: false});
    return contents
};

const getContentForWatch = async (uuid) => {
    let content = await Content.findOne({uuid: uuid}, {uuid: false, _id: false, postType: false});
    let userName = await getUserUuid(content.uuidUser, {_id: false, reputation: false, email: false, passwordHash: false, salt: false, chatActivities: false, photoNormal: false});
    const dataContent = { ...content._doc, ...userName._doc };
    return dataContent
};

export {
    createNewContent,
    getAllContent,
    getContentForWatch
}