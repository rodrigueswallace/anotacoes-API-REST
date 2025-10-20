-- =========================================
-- Tabela de log para documentos de leis
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_log_t_law_document (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- Informações da ação
  action_type        VARCHAR(50) NOT NULL,       -- Tipo da ação: INSERT, UPDATE, DELETE
  action_label       TEXT        NOT NULL,       -- Texto resumido da ação
  action_description TEXT        NULL,           -- Descrição detalhada (opcional)

  -- Informações do item afetado
  item_type          TEXT        NOT NULL DEFAULT 'LawDocument',
  item_id            INTEGER     NULL,           -- ID do documento de lei afetado
  item_name          VARCHAR(64) NULL,           -- Título do documento de lei

  -- Relacionamento com a lei principal
  s_her_m_leg_t_law_c_id INTEGER NULL,           -- ID da lei associada ao documento

  -- Auditoria de execução
  performed_by       UUID        NULL,           -- Usuário que executou a ação
  performed_by_name  TEXT        NULL,           -- Nome do usuário
  metadata           JSONB       NULL DEFAULT '{}'::JSONB, -- Metadados adicionais (diff, payload, etc.)
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Chave estrangeira para o usuário
  CONSTRAINT fk_law_document_performed_by FOREIGN KEY (performed_by)
    REFERENCES auth.users (id)
    ON DELETE SET NULL
);
