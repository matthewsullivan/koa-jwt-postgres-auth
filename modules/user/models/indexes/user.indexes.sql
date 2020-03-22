DROP INDEX IF EXISTS ux_users_email;

CREATE UNIQUE INDEX ux_users_email 
  ON public.user(lower(email));
