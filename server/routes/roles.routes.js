// routes/roles.js
import express from "express";
import * as rolesControllers from '../controllers/roles.controllers.js';
import * as rolesValidators from '../validators/roles.validators.js';
import validate from "../middlewares/validate.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";
const router = express.Router();

// create role
router.post("/", authUser, rolesValidators.validateCreateRole, validate, rolesControllers.createRole);

// get roles
router.get("/", authUser, rolesControllers.getRoles);

// get role by id
router.get("/:id", authUser, rolesValidators.validateParamId, validate, rolesControllers.getRoleById);

// update role
router.put("/:id", authUser, rolesValidators.validateUpdateRole, validate, rolesControllers.updateRole);

export default router;
