import { supabase } from '@/integrations/supabase/client';
import { AssetGroup, AssetGroupInsert, AssetGroupUpdate } from '@/types/asset-group.types';
import { logAssetGroupAction } from './asset-group-audit.service';
import { getCurrentUser } from '@/lib/auth-helpers';

export const assetGroupsService = {
  // Buscar todos os grupos de bem
  async getAllAssetGroups(): Promise<AssetGroup[]> {
    const { data, error } = await (supabase as any)
      .from('m_ast_t_asset_group')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro ao buscar grupos de bem:', error);
      throw new Error('Erro ao carregar grupos de bem');
    }

    return data || [];
  },

  // Buscar grupo de bem por ID
  async getAssetGroupById(id: number): Promise<AssetGroup | null> {
    const { data, error } = await (supabase as any)
      .from('m_ast_t_asset_group')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar grupo de bem por ID:', error);
      throw new Error('Erro ao carregar grupo de bem');
    }

    return data;
  },

  // Criar novo grupo de bem
  async createAssetGroup(data: AssetGroupInsert): Promise<AssetGroup> {
    const { data: result, error } = await (supabase as any)
      .from('m_ast_t_asset_group')
      .insert([data])
      .select()
      .single();

    if (error) {
      // Verificar se é erro de constraint unique
      if (error.code === '23505') {
        if (error.message.includes('name')) {
          throw new Error('Já existe um grupo de bem cadastrado com este nome');
        }
        throw new Error('Já existe um grupo de bem com estes dados');
      }
      
      console.error('Erro ao criar grupo de bem:', error);
      throw new Error('Erro ao salvar grupo de bem');
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logAssetGroupAction({
        asset_group_id: result.id,
        asset_group_name: result.name,
        action_type: 'create',
        action_label: 'Grupo de Bem Criado',
        action_description: `Grupo "${result.name}" foi criado com código contábil ${result.accounting_code}.`,
        item_id: result.id,
        item_name: result.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          accounting_code: result.accounting_code,
          depreciation_applicable: result.depreciation_applicable,
          qrcode_label: result.qrcode_label,
          manual_control: result.manual_control,
          description: result.description,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return result;
  },

  // Atualizar grupo de bem
  async updateAssetGroup(id: number, data: AssetGroupUpdate): Promise<AssetGroup> {
    // Buscar dados antigos para comparação
    const oldGroup = await this.getAssetGroupById(id);
    
    const { data: result, error } = await (supabase as any)
      .from('m_ast_t_asset_group')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // Verificar se é erro de constraint unique
      if (error.code === '23505') {
        if (error.message.includes('name')) {
          throw new Error('Já existe um grupo de bem cadastrado com este nome');
        }
        throw new Error('Já existe um grupo de bem com estes dados');
      }
      
      console.error('Erro ao atualizar grupo de bem:', error);
      throw new Error('Erro ao atualizar grupo de bem');
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      
      // Identificar campos alterados
      const changes: string[] = [];
      const oldValues: Record<string, any> = {};
      const newValues: Record<string, any> = {};

      if (oldGroup) {
        if (data.name !== undefined && data.name !== oldGroup.name) {
          changes.push('nome');
          oldValues.name = oldGroup.name;
          newValues.name = data.name;
        }
        if (data.accounting_code !== undefined && data.accounting_code !== oldGroup.accounting_code) {
          changes.push('código contábil');
          oldValues.accounting_code = oldGroup.accounting_code;
          newValues.accounting_code = data.accounting_code;
        }
        if (data.is_depreciable !== undefined && data.is_depreciable !== oldGroup.is_depreciable) {
          changes.push('depreciável');
          oldValues.is_depreciable = oldGroup.is_depreciable;
          newValues.is_depreciable = data.is_depreciable;
        }
        if (data.qr_code_required !== undefined && data.qr_code_required !== oldGroup.qr_code_required) {
          changes.push('QR Code obrigatório');
          oldValues.qr_code_required = oldGroup.qr_code_required;
          newValues.qr_code_required = data.qr_code_required;
        }
        if (data.licensable_vehicle !== undefined && data.licensable_vehicle !== oldGroup.licensable_vehicle) {
          changes.push('veículo licenciável');
          oldValues.licensable_vehicle = oldGroup.licensable_vehicle;
          newValues.licensable_vehicle = data.licensable_vehicle;
        }
        if (data.vehicle_type !== undefined && data.vehicle_type !== oldGroup.vehicle_type) {
          changes.push('tipo de veículo');
          oldValues.vehicle_type = oldGroup.vehicle_type;
          newValues.vehicle_type = data.vehicle_type;
        }
        if (data.annual_depreciation_rate !== undefined && data.annual_depreciation_rate !== oldGroup.annual_depreciation_rate) {
          changes.push('taxa de depreciação anual');
          oldValues.annual_depreciation_rate = oldGroup.annual_depreciation_rate;
          newValues.annual_depreciation_rate = data.annual_depreciation_rate;
        }
        if (data.monthly_depreciation_rate !== undefined && data.monthly_depreciation_rate !== oldGroup.monthly_depreciation_rate) {
          changes.push('taxa de depreciação mensal');
          oldValues.monthly_depreciation_rate = oldGroup.monthly_depreciation_rate;
          newValues.monthly_depreciation_rate = data.monthly_depreciation_rate;
        }
        if (data.useful_life !== undefined && data.useful_life !== oldGroup.useful_life) {
          changes.push('vida útil');
          oldValues.useful_life = oldGroup.useful_life;
          newValues.useful_life = data.useful_life;
        }
        if (data.residual_value !== undefined && data.residual_value !== oldGroup.residual_value) {
          changes.push('valor residual');
          oldValues.residual_value = oldGroup.residual_value;
          newValues.residual_value = data.residual_value;
        }
      }
      
      await logAssetGroupAction({
        asset_group_id: result.id,
        asset_group_name: result.name,
        action_type: 'edit',
        action_label: 'editou o grupo de bem',
        action_description: changes.length > 0 
          ? `Campos editados: ${changes.join(', ')}.`
          : 'Dados do grupo de bem foram atualizados.',
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
  async toggleAssetGroupStatus(id: number): Promise<AssetGroup> {
    // Primeiro buscar o estado atual
    const current = await this.getAssetGroupById(id);
    if (!current) {
      throw new Error('Grupo de bem não encontrado');
    }

    // Inverter o status
    const newStatus = !current.is_deleted;
    
    const { data: result, error } = await (supabase as any)
      .from('m_ast_t_asset_group')
      .update({ is_deleted: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao alterar status do grupo de bem:', error);
      throw new Error('Erro ao alterar status do grupo de bem');
    }

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      const action = newStatus ? 'deactivate' : 'activate';
      const actionLabel = newStatus ? 'inativou o grupo de bem' : 'ativou o grupo de bem';
      const actionDescription = newStatus 
        ? `O grupo de bem foi inativado.`
        : `O grupo de bem foi ativado.`;
      
      await logAssetGroupAction({
        asset_group_id: result.id,
        asset_group_name: result.name,
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
