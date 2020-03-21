ALTER TABLE public.user_role 
  ADD CONSTRAINT fk_user_role_user 
  FOREIGN KEY (user_id)
  REFERENCES public.user (id) ON DELETE CASCADE;
  
ALTER TABLE public.user_role 
  ADD CONSTRAINT fk_user_role_role 
  FOREIGN KEY (role_id)
  REFERENCES public.role (id);