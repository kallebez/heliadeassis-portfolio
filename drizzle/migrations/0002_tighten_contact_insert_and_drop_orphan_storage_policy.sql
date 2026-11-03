-- Replace the tautological INSERT check on contact_messages with real field validation.
-- The public contact form still works: limits match what the form already validates.
DROP POLICY "Qualquer pessoa pode enviar mensagem" ON public.contact_messages;
CREATE POLICY "Qualquer pessoa pode enviar mensagem"
ON public.contact_messages
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 200
  AND char_length(whatsapp) BETWEEN 5 AND 30
  AND char_length(message) BETWEEN 1 AND 2000
  AND (email IS NULL OR char_length(email) <= 320)
);

-- Drop the orphaned public read rule on storage.objects for bucket 'site':
-- the bucket does not exist (public buckets are blocked in this workspace) and
-- site images are stored as data URLs in public.site_content, so the rule grants
-- broad access to nothing and only creates exposure risk if a bucket appears later.
DROP POLICY "public read site images" ON storage.objects;