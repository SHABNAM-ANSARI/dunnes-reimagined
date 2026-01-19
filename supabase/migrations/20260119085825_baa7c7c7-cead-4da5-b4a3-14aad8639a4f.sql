-- Update help_messages SELECT policy to include hard-coded admins
DROP POLICY IF EXISTS "Only admins can read help_messages" ON public.help_messages;

CREATE POLICY "Only admins can read help_messages" 
ON public.help_messages 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  is_hardcoded_admin()
);

-- Also update UPDATE and DELETE policies for consistency
DROP POLICY IF EXISTS "Only admins can update help_messages" ON public.help_messages;

CREATE POLICY "Only admins can update help_messages" 
ON public.help_messages 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  is_hardcoded_admin()
);

DROP POLICY IF EXISTS "Only admins can delete help_messages" ON public.help_messages;

CREATE POLICY "Only admins can delete help_messages" 
ON public.help_messages 
FOR DELETE 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  is_hardcoded_admin()
);