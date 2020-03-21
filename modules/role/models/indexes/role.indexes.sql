DROP INDEX IF EXISTS ux_role_role_name;

CREATE UNIQUE INDEX ux_role_role_name 
  ON public.role(lower(role_name));