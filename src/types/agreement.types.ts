export interface Agreement {
  id: string;
  code: string;
  name: string;
  cnpj: string | null;
  agreement_object: string | null;
  start_date: string | null;
  end_date: string | null;
  total: number | null;
  notes: string | null;
  s_her_m_fin_t_funding_source_c_id: string | null;
  s_her_m_ctr_t_external_party_c_id: number | null;
  is_deleted: boolean;
  created_at: string;
  deleted_at: string | null;
}

export interface AgreementWithRelations extends Agreement {
  funding_source?: {
    id: string;
    name: string;
    description: string | null;
  } | null;
  external_party?: {
    id: number;
    name: string;
    identity: string | null;
  } | null;
}

export interface AgreementInsert {
  code: string;
  name: string;
  cnpj?: string | null;
  agreement_object?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  total?: number | null;
  notes?: string | null;
  s_her_m_fin_t_funding_source_c_id?: string | null;
  s_her_m_ctr_t_external_party_c_id?: number | null;
}

export interface AgreementUpdate {
  code?: string;
  name?: string;
  cnpj?: string | null;
  agreement_object?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  total?: number | null;
  notes?: string | null;
  s_her_m_fin_t_funding_source_c_id?: string | null;
  s_her_m_ctr_t_external_party_c_id?: number | null;
}

export interface AgreementLocal {
  id: string;
  codigo: string;
  nome: string;
  cnpj: string;
  objeto: string;
  data_inicio: string;
  data_fim: string;
  valor_total: string;
  descricao: string;
  fonte_recurso_id: string;
  fonte_recurso_nome?: string;
  fornecedor_id: string;
  fornecedor_nome?: string;
  status: 'Ativo' | 'Inativo';
  data_criacao: string;
}

export const toLocalFormat = (dbItem: AgreementWithRelations): AgreementLocal => {
  // Extract just the date part (YYYY-MM-DD) from timestamp for form inputs
  const formatDateForInput = (timestamp: string | null): string => {
    if (!timestamp) return '';
    
    let dateStr = '';
    // Handle both ISO format (2020-01-10T00:00:00+00:00) and space format (2025-10-31 00:00:00+00)
    if (timestamp.includes('T')) {
      dateStr = timestamp.split('T')[0];
    } else if (timestamp.includes(' ')) {
      dateStr = timestamp.split(' ')[0];
    } else {
      // If it's already in YYYY-MM-DD format
      dateStr = timestamp.slice(0, 10);
    }
    
    // Valida se o ano está em um range razoável
    const year = parseInt(dateStr.split('-')[0]);
    if (year < 1900 || year > 2100) return '';
    
    return dateStr;
  };

  return {
    id: dbItem.id,
    codigo: dbItem.code || '',
    nome: dbItem.name || '',
    cnpj: dbItem.cnpj || '',
    objeto: dbItem.agreement_object || '',
    data_inicio: formatDateForInput(dbItem.start_date),
    data_fim: formatDateForInput(dbItem.end_date),
    valor_total: dbItem.total ? dbItem.total.toString() : '',
    descricao: dbItem.notes || '',
    fonte_recurso_id: dbItem.s_her_m_fin_t_funding_source_c_id || '',
    fonte_recurso_nome: dbItem.funding_source?.name || '',
    fornecedor_id: dbItem.s_her_m_ctr_t_external_party_c_id?.toString() || '',
    fornecedor_nome: dbItem.external_party?.name || '',
    status: dbItem.is_deleted ? 'Inativo' : 'Ativo',
    data_criacao: dbItem.created_at,
  };
};

export const toSupabaseInsertFormat = (localItem: Partial<AgreementLocal>): AgreementInsert => {
  // Convert YYYY-MM-DD to timestamp with timezone for PostgreSQL
  const formatDateForDB = (dateStr: string | undefined | null): string | null => {
    if (!dateStr) return null;
    // Convert "YYYY-MM-DD" to ISO timestamp "YYYY-MM-DDTHH:mm:ssZ"
    return `${dateStr}T00:00:00Z`;
  };

  return {
    code: localItem.codigo || '',
    name: localItem.nome || '',
    cnpj: localItem.cnpj ? localItem.cnpj.replace(/\D/g, '') : null,
    agreement_object: localItem.objeto || null,
    start_date: formatDateForDB(localItem.data_inicio),
    end_date: formatDateForDB(localItem.data_fim),
    total: localItem.valor_total ? parseFloat(localItem.valor_total.replace(/[^\d,-]/g, '').replace(',', '.')) : null,
    notes: localItem.descricao || null,
    s_her_m_fin_t_funding_source_c_id: localItem.fonte_recurso_id || null,
    s_her_m_ctr_t_external_party_c_id: localItem.fornecedor_id ? parseInt(localItem.fornecedor_id) : null,
  };
};

export const toSupabaseUpdateFormat = (localItem: Partial<AgreementLocal>): AgreementUpdate => {
  // Convert YYYY-MM-DD to timestamp with timezone for PostgreSQL
  const formatDateForDB = (dateStr: string | undefined | null): string | null => {
    if (!dateStr) return null;
    // Convert "YYYY-MM-DD" to ISO timestamp "YYYY-MM-DDTHH:mm:ssZ"
    return `${dateStr}T00:00:00Z`;
  };

  return {
    code: localItem.codigo,
    name: localItem.nome,
    cnpj: localItem.cnpj ? localItem.cnpj.replace(/\D/g, '') : null,
    agreement_object: localItem.objeto || null,
    start_date: formatDateForDB(localItem.data_inicio),
    end_date: formatDateForDB(localItem.data_fim),
    total: localItem.valor_total ? parseFloat(localItem.valor_total.replace(/[^\d,-]/g, '').replace(',', '.')) : null,
    notes: localItem.descricao || null,
    s_her_m_fin_t_funding_source_c_id: localItem.fonte_recurso_id || null,
    s_her_m_ctr_t_external_party_c_id: localItem.fornecedor_id ? parseInt(localItem.fornecedor_id) : null,
  };
};
