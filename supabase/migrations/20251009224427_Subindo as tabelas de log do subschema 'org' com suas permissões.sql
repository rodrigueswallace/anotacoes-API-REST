-- =====================================================
-- LOG: ÓRGÃOS
-- =====================================================
CREATE TABLE IF NOT EXISTS her.m_log_t_agency_log (
  id BIGSERIAL PRIMARY KEY,
  action_type        VARCHAR(50) NOT NULL,
  action_label       TEXT        NOT NULL,
  action_description TEXT,
  item_id            INTEGER,
  item_name          TEXT,
  performed_by       UUID,
  performed_by_name  TEXT,
  metadata           JSONB       DEFAULT '{}'::JSONB,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_performed_by_agency FOREIGN KEY (performed_by)
    REFERENCES auth.users (id) ON DELETE SET NULL
);

-- =====================================================
-- LOG: UNIDADES
-- =====================================================
CREATE TABLE IF NOT EXISTS her.m_log_t_unit_log (
  id BIGSERIAL PRIMARY KEY,
  action_type        VARCHAR(50) NOT NULL,
  action_label       TEXT        NOT NULL,
  action_description TEXT,
  item_id            INTEGER,
  item_name          TEXT,
  performed_by       UUID,
  performed_by_name  TEXT,
  metadata           JSONB       DEFAULT '{}'::JSONB,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_performed_by_unit FOREIGN KEY (performed_by)
    REFERENCES auth.users (id) ON DELETE SET NULL
);

-- =====================================================
-- LOG: ENTIDADES CREDENCIADAS
-- =====================================================
CREATE TABLE IF NOT EXISTS her.m_log_t_credentialing_entity_log (
  id BIGSERIAL PRIMARY KEY,
  action_type        VARCHAR(50) NOT NULL,
  action_label       TEXT        NOT NULL,
  action_description TEXT,
  item_id            INTEGER,
  item_name          TEXT,
  performed_by       UUID,
  performed_by_name  TEXT,
  metadata           JSONB       DEFAULT '{}'::JSONB,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_performed_by_entity FOREIGN KEY (performed_by)
    REFERENCES auth.users (id) ON DELETE SET NULL
);

-- =====================================================
-- LOG: DEPARTAMENTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS her.m_log_t_department_log (
  id BIGSERIAL PRIMARY KEY,
  action_type        VARCHAR(50) NOT NULL,
  action_label       TEXT        NOT NULL,
  action_description TEXT,
  item_id            INTEGER,
  item_name          TEXT,
  performed_by       UUID,
  performed_by_name  TEXT,
  metadata           JSONB       DEFAULT '{}'::JSONB,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_performed_by_department FOREIGN KEY (performed_by)
    REFERENCES auth.users (id) ON DELETE SET NULL
);

-- Garantir acesso do service_role
GRANT USAGE ON SCHEMA her TO service_role;

-- Permissões em todas as tabelas e logs
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA her TO service_role;

-- Permitir execução de funções
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA her TO service_role;
