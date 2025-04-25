// routes/common.js
import express from "express";
import * as commonControllers from '../controllers/common.controllers.js';
import { authUser } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/users/:userId/childrens", authUser, commonControllers.getChildrensByUserId);
router.get("/users/:userId/parent", authUser, commonControllers.getParentByUserId);
router.get('/storage/signed-url', commonControllers.getSignedUrl);
router.post('/storage/getSignedUrlUseingBodyPath', commonControllers.getSignedUrlUseingBodyPath);
router.post('/storage/upload/signed-url', commonControllers.getSignedUrlForUpload);
router.delete('/storage/delete', commonControllers.deleteFile);

export default router;
