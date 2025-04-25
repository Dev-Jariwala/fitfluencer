import { query } from "../utils/query.js";

/* -- Commission table
CREATE TABLE commission (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    type VARCHAR(50) CHECK (type IN ('dietitian', 'corporate_client')),
    total_downline INT NOT NULL,  -- This will allow us to track the number of downlines
    for_downline INT NOT NULL CHECK (for_downline BETWEEN 0 AND total_downline),  -- 1 for first-downline, 2 for second-downline, etc.
    role_id UUID NOT NULL REFERENCES roles(id),
    commission_percentage DECIMAL(5,2) NOT NULL CHECK (commission_percentage BETWEEN 0 AND 100),  -- Percentage for commission
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (type,total_downline, for_downline, role_id)
); */

export const createCommission = async ({ type, totalDownline, forDownline, roleId, commissionPercentage }) => {
    const sql = `
        INSERT INTO commission (type, total_downline, for_downline, role_id, commission_percentage)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const values = [type, totalDownline, forDownline, roleId, commissionPercentage];
    const [result] = await query(sql, values);
    return result;
};

// createCommission({ type: 'dietitian', totalDownline: 2, forDownline: 2, roleId: '7b5f1705-908c-4617-9d0b-ba48afea643c', commissionPercentage: 30 }).then(console.log).catch(console.error);
// createCommission({ type: 'dietitian', totalDownline: 2, forDownline: 2, roleId: "c3dddb80-053c-430d-9b7b-d278c0ff1032", commissionPercentage: 10 }).then(console.log).catch(console.error);

export const getCommissions = async () => {
    const sql = `
        SELECT * FROM commission
    `;
    const result = await query(sql);
    return result;
};

export const getCommissionByKeys = async (type, totalDownline, forDownline) => {
    const sql = `
        SELECT * FROM commission WHERE type = $1 AND total_downline = $2 AND for_downline = $3
    `;
    const values = [type, totalDownline, forDownline];
    const result = await query(sql, values);
    return result;
};

export const getCommissionByTypeAndTotalDownlineAndForDownline = async (type, totalDownline, forDownline) => {
    const sql = `
        SELECT * FROM commission WHERE type = $1 AND total_downline = $2 AND for_downline = $3
    `;
    const values = [type, totalDownline, forDownline];
    const [result] = await query(sql, values);
    return result;
};

export const updateCommission = async (id, { type, totalDownline, forDownline, roleId, commissionPercentage }) => {
    const sql = `
        UPDATE commission SET type = $1, total_downline = $2, for_downline = $3, role_id = $4, commission_percentage = $5 WHERE id = $6
    `;
    const values = [type, totalDownline, forDownline, roleId, commissionPercentage, id];
    const [result] = await query(sql, values);
    return result;
};