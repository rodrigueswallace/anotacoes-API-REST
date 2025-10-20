export interface DepartmentAddress {
  id?: number;
  postalCode?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  complement?: string;
  number?: string;
}

export interface Department {
  id?: number;
  name: string;
  unitId: number;
  unitName?: string;
  agencyId?: number;
  agencyName?: string;
  isStockroom: boolean;
  isDeleted: boolean;
  createdAt: string;
  deletedAt?: string;
}

export interface DepartmentDatabase {
  id?: number;
  name: string;
  s_her_m_org_t_unit_c_id: number;
  is_stockroom: boolean;
  is_deleted: boolean;
  created_at: string;
  deleted_at?: string;
}

export interface CreateDepartmentInput {
  name: string;
  unitId: number;
  isStockroom: boolean;
}

export interface UpdateDepartmentInput {
  id: number;
  name: string;
  unitId: number;
  isStockroom: boolean;
}

export const toLocalFormat = (
  data: DepartmentDatabase & {
    unit?: {
      id: number;
      name: string;
      agency?: {
        id: number;
        name: string;
      };
    };
  }
): Department => {
  return {
    id: data.id,
    name: data.name,
    unitId: data.s_her_m_org_t_unit_c_id,
    unitName: data.unit?.name,
    agencyId: data.unit?.agency?.id,
    agencyName: data.unit?.agency?.name,
    isStockroom: data.is_stockroom,
    isDeleted: data.is_deleted,
    createdAt: data.created_at,
    deletedAt: data.deleted_at,
  };
};

export const toSupabaseFormat = (
  input: CreateDepartmentInput | UpdateDepartmentInput
): Partial<DepartmentDatabase> => {
  const base: Partial<DepartmentDatabase> = {
    name: input.name.trim(),
    s_her_m_org_t_unit_c_id: input.unitId,
    is_stockroom: input.isStockroom,
  };

  if ('id' in input) {
    base.id = input.id;
  }

  return base;
};
