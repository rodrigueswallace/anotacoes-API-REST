import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetConditionsService } from '@/services/asset-conditions.service';
import { AssetConditionInsert, AssetConditionUpdate, toLocalFormat, toSupabaseFormat } from '@/types/asset-condition.types';

const QUERY_KEYS = {
  assetConditions: ['asset-conditions'] as const,
  assetCondition: (id: number) => ['asset-conditions', id] as const,
};

export const useAssetConditions = () => {
  const queryClient = useQueryClient();

  // Query para buscar todos os estados de conservação
  const {
    data: conditions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.assetConditions,
    queryFn: async () => {
      const data = await assetConditionsService.getAllAssetConditions();
      return data.map(toLocalFormat);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para criar estado de conservação
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const supabaseData = toSupabaseFormat(data);
      return await assetConditionsService.createAssetCondition(supabaseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assetConditions });
    },
  });

  // Mutation para atualizar estado de conservação
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const supabaseData = toSupabaseFormat(data);
      return await assetConditionsService.updateAssetCondition(parseInt(id), supabaseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assetConditions });
    },
  });

  // Mutation para toggle status
  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      return await assetConditionsService.toggleAssetConditionStatus(parseInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assetConditions });
    },
  });

  // Mutation para deletar (soft delete)
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await assetConditionsService.deleteAssetCondition(parseInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assetConditions });
    },
  });

  return {
    // Dados
    conditions,
    isLoading,
    error,
    
    // Funções
    refetch,
    createAssetCondition: createMutation.mutateAsync,
    updateAssetCondition: updateMutation.mutateAsync,
    toggleAssetConditionStatus: toggleStatusMutation.mutateAsync,
    deleteAssetCondition: deleteMutation.mutateAsync,
    
    // Estados das mutations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isToggling: toggleStatusMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Hook para buscar um estado específico por ID
export const useAssetCondition = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.assetCondition(id),
    queryFn: async () => {
      const data = await assetConditionsService.getAssetConditionById(id);
      return data ? toLocalFormat(data) : null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};