import express from 'express';
const router = express.Router();

import {getContentForWatch} from "../../../models/contentModel";

router.get('/', async (req, res) => {
   try{
      const uuid = req.query.uuid;
      const dataContent = await getContentForWatch(uuid);
      res.status(200).json(dataContent)
   }catch (e) {
      console.log(e);
      res.sendStatus(500)
   }
});

export default router;