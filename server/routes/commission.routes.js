// routes/commission.js
import express from "express";
import * as commissionControllers from '../controllers/commission.controllers.js';
import * as commissionValidators from '../validators/commission.validators.js';
import validate from "../middlewares/validate.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";
const router = express.Router();

// create commission
router.post("/", authUser, commissionValidators.validateCreateCommission, validate, commissionControllers.createCommission);

// get commissions
router.get("/", authUser, commissionControllers.getCommissions);

// get commission by keys
router.get("/keys", authUser, commissionValidators.validateGetCommission, validate, commissionControllers.getCommissionByKeys);

// update commission
router.put("/:id", authUser, commissionValidators.validateUpdateCommission, validate, commissionControllers.updateCommission);

export default router;
