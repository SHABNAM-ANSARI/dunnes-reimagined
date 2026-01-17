-- Create gallery_photos table
CREATE TABLE public.gallery_photos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    description TEXT,
    url TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- Anyone can view gallery photos
CREATE POLICY "Anyone can view gallery photos" 
ON public.gallery_photos 
FOR SELECT 
USING (true);

-- Only admins can insert photos
CREATE POLICY "Only admins can insert gallery photos" 
ON public.gallery_photos 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete photos
CREATE POLICY "Only admins can delete gallery photos" 
ON public.gallery_photos 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update photos
CREATE POLICY "Only admins can update gallery photos" 
ON public.gallery_photos 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- Storage policies for gallery bucket
CREATE POLICY "Gallery images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete gallery images"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery' AND has_role(auth.uid(), 'admin'::app_role));