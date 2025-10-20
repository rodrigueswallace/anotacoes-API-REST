/**
 * Acquisition Method Audit Service
 * 
 * Gerencia logs de auditoria para métodos de aquisição (Acquisition Methods).
 * Registra todas as operações CRUD e mudanças de status, fornecendo
 * trilha completa de auditoria de quem fez o quê e quando.
 * 
 * **Características Principais:**
 * - Registra ações: create, edit, activate, deactivate
 * - Armazena metadata sobre mudanças para trilha detalhada
 * - Filtra por item_type='AcquisitionMethod' para distinguir de outros tipos
 * 
 * **Tabela do Banco**: `her.m_log_t_acquisition_method`
 * **Colunas Requeridas**: item_type, item_id, action_type, action_label, action_description
 * 
 * **Tipos de Ação:**
 * - `create`: Novo método de aquisição criado
 * - `edit`: Informações do método atualizadas
 * - `activate`: Status mudado para ativo
 * - `deactivate`: Status mudado para inativo
 */

import { supabase } from '@/integrations/supabase/client';

export interface AcquisitionMethodAuditLog {
  id: string;
  acquisition_method_id: number;
  acquisition_method_name: string;
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

export interface LogAcquisitionMethodActionInput {
  acquisition_method_id: number;
  acquisition_method_name: string;
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
 * Registra uma ação de auditoria para métodos de aquisição
 * 
 * @param input - Dados da ação a ser registrada
 * @returns Promise<void>
 * 
 * @example
 * ```typescript
 * await logAcquisitionMethodAction({
 *   acquisition_method_id: 123,
 *   acquisition_method_name: "Compra Direta",
 *   action_type: 'create',
 *   action_label: 'Método de Aquisição Criado',
 *   action_description: 'Método "Compra Direta" foi criado no sistema.',
 *   item_id: 123,
 *   item_name: 'Compra Direta',
 *   performed_by: 'uuid-do-usuario',
 *   performed_by_name: 'João Silva',
 *   metadata: { code: 'CD01', requires_attachment: true }
 * });
 * ```
 */
export async function logAcquisitionMethodAction(input: LogAcquisitionMethodActionInput): Promise<void> {
  try {
    console.log('[ACQUISITION METHOD AUDIT] 🔍 Tentando registrar ação de auditoria:', {
      action_type: input.action_type,
      item_id: input.item_id,
      item_name: input.item_name,
      performed_by: input.performed_by,
    });

    // Validação de dados obrigatórios
    if (!input.item_id || !input.action_type || !input.action_label) {
      console.error('[ACQUISITION METHOD AUDIT] ❌ Dados obrigatórios faltando:', input);
      throw new Error('item_id, action_type e action_label são obrigatórios');
    }

    // Serializar metadata para garantir formato JSON válido
    const serializedMetadata = input.metadata 
      ? JSON.parse(JSON.stringify(input.metadata))
      : {};

    const logData = {
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      item_type: 'AcquisitionMethod',
      item_id: input.item_id,
      item_name: input.item_name || input.acquisition_method_name,
      performed_by: input.performed_by,
      performed_by_name: input.performed_by_name || 'Sistema',
      metadata: serializedMetadata,
    };

    console.log('[ACQUISITION METHOD AUDIT] 📝 Dados a serem inseridos:', JSON.stringify(logData, null, 2));

    const { data, error } = await (supabase as any)
      .from('m_log_t_acquisition_method')
      .insert([logData])
      .select()
      .single();

    if (error) {
      console.error('[ACQUISITION METHOD AUDIT] ❌ Erro ao inserir log de auditoria:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log('[ACQUISITION METHOD AUDIT] ✅ Log de auditoria registrado com sucesso:', data);
  } catch (error) {
    console.error('[ACQUISITION METHOD AUDIT] ⚠️ Erro ao registrar log (não bloqueante):', error);
    // Não relançar o erro para não bloquear operações principais
  }
}

/**
 * Busca logs de auditoria de um método de aquisição específico
 * 
 * @param acquisitionMethodId - ID do método de aquisição
 * @returns Promise<AcquisitionMethodAuditLog[]>
 * 
 * @example
 * ```typescript
 * const logs = await getAcquisitionMethodAuditLog(123);
 * console.log(`Encontrados ${logs.length} registros de auditoria`);
 * ```
 */
export async function getAcquisitionMethodAuditLog(acquisitionMethodId: number): Promise<AcquisitionMethodAuditLog[]> {
  try {
    console.log('[ACQUISITION METHOD AUDIT] 🔍 Buscando logs de auditoria para método de aquisição:', acquisitionMethodId);

    const { data, error } = await (supabase as any)
      .from('m_log_t_acquisition_method')
      .select('*')
      .eq('item_type', 'AcquisitionMethod')
      .eq('item_id', acquisitionMethodId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[ACQUISITION METHOD AUDIT] ❌ Erro ao buscar logs de auditoria:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log(`[ACQUISITION METHOD AUDIT] ✅ ${data?.length || 0} registros de auditoria encontrados`);
    return data || [];
  } catch (error) {
    console.error('[ACQUISITION METHOD AUDIT] ⚠️ Erro ao buscar logs (retornando array vazio):', error);
    return [];
  }
}
