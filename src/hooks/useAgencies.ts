import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agenciesService } from '@/services/agencies.service';
import { CreateAgencyInput, UpdateAgencyInput } from '@/types/agency.types';

const AGENCIES_QUERY_KEY = 'agencies';

export function useAgencies() {
  const { data: agencies = [], isLoading, error, refetch } = useQuery({
    queryKey: [AGENCIES_QUERY_KEY],
    queryFn: agenciesService.getAllAgencies,
  });

  return {
    agencies,
    isLoading,
    error,
    refetch,
  };
}

export function useAgency(id?: number) {
  return useQuery({
    queryKey: [AGENCIES_QUERY_KEY, id],
    queryFn: () => agenciesService.getAgencyById(id!),
    enabled: !!id,
  });
}

export function useCreateAgency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAgencyInput) => agenciesService.createAgency(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGENCIES_QUERY_KEY] });
    },
  });
}

export function useUpdateAgency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateAgencyInput) => agenciesService.updateAgency(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGENCIES_QUERY_KEY] });
    },
  });
}

export function useGetActiveLinkedUnits(agencyId?: number) {
  return useQuery({
    queryKey: [AGENCIES_QUERY_KEY, agencyId, 'linked-units'],
    queryFn: () => agenciesService.getActiveLinkedUnits(agencyId!),
    enabled: !!agencyId,
  });
}

export function useToggleAgencyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: number; currentStatus: boolean }) =>
      agenciesService.toggleAgencyStatus(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGENCIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
}

export function useToggleAgencyStatusWithCascade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, currentStatus, inactivateUnits }: { id: number; currentStatus: boolean; inactivateUnits: boolean }) =>
      agenciesService.toggleAgencyStatusWithCascade(id, currentStatus, inactivateUnits),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGENCIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
}

export function useCheckEmailExists(email: string, excludeId?: number) {
  return useQuery({
    queryKey: [AGENCIES_QUERY_KEY, 'check-email', email, excludeId],
    queryFn: () => agenciesService.checkEmailExists(email, excludeId),
    enabled: !!email && email.includes('@') && email.length > 5,
    staleTime: 0,
    gcTime: 0,
  });
}
