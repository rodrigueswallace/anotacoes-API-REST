import { supabase } from '@/integrations/supabase/client';
import { AssetSubgroup, AssetSubgroupInsert, AssetSubgroupUpdate, AssetSubgroupWithGroup } from '@/types/asset-subgroup.types';
import { logAssetSubgroupAction } from './asset-subgroup-audit.service';
import { getCurrentUser } from '@/lib/auth-helpers';

export const assetSubgroupsService = {
  // Buscar todos os subgrupos de bem com JOIN para nome do grupo
  async getAllAssetSubgroups(): Promise<AssetSubgroupWithGroup[]> {
    const { data, error } = await (supabase as any)
      .from('m_ast_t_asset_subgroup')
      .select(`
        *,
        m_ast_t_asset_group!s_her_m_ast_t_asset_group_c_id (
          name
        )
      `)
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro ao buscar subgrupos de bem:', error);
      throw new Error('Erro ao carregar subgrupos de bem');
    }

    // Transformar resposta para incluir group_name no nível principal
    return (data || []).map((item: any) => ({
      ...item,
      group_name: item.m_ast_t_asset_group?.name || ''
    }));
  },

  // Buscar subgrupo de bem por ID
  async getAssetSubgroupById(id: number): Promise<AssetSubgroupWithGroup | null> {
    const { data, error } = await (supabase as any)
      .from('m_ast_t_asset_subgroup')
      .select(`
        *,
        m_ast_t_asset_group!s_her_m_ast_t_asset_group_c_id (
          name
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar subgrupo de bem por ID:', error);
      throw new Error('Erro ao carregar subgrupo de bem');
    }

    if (!data) return null;

    return {
      ...data,
      group_name: data.m_ast_t_asset_group?.name || ''
    };
  },

  // Buscar subgrupos de um grupo específico
  async getAssetSubgroupsByGroupId(groupId: number): Promise<AssetSubgroupWithGroup[]> {
    const { data, error } = await (supabase as any)
      .from('m_ast_t_asset_subgroup')
      .select(`
        *,
        m_ast_t_asset_group!s_her_m_ast_t_asset_group_c_id (
          name
        )
      `)
      .eq('s_her_m_ast_t_asset_group_c_id', groupId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro ao buscar subgrupos de bem por grupo:', error);
      throw new Error('Erro ao carregar subgrupos de bem');
    }

    return (data || []).map((item: any) => ({
      ...item,
      group_name: item.m_ast_t_asset_group?.name || ''
    }));
  },

  // Criar novo subgrupo de bem
  async createAssetSubgroup(data: AssetSubgroupInsert): Promise<AssetSubgroup> {
    // Validar se o grupo existe
    const { data: groupExists } = await (supabase as any)
      .from('m_ast_t_asset_group')
      .select('id')
      .eq('id', data.s_her_m_ast_t_asset_group_c_id)
      .maybeSingle();

    if (!groupExists) {
      throw new Error('Grupo de bem não encontrado');
    }

    const { data: result, error } = await (supabase as any)
      .from('m_ast_t_asset_subgroup')
      .insert([data])
      .select()
      .single();

    if (error) {
      // Verificar se é erro de constraint unique
      if (error.code === '23505') {
        if (error.message.includes('name')) {
          throw new Error('Já existe um subgrupo de bem cadastrado com este nome');
        }
        throw new Error('Já existe um subgrupo de bem com estes dados');
      }
      
      console.error('Erro ao criar subgrupo de bem:', error);
      throw new Error('Erro ao salvar subgrupo de bem');
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logAssetSubgroupAction({
        asset_subgroup_id: result.id,
        asset_subgroup_name: result.name,
        asset_group_id: result.s_her_m_ast_t_asset_group_c_id,
        action_type: 'create',
        action_label: 'Subgrupo de Bem Criado',
        action_description: `Subgrupo "${result.name}" foi criado no grupo de bem.`,
        item_id: result.id,
        item_name: result.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          group_id: result.s_her_m_ast_t_asset_group_c_id,
          is_deleted: result.is_deleted,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return result;
  },

  // Atualizar subgrupo de bem
  async updateAssetSubgroup(id: number, data: AssetSubgroupUpdate): Promise<AssetSubgroup> {
    // Buscar dados antigos para comparação
    const oldSubgroup = await this.getAssetSubgroupById(id);
    
    // Se está atualizando o grupo, validar se existe
    if (data.s_her_m_ast_t_asset_group_c_id) {
      const { data: groupExists } = await (supabase as any)
        .from('m_ast_t_asset_group')
        .select('id')
        .eq('id', data.s_her_m_ast_t_asset_group_c_id)
        .maybeSingle();

      if (!groupExists) {
        throw new Error('Grupo de bem não encontrado');
      }
    }

    const { data: result, error } = await (supabase as any)
      .from('m_ast_t_asset_subgroup')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // Verificar se é erro de constraint unique
      if (error.code === '23505') {
        if (error.message.includes('name')) {
          throw new Error('Já existe um subgrupo de bem cadastrado com este nome');
        }
        throw new Error('Já existe um subgrupo de bem com estes dados');
      }
      
      console.error('Erro ao atualizar subgrupo de bem:', error);
      throw new Error('Erro ao atualizar subgrupo de bem');
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      
      // Identificar campos alterados
      const changes: string[] = [];
      const oldValues: Record<string, any> = {};
      const newValues: Record<string, any> = {};

      if (oldSubgroup) {
        if (data.name !== undefined && data.name !== oldSubgroup.name) {
          changes.push('nome');
          oldValues.name = oldSubgroup.name;
          newValues.name = data.name;
        }
        if (data.s_her_m_ast_t_asset_group_c_id !== undefined && data.s_her_m_ast_t_asset_group_c_id !== oldSubgroup.s_her_m_ast_t_asset_group_c_id) {
          changes.push('grupo de bem');
          oldValues.s_her_m_ast_t_asset_group_c_id = oldSubgroup.s_her_m_ast_t_asset_group_c_id;
          newValues.s_her_m_ast_t_asset_group_c_id = data.s_her_m_ast_t_asset_group_c_id;
        }
      }
      
      await logAssetSubgroupAction({
        asset_subgroup_id: result.id,
        asset_subgroup_name: result.name,
        asset_group_id: result.s_her_m_ast_t_asset_group_c_id,
        action_type: 'edit',
        action_label: 'editou o subgrupo de bem',
        action_description: changes.length > 0 
          ? `Campos editados: ${changes.join(', ')}.`
          : 'Dados do subgrupo de bem foram atualizados.',
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

  // Toggle status (ativar/inativar)
  async toggleAssetSubgroupStatus(id: number): Promise<AssetSubgroup> {
    // Primeiro buscar o estado atual
    const current = await this.getAssetSubgroupById(id);
    if (!current) {
      throw new Error('Subgrupo de bem não encontrado');
    }

    // Inverter o status
    const newStatus = !current.is_deleted;
    
    const { data: result, error } = await (supabase as any)
      .from('m_ast_t_asset_subgroup')
      .update({ is_deleted: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao alterar status do subgrupo de bem:', error);
      throw new Error('Erro ao alterar status do subgrupo de bem');
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      const action = newStatus ? 'deactivate' : 'activate';
      const actionLabel = newStatus ? 'inativou o subgrupo de bem' : 'ativou o subgrupo de bem';
      const actionDescription = newStatus 
        ? `O subgrupo de bem foi inativado.`
        : `O subgrupo de bem foi ativado.`;
      
      await logAssetSubgroupAction({
        asset_subgroup_id: result.id,
        asset_subgroup_name: result.name,
        asset_group_id: result.s_her_m_ast_t_asset_group_c_id,
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
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return result;
  },
};
