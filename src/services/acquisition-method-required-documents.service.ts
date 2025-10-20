import { supabase } from '@/integrations/supabase/client';
import { 
  AcquisitionMethodRequiredDocument, 
  AcquisitionMethodRequiredDocumentInsert,
  AcquisitionMethodRequiredDocumentUpdate 
} from '@/types/acquisition-method.types';
import { logAcquisitionMethodRequiredDocumentAction } from './acquisition-method-required-documents-audit.service';
import { getCurrentUser } from '@/lib/auth-helpers';

export const acquisitionMethodRequiredDocumentsService = {
  // Buscar todos os documentos de um método
  getDocumentsByMethodId: async (methodId: number): Promise<AcquisitionMethodRequiredDocument[]> => {
    const { data, error } = await (supabase as any)
      .from('m_ctr_t_acquisition_method_required_document')
      .select('*')
      .eq('s_her_m_ctr_t_acquisition_method_c_id', methodId)
      .eq('is_deleted', false)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Criar novo documento obrigatório
  createDocument: async (document: AcquisitionMethodRequiredDocumentInsert): Promise<AcquisitionMethodRequiredDocument> => {
    const { data, error } = await (supabase as any)
      .from('m_ctr_t_acquisition_method_required_document')
      .insert([document])
      .select()
      .single();

    if (error) throw error;

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logAcquisitionMethodRequiredDocumentAction({
        document_id: data.id,
        document_name: data.name,
        acquisition_method_id: data.s_her_m_ctr_t_acquisition_method_c_id,
        action_type: 'create',
        action_label: 'anexou documento obrigatório',
        action_description: `Upload de documento obrigatório: ${data.name}.`,
        item_id: data.id,
        item_name: data.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          acquisition_method_id: data.s_her_m_ctr_t_acquisition_method_c_id,
          created_at: data.created_at,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return data;
  },

  // Atualizar documento
  updateDocument: async (id: number, document: AcquisitionMethodRequiredDocumentUpdate): Promise<AcquisitionMethodRequiredDocument> => {
    const { data, error } = await (supabase as any)
      .from('m_ctr_t_acquisition_method_required_document')
      .update(document)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logAcquisitionMethodRequiredDocumentAction({
        document_id: data.id,
        document_name: data.name,
        acquisition_method_id: data.s_her_m_ctr_t_acquisition_method_c_id,
        action_type: 'edit',
        action_label: 'editou documento obrigatório',
        action_description: 'Dados do documento obrigatório foram atualizados.',
        item_id: data.id,
        item_name: data.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: document,
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }

    return data;
  },

  // Deletar documento (soft delete)
  deleteDocument: async (id: number): Promise<void> => {
    // Buscar dados do documento para o log
    const { data: docData } = await (supabase as any)
      .from('m_ctr_t_acquisition_method_required_document')
      .select('*')
      .eq('id', id)
      .single();

    const { error } = await (supabase as any)
      .from('m_ctr_t_acquisition_method_required_document')
      .update({ 
        is_deleted: true, 
        deleted_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw error;

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logAcquisitionMethodRequiredDocumentAction({
        document_id: id,
        document_name: docData?.name || 'Documento',
        acquisition_method_id: docData?.s_her_m_ctr_t_acquisition_method_c_id || 0,
        action_type: 'deactivate',
        action_label: 'removeu documento obrigatório',
        action_description: `Documento obrigatório excluído: ${docData?.name || 'Documento'}.`,
        item_id: id,
        item_name: docData?.name,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          acquisition_method_id: docData?.s_her_m_ctr_t_acquisition_method_c_id,
          deleted_at: new Date().toISOString(),
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }
  },

  // Sincronizar documentos (adicionar novos, remover excluídos)
  syncDocuments: async (methodId: number, documentNames: string[]): Promise<void> => {
    // Buscar documentos existentes
    const existing = await acquisitionMethodRequiredDocumentsService.getDocumentsByMethodId(methodId);
    const existingNames = existing.map(doc => doc.name);

    // Adicionar novos
    const toAdd = documentNames.filter(name => !existingNames.includes(name));
    for (const name of toAdd) {
      await acquisitionMethodRequiredDocumentsService.createDocument({
        name,
        s_her_m_ctr_t_acquisition_method_c_id: methodId,
      });
    }

    // Remover excluídos (soft delete)
    const toRemove = existing.filter(doc => !documentNames.includes(doc.name));
    for (const doc of toRemove) {
      await acquisitionMethodRequiredDocumentsService.deleteDocument(doc.id);
    }
  },
};
