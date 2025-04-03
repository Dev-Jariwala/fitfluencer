import * as clientPaymentsRepositories from '../repositories/clientPayments.repositories.js';
import * as plansRepositories from '../repositories/plans.repositories.js';
import crypto from 'crypto';
import { handleError } from '../utils/error.js';
import createRazorpayInstance from '../config/razorpay.js';

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
    currency VARCHAR(3) NOT NULL DEFAULT 'INR', -- Explicitly setting INR
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('success')),
    transaction_id VARCHAR(255) NOT NULL UNIQUE, -- Razorpay Payment ID
    payment_method VARCHAR(50), -- e.g., UPI, Card, Net Banking
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
); */

export const createClientPayment = async (req, res) => {
    try {
        const { plan_id } = req.body;
        console.log('req.body', req.body);
        const plan = await plansRepositories.getPlanById(plan_id);
        console.log('plan', plan);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        const options ={
            amount: plan.offer_price * 100,
            currency: 'INR',
            receipt: 'receipt_order_1',
        }
        const razorpayInstance = createRazorpayInstance();
        const order = await razorpayInstance.orders.create(options);
        console.log('order', order);
        res.status(200).json(order);
    } catch (error) {
        handleError('createClientPayment', res, error);
    }
}

export const verifyClientPayment = async (req, res) => {
    try {
        const { payment_id, order_id, signature } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET;

        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(`${order_id}|${payment_id}`);
        const digest = hmac.digest('hex');

        if (digest !== signature) {
            return res.status(400).json({ message: 'Payment verification failed', success: false });
        }

        res.status(200).json({ message: 'Payment verified successfully', success: true });
    } catch (error) {
        handleError('verifyClientPayment', res, error);
    }
}

