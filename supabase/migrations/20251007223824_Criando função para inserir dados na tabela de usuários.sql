-- =========================================
-- Adiciona colunas email e last_sign_in_at em her.users_data
-- =========================================
ALTER TABLE her.users_data 
ADD COLUMN IF NOT EXISTS email text;

ALTER TABLE her.users_data 
ADD COLUMN IF NOT EXISTS last_sign_in_at timestamptz;

-- =========================================
-- Cria função para sincronizar dados do auth.users para her.users_data
-- =========================================
CREATE OR REPLACE FUNCTION her.sync_auth_users_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = her, auth
AS $$
BEGIN
  UPDATE her.users_data
  SET 
    email = NEW.email,
    last_sign_in_at = NEW.last_sign_in_at
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

-- Cria trigger no auth.users para atualizar her.users_data
DROP TRIGGER IF EXISTS sync_auth_users_to_her ON auth.users;

CREATE TRIGGER sync_auth_users_to_her
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (OLD.email IS DISTINCT FROM NEW.email 
      OR OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
EXECUTE FUNCTION her.sync_auth_users_data();

-- =========================================
-- Migra dados existentes de auth.users para her.users_data
-- =========================================
UPDATE her.users_data u
SET 
  email = au.email,
  last_sign_in_at = au.last_sign_in_at
FROM auth.users au
WHERE u.id = au.id;

-- =========================================
-- Recria a função her.get_all_users_complete() sem dependência do schema auth
-- =========================================
CREATE OR REPLACE FUNCTION her.get_all_users_complete()
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  cpf text,
  phone_number text,
  employment_type text,
  registration_number text,
  is_deleted boolean,
  created_at timestamptz,
  deleted_at timestamptz,
  last_sign_in_at timestamptz,
  access_profile_id integer,
  access_profile_name text,
  department_id integer,
  department_name text,
  unit_id integer,
  unit_name text,
  agency_id integer,
  agency_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = her
AS $$
  SELECT 
    u.id,
    u.name,
    u.email,
    u.cpf,
    u.phone_number,
    u.employment_type,
    u.registration_number,
    u.is_deleted,
    u.created_at,
    u.deleted_at,
    u.last_sign_in_at,
    ap.id as access_profile_id,
    ap.name as access_profile_name,
    d.id as department_id,
    d.name as department_name,
    un.id as unit_id,
    un.name as unit_name,
    ag.id as agency_id,
    ag.name as agency_name
  FROM her.users_data u
  LEFT JOIN her.m_org_t_users_profile up ON u.id = up.s_auth_t_users_c_id
  LEFT JOIN her.m_org_t_access_profile ap ON up.s_her_m_org_t_access_profile_c_id = ap.id
  LEFT JOIN her.m_org_t_department d ON u.s_her_m_org_t_department_c_id = d.id
  LEFT JOIN her.m_org_t_unit un ON d.s_her_m_org_t_unit_c_id = un.id
  LEFT JOIN her.m_org_t_agency ag ON un.s_her_m_org_t_agency_c_id = ag.id
  ORDER BY u.created_at DESC
$$;