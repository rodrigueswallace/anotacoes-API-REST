-- =========================================
-- Tabela de fontes de financiamento
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_fin_t_funding_source (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados da fonte de financiamento
  name        VARCHAR(64) NOT NULL,
  description VARCHAR(64),

  -- Campos padrão
  is_deleted  BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMPTZ DEFAULT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_fin_t_funding_source PRIMARY KEY (id),

  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_fin_t_funding_source_c_name UNIQUE (name)
);

-- =========================================
-- Tabela de convênios/acordos financeiros
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_fin_t_agreement (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados do acordo
  code             TEXT        NOT NULL,
  name             VARCHAR(32) NOT NULL,
  cnpj             VARCHAR(14) NOT NULL,
  agreement_object VARCHAR(32) NOT NULL,
  start_date       TIMESTAMPTZ NOT NULL,
  end_date         TIMESTAMPTZ NOT NULL,
  total            NUMERIC(10,2) NOT NULL,
  notes            VARCHAR(64),

  -- Campos padrão
  is_deleted       BOOLEAN     DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at       TIMESTAMPTZ DEFAULT NULL,

  -- Relacionamentos
  s_her_m_ctr_t_external_party_c_id INTEGER NOT NULL,
  s_her_m_fin_t_funding_source_c_id INTEGER NOT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_fin_t_agreement PRIMARY KEY (id),

  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_fin_t_agreement_c_cnpj UNIQUE (cnpj),
  CONSTRAINT uq_s_her_m_fin_t_agreement_c_code UNIQUE (code),
  CONSTRAINT uq_s_her_m_fin_t_agreement_c_code_cnpj UNIQUE (code, cnpj),

  -- Declaração de chaves estrangeiras
  CONSTRAINT fk_s_her_m_fin_t_agreement_external_party FOREIGN KEY (s_her_m_ctr_t_external_party_c_id)
    REFERENCES her.m_ctr_t_external_party (id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT,

  CONSTRAINT fk_s_her_m_fin_t_agreement_funding_source FOREIGN KEY (s_her_m_fin_t_funding_source_c_id)
    REFERENCES her.m_fin_t_funding_source (id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT
);

-- =========================================
-- Tabela de documentos associados ao acordo financeiro
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_fin_t_agreement_document (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados do documento
  title       VARCHAR(64) NOT NULL,
  description VARCHAR(256),
  file_path   TEXT        NOT NULL,
  mime_type   VARCHAR(32) NOT NULL,

  -- Campos padrão
  is_deleted  BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMPTZ DEFAULT NULL,

  -- Relacionamento
  s_her_m_fin_t_agreement_c_id INTEGER NOT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_fin_t_agreement_document PRIMARY KEY (id),

  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_fin_t_agreement_document_c_file_path UNIQUE (file_path),

  -- Declaração de chave estrangeira
  CONSTRAINT fk_s_her_m_fin_t_agreement_document FOREIGN KEY (s_her_m_fin_t_agreement_c_id)
    REFERENCES her.m_fin_t_agreement (id)
    ON UPDATE RESTRICT
    ON DELETE CASCADE
);
