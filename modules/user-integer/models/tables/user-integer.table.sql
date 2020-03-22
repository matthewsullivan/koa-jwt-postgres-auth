DROP TABLE IF EXISTS public.user_integer CASCADE;

CREATE TABLE public.user_integer
( 
  id serial PRIMARY KEY,

  user_id int NOT NULL UNIQUE,
  integer int NOT NULL,
  
  created timestamptz DEFAULT now() NOT NULL,
  updated timestamptz DEFAULT now() NOT NULL
);