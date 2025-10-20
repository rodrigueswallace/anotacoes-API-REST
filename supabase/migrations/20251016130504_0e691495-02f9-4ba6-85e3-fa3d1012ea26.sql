-- ============================================================================
-- Migração: Corrigir Permissões de Auditoria
-- Data: 2025-01-16
-- Descrição: Concede permissões necessárias para edge functions registrarem
--            logs de auditoria na tabela her.m_log_t_audit_configs_log
-- ============================================================================

-- Conceder permissão de USAGE na sequência para roles do Supabase
-- Isso permite que nextval() seja chamado para gerar novos IDs
GRANT USAGE ON SEQUENCE her.m_log_t_audit_configs_log_id_seq TO authenticator;
GRANT USAGE ON SEQUENCE her.m_log_t_audit_configs_log_id_seq TO service_role;
GRANT USAGE ON SEQUENCE her.m_log_t_audit_configs_log_id_seq TO authenticated;

-- Garantir permissões de INSERT e SELECT na tabela de auditoria
-- INSERT: permite criar novos registros de log
-- SELECT: permite consultar logs existentes
GRANT INSERT, SELECT ON TABLE her.m_log_t_audit_configs_log TO authenticator;
GRANT INSERT, SELECT ON TABLE her.m_log_t_audit_configs_log TO service_role;
GRANT INSERT, SELECT ON TABLE her.m_log_t_audit_configs_log TO authenticated;

-- Documentar a mudança
COMMENT ON SEQUENCE her.m_log_t_audit_configs_log_id_seq IS 
'Sequência para IDs da tabela de auditoria consolidada. Permissões concedidas para authenticator, service_role e authenticated em 2025-01-16 para permitir logs de edge functions.';

COMMENT ON TABLE her.m_log_t_audit_configs_log IS 
'Tabela consolidada de auditoria para todas as entidades do sistema. Permissões de INSERT/SELECT concedidas para authenticator, service_role e authenticated em 2025-01-16.';