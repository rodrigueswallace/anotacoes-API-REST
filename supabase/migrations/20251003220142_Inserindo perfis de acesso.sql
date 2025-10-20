INSERT INTO her.m_org_t_access_profile (name, description, is_deleted, created_at)
VALUES 
  ('Responsável patrimonial', 'Responsável pelos bens', FALSE, CURRENT_TIMESTAMP),
  ('Gestor de almoxarifado', 'Gestor do almoxarifado', FALSE, CURRENT_TIMESTAMP),
  ('Gestor do patrimônio', 'Gestor do patrimônio', FALSE, CURRENT_TIMESTAMP),
  ('Gestor geral', 'Gestor com acesso geral', FALSE, CURRENT_TIMESTAMP),
  ('Administrador', 'Acesso total ao sistema', FALSE, CURRENT_TIMESTAMP),
  ('Auditor', 'Realiza auditoria', FALSE, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;
