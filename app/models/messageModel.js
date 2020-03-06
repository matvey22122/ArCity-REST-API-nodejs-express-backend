import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import uuid from 'uuid/v4';

const mesSchema = new Schema({
    uuidUser: String,
    message: String,
    date: {
        type: Date,
        default: Date.now()
    },
    uuid: {
        type: String,
        default: uuid()
    }
},  { versionKey: false });

const connection = mongoose.connection;

const deleteChat = async (chat) => {
    await connection.db.dropCollection(chat);
    return
};

const getAllMessages = async (uuidRequest) => {
    const Message = mongoose.model(uuidRequest, mesSchema);
    const messages = await Message.find({});
    return messages
};

const getLastMsg = async (uuidRequest) => {
    const Message = mongoose.model(uuidRequest, mesSchema);
    const messages = await Message.find({}, {_id: false, email: false});
    const lastMsg = messages[messages.length - 1];
    return lastMsg
};

const createMessage = async (uuidRequest, uuidUser, message) => {
     const Message = mongoose.model(uuidRequest, mesSchema);
     await Message.create({
         uuidUser: uuidUser,
         message: message
     });
    return Message
};

const readMessage = async (uuidRequest, uuidUser, message) => {
    const Message = mongoose.model(uuidRequest, mesSchema);
};

export {
    createMessage,
    getAllMessages,
    getLastMsg,
    deleteChat
}