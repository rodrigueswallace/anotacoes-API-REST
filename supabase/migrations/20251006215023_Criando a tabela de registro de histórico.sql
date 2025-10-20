-- =========================================
-- Tabela de log de auditoria
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_log_t_audit_configs_log (
  -- Chave primária
  id BIGSERIAL PRIMARY KEY,

  -- Dados do log
  action_type        VARCHAR(50) NOT NULL,                  -- Tipo genérico: CREATE, UPDATE, DELETE, SYSTEM, INFO
  action_label       TEXT        NOT NULL,                  -- Texto legível: "Cadastrou NF", "Gerou etiquetas"
  action_description TEXT        NULL,                      -- Justificativa, observações, etc
  item_type          TEXT        NOT NULL DEFAULT 'Geral', -- Tipo do item: 'Usuário', 'NF', 'Órgão', 'Item'
  item_id            UUID        NULL,                      -- ID do item afetado
  item_name          TEXT        NULL,                      -- Nome do item

  -- Dados de quem executou
  performed_by       UUID        NULL,                      -- ID do usuário que executou a ação
  performed_by_name  TEXT        NULL,                      -- Nome do usuário (redundante, para leitura)
  user_avatar_url    TEXT        NULL,                      -- Foto do usuário (opcional, ajuda na UI)

  -- Metadados e timestamp
  metadata           JSONB       NULL DEFAULT '{}'::JSONB,  -- Dados extras (ex: {"data_entrada":"25/02/2025"})
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),    -- Data/hora da ação

  -- Declaração de chave estrangeira
  CONSTRAINT fk_performed_by FOREIGN KEY (performed_by)
    REFERENCES auth.users (id)
    ON DELETE SET NULL
);
