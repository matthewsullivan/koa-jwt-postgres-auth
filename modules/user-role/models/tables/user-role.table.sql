DROP TABLE IF EXISTS public.user_role CASCADE;

CREATE TABLE public.user_role
( 
  id serial PRIMARY KEY,

  user_id int NOT NULL,
  role_id int NOT NULL,
  
  created timestamptz DEFAULT now() NOT NULL,
  updated timestamptz DEFAULT now() NOT NULL
);