import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/lib/auth-helpers';

export interface CredentialingEntityAuditLog {
  id: string;
  entity_id: number;
  entity_name: string;
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

export interface LogCredentialingEntityActionInput {
  entity_id: number;
  entity_name: string;
  action_type: 'create' | 'edit' | 'activate' | 'deactivate';
  action_label: string;
  action_description: string;
  performed_by?: string | null;
  performed_by_name?: string;
  metadata?: Record<string, any>;
}

/**
 * Registra uma ação de auditoria para entidade credenciada
 */
export const logCredentialingEntityAction = async (
  input: LogCredentialingEntityActionInput
): Promise<void> => {
  try {
    console.log('🔍 [CREDENTIALING ENTITY AUDIT] Tentando registrar ação:', {
      entity_id: input.entity_id,
      entity_name: input.entity_name,
      action_type: input.action_type,
      action_label: input.action_label,
    });

    // Obter usuário atual se não foi fornecido
    let performedBy = input.performed_by;
    let performedByName = input.performed_by_name;

    if (!performedBy) {
      const currentUser = await getCurrentUser();
      performedBy = currentUser?.id || null;
      performedByName = currentUser?.name || 'Sistema';
    }

    // Validar campos obrigatórios
    if (!input.entity_id || !input.entity_name || !input.action_type || !input.action_label) {
      console.error('❌ [CREDENTIALING ENTITY AUDIT] Campos obrigatórios faltando:', input);
      return;
    }

    // Preparar dados para inserção (SEM item_type)
    const auditData = {
      item_id: input.entity_id,
      item_name: input.entity_name,
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      performed_by: performedBy,
      performed_by_name: performedByName,
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : {},
    };

    console.log('📝 [CREDENTIALING ENTITY AUDIT] Dados a serem inseridos:', auditData);

    // Inserir no banco
    const { error } = await supabase
      .from('m_log_t_credentialing_entity_log')
      .insert(auditData);

    if (error) {
      console.error('❌ [CREDENTIALING ENTITY AUDIT] Erro ao inserir:', error);
      return;
    }

    console.log('✅ [CREDENTIALING ENTITY AUDIT] Ação registrada com sucesso');
  } catch (error) {
    console.error('❌ [CREDENTIALING ENTITY AUDIT] Erro geral:', error);
  }
};

/**
 * Busca o histórico de auditoria de uma entidade credenciada
 */
export const getCredentialingEntityAuditLog = async (
  entityId: number
): Promise<CredentialingEntityAuditLog[]> => {
  try {
    console.log('🔍 [CREDENTIALING ENTITY AUDIT] Buscando histórico para entidade:', entityId);

    const { data, error } = await supabase
      .from('m_log_t_credentialing_entity_log')
      .select('*')
      .eq('item_id', entityId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [CREDENTIALING ENTITY AUDIT] Erro ao buscar histórico:', error);
      return [];
    }

    console.log(`✅ [CREDENTIALING ENTITY AUDIT] ${data?.length || 0} registros encontrados`);

    return (data || []).map((log: any) => ({
      id: log.id,
      entity_id: log.item_id,
      entity_name: log.item_name,
      action_type: log.action_type,
      action_label: log.action_label,
      action_description: log.action_description,
      item_id: log.item_id,
      item_name: log.item_name,
      performed_by: log.performed_by,
      performed_by_name: log.performed_by_name,
      metadata: log.metadata || {},
      created_at: log.created_at,
    }));
  } catch (error) {
    console.error('❌ [CREDENTIALING ENTITY AUDIT] Erro geral ao buscar histórico:', error);
    return [];
  }
};
