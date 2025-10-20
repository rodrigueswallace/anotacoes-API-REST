export interface InventoryType {
  id: number;
  name: string;
  frequency: 'Trimestral' | 'Semestral' | 'Anual';
  requires_committee: boolean;
  description: string;
  is_deleted: boolean;
  created_at: string;
  deleted_at: string | null;
}

export interface InventoryTypeInsert {
  name: string;
  frequency: 'Trimestral' | 'Semestral' | 'Anual';
  requires_committee: boolean;
  description: string;
}

export interface InventoryTypeUpdate {
  name?: string;
  frequency?: 'Trimestral' | 'Semestral' | 'Anual';
  requires_committee?: boolean;
  description?: string;
}

export interface InventoryTypeLocal {
  id: string;
  nome: string;
  frequencia: 'Trimestral' | 'Semestral' | 'Anual';
  exige_comissao: boolean;
  descricao: string;
  status: 'Ativo' | 'Inativo';
  data_criacao: string;
}

// Conversão de formato Supabase para formato local
export const toLocalFormat = (data: InventoryType): InventoryTypeLocal => ({
  id: String(data.id),
  nome: data.name,
  frequencia: data.frequency,
  exige_comissao: data.requires_committee,
  descricao: data.description,
  status: data.is_deleted ? 'Inativo' : 'Ativo',
  data_criacao: new Date(data.created_at).toLocaleDateString('pt-BR'),
});

// Conversão de formato local para formato Supabase
export const toSupabaseFormat = (data: any): InventoryTypeInsert | InventoryTypeUpdate => ({
  name: data.nome,
  frequency: data.frequencia,
  requires_committee: data.exige_comissao,
  description: data.descricao,
});