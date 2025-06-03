import * as clientPaymentsRepositories from '../repositories/clientPayments.repositories.js';
import * as plansRepositories from '../repositories/plans.repositories.js';
import * as userRepositories from '../repositories/user.repositories.js';
import * as rolesRepositories from '../repositories/roles.repositories.js';
import * as incomeRepositories from '../repositories/income.repositories.js';
import * as userService from '../services/user.service.js';
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
            return res.status(404).json({ success: false, message: 'Plan not found', data: null });
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
        // paymentLogger.info('Payment initiated successfully', { plan_id, plan_name: plan.name, user_id: req.user.id, username: req.user.username, order });

        res.status(200).json(order);
    } catch (error) {
        // paymentLogger.info('Payment initiation error', { error: error.message, plan_id: req.body.plan_id, user_id: req.user?.id, username: req.user?.username });
        handleError('createClientPayment', res, error);
    }
}

const handlePaymentCaptured = async ({ event, payload, signature }) => {
    // paymentLogger.info('Payment captured', { event, payload, signature });

    const entity = payload.payment.entity;
    const paymentId = entity.id;
    const orderId = entity.order_id;
    const amount = entity.amount / 100;
    const currency = entity.currency;
    const paymentStatus = entity.status;
    const paymentMethod = entity.method;
    const fee = entity.fee / 100;
    const tax = entity.tax / 100;
    const updatedPayment = await clientPaymentsRepositories.updateClientPaymentByOrderId(orderId, { amount, currency, status: paymentStatus, paymentId, signature, fee, tax, paymentMethod, additionalData: payload.payment.entity });
    console.log("updatedPayment", updatedPayment);
    if (updatedPayment) {
        await userRepositories.markUserRegistered(updatedPayment.client_id);
        const income = await userService.createUserParentHierarchyIncome(updatedPayment.client_id, updatedPayment.id, amount, fee);
        console.log("income", income);
    }
}

const handlePaymentFailed = async ({ event, payload, signature }) => {
    // paymentLogger.info('Payment failed', { event, payload, signature });

    const entity = payload.payment.entity;
    const paymentId = entity.id;
    const orderId = entity.order_id;
    const amount = entity.amount / 100;
    const currency = entity.currency;
    const paymentStatus = entity.status;
    const paymentMethod = entity.method;
    const fee = entity.fee / 100;
    const tax = entity.tax / 100;
    await clientPaymentsRepositories.updateClientPaymentByOrderId(orderId, { amount, currency, status: paymentStatus, paymentId, signature, fee, tax, paymentMethod, additionalData: payload.payment.entity });

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
            return res.status(400).json({ success: false, message: 'Payment verification failed - Invalid signature', data: null });
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

export const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const payments = await clientPaymentsRepositories.getPaymentHistory(userId);
        res.status(200).json({ success: true, message: 'Payment history fetched successfully', data: payments });
    } catch (error) {
        handleError('getPaymentHistory', res, error);
    }
}

export const getClientPaymentsByParentId = async (req, res) => {
    try {
        const userId = req.params.userId === 'me' ? req.user.id : req.params.userId;
        const rawMonth = req.query.month || (new Date().getMonth() + 1);
        const rawYear = req.query.year || new Date().getFullYear();

        const month = parseInt(rawMonth); // ensure it's an integer
        const year = parseInt(rawYear);

        // Construct proper start and end dates
        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0)); // start of the month in UTC
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));  // end of the month in UTC

        const limit = req.query.limit || 10;
        const page = req.query.page || 1;

        const limitInt = parseInt(limit);
        const pageInt = parseInt(page);
        const offset = (pageInt - 1) * limitInt;

        const user = await userRepositories.getUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found', data: null });
        }

        const userRole = await rolesRepositories.getRoleById(user.role_id);
        if (!userRole) {
            return res.status(404).json({ success: false, message: 'User role not found', data: null });
        }
        if (!['admin', 'dietitian'].includes(userRole.key)) {
            return res.status(403).json({ success: false, message: 'User is not an admin or dietitian', data: null });
        }

        const payments = await clientPaymentsRepositories.getClientPaymentsByParentId(userId, limitInt, offset, startDate, endDate, 'captured');
        const paymentIds = payments.map(payment => payment.id);
        const incomes = await incomeRepositories.getIncomesByPaymentIds(paymentIds);

        const paymentsWithIncomes = payments.map(payment => {
            const paymentWithIncomes = { ...payment, incomes: incomes.filter(income => income.payment_id === payment.id) };
            return paymentWithIncomes;
        });

        res.status(200).json({ success: true, message: 'Client payments fetched successfully', data: paymentsWithIncomes });

    } catch (error) {
        handleError('getClientPaymentsByParentId', res, error);
    }
}

export const getIncomeSummaryByParentId = async (req, res) => {
    try {
        const userId = req.params.userId === 'me' ? req.user.id : req.params.userId;
        const rawMonth = req.query.month || (new Date().getMonth() + 1);
        const rawYear = req.query.year || new Date().getFullYear();

        const month = parseInt(rawMonth);
        const year = parseInt(rawYear);

        // Construct proper start and end dates
        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0)); // start of the month in UTC
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));  // end of the month in UTC

        const user = await userRepositories.getUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found', data: null });
        }

        const userRole = await rolesRepositories.getRoleById(user.role_id);
        if (!userRole) {
            return res.status(404).json({ success: false, message: 'User role not found', data: null });
        }
        if (!['admin', 'dietitian'].includes(userRole.key)) {
            return res.status(403).json({ success: false, message: 'User is not an admin or dietitian', data: null });
        }

        const incomeSummary = await incomeRepositories.getIncomeSummaryByParentId(userId, startDate, endDate);
        
        res.status(200).json({ 
            success: true, 
            message: 'Income summary fetched successfully', 
            data: incomeSummary || {
                totalClients: 0,
                totalIncome: 0,
                totalFee: 0,
                personalIncome: 0,
                downlineIncome: 0,
                averagePerClient: 0
            }
        });
    } catch (error) {
        handleError('getIncomeSummaryByParentId', res, error);
    }
}