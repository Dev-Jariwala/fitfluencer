-- potgresql table for fitfluencers

-- Config table
CREATE TABLE config (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    key VARCHAR(50) NOT NULL UNIQUE, -- MAX_CHAIN_DIETITIAN (max number of dietitian admin can have in his single line)
    type VARCHAR(50) NOT NULL CHECK (type IN ('string', 'number', 'boolean', 'json')), -- number
    name VARCHAR(50) NOT NULL, -- Max Downline Dietitian
    value INT NOT NULL -- 2
);

-- Users table
CREATE TABLE users (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'others')),
    date_of_birth TIMESTAMP, -- minimum 15 year old
    address VARCHAR(255),
    city VARCHAR(20),
    state VARCHAR(20),
    is_registered BOOLEAN NOT NULL DEFAULT false,
    role_id UUID NOT NULL REFERENCES roles(id),
    parent_id UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tokens table
CREATE TABLE tokens (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    token TEXT UNIQUE NOT NULL,
    token_type VARCHAR(50) NOT NULL, -- e.g., 'email_verification', 'phone_verification', 'password_reset', 'magic_link', 'invite_client'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    expires_at TIMESTAMP NOT NULL,
    is_consumed BOOLEAN DEFAULT FALSE,
    additional_data JSONB -- Store extra data like phone number, or other data
);

-- Roles table
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
    offer_price DECIMAL(10, 2) NOT NULL,
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

-- Commission Distribution table
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
);

-- Income table
CREATE TABLE income (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    commission_percentage DECIMAL(5,2) NOT NULL,
    fee DECIMAL(10,2) NOT NULL,
    payment_id UUID NOT NULL REFERENCES client_payments(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, payment_id)
);

-- Payouts table
CREATE TABLE payouts (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
    note TEXT,
    payout_timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, month, year)
);

-- Daily Fitness Logs table
CREATE TABLE daily_fitness_logs (
    sr_no SERIAL PRIMARY KEY,
    id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    entry_date DATE NOT NULL, -- e.g., '2025-04-13'
    height_cm DECIMAL(5,2),   -- Optional daily if you want to allow updated tracking
    weight_kg DECIMAL(5,2),
    calories_taken INT,
    protein_g DECIMAL(5,2),
    carbs_g DECIMAL(5,2),
    fat_g DECIMAL(5,2),
    water_liters DECIMAL(4,2),
    steps INT,
    sleep_hours DECIMAL(4,2),
    mood VARCHAR(50), -- optional like 'happy', 'tired'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, entry_date) -- One entry per day per user
);
