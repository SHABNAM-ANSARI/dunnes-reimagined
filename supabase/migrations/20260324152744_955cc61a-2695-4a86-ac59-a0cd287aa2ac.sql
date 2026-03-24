CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  register_number text UNIQUE NOT NULL,
  student_name text NOT NULL,
  class_name text NOT NULL,
  father_name text DEFAULT '',
  mother_name text DEFAULT '',
  primary_mobile text DEFAULT '',
  secondary_mobile text DEFAULT '',
  active_whatsapp text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read students" ON public.students
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Only admins can insert students" ON public.students
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin') OR is_hardcoded_admin());

CREATE POLICY "Only admins can update students" ON public.students
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin') OR is_hardcoded_admin());

CREATE POLICY "Only admins can delete students" ON public.students
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin') OR is_hardcoded_admin());

CREATE OR REPLACE FUNCTION public.set_active_whatsapp(p_register_number text, p_active_whatsapp text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.students
  SET active_whatsapp = p_active_whatsapp
  WHERE register_number = p_register_number;
END;
$$;