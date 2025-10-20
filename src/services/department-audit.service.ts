/**
 * Department Audit Service
 * 
 * This service manages audit logging for department (Setor) actions in the system.
 * It records all CRUD operations and status changes for departments, providing
 * a complete audit trail of who did what and when.
 * 
 * **Key Features:**
 * - Logs create, edit, activate, and deactivate actions
 * - Stores metadata about changes for detailed audit trails
 * - Filters by item_type='Setor' to distinguish from other entity types
 * 
 * **Database Table:** `her.m_log_t_department_log`
 * **Required Columns:** item_type, item_id, action_type, action_label, action_description
 * 
 * **Action Types:**
 * - `create`: New department created
 * - `edit`: Department information updated
 * - `activate`: Department status changed to active
 * - `deactivate`: Department status changed to inactive
 * 
 * @see {@link DepartmentAuditLog} for the audit log interface
 * @see {@link LogDepartmentActionInput} for logging action inputs
 */

import { supabase } from "@/integrations/supabase/client";

export interface DepartmentAuditLog {
  id: string;
  department_id: number;
  department_name: string;
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

export interface LogDepartmentActionInput {
  department_id: number;
  department_name: string;
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

export const logDepartmentAction = async (input: LogDepartmentActionInput): Promise<void> => {
  try {
    console.log('🔍 [DEPARTMENT AUDIT] Tentando registrar ação:', {
      action_type: input.action_type,
      action_label: input.action_label,
      department_id: input.department_id,
      item_id: input.item_id,
      performed_by: input.performed_by,
    });

    const auditData = {
      item_type: 'Setor',
      item_id: input.department_id,
      item_name: input.department_name,
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      performed_by: input.performed_by,
      performed_by_name: input.performed_by_name,
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : {},
    };

    // Validar dados obrigatórios
    if (!auditData.item_id) {
      console.error('❌ [DEPARTMENT AUDIT] item_id é obrigatório mas está undefined/null');
      return;
    }

    if (!auditData.action_type || !auditData.action_label) {
      console.error('❌ [DEPARTMENT AUDIT] action_type e action_label são obrigatórios');
      return;
    }

    console.log('✅ [DEPARTMENT AUDIT] Validação de dados passou');
    console.log('📝 [DEPARTMENT AUDIT] Dados a serem inseridos:', JSON.stringify(auditData, null, 2));

    const { data, error } = await supabase
      .from('m_log_t_department_log')
      .insert(auditData)
      .select();

    if (error) {
      console.error('❌ [DEPARTMENT AUDIT] Erro ao registrar ação:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return;
    }

    console.log('✅ [DEPARTMENT AUDIT] Ação registrada com sucesso:', data);
  } catch (error) {
    console.error('❌ [DEPARTMENT AUDIT] Falha crítica ao registrar ação:', error);
  }
};

export const getDepartmentAuditLog = async (departmentId: number): Promise<DepartmentAuditLog[]> => {
  try {
    console.log('🔍 [DEPARTMENT AUDIT] Buscando histórico de auditoria:', {
      departmentId,
      filter: { item_type: 'Setor', item_id: departmentId }
    });

    const { data, error } = await supabase
      .from('m_log_t_department_log')
      .select('*')
      .eq('item_type', 'Setor')
      .eq('item_id', departmentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [DEPARTMENT AUDIT] Erro ao buscar histórico:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        departmentId
      });
      throw error;
    }

    console.log(`✅ [DEPARTMENT AUDIT] Histórico recuperado: ${data?.length || 0} registros`);

    return (data || []).map(log => ({
      id: log.id.toString(),
      department_id: log.item_id,
      department_name: log.item_name || '',
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
    console.error('Failed to fetch department audit log:', error);
    return [];
  }
};

export const getAllDepartmentAuditLogs = async (): Promise<DepartmentAuditLog[]> => {
  try {
    console.log('🔍 [DEPARTMENT AUDIT] Buscando todos os históricos de auditoria:', {
      filter: { item_type: 'Setor' }
    });

    const { data, error } = await supabase
      .from('m_log_t_department_log')
      .select('*')
      .eq('item_type', 'Setor')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [DEPARTMENT AUDIT] Erro ao buscar todos os históricos:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log(`✅ [DEPARTMENT AUDIT] Total de históricos recuperados: ${data?.length || 0} registros`);

    return (data || []).map(log => ({
      id: log.id.toString(),
      department_id: log.item_id,
      department_name: log.item_name || '',
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
    console.error('Failed to fetch all department audit logs:', error);
    return [];
  }
};
