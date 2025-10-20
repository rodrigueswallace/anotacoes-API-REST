import { supabase } from '@/integrations/supabase/client';

// Interface para o log de auditoria de órgãos
export interface AgencyAuditLog {
  id: string;
  agency_id: number;
  agency_name: string;
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

// Interface para o input de registro de ação
export interface LogAgencyActionInput {
  agency_id: number;
  agency_name: string;
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
 * Registra uma ação de auditoria para um órgão
 */
export const logAgencyAction = async (input: LogAgencyActionInput): Promise<void> => {
  try {
    console.log('🔍 [AGENCY AUDIT] Tentando registrar ação:', {
      action_type: input.action_type,
      action_label: input.action_label,
      agency_id: input.agency_id,
      item_id: input.item_id,
      performed_by: input.performed_by,
    });

    const auditData = {
      item_id: input.agency_id,
      item_name: input.agency_name,
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      performed_by: input.performed_by,
      performed_by_name: input.performed_by_name,
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : {},
    };

    // Validar dados obrigatórios
    if (!auditData.item_id) {
      console.error('❌ [AGENCY AUDIT] item_id é obrigatório mas está undefined/null');
      return;
    }

    if (!auditData.action_type || !auditData.action_label) {
      console.error('❌ [AGENCY AUDIT] action_type e action_label são obrigatórios');
      return;
    }

    console.log('✅ [AGENCY AUDIT] Validação de dados passou');
    console.log('📝 [AGENCY AUDIT] Dados a serem inseridos:', JSON.stringify(auditData, null, 2));

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_agency_log')
      .insert(auditData)
      .select();

    if (error) {
      console.error('❌ [AGENCY AUDIT] Erro ao registrar ação:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return;
    }

    console.log('✅ [AGENCY AUDIT] Ação registrada com sucesso:', data);
  } catch (error) {
    console.error('❌ [AGENCY AUDIT] Falha crítica ao registrar ação:', error);
  }
};

/**
 * Busca o histórico de auditoria de um órgão específico
 */
export const getAgencyAuditLog = async (agencyId: number): Promise<AgencyAuditLog[]> => {
  try {
    console.log('🔍 [AGENCY AUDIT] Buscando logs para órgão:', agencyId);

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_agency_log')
      .select('*')
      .eq('item_id', agencyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [AGENCY AUDIT] Erro ao buscar logs:', {
        error,
        code: error.code,
        message: error.message,
      });
      throw error;
    }

    console.log('✅ [AGENCY AUDIT] Logs recuperados:', data?.length || 0);

    return (data || []).map(log => ({
      id: log.id.toString(),
      agency_id: log.item_id,
      agency_name: log.item_name || '',
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
    console.error('❌ [AGENCY AUDIT] Falha ao buscar logs:', error);
    return [];
  }
};
