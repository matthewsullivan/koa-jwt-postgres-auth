DROP TABLE IF EXISTS public.role CASCADE;

CREATE TABLE public.role
( 
  id serial PRIMARY KEY,

  role_name varchar(256) NOT NULL,
  
  created timestamptz DEFAULT now() NOT NULL,
  updated timestamptz DEFAULT now() NOT NULL
);