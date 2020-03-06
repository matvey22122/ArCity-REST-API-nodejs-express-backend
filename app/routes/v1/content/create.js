import express from 'express';
const router = express.Router();

import {createNewContent} from "../../../models/contentModel";
import upload from "../../../services/uploadImage";

import asyncForEach from "../../../services/asyncForEach";

router.post('/', upload.array('requestData[images]'), async (req, res) => {
   try{
      const {header, text} = req.body.requestData;
      const uuidUser = req.user.uuid;
      const url = req.protocol + '://' + process.env.HOSTNAME + ':3000';
      let imagesUrl = [];
      await asyncForEach(req.files, async (file) => {
         let filename = await file.filename;
         let imageUrl = url + '/images/' + filename;
         await imagesUrl.push(imageUrl)
      });
      const Content = await createNewContent(uuidUser, header, text, imagesUrl);
      res.sendStatus(200)
   }catch (e) {
      console.log(e);
      res.sendStatus(500)
   }
});

export default router;