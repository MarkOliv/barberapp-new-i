DROP TRIGGER IF EXISTS barber_notification on public.schedules;

CREATE TRIGGER barber_notification
AFTER
INSERT
    ON public.schedules FOR EACH ROW EXECUTE PROCEDURE public.handle_new_notification();