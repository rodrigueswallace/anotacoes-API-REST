export interface FundingSource {
  id: string;
  nome: string;
  descricao?: string;
  status: 'Ativo' | 'Inativo';
  data_criacao: string;
}

export interface FundingSourceInsert {
  name: string;
  description?: string;
}

export interface FundingSourceUpdate {
  name?: string;
  description?: string;
}

export interface FundingSourceDatabase {
  id: string;
  name: string;
  description: string | null;
  is_deleted: boolean;
  created_at: string;
  deleted_at: string | null;
}

export const toLocalFormat = (dbItem: FundingSourceDatabase): FundingSource => ({
  id: dbItem.id,
  nome: dbItem.name,
  descricao: dbItem.description || '',
  status: dbItem.is_deleted ? 'Inativo' : 'Ativo',
  data_criacao: dbItem.created_at,
});

export const toSupabaseFormat = (localItem: Partial<FundingSource>): FundingSourceInsert => ({
  name: localItem.nome || '',
  description: localItem.descricao || null,
});

export const toSupabaseUpdateFormat = (localItem: Partial<FundingSource>): FundingSourceUpdate => ({
  name: localItem.nome,
  description: localItem.descricao || null,
});