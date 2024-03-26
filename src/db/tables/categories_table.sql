CREATE TABLE categories (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "for" TEXT NOT NULL
);