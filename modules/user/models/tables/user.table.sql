DROP TABLE IF EXISTS public.user CASCADE;

CREATE TABLE public.user
( 
  id serial PRIMARY KEY,
  
  email varchar(256) NOT NULL,
  first_name varchar(256) NOT NULL,
  last_name varchar(256) NOT NULL,
  password varchar(256) NOT NULL,
  username varchar(256) NOT NULL,
  
  created timestamptz DEFAULT now() NOT NULL,
  updated timestamptz DEFAULT now() NOT NULL
);