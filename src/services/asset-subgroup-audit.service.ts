/**
 * Asset Subgroup Audit Service
 * 
 * Gerencia logs de auditoria para subgrupos de bem (Asset Subgroups).
 * Registra todas as operações CRUD e mudanças de status, fornecendo
 * trilha completa de auditoria de quem fez o quê e quando.
 * 
 * **Características Principais:**
 * - Registra ações: create, edit, activate, deactivate
 * - Armazena metadata sobre mudanças para trilha detalhada
 * - Filtra por item_type='AssetSubgroup' para distinguir de outros tipos
 * - Mantém referência ao grupo pai (s_her_m_ast_t_asset_group_c_id)
 * 
 * **Tabela do Banco**: `her.m_log_t_asset_subgroup`
 * **Colunas Requeridas**: item_type, item_id, action_type, action_label, action_description
 * 
 * **Tipos de Ação:**
 * - `create`: Novo subgrupo de bem criado
 * - `edit`: Informações do subgrupo atualizadas
 * - `activate`: Status mudado para ativo
 * - `deactivate`: Status mudado para inativo
 */

import { supabase } from '@/integrations/supabase/client';

export interface AssetSubgroupAuditLog {
  id: string;
  asset_subgroup_id: number;
  asset_subgroup_name: string;
  action_type: 'create' | 'edit' | 'activate' | 'deactivate';
  action_label: string;
  action_description: string;
  item_type: string;
  item_id: number;
  item_name?: string;
  s_her_m_ast_t_asset_group_c_id?: number;
  performed_by?: string;
  performed_by_name?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface LogAssetSubgroupActionInput {
  asset_subgroup_id: number;
  asset_subgroup_name: string;
  asset_group_id: number;
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
 * Registra uma ação de auditoria para um subgrupo de bem
 * @param input Dados da ação a ser registrada
 * @throws Error se dados obrigatórios estiverem faltando
 */
export async function logAssetSubgroupAction(input: LogAssetSubgroupActionInput): Promise<void> {
  try {
    console.log('[ASSET SUBGROUP AUDIT] Tentando registrar ação de auditoria:', {
      action_type: input.action_type,
      item_id: input.item_id,
      item_name: input.item_name,
      asset_group_id: input.asset_group_id,
    });

    // Validar dados obrigatórios
    if (!input.item_id) {
      console.error('[ASSET SUBGROUP AUDIT] item_id é obrigatório');
      throw new Error('item_id é obrigatório para registrar log de auditoria');
    }

    if (!input.action_type) {
      console.error('[ASSET SUBGROUP AUDIT] action_type é obrigatório');
      throw new Error('action_type é obrigatório para registrar log de auditoria');
    }

    if (!input.action_label) {
      console.error('[ASSET SUBGROUP AUDIT] action_label é obrigatório');
      throw new Error('action_label é obrigatório para registrar log de auditoria');
    }

    // Serializar metadata para garantir formato JSON válido
    const serializedMetadata = input.metadata 
      ? JSON.parse(JSON.stringify(input.metadata))
      : {};

    const logData = {
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      item_type: 'AssetSubgroup',
      item_id: input.item_id,
      item_name: input.item_name,
      s_her_m_ast_t_asset_group_c_id: input.asset_group_id,
      performed_by: input.performed_by || null,
      performed_by_name: input.performed_by_name || 'Sistema',
      metadata: serializedMetadata,
    };

    console.log('[ASSET SUBGROUP AUDIT] Dados a serem inseridos:', JSON.stringify(logData, null, 2));

    const { data, error } = await supabase
      .from('m_log_t_asset_subgroup')
      .insert([logData])
      .select()
      .single();

    if (error) {
      console.error('[ASSET SUBGROUP AUDIT] Erro ao inserir log de auditoria:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log('[ASSET SUBGROUP AUDIT] Log de auditoria registrado com sucesso:', data);
  } catch (error) {
    console.error('[ASSET SUBGROUP AUDIT] Erro ao registrar log de auditoria:', error);
    // Não relançar exceção para não bloquear operação principal
  }
}

/**
 * Busca logs de auditoria para um subgrupo de bem específico
 * @param assetSubgroupId ID do subgrupo de bem
 * @returns Array de logs de auditoria ordenados por data (mais recente primeiro)
 */
export async function getAssetSubgroupAuditLog(assetSubgroupId: number): Promise<AssetSubgroupAuditLog[]> {
  try {
    console.log('[ASSET SUBGROUP AUDIT] Buscando logs de auditoria para subgrupo:', assetSubgroupId);

    const { data, error } = await supabase
      .from('m_log_t_asset_subgroup')
      .select('*')
      .eq('item_type', 'AssetSubgroup')
      .eq('item_id', assetSubgroupId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[ASSET SUBGROUP AUDIT] Erro ao buscar logs de auditoria:', error);
      return [];
    }

    console.log(`[ASSET SUBGROUP AUDIT] ${data?.length || 0} registros de auditoria encontrados`);
    return data || [];
  } catch (error) {
    console.error('[ASSET SUBGROUP AUDIT] Erro ao buscar logs de auditoria:', error);
    return [];
  }
}
