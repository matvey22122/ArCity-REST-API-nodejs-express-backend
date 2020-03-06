import express from 'express';
import mongoose from 'mongoose';
import logger from 'morgan';
import http from 'http';


import { createSocketIOServer } from './app/services/socketio';

import mainRouter from "./app/routes/router";
import {aboutRequest} from "./app/models/requestModel";

if (process.env.NODE_ENV !== 'production') {
    process.env.PORT = 3000;
    process.env.HOSTNAME = '10.23.40.23'
}

mongoose.connect('mongodb://localhost/arcity', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) throw err;

    console.log('[MONGODB] Connected to arcity db')
});


const app = express();

app.use(logger('dev'));
app.use(express.static('public'));
app.use(express.json());

app.use(mainRouter);

const server = http.createServer(app);

app.get('/test1', (req, res) => {
    res.sendFile(__dirname + '/te++++++++++++st1.html')
});
app.get('/test2', (req, res) => {
    res.sendFile(__dirname + '/test2.html')
});
app.get('/request/:uuid', async (req, res) => {
    try{
        const request = await aboutRequest(req.query.uuid, {_id: false});
        res.status(200).json(request)
    }catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
});


createSocketIOServer(server);


server.listen(3000, '0.0.0.0', () => console.log('started'));