import { supabase } from "@/integrations/supabase/client";

export interface UserAuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar_url?: string;
  action_type: 'create' | 'edit' | 'activate' | 'deactivate' | 'profile_change' | 'delete';
  action_label: string;
  action_description: string;
  item_type: string;
  item_id: string;
  item_name?: string;
  performed_by?: string;
  performed_by_name?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface LogUserActionInput {
  user_id: string;
  user_name: string;
  user_avatar_url?: string;
  action_type: 'create' | 'edit' | 'activate' | 'deactivate' | 'profile_change' | 'delete';
  action_label: string;
  action_description: string;
  item_type?: string;
  item_id: string;
  item_name?: string;
  performed_by?: string;
  performed_by_name?: string;
  metadata?: Record<string, any>;
}

export const logUserAction = async (input: LogUserActionInput): Promise<void> => {
  try {
    console.log('🔍 [AUDIT] Tentando registrar ação:', {
      action_type: input.action_type,
      action_label: input.action_label,
      user_id: input.user_id,
      item_id: input.item_id,
      performed_by: input.performed_by,
    });

    const auditData = {
      item_type: 'Usuario',
      item_id: input.user_id,
      item_name: input.user_name,
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      performed_by: input.performed_by,
      performed_by_name: input.performed_by_name,
      metadata: input.metadata || {},
    };

    console.log('📝 [AUDIT] Dados a serem inseridos:', JSON.stringify(auditData, null, 2));

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_audit_configs_log')
      .insert(auditData)
      .select();

    if (error) {
      console.error('❌ [AUDIT] Erro ao registrar ação:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      // NÃO lançar erro - apenas logar
      return;
    }

    console.log('✅ [AUDIT] Ação registrada com sucesso:', data);
  } catch (error) {
    console.error('❌ [AUDIT] Falha crítica ao registrar ação:', error);
    // NÃO lançar erro - apenas logar
  }
};

export const getUserAuditLog = async (userId: string): Promise<UserAuditLog[]> => {
  try {
    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_audit_configs_log')
      .select('*')
      .eq('item_type', 'Usuario')
      .eq('item_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user audit log:', error);
      throw error;
    }

    return (data || []).map(log => ({
      id: log.id,
      user_id: log.item_id,
      user_name: log.item_name || '',
      user_avatar_url: undefined,
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
    console.error('Failed to fetch user audit log:', error);
    return [];
  }
};

export const getAllAuditLogs = async (): Promise<UserAuditLog[]> => {
  try {
    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_audit_configs_log')
      .select('*')
      .eq('item_type', 'Usuario')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all user audit logs:', error);
      throw error;
    }

    return (data || []).map(log => ({
      id: log.id,
      user_id: log.item_id,
      user_name: log.item_name || '',
      user_avatar_url: undefined,
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
    console.error('Failed to fetch all user audit logs:', error);
    return [];
  }
};
