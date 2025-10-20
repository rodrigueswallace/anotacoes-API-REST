-- 1. Conceder USAGE no schema her ao service_role
GRANT USAGE ON SCHEMA her TO service_role;
 
-- 2. Conceder permissões na tabela users_data
GRANT SELECT, INSERT, UPDATE, DELETE ON her.users_data TO service_role;
 
-- 3. Conceder permissões na tabela m_org_t_users_profile
GRANT SELECT, INSERT, UPDATE, DELETE ON her.m_org_t_users_profile TO service_role;
 
-- 4. Conceder permissões na tabela de auditoria (correta)
GRANT SELECT, INSERT, UPDATE, DELETE ON her.m_log_t_audit_configs_log TO service_role;
  
-- 6. Garantir EXECUTE em todas as funções (já existe, mas para garantir)
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA her TO service_role;
