import { supabase } from '@/integrations/supabase/client';
import {
  Agency,
  AgencyDatabase,
  AgencyAddressDatabase,
  CreateAgencyInput,
  UpdateAgencyInput,
  toLocalFormat,
  toSupabaseFormat,
} from '@/types/agency.types';
import { logAgencyAction } from './agency-audit.service';
import { getCurrentUser } from '@/lib/auth-helpers';

export const agenciesService = {
  async getAllAgencies(): Promise<Agency[]> {
    const { data, error } = await supabase
      .from('m_org_t_agency')
      .select(`
        *,
        agency_address:s_her_m_org_t_agency_address_c_id(
          id,
          postal_code,
          street,
          neighborhood,
          city,
          state,
          number,
          complement
        ),
        area:s_her_m_org_t_area_c_id(
          name
        )
      `)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar agências: ${error.message}`);
    }

    return (data || []).map(toLocalFormat);
  },

  async getAgencyById(id: number): Promise<Agency | null> {
    const { data, error } = await supabase
      .from('m_org_t_agency')
      .select(`
        *,
        agency_address:s_her_m_org_t_agency_address_c_id(
          id,
          postal_code,
          street,
          neighborhood,
          city,
          state,
          number,
          complement
        ),
        area:s_her_m_org_t_area_c_id(
          name
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Erro ao buscar agência: ${error.message}`);
    }

    return data ? toLocalFormat(data) : null;
  },

  async createAgency(input: CreateAgencyInput): Promise<Agency> {
    const { agency: agencyData, address: addressData } = toSupabaseFormat(input);
    console.log('[agencies.service] createAgency governmentPower:', input.governmentPower, '->', (agencyData as any).government_power);

    // First, create the address
    const { data: addressResult, error: addressError } = await supabase
      .from('m_org_t_agency_address')
      .insert(addressData as AgencyAddressDatabase)
      .select()
      .single();

    if (addressError) {
      console.error('Error creating address:', addressError);
      console.error('Address data:', addressData);
      throw new Error(`Erro ao criar endereço: ${addressError.message}`);
    }

    // Then, create the agency with the address ID
    const { data: agencyResult, error: agencyError } = await supabase
      .from('m_org_t_agency')
      .insert({
        ...agencyData,
        s_her_m_org_t_agency_address_c_id: addressResult.id,
      } as AgencyDatabase)
      .select(`
        *,
        agency_address:s_her_m_org_t_agency_address_c_id(
          id,
          postal_code,
          street,
          neighborhood,
          city,
          state,
          number,
          complement
        ),
        area:s_her_m_org_t_area_c_id(
          name
        )
      `)
      .single();

    if (agencyError) {
      console.error('Error creating agency:', agencyError);
      console.error('Agency data:', agencyData);
      // Rollback: delete the address if agency creation fails
      await supabase
        .from('m_org_t_agency_address')
        .delete()
        .eq('id', addressResult.id);

      throw new Error(`Erro ao criar agência: ${agencyError.message}`);
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logAgencyAction({
        agency_id: agencyResult.id,
        agency_name: agencyResult.name,
        action_type: 'create',
        action_label: 'criou o órgão',
        action_description: `Nome: ${agencyResult.name}\nSigla: ${agencyResult.acronym || '-'}\nCNPJ: ${agencyResult.cnpj || '-'}\nPoder: ${agencyResult.government_power || '-'}\nE-mail: ${agencyResult.email || '-'}\nTelefone: ${agencyResult.phone || '-'}`,
        item_id: agencyResult.id,
        item_name: agencyResult.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          created_data: {
            name: agencyResult.name,
            acronym: agencyResult.acronym,
            cnpj: agencyResult.cnpj,
            government_power: agencyResult.government_power,
            email: agencyResult.email,
            phone: agencyResult.phone,
            area_id: agencyResult.s_her_m_org_t_area_c_id,
            address_id: agencyResult.s_her_m_org_t_agency_address_c_id,
          }
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return toLocalFormat(agencyResult);
  },

  async updateAgency(input: UpdateAgencyInput): Promise<Agency> {
    const { agency: agencyData, address: addressData } = toSupabaseFormat(input);
    console.log('[agencies.service] updateAgency governmentPower:', input.governmentPower, '->', (agencyData as any).government_power);

    // Buscar dados antigos para comparação
    const oldAgency = await this.getAgencyById(input.id);

    // Update address
    if (input.address.id) {
      const { error: addressError } = await supabase
        .from('m_org_t_agency_address')
        .update(addressData as AgencyAddressDatabase)
        .eq('id', input.address.id);

      if (addressError) {
        console.error('Error updating address:', addressError);
        console.error('Address data:', addressData);
        console.error('Address ID:', input.address.id);
        throw new Error(`Erro ao atualizar endereço: ${addressError.message}`);
      }
    }

    // Update agency
    const { data: agencyResult, error: agencyError } = await supabase
      .from('m_org_t_agency')
      .update(agencyData as AgencyDatabase)
      .eq('id', input.id)
      .select(`
        *,
        agency_address:s_her_m_org_t_agency_address_c_id(
          id,
          postal_code,
          street,
          neighborhood,
          city,
          state,
          number,
          complement
        ),
        area:s_her_m_org_t_area_c_id(
          name
        )
      `)
      .single();

    if (agencyError) {
      console.error('Error updating agency:', agencyError);
      console.error('Agency data:', agencyData);
      throw new Error(`Erro ao atualizar agência: ${agencyError.message}`);
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      
      // Identificar campos alterados
      const changedFields: string[] = [];
      const oldValues: Record<string, any> = {};
      const newValues: Record<string, any> = {};

      if (oldAgency) {
        // Campos principais
        if (input.name !== undefined && input.name !== oldAgency.name) {
          changedFields.push('Nome');
          oldValues.name = oldAgency.name;
          newValues.name = input.name;
        }
        if (input.acronym !== undefined && input.acronym !== oldAgency.acronym) {
          changedFields.push('Sigla');
          oldValues.acronym = oldAgency.acronym;
          newValues.acronym = input.acronym;
        }
        if (input.agencyCode !== undefined && input.agencyCode !== oldAgency.agencyCode) {
          changedFields.push('Código');
          oldValues.agencyCode = oldAgency.agencyCode;
          newValues.agencyCode = input.agencyCode;
        }
        if (input.cnpj !== undefined && input.cnpj !== oldAgency.cnpj) {
          changedFields.push('CNPJ');
          oldValues.cnpj = oldAgency.cnpj;
          newValues.cnpj = input.cnpj;
        }
        if (input.governmentPower !== undefined && input.governmentPower !== oldAgency.governmentPower) {
          changedFields.push('Poder');
          oldValues.governmentPower = oldAgency.governmentPower;
          newValues.governmentPower = input.governmentPower;
        }
        if (input.email !== undefined && input.email !== oldAgency.email) {
          changedFields.push('E-mail');
          oldValues.email = oldAgency.email;
          newValues.email = input.email;
        }
        if (input.phoneNumber !== undefined && input.phoneNumber !== oldAgency.phoneNumber) {
          changedFields.push('Telefone');
          oldValues.phoneNumber = oldAgency.phoneNumber;
          newValues.phoneNumber = input.phoneNumber;
        }
        if (input.areaId !== undefined && input.areaId !== oldAgency.areaId) {
          changedFields.push('Área');
          oldValues.areaId = oldAgency.areaId;
          newValues.areaId = input.areaId;
        }
        
        // Campos de endereço
        if (input.address.postalCode !== undefined && input.address.postalCode !== oldAgency.address.postalCode) {
          changedFields.push('CEP');
          oldValues.postalCode = oldAgency.address.postalCode;
          newValues.postalCode = input.address.postalCode;
        }
        if (input.address.street !== undefined && input.address.street !== oldAgency.address.street) {
          changedFields.push('Logradouro');
          oldValues.street = oldAgency.address.street;
          newValues.street = input.address.street;
        }
        if (input.address.neighborhood !== undefined && input.address.neighborhood !== oldAgency.address.neighborhood) {
          changedFields.push('Bairro');
          oldValues.neighborhood = oldAgency.address.neighborhood;
          newValues.neighborhood = input.address.neighborhood;
        }
        if (input.address.city !== undefined && input.address.city !== oldAgency.address.city) {
          changedFields.push('Município');
          oldValues.city = oldAgency.address.city;
          newValues.city = input.address.city;
        }
        if (input.address.state !== undefined && input.address.state !== oldAgency.address.state) {
          changedFields.push('UF');
          oldValues.state = oldAgency.address.state;
          newValues.state = input.address.state;
        }
        if (input.address.number !== undefined && input.address.number !== oldAgency.address.number) {
          changedFields.push('Número');
          oldValues.number = oldAgency.address.number;
          newValues.number = input.address.number;
        }
        if (input.address.complement !== undefined && input.address.complement !== oldAgency.address.complement) {
          changedFields.push('Complemento');
          oldValues.complement = oldAgency.address.complement;
          newValues.complement = input.address.complement;
        }
      }

      await logAgencyAction({
        agency_id: agencyResult.id,
        agency_name: agencyResult.name,
        action_type: 'edit',
        action_label: 'editou o órgão',
        action_description: changedFields.length > 0 
          ? `Campos editados: ${changedFields.join(', ')}.`
          : 'Dados do órgão foram atualizados.',
        item_id: agencyResult.id,
        item_name: agencyResult.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          old_values: oldValues,
          new_values: newValues,
          changed_fields: changedFields,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return toLocalFormat(agencyResult);
  },

  async getActiveLinkedUnits(agencyId: number): Promise<any[]> {
    const { data, error } = await supabase
      .from('m_org_t_unit')
      .select('id, name, acronym')
      .eq('s_her_m_org_t_agency_c_id', agencyId)
      .eq('is_deleted', false);

    if (error) {
      throw new Error(`Erro ao buscar unidades vinculadas: ${error.message}`);
    }

    return data || [];
  },

  async toggleAgencyStatus(id: number, currentStatus: boolean): Promise<void> {
    // Buscar dados do órgão antes de alterar
    const agency = await this.getAgencyById(id);

    const { error } = await supabase
      .from('m_org_t_agency')
      .update({
        is_deleted: currentStatus,
        deleted_at: currentStatus ? new Date().toISOString() : null,
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao alterar status da agência: ${error.message}`);
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      const action = currentStatus ? 'deactivate' : 'activate';
      const actionLabel = currentStatus ? 'inativou o órgão' : 'ativou o órgão';
      const actionDescription = currentStatus 
        ? `O órgão foi inativado.`
        : `O órgão foi ativado.`;
      
      await logAgencyAction({
        agency_id: id,
        agency_name: agency?.name || 'Órgão',
        action_type: action,
        action_label: actionLabel,
        action_description: actionDescription,
        item_id: id,
        item_name: agency?.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          previous_status: !currentStatus,
          new_status: currentStatus,
          is_deleted: currentStatus,
          deleted_at: currentStatus ? new Date().toISOString() : null,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }
  },

  async toggleAgencyStatusWithCascade(id: number, currentStatus: boolean, inactivateUnits: boolean): Promise<void> {
    // Buscar dados do órgão antes de alterar
    const agency = await this.getAgencyById(id);
    let affectedUnitsCount = 0;

    // Se for inativar (currentStatus = true) e cascade for true, inativar unidades também
    if (currentStatus && inactivateUnits) {
      const { data: unitsData, error: unitsError } = await supabase
        .from('m_org_t_unit')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
        })
        .eq('s_her_m_org_t_agency_c_id', id)
        .eq('is_deleted', false)
        .select('id');

      if (unitsError) {
        throw new Error(`Erro ao inativar unidades vinculadas: ${unitsError.message}`);
      }

      affectedUnitsCount = unitsData?.length || 0;
    }

    // Inativar/reativar o órgão
    const { error } = await supabase
      .from('m_org_t_agency')
      .update({
        is_deleted: currentStatus,
        deleted_at: currentStatus ? new Date().toISOString() : null,
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao alterar status da agência: ${error.message}`);
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      const action = currentStatus ? 'deactivate' : 'activate';
      const actionLabel = currentStatus ? 'inativou o órgão' : 'ativou o órgão';
      const actionDescription = currentStatus 
        ? `O órgão foi inativado${affectedUnitsCount > 0 ? ` e ${affectedUnitsCount} unidade(s) vinculada(s) também foram inativadas` : ''}.`
        : `O órgão foi ativado.`;
      
      await logAgencyAction({
        agency_id: id,
        agency_name: agency?.name || 'Órgão',
        action_type: action,
        action_label: actionLabel,
        action_description: actionDescription,
        item_id: id,
        item_name: agency?.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          previous_status: !currentStatus,
          new_status: currentStatus,
          is_deleted: currentStatus,
          deleted_at: currentStatus ? new Date().toISOString() : null,
          cascade: true,
          affected_units_count: affectedUnitsCount,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }
  },

  async checkEmailExists(email: string, excludeId?: number): Promise<boolean> {
    let query = supabase
      .from('m_org_t_agency')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .eq('is_deleted', false);
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query.maybeSingle();
    
    if (error) {
      console.error('Erro ao verificar e-mail:', error);
      return false;
    }
    
    return !!data;
  },
};
