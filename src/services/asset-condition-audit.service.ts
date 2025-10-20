import { supabase } from '@/integrations/supabase/client';

export interface AssetConditionAuditLog {
  id: string;
  asset_condition_id: number;
  asset_condition_name: string;
  action_type: 'create' | 'edit' | 'activate' | 'deactivate';
  action_label: string;
  action_description: string;
  item_type: string;
  item_id: number;
  item_name?: string;
  performed_by?: string;
  performed_by_name?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface LogAssetConditionActionInput {
  asset_condition_id: number;
  asset_condition_name: string;
  action_type: 'create' | 'edit' | 'activate' | 'deactivate';
  action_label: string;
  action_description: string;
  item_id: number;
  item_name?: string;
  performed_by?: string | null;
  performed_by_name?: string;
  metadata?: Record<string, any>;
}

export const logAssetConditionAction = async (input: LogAssetConditionActionInput): Promise<void> => {
  try {
    console.log('🔍 [ASSET CONDITION AUDIT] Tentando registrar ação:', {
      action_type: input.action_type,
      action_label: input.action_label,
      asset_condition_id: input.asset_condition_id,
      item_id: input.item_id,
      performed_by: input.performed_by,
    });

    const auditData = {
      item_type: 'AssetCondition',
      item_id: input.asset_condition_id,
      item_name: input.asset_condition_name,
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      performed_by: input.performed_by,
      performed_by_name: input.performed_by_name,
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : {},
    };

    // Validar dados obrigatórios
    if (!auditData.item_id) {
      console.error('❌ [ASSET CONDITION AUDIT] item_id é obrigatório mas está undefined/null');
      return;
    }

    if (!auditData.action_type || !auditData.action_label) {
      console.error('❌ [ASSET CONDITION AUDIT] action_type e action_label são obrigatórios');
      return;
    }

    console.log('✅ [ASSET CONDITION AUDIT] Validação de dados passou');
    console.log('📝 [ASSET CONDITION AUDIT] Dados a serem inseridos:', JSON.stringify(auditData, null, 2));

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_asset_condition')
      .insert(auditData)
      .select();

    if (error) {
      console.error('❌ [ASSET CONDITION AUDIT] Erro ao registrar ação:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return;
    }

    console.log('✅ [ASSET CONDITION AUDIT] Ação registrada com sucesso:', data);
  } catch (error) {
    console.error('❌ [ASSET CONDITION AUDIT] Falha crítica ao registrar ação:', error);
  }
};

export const getAssetConditionAuditLog = async (assetConditionId: number): Promise<AssetConditionAuditLog[]> => {
  try {
    console.log('🔍 [ASSET CONDITION AUDIT] Buscando logs para estado de conservação:', assetConditionId);

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_asset_condition')
      .select('*')
      .eq('item_type', 'AssetCondition')
      .eq('item_id', assetConditionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [ASSET CONDITION AUDIT] Erro ao buscar logs:', {
        error,
        code: error.code,
        message: error.message,
      });
      throw error;
    }

    console.log('✅ [ASSET CONDITION AUDIT] Logs recuperados:', data?.length || 0);

    return (data || []).map(log => ({
      id: log.id.toString(),
      asset_condition_id: log.item_id,
      asset_condition_name: log.item_name || '',
      action_type: log.action_type,
      action_label: log.action_label,
      action_description: log.action_description,
      item_type: log.item_type,
      item_id: log.item_id,
      item_name: log.item_name,
      performed_by: log.performed_by,
      performed_by_name: log.performed_by_name,
      metadata: log.metadata,
      created_at: log.created_at,
    }));
  } catch (error) {
    console.error('❌ [ASSET CONDITION AUDIT] Falha ao buscar logs:', error);
    return [];
  }
};
