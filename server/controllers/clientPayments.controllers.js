import * as clientPaymentsRepositories from '../repositories/clientPayments.repositories.js';
import * as plansRepositories from '../repositories/plans.repositories.js';
import * as userRepositories from '../repositories/user.repositories.js';
import crypto from 'crypto';
import { handleError } from '../utils/error.js';
import createRazorpayInstance from '../config/razorpay.js';
import winston from "winston";
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils.js';
const errorLogger = winston.loggers.get("error-logger");
const paymentLogger = winston.loggers.get("payment-logger");
import { v4 as uuidv4 } from 'uuid';
/* -- Users table
CREATE TABLE users (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id UUID NOT NULL REFERENCES roles(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    parent_id UUID REFERENCES users(id)
); */

/* -- Roles table
CREATE TABLE roles (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    key VARCHAR(50) NOT NULL CHECK (key IN ('admin', 'dietitian', 'client', 'corporate_client')),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
); */
/* -- Plans table
CREATE TABLE plans (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    months INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    offer_price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    points TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
); */

/* -- Client_payments table
CREATE TABLE client_payments (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id),
    plan_id UUID NOT NULL REFERENCES plans(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    order_id VARCHAR(255) NOT NULL,
    receipt VARCHAR(255) NOT NULL,
    payment_id VARCHAR(255) NOT NULL UNIQUE, -- Razorpay Payment ID
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('success', 'failed')),
    signature TEXT, -- Stored for record keeping/verification audit
    fee DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(100), -- E.g., UPI, Card, Net Banking
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
); */

export const createClientPayment = async (req, res) => {
    try {
        const { plan_id } = req.body;
        const plan = await plansRepositories.getPlanById(plan_id);
        if (!plan) {
            paymentLogger.info('Payment initiation failed - Plan not found', {
                plan_id,
                user_id: req.user.id,
                username: req.user.username
            });
            return res.status(404).json({ message: 'Plan not found' });
        }
        const receipt = uuidv4();
        const options = {
            amount: plan.offer_price * 100,
            currency: 'INR',
            receipt
        }
        const razorpayInstance = createRazorpayInstance();
        const order = await razorpayInstance.orders.create(options);
        await clientPaymentsRepositories.createClientPayment({ clientId: req.user.id, planId: plan_id, amount: order.amount / 100, currency: order.currency, orderId: order.id, receipt: order.receipt, status: order.status, createdBy: req.user.id });
        paymentLogger.info('Payment initiated successfully', { plan_id, plan_name: plan.name, user_id: req.user.id, username: req.user.username, order });

        res.status(200).json(order);
    } catch (error) {
        paymentLogger.info('Payment initiation error', { error: error.message, plan_id: req.body.plan_id, user_id: req.user?.id, username: req.user?.username });
        handleError('createClientPayment', res, error);
    }
}

const handlePaymentCaptured = async ({ event, payload, signature }) => {
    paymentLogger.info('Payment captured', { event, payload, signature });

    const entity = payload.payment.entity;
    const paymentId = entity.id;
    const orderId = entity.order_id;
    const amount = entity.amount;
    const currency = entity.currency;
    const paymentStatus = entity.status;
    const paymentMethod = entity.method;
    const fee = entity.fee;
    const tax = entity.tax;
    const updatedPayment = await clientPaymentsRepositories.updateClientPaymentByOrderId(orderId, { amount, currency, status: paymentStatus, paymentId, signature, fee, tax, paymentMethod });
    console.log("updatedPayment", updatedPayment);
    if (updatedPayment) {
        await userRepositories.markUserRegistered(updatedPayment.client_id);
    }
}

const handlePaymentFailed = async ({ event, payload, signature }) => {
    paymentLogger.info('Payment failed', { event, payload, signature });

    const entity = payload.payment.entity;
    const paymentId = entity.id;
    const orderId = entity.order_id;
    const amount = entity.amount;
    const currency = entity.currency;
    const paymentStatus = entity.status;
    const paymentMethod = entity.method;
    const fee = entity.fee;
    const tax = entity.tax;
    await clientPaymentsRepositories.updateClientPaymentByOrderId(orderId, { amount, currency, status: paymentStatus, paymentId, signature, fee, tax, paymentMethod });

}

export const verifyClientPayment = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        const signature = req.headers['x-razorpay-signature'];
        const isValid = validateWebhookSignature(JSON.stringify(req.body), signature, secret);
        if (!isValid) {
            errorLogger.error('Payment verification failed - Invalid signature', { signature, body: req.body });
            paymentLogger.info('Payment verification failed - Invalid signature', {
                signature,
                body: req.body
            });
            return res.status(400).json({ message: 'Payment verification failed - Invalid signature', success: false });
        }

        const { event, payload } = req.body;

        switch (event) {
            case 'payment.captured':
                await handlePaymentCaptured({ event, payload, signature });
                break;
            case 'payment.failed':
                await handlePaymentFailed({ event, payload, signature });
                break;
            default:
                paymentLogger.info('Unhandled event', { event, payload, signature });
                break;
        }


    } catch (error) {
        paymentLogger.info('Payment verification error', {
            error: error.message,
        });
        handleError('verifyClientPayment', res, error);
    }
}

