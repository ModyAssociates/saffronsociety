-- SQL script to create admin user
-- Run this in your Supabase SQL editor after creating the account

-- Update user role to admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'vish_mody@hotmail.com';

-- Verify the update
SELECT id, email, full_name, role, created_at
FROM public.profiles 
WHERE email = 'vish_mody@hotmail.com';

-- Optional: Check all admin users
SELECT id, email, full_name, role, created_at
FROM public.profiles 
WHERE role = 'admin';
