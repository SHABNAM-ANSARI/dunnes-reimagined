-- Fix the permissive RLS policy on help_messages
-- First drop the overly permissive insert policy
DROP POLICY IF EXISTS "Anyone can submit enquiries" ON public.help_messages;

-- Create a more secure policy that still allows public submissions
-- but validates the data being inserted
CREATE POLICY "Anyone can submit enquiries" 
ON public.help_messages 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  -- Ensure required fields are not empty
  name IS NOT NULL AND 
  email IS NOT NULL AND 
  subject IS NOT NULL AND 
  message IS NOT NULL AND
  -- Ensure status defaults to pending (prevent status manipulation)
  (status IS NULL OR status = 'pending')
);

-- Add a policy to allow users to check admin role via the has_role function
-- This ensures the RPC function works correctly
DROP POLICY IF EXISTS "Users can check own role" ON public.user_roles;
CREATE POLICY "Users can check own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());