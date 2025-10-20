-- =========================================
-- Log de métodos de aquisição
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_log_t_acquisition_method (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action_type        VARCHAR(50) NOT NULL,
  action_label       TEXT        NOT NULL,
  action_description TEXT        NULL,
  item_type          TEXT        NOT NULL DEFAULT 'AcquisitionMethod',
  item_id            INTEGER     NULL,
  item_name          VARCHAR(64) NULL,
  performed_by       UUID        NULL,
  performed_by_name  TEXT        NULL,
  metadata           JSONB       NULL DEFAULT '{}'::JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_acquisition_method_performed_by FOREIGN KEY (performed_by)
    REFERENCES auth.users (id)
    ON DELETE SET NULL
);

-- =========================================
-- Log de documentos obrigatórios de métodos de aquisição
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_log_t_acquisition_method_required_document (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action_type        VARCHAR(50) NOT NULL,
  action_label       TEXT        NOT NULL,
  action_description TEXT        NULL,
  item_type          TEXT        NOT NULL DEFAULT 'AcquisitionMethodRequiredDocument',
  item_id            INTEGER     NULL,
  item_name          VARCHAR(64) NULL,
  performed_by       UUID        NULL,
  performed_by_name  TEXT        NULL,
  metadata           JSONB       NULL DEFAULT '{}'::JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_acquisition_method_required_document_performed_by FOREIGN KEY (performed_by)
    REFERENCES auth.users (id)
    ON DELETE SET NULL
);

-- =========================================
-- Log de tipos de inventário
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_log_t_inventory_type (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action_type        VARCHAR(50) NOT NULL,
  action_label       TEXT        NOT NULL,
  action_description TEXT        NULL,
  item_type          TEXT        NOT NULL DEFAULT 'InventoryType',
  item_id            INTEGER     NULL,
  item_name          VARCHAR(64) NULL,
  performed_by       UUID        NULL,
  performed_by_name  TEXT        NULL,
  metadata           JSONB       NULL DEFAULT '{}'::JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_inventory_type_performed_by FOREIGN KEY (performed_by)
    REFERENCES auth.users (id)
    ON DELETE SET NULL
);

-- =========================================
-- Log de endereços de fornecedores/terceiros
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_log_t_external_party_address (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action_type        VARCHAR(50) NOT NULL,
  action_label       TEXT        NOT NULL,
  action_description TEXT        NULL,
  item_type          TEXT        NOT NULL DEFAULT 'ExternalPartyAddress',
  item_id            INTEGER     NULL,
  item_name          VARCHAR(64) NULL,
  performed_by       UUID        NULL,
  performed_by_name  TEXT        NULL,
  metadata           JSONB       NULL DEFAULT '{}'::JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_external_party_address_performed_by FOREIGN KEY (performed_by)
    REFERENCES auth.users (id)
    ON DELETE SET NULL
);

-- =========================================
-- Log de fornecedores/terceiros
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_log_t_external_party (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action_type        VARCHAR(50) NOT NULL,
  action_label       TEXT        NOT NULL,
  action_description TEXT        NULL,
  item_type          TEXT        NOT NULL DEFAULT 'ExternalParty',
  item_id            INTEGER     NULL,
  item_name          VARCHAR(64) NULL,
  performed_by       UUID        NULL,
  performed_by_name  TEXT        NULL,
  metadata           JSONB       NULL DEFAULT '{}'::JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_external_party_performed_by FOREIGN KEY (performed_by)
    REFERENCES auth.users (id)
    ON DELETE SET NULL
);
