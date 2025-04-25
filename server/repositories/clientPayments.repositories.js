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
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    order_id VARCHAR(255) NOT NULL,
    receipt VARCHAR(255) NOT NULL,
    payment_id VARCHAR(255) UNIQUE, -- Razorpay Payment ID
    status VARCHAR(20) NOT NULL CHECK (status IN ('captured', 'failed', 'created')),
    signature TEXT, -- Stored for record keeping/verification audit
    fee DECIMAL(10,2),
    tax DECIMAL(10,2),
    payment_method VARCHAR(100), -- E.g., UPI, Card, Net Banking
    additional_data JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Income table
CREATE TABLE income (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    commission_percentage DECIMAL(5,2) NOT NULL,
    layer INT NOT NULL,
    fee DECIMAL(10,2) NOT NULL,
    payment_id UUID NOT NULL REFERENCES client_payments(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, payment_id),
    UNIQUE (payment_id, layer)
);
*/

export const createClientPayment = async ({ clientId, planId, amount, currency, orderId, receipt, status, createdBy }) => {
    const sql = `
        INSERT INTO client_payments (client_id, plan_id, amount, currency, order_id, receipt, status, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;
    const values = [clientId, planId, amount, currency, orderId, receipt, status, createdBy];
    const [result] = await query(sql, values);
    return result;
};

export const getPaymentHistory = async (clientId) => {
    const sql = `
        SELECT * FROM client_payments WHERE client_id = $1 ORDER BY created_at DESC
    `;
    const values = [clientId];
    const result = await query(sql, values);
    return result;
};

export const getClientPaymentsByParentId = async (parentId, limit, offset, startDate, endDate, paymentStatus) => {
    const sql = `
        WITH RECURSIVE child_users AS (
            -- Base case: direct children
            SELECT id FROM users WHERE parent_id = $1
            UNION ALL
            -- Recursive case: children of children
            SELECT u.id FROM users u
            JOIN child_users cu ON u.parent_id = cu.id
        )
        SELECT cp.*, concat(u.sr_no, ' - ', u.first_name, ' ', u.last_name) as username, concat(u2.sr_no, ' - ', u2.first_name, ' ', u2.last_name) as parent_username FROM client_payments cp
        LEFT JOIN users u ON cp.client_id = u.id
        LEFT JOIN users u2 ON u.parent_id = u2.id
        WHERE cp.client_id IN (SELECT id FROM child_users)
        AND cp.created_at BETWEEN $2 AND $3 
        AND cp.status = $4 
        ORDER BY cp.created_at DESC 
        LIMIT $5 OFFSET $6
    `;
    const values = [parentId, startDate, endDate, paymentStatus, limit, offset];
    const result = await query(sql, values);
    return result;
};

// getClientPaymentsByParentId('13fa5e28-cae8-4d5c-8d40-84bc9a8286c9', 10, 0, '2025-04-01', '2025-04-30', 'captured').then(console.log).catch(console.error);

export const updateClientPaymentByOrderId = async (orderId, { amount, currency, status, paymentId, signature, fee, tax, paymentMethod, additionalData }) => {
    const sql = `
        UPDATE client_payments SET amount = $1, currency = $2, status = $3, payment_id = $4, signature = $5, fee = $6, tax = $7, payment_method = $8, additional_data = $9, updated_at = NOW() WHERE order_id = $10 RETURNING *
    `;
    const values = [amount, currency, status, paymentId, signature, fee, tax, paymentMethod, additionalData, orderId];
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

export const getClientPaymentsByClientId = async (clientId) => {
    const sql = `
        SELECT * FROM client_payments WHERE client_id = $1
    `;
    const values = [clientId];
    const result = await query(sql, values);
    return result
};

export const getClientPaymentsByPlanId = async (planId) => {
    const sql = `
        SELECT * FROM client_payments WHERE plan_id = $1
    `;
    const values = [planId];
    const result = await query(sql, values);
    return result;
};

export const getClientPaymentsByClientIdAndPlanId = async (clientId, planId) => {
    const sql = `
        SELECT * FROM client_payments WHERE client_id = $1 AND plan_id = $2
    `;
    const values = [clientId, planId];
    const result = await query(sql, values);
    return result;
};

export const getClientPaymentsByClientIdAndPlanIdAndPaymentStatus = async (clientId, planId, paymentStatus) => {
    const sql = `
        SELECT * FROM client_payments WHERE client_id = $1 AND plan_id = $2 AND payment_status = $3
    `;
    const values = [clientId, planId, paymentStatus];
    const result = await query(sql, values);
    return result;
};

export const getClientPaymentsByClientIdAndPlanIdAndPaymentStatusAndPaymentMethod = async (clientId, planId, paymentStatus, paymentMethod) => {
    const sql = `
        SELECT * FROM client_payments WHERE client_id = $1 AND plan_id = $2 AND payment_status = $3 AND payment_method = $4
    `;
    const values = [clientId, planId, paymentStatus, paymentMethod];
    const result = await query(sql, values);
    return result;
};