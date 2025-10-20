import { supabase } from '@/integrations/supabase/client';
import { AssetCondition, AssetConditionInsert, AssetConditionUpdate } from '@/types/asset-condition.types';
import { logAssetConditionAction } from './asset-condition-audit.service';
import { getCurrentUser } from '@/lib/auth-helpers';

// Tipos genéricos para contornar limitações do TypeScript com esquemas
type GenericSupabaseTable = any;

export const assetConditionsService = {
  // Buscar todos os estados de conservação ativos
  async getAllAssetConditions(): Promise<AssetCondition[]> {
    const { data, error } = await (supabase as any)
      .from('m_ast_t_asset_condition')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro ao buscar estados de conservação:', error);
      throw new Error('Erro ao carregar estados de conservação');
    }

    return data || [];
  },

  // Buscar estado de conservação por ID
  async getAssetConditionById(id: number): Promise<AssetCondition | null> {
    const { data, error } = await (supabase as any)
      .from('m_ast_t_asset_condition')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar estado de conservação por ID:', error);
      throw new Error('Erro ao carregar estado de conservação');
    }

    return data;
  },

  // Criar novo estado de conservação
  async createAssetCondition(data: AssetConditionInsert): Promise<AssetCondition> {
    const { data: result, error } = await (supabase as any)
      .from('m_ast_t_asset_condition')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar estado de conservação:', error);
      throw new Error('Erro ao salvar estado de conservação');
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logAssetConditionAction({
        asset_condition_id: result.id,
        asset_condition_name: result.name,
        action_type: 'create',
        action_label: 'Estado de Conservação Criado',
        action_description: `Estado de conservação "${result.name}" foi criado.`,
        item_id: result.id,
        item_name: result.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          name: result.name,
          description: result.description,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return result;
  },

  // Atualizar estado de conservação
  async updateAssetCondition(id: number, data: AssetConditionUpdate): Promise<AssetCondition> {
    // Buscar dados antigos para comparação
    const oldCondition = await this.getAssetConditionById(id);
    
    const { data: result, error } = await (supabase as any)
      .from('m_ast_t_asset_condition')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar estado de conservação:', error);
      throw new Error('Erro ao atualizar estado de conservação');
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      
      // Identificar campos alterados
      const changes: string[] = [];
      const oldValues: Record<string, any> = {};
      const newValues: Record<string, any> = {};

      if (oldCondition) {
        if (data.name !== undefined && data.name !== oldCondition.name) {
          changes.push('nome');
          oldValues.name = oldCondition.name;
          newValues.name = data.name;
        }
        if (data.description !== undefined && data.description !== oldCondition.description) {
          changes.push('descrição');
          oldValues.description = oldCondition.description;
          newValues.description = data.description;
        }
      }
      
      await logAssetConditionAction({
        asset_condition_id: result.id,
        asset_condition_name: result.name,
        action_type: 'edit',
        action_label: 'editou o estado de conservação',
        action_description: changes.length > 0 
          ? `Campos editados: ${changes.join(', ')}.`
          : 'Dados do estado de conservação foram atualizados.',
        item_id: result.id,
        item_name: result.name,
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

    return result;
  },

  // Soft delete - marcar como deletado
  async deleteAssetCondition(id: number): Promise<void> {
    const { error } = await (supabase as any)
      .from('m_ast_t_asset_condition')
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar estado de conservação:', error);
      throw new Error('Erro ao remover estado de conservação');
    }
  },

  // Reativar estado de conservação
  async reactivateAssetCondition(id: number): Promise<AssetCondition> {
    const { data: result, error } = await (supabase as any)
      .from('m_ast_t_asset_condition')
      .update({ is_deleted: false })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao reativar estado de conservação:', error);
      throw new Error('Erro ao reativar estado de conservação');
    }

    return result;
  },

  // Toggle status (ativar/inativar)
  async toggleAssetConditionStatus(id: number): Promise<AssetCondition> {
    // Primeiro buscar o estado atual
    const current = await this.getAssetConditionById(id);
    if (!current) {
      throw new Error('Estado de conservação não encontrado');
    }

    // Inverter o status
    const newStatus = !current.is_deleted;
    
    const { data: result, error } = await (supabase as any)
      .from('m_ast_t_asset_condition')
      .update({ is_deleted: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao alterar status do estado de conservação:', error);
      throw new Error('Erro ao alterar status do estado de conservação');
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      const action = newStatus ? 'deactivate' : 'activate';
      const actionLabel = newStatus ? 'inativou o estado de conservação' : 'ativou o estado de conservação';
      const actionDescription = newStatus 
        ? `O estado de conservação foi inativado.`
        : `O estado de conservação foi ativado.`;
      
      await logAssetConditionAction({
        asset_condition_id: result.id,
        asset_condition_name: result.name,
        action_type: action,
        action_label: actionLabel,
        action_description: actionDescription,
        item_id: result.id,
        item_name: result.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          previous_status: !newStatus,
          new_status: newStatus,
          is_deleted: newStatus,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return result;
  },
};