export interface LawDocument {
  id: number;
  s_her_m_leg_t_law_c_id: number;
  title: string;
  file_path: string;
  mime_type: string;
  created_at: string;
  is_deleted: boolean;
}

export interface CreateLawDocumentInput {
  law_id: number;
  title: string;
  file: File;
}

export interface LawDocumentWithUrl extends LawDocument {
  public_url: string;
}
