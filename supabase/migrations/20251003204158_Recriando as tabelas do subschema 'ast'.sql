-- =========================================
-- Tabela de condição do bem
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_ast_t_asset_condition (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados da condição do bem
  name        VARCHAR(64)  NOT NULL,
  description VARCHAR(128) NOT NULL,
  is_deleted  BOOLEAN      DEFAULT FALSE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMPTZ  DEFAULT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_ast_t_asset_condition PRIMARY KEY (id),

  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_ast_t_asset_condition_c_name UNIQUE (name)
);

-- =========================================
-- Tabela de grupo de bens
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_ast_t_asset_group (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados do grupo de bens
  name                      VARCHAR(16) NOT NULL,
  accounting_code           VARCHAR(16) NOT NULL,
  is_depreciable            BOOLEAN     NOT NULL DEFAULT FALSE,
  annual_depreciation_rate  NUMERIC(10, 2),
  monthly_depreciation_rate NUMERIC(10, 2),
  useful_life               INTEGER,
  residual_value            NUMERIC(10, 2),
  qr_code_required          BOOLEAN     NOT NULL DEFAULT FALSE,
  licensable_vehicle        BOOLEAN     NOT NULL,
  vehicle_type              her.enum_s_her_m_ast_t_asset_group_c_vehicle_type,
  is_deleted                BOOLEAN     DEFAULT FALSE,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at                TIMESTAMPTZ DEFAULT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_ast_t_asset_group PRIMARY KEY (id),

  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_ast_t_asset_group_c_accounting_code UNIQUE (accounting_code),
  CONSTRAINT uq_s_her_m_ast_t_asset_group_c_name UNIQUE (name)
);

-- =========================================
-- Tabela de subgrupo de bens
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_ast_t_asset_subgroup (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados do subgrupo de bens
  name       VARCHAR(64) NOT NULL,
  is_deleted BOOLEAN     DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ DEFAULT NULL,

  -- Relacionamento com grupo de bens
  s_her_m_ast_t_asset_group_c_id INTEGER NOT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_ast_t_asset_subgroup PRIMARY KEY (id),

  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_ast_t_asset_subgroup_c_name UNIQUE (name),

  -- Declaração de chave estrangeira
  CONSTRAINT fk_s_her_m_ast_t_asset_subgroup_group FOREIGN KEY (s_her_m_ast_t_asset_group_c_id)
    REFERENCES her.m_ast_t_asset_group (id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT
);
