CREATE TABLE clients (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE,
    avatar_url TEXT NOT NULL,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    barber BOOLEAN,
    client BOOLEAN,
    address TEXT,
    email TEXT,
    phone TEXT
);