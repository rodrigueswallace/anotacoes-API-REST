// Tipos para Estado de Conservação (her.m_ast_t_asset_condition)

export interface AssetCondition {
  id: number;
  name: string;
  description: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssetConditionInsert {
  name: string;
  description?: string;
  is_deleted?: boolean;
}

export interface AssetConditionUpdate {
  name?: string;
  description?: string;
  is_deleted?: boolean;
}

// Interface para compatibilidade com o código existente
export interface AssetConditionLocal {
  id: string;
  nome: string;
  descricao?: string;
  status: 'ativo' | 'inativo';
}

// Função para converter de Supabase para formato local
export const toLocalFormat = (condition: AssetCondition): AssetConditionLocal => ({
  id: condition.id.toString(),
  nome: condition.name,
  descricao: condition.description || '',
  status: condition.is_deleted ? 'inativo' : 'ativo',
});

// Função para converter de formato local para Supabase
export const toSupabaseFormat = (data: Partial<AssetConditionLocal>): AssetConditionInsert => ({
  name: data.nome || '',
  description: data.descricao || null,
  is_deleted: data.status === 'inativo',
});