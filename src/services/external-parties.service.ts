import { supabase } from '@/integrations/supabase/client';
import type {
  ExternalParty,
  ExternalPartyAddress,
  ExternalPartyWithAddress,
  ExternalPartyInsert,
  ExternalPartyUpdate,
  ExternalPartyAddressInsert,
  ExternalPartyAddressUpdate,
  ExternalPartyLocal
} from '@/types/external-party.types';
import { toLocalFormat, toSupabaseFormat } from '@/types/external-party.types';
import { logExternalPartyAction, logExternalPartyAddressAction } from './external-party-audit.service';
import { getCurrentUser } from '@/lib/auth-helpers';

export class ExternalPartiesService {
  /**
   * Formata endereço para exibição legível
   */
  private static formatAddressDescription(address: any): string {
    const parts = [
      address.street || address.logradouro,
      address.number || address.numero,
      address.neighborhood || address.bairro,
      address.city || address.municipio,
      address.state || address.uf,
    ].filter(Boolean);
    
    return parts.join(', ');
  }
  /**
   * Busca todos os fornecedores/terceiros ativos com seus endereços
   */
  static async getAllExternalParties(): Promise<ExternalPartyLocal[]> {
    const { data, error } = await supabase
      .from('m_ctr_t_external_party')
      .select(`
        id,
        name,
        identity,
        email,
        phone_number,
        legal_representative,
        notes,
        s_her_m_ctr_t_external_party_address_c_id,
        is_deleted,
        created_at,
        deleted_at,
        address:s_her_m_ctr_t_external_party_address_c_id (
          id,
          postal_code,
          street,
          neighborhood,
          city,
          state,
          country,
          number,
          complement,
          is_deleted,
          created_at,
          deleted_at
        )
      `)
      .order('name');

    if (error) {
      console.error('Erro ao buscar fornecedores:', error);
      throw new Error('Erro ao buscar fornecedores');
    }

    if (!data) return [];

    // Filtra e converte registros válidos
    const validParties = data
      .filter((party: any) => {
        const addr = party.address;
        return addr && typeof addr === 'object' && !Array.isArray(addr);
      })
      .map((party: any) => {
        return toLocalFormat({
          ...party,
          address: party.address
        } as ExternalPartyWithAddress);
      });

    return validParties;
  }

