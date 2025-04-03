// routes/config.js
import express from "express";
import * as configControllers from '../controllers/config.controllers.js';
import * as configValidators from '../validators/config.validators.js';
import validate from "../middlewares/validate.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";
const router = express.Router();

// create config
router.post("/", authUser, configValidators.validateCreateConfig, validate, configControllers.createConfig);

// get configs
router.get("/", authUser, configControllers.getConfigs);

// get config by id
router.get("/:id", authUser, configValidators.validateParamId, validate, configControllers.getConfigById);

// get config by key
router.get("/key/:key", authUser, configValidators.validateParamKey, validate, configControllers.getConfigByKey);

// update config
router.put("/:id", authUser, configValidators.validateUpdateConfig, validate, configControllers.updateConfig);

export default router;
