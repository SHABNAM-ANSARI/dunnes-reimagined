-- Create enum for gallery categories
CREATE TYPE public.gallery_category AS ENUM ('events', 'sports', 'cultural', 'academics', 'celebrations', 'campus');

-- Add category column to gallery_photos
ALTER TABLE public.gallery_photos 
ADD COLUMN category public.gallery_category NOT NULL DEFAULT 'events';