import { query } from "../utils/query.js";

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

export const createPlan = async ({ name, description, points, months, price, offer_price, created_by }) => {
    const sql = `
        INSERT INTO plans (name, description, points, months, price, offer_price, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
    const values = [name, description, points, months, price, offer_price, created_by];
    const [result] = await query(sql, values);
    return result;
};

// createPlan({ name: 'Quarterly Plan', description: 'Great for committed fitness enthusiasts', points: 'Everything in Monthly -points-separator- Advanced workout customization -points-separator- Detailed nutrition plans -points-separator- Priority support -points-separator- Weekly progress reports', months: 1, price: 7000, offer_price: 5000, created_by: '13fa5e28-cae8-4d5c-8d40-84bc9a8286c9' }).then(console.log).catch(console.error);

export const getPlans = async () => {
    const sql = `
        SELECT * FROM plans
    `;
    const result = await query(sql);
    return result;
};

export const getPlanById = async (id) => {
    const sql = `
        SELECT * FROM plans WHERE id = $1
    `;
    const values = [id];
    const [result] = await query(sql, values);
    return result;
};

export const updatePlan = async (id, { name, description, points, months, price, offer_price, is_active, updated_by }) => {
    const sql = `
        UPDATE plans SET name = $1, description = $2, points = $3, months = $4, price = $5, offer_price = $6, is_active = $7, updated_by = $8, updated_at = NOW() WHERE id = $9
        RETURNING *
    `;
    const values = [name, description, points, months, price, offer_price, is_active, updated_by, id];
    const [result] = await query(sql, values);
    return result;
};