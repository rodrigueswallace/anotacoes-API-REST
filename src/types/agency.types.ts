export interface AgencyAddress {
  id?: number;
  postalCode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: string;
  complement?: string;
}

export interface AgencyAddressDatabase {
  id?: number;
  postal_code: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: string;
  complement?: string;
}

export interface Agency {
  id?: number;
  name: string;
  acronym: string;
  agencyCode: string;
  cnpj: string;
  phoneNumber: string;
  email: string;
  governmentPower: 'Legislativo' | 'Executivo' | 'Judiciário';
  areaId: number;
  areaName?: string;
  address: AgencyAddress;
  isDeleted: boolean;
  createdAt: string;
  deletedAt?: string;
}

export interface AgencyDatabase {
  id?: number;
  name: string;
  acronym: string;
  agency_code: string;
  cnpj: string;
  phone_number: string;
  email: string;
  government_power: 'Legislativo' | 'Executivo' | 'Judiciário';
  s_her_m_org_t_area_c_id: number;
  s_her_m_org_t_agency_address_c_id?: number;
  is_deleted: boolean;
  created_at: string;
  deleted_at?: string;
}

export interface CreateAgencyInput {
  name: string;
  acronym: string;
  agencyCode: string;
  cnpj: string;
  phoneNumber: string;
  email: string;
  governmentPower: 'Legislativo' | 'Executivo' | 'Judiciário';
  areaId: number;
  address: Omit<AgencyAddress, 'id'>;
}

export interface UpdateAgencyInput {
  id: number;
  name: string;
  acronym: string;
  agencyCode: string;
  cnpj: string;
  phoneNumber: string;
  email: string;
  governmentPower: 'Legislativo' | 'Executivo' | 'Judiciário';
  areaId: number;
  address: AgencyAddress;
}

export const toLocalFormat = (
  dbAgency: AgencyDatabase & {
    agency_address?: AgencyAddressDatabase;
    area?: { name: string };
  }
): Agency => {
  const governmentPowerMap = {
    Legislativo: 'Legislativo' as const,
    Executivo: 'Executivo' as const,
    Judiciário: 'Judiciário' as const,
  };

  return {
    id: dbAgency.id,
    name: dbAgency.name,
    acronym: dbAgency.acronym,
    agencyCode: dbAgency.agency_code,
    cnpj: dbAgency.cnpj,
    phoneNumber: dbAgency.phone_number,
    email: dbAgency.email,
    governmentPower: governmentPowerMap[dbAgency.government_power],
    areaId: dbAgency.s_her_m_org_t_area_c_id,
    areaName: dbAgency.area?.name,
    address: dbAgency.agency_address
      ? {
          id: dbAgency.agency_address.id,
          postalCode: dbAgency.agency_address.postal_code,
          street: dbAgency.agency_address.street,
          neighborhood: dbAgency.agency_address.neighborhood,
          city: dbAgency.agency_address.city,
          state: dbAgency.agency_address.state,
          number: dbAgency.agency_address.number,
          complement: dbAgency.agency_address.complement,
        }
      : {
          postalCode: '',
          street: '',
          neighborhood: '',
          city: '',
          state: '',
          number: '',
        },
    isDeleted: dbAgency.is_deleted,
    createdAt: dbAgency.created_at,
    deletedAt: dbAgency.deleted_at,
  };
};

export const normalizeGovernmentPower = (
  value: string
): 'Legislativo' | 'Executivo' | 'Judiciário' => {
  if (!value) return 'Executivo';
  const normalized = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const map: Record<string, 'Legislativo' | 'Executivo' | 'Judiciário'> = {
    executivo: 'Executivo',
    legislativo: 'Legislativo',
    judiciario: 'Judiciário',
  };
  return map[normalized] || ('Executivo');
};

export const toSupabaseFormat = (
  agency: CreateAgencyInput | UpdateAgencyInput
): {
  agency: Partial<AgencyDatabase>;
  address: Partial<AgencyAddressDatabase>;
 } => {
  return {
    agency: {
      name: agency.name,
      acronym: agency.acronym.trim().slice(0, 10),
      agency_code: agency.agencyCode,
      cnpj: agency.cnpj.replace(/\D/g, '').slice(0, 14),
      phone_number: agency.phoneNumber.replace(/\D/g, ''),
      email: agency.email,
      government_power: normalizeGovernmentPower(agency.governmentPower as string),
      s_her_m_org_t_area_c_id: agency.areaId,
    },
    address: {
      // Do NOT include id in the update payload - it's used in WHERE clause
      postal_code: agency.address.postalCode.replace(/\D/g, '').slice(0, 8),
      street: agency.address.street.trim().slice(0, 255),
      neighborhood: agency.address.neighborhood.trim().slice(0, 255),
      city: agency.address.city.trim().slice(0, 255),
      state: agency.address.state.toUpperCase().slice(0, 2),
      number: agency.address.number.trim().slice(0, 10),
      complement: agency.address.complement?.trim().slice(0, 255),
    },
  };
};
