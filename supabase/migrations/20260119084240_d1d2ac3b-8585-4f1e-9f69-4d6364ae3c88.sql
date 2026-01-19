-- Create a function to check if user is a hard-coded admin
CREATE OR REPLACE FUNCTION public.is_hardcoded_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.email() IN (
    'admin@dunnes-institute.org',
    'dunnesschool@gmail.com'
  )
$$;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Admins can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete gallery images" ON storage.objects;

-- Recreate with hard-coded admin support
CREATE POLICY "Admins can upload gallery images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'gallery' AND (
    has_role(auth.uid(), 'admin'::app_role) OR 
    is_hardcoded_admin()
  )
);

CREATE POLICY "Admins can delete gallery images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'gallery' AND (
    has_role(auth.uid(), 'admin'::app_role) OR 
    is_hardcoded_admin()
  )
);

-- Also update gallery_photos table policies to include hard-coded admins
DROP POLICY IF EXISTS "Only admins can insert gallery photos" ON public.gallery_photos;
DROP POLICY IF EXISTS "Only admins can update gallery photos" ON public.gallery_photos;
DROP POLICY IF EXISTS "Only admins can delete gallery photos" ON public.gallery_photos;

CREATE POLICY "Only admins can insert gallery photos" 
ON public.gallery_photos 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  is_hardcoded_admin()
);

CREATE POLICY "Only admins can update gallery photos" 
ON public.gallery_photos 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  is_hardcoded_admin()
);

CREATE POLICY "Only admins can delete gallery photos" 
ON public.gallery_photos 
FOR DELETE 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  is_hardcoded_admin()
);