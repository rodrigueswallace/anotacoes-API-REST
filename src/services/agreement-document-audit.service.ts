import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/lib/auth-helpers';

/**
 * Interface para log de auditoria de documentos de convênios
 */
export interface AgreementDocumentAuditLog {
  id: string;
  document_id: number;
  document_name: string;
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
 * Interface para entrada de log de ação em documentos de convênios
 */
export interface LogAgreementDocumentActionInput {
  document_id: number;
  document_name: string;
  agreement_id: number;
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
 * Registra uma ação de auditoria para um documento de convênio
 * @param input - Dados da ação a ser registrada
 */
export async function logAgreementDocumentAction(
  input: LogAgreementDocumentActionInput
): Promise<void> {
  try {
    console.log('[AGREEMENT DOCUMENT AUDIT] Tentando registrar ação de documento:', input.action_type);

    // Validar dados obrigatórios
    if (!input.item_id || !input.action_type || !input.action_label) {
      console.error('[AGREEMENT DOCUMENT AUDIT] Dados obrigatórios faltando:', {
        item_id: input.item_id,
        action_type: input.action_type,
        action_label: input.action_label,
      });
      return;
    }

    // Serializar metadata corretamente para JSON
    const serializedMetadata = input.metadata 
      ? JSON.parse(JSON.stringify(input.metadata))
      : {};

    const logEntry = {
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description || '',
      item_type: 'AgreementDocument',
      item_id: input.item_id,
      item_name: input.item_name || input.document_name,
      performed_by: input.performed_by || null,
      performed_by_name: input.performed_by_name || 'Sistema',
      metadata: serializedMetadata,
    };

    console.log('[AGREEMENT DOCUMENT AUDIT] Dados a serem inseridos:', JSON.stringify(logEntry, null, 2));

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_agreement_document')
      .insert(logEntry)
      .select()
      .single();

    if (error) {
      console.error('[AGREEMENT DOCUMENT AUDIT] Erro ao inserir log:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return;
    }

    console.log('[AGREEMENT DOCUMENT AUDIT] ✅ Log registrado com sucesso:', data);
  } catch (error) {
    console.error('[AGREEMENT DOCUMENT AUDIT] ❌ Exceção ao registrar log:', error);
    // Não relançar a exceção para não bloquear a operação principal
  }
}

/**
 * Busca logs de auditoria de documentos de um convênio específico
 * @param agreementId - ID do convênio
 * @returns Array de logs de auditoria
 */
export async function getAgreementDocumentAuditLogByAgreementId(
  agreementId: number
): Promise<AgreementDocumentAuditLog[]> {
  try {
    console.log('[AGREEMENT DOCUMENT AUDIT] Buscando logs para convênio ID:', agreementId);

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_agreement_document')
      .select('*')
      .eq('item_type', 'AgreementDocument')
      .or(`metadata->>agreement_id.eq.${agreementId},metadata->created_data->>agreement_id.eq.${agreementId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[AGREEMENT DOCUMENT AUDIT] Erro ao buscar logs:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return [];
    }

    console.log(`[AGREEMENT DOCUMENT AUDIT] ✅ ${data?.length || 0} logs encontrados para convênio ${agreementId}`);

    return data?.map(log => ({
      id: log.id.toString(),
      document_id: log.item_id,
      document_name: log.item_name || 'Documento',
      action_type: log.action_type as 'create' | 'edit' | 'activate' | 'deactivate',
      action_label: log.action_label,
      action_description: log.action_description || '',
      item_type: log.item_type,
      item_id: log.item_id,
      item_name: log.item_name,
      performed_by: log.performed_by,
      performed_by_name: log.performed_by_name,
      metadata: log.metadata,
      created_at: log.created_at,
    })) || [];
  } catch (error) {
    console.error('[AGREEMENT DOCUMENT AUDIT] ❌ Exceção ao buscar logs:', error);
    return [];
  }
}
