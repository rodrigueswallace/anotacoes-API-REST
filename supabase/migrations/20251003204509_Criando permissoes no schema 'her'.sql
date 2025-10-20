-- 1. Concede uso do schema
GRANT USAGE ON SCHEMA her TO anon, authenticated;
 
-- 2. Concede permissões em todas as tabelas existentes
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA her TO anon, authenticated;
 
-- 3. Concede permissões em sequências (para IDs auto-incremento)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA her TO anon, authenticated;
 
-- 4. Define privilégios padrão para tabelas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA her 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;
 
ALTER DEFAULT PRIVILEGES IN SCHEMA her 
GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated;
 
-- 5. Notifica o PostgREST para recarregar a configuração
NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';