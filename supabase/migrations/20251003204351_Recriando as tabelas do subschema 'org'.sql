-- =========================================
-- Tabela de áreas
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_org_t_area (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados da área
  name        VARCHAR(16) NOT NULL,
  description VARCHAR(64) NOT NULL,
  is_deleted  BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMPTZ DEFAULT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_org_t_area PRIMARY KEY (id),

  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_org_t_area_c_name UNIQUE (name)
);

-- =========================================
-- Tabela de endereços de órgãos
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_org_t_agency_address (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados do endereço
  postal_code  VARCHAR(8)  NOT NULL,
  street       VARCHAR(32) NOT NULL,
  neighborhood VARCHAR(32) NOT NULL,
  city         VARCHAR(32) NOT NULL,
  state        CHAR(2)     NOT NULL,
  number       VARCHAR(10) NOT NULL,
  complement   VARCHAR(16),
  is_deleted   BOOLEAN     DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at   TIMESTAMPTZ DEFAULT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_org_t_agency_address PRIMARY KEY (id)
);

-- =========================================
-- Tabela de órgãos
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_org_t_agency (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados da agência
  name             VARCHAR(128) NOT NULL,
  acronym          VARCHAR(10)  NOT NULL,
  agency_code      VARCHAR(10)  NOT NULL,
  cnpj             VARCHAR(14)  NOT NULL,
  phone_number     VARCHAR(20)  NOT NULL,
  email            VARCHAR(32)  NOT NULL,
  government_power her.enum_s_her_m_org_t_agency_c_government_power NOT NULL,
  is_deleted       BOOLEAN      DEFAULT FALSE,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at       TIMESTAMPTZ  DEFAULT NULL,

  -- Relacionamentos
  s_her_m_org_t_agency_address_c_id INTEGER NOT NULL,
  s_her_m_org_t_area_c_id           INTEGER NOT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_org_t_agency PRIMARY KEY (id),

  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_org_t_agency_c_agency_code UNIQUE (agency_code),
  CONSTRAINT uq_s_her_m_org_t_agency_c_cnpj        UNIQUE (cnpj),
  CONSTRAINT uq_s_her_m_org_t_agency_c_email       UNIQUE (email),
  CONSTRAINT uq_s_her_m_org_t_agency_c_phone_number UNIQUE (phone_number),

  -- Declaração de chaves estrangeiras
  CONSTRAINT fk_s_her_m_org_t_agency_address FOREIGN KEY (s_her_m_org_t_agency_address_c_id)
    REFERENCES her.m_org_t_agency_address (id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT,

  CONSTRAINT fk_s_her_m_org_t_agency_area FOREIGN KEY (s_her_m_org_t_area_c_id)
    REFERENCES her.m_org_t_area (id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT
);

-- =========================================
-- Tabela de endereços de unidades
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_org_t_unit_address (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados do endereço
  postal_code  VARCHAR(8)  NOT NULL,
  street       VARCHAR(32) NOT NULL,
  neighborhood VARCHAR(32) NOT NULL,
  city         VARCHAR(32) NOT NULL,
  state        CHAR(2)     NOT NULL,
  country      VARCHAR(32) NOT NULL,
  number       VARCHAR(10) NOT NULL,
  complement   VARCHAR(16),
  is_deleted   BOOLEAN     DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at   TIMESTAMPTZ DEFAULT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_org_t_unit_address PRIMARY KEY (id)
);

-- =========================================
-- Tabela de unidades
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_org_t_unit (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados da unidade
  name       VARCHAR(32) NOT NULL,
  acronym    VARCHAR(10) NOT NULL,
  cnpj       VARCHAR(14),
  is_deleted BOOLEAN     DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ DEFAULT NULL,

  -- Relacionamentos
  s_her_m_org_t_agency_c_id       INTEGER NOT NULL,
  s_her_m_org_t_unit_address_c_id INTEGER NOT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_org_t_unit PRIMARY KEY (id),

  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_org_t_unit_c_cnpj UNIQUE (cnpj),

  -- Declaração de chaves estrangeiras
  CONSTRAINT fk_s_her_m_org_t_unit_agency FOREIGN KEY (s_her_m_org_t_agency_c_id)
    REFERENCES her.m_org_t_agency (id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT,

  CONSTRAINT fk_s_her_m_org_t_unit_address FOREIGN KEY (s_her_m_org_t_unit_address_c_id)
    REFERENCES her.m_org_t_unit_address (id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT
);

-- =========================================
-- Tabela de endereços de entidades credenciadas
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_org_t_credentialing_entity_address (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados do endereço
  postal_code  VARCHAR(8)  NOT NULL,
  street       VARCHAR(32) NOT NULL,
  neighborhood VARCHAR(32),
  city         VARCHAR(32) NOT NULL,
  state        CHAR(2)     NOT NULL,
  country      VARCHAR(32) NOT NULL,
  number       VARCHAR(10) NOT NULL,
  complement   VARCHAR(16),
  is_deleted   BOOLEAN     DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at   TIMESTAMPTZ DEFAULT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_org_t_credentialing_entity_address PRIMARY KEY (id)
);

-- =========================================
-- Tabela de entidades credenciadas
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_org_t_credentialing_entity (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados da entidade credenciada
  name              VARCHAR(32) NOT NULL,
  entity_type       VARCHAR(32) NOT NULL,
  cnpj              VARCHAR(14) NOT NULL,
  responsible_email VARCHAR(32) NOT NULL,
  responsible_phone VARCHAR(20),
  description       VARCHAR(64),
  notice_link       TEXT        NOT NULL,
  is_deleted        BOOLEAN     DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at        TIMESTAMPTZ DEFAULT NULL,

  -- Relacionamentos
  s_her_m_org_t_credentialing_entity_address_c_id INTEGER NOT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_org_t_credentialing_entity PRIMARY KEY (id),

  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_org_t_credentialing_entity_c_cnpj              UNIQUE (cnpj),
  CONSTRAINT uq_s_her_m_org_t_credentialing_entity_c_responsible_email UNIQUE (responsible_email),
  CONSTRAINT uq_s_her_m_org_t_credentialing_entity_c_responsible_phone UNIQUE (responsible_phone),

  -- Declaração de chaves estrangeiras
  CONSTRAINT fk_s_her_m_org_t_credentialing_entity_address FOREIGN KEY (s_her_m_org_t_credentialing_entity_address_c_id)
    REFERENCES her.m_org_t_credentialing_entity_address (id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT
);

-- =========================================
-- Tabela de documentos associados à entidade credenciada
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_org_t_credentialing_entity_document (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados do documento
  title       VARCHAR(64) NOT NULL,
  description VARCHAR(256),
  file_path   TEXT NOT NULL,
  mime_type   VARCHAR(32) NOT NULL,
  is_deleted  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMPTZ DEFAULT NULL,

  -- Relacionamento
  s_her_m_org_t_credentialing_entity_c_id INTEGER NOT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_org_t_credentialing_entity_document PRIMARY KEY (id),

  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_org_t_credentialing_entity_document_c_file_path UNIQUE (file_path),

  -- Declaração de chave estrangeira
  CONSTRAINT fk_s_her_m_org_t_credentialing_entity_document FOREIGN KEY (s_her_m_org_t_credentialing_entity_c_id)
    REFERENCES her.m_org_t_credentialing_entity (id)
    ON UPDATE RESTRICT
    ON DELETE CASCADE
);

-- =========================================
-- Tabela de setores
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_org_t_department (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados do setor
  name         VARCHAR(64) NOT NULL,
  is_stockroom BOOLEAN     DEFAULT FALSE NOT NULL,
  is_deleted   BOOLEAN     DEFAULT FALSE NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at   TIMESTAMPTZ DEFAULT NULL,

  -- Relacionamentos
  s_her_m_org_t_unit_c_id INTEGER NOT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_org_t_department PRIMARY KEY (id),

  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_org_t_department_c_name UNIQUE (name),

  -- Declaração de chaves estrangeiras
  CONSTRAINT fk_s_her_m_org_t_department_unit FOREIGN KEY (s_her_m_org_t_unit_c_id)
    REFERENCES her.m_org_t_unit (id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT
);

-- =========================================
-- Tabela de perfis de acesso
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_org_t_access_profile (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados do perfil de acesso
  name        VARCHAR(32) NOT NULL,
  description VARCHAR(32),
  is_deleted  BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMPTZ DEFAULT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_org_t_access_profile PRIMARY KEY (id),

  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_org_t_access_profile_c_name UNIQUE (name)
);

-- =========================================
-- Tabela de perfis de usuário
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_org_t_users_profile (
  -- Relacionamentos
  s_her_m_org_t_access_profile_c_id INTEGER NOT NULL,
  s_auth_t_users_c_id               UUID    NOT NULL,

  -- Declaração de chave primária composta
  CONSTRAINT pk_her_m_org_t_users_profile PRIMARY KEY (s_her_m_org_t_access_profile_c_id, s_auth_t_users_c_id),

  -- Declaração de chave estrangeira para perfil de acesso
  CONSTRAINT fk_her_m_org_t_users_profile_access_profile FOREIGN KEY (s_her_m_org_t_access_profile_c_id)
    REFERENCES her.m_org_t_access_profile (id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT,

  -- Declaração de chave estrangeira para usuário
  CONSTRAINT fk_her_m_org_t_users_profile_users FOREIGN KEY (s_auth_t_users_c_id)
    REFERENCES auth.users (id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT
);

-- =========================================
-- Tabela de dados de usuários 
-- =========================================
CREATE TABLE IF NOT EXISTS her.users_data (
  -- Chave primária 
  id UUID PRIMARY KEY,

  -- Dados do usuário
  employment_type     her.enum_s_auth_t_users_c_employement_type,
  registration_number VARCHAR(8),
  name                VARCHAR(64),
  cpf                 VARCHAR(11),
  cpf_hash            VARCHAR(128),
  email               VARCHAR(32),
  email_hash          VARCHAR(128),
  phone_number        VARCHAR(20),
  password            VARCHAR(128),
  is_deleted          BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at          TIMESTAMPTZ DEFAULT NULL,

  -- Relacionamentos
  s_her_m_org_t_department_c_id INTEGER,

  -- Declaração de chaves únicas
  CONSTRAINT uq_her_users_data_c_cpf UNIQUE (cpf),
  CONSTRAINT uq_her_users_data_c_email UNIQUE (email),
  CONSTRAINT uq_her_users_data_c_phone_number UNIQUE (phone_number),
  CONSTRAINT uq_her_users_data_c_registration_number UNIQUE (registration_number),
  CONSTRAINT uq_her_users_data_c_cpf_email_phone_reg UNIQUE (cpf, phone_number, registration_number, email),

  -- Declaração de chaves estrangeiras
  CONSTRAINT fk_her_users_data_base FOREIGN KEY (id)
    REFERENCES auth.users (id)
    ON UPDATE RESTRICT
    ON DELETE CASCADE,

  CONSTRAINT fk_her_users_data_department FOREIGN KEY (s_her_m_org_t_department_c_id)
    REFERENCES her.m_org_t_department (id)
    ON UPDATE RESTRICT
    ON DELETE RESTRICT
);
