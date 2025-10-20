import { supabase } from '@/integrations/supabase/client';

export interface ExternalPartyAuditLog {
  id: string;
  external_party_id: number;
  external_party_name: string;
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

export interface LogExternalPartyActionInput {
  external_party_id: number;
  external_party_name: string;
  action_type: 'create' | 'edit' | 'activate' | 'deactivate';
  action_label: string;
  action_description: string;
  item_id: number;
  item_name?: string;
  performed_by?: string | null;
  performed_by_name?: string;
  metadata?: Record<string, any>;
}

export interface ExternalPartyAddressAuditLog {
  id: string;
  address_id: number;
  address_description: string;
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

export interface LogExternalPartyAddressActionInput {
  address_id: number;
  address_description: string;
  external_party_id: number;
  external_party_name: string;
  action_type: 'create' | 'edit' | 'activate' | 'deactivate';
  action_label: string;
  action_description: string;
  item_name?: string;
  performed_by?: string | null;
  performed_by_name?: string;
  metadata?: Record<string, any>;
}

/**
 * Registra uma ação no log de auditoria de fornecedores/terceiros
 */
export const logExternalPartyAction = async (input: LogExternalPartyActionInput): Promise<void> => {
  try {
    console.log('🔍 [EXTERNAL PARTY AUDIT] Tentando registrar ação:', {
      action_type: input.action_type,
      action_label: input.action_label,
      external_party_id: input.external_party_id,
      item_id: input.item_id,
      performed_by: input.performed_by,
    });

    const auditData = {
      item_type: 'ExternalParty',
      item_id: input.external_party_id,
      item_name: input.external_party_name,
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      performed_by: input.performed_by,
      performed_by_name: input.performed_by_name,
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : {},
    };

    // Validar dados obrigatórios
    if (!auditData.item_id) {
      console.error('❌ [EXTERNAL PARTY AUDIT] item_id é obrigatório mas está undefined/null');
      return;
    }

    if (!auditData.action_type || !auditData.action_label) {
      console.error('❌ [EXTERNAL PARTY AUDIT] action_type e action_label são obrigatórios');
      return;
    }

    console.log('✅ [EXTERNAL PARTY AUDIT] Validação de dados passou');
    console.log('📝 [EXTERNAL PARTY AUDIT] Dados a serem inseridos:', JSON.stringify(auditData, null, 2));

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_external_party')
      .insert(auditData)
      .select();

    if (error) {
      console.error('❌ [EXTERNAL PARTY AUDIT] Erro ao registrar ação:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return;
    }

    console.log('✅ [EXTERNAL PARTY AUDIT] Ação registrada com sucesso:', data);
  } catch (error) {
    console.error('❌ [EXTERNAL PARTY AUDIT] Falha crítica ao registrar ação:', error);
  }
};

/**
 * Busca o histórico de auditoria de um fornecedor/terceiro específico
 */
export const getExternalPartyAuditLog = async (externalPartyId: number): Promise<ExternalPartyAuditLog[]> => {
  try {
    console.log('🔍 [EXTERNAL PARTY AUDIT] Buscando logs para fornecedor/terceiro:', externalPartyId);

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_external_party')
      .select('*')
      .eq('item_type', 'ExternalParty')
      .eq('item_id', externalPartyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [EXTERNAL PARTY AUDIT] Erro ao buscar logs:', {
        error,
        code: error.code,
        message: error.message,
      });
      throw error;
    }

    console.log('✅ [EXTERNAL PARTY AUDIT] Logs recuperados:', data?.length || 0);

    return (data || []).map(log => ({
      id: log.id.toString(),
      external_party_id: log.item_id,
      external_party_name: log.item_name || '',
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
    console.error('❌ [EXTERNAL PARTY AUDIT] Falha ao buscar logs:', error);
    return [];
  }
};

/**
 * Registra uma ação no log de auditoria de endereços de fornecedores/terceiros
 */
export const logExternalPartyAddressAction = async (
  input: LogExternalPartyAddressActionInput
): Promise<void> => {
  try {
    console.log('🔍 [EXTERNAL PARTY ADDRESS AUDIT] Tentando registrar ação:', {
      action_type: input.action_type,
      action_label: input.action_label,
      address_id: input.address_id,
      external_party_id: input.external_party_id,
      performed_by: input.performed_by,
    });

    const auditData = {
      item_type: 'ExternalPartyAddress',
      item_id: input.address_id,
      item_name: input.item_name || input.address_description,
      action_type: input.action_type,
      action_label: input.action_label,
      action_description: input.action_description,
      performed_by: input.performed_by,
      performed_by_name: input.performed_by_name,
      metadata: input.metadata ? JSON.parse(JSON.stringify({
        ...input.metadata,
        external_party_id: input.external_party_id,
        external_party_name: input.external_party_name,
      })) : {
        external_party_id: input.external_party_id,
        external_party_name: input.external_party_name,
      },
    };

    // Validar dados obrigatórios
    if (!auditData.item_id) {
      console.error('❌ [EXTERNAL PARTY ADDRESS AUDIT] item_id (address_id) é obrigatório');
      return;
    }

    if (!auditData.action_type || !auditData.action_label) {
      console.error('❌ [EXTERNAL PARTY ADDRESS AUDIT] action_type e action_label são obrigatórios');
      return;
    }

    console.log('✅ [EXTERNAL PARTY ADDRESS AUDIT] Validação de dados passou');
    console.log('📝 [EXTERNAL PARTY ADDRESS AUDIT] Dados a serem inseridos:', JSON.stringify(auditData, null, 2));

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_external_party_address')
      .insert(auditData)
      .select();

    if (error) {
      console.error('❌ [EXTERNAL PARTY ADDRESS AUDIT] Erro ao registrar ação:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return;
    }

    console.log('✅ [EXTERNAL PARTY ADDRESS AUDIT] Ação registrada com sucesso:', data);
  } catch (error) {
    console.error('❌ [EXTERNAL PARTY ADDRESS AUDIT] Falha crítica ao registrar ação:', error);
  }
};

/**
 * Busca o histórico de auditoria de endereços de um fornecedor/terceiro específico
 */
export const getExternalPartyAddressAuditLog = async (
  externalPartyId: number
): Promise<ExternalPartyAddressAuditLog[]> => {
  try {
    console.log('🔍 [EXTERNAL PARTY ADDRESS AUDIT] Buscando logs de endereços para fornecedor:', externalPartyId);

    const { data, error } = await supabase
      .schema('her')
      .from('m_log_t_external_party_address')
      .select('*')
      .eq('item_type', 'ExternalPartyAddress')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [EXTERNAL PARTY ADDRESS AUDIT] Erro ao buscar logs:', {
        error,
        code: error.code,
        message: error.message,
      });
      throw error;
    }

    // Filtrar logs que pertencem ao fornecedor específico via metadata
    const filteredData = (data || []).filter(log => {
      const metadata = log.metadata as any;
      return metadata?.external_party_id === externalPartyId;
    });

    console.log('✅ [EXTERNAL PARTY ADDRESS AUDIT] Logs recuperados:', filteredData.length);

    return filteredData.map(log => ({
      id: log.id.toString(),
      address_id: log.item_id,
      address_description: log.item_name || '',
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
    console.error('❌ [EXTERNAL PARTY ADDRESS AUDIT] Falha ao buscar logs:', error);
    return [];
  }
};

/**
 * Busca todos os logs de auditoria de um fornecedor/terceiro (principal + endereços)
 * Retorna logs combinados e ordenados por data
 */
export const getAllExternalPartyAuditLogs = async (
  externalPartyId: number
): Promise<(ExternalPartyAuditLog | ExternalPartyAddressAuditLog)[]> => {
  try {
    console.log('🔍 [EXTERNAL PARTY AUDIT] Buscando todos os logs para fornecedor:', externalPartyId);

    // Buscar logs da entidade principal e de endereços em paralelo
    const [mainLogs, addressLogs] = await Promise.all([
      getExternalPartyAuditLog(externalPartyId),
      getExternalPartyAddressAuditLog(externalPartyId),
    ]);

    // Combinar e ordenar por data (mais recente primeiro)
    const allLogs = [...mainLogs, ...addressLogs].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    console.log('✅ [EXTERNAL PARTY AUDIT] Logs combinados recuperados:', {
      main: mainLogs.length,
      address: addressLogs.length,
      total: allLogs.length,
    });

    return allLogs;
  } catch (error) {
    console.error('❌ [EXTERNAL PARTY AUDIT] Falha ao buscar logs combinados:', error);
    return [];
  }
};
