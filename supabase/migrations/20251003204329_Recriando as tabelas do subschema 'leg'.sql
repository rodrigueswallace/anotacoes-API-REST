-- =========================================
-- Tabela de leis
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_leg_t_law (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados da lei
  name               VARCHAR(64)  NOT NULL,
  number             VARCHAR(16)  NOT NULL,
  type               her.enum_s_her_m_leg_t_law_c_type NOT NULL,
  jurisdiction       her.enum_s_her_m_leg_t_law_c_jurisdiction NOT NULL,
  publication_date   TIMESTAMPTZ  NOT NULL,
  description        VARCHAR(128) NOT NULL,
  associated_process her.enum_s_her_m_leg_t_law_c_associated_process,
  link               TEXT         NOT NULL,

  -- Campos padrão
  is_deleted         BOOLEAN      DEFAULT FALSE,
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at         TIMESTAMPTZ  DEFAULT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_leg_t_law PRIMARY KEY (id),

  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_leg_t_law_c_link UNIQUE (link),
  CONSTRAINT uq_s_her_m_leg_t_law_c_number UNIQUE (number)
);

-- =========================================
-- Tabela de documentos associados à lei
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_leg_t_law_document (
  -- Chave primária
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL,

  -- Dados do documento
  title       VARCHAR(64)  NOT NULL,
  description VARCHAR(256),
  file_path   TEXT         NOT NULL,
  mime_type   VARCHAR(255),

  -- Campos padrão
  is_deleted  BOOLEAN      DEFAULT FALSE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMPTZ  DEFAULT NULL,

  -- Relacionamento
  s_her_m_leg_t_law_c_id INTEGER NOT NULL,

  -- Declaração de chave primária
  CONSTRAINT pk_s_her_m_leg_t_law_document PRIMARY KEY (id),

  -- Declaração de chaves únicas
  CONSTRAINT uq_s_her_m_leg_t_law_document_c_file_path UNIQUE (file_path),

  -- Declaração de chave estrangeira
  CONSTRAINT fk_s_her_m_leg_t_law_document_law FOREIGN KEY (s_her_m_leg_t_law_c_id)
    REFERENCES her.m_leg_t_law (id)
    ON UPDATE RESTRICT
    ON DELETE CASCADE
);
