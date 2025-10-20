import { supabase } from '@/integrations/supabase/client';
import type {
  CredentialingEntity,
  CredentialingEntityWithAddress,
  CredentialingEntityLocal,
  CredentialingEntityInsert,
  CredentialingEntityUpdate,
  CredentialingEntityAddressInsert,
  CredentialingEntityAddressUpdate,
  toLocalFormat,
  toSupabaseFormat
} from '@/types/credentialing-entity.types';
import { toLocalFormat as convertToLocal, toSupabaseFormat as convertToSupabase } from '@/types/credentialing-entity.types';
import { getCurrentUser } from '@/lib/auth-helpers';
import { logCredentialingEntityAction } from './credentialing-entity-audit.service';

class CredentialingEntitiesService {
  private readonly ENTITY_TABLE = 'm_org_t_credentialing_entity';
  private readonly ADDRESS_TABLE = 'm_org_t_credentialing_entity_address';

  async getAllCredentialingEntities(): Promise<CredentialingEntityLocal[]> {
    try {
      const { data: entities, error: entitiesError } = await supabase
        .from(this.ENTITY_TABLE)
        .select(`
          *,
          address:s_her_m_org_t_credentialing_entity_address_c_id (*)
        `)
        .order('created_at', { ascending: false });

      if (entitiesError) {
        console.error('Error fetching credentialing entities:', entitiesError);
        throw new Error(`Erro ao buscar entidades: ${entitiesError.message}`);
      }

      if (!entities) {
        return [];
      }

      return entities.map((entity: any) => {
        const entityWithAddress: CredentialingEntityWithAddress = {
          ...entity,
          address: Array.isArray(entity.address) ? entity.address[0] : entity.address
        };
        return convertToLocal(entityWithAddress);
      });
    } catch (error) {
      console.error('Error in getAllCredentialingEntities:', error);
      throw error;
    }
  }

