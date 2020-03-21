DROP INDEX IF EXISTS ux_user_role_user_role;

CREATE UNIQUE INDEX ux_user_role_user_role 
  ON public.user_role(user_id, role_id);