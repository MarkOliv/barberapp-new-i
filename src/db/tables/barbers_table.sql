CREATE TABLE barbers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT [],
    specialties TEXT [],
    lunch_time TEXT [],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    avatar_url TEXT,
    barber BOOLEAN,
    email TEXT,
    phone TEXT,
    client BOOLEAN,
    bio TEXT,
    off_work BOOLEAN,
    blocked_times TEXT [],
    blocked_times_date DATE
);