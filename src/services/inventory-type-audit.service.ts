/**
 * Inventory Type Audit Service
 * 
 * Gerencia logs de auditoria para tipos de inventário (Tipo de Inventário).
 * Registra todas as operações CRUD e mudanças de status, fornecendo
 * trilha completa de auditoria de quem fez o quê e quando.
 * 
 * **Características Principais:**
 * - Registra ações: create, edit, activate, deactivate
 * - Armazena metadata sobre mudanças para trilha detalhada
 * - Filtra por item_type='InventoryType' para distinguir de outros tipos
 * 
 * **Tabela do Banco**: `her.m_log_t_inventory_type`
 * **Colunas Requeridas**: item_type, item_id, action_type, action_label, action_description
 * 
 * **Tipos de Ação:**
 * - `create`: Novo tipo de inventário criado
 * - `edit`: Informações do tipo atualizadas
 * - `activate`: Status mudado para ativo
 * - `deactivate`: Status mudado para inativo
 */

import { supabase } from "@/integrations/supabase/client";

export interface InventoryTypeAuditLog {
  id: string;
  inventory_type_id: number;
  inventory_type_name: string;
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

export interface LogInventoryTypeActionInput {
  inventory_type_id: number;
  inventory_type_name: string;
  action_type: 'create' | 'edit' | 'activate' | 'deactivate';
  action_label: string;
  action_description: string;
  item_id: number;
  item_name?: string;
  performed_by?: string | null;
  performed_by_name?: string;
  metadata?: Record<string, any>;
}

export const logInventoryTypeAction = async (input: LogInventoryTypeActionInput): Promise<void> => {
  try {
    console.log('🔍 [INVENTORY TYPE AUDIT] Tentando registrar ação:', {
      action_type: input.action_type,
      action_label: input.action_label,
      inventory_type_id: input.inventory_type_id,
      item_id: input.item_id,
      performed_by: input.performed_by,
    });

    const auditData = {
      item_type: 'InventoryType',
      item_id: input.inventory_type_id,
      item_name: input.inventory_type_name,
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      performed_by: input.performed_by,
      performed_by_name: input.performed_by_name,
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : {},
    };

    // Validar dados obrigatórios
    if (!auditData.item_id) {
      console.error('❌ [INVENTORY TYPE AUDIT] item_id é obrigatório mas está undefined/null');
      return;
    }

    if (!auditData.action_type || !auditData.action_label) {
      console.error('❌ [INVENTORY TYPE AUDIT] action_type e action_label são obrigatórios');
      return;
    }

    console.log('✅ [INVENTORY TYPE AUDIT] Validação de dados passou');
    console.log('📝 [INVENTORY TYPE AUDIT] Dados a serem inseridos:', JSON.stringify(auditData, null, 2));

    const { data, error } = await supabase
      .from('m_log_t_inventory_type')
      .insert(auditData)
      .select();

    if (error) {
      console.error('❌ [INVENTORY TYPE AUDIT] Erro ao registrar ação:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return;
    }

    console.log('✅ [INVENTORY TYPE AUDIT] Ação registrada com sucesso:', data);
  } catch (error) {
    console.error('❌ [INVENTORY TYPE AUDIT] Falha crítica ao registrar ação:', error);
  }
};

export const getInventoryTypeAuditLog = async (inventoryTypeId: number): Promise<InventoryTypeAuditLog[]> => {
  try {
    console.log('🔍 [INVENTORY TYPE AUDIT] Buscando histórico de auditoria:', {
      inventoryTypeId,
      filter: { item_type: 'InventoryType', item_id: inventoryTypeId }
    });

    const { data, error } = await supabase
      .from('m_log_t_inventory_type')
      .select('*')
      .eq('item_type', 'InventoryType')
      .eq('item_id', inventoryTypeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [INVENTORY TYPE AUDIT] Erro ao buscar histórico:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        inventoryTypeId
      });
      throw error;
    }

    console.log(`✅ [INVENTORY TYPE AUDIT] Histórico recuperado: ${data?.length || 0} registros`);

    return (data || []).map(log => ({
      id: log.id.toString(),
      inventory_type_id: log.item_id,
      inventory_type_name: log.item_name || '',
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
    console.error('Failed to fetch inventory type audit log:', error);
    return [];
  }
};
