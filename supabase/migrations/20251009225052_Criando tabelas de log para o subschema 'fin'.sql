-- =========================================
-- Log de fontes de financiamento
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_log_t_funding_source (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action_type        VARCHAR(50) NOT NULL,
  action_label       TEXT        NOT NULL,
  action_description TEXT        NULL,
  item_type          TEXT        NOT NULL DEFAULT 'FundingSource',
  item_id            INTEGER     NULL,
  item_name          VARCHAR(64) NULL,
  performed_by       UUID        NULL,
  performed_by_name  TEXT        NULL,
  metadata           JSONB       NULL DEFAULT '{}'::JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_funding_source_performed_by FOREIGN KEY (performed_by)
    REFERENCES auth.users (id)
    ON DELETE SET NULL
);

-- =========================================
-- Log de convênios/acordos financeiros
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_log_t_agreement (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action_type        VARCHAR(50) NOT NULL,
  action_label       TEXT        NOT NULL,
  action_description TEXT        NULL,
  item_type          TEXT        NOT NULL DEFAULT 'Agreement',
  item_id            INTEGER     NULL,
  item_name          VARCHAR(64) NULL,
  performed_by       UUID        NULL,
  performed_by_name  TEXT        NULL,
  metadata           JSONB       NULL DEFAULT '{}'::JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_agreement_performed_by FOREIGN KEY (performed_by)
    REFERENCES auth.users (id)
    ON DELETE SET NULL
);

-- =========================================
-- Log de documentos de convênios/acordos financeiros
-- =========================================
CREATE TABLE IF NOT EXISTS her.m_log_t_agreement_document (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action_type        VARCHAR(50) NOT NULL,
  action_label       TEXT        NOT NULL,
  action_description TEXT        NULL,
  item_type          TEXT        NOT NULL DEFAULT 'AgreementDocument',
  item_id            INTEGER     NULL,
  item_name          VARCHAR(64) NULL,
  performed_by       UUID        NULL,
  performed_by_name  TEXT        NULL,
  metadata           JSONB       NULL DEFAULT '{}'::JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_agreement_document_performed_by FOREIGN KEY (performed_by)
    REFERENCES auth.users (id)
    ON DELETE SET NULL
);
