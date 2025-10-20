import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { credentialingEntitiesService } from '@/services/credentialing-entities.service';
import type { CredentialingEntityLocal } from '@/types/credentialing-entity.types';

const QUERY_KEY = 'credentialing-entities';

export const useCredentialingEntities = () => {
  const queryClient = useQueryClient();

  const { data: entities = [], isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => credentialingEntitiesService.getAllCredentialingEntities(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<CredentialingEntityLocal>) =>
      credentialingEntitiesService.createCredentialingEntity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CredentialingEntityLocal> }) =>
      credentialingEntitiesService.updateCredentialingEntity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => credentialingEntitiesService.toggleCredentialingEntityStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  return {
    entities,
    isLoading,
    error,
    refetch,
    createEntity: createMutation.mutateAsync,
    updateEntity: updateMutation.mutateAsync,
    toggleStatus: toggleStatusMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isTogglingStatus: toggleStatusMutation.isPending,
    checkCNPJExists: (cnpj: string, excludeId?: number) => 
      credentialingEntitiesService.checkCNPJExists(cnpj, excludeId),
    checkEmailExists: (email: string, excludeId?: number) => 
      credentialingEntitiesService.checkEmailExists(email, excludeId),
    checkPhoneExists: (phone: string, excludeId?: number) => 
      credentialingEntitiesService.checkPhoneExists(phone, excludeId),
  };
};

export const useCredentialingEntity = (id?: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => credentialingEntitiesService.getCredentialingEntityById(id!),
    enabled: !!id,
  });
};
