import mongoose from 'mongoose';

import {findByValue} from "./accessTocken";

const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: String,
    uuid: String,
    login: String,
    name: String,
    surname: String,
    passwordHash: String,
    salt: String,
    photoSmall: String,
    photoNormal: String,
    chatActivities: {
        type: Array,
        default: ['']
    },
    reputation: {
        type: Number,
        default: 0
    }
},  { versionKey: false });

const User = mongoose.model("User", userSchema);

const creatUserAPI = (userData) => {
    const user = new User(userData);
    return user.save()
};

const newChatActivities = async (uuidUser, uuid) => {
    const doc = await getUserUuid(uuidUser);
    let chatActivities = doc.chatActivities;
    chatActivities.push(uuid);
    await User.updateOne({uuid: uuidUser}, {chatActivities: chatActivities});
};

const findByNicknameOrEmail = async (login, email, exceptions) => {
    return await User.findOne({$or: [{email: email}, {login: login}]}, exceptions)
};

const findById = async (userId) => {
    return await User.findById(userId);
};

const checkLoginAndEmail = async (login, email) => {
    const user = await findByNicknameOrEmail(login, email);
    if (!user) {
        return {loginFound: false, emailFound: false}
    }
    let result = {loginFound: false, emailFound: false};
    if (user.login === login) {
        result.loginFound = true
    }
    if (user.email === email) {
        result.emailFound = true
    }
    return result
};

const changeReputation = async (uuidUser, emotion) => {
    const doc = await getUserUuid(uuidUser);
    if (emotion === 'like'){
        await User.updateOne({uuid: uuidUser}, {reputation: doc.reputation + 1});
        return true
    } else if (emotion === 'dislike') {
        await User.updateOne({uuid: uuidUser}, {reputation: doc.reputation - 1});
        return true
    } else {
        return false
    }
};

const getAllUsers = async () => {
    const dataUsers = await User.find({}, {email: true, login: true, name: true, surname: true, photoSmall: true, reputation: true});
    return dataUsers
};

const getUserNameOfEmail = async (email) => {
    const user = await User.findOne({email: email});
    return {
        "name": user.name,
        "surname": user.surname
    }
};

const getUserUuid = async (uuid, exceptions) => {
    return await User.findOne({uuid: uuid}, exceptions)
};

const removeChatActivities = async (uuidUser, chat) => {
    const doc = await getUserUuid(uuidUser);
    let chatActivities = doc.chatActivities;
    chatActivities.splice(chatActivities.indexOf(chat), 1);
    await User.updateOne({uuid: uuidUser}, {chatActivities: chatActivities});
    return
};

const getUserByAccessTocken = async (accessTocken) => {
    const access = await findByValue(accessTocken);
    return findById(access.user);
};

export {
    findById,
    findByNicknameOrEmail,
    checkLoginAndEmail,
    creatUserAPI,
    changeReputation,
    newChatActivities,
    getAllUsers,
    getUserNameOfEmail,
    removeChatActivities,
    getUserUuid,
    getUserByAccessTocken
}