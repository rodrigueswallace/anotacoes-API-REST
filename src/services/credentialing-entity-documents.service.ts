import { supabase } from '@/integrations/supabase/client';
import type {
  CredentialingEntityDocument,
  CredentialingEntityDocumentInsert,
  CredentialingEntityDocumentUpdate
} from '@/types/credentialing-entity.types';

class CredentialingEntityDocumentsService {
  private readonly TABLE_NAME = 'm_org_t_credentialing_entity_document';
  private readonly BUCKET = 'credentialing-entity-documents';

  async getDocumentsByEntityId(entityId: number): Promise<CredentialingEntityDocument[]> {
    try {
      const { data, error } = await supabase
        .schema('her')
        .from(this.TABLE_NAME)
        .select('*')
        .eq('s_her_m_org_t_credentialing_entity_c_id', entityId)
        .or('is_deleted.is.null,is_deleted.eq.false')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        throw new Error(`Erro ao buscar documentos: ${error.message}`);
      }

      // Generate signed URLs for private bucket documents
      const documentsWithUrls = await Promise.all(
        (data || []).map(async (doc) => {
          const { data: signedUrlData } = await supabase.storage
            .from(this.BUCKET)
            .createSignedUrl(doc.file_path, 3600); // 1 hour expiration

          return {
            ...doc,
            file_path: signedUrlData?.signedUrl || doc.file_path
          };
        })
      );

      return documentsWithUrls;
    } catch (error) {
      console.error('Error in getDocumentsByEntityId:', error);
      throw error;
    }
  }

  async syncFromStorage(entityId: number): Promise<void> {
    try {
      // List all files in Storage for this entity
      const { data: files, error: listError } = await supabase.storage
        .from(this.BUCKET)
        .list(`${entityId}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (listError) {
        console.error('Error listing files from storage:', listError);
        throw new Error(`Erro ao listar arquivos: ${listError.message}`);
      }

      if (!files || files.length === 0) {
        console.log('No files found in storage for entity:', entityId);
        return;
      }

      // Get existing documents from DB
      const existingDocs = await this.getDocumentsByEntityId(entityId);
      const existingPaths = new Set(existingDocs.map(doc => doc.file_path));

      // Create DB records for files that don't have them
      for (const file of files) {
        const filePath = `${entityId}/${file.name}`;
        
        if (!existingPaths.has(filePath)) {
          console.log('Creating DB record for orphaned file:', filePath);
          
          await this.createDocument({
            title: file.name,
            file_path: filePath,
            mime_type: file.metadata?.mimetype || 'application/octet-stream',
            s_her_m_org_t_credentialing_entity_c_id: entityId
          });
        }
      }

      console.log('Storage sync completed for entity:', entityId);
    } catch (error) {
      console.error('Error in syncFromStorage:', error);
      throw error;
    }
  }

  async createDocument(document: CredentialingEntityDocumentInsert): Promise<CredentialingEntityDocument> {
    try {
      console.info('[Entity Documents] Creating document record:', { 
        entityId: document.s_her_m_org_t_credentialing_entity_c_id,
        filePath: document.file_path 
      });

      const { data, error } = await supabase
        .schema('her')
        .from(this.TABLE_NAME)
        .insert(document)
        .select()
        .single();

      if (error || !data) {
        console.error('[Entity Documents] Database insert failed:', error);
        throw new Error(`Erro ao criar documento: ${error?.message || 'Dados não retornados'}`);
      }

      console.info(`[Entity Documents] Document record created with ID: ${data.id}`);
      return data;
    } catch (error) {
      console.error('[Entity Documents] Error in createDocument:', error);
      throw error;
    }
  }

  async updateDocument(id: number, updates: CredentialingEntityDocumentUpdate): Promise<CredentialingEntityDocument> {
    try {
      const { data, error } = await supabase
        .schema('her')
        .from(this.TABLE_NAME)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        console.error('Error updating document:', error);
        throw new Error(`Erro ao atualizar documento: ${error?.message || 'Dados não retornados'}`);
      }

      return data;
    } catch (error) {
      console.error('Error in updateDocument:', error);
      throw error;
    }
  }

  async deleteDocument(id: number): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .schema('her')
        .from(this.TABLE_NAME)
        .update({
          is_deleted: true,
          deleted_at: now
        })
        .eq('id', id);

      if (error) {
        console.error('Error deleting document:', error);
        throw new Error(`Erro ao deletar documento: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in deleteDocument:', error);
      throw error;
    }
  }

  async uploadFile(file: File, entityId: number): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${entityId}/${Date.now()}.${fileExt}`;

      console.info(`[Entity Documents] Uploading file to bucket: ${this.BUCKET}, path: ${fileName}`);

      const { data, error } = await supabase.storage
        .from(this.BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('[Entity Documents] Upload failed:', error);
        throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);
      }

      console.info(`[Entity Documents] File uploaded successfully: ${data.path}`);
      
      // Return relative path (not public URL)
      return data.path;
    } catch (error) {
      console.error('[Entity Documents] Error in uploadFile:', error);
      throw error;
    }
  }

  async downloadFile(filePath: string): Promise<Blob> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET)
        .download(filePath);

      if (error || !data) {
        console.error('Error downloading file:', error);
        throw new Error(`Erro ao baixar arquivo: ${error?.message || 'Arquivo não encontrado'}`);
      }

      return data;
    } catch (error) {
      console.error('Error in downloadFile:', error);
      throw error;
    }
  }

  async getSignedUrl(filePath: string): Promise<string> {
    // If filePath is already a signed URL, return it as is
    if (filePath.startsWith('http')) {
      return filePath;
    }
    
    const { data, error } = await supabase.storage
      .from(this.BUCKET)
      .createSignedUrl(filePath, 3600); // 1 hour expiration

    if (error) {
      console.error('Error creating signed URL:', error);
      throw new Error(`Erro ao gerar URL: ${error.message}`);
    }

    return data.signedUrl;
  }
}

export const credentialingEntityDocumentsService = new CredentialingEntityDocumentsService();
