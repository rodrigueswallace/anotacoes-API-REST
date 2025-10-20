export interface AgreementDocument {
  id: number;
  s_her_m_fin_t_agreement_c_id: number;
  title: string;
  file_path: string;
  mime_type: string;
  description: string | null;
  is_deleted: boolean;
  created_at: string;
  deleted_at: string | null;
}

export interface AgreementDocumentInsert {
  s_her_m_fin_t_agreement_c_id: number;
  title: string;
  file_path: string;
  mime_type: string;
  description?: string | null;
}

export interface AgreementDocumentUpdate {
  description?: string | null;
  is_deleted?: boolean;
}

export interface AgreementDocumentLocal {
  id: string;
  agreement_id: string;
  nome: string;
  caminho: string;
  tipo: string;
  tamanho: number;
  comentario: string;
  status: 'Criado' | 'Enviado';
  file?: File;
  url?: string;
}

export const toLocalFormat = (dbItem: AgreementDocument): AgreementDocumentLocal => {
  return {
    id: dbItem.id.toString(),
    agreement_id: dbItem.s_her_m_fin_t_agreement_c_id.toString(),
    nome: dbItem.title,
    caminho: dbItem.file_path,
    tipo: dbItem.mime_type,
    tamanho: 0, // Not stored in DB
    comentario: dbItem.description || '',
    status: 'Enviado',
    url: dbItem.file_path,
  };
};

export const toSupabaseInsertFormat = (
  localItem: Partial<AgreementDocumentLocal>,
  agreementId: string,
  filePath: string
): AgreementDocumentInsert => {
  return {
    s_her_m_fin_t_agreement_c_id: parseInt(agreementId),
    title: localItem.nome || '',
    file_path: filePath,
    mime_type: localItem.tipo || '',
    description: localItem.comentario || null,
  };
};
