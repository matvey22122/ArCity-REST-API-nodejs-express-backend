import iosocket from 'socket.io';

import {createMessage} from "../models/messageModel";
import {emotionRequest} from "../models/requestModel";
import {getUserByAccessTocken} from "../models/userModel";

let io = null;
const clients = new Map();

export const createSocketIOServer = (server) => {
    io = iosocket(server);
    io.on('connection', async (socket) => {
        console.log('[SOCKETIO] connected');
        const { accessToken, socketId } = socket.handshake.query;
        if (!clients.has(socketId)) {
            const user = await getUserByAccessTocken(accessToken);
            clients.set(socketId, user.uuid);
        }
        socket.on('go to chat', async (uuid) => {
            socket.join(uuid)
        });
        socket.on('chat message', async (data) => {
            const { room, uuidUser, msg } = data;
            await createMessage(room, uuidUser, msg);
            io.to(room).emit('chat message', msg);
        });
        socket.on('like', async ({ uuid }) => {
            const uuidUser = clients.get(socketId);
            await emotionRequest(uuid, uuidUser, 'like');
            io.emit('liked');
            socket.broadcast.emit('liked');
        });
        socket.on('dislike', async ({ uuid }) => {
            const uuidUser =clients.get(socketId);
            await emotionRequest(uuid, uuidUser, 'dislike');
            socket.broadcast.emit('disliked');
        });
        socket.on('read', async (data) => {
            const { uuid, uuidUser, uuidRequest } = data;
        })
    })
};