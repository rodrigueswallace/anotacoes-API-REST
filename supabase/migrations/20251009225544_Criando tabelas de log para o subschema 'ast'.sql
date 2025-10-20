-- =========================================
-- Log de condição do bem
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_log_t_asset_condition (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action_type        VARCHAR(50) NOT NULL,
  action_label       TEXT        NOT NULL,
  action_description TEXT        NULL,
  item_type          TEXT        NOT NULL DEFAULT 'AssetCondition',
  item_id            INTEGER     NULL,
  item_name          VARCHAR(64) NULL,
  performed_by       UUID        NULL,
  performed_by_name  TEXT        NULL,
  metadata           JSONB       NULL DEFAULT '{}'::JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_asset_condition_performed_by FOREIGN KEY (performed_by)
    REFERENCES auth.users (id)
    ON DELETE SET NULL
);

-- =========================================
-- Log de grupo de bens
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_log_t_asset_group (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action_type        VARCHAR(50) NOT NULL,
  action_label       TEXT        NOT NULL,
  action_description TEXT        NULL,
  item_type          TEXT        NOT NULL DEFAULT 'AssetGroup',
  item_id            INTEGER     NULL,
  item_name          VARCHAR(64) NULL,
  performed_by       UUID        NULL,
  performed_by_name  TEXT        NULL,
  metadata           JSONB       NULL DEFAULT '{}'::JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_asset_group_performed_by FOREIGN KEY (performed_by)
    REFERENCES auth.users (id)
    ON DELETE SET NULL
);

-- =========================================
-- Log de subgrupo de bens
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_log_t_asset_subgroup (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action_type        VARCHAR(50) NOT NULL,
  action_label       TEXT        NOT NULL,
  action_description TEXT        NULL,
  item_type          TEXT        NOT NULL DEFAULT 'AssetSubgroup',
  item_id            INTEGER     NULL,
  item_name          VARCHAR(64) NULL,
  s_her_m_ast_t_asset_group_c_id INTEGER NULL,
  performed_by       UUID        NULL,
  performed_by_name  TEXT        NULL,
  metadata           JSONB       NULL DEFAULT '{}'::JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_asset_subgroup_performed_by FOREIGN KEY (performed_by)
    REFERENCES auth.users (id)
    ON DELETE SET NULL
);