  async getCredentialingEntityById(id: number): Promise<CredentialingEntityLocal | null> {
    try {
      const { data: entity, error } = await supabase
        .from(this.ENTITY_TABLE)
        .select(`
          *,
          address:s_her_m_org_t_credentialing_entity_address_c_id (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching credentialing entity:', error);
        throw new Error(`Erro ao buscar entidade: ${error.message}`);
      }

      if (!entity) {
        return null;
      }

      const entityWithAddress: CredentialingEntityWithAddress = {
        ...entity,
        address: Array.isArray(entity.address) ? entity.address[0] : entity.address
      };

      return convertToLocal(entityWithAddress);
    } catch (error) {
      console.error('Error in getCredentialingEntityById:', error);
      throw error;
    }
  }

  async createCredentialingEntity(localData: Partial<CredentialingEntityLocal>): Promise<CredentialingEntityLocal> {
    try {
      const { entity, address } = convertToSupabase(localData);

      // 1. Criar endereço primeiro
      const { data: addressData, error: addressError } = await supabase
        .from(this.ADDRESS_TABLE)
        .insert(address as CredentialingEntityAddressInsert)
        .select()
        .single();

      if (addressError || !addressData) {
        console.error('Error creating address:', addressError);
        throw new Error(`Erro ao criar endereço: ${addressError?.message || 'Dados não retornados'}`);
      }

      // 2. Criar entidade com referência ao endereço
      const entityWithAddressId: CredentialingEntityInsert = {
        ...(entity as CredentialingEntityInsert),
        s_her_m_org_t_credentialing_entity_address_c_id: addressData.id
      };

      const { data: entityData, error: entityError } = await supabase
        .from(this.ENTITY_TABLE)
        .insert(entityWithAddressId)
        .select()
        .single();

      if (entityError || !entityData) {
        // Rollback: deletar o endereço criado
        await supabase
          .from(this.ADDRESS_TABLE)
          .delete()
          .eq('id', addressData.id);

        console.error('Error creating entity:', entityError);
        throw new Error(`Erro ao criar entidade: ${entityError?.message || 'Dados não retornados'}`);
      }

      // Buscar entidade completa com endereço
      const created = await this.getCredentialingEntityById(entityData.id);
      if (!created) {
        throw new Error('Erro ao buscar entidade criada');
      }

      // ✅ Registrar ação de auditoria
      try {
        const currentUser = await getCurrentUser();
        await logCredentialingEntityAction({
          entity_id: created.id,
          entity_name: created.nome,
          action_type: 'create',
          action_label: 'Entidade credenciada criada',
          action_description: `Entidade "${created.nome}" foi criada com sucesso.`,
          performed_by: currentUser?.id,
          performed_by_name: currentUser?.name,
          metadata: {
            entity_type: created.tipoEntidade,
            cnpj: created.cnpj,
            responsible_email: created.emailResponsavel,
            responsible_phone: created.telefoneResponsavel,
          },
        });
      } catch (auditError) {
        console.error('Erro ao registrar auditoria de criação:', auditError);
      }

      return created;
    } catch (error) {
      console.error('Error in createCredentialingEntity:', error);
      throw error;
    }
  }

  async updateCredentialingEntity(id: number, localData: Partial<CredentialingEntityLocal>): Promise<CredentialingEntityLocal> {
    try {
      const { entity, address } = convertToSupabase(localData);

      // 1. Buscar entidade para obter o ID do endereço
      const { data: currentEntity, error: fetchError } = await supabase
        .from(this.ENTITY_TABLE)
        .select('s_her_m_org_t_credentialing_entity_address_c_id')
        .eq('id', id)
        .single();

      if (fetchError || !currentEntity) {
        console.error('Error fetching current entity:', fetchError);
        throw new Error(`Erro ao buscar entidade: ${fetchError?.message || 'Entidade não encontrada'}`);
      }

      // 2. Atualizar endereço se houver dados
      if (Object.keys(address).length > 0) {
        const { error: addressError } = await supabase
          .from(this.ADDRESS_TABLE)
          .update(address as CredentialingEntityAddressUpdate)
          .eq('id', currentEntity.s_her_m_org_t_credentialing_entity_address_c_id);

        if (addressError) {
          console.error('Error updating address:', addressError);
          throw new Error(`Erro ao atualizar endereço: ${addressError.message}`);
        }
      }

      // 3. Atualizar entidade
      const { error: entityError } = await supabase
        .from(this.ENTITY_TABLE)
        .update(entity as CredentialingEntityUpdate)
        .eq('id', id);

      if (entityError) {
        console.error('Error updating entity:', entityError);
        throw new Error(`Erro ao atualizar entidade: ${entityError.message}`);
      }

      // Buscar entidade atualizada
      const updated = await this.getCredentialingEntityById(id);
      if (!updated) {
        throw new Error('Erro ao buscar entidade atualizada');
      }

      // ✅ Registrar ação de auditoria
      try {
        const currentUser = await getCurrentUser();
        const existingEntity = await this.getCredentialingEntityById(id);
        
        // Identificar campos alterados
        const changes: string[] = [];
        if (existingEntity && updated) {
          if (existingEntity.nome !== updated.nome) {
            changes.push(`nome: "${existingEntity.nome}" → "${updated.nome}"`);
          }
          if (existingEntity.cnpj !== updated.cnpj) {
            changes.push(`CNPJ: "${existingEntity.cnpj}" → "${updated.cnpj}"`);
          }
          if (existingEntity.tipoEntidade !== updated.tipoEntidade) {
            changes.push(`tipo de entidade`);
          }
          if (existingEntity.emailResponsavel !== updated.emailResponsavel) {
            changes.push(`e-mail do responsável`);
          }
          if (existingEntity.telefoneResponsavel !== updated.telefoneResponsavel) {
            changes.push(`telefone do responsável`);
          }
        }
        
        await logCredentialingEntityAction({
          entity_id: updated.id,
          entity_name: updated.nome,
          action_type: 'edit',
          action_label: 'editou a entidade credenciada',
          action_description: changes.length > 0 
            ? `Campos editados: ${changes.join(', ')}.`
            : 'Dados da entidade credenciada foram atualizados.',
          performed_by: currentUser?.id,
          performed_by_name: currentUser?.name,
          metadata: {
            previous: existingEntity ? {
              name: existingEntity.nome,
              cnpj: existingEntity.cnpj,
              entity_type: existingEntity.tipoEntidade,
              responsible_email: existingEntity.emailResponsavel,
            } : {},
            updated: {
              name: updated.nome,
              cnpj: updated.cnpj,
              entity_type: updated.tipoEntidade,
              responsible_email: updated.emailResponsavel,
            },
            changes,
          },
        });
      } catch (auditError) {
        console.error('Erro ao registrar auditoria de edição:', auditError);
      }

      return updated;
    } catch (error) {
      console.error('Error in updateCredentialingEntity:', error);
      throw error;
    }
  }

  async toggleCredentialingEntityStatus(id: number): Promise<boolean> {
    try {
      // 1. Buscar estado atual e ID do endereço
      const { data: currentEntity, error: fetchError } = await supabase
        .from(this.ENTITY_TABLE)
        .select('is_deleted, s_her_m_org_t_credentialing_entity_address_c_id')
        .eq('id', id)
        .single();

      if (fetchError || !currentEntity) {
        console.error('Error fetching current entity:', fetchError);
        throw new Error(`Erro ao buscar entidade: ${fetchError?.message || 'Entidade não encontrada'}`);
      }

      const newStatus = !currentEntity.is_deleted;
      const now = new Date().toISOString();

      // 2. Atualizar entidade
      const { error: entityError } = await supabase
        .from(this.ENTITY_TABLE)
        .update({
          is_deleted: newStatus,
          deleted_at: newStatus ? now : null
        })
        .eq('id', id);

      if (entityError) {
        console.error('Error toggling entity status:', entityError);
        throw new Error(`Erro ao alterar status da entidade: ${entityError.message}`);
      }

      // 3. Atualizar endereço
      const { error: addressError } = await supabase
        .from(this.ADDRESS_TABLE)
        .update({
          is_deleted: newStatus,
          deleted_at: newStatus ? now : null
        })
        .eq('id', currentEntity.s_her_m_org_t_credentialing_entity_address_c_id);

      if (addressError) {
        // Rollback: reverter status da entidade
        await supabase
          .from(this.ENTITY_TABLE)
          .update({
            is_deleted: currentEntity.is_deleted,
            deleted_at: currentEntity.is_deleted ? now : null
          })
          .eq('id', id);

        console.error('Error toggling address status:', addressError);
        throw new Error(`Erro ao alterar status do endereço: ${addressError.message}`);
      }

      // ✅ Registrar ação de auditoria
      try {
        const currentUser = await getCurrentUser();
        const entity = await this.getCredentialingEntityById(id);
        
        if (entity) {
          const actionType = newStatus ? 'deactivate' : 'activate';
          const actionLabel = newStatus ? 'inativou a entidade credenciada' : 'ativou a entidade credenciada';
          const actionDescription = newStatus 
            ? `A entidade credenciada foi inativada.`
            : `A entidade credenciada foi ativada.`;

          await logCredentialingEntityAction({
            entity_id: entity.id,
            entity_name: entity.nome,
            action_type: actionType,
            action_label: actionLabel,
            action_description: actionDescription,
            performed_by: currentUser?.id,
            performed_by_name: currentUser?.name,
            metadata: {
              previous_status: !newStatus ? 'Ativo' : 'Inativo',
              new_status: newStatus ? 'Inativo' : 'Ativo',
            },
          });
        }
      } catch (auditError) {
        console.error('Erro ao registrar auditoria de status:', auditError);
      }

      return newStatus;
    } catch (error) {
      console.error('Error in toggleCredentialingEntityStatus:', error);
      throw error;
    }
  }

  async checkCNPJExists(cnpj: string, excludeId?: number): Promise<boolean> {
    try {
      const cleanCNPJ = cnpj.replace(/\D/g, '');
      
      let query = supabase
        .from(this.ENTITY_TABLE)
        .select('id')
        .eq('cnpj', cleanCNPJ);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error checking CNPJ:', error);
        throw new Error(`Erro ao verificar CNPJ: ${error.message}`);
      }

      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error in checkCNPJExists:', error);
      throw error;
    }
  }

  async checkEmailExists(email: string, excludeId?: number): Promise<boolean> {
    try {
      let query = supabase
        .from(this.ENTITY_TABLE)
        .select('id')
        .eq('responsible_email', email.toLowerCase().trim());

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error checking email:', error);
        throw new Error(`Erro ao verificar e-mail: ${error.message}`);
      }

      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error in checkEmailExists:', error);
      throw error;
    }
  }

  async checkPhoneExists(phone: string, excludeId?: number): Promise<boolean> {
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      
      let query = supabase
        .from(this.ENTITY_TABLE)
        .select('id')
        .eq('responsible_phone', cleanPhone);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error checking phone:', error);
        throw new Error(`Erro ao verificar telefone: ${error.message}`);
      }

      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error in checkPhoneExists:', error);
      throw error;
    }
  }
}

export const credentialingEntitiesService = new CredentialingEntitiesService();
