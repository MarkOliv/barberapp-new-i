CREATE TABLE products (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    code TEXT,
    name TEXT NOT NULL,
    price FLOAT4,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);