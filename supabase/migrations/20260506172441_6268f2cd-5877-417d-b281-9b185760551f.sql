-- Allow anyone (including anonymous/unauthenticated) to read basic profile info
-- This ensures forum post/comment joins to profiles work for all visitors
CREATE POLICY "Anyone can view basic profile info"
ON public.profiles
FOR SELECT
TO public
USING (true);

-- Drop the redundant authenticated-only policy since the new one is broader
DROP POLICY IF EXISTS "Authenticated users can view basic profile info" ON public.profiles;