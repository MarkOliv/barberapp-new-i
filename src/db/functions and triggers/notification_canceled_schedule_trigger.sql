DROP TRIGGER IF EXISTS barber_notification on public.schedules;

CREATE TRIGGER barber_notification
AFTER
UPDATE
    ON public.schedules FOR EACH ROW EXECUTE PROCEDURE public.handle_canceled_schedule();