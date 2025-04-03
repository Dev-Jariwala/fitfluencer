import { query } from "../utils/query.js";

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

export const createClientPayment = async ({client_id, plan_id, amount, currency, payment_status, transaction_id, payment_method, created_by}) => {
    const sql = `
        INSERT INTO client_payments (client_id, plan_id, amount, currency, payment_status, transaction_id, payment_method, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;
    const values = [client_id, plan_id, amount, currency, payment_status, transaction_id, payment_method, created_by];
    const [result] = await query(sql, values);
    return result;
};

export const getClientPaymentById = async (id) => {
    const sql = `
        SELECT * FROM client_payments WHERE id = $1
    `;
    const values = [id];
    const [result] = await query(sql, values);
    return result;
};

export const getClientPaymentsByClientId = async (client_id) => {
    const sql = `
        SELECT * FROM client_payments WHERE client_id = $1
    `;
    const values = [client_id];
    const result = await query(sql, values);
    return result
};

export const getClientPaymentsByPlanId = async (plan_id) => {
    const sql = `
        SELECT * FROM client_payments WHERE plan_id = $1
    `;
    const values = [plan_id];
    const result = await query(sql, values);
    return result;
};

export const getClientPaymentsByClientIdAndPlanId = async (client_id, plan_id) => {
    const sql = `
        SELECT * FROM client_payments WHERE client_id = $1 AND plan_id = $2
    `;
    const values = [client_id, plan_id];
    const result = await query(sql, values);
    return result;
};

export const getClientPaymentsByClientIdAndPlanIdAndPaymentStatus = async (client_id, plan_id, payment_status) => {
    const sql = `
        SELECT * FROM client_payments WHERE client_id = $1 AND plan_id = $2 AND payment_status = $3
    `;
    const values = [client_id, plan_id, payment_status];
    const result = await query(sql, values);
    return result;
};

export const getClientPaymentsByClientIdAndPlanIdAndPaymentStatusAndPaymentMethod = async (client_id, plan_id, payment_status, payment_method) => {
    const sql = `
        SELECT * FROM client_payments WHERE client_id = $1 AND plan_id = $2 AND payment_status = $3 AND payment_method = $4
    `;
    const values = [client_id, plan_id, payment_status, payment_method];
    const result = await query(sql, values);
    return result;
};