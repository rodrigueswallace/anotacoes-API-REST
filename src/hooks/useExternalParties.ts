import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExternalPartiesService } from '@/services/external-parties.service';
import type { ExternalPartyLocal } from '@/types/external-party.types';

const QUERY_KEY = 'external-parties';

export function useExternalParties() {
  const queryClient = useQueryClient();

  // Query para buscar todos os fornecedores/terceiros
  const {
    data: externalParties = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => ExternalPartiesService.getAllExternalParties(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutation para criar fornecedor/terceiro
  const createMutation = useMutation({
    mutationFn: (data: Partial<ExternalPartyLocal>) =>
      ExternalPartiesService.createExternalParty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  // Mutation para atualizar fornecedor/terceiro
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ExternalPartyLocal> }) =>
      ExternalPartiesService.updateExternalParty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  // Mutation para alternar status
  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => ExternalPartiesService.toggleExternalPartyStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  return {
    externalParties,
    isLoading,
    error,
    refetch,
    createExternalParty: createMutation.mutateAsync,
    updateExternalParty: updateMutation.mutateAsync,
    toggleStatus: toggleStatusMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isTogglingStatus: toggleStatusMutation.isPending,
  };
}

export function useExternalParty(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => ExternalPartiesService.getExternalPartyById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
