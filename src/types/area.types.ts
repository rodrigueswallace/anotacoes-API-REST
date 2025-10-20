export interface Area {
  id: number;
  nome: string;
  descricao: string;
  status: 'Ativo' | 'Inativo';
  data_criacao: string;
}

export interface AreaDatabase {
  id: number;
  name: string;
  description: string;
  is_deleted: boolean;
  created_at: string;
  deleted_at?: string | null;
}

export interface AreaInsert {
  name: string;
  description: string;
  is_deleted?: boolean;
}

export interface AreaUpdate {
  name?: string;
  description?: string;
  is_deleted?: boolean;
  deleted_at?: string | null;
}

export function toLocalFormat(dbArea: AreaDatabase): Area {
  return {
    id: dbArea.id,
    nome: dbArea.name,
    descricao: dbArea.description,
    status: dbArea.is_deleted ? 'Inativo' : 'Ativo',
    data_criacao: dbArea.created_at
  };
}

export function toSupabaseFormat(area: Omit<Area, 'id' | 'status' | 'data_criacao'>): AreaInsert {
  return {
    name: area.nome,
    description: area.descricao,
    is_deleted: false
  };
}

export function toSupabaseUpdateFormat(area: Partial<Omit<Area, 'id' | 'data_criacao'>>): AreaUpdate {
  const update: AreaUpdate = {};
  
  if (area.nome !== undefined) {
    update.name = area.nome;
  }
  
  if (area.descricao !== undefined) {
    update.description = area.descricao;
  }
  
  if (area.status !== undefined) {
    update.is_deleted = area.status === 'Inativo';
    if (area.status === 'Inativo') {
      update.deleted_at = new Date().toISOString();
    } else {
      update.deleted_at = null;
    }
  }
  
  return update;
}