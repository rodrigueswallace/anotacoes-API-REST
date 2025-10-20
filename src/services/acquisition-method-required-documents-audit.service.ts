/**
 * Acquisition Method Required Document Audit Service
 * 
 * Gerencia logs de auditoria para documentos obrigatórios de métodos de aquisição.
 * Registra todas as operações CRUD e mudanças de status, fornecendo
 * trilha completa de auditoria de quem fez o quê e quando.
 * 
 * **Características Principais:**
 * - Registra ações: create, edit, activate, deactivate
 * - Armazena metadata sobre mudanças para trilha detalhada
 * - Filtra por item_type='AcquisitionMethodRequiredDocument' para distinguir de outros tipos
 * - Mantém referência ao método de aquisição pai
 * 
 * **Tabela do Banco**: `her.m_log_t_acquisition_method_required_document`
 * **Colunas Requeridas**: item_type, item_id, action_type, action_label, action_description
 * 
 * **Tipos de Ação:**
 * - `create`: Novo documento obrigatório criado
 * - `edit`: Informações do documento atualizadas
 * - `activate`: Status mudado para ativo (reativação após soft delete)
 * - `deactivate`: Status mudado para inativo (soft delete)
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Interface para logs de auditoria de documentos obrigatórios
 */
export interface AcquisitionMethodRequiredDocumentAuditLog {
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
 * Interface para input de log de auditoria
 */
export interface LogAcquisitionMethodRequiredDocumentActionInput {
  document_id: number;
  document_name: string;
  acquisition_method_id: number;
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
 * Registra uma ação de auditoria para documento obrigatório no banco de dados.
 * 
 * Esta função é **não bloqueante**: erros são logados mas não relançados,
 * garantindo que falhas no log não interrompam operações principais.
 * 
 * @param input - Dados da ação a ser registrada
 * @throws Não lança exceções - erros são apenas logados
 * 
 * @example
 * ```typescript
 * await logAcquisitionMethodRequiredDocumentAction({
 *   document_id: 1,
 *   document_name: 'Nota Fiscal',
 *   acquisition_method_id: 5,
 *   action_type: 'create',
 *   action_label: 'Documento Obrigatório Adicionado',
 *   action_description: 'Documento "Nota Fiscal" foi adicionado como obrigatório.',
 *   item_id: 1,
 *   item_name: 'Nota Fiscal',
 *   performed_by: 'uuid-user-id',
 *   performed_by_name: 'João Silva',
 *   metadata: {
 *     acquisition_method_id: 5,
 *     created_at: '2025-01-15T10:30:00Z'
 *   }
 * });
 * ```
 */
export async function logAcquisitionMethodRequiredDocumentAction(
  input: LogAcquisitionMethodRequiredDocumentActionInput
): Promise<void> {
  try {
    console.log('[ACQUISITION METHOD DOCUMENT AUDIT] 🔍 Tentando registrar ação de auditoria:', {
      document_id: input.document_id,
      document_name: input.document_name,
      acquisition_method_id: input.acquisition_method_id,
      action_type: input.action_type,
      action_label: input.action_label,
    });

    // Validação de dados obrigatórios
    if (!input.item_id) {
      console.error('[ACQUISITION METHOD DOCUMENT AUDIT] ❌ Erro: item_id é obrigatório');
      return;
    }
    if (!input.action_type) {
      console.error('[ACQUISITION METHOD DOCUMENT AUDIT] ❌ Erro: action_type é obrigatório');
      return;
    }
    if (!input.action_label) {
      console.error('[ACQUISITION METHOD DOCUMENT AUDIT] ❌ Erro: action_label é obrigatório');
      return;
    }

    // Serializar metadata corretamente (evita problemas com tipos não-JSON)
    const serializedMetadata = input.metadata 
      ? JSON.parse(JSON.stringify({
          ...input.metadata,
          acquisition_method_id: input.acquisition_method_id
        }))
      : { acquisition_method_id: input.acquisition_method_id };

    // Dados a serem inseridos
    const logData = {
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      item_type: 'AcquisitionMethodRequiredDocument', // Fixed value
      item_id: input.item_id,
      item_name: input.item_name || input.document_name,
      performed_by: input.performed_by,
      performed_by_name: input.performed_by_name || 'Sistema',
      metadata: serializedMetadata,
    };

    console.log('[ACQUISITION METHOD DOCUMENT AUDIT] 📝 Dados a serem inseridos:', JSON.stringify(logData, null, 2));

    // Inserir log na tabela
    const { data, error } = await (supabase as any)
      .from('m_log_t_acquisition_method_required_document')
      .insert([logData])
      .select()
      .single();

    if (error) {
      console.error('[ACQUISITION METHOD DOCUMENT AUDIT] ❌ Erro ao inserir log de auditoria:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return;
    }

    console.log('[ACQUISITION METHOD DOCUMENT AUDIT] ✅ Log de auditoria registrado com sucesso:', {
      id: data.id,
      action_type: data.action_type,
      action_label: data.action_label,
      item_id: data.item_id,
      performed_by_name: data.performed_by_name,
      created_at: data.created_at,
    });

  } catch (error) {
    console.error('[ACQUISITION METHOD DOCUMENT AUDIT] ⚠️ Erro inesperado ao registrar log de auditoria:', error);
  }
}

/**
 * Busca todos os logs de auditoria de documentos relacionados a um método de aquisição específico.
 * 
 * @param acquisitionMethodId - ID do método de aquisição
 * @returns Array de logs ordenados por data (mais recente primeiro)
 * 
 * @example
 * ```typescript
 * const logs = await getAcquisitionMethodRequiredDocumentAuditLogByMethodId(5);
 * console.log(`Total de logs: ${logs.length}`);
 * ```
 */
export async function getAcquisitionMethodRequiredDocumentAuditLogByMethodId(
  acquisitionMethodId: number
): Promise<AcquisitionMethodRequiredDocumentAuditLog[]> {
  try {
    console.log('[ACQUISITION METHOD DOCUMENT AUDIT] 🔍 Buscando histórico de documentos para método:', acquisitionMethodId);

    const { data, error } = await (supabase as any)
      .from('m_log_t_acquisition_method_required_document')
      .select('*')
      .eq('item_type', 'AcquisitionMethodRequiredDocument')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[ACQUISITION METHOD DOCUMENT AUDIT] ❌ Erro ao buscar logs de auditoria:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return [];
    }

    // Filtrar por acquisition_method_id no metadata
    const filtered = (data || []).filter((log: any) => {
      const methodId = log.metadata?.acquisition_method_id;
      return methodId === acquisitionMethodId || methodId === String(acquisitionMethodId);
    });

    console.log('[ACQUISITION METHOD DOCUMENT AUDIT] ✅ Logs de auditoria recuperados:', {
      total: filtered.length,
      acquisition_method_id: acquisitionMethodId,
    });

    return filtered.map((log: any) => ({
      id: log.id,
      document_id: log.item_id,
      document_name: log.item_name || '',
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
    console.error('[ACQUISITION METHOD DOCUMENT AUDIT] ⚠️ Erro inesperado ao buscar logs de auditoria:', error);
    return [];
  }
}