  /**
   * Busca um fornecedor/terceiro específico por ID
   */
  static async getExternalPartyById(id: number): Promise<ExternalPartyLocal | null> {
    const { data, error } = await supabase
      .from('m_ctr_t_external_party')
      .select(`
        id,
        name,
        identity,
        email,
        phone_number,
        legal_representative,
        notes,
        s_her_m_ctr_t_external_party_address_c_id,
        is_deleted,
        created_at,
        deleted_at,
        address:s_her_m_ctr_t_external_party_address_c_id (
          id,
          postal_code,
          street,
          neighborhood,
          city,
          state,
          country,
          number,
          complement,
          is_deleted,
          created_at,
          deleted_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar fornecedor:', error);
      return null;
    }

    if (!data) return null;

    const addr = (data as any).address;
    if (!addr || typeof addr !== 'object' || Array.isArray(addr)) {
      return null;
    }

    return toLocalFormat(data as unknown as ExternalPartyWithAddress);
  }

  /**
   * Cria um novo fornecedor/terceiro com endereço
   */
  static async createExternalParty(localData: Partial<ExternalPartyLocal>): Promise<ExternalPartyLocal> {
    const { party, address } = toSupabaseFormat(localData);

    // 1. Primeiro, cria o endereço
    const { data: addressData, error: addressError } = await supabase
      .from('m_ctr_t_external_party_address')
      .insert(address as ExternalPartyAddressInsert)
      .select()
      .single();

    if (addressError || !addressData) {
      console.error('Erro ao criar endereço:', {
        message: addressError?.message,
        details: addressError?.details,
        hint: addressError?.hint,
        code: addressError?.code
      });
      throw new Error('Erro ao criar endereço do fornecedor');
    }

    // 2. Depois, cria o fornecedor com referência ao endereço
    const partyWithAddress: ExternalPartyInsert = {
      ...(party as ExternalPartyInsert),
      s_her_m_ctr_t_external_party_address_c_id: addressData.id
    };

    const { data: partyData, error: partyError } = await supabase
      .from('m_ctr_t_external_party')
      .insert(partyWithAddress)
      .select()
      .single();

    if (partyError || !partyData) {
      // Rollback: deleta o endereço criado
      await supabase
        .from('m_ctr_t_external_party_address')
        .delete()
        .eq('id', addressData.id);
      
      // Verifica se é erro de constraint unique
      if (partyError?.code === '23505') {
        if (partyError.message.includes('email')) {
          throw new Error('Já existe um fornecedor cadastrado com este e-mail');
        } else if (partyError.message.includes('identity')) {
          throw new Error('Já existe um fornecedor cadastrado com este CPF/CNPJ');
        }
      }
      
      console.error('Erro ao criar fornecedor:', partyError);
      throw new Error('Erro ao criar fornecedor');
    }

    // Busca o registro completo com o endereço
    const created = await this.getExternalPartyById(partyData.id);
    if (!created) {
      throw new Error('Erro ao buscar fornecedor criado');
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logExternalPartyAction({
        external_party_id: created.id,
        external_party_name: created.nome,
        action_type: 'create',
        action_label: 'Fornecedor/Terceiro Criado',
        action_description: `Fornecedor/Terceiro "${created.nome}" foi criado.`,
        item_id: created.id,
        item_name: created.nome,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          name: created.nome,
          identity: created.cpf_cnpj,
          email: created.email,
          phone_number: created.telefone,
          legal_representative: created.representanteLegal,
          address: {
            postal_code: created.cep,
            street: created.logradouro,
            number: created.numero,
            complement: created.complemento,
            neighborhood: created.bairro,
            city: created.municipio,
            state: created.uf,
          },
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    // Log de auditoria do endereço criado
    try {
      const currentUser = await getCurrentUser();
      const addressDescription = this.formatAddressDescription(created);
      
      await logExternalPartyAddressAction({
        address_id: addressData.id,
        address_description: addressDescription,
        external_party_id: created.id,
        external_party_name: created.nome,
        action_type: 'create',
        action_label: 'Endereço Criado',
        action_description: `Endereço "${addressDescription}" foi criado para o fornecedor "${created.nome}".`,
        item_name: addressDescription,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          postal_code: created.cep,
          street: created.logradouro,
          number: created.numero,
          complement: created.complemento,
          neighborhood: created.bairro,
          city: created.municipio,
          state: created.uf,
          country: 'Brasil',
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria do endereço (não bloqueante):', logError);
    }

    return created;
  }

  /**
   * Atualiza um fornecedor/terceiro existente
   */
  static async updateExternalParty(
    id: number,
    localData: Partial<ExternalPartyLocal>
  ): Promise<ExternalPartyLocal> {
    // Buscar dados antigos para comparação
    const oldParty = await this.getExternalPartyById(id);
    
    const { party, address } = toSupabaseFormat(localData);

    // 1. Busca o fornecedor para obter o ID do endereço
    const { data: existingParty, error: fetchError } = await supabase
      .from('m_ctr_t_external_party')
      .select('s_her_m_ctr_t_external_party_address_c_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingParty) {
      console.error('Erro ao buscar fornecedor para atualização:', fetchError);
      throw new Error('Fornecedor não encontrado');
    }

    // 2. Atualiza o endereço se houver dados de endereço
    if (Object.keys(address).length > 0) {
      const { error: addressError } = await supabase
        .from('m_ctr_t_external_party_address')
        .update(address as ExternalPartyAddressUpdate)
        .eq('id', existingParty.s_her_m_ctr_t_external_party_address_c_id);

      if (addressError) {
        console.error('Erro ao atualizar endereço:', addressError);
        throw new Error('Erro ao atualizar endereço do fornecedor');
      }
    }

    // 3. Atualiza os dados do fornecedor
    if (Object.keys(party).length > 0) {
      const { error: partyError } = await supabase
        .from('m_ctr_t_external_party')
        .update(party as ExternalPartyUpdate)
        .eq('id', id);

      if (partyError) {
        // Verifica se é erro de constraint unique
        if (partyError.code === '23505') {
          if (partyError.message.includes('email')) {
            throw new Error('Já existe um fornecedor cadastrado com este e-mail');
          } else if (partyError.message.includes('identity')) {
            throw new Error('Já existe um fornecedor cadastrado com este CPF/CNPJ');
          }
        }
        
        console.error('Erro ao atualizar fornecedor:', partyError);
        throw new Error('Erro ao atualizar fornecedor');
      }
    }

    // Busca o registro atualizado
    const updated = await this.getExternalPartyById(id);
    if (!updated) {
      throw new Error('Erro ao buscar fornecedor atualizado');
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      
      // Identificar campos alterados
      const changes: string[] = [];
      const oldValues: Record<string, any> = {};
      const newValues: Record<string, any> = {};

      if (oldParty) {
        if (localData.nome && localData.nome !== oldParty.nome) {
          changes.push('nome');
          oldValues.nome = oldParty.nome;
          newValues.nome = localData.nome;
        }
        if (localData.cpf_cnpj && localData.cpf_cnpj !== oldParty.cpf_cnpj) {
          changes.push('CPF/CNPJ');
          oldValues.cpf_cnpj = oldParty.cpf_cnpj;
          newValues.cpf_cnpj = localData.cpf_cnpj;
        }
        if (localData.email && localData.email !== oldParty.email) {
          changes.push('e-mail');
          oldValues.email = oldParty.email;
          newValues.email = localData.email;
        }
        if (localData.telefone && localData.telefone !== oldParty.telefone) {
          changes.push('telefone');
          oldValues.telefone = oldParty.telefone;
          newValues.telefone = localData.telefone;
        }
        if (localData.representanteLegal && localData.representanteLegal !== oldParty.representanteLegal) {
          changes.push('representante legal');
          oldValues.representanteLegal = oldParty.representanteLegal;
          newValues.representanteLegal = localData.representanteLegal;
        }
        if (localData.cep && localData.cep !== oldParty.cep) {
          changes.push('CEP');
        }
        if (localData.logradouro && localData.logradouro !== oldParty.logradouro) {
          changes.push('logradouro');
        }
        if (localData.bairro && localData.bairro !== oldParty.bairro) {
          changes.push('bairro');
        }
        if (localData.municipio && localData.municipio !== oldParty.municipio) {
          changes.push('município');
        }
        if (localData.uf && localData.uf !== oldParty.uf) {
          changes.push('UF');
        }
      }
      
      await logExternalPartyAction({
        external_party_id: updated.id,
        external_party_name: updated.nome,
        action_type: 'edit',
        action_label: 'editou o fornecedor',
        action_description: changes.length > 0 
          ? `Campos editados: ${changes.join(', ')}.`
          : 'Dados do fornecedor foram atualizados.',
        item_id: updated.id,
        item_name: updated.nome,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          old_values: oldValues,
          new_values: newValues,
          changes,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return updated;
  }

  /**
   * Alterna o status ativo/inativo (soft delete)
   */
  static async toggleExternalPartyStatus(id: number): Promise<boolean> {
    // 1. Busca o status atual
    const { data: current, error: fetchError } = await supabase
      .from('m_ctr_t_external_party')
      .select('is_deleted, s_her_m_ctr_t_external_party_address_c_id')
      .eq('id', id)
      .single();

    if (fetchError || !current) {
      console.error('Erro ao buscar fornecedor:', fetchError);
      throw new Error('Fornecedor não encontrado');
    }

    const newStatus = !current.is_deleted;
    const now = new Date().toISOString();

    // 2. Atualiza o status do fornecedor
    const { error: partyError } = await supabase
      .from('m_ctr_t_external_party')
      .update({
        is_deleted: newStatus,
        deleted_at: newStatus ? now : null
      })
      .eq('id', id);

    if (partyError) {
      console.error('Erro ao atualizar status do fornecedor:', partyError);
      throw new Error('Erro ao atualizar status do fornecedor');
    }

    // 3. Atualiza o status do endereço associado
    const { error: addressError } = await supabase
      .from('m_ctr_t_external_party_address')
      .update({
        is_deleted: newStatus,
        deleted_at: newStatus ? now : null
      })
      .eq('id', current.s_her_m_ctr_t_external_party_address_c_id);

    if (addressError) {
      console.error('Erro ao atualizar status do endereço:', addressError);
      // Rollback do status do fornecedor
      await supabase
        .from('m_ctr_t_external_party')
        .update({
          is_deleted: current.is_deleted,
          deleted_at: current.is_deleted ? now : null
        })
        .eq('id', id);
      
      throw new Error('Erro ao atualizar status do endereço');
    }

    // Buscar dados do fornecedor para o log
    const externalParty = await this.getExternalPartyById(id);

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      const action = newStatus ? 'deactivate' : 'activate';
      const actionLabel = newStatus ? 'inativou o fornecedor' : 'ativou o fornecedor';
      const actionDescription = newStatus 
        ? `O fornecedor foi inativado.`
        : `O fornecedor foi ativado.`;
      
      await logExternalPartyAction({
        external_party_id: id,
        external_party_name: externalParty?.nome || 'Fornecedor',
        action_type: action,
        action_label: actionLabel,
        action_description: actionDescription,
        item_id: id,
        item_name: externalParty?.nome,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          previous_status: !newStatus,
          new_status: newStatus,
          is_deleted: newStatus,
          deleted_at: newStatus ? now : null,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    // Log de auditoria do endereço inativado/reativado
    try {
      const currentUser = await getCurrentUser();
      const action = newStatus ? 'deactivate' : 'activate';
      const actionLabel = newStatus ? 'Endereço Inativado' : 'Endereço Reativado';
      const addressDescription = externalParty ? this.formatAddressDescription(externalParty) : 'Endereço';
      const actionDescription = newStatus 
        ? `Endereço "${addressDescription}" foi inativado junto com o fornecedor "${externalParty?.nome || 'Fornecedor'}".`
        : `Endereço "${addressDescription}" foi reativado junto com o fornecedor "${externalParty?.nome || 'Fornecedor'}".`;
      
      await logExternalPartyAddressAction({
        address_id: current.s_her_m_ctr_t_external_party_address_c_id,
        address_description: addressDescription,
        external_party_id: id,
        external_party_name: externalParty?.nome || 'Fornecedor',
        action_type: action,
        action_label: actionLabel,
        action_description: actionDescription,
        item_name: addressDescription,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          previous_status: !newStatus,
          new_status: newStatus,
          is_deleted: newStatus,
          deleted_at: newStatus ? now : null,
          postal_code: externalParty?.cep,
          street: externalParty?.logradouro,
          number: externalParty?.numero,
          neighborhood: externalParty?.bairro,
          city: externalParty?.municipio,
          state: externalParty?.uf,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria do endereço (não bloqueante):', logError);
    }

    return newStatus;
  }
}
