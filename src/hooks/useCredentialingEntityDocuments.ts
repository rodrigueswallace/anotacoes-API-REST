import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { credentialingEntityDocumentsService } from '@/services/credentialing-entity-documents.service';
import type { CredentialingEntityDocumentInsert, CredentialingEntityDocumentUpdate } from '@/types/credentialing-entity.types';
import { toast } from '@/hooks/use-toast';

const QUERY_KEY = 'credentialing-entity-documents';

export const useCredentialingEntityDocuments = (entityId: number | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, entityId],
    queryFn: () => credentialingEntityDocumentsService.getDocumentsByEntityId(entityId!),
    enabled: !!entityId,
  });
};

export const useCreateCredentialingEntityDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (document: CredentialingEntityDocumentInsert) => {
      return credentialingEntityDocumentsService.createDocument(document);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error: Error) => {
      console.error('Error creating document:', error);
    },
  });
};

export const useUpdateCredentialingEntityDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: CredentialingEntityDocumentUpdate }) => {
      return credentialingEntityDocumentsService.updateDocument(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error: Error) => {
      console.error('Error updating document:', error);
    },
  });
};

export const useDeleteCredentialingEntityDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => {
      return credentialingEntityDocumentsService.deleteDocument(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error: Error) => {
      console.error('Error deleting document:', error);
    },
  });
};

export const useUploadCredentialingEntityFile = () => {
  return useMutation({
    mutationFn: ({ file, entityId }: { file: File; entityId: number }) => {
      return credentialingEntityDocumentsService.uploadFile(file, entityId);
    },
    onError: (error: Error) => {
      console.error('Error uploading file:', error);
    },
  });
};
