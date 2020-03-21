DROP TABLE IF EXISTS public.example CASCADE;

CREATE TABLE public.example
( 
  id serial PRIMARY KEY,
  name varchar(256) NOT NULL,
  image varchar(256) NOT NULL,
  created timestamptz default now() NOT NULL,
  updated timestamptz default now() NOT NULL
);