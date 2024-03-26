CREATE TABLE notifications (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    "for" UUID NOT NULL,
    "from" UUID NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL,
    type TEXT
);