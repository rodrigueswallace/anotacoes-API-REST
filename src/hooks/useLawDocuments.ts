import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lawDocumentsService } from "@/services/law-documents.service";
import { CreateLawDocumentInput } from "@/types/law-document.types";

const QUERY_KEY = "law-documents";

export const useLawDocuments = (lawId?: number) => {
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEY, lawId],
    queryFn: () => lawDocumentsService.getByLawId(lawId!),
    enabled: !!lawId,
  });

  const uploadMutation = useMutation({
    mutationFn: (input: CreateLawDocumentInput) => lawDocumentsService.upload(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const updateTitleMutation = useMutation({
    mutationFn: ({ id, title }: { id: number; title: string }) =>
      lawDocumentsService.updateTitle(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, filePath }: { id: number; filePath: string }) =>
      lawDocumentsService.delete(id, filePath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  return {
    documents,
    isLoading,
    refetch,
    uploadDocument: uploadMutation.mutateAsync,
    updateDocumentTitle: updateTitleMutation.mutateAsync,
    deleteDocument: deleteMutation.mutateAsync,
  };
};
