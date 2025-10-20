export interface AcquisitionMethodRequiredDocument {
  id: number;
  name: string;
  s_her_m_ctr_t_acquisition_method_c_id: number;
  is_deleted: boolean;
  created_at: string;
  deleted_at: string | null;
}

export interface AcquisitionMethodRequiredDocumentInsert {
  name: string;
  s_her_m_ctr_t_acquisition_method_c_id: number;
}

export interface AcquisitionMethodRequiredDocumentUpdate {
  name?: string;
  is_deleted?: boolean;
  deleted_at?: string | null;
}

export interface AcquisitionMethod {
  id: number;
  name: string;
  code: string;
  requires_attachment: boolean;
  description: string;
  is_deleted: boolean;
  created_at: string;
  deleted_at: string | null;
  required_documents?: AcquisitionMethodRequiredDocument[];
}

export interface AcquisitionMethodInsert {
  name: string;
  code: string;
  requires_attachment: boolean;
  description: string;
}

export interface AcquisitionMethodUpdate {
  name?: string;
  code?: string;
  requires_attachment?: boolean;
  description?: string;
}

export interface AcquisitionMethodLocal {
  id: number;
  nome: string;
  codigo_interno: string;
  exige_documento: boolean;
  documentos_obrigatorios: string[];
  descricao: string;
  status: 'Ativo' | 'Inativo';
  data_criacao: string;
}

// Conversão de formato Supabase para formato local
export const toLocalFormat = (data: AcquisitionMethod): AcquisitionMethodLocal => ({
  id: data.id,
  nome: data.name,
  codigo_interno: data.code,
  exige_documento: data.requires_attachment,
  documentos_obrigatorios: data.required_documents?.map(doc => doc.name) || [],
  descricao: data.description,
  status: data.is_deleted ? 'Inativo' : 'Ativo',
  data_criacao: new Date(data.created_at).toLocaleDateString('pt-BR'),
});

// Conversão de formato local para formato Supabase
export const toSupabaseFormat = (data: any): AcquisitionMethodInsert | AcquisitionMethodUpdate => ({
  name: data.nome,
  code: data.codigo_interno,
  requires_attachment: data.exige_documento,
  description: data.descricao,
});
