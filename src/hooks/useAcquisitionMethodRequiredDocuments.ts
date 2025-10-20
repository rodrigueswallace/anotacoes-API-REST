import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { acquisitionMethodRequiredDocumentsService } from '@/services/acquisition-method-required-documents.service';

export const useAcquisitionMethodRequiredDocuments = (methodId: number) => {
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery({
    queryKey: ['acquisition-method-required-documents', methodId],
    queryFn: () => acquisitionMethodRequiredDocumentsService.getDocumentsByMethodId(methodId),
    enabled: !!methodId,
  });

  const syncDocuments = useMutation({
    mutationFn: ({ methodId, documentNames }: { methodId: number; documentNames: string[] }) =>
      acquisitionMethodRequiredDocumentsService.syncDocuments(methodId, documentNames),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acquisition-method-required-documents', methodId] });
      queryClient.invalidateQueries({ queryKey: ['acquisition-methods'] });
    },
  });

  return {
    documents,
    isLoading,
    syncDocuments: syncDocuments.mutate,
    isSyncing: syncDocuments.isPending,
  };
};
