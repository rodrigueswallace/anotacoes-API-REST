// Tipos para Subgrupo de Bem (her.m_ast_t_asset_subgroup)

export interface AssetSubgroup {
  id: number;
  name: string;
  s_her_m_ast_t_asset_group_c_id: number;
  is_deleted: boolean;
  created_at: string;
  deleted_at: string | null;
}

export interface AssetSubgroupInsert {
  name: string;
  s_her_m_ast_t_asset_group_c_id: number;
  is_deleted?: boolean;
}

export interface AssetSubgroupUpdate {
  name?: string;
  s_her_m_ast_t_asset_group_c_id?: number;
  is_deleted?: boolean;
}

// Interface com JOIN do grupo
export interface AssetSubgroupWithGroup extends AssetSubgroup {
  group_name: string;
}

// Interface para compatibilidade com o código existente
export interface AssetSubgroupLocal {
  id: string;
  nome: string;
  grupo: string;
  grupo_id: string;
  status: 'ativo' | 'inativo';
}

// Função para converter de Supabase para formato local
export const toLocalFormat = (subgroup: AssetSubgroupWithGroup): AssetSubgroupLocal => ({
  id: subgroup.id.toString(),
  nome: subgroup.name,
  grupo: subgroup.group_name,
  grupo_id: subgroup.s_her_m_ast_t_asset_group_c_id.toString(),
  status: subgroup.is_deleted ? 'inativo' : 'ativo',
});

// Função para converter de formato local para Supabase
export const toSupabaseFormat = (data: Partial<AssetSubgroupLocal>): AssetSubgroupInsert => ({
  name: data.nome || '',
  s_her_m_ast_t_asset_group_c_id: data.grupo_id ? parseInt(data.grupo_id) : 0,
  is_deleted: data.status === 'inativo',
});
