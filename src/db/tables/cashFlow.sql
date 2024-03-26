CREATE TABLE cashFlow (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    client_name TEXT,
    services TEXT [],
    products TEXT [],
    total_value TEXT [] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    schedule_id UUID UNIQUE,
    barber_id UUID NOT NULL,
    type TEXT,
    expense_name TEXT,
    description TEXT
);