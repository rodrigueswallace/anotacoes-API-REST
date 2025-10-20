import { supabase } from "@/integrations/supabase/client";

export interface AreaAuditLog {
  id: string;
  area_id: number;
  area_name: string;
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

export interface LogAreaActionInput {
  area_id: number;
  area_name: string;
  action_type: 'create' | 'edit' | 'activate' | 'deactivate';
  action_label: string;
  action_description: string;
  item_type?: string;
  item_id: number;
  item_name?: string;
  performed_by?: string | null;
  performed_by_name?: string;
  metadata?: Record<string, any>;
}

export const logAreaAction = async (input: LogAreaActionInput): Promise<void> => {
  try {
    console.log('🔍 [AREA AUDIT] Tentando registrar ação:', {
      action_type: input.action_type,
      action_label: input.action_label,
      area_id: input.area_id,
      item_id: input.item_id,
      performed_by: input.performed_by,
    });

    const auditData = {
      item_type: 'Área',
      item_id: input.area_id,
      item_name: input.area_name,
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      performed_by: input.performed_by,
      performed_by_name: input.performed_by_name,
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : {},
    };

    // Validar dados obrigatórios
    if (!auditData.item_id) {
      console.error('❌ [AREA AUDIT] item_id é obrigatório mas está undefined/null');
      return;
    }

    if (!auditData.action_type || !auditData.action_label) {
      console.error('❌ [AREA AUDIT] action_type e action_label são obrigatórios');
      return;
    }

    console.log('✅ [AREA AUDIT] Validação de dados passou');
    console.log('📝 [AREA AUDIT] Dados a serem inseridos:', JSON.stringify(auditData, null, 2));

    const { data, error } = await supabase
      .from('m_log_t_area_log')
      .insert(auditData)
      .select();

    if (error) {
      console.error('❌ [AREA AUDIT] Erro ao registrar ação:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return;
    }

    console.log('✅ [AREA AUDIT] Ação registrada com sucesso:', data);
  } catch (error) {
    console.error('❌ [AREA AUDIT] Falha crítica ao registrar ação:', error);
  }
};

export const getAreaAuditLog = async (areaId: number): Promise<AreaAuditLog[]> => {
  try {
    const { data, error } = await supabase
      .from('m_log_t_area_log')
      .select('*')
      .eq('item_type', 'Área')
      .eq('item_id', areaId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching area audit log:', error);
      throw error;
    }

    return (data || []).map(log => ({
      id: log.id.toString(),
      area_id: log.item_id,
      area_name: log.item_name || '',
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
    console.error('Failed to fetch area audit log:', error);
    return [];
  }
};

export const getAllAreaAuditLogs = async (): Promise<AreaAuditLog[]> => {
  try {
    const { data, error } = await supabase
      .from('m_log_t_area_log')
      .select('*')
      .eq('item_type', 'Área')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all area audit logs:', error);
      throw error;
    }

    return (data || []).map(log => ({
      id: log.id.toString(),
      area_id: log.item_id,
      area_name: log.item_name || '',
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
    console.error('Failed to fetch all area audit logs:', error);
    return [];
  }
};
