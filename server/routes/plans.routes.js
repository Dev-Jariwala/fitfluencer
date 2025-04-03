// routes/plans.js
import express from "express";
import * as plansControllers from '../controllers/plans.controllers.js';
import * as plansValidators from '../validators/plans.validators.js';
import validate from "../middlewares/validate.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";
const router = express.Router();

// create plan
router.post("/", authUser, plansValidators.validateCreatePlan, validate, plansControllers.createPlan);

// get plans
router.get("/", authUser, plansControllers.getPlans);

// get plan by id
router.get("/:id", authUser, plansValidators.validateParamId, validate, plansControllers.getPlanById);

// update plan
router.put("/:id", authUser, plansValidators.validateUpdatePlan, validate, plansControllers.updatePlan);

export default router;
