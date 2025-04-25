/* 
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

import { query } from "../utils/query.js";

export const createIncome = async ({ userId, amount, commissionPercentage, paymentId, fee, layer }) => {
    const sql = `
        INSERT INTO income (user_id, amount, commission_percentage, payment_id, fee, layer)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const values = [userId, amount, commissionPercentage, paymentId, fee, layer];
    const [result] = await query(sql, values);
    return result;
};

export const getIncome = async () => {
    const sql = `
        SELECT * FROM income
    `;
    const result = await query(sql);
    return result;
};

export const getIncomeById = async (id) => {
    const sql = `
        SELECT * FROM income WHERE id = $1
    `;
    const values = [id];
    const [result] = await query(sql, values);
    return result;
};

export const getIncomesByPaymentIds = async (paymentIds) => {
    const sql = `
        SELECT i.*, concat(u.sr_no, ' - ', u.first_name, ' ', u.last_name) as username FROM income i 
        LEFT JOIN users u ON i.user_id = u.id 
        WHERE i.payment_id = ANY($1)
    `;
    const values = [paymentIds];
    const result = await query(sql, values);
    return result;
};

export const updateIncome = async (id, { userId, amount, commissionPercentage, paymentId, fee, layer }) => {
    const sql = `
        UPDATE income SET user_id = $1, amount = $2, commission_percentage = $3, payment_id = $4, fee = $5, layer = $6 WHERE id = $7
    `;
    const values = [userId, amount, commissionPercentage, paymentId, fee, layer, id];
    const [result] = await query(sql, values);
    return result;
};

export const getIncomeSummaryByParentId = async (parentId, startDate, endDate) => {
    console.log(parentId, startDate, endDate);
    const sql = `
        WITH RECURSIVE child_users AS (
            SELECT id FROM users WHERE parent_id = $1
            UNION ALL
            SELECT u.id FROM users u
            JOIN child_users cu ON u.parent_id = cu.id
        ),
        payments_in_period AS (
            SELECT 
                cp.* 
            FROM 
                client_payments cp
            WHERE 
                cp.client_id IN (SELECT id FROM child_users)
                AND cp.created_at BETWEEN $2 AND $3
                AND cp.status = 'captured'
        ),
        aggregated_payments AS (
            SELECT
                COUNT(DISTINCT client_id) as total_clients,
                SUM(amount) as total_income,
                SUM(fee) as total_fee
            FROM payments_in_period
        ),
        current_user_layer AS (
            SELECT layer FROM income 
            WHERE user_id = $1
            LIMIT 1
        ),
        income_summary AS (
            SELECT
                SUM(CASE WHEN i.user_id = $1 THEN i.amount ELSE 0 END) as personal_income,
                SUM(CASE WHEN i.user_id != $1 AND i.layer > (SELECT layer FROM current_user_layer) THEN i.amount ELSE 0 END) as downline_income
            FROM income i
            WHERE i.payment_id IN (SELECT id FROM payments_in_period)
        )
        SELECT 
            ap.total_clients,
            ap.total_income,
            ap.total_fee,
            isummary.personal_income,
            isummary.downline_income
        FROM
            aggregated_payments ap,
            income_summary isummary;
    `;
    const values = [parentId, startDate, endDate];
    const [result] = await query(sql, values);
    return result;
};


