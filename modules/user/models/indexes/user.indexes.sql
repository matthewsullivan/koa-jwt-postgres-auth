DROP INDEX IF EXISTS ux_users_username;
DROP INDEX IF EXISTS ux_users_email;

CREATE UNIQUE INDEX ux_users_username 
  ON public.user(username);

CREATE UNIQUE INDEX ux_users_email 
  ON public.user(lower(email));