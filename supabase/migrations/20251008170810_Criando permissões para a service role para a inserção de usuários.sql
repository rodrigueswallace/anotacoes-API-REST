-- 1. Acesso ao schema
GRANT USAGE ON SCHEMA her TO service_role;
 
-- 2. Permissões nas tabelas usadas
GRANT SELECT, INSERT, DELETE ON her.users_data TO service_role;
GRANT INSERT ON her.m_org_t_users_profile TO service_role;
GRANT INSERT ON her.m_log_t_audit_configs_log TO service_role;
 
-- 3. Permissão para executar a RPC
GRANT EXECUTE ON FUNCTION her.get_all_users_complete() TO service_role;
 
-- 4. Permissões em sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA her TO service_role;