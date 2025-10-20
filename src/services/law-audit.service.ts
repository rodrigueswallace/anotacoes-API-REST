import { supabase } from '@/integrations/supabase/client';

export interface LawAuditLog {
  id: string;
  law_id: number;
  law_name: string;
  action_type: 'create' | 'edit' | 'activate' | 'deactivate';
  action_label: string;
  action_description: string;
  item_id: number;
  item_name?: string;
  performed_by?: string;
  performed_by_name?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface LogLawActionInput {
  law_id: number;
  law_name: string;
  action_type: 'create' | 'edit' | 'activate' | 'deactivate';
  action_label: string;
  action_description: string;
  item_id: number;
  item_name?: string;
  performed_by?: string | null;
  performed_by_name?: string;
  metadata?: Record<string, any>;
}

export const logLawAction = async (input: LogLawActionInput): Promise<void> => {
  try {
    console.log('🔍 [LAW AUDIT] Tentando registrar ação:', {
      action_type: input.action_type,
      action_label: input.action_label,
      law_id: input.law_id,
      item_id: input.item_id,
      performed_by: input.performed_by,
    });

    const auditData = {
      item_id: input.law_id,
      item_name: input.law_name,
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      performed_by: input.performed_by,
      performed_by_name: input.performed_by_name,
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : {},
    };

    // Validar dados obrigatórios
    if (!auditData.item_id) {
      console.error('❌ [LAW AUDIT] item_id é obrigatório mas está undefined/null');
      return;
    }

    if (!auditData.action_type || !auditData.action_label) {
      console.error('❌ [LAW AUDIT] action_type e action_label são obrigatórios');
      return;
    }

    console.log('✅ [LAW AUDIT] Validação de dados passou');
    console.log('📝 [LAW AUDIT] Dados a serem inseridos:', JSON.stringify(auditData, null, 2));

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_law_log')
      .insert(auditData)
      .select();

    if (error) {
      console.error('❌ [LAW AUDIT] Erro ao registrar ação:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return;
    }

    console.log('✅ [LAW AUDIT] Ação registrada com sucesso:', data);
  } catch (error) {
    console.error('❌ [LAW AUDIT] Falha crítica ao registrar ação:', error);
  }
};

export const getLawAuditLog = async (lawId: number): Promise<LawAuditLog[]> => {
  try {
    console.log('🔍 [LAW AUDIT] Buscando logs para lei:', lawId);

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_law_log')
      .select('*')
      .eq('item_id', lawId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [LAW AUDIT] Erro ao buscar logs:', {
        error,
        code: error.code,
        message: error.message,
      });
      throw error;
    }

    console.log('✅ [LAW AUDIT] Logs recuperados:', data?.length || 0);

    return (data || []).map(log => ({
      id: log.id.toString(),
      law_id: log.item_id,
      law_name: log.item_name || '',
      action_type: log.action_type,
      action_label: log.action_label,
      action_description: log.action_description,
      item_id: log.item_id,
      item_name: log.item_name,
      performed_by: log.performed_by,
      performed_by_name: log.performed_by_name,
      metadata: log.metadata,
      created_at: log.created_at,
    }));
  } catch (error) {
    console.error('❌ [LAW AUDIT] Falha ao buscar logs:', error);
    return [];
  }
};
