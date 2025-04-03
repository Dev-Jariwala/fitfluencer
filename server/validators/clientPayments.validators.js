import { body, param, query } from "express-validator";

export const validateCreateClientPayment = [
    body('plan_id').notEmpty().withMessage('Plan ID is required'),
];


export const validateVerifyClientPayment = [
    body('payment_id').notEmpty().withMessage('Payment ID is required'),
    body('order_id').notEmpty().withMessage('Order ID is required'),
    body('signature').notEmpty().withMessage('Signature is required'),
];


