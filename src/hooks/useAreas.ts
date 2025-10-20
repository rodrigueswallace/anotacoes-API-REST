import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { areasService } from '@/services/areas.service';
import { Area } from '@/types/area.types';

const AREAS_QUERY_KEY = 'areas';

export function useAreas() {
  return useQuery({
    queryKey: [AREAS_QUERY_KEY],
    queryFn: areasService.getAllAreas,
  });
}

export function useArea(id: number) {
  return useQuery({
    queryKey: [AREAS_QUERY_KEY, id],
    queryFn: () => areasService.getAreaById(id),
    enabled: !!id,
  });
}

export function useCreateArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: areasService.createArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AREAS_QUERY_KEY] });
    },
  });
}

export function useUpdateArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Area, 'id' | 'data_criacao'>> }) =>
      areasService.updateArea(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AREAS_QUERY_KEY] });
    },
  });
}

export function useToggleAreaStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isDeleted }: { id: number; isDeleted: boolean }) =>
      areasService.toggleAreaStatus(id, isDeleted),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AREAS_QUERY_KEY] });
    },
  });
}