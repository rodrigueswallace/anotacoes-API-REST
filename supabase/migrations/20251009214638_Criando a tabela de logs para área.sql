-- =========================================
-- Tabela de log da tabela "áreas"
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_log_t_area_log (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados do log
  action_type        VARCHAR(50) NOT NULL,                   -- Tipo genérico: CREATE, UPDATE, DELETE, SYSTEM, INFO
  action_label       TEXT        NOT NULL,                   -- Texto legível: "Cadastrou área", "Editou descrição"
  action_description TEXT        NULL,                       -- Justificativa, observações, etc
  item_type          TEXT        NOT NULL DEFAULT 'Área',    -- Tipo do item (fixo para esta tabela)
  item_id            INTEGER     NULL,                       -- ID da área afetada
  item_name          TEXT        NULL,                       -- Nome da área

  -- Dados de quem executou
  performed_by       UUID        NULL,                       -- ID do usuário que executou a ação
  performed_by_name  TEXT        NULL,                       -- Nome do usuário (redundante, para leitura)

  -- Metadados e timestamp
  metadata           JSONB       NULL DEFAULT '{}'::JSONB,   -- Dados extras (ex: {"campo_alterado":"description"})
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),     -- Data/hora da ação

  -- Declarações de chaves primária e estrangeiras
  CONSTRAINT pk_s_her_m_log_t_area_log PRIMARY KEY (id),

  CONSTRAINT fk_s_her_m_log_t_area_log_performed_by FOREIGN KEY (performed_by)
    REFERENCES auth.users (id)
    ON DELETE SET NULL,

  CONSTRAINT fk_s_her_m_log_t_area_log_item FOREIGN KEY (item_id)
    REFERENCES her.m_org_t_area (id)
    ON DELETE CASCADE
);
