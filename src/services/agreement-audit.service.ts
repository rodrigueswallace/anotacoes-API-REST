import { supabase } from '@/integrations/supabase/client';

/**
 * Interface para representar um log de auditoria de convênio
 */
export interface AgreementAuditLog {
  id: string;
  agreement_id: number;
  agreement_name: string;
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

/**
 * Interface para input de log de ação de convênio
 */
export interface LogAgreementActionInput {
  agreement_id: number;
  agreement_name: string;
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

/**
 * Registra uma ação de auditoria para convênio
 * Esta função é não bloqueante - erros são logados mas não relançados
 */
export const logAgreementAction = async (input: LogAgreementActionInput): Promise<void> => {
  try {
    console.log('🔍 [AGREEMENT AUDIT] Tentando registrar ação:', {
      action_type: input.action_type,
      action_label: input.action_label,
      agreement_id: input.agreement_id,
      item_id: input.item_id,
      performed_by: input.performed_by,
    });

    const auditData = {
      item_type: 'Agreement',
      item_id: input.agreement_id,
      item_name: input.agreement_name,
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      performed_by: input.performed_by,
      performed_by_name: input.performed_by_name,
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : {},
    };

    // Validar dados obrigatórios
    if (!auditData.item_id) {
      console.error('❌ [AGREEMENT AUDIT] item_id é obrigatório mas está undefined/null');
      return;
    }

    if (!auditData.action_type || !auditData.action_label) {
      console.error('❌ [AGREEMENT AUDIT] action_type e action_label são obrigatórios');
      return;
    }

    console.log('✅ [AGREEMENT AUDIT] Validação de dados passou');
    console.log('📝 [AGREEMENT AUDIT] Dados a serem inseridos:', JSON.stringify(auditData, null, 2));

    const { data, error } = await supabase
      .from('m_log_t_agreement')
      .insert(auditData)
      .select();

    if (error) {
      console.error('❌ [AGREEMENT AUDIT] Erro ao registrar ação:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return;
    }

    console.log('✅ [AGREEMENT AUDIT] Ação registrada com sucesso:', data);
  } catch (error) {
    console.error('❌ [AGREEMENT AUDIT] Falha crítica ao registrar ação:', error);
  }
};

/**
 * Busca todos os logs de auditoria de um convênio específico
 */
export const getAgreementAuditLog = async (agreementId: number): Promise<AgreementAuditLog[]> => {
  try {
    console.log('🔍 [AGREEMENT AUDIT] Buscando logs para convênio:', agreementId);

    const { data, error } = await supabase
      .from('m_log_t_agreement')
      .select('*')
      .eq('item_type', 'Agreement')
      .eq('item_id', agreementId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [AGREEMENT AUDIT] Erro ao buscar logs:', {
        error,
        code: error.code,
        message: error.message,
      });
      throw error;
    }

    console.log('✅ [AGREEMENT AUDIT] Logs recuperados:', data?.length || 0);

    return (data || []).map(log => ({
      id: log.id.toString(),
      agreement_id: log.item_id,
      agreement_name: log.item_name || '',
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
    console.error('❌ [AGREEMENT AUDIT] Falha ao buscar logs:', error);
    return [];
  }
};
