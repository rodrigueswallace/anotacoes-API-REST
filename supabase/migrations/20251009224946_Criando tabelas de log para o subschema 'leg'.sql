-- =====================================================
-- LOG: LEIS (inclui documentos)
-- =====================================================
CREATE TABLE IF NOT EXISTS her.m_log_t_law_log (
  id BIGSERIAL PRIMARY KEY,
  action_type        VARCHAR(50) NOT NULL,    -- INSERT / UPDATE / DELETE
  action_label       TEXT        NOT NULL,    -- Texto amigável
  action_description TEXT,
  item_id            INTEGER,
  item_name          TEXT,
  performed_by       UUID,
  performed_by_name  TEXT,
  metadata           JSONB       DEFAULT '{}'::JSONB,
  created_at         TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT fk_performed_by_law FOREIGN KEY (performed_by)
    REFERENCES auth.users (id) ON DELETE SET NULL
);
