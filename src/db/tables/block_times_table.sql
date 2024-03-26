CREATE TABLE block_times (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE,
    blocked_times TEXT [],
    dates_blocked_times TEXT [],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);