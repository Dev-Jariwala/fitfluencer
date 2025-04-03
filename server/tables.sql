-- potgresql table for fitfluencers

-- Config table
CREATE TABLE config (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    key VARCHAR(50) NOT NULL UNIQUE, -- MAX_DOWNLINE_DIETITIAN (max number of dietitian admin can have in his single line)
    type VARCHAR(50) NOT NULL CHECK (type IN ('string', 'number', 'boolean', 'json')), -- number
    name VARCHAR(50) NOT NULL, -- Max Downline Dietitian
    value INT NOT NULL -- 2
);

-- Users table
CREATE TABLE users (
	sr_no SERIAL PRIMARY KEY,
	id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
	username VARCHAR(50) NOT NULL UNIQUE,
	email VARCHAR(100) NOT NULL UNIQUE,
	phone VARCHAR(20) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	-- role_id UUID NOT NULL REFERENCES roles(id),
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id),
    parent_id UUID REFERENCES users(id)
);

-- Roles table
CREATE TABLE roles (
	sr_no SERIAL PRIMARY KEY,
	id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
	key VARCHAR(50) NOT NULL CHECK (key IN ('admin', 'dietitian', 'client')),
    name VARCHAR(50) NOT NULL,
	description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

ALTER TABLE users
add column role_id UUID NOT NULL REFERENCES roles(id);

-- Plans table
CREATE TABLE plans (
	sr_no SERIAL PRIMARY KEY,
	id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
	name VARCHAR(50) NOT NULL,
	description TEXT,
    months INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    points TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

-- Client_payments table
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
);

-- Commission Distribution table
CREATE TABLE commission_distribution (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    max_downline INT NOT NULL,  -- This will allow us to track the number of downlines
    level INT NOT NULL CHECK (level BETWEEN 0 AND max_downline),  -- 1 for first-layer, 2 for second-layer, etc.
    role_id UUID NOT NULL REFERENCES roles(id),
    commission_percentage DECIMAL(5,2) NOT NULL CHECK (commission_percentage BETWEEN 0 AND 100),  -- Percentage for commission
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (max_downline, level, role_id)
);
