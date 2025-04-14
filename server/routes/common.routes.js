// routes/common.js
import express from "express";
import * as commonControllers from '../controllers/common.controllers.js';
import { authUser } from "../middlewares/auth.middleware.js";
const router = express.Router();

// get childrens by user id
router.get("/users/:userId/childrens", authUser, commonControllers.getChildrensByUserId);

// get parent by user id
router.get("/users/:userId/parent", authUser, commonControllers.getParentByUserId);

export default router;
