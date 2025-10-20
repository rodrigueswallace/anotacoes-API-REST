import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agreementDocumentsService } from '@/services/agreement-documents.service';
import type { AgreementDocumentInsert, AgreementDocumentUpdate } from '@/types/agreement-document.types';

const AGREEMENT_DOCUMENTS_QUERY_KEY = 'agreement-documents';

export const useAgreementDocuments = (agreementId: string | null) => {
  return useQuery({
    queryKey: [AGREEMENT_DOCUMENTS_QUERY_KEY, agreementId],
    queryFn: () => agreementDocumentsService.getDocumentsByAgreementId(agreementId!),
    enabled: !!agreementId,
    refetchOnWindowFocus: false,
  });
};

export const useCreateAgreementDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (document: AgreementDocumentInsert) => {
      return agreementDocumentsService.createDocument(document);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGREEMENT_DOCUMENTS_QUERY_KEY] });
    },
  });
};

export const useUpdateAgreementDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: AgreementDocumentUpdate }) => {
      return agreementDocumentsService.updateDocument(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGREEMENT_DOCUMENTS_QUERY_KEY] });
    },
  });
};

export const useDeleteAgreementDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return agreementDocumentsService.deleteDocument(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGREEMENT_DOCUMENTS_QUERY_KEY] });
    },
  });
};

export const useUploadAgreementFile = () => {
  return useMutation({
    mutationFn: ({ file, agreementId }: { file: File; agreementId: string }) => {
      return agreementDocumentsService.uploadFile(file, agreementId);
    },
  });
};
