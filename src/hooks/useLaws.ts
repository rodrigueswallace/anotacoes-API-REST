import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lawsService } from "@/services/laws.service";
import { CreateLawInput, UpdateLawInput } from "@/types/law.types";
import { toast } from "@/hooks/use-toast";

const QUERY_KEY = "laws";

export const useLaws = () => {
  const queryClient = useQueryClient();

  const { data: laws = [], isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => lawsService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateLawInput) => lawsService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: UpdateLawInput) => lawsService.update(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, currentStatus }: { id: number; currentStatus: boolean }) =>
      lawsService.toggleStatus(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  return {
    laws,
    isLoading,
    error,
    refetch,
    createLaw: createMutation.mutateAsync,
    updateLaw: updateMutation.mutateAsync,
    toggleStatus: toggleStatusMutation.mutateAsync,
  };
};
