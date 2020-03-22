DROP INDEX IF EXISTS ux_users_email;
DROP INDEX IF EXISTS ux_users_username;

CREATE UNIQUE INDEX ux_users_email 
  ON public.user(lower(email));

CREATE UNIQUE INDEX ux_users_username 
  ON public.user(username);