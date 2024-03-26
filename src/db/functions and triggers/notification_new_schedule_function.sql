create
or replace function handle_new_notification() returns trigger as $ $ declare client_id uuid;

begin
select
    id
from
    clients
where
    username = new.name into client_id;

IF client_id IS NOT NULL THEN
INSERT INTO
    public.notifications(
        "from",
        "for",
        "message",
        "type"
    )
VALUES
    (
        client_id,
        new.barber_id,
        new.date,
        'schedule'
    );

RETURN NEW;

ELSE RETURN NEW;

END IF;

END;

$ $ language plpgsql;