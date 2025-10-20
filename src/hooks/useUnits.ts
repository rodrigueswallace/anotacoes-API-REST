import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as unitsService from '@/services/units.service';
import { CreateUnitInput, UpdateUnitInput } from '@/types/unit.types';

export const useUnits = () => {
  const { data: units = [], isLoading, error, refetch } = useQuery({
    queryKey: ['units'],
    queryFn: unitsService.getAllUnits,
  });

  return {
    units,
    isLoading,
    error,
    refetch,
  };
};

export const useUnit = (id?: number) => {
  return useQuery({
    queryKey: ['units', id],
    queryFn: () => unitsService.getUnitById(id!),
    enabled: !!id,
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUnitInput) => unitsService.createUnit(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
};

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUnitInput) => unitsService.updateUnit(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
};

export const useToggleUnitStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: number; currentStatus: boolean }) =>
      unitsService.toggleUnitStatus(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });
};
