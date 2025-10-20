import { supabase } from '@/integrations/supabase/client';

export interface AssetGroupAuditLog {
  id: string;
  asset_group_id: number;
  asset_group_name: string;
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

export interface LogAssetGroupActionInput {
  asset_group_id: number;
  asset_group_name: string;
  action_type: 'create' | 'edit' | 'activate' | 'deactivate';
  action_label: string;
  action_description: string;
  item_id: number;
  item_name?: string;
  performed_by?: string | null;
  performed_by_name?: string;
  metadata?: Record<string, any>;
}

/**
 * Registra uma ação de auditoria para grupo de bem
 */
export const logAssetGroupAction = async (input: LogAssetGroupActionInput): Promise<void> => {
  try {
    console.log('[ASSET GROUP AUDIT] Registrando ação:', {
      action_type: input.action_type,
      item_id: input.item_id,
      item_name: input.item_name,
    });

    // Validar dados obrigatórios
    if (!input.item_id || !input.action_type || !input.action_label) {
      console.error('[ASSET GROUP AUDIT] Dados obrigatórios ausentes:', input);
      return;
    }

    // Serializar metadata para garantir JSON válido
    const serializedMetadata = input.metadata 
      ? JSON.parse(JSON.stringify(input.metadata))
      : {};

    const logData = {
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      item_type: 'AssetGroup',
      item_id: input.item_id,
      item_name: input.item_name || input.asset_group_name,
      performed_by: input.performed_by || null,
      performed_by_name: input.performed_by_name || 'Sistema',
      metadata: serializedMetadata,
    };

    const { error } = await (supabase as any)
      .from('m_log_t_asset_group')
      .insert([logData]);

    if (error) {
      console.error('[ASSET GROUP AUDIT] Erro ao inserir log:', error);
    } else {
      console.log('[ASSET GROUP AUDIT] Log registrado com sucesso:', {
        action_type: input.action_type,
        item_id: input.item_id,
      });
    }
  } catch (error) {
    console.error('[ASSET GROUP AUDIT] Exceção ao registrar log:', error);
  }
};

/**
 * Busca o histórico de auditoria de um grupo de bem específico
 */
export const getAssetGroupAuditLog = async (assetGroupId: number): Promise<AssetGroupAuditLog[]> => {
  try {
    console.log('[ASSET GROUP AUDIT] Buscando histórico para grupo:', assetGroupId);

    const { data, error } = await (supabase as any)
      .from('m_log_t_asset_group')
      .select('*')
      .eq('item_type', 'AssetGroup')
      .eq('item_id', assetGroupId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[ASSET GROUP AUDIT] Erro ao buscar histórico:', error);
      return [];
    }

    console.log('[ASSET GROUP AUDIT] Histórico encontrado:', data?.length || 0, 'registros');
    return data || [];
  } catch (error) {
    console.error('[ASSET GROUP AUDIT] Exceção ao buscar histórico:', error);
    return [];
  }
};
