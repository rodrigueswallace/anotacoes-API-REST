import { supabase } from "@/integrations/supabase/client";
import { LawDocument, CreateLawDocumentInput, LawDocumentWithUrl } from "@/types/law-document.types";
import { logLawDocumentAction } from './law-document-audit.service';
import { getCurrentUser } from '@/lib/auth-helpers';

const TABLE_NAME = "m_leg_t_law_document";
const BUCKET_NAME = "law-documents";

export const lawDocumentsService = {
  async getByLawId(lawId: number): Promise<LawDocumentWithUrl[]> {
    const { data, error } = await supabase
      .schema('her')
      .from(TABLE_NAME)
      .select("*")
      .eq("s_her_m_leg_t_law_c_id", lawId)
      .or('is_deleted.is.null,is_deleted.eq.false')
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Generate signed URLs for private bucket documents
    const documentsWithUrls = await Promise.all(
      (data as LawDocument[]).map(async (doc) => {
        const { data: signedUrlData } = await supabase.storage
          .from(BUCKET_NAME)
          .createSignedUrl(doc.file_path, 3600); // 1 hour expiration

        return {
          ...doc,
          public_url: signedUrlData?.signedUrl || ''
        };
      })
    );

    return documentsWithUrls;
  },

  async upload(input: CreateLawDocumentInput): Promise<LawDocument> {
    const fileExt = input.file.name.split('.').pop();
    const fileName = `${input.law_id}/${Date.now()}.${fileExt}`;

    console.info(`[Law Documents] Uploading file to bucket: ${BUCKET_NAME}, path: ${fileName}`);

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, input.file, {
        upsert: false
      });

    if (uploadError) {
      console.error('[Law Documents] Upload failed:', uploadError);
      throw uploadError;
    }

    console.info(`[Law Documents] File uploaded successfully: ${fileName}`);

    // Create document record with relative path
    const { data, error } = await supabase
      .schema('her')
      .from(TABLE_NAME)
      .insert([{
        s_her_m_leg_t_law_c_id: input.law_id,
        title: input.title,
        file_path: fileName,
        mime_type: input.file.type || 'application/octet-stream'
      }])
      .select()
      .single();

    if (error) {
      console.error('[Law Documents] Database insert failed:', error);
      throw error;
    }

    console.info(`[Law Documents] Document record created with ID: ${data.id}`);
    
    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logLawDocumentAction({
        document_id: data.id,
        document_name: data.title,
        law_id: data.s_her_m_leg_t_law_c_id,
        action_type: 'create',
        action_label: 'anexou documento',
        action_description: `Upload de arquivo: ${data.title}.`,
        item_id: data.id,
        item_name: data.title,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          law_id: data.s_her_m_leg_t_law_c_id,
          file_path: data.file_path,
          mime_type: data.mime_type,
          created_at: data.created_at,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }
    
    return data as LawDocument;
  },

  async syncFromStorage(lawId: number): Promise<void> {
    try {
      // List all files in Storage for this law
      const { data: files, error: listError } = await supabase.storage
        .from(BUCKET_NAME)
        .list(`${lawId}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (listError) {
        console.error('Error listing files from storage:', listError);
        throw new Error(`Erro ao listar arquivos: ${listError.message}`);
      }

      if (!files || files.length === 0) {
        console.log('No files found in storage for law:', lawId);
        return;
      }

      // Get existing documents from DB
      const existingDocs = await this.getByLawId(lawId);
      const existingPaths = new Set(existingDocs.map(doc => doc.file_path));

      // Create DB records for files that don't have them
      for (const file of files) {
        const filePath = `${lawId}/${file.name}`;
        
        if (!existingPaths.has(filePath)) {
          console.log('Creating DB record for orphaned file:', filePath);
          
          const { error: insertError } = await supabase
            .schema('her')
            .from(TABLE_NAME)
            .insert([{
              s_her_m_leg_t_law_c_id: lawId,
              title: file.name,
              file_path: filePath,
              mime_type: file.metadata?.mimetype || 'application/octet-stream'
            }]);

          if (insertError) {
            console.error('Error creating document record:', insertError);
          }
        }
      }

      console.log('Storage sync completed for law:', lawId);
    } catch (error) {
      console.error('Error in syncFromStorage:', error);
      throw error;
    }
  },

  async updateTitle(id: number, title: string): Promise<void> {
    const { error } = await supabase
      .schema('her')
      .from(TABLE_NAME)
      .update({ title })
      .eq("id", id);

    if (error) throw error;

    // Buscar dados do documento para o log
    const { data: docData } = await supabase
      .schema('her')
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logLawDocumentAction({
        document_id: id,
        document_name: title,
        law_id: docData?.s_her_m_leg_t_law_c_id || 0,
        action_type: 'edit',
        action_label: 'editou documento',
        action_description: 'Dados do documento foram atualizados.',
        item_id: id,
        item_name: title,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          law_id: docData?.s_her_m_leg_t_law_c_id,
          old_title: docData?.title,
          new_title: title,
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }
  },

  async delete(id: number, filePath: string): Promise<void> {
    // Buscar dados do documento antes de deletar
    const { data: docData } = await supabase
      .schema('her')
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    // Soft delete from database
    const { error: dbError } = await supabase
      .schema('her')
      .from(TABLE_NAME)
      .update({ is_deleted: true })
      .eq("id", id);

    if (dbError) throw dbError;

    // Delete file from storage (filePath is now just the relative path)
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (storageError) console.error("Failed to delete file from storage:", storageError);

    // Log de auditoria
    try {
      const currentUser = await getCurrentUser();
      await logLawDocumentAction({
        document_id: id,
        document_name: docData?.title || 'Documento',
        law_id: docData?.s_her_m_leg_t_law_c_id || 0,
        action_type: 'deactivate',
        action_label: 'removeu documento',
        action_description: `Arquivo excluído: ${docData?.title || 'Documento'}.`,
        item_id: id,
        item_name: docData?.title,
        performed_by: currentUser?.id || null,
        performed_by_name: currentUser?.name || 'Sistema',
        metadata: {
          law_id: docData?.s_her_m_leg_t_law_c_id,
          file_path: filePath,
          deleted_at: new Date().toISOString(),
        },
      });
    } catch (logError) {
      console.error('⚠️ Erro ao registrar log de auditoria (não bloqueante):', logError);
    }
  }
};
