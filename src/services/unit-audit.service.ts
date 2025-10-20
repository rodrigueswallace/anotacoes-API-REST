import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/lib/auth-helpers';

export interface UnitAuditLog {
  id: string;
  unit_id: number;
  unit_name: string;
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

export interface LogUnitActionInput {
  unit_id: number;
  unit_name: string;
  action_type: 'create' | 'edit' | 'activate' | 'deactivate';
  action_label: string;
  action_description: string;
  performed_by?: string | null;
  performed_by_name?: string;
  metadata?: Record<string, any>;
}

/**
 * Registra uma ação de auditoria para unidades
 */
export const logUnitAction = async (input: LogUnitActionInput): Promise<void> => {
  try {
    console.log('🔍 [UNIT AUDIT] Tentando registrar ação:', {
      action_type: input.action_type,
      unit_id: input.unit_id,
      unit_name: input.unit_name,
    });

    // Se performed_by não foi fornecido, buscar usuário atual
    let performedBy = input.performed_by;
    let performedByName = input.performed_by_name;

    if (!performedBy) {
      const currentUser = await getCurrentUser();
      performedBy = currentUser?.id || null;
      performedByName = currentUser?.name || 'Sistema';
    }

    const auditData = {
      item_id: input.unit_id,
      item_name: input.unit_name,
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      performed_by: performedBy,
      performed_by_name: performedByName,
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : {},
    };

    console.log('📝 [UNIT AUDIT] Dados a serem inseridos:', auditData);

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_unit_log')
      .insert(auditData)
      .select()
      .single();

    if (error) {
      console.error('❌ [UNIT AUDIT] Erro ao registrar ação:', error);
      console.error('📦 [UNIT AUDIT] Payload que causou erro:', auditData);
      throw error;
    }

    console.log('✅ [UNIT AUDIT] Ação registrada com sucesso:', data);
  } catch (error) {
    console.error('❌ [UNIT AUDIT] Erro inesperado:', error);
    // Não lançar exceção para não interromper operações principais
  }
};

/**
 * Busca o histórico de auditoria de uma unidade
 */
export const getUnitAuditLog = async (unitId: number): Promise<UnitAuditLog[]> => {
  try {
    console.log('🔍 [UNIT AUDIT] Buscando logs para unidade ID:', unitId);

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_unit_log')
      .select('*')
      .eq('item_id', unitId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [UNIT AUDIT] Erro ao buscar logs:', error);
      throw error;
    }

    console.log(`✅ [UNIT AUDIT] ${data?.length || 0} logs encontrados`);

    return (data || []).map(log => ({
      id: log.id,
      unit_id: unitId,
      unit_name: log.item_name || '',
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
    console.error('❌ [UNIT AUDIT] Erro ao buscar histórico:', error);
    return [];
  }
};
