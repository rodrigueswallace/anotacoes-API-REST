export interface CredentialingEntityAddress {
  id: number;
  postal_code: string;
  street: string;
  neighborhood?: string;
  city: string;
  state: string;
  country: string;
  number: string;
  complement?: string;
  is_deleted: boolean;
  created_at: string;
  deleted_at?: string;
}

export interface CredentialingEntityAddressInsert {
  postal_code: string;
  street: string;
  neighborhood?: string;
  city: string;
  state: string;
  country?: string;
  number: string;
  complement?: string;
}

export interface CredentialingEntityAddressUpdate {
  postal_code?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  number?: string;
  complement?: string;
}

export interface CredentialingEntity {
  id: number;
  name: string;
  entity_type: string;
  cnpj: string;
  responsible_email: string;
  responsible_phone?: string;
  description?: string;
  notice_link: string;
  s_her_m_org_t_credentialing_entity_address_c_id: number;
  s_her_m_ctr_t_external_party_c_id?: number;
  s_her_m_org_t_unit_c_id?: number;
  is_deleted: boolean;
  created_at: string;
  deleted_at?: string;
}

export interface CredentialingEntityInsert {
  name: string;
  entity_type: string;
  cnpj: string;
  responsible_email: string;
  responsible_phone?: string;
  description?: string;
  notice_link: string;
  s_her_m_org_t_credentialing_entity_address_c_id: number;
  s_her_m_ctr_t_external_party_c_id?: number;
  s_her_m_org_t_unit_c_id?: number;
}

export interface CredentialingEntityUpdate {
  name?: string;
  entity_type?: string;
  cnpj?: string;
  responsible_email?: string;
  responsible_phone?: string;
  description?: string;
  notice_link?: string;
}

export interface CredentialingEntityDocument {
  id: number;
  title: string;
  description?: string;
  file_path: string;
  mime_type: string;
  s_her_m_org_t_credentialing_entity_c_id: number;
  is_deleted: boolean;
  created_at: string;
  deleted_at?: string;
}

export interface CredentialingEntityDocumentInsert {
  title: string;
  description?: string;
  file_path: string;
  mime_type: string;
  s_her_m_org_t_credentialing_entity_c_id: number;
}

export interface CredentialingEntityDocumentUpdate {
  title?: string;
  description?: string;
  file_path?: string;
  mime_type?: string;
}

export interface CredentialingEntityWithAddress extends CredentialingEntity {
  address: CredentialingEntityAddress;
}

export interface CredentialingEntityLocal {
  id: number;
  nome: string;
  tipoEntidade: string;
  esferaAdministrativa: string;
  cnpj: string;
  emailResponsavel: string;
  telefoneResponsavel: string;
  descricao: string;
  linkEdital: string;
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
export function toLocalFormat(entity: CredentialingEntityWithAddress): CredentialingEntityLocal {
  return {
    id: entity.id,
    nome: entity.name,
    tipoEntidade: entity.entity_type,
    esferaAdministrativa: '', // Será calculado no componente a partir do tipo
    cnpj: entity.cnpj,
    emailResponsavel: entity.responsible_email,
    telefoneResponsavel: entity.responsible_phone || '',
    descricao: entity.description || '',
    linkEdital: entity.notice_link,
    cep: entity.address.postal_code,
    logradouro: entity.address.street,
    numero: entity.address.number,
    complemento: entity.address.complement || '',
    bairro: entity.address.neighborhood || '',
    uf: entity.address.state,
    municipio: entity.address.city,
    ativo: !entity.is_deleted,
    dataCadastro: entity.created_at
  };
}

// Funções helper para sanitização
const clean = (value?: string): string => (value ?? '').toString().trim();
const onlyDigits = (value?: string): string => clean(value).replace(/\D/g, '');

// Converte dados locais para formato Supabase
export function toSupabaseFormat(local: Partial<CredentialingEntityLocal>): {
  entity: Partial<CredentialingEntityInsert | CredentialingEntityUpdate>;
  address: Partial<CredentialingEntityAddressInsert | CredentialingEntityAddressUpdate>;
} {
  return {
    entity: {
      name: clean(local.nome),
      entity_type: clean(local.tipoEntidade),
      cnpj: onlyDigits(local.cnpj),
      responsible_email: clean(local.emailResponsavel),
      responsible_phone: onlyDigits(local.telefoneResponsavel) || undefined,
      description: clean(local.descricao) || undefined,
      notice_link: clean(local.linkEdital)
    },
    address: {
      postal_code: onlyDigits(local.cep).slice(0, 8),
      street: clean(local.logradouro),
      neighborhood: clean(local.bairro) || undefined,
      city: clean(local.municipio),
      state: clean(local.uf).slice(0, 2).toUpperCase(),
      country: 'Brasil',
      number: clean(local.numero),
      complement: clean(local.complemento) || undefined
    }
  };
}
