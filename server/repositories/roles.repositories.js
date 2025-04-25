import { query } from "../utils/query.js";

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

export const createRole = async ({key, name, description, created_by}) => {
    const sql = `
        INSERT INTO roles (key, name, description, created_by)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const values = [key, name, description, created_by];
    const [result] = await query(sql, values);
    return result;
};

// createRole({key: 'client', name: 'Client', description: 'Client'}).then(console.log).catch(console.error);

export const getRoles = async () => {
    const sql = `
        SELECT * FROM roles
    `;
    const result = await query(sql);
    return result;
};

export const getRoleById = async (id) => {
    const sql = `
        SELECT * FROM roles WHERE id = $1
    `;
    const values = [id];
    const [result] = await query(sql, values);
    return result;
};

export const updateRole = async (id, {key, name, description, updated_by}) => {
    const sql = `
        UPDATE roles SET key = $1, name = $2, description = $3, updated_by = $4, updated_at = NOW() WHERE id = $5
        RETURNING *
    `;
    const values = [key, name, description, updated_by, id];
    const [result] = await query(sql, values);
    return result;
};