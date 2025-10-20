export interface UnitAddress {
  id?: number;
  postalCode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  number: string;
  complement?: string;
  isDeleted: boolean;
  createdAt: string;
  deletedAt?: string;
}

export interface UnitAddressDatabase {
  id?: number;
  postal_code: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  number: string;
  complement?: string;
  is_deleted: boolean;
  created_at: string;
  deleted_at?: string;
}

export interface Unit {
  id?: number;
  name: string;
  acronym: string;
  cnpj?: string;
  agencyId: number;
  agencyName?: string;
  address?: UnitAddress;
  isDeleted: boolean;
  createdAt: string;
  deletedAt?: string;
}

export interface UnitDatabase {
  id?: number;
  name: string;
  acronym: string;
  cnpj?: string;
  s_her_m_org_t_agency_c_id: number;
  s_her_m_org_t_unit_address_c_id?: number; // Será usado na Fase 2
  is_deleted: boolean;
  created_at: string;
  deleted_at?: string;
}

export interface CreateUnitInput {
  name: string;
  acronym: string;
  cnpj?: string;
  agencyId: number;
  address: {
    postalCode: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    number: string;
    complement?: string;
  };
}

export interface UpdateUnitInput {
  id: number;
  name: string;
  acronym: string;
  cnpj?: string;
  agencyId: number;
  address: {
    postalCode: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    number: string;
    complement?: string;
  };
}

export const addressToLocalFormat = (dbAddress: UnitAddressDatabase): UnitAddress => {
  return {
    id: dbAddress.id,
    postalCode: dbAddress.postal_code,
    street: dbAddress.street,
    neighborhood: dbAddress.neighborhood,
    city: dbAddress.city,
    state: dbAddress.state,
    country: dbAddress.country,
    number: dbAddress.number,
    complement: dbAddress.complement,
    isDeleted: dbAddress.is_deleted,
    createdAt: dbAddress.created_at,
    deletedAt: dbAddress.deleted_at,
  };
};

export const addressToSupabaseFormat = (
  address: CreateUnitInput['address'] | UpdateUnitInput['address']
): Partial<UnitAddressDatabase> => {
  return {
    postal_code: address.postalCode.replace(/\D/g, '').slice(0, 8),
    street: address.street.trim().slice(0, 32),
    neighborhood: address.neighborhood.trim().slice(0, 32),
    city: address.city.trim().slice(0, 32),
    state: address.state.trim().toUpperCase().slice(0, 2),
    country: (address.country || 'Brasil').trim().slice(0, 32),
    number: address.number.trim().slice(0, 10),
    complement: address.complement?.trim().slice(0, 16) || undefined,
  };
};

export const toLocalFormat = (
  dbUnit: UnitDatabase & {
    agency?: { name: string };
    address?: UnitAddressDatabase;
  }
): Unit => {
  return {
    id: dbUnit.id,
    name: dbUnit.name,
    acronym: dbUnit.acronym,
    cnpj: dbUnit.cnpj,
    agencyId: dbUnit.s_her_m_org_t_agency_c_id,
    agencyName: dbUnit.agency?.name,
    address: dbUnit.address ? addressToLocalFormat(dbUnit.address) : undefined,
    isDeleted: dbUnit.is_deleted,
    createdAt: dbUnit.created_at,
    deletedAt: dbUnit.deleted_at,
  };
};

export const toSupabaseFormat = (
  unit: CreateUnitInput | UpdateUnitInput
): Partial<UnitDatabase> => {
  return {
    name: unit.name,
    acronym: unit.acronym.trim().slice(0, 14),
    cnpj: unit.cnpj ? unit.cnpj.replace(/\D/g, '').slice(0, 14) : undefined,
    s_her_m_org_t_agency_c_id: unit.agencyId,
  };
};
