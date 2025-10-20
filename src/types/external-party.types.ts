export interface ExternalPartyAddress {
  id: number;
  postal_code: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  number?: string;
  complement?: string;
  is_deleted: boolean;
  created_at: string;
  deleted_at?: string;
}

export interface ExternalPartyAddressInsert {
  postal_code: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  country?: string;
  number?: string;
  complement?: string;
}

export interface ExternalPartyAddressUpdate {
  postal_code?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  number?: string;
  complement?: string;
}

export interface ExternalParty {
  id: number;
  name: string;
  identity: string; // CPF or CNPJ
  email: string;
  phone_number?: string;
  legal_representative?: string;
  notes?: string;
  s_her_m_ctr_t_external_party_address_c_id: number;
  is_deleted: boolean;
  created_at: string;
  deleted_at?: string;
}

export interface ExternalPartyInsert {
  name: string;
  identity: string;
  email: string;
  phone_number?: string;
  legal_representative?: string;
  notes?: string;
  s_her_m_ctr_t_external_party_address_c_id: number;
}

export interface ExternalPartyUpdate {
  name?: string;
  identity?: string;
  email?: string;
  phone_number?: string;
  legal_representative?: string;
  notes?: string;
}

export interface ExternalPartyWithAddress extends ExternalParty {
  address: ExternalPartyAddress;
}

// Interface local para compatibilidade com código existente
export interface ExternalPartyLocal {
  id: number;
  nome: string;
  tipoDocumento: 'cpf' | 'cnpj';
  cpf_cnpj: string;
  email: string;
  telefone: string;
  representanteLegal: string;
  observacoes: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  uf: string;
  municipio: string;
  ativo: boolean;
  dataCadastro: string;
}

// Converte dados do Supabase para formato local
export function toLocalFormat(party: ExternalPartyWithAddress): ExternalPartyLocal {
  const isCompany = party.identity.replace(/\D/g, '').length === 14;
  
  return {
    id: party.id,
    nome: party.name,
    tipoDocumento: isCompany ? 'cnpj' : 'cpf',
    cpf_cnpj: party.identity,
    email: party.email,
    telefone: party.phone_number || '',
    representanteLegal: party.legal_representative || '',
    observacoes: party.notes || '',
    cep: party.address.postal_code,
    logradouro: party.address.street,
    numero: party.address.number || '',
    complemento: party.address.complement || '',
    bairro: party.address.neighborhood,
    uf: party.address.state,
    municipio: party.address.city,
    ativo: !party.is_deleted,
    dataCadastro: party.created_at
  };
}

// Funções helper para sanitização
const clean = (value?: string): string => (value ?? '').toString().trim();
const onlyDigits = (value?: string): string => clean(value).replace(/\D/g, '');

// Converte dados locais para formato Supabase
export function toSupabaseFormat(local: Partial<ExternalPartyLocal>): {
  party: Partial<ExternalPartyInsert | ExternalPartyUpdate>;
  address: Partial<ExternalPartyAddressInsert | ExternalPartyAddressUpdate>;
} {
  return {
    party: {
      name: clean(local.nome),
      identity: onlyDigits(local.cpf_cnpj),
      email: clean(local.email),
      phone_number: onlyDigits(local.telefone) || undefined,
      legal_representative: clean(local.representanteLegal) || undefined,
      notes: clean(local.observacoes) || undefined
    },
    address: {
      postal_code: onlyDigits(local.cep).slice(0, 8),
      street: clean(local.logradouro),
      neighborhood: clean(local.bairro),
      city: clean(local.municipio),
      state: clean(local.uf).slice(0, 2).toUpperCase(),
      country: 'Brasil',
      number: clean(local.numero),
      complement: clean(local.complemento) || undefined
    }
  };
}
