import { supabase } from '@/integrations/supabase/client';

export interface LawDocumentAuditLog {
  id: string;
  document_id: number;
  document_name: string;
  action_type: 'create' | 'edit' | 'activate' | 'deactivate';
  action_label: string;
  action_description: string;
  item_type: string;
  item_id: number;
  item_name?: string;
  law_id: number;
  performed_by?: string;
  performed_by_name?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface LogLawDocumentActionInput {
  document_id: number;
  document_name: string;
  law_id: number;
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
 * Registra uma ação de auditoria para documentos de leis aplicáveis.
 * Esta função não lança exceções para não bloquear operações principais.
 */
export const logLawDocumentAction = async (input: LogLawDocumentActionInput): Promise<void> => {
  try {
    console.log('🔍 [LAW DOCUMENT AUDIT] Tentando registrar ação:', {
      action_type: input.action_type,
      action_label: input.action_label,
      document_id: input.document_id,
      law_id: input.law_id,
      item_id: input.item_id,
      performed_by: input.performed_by,
    });

    const auditData = {
      item_type: 'LawDocument',
      item_id: input.document_id,
      item_name: input.document_name,
      s_her_m_leg_t_law_c_id: input.law_id,
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      performed_by: input.performed_by,
      performed_by_name: input.performed_by_name,
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : {},
    };

    // Validar dados obrigatórios
    if (!auditData.item_id) {
      console.error('❌ [LAW DOCUMENT AUDIT] item_id é obrigatório mas está undefined/null');
      return;
    }

    if (!auditData.action_type || !auditData.action_label) {
      console.error('❌ [LAW DOCUMENT AUDIT] action_type e action_label são obrigatórios');
      return;
    }

    if (!auditData.s_her_m_leg_t_law_c_id) {
      console.error('❌ [LAW DOCUMENT AUDIT] s_her_m_leg_t_law_c_id é obrigatório mas está undefined/null');
      return;
    }

    console.log('✅ [LAW DOCUMENT AUDIT] Validação de dados passou');
    console.log('📝 [LAW DOCUMENT AUDIT] Dados a serem inseridos:', JSON.stringify(auditData, null, 2));

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_law_document')
      .insert(auditData)
      .select();

    if (error) {
      console.error('❌ [LAW DOCUMENT AUDIT] Erro ao registrar ação:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return;
    }

    console.log('✅ [LAW DOCUMENT AUDIT] Ação registrada com sucesso:', data);
  } catch (error) {
    console.error('❌ [LAW DOCUMENT AUDIT] Falha crítica ao registrar ação:', error);
  }
};

/**
 * Busca o log de auditoria de todos os documentos de uma lei específica.
 * @param lawId - ID da lei
 * @returns Array de logs de auditoria de documentos
 */
export const getLawDocumentAuditLogByLawId = async (lawId: number): Promise<LawDocumentAuditLog[]> => {
  try {
    console.log('🔍 [LAW DOCUMENT AUDIT] Buscando logs para lei:', lawId);

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_law_document')
      .select('*')
      .eq('item_type', 'LawDocument')
      .eq('s_her_m_leg_t_law_c_id', lawId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [LAW DOCUMENT AUDIT] Erro ao buscar logs:', {
        error,
        code: error.code,
        message: error.message,
      });
      throw error;
    }

    console.log('✅ [LAW DOCUMENT AUDIT] Logs recuperados:', data?.length || 0);

    return (data || []).map(log => ({
      id: log.id.toString(),
      document_id: log.item_id,
      document_name: log.item_name || '',
      action_type: log.action_type,
      action_label: log.action_label,
      action_description: log.action_description,
      item_type: log.item_type,
      item_id: log.item_id,
      item_name: log.item_name,
      law_id: log.s_her_m_leg_t_law_c_id,
      performed_by: log.performed_by,
      performed_by_name: log.performed_by_name,
      metadata: log.metadata,
      created_at: log.created_at,
    }));
  } catch (error) {
    console.error('❌ [LAW DOCUMENT AUDIT] Falha ao buscar logs:', error);
    return [];
  }
};
