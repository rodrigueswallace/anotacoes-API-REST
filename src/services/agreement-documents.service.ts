import { supabase } from '@/integrations/supabase/client';
import { supabasePublic } from '@/integrations/supabase/publicClient';
import type {
  AgreementDocument,
  AgreementDocumentInsert,
  AgreementDocumentUpdate,
} from '@/types/agreement-document.types';
import { logAgreementDocumentAction } from './agreement-document-audit.service';
import { getCurrentUser } from '@/lib/auth-helpers';

export const agreementDocumentsService = {
  async getDocumentsByAgreementId(agreementId: string): Promise<AgreementDocument[]> {
    const { data, error } = await supabase
      .schema('her')
      .from('m_fin_t_agreement_document')
      .select('*')
      .eq('s_her_m_fin_t_agreement_c_id', parseInt(agreementId))
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createDocument(document: AgreementDocumentInsert): Promise<AgreementDocument> {
    const { data, error } = await supabase
      .schema('her')
      .from('m_fin_t_agreement_document')
      .insert(document)
      .select()
      .single();

    if (error) throw error;

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logAgreementDocumentAction({
        document_id: data.id,
        document_name: data.title,
        agreement_id: data.s_her_m_fin_t_agreement_c_id,
        action_type: 'create',
        action_label: 'anexou documento',
        action_description: `Upload de arquivo: ${data.title}.`,
        item_id: data.id,
        item_name: data.title,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          agreement_id: data.s_her_m_fin_t_agreement_c_id,
          created_data: {
            title: data.title,
            agreement_id: data.s_her_m_fin_t_agreement_c_id,
            file_path: data.file_path,
            mime_type: data.mime_type,
          }
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return data;
  },

  async updateDocument(id: string, updates: AgreementDocumentUpdate): Promise<AgreementDocument> {
    const { data, error } = await supabase
      .schema('her')
      .from('m_fin_t_agreement_document')
      .update(updates)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) throw error;

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logAgreementDocumentAction({
        document_id: data.id,
        document_name: data.title,
        agreement_id: data.s_her_m_fin_t_agreement_c_id,
        action_type: 'edit',
        action_label: 'editou documento',
        action_description: 'Dados do documento foram atualizados.',
        item_id: data.id,
        item_name: data.title,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          agreement_id: data.s_her_m_fin_t_agreement_c_id,
          ...updates
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return data;
  },

  async deleteDocument(id: string): Promise<void> {
    // Buscar dados do documento para o log
    const { data: docData } = await supabase
      .schema('her')
      .from('m_fin_t_agreement_document')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    const { error } = await supabase
      .schema('her')
      .from('m_fin_t_agreement_document')
      .update({ is_deleted: true })
      .eq('id', parseInt(id));

    if (error) throw error;

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logAgreementDocumentAction({
        document_id: parseInt(id),
        document_name: docData?.title || 'Documento',
        agreement_id: docData?.s_her_m_fin_t_agreement_c_id || 0,
        action_type: 'deactivate',
        action_label: 'removeu documento',
        action_description: `Arquivo excluído: ${docData?.title || 'Documento'}.`,
        item_id: parseInt(id),
        item_name: docData?.title,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          agreement_id: docData?.s_her_m_fin_t_agreement_c_id,
          deleted_data: {
            file_path: docData?.file_path,
            deleted_at: new Date().toISOString(),
          }
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }
  },

  async uploadFile(file: File, agreementId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${agreementId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('agreement-documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('agreement-documents')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  },

  async downloadFile(filePath: string): Promise<Blob> {
    // Extract the file path from the public URL if needed
    const pathParts = filePath.split('/storage/v1/object/public/agreement-documents/');
    const actualPath = pathParts.length > 1 ? pathParts[1] : filePath;

    const { data, error } = await supabase.storage
      .from('agreement-documents')
      .download(actualPath);

    if (error) throw error;
    return data;
  },
};
