import { supabase } from '@/integrations/supabase/client';
import {
  Unit,
  UnitDatabase,
  UnitAddressDatabase,
  CreateUnitInput,
  UpdateUnitInput,
  toLocalFormat,
  toSupabaseFormat,
  addressToSupabaseFormat,
} from '@/types/unit.types';
import { getCurrentUser } from '@/lib/auth-helpers';
import { logUnitAction } from './unit-audit.service';

/**
 * Create a new unit address
 */
const createUnitAddress = async (
  address: CreateUnitInput['address']
): Promise<number> => {
  const addressData = addressToSupabaseFormat(address);

  const { data, error } = await supabase
    .from('m_org_t_unit_address')
    .insert(addressData)
    .select('id')
    .single();

  if (error) {
    console.error('Error creating unit address:', error);
    console.error('Address data:', addressData);
    throw new Error(`Failed to create unit address: ${error.message}`);
  }

  return data.id;
};

/**
 * Update an existing unit address
 */
const updateUnitAddress = async (
  addressId: number,
  address: UpdateUnitInput['address']
): Promise<void> => {
  const addressData = addressToSupabaseFormat(address);

  const { error } = await supabase
    .from('m_org_t_unit_address')
    .update(addressData)
    .eq('id', addressId);

  if (error) {
    console.error('Error updating unit address:', error);
    throw new Error(`Failed to update unit address: ${error.message}`);
  }
};

/**
 * Fetch all units from the database
 */
