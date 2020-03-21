CREATE UNIQUE INDEX IF NOT EXISTS ux_example_name
  ON public.example(lower(name));

CREATE UNIQUE INDEX IF NOT EXISTS ux_example_image
  ON public.example(image);
