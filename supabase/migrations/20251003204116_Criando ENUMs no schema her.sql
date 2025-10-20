-- =========================================
-- Criação da ENUM para o campo "government_power" na tabela "agency"
-- =========================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'enum_s_her_m_org_t_agency_c_government_power'
          AND n.nspname = 'her'
    ) THEN
        CREATE TYPE her.enum_s_her_m_org_t_agency_c_government_power AS ENUM (
            'Legislativo',
            'Executivo',
            'Judiciário'
        );
    END IF;
END
$$;

-- =========================================
-- Criação da ENUM para o campo "vehicle_type" na tabela "asset_group"
-- =========================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'enum_s_her_m_ast_t_asset_group_c_vehicle_type'
          AND n.nspname = 'her'
    ) THEN
        CREATE TYPE her.enum_s_her_m_ast_t_asset_group_c_vehicle_type AS ENUM (
            'Terrestre',
            'Aquaviário',
            'Aeronáutico'
        );
    END IF;
END
$$;

-- =========================================
-- Criação da ENUM para o campo "type" na tabela "law"
-- =========================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'enum_s_her_m_leg_t_law_c_type'
          AND n.nspname = 'her'
    ) THEN
        CREATE TYPE her.enum_s_her_m_leg_t_law_c_type AS ENUM (
            'Decreto',
            'Lei',
            'Norma'
        );
    END IF;
END
$$;

-- =========================================
-- Criação da ENUM para o campo "jurisdiction" na tabela "law"
-- =========================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'enum_s_her_m_leg_t_law_c_jurisdiction'
          AND n.nspname = 'her'
    ) THEN
        CREATE TYPE her.enum_s_her_m_leg_t_law_c_jurisdiction AS ENUM (
            'União',
            'Estadual',
            'Municipal'
        );
    END IF;
END
$$;

-- =========================================
-- Criação da ENUM para o campo "frequency" na tabela "inventory_type"
-- =========================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'enum_s_her_m_ctr_t_inventory_type_c_frequency'
          AND n.nspname = 'her'
    ) THEN
        CREATE TYPE her.enum_s_her_m_ctr_t_inventory_type_c_frequency AS ENUM (
            'Trimestral',
            'Semestral',
            'Anual'
        );
    END IF;
END
$$;

-- =========================================
-- Criação da ENUM para o campo "employment_type" na tabela "auth.users"
-- =========================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'enum_s_auth_t_users_c_employement_type'
          AND n.nspname = 'her'
    ) THEN
        CREATE TYPE her.enum_s_auth_t_users_c_employement_type AS ENUM (
            'Estagiário',
            'Efetivo',
            'Comissionado'
        );
    END IF;
END
$$;

-- =========================================
-- Criação da ENUM para o campo "associated_process" na tabela "her.m_leg_t_law"
-- =========================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'enum_s_her_m_leg_t_law_c_associated_process'
          AND n.nspname = 'her'
    ) THEN
        CREATE TYPE her.enum_s_her_m_leg_t_law_c_associated_process AS ENUM (
            'Cadastro de configurações',
            'Cadastro e tombamento de bens',
            'Empréstimo',
            'Transferência interna',
            'Transferência externa',
            'Doação',
            'Venda',
            'Permuta',
            'Descarte',
            'Inventários',
            'Reavaliação'
        );
    END IF;
END
$$;