export const getAllUnits = async (): Promise<Unit[]> => {
  const { data, error } = await supabase
    .from('m_org_t_unit')
    .select(`
      *,
      agency:s_her_m_org_t_agency_c_id(name),
      address:s_her_m_org_t_unit_address_c_id(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching units:', error);
    throw new Error(`Failed to fetch units: ${error.message}`);
  }

  return (data || []).map((unit) => toLocalFormat(unit as any));
};

/**
 * Fetch a single unit by ID
 */
export const getUnitById = async (id: number): Promise<Unit | null> => {
  const { data, error } = await supabase
    .from('m_org_t_unit')
    .select(`
      *,
      agency:s_her_m_org_t_agency_c_id(name),
      address:s_her_m_org_t_unit_address_c_id(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching unit:', error);
    throw new Error(`Failed to fetch unit: ${error.message}`);
  }

  return data ? toLocalFormat(data as any) : null;
};

/**
 * Create a new unit
 */
export const createUnit = async (input: CreateUnitInput): Promise<Unit> => {
  // 1. Create address first
  const addressId = await createUnitAddress(input.address);

  // 2. Create unit with address ID
  const unitData = {
    ...toSupabaseFormat(input),
    s_her_m_org_t_unit_address_c_id: addressId,
  };

  const { data, error } = await supabase
    .from('m_org_t_unit')
    .insert(unitData)
    .select(`
      *,
      agency:s_her_m_org_t_agency_c_id(name),
      address:s_her_m_org_t_unit_address_c_id(*)
    `)
    .single();

  if (error) {
    console.error('Error creating unit:', error);
    console.error('Unit data:', unitData);
    throw new Error(`Failed to create unit: ${error.message}`);
  }

  const createdUnit = toLocalFormat(data as any);

  // ✅ Registrar ação de auditoria
  try {
    const currentUser = await getCurrentUser();
    await logUnitAction({
      unit_id: createdUnit.id,
      unit_name: createdUnit.name,
      action_type: 'create',
      action_label: 'Unidade criada',
      action_description: `Unidade "${createdUnit.name}" foi criada com sucesso.`,
      performed_by: currentUser?.id,
      performed_by_name: currentUser?.name,
      metadata: {
        acronym: createdUnit.acronym,
        cnpj: createdUnit.cnpj,
        agency_id: createdUnit.agencyId,
        agency_name: createdUnit.agencyName,
      },
    });
  } catch (auditError) {
    console.error('Erro ao registrar auditoria de criação:', auditError);
  }

  return createdUnit;
};

/**
 * Update an existing unit
 */
export const updateUnit = async (input: UpdateUnitInput): Promise<Unit> => {
  // 1. Fetch existing unit to get address ID
  const existingUnit = await getUnitById(input.id);
  if (!existingUnit || !existingUnit.address?.id) {
    throw new Error('Unit or address not found');
  }

  // 2. Update address
  await updateUnitAddress(existingUnit.address.id, input.address);

  // 3. Update unit
  const unitData = toSupabaseFormat(input);

  const { data, error } = await supabase
    .from('m_org_t_unit')
    .update(unitData)
    .eq('id', input.id)
    .select(`
      *,
      agency:s_her_m_org_t_agency_c_id(name),
      address:s_her_m_org_t_unit_address_c_id(*)
    `)
    .single();

  if (error) {
    console.error('Error updating unit:', error);
    throw new Error(`Failed to update unit: ${error.message}`);
  }

  const updatedUnit = toLocalFormat(data as any);

  // ✅ Registrar ação de auditoria
  try {
    const currentUser = await getCurrentUser();
    
    // Identificar campos alterados
    const changes: string[] = [];
    if (existingUnit.name !== updatedUnit.name) changes.push(`nome: "${existingUnit.name}" → "${updatedUnit.name}"`);
    if (existingUnit.acronym !== updatedUnit.acronym) changes.push(`sigla: "${existingUnit.acronym}" → "${updatedUnit.acronym}"`);
    if (existingUnit.cnpj !== updatedUnit.cnpj) changes.push(`CNPJ`);
    if (existingUnit.agencyId !== updatedUnit.agencyId) changes.push(`órgão gestor`);
    
    await logUnitAction({
      unit_id: updatedUnit.id,
      unit_name: updatedUnit.name,
      action_type: 'edit',
      action_label: 'editou a unidade',
      action_description: changes.length > 0 
        ? `Campos editados: ${changes.join(', ')}.`
        : 'Dados da unidade foram atualizados.',
      performed_by: currentUser?.id,
      performed_by_name: currentUser?.name,
      metadata: {
        previous: {
          name: existingUnit.name,
          acronym: existingUnit.acronym,
          cnpj: existingUnit.cnpj,
          agency_id: existingUnit.agencyId,
        },
        updated: {
          name: updatedUnit.name,
          acronym: updatedUnit.acronym,
          cnpj: updatedUnit.cnpj,
          agency_id: updatedUnit.agencyId,
        },
        changes,
      },
    });
  } catch (auditError) {
    console.error('Erro ao registrar auditoria de edição:', auditError);
  }

  return updatedUnit;
};

/**
 * Toggle unit status (activate/deactivate)
 */
export const toggleUnitStatus = async (
  id: number,
  currentStatus: boolean
): Promise<void> => {
  const newStatus = !currentStatus;
  const updateData: Partial<UnitDatabase> = {
    is_deleted: newStatus,
    deleted_at: newStatus ? new Date().toISOString() : undefined,
  };

  // Buscar informações da unidade antes de alterar status
  const unit = await getUnitById(id);
  if (!unit) {
    throw new Error('Unit not found');
  }

  const { error } = await supabase
    .from('m_org_t_unit')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error toggling unit status:', error);
    throw new Error(`Failed to toggle unit status: ${error.message}`);
  }

  // ✅ Registrar ação de auditoria
  try {
    const currentUser = await getCurrentUser();
    const actionType = newStatus ? 'deactivate' : 'activate';
    const actionLabel = newStatus ? 'inativou a unidade' : 'ativou a unidade';
    const actionDescription = newStatus 
      ? `A unidade foi inativada.`
      : `A unidade foi ativada.`;

    await logUnitAction({
      unit_id: unit.id,
      unit_name: unit.name,
      action_type: actionType,
      action_label: actionLabel,
      action_description: actionDescription,
      performed_by: currentUser?.id,
      performed_by_name: currentUser?.name,
      metadata: {
        previous_status: currentStatus ? 'Ativo' : 'Inativo',
        new_status: newStatus ? 'Inativo' : 'Ativo',
      },
    });
  } catch (auditError) {
    console.error('Erro ao registrar auditoria de status:', auditError);
  }
};
