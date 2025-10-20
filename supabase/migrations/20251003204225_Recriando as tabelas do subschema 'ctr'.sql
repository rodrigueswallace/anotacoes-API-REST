-- =========================================
-- Tabela de métodos de aquisição
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_ctr_t_acquisition_method (
  -- Chave primária
  id                   INTEGER      GENERATED ALWAYS AS IDENTITY NOT NULL,
  
  -- Dados do método de aquisição
  name                 VARCHAR(16)  NOT NULL,
  code                 TEXT         NOT NULL,
  requires_attachment  BOOLEAN      NOT NULL DEFAULT FALSE,
  description          VARCHAR(128) NOT NULL,
  
  -- Campos padrão
  is_deleted           BOOLEAN      DEFAULT FALSE,
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at           TIMESTAMPTZ  DEFAULT NULL,
  
  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_ctr_t_acquisition_method PRIMARY KEY (id),
  
  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_ctr_t_acquisition_method_c_code UNIQUE (code)
);

-- =========================================
-- Tabela de documentos obrigatórios para métodos de aquisição
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_ctr_t_acquisition_method_required_document (
  -- Chave primária
  id                             INTEGER      GENERATED ALWAYS AS IDENTITY NOT NULL,
  
  -- Nome do documento obrigatório
  name                           VARCHAR(64)  NOT NULL,
  
  -- Campos padrão
  is_deleted                     BOOLEAN      DEFAULT FALSE,
  created_at                     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at                     TIMESTAMPTZ  DEFAULT NULL,
  
  -- Relacionamento com método de aquisição
  s_her_m_ctr_t_acquisition_method_c_id INTEGER NOT NULL,
  
  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_ctr_t_acquisition_method_required_document PRIMARY KEY (id),
  
  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_ctr_t_acquisition_method_required_document_c_name UNIQUE (name, s_her_m_ctr_t_acquisition_method_c_id),
  
  -- Declaração de chave estrangeira
  CONSTRAINT fk_s_her_m_ctr_t_acquisition_method_required_document FOREIGN KEY (s_her_m_ctr_t_acquisition_method_c_id)
    REFERENCES her.m_ctr_t_acquisition_method (id)
    ON UPDATE RESTRICT
    ON DELETE CASCADE
);

-- =========================================
-- Tabela de tipos de inventário
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_ctr_t_inventory_type (
  -- Chave primária
  id                   INTEGER      GENERATED ALWAYS AS IDENTITY NOT NULL,
  
  -- Dados do tipo de inventário
  name                 VARCHAR(16)  NOT NULL,
  frequency            her.enum_s_her_m_ctr_t_inventory_type_c_frequency NOT NULL,
  requires_committee   BOOLEAN      NOT NULL DEFAULT FALSE,
  description          VARCHAR(64)  NOT NULL,
  
  -- Campos padrão
  is_deleted           BOOLEAN      DEFAULT FALSE,
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at           TIMESTAMPTZ  DEFAULT NULL,
  
  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_ctr_t_inventory_type PRIMARY KEY (id),
  
  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_ctr_t_inventory_type_c_name UNIQUE (name)
);

-- =========================================
-- Tabela de endereços de fornecedores/terceiros
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_ctr_t_external_party_address (
  -- Chave primária
  id           INTEGER      GENERATED ALWAYS AS IDENTITY NOT NULL,
  
  -- Dados do endereço
  postal_code  VARCHAR(8)   NOT NULL,
  street       VARCHAR(32)  NOT NULL,
  neighborhood VARCHAR(32)  NOT NULL,
  city         VARCHAR(32)  NOT NULL,
  state        CHAR(2)      NOT NULL,
  country      VARCHAR(32)  NOT NULL,
  number       VARCHAR(10)  NOT NULL,
  complement   VARCHAR(16),
  
  -- Campos padrão
  is_deleted   BOOLEAN      DEFAULT FALSE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at   TIMESTAMPTZ  DEFAULT NULL,
  
  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_ctr_t_external_party_address PRIMARY KEY (id)
);

-- =========================================
-- Tabela de fornecedores/terceiros
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_ctr_t_external_party (
  -- Chave primária
  id                           INTEGER      GENERATED ALWAYS AS IDENTITY NOT NULL,
  
  -- Dados do fornecedor ou terceiro
  name                         VARCHAR(64)  NOT NULL,
  identity                     VARCHAR(14)  NOT NULL,
  email                        VARCHAR(32)  NOT NULL,
  phone_number                 VARCHAR(20),
  legal_representative         VARCHAR(32),
  notes                        VARCHAR(128),
  
  -- Campos padrão
  is_deleted                   BOOLEAN      DEFAULT FALSE,
  created_at                   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at                   TIMESTAMPTZ  DEFAULT NULL,
  
  -- Relacionamentos
  s_her_m_ctr_t_external_party_address_c_id INTEGER NOT NULL,
  
  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_ctr_t_external_party PRIMARY KEY (id),
  
  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_ctr_t_external_party_c_identity UNIQUE (identity),
  CONSTRAINT uq_s_her_m_ctr_t_external_party_c_email UNIQUE (email),
  CONSTRAINT uq_s_her_m_ctr_t_external_party_c_phone_number UNIQUE (phone_number),
  CONSTRAINT uq_s_her_m_ctr_t_external_party_c_identity_email_phone UNIQUE (identity, email, phone_number),
  
  -- Declaração de chave estrangeira
  CONSTRAINT fk_s_her_m_ctr_t_external_party_address FOREIGN KEY (s_her_m_ctr_t_external_party_address_c_id)
    REFERENCES her.m_ctr_t_external_party_address (id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT
);
