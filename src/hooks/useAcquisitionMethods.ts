import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { acquisitionMethodsService } from '@/services/acquisition-methods.service';
import { toLocalFormat, toSupabaseFormat } from '@/types/acquisition-method.types';

const QUERY_KEYS = {
  acquisitionMethods: ['acquisition-methods'] as const,
  acquisitionMethod: (id: number) => ['acquisition-methods', id] as const,
};

export const useAcquisitionMethods = () => {
  const queryClient = useQueryClient();

  // Query para buscar todos os métodos de aquisição
  const {
    data: methods = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.acquisitionMethods,
    queryFn: async () => {
      const data = await acquisitionMethodsService.getAllAcquisitionMethods();
      return data.map(toLocalFormat);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para criar método de aquisição
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const supabaseData = toSupabaseFormat(data) as any;
      return await acquisitionMethodsService.createAcquisitionMethod(supabaseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.acquisitionMethods });
    },
  });

  // Mutation para atualizar método de aquisição
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const supabaseData = toSupabaseFormat(data) as any;
      return await acquisitionMethodsService.updateAcquisitionMethod(parseInt(id), supabaseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.acquisitionMethods });
    },
  });

  // Mutation para toggle status
  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      return await acquisitionMethodsService.toggleAcquisitionMethodStatus(parseInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.acquisitionMethods });
    },
  });

  return {
    // Dados
    methods,
    isLoading,
    error,
    
    // Funções
    refetch,
    createAcquisitionMethod: createMutation.mutateAsync,
    updateAcquisitionMethod: updateMutation.mutateAsync,
    toggleAcquisitionMethodStatus: toggleStatusMutation.mutateAsync,
    checkCodeExists: acquisitionMethodsService.checkCodeExists,
    
    // Estados das mutations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isToggling: toggleStatusMutation.isPending,
  };
};

// Hook para buscar um método específico por ID
export const useAcquisitionMethod = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.acquisitionMethod(id),
    queryFn: async () => {
      const data = await acquisitionMethodsService.getAcquisitionMethodById(id);
      return data ? toLocalFormat(data) : null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
