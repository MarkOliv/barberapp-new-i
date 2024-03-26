CREATE TABLE schedules (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    phone BIGINT,
    email TEXT,
    times TIME [],
    date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL,
    services TEXT [] NOT NULL,
    barber_id UUID NOT NULL,
    price FLOAT8
);