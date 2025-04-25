// routes/clientPayments.js
import express from "express";
import * as clientPaymentsControllers from '../controllers/clientPayments.controllers.js';
import * as clientPaymentsValidators from '../validators/clientPayments.validators.js';
import validate from "../middlewares/validate.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";
const router = express.Router();

// create client payment
router.post("/", authUser, clientPaymentsValidators.validateCreateClientPayment, validate, clientPaymentsControllers.createClientPayment);

// verify client payment
router.post("/verify", authUser, clientPaymentsValidators.validateVerifyClientPayment, validate, clientPaymentsControllers.verifyClientPayment);

// get payment history
router.get("/history", authUser, clientPaymentsControllers.getPaymentHistory);

// get client payments by parent id
router.get("/parent/:userId", authUser, clientPaymentsControllers.getClientPaymentsByParentId);

// get income summary by parent id
router.get("/income-summary/:userId", authUser, clientPaymentsControllers.getIncomeSummaryByParentId);

export default router;
