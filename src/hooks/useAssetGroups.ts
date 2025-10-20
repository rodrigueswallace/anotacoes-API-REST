import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetGroupsService } from '@/services/asset-groups.service';
import { AssetGroupInsert, AssetGroupUpdate, toLocalFormat, toSupabaseFormat } from '@/types/asset-group.types';

const QUERY_KEYS = {
  assetGroups: ['asset-groups'] as const,
  assetGroup: (id: number) => ['asset-groups', id] as const,
};

export const useAssetGroups = () => {
  const queryClient = useQueryClient();

  // Query para buscar todos os grupos de bem
  const {
    data: groups = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.assetGroups,
    queryFn: async () => {
      const data = await assetGroupsService.getAllAssetGroups();
      return data.map(toLocalFormat);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para criar grupo de bem
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const supabaseData = toSupabaseFormat(data);
      return await assetGroupsService.createAssetGroup(supabaseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assetGroups });
    },
  });

  // Mutation para atualizar grupo de bem
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const supabaseData = toSupabaseFormat(data);
      return await assetGroupsService.updateAssetGroup(parseInt(id), supabaseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assetGroups });
    },
  });

  // Mutation para toggle status
  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      return await assetGroupsService.toggleAssetGroupStatus(parseInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assetGroups });
    },
  });

  return {
    // Dados
    groups,
    isLoading,
    error,
    
    // Funções
    refetch,
    createAssetGroup: createMutation.mutateAsync,
    updateAssetGroup: updateMutation.mutateAsync,
    toggleAssetGroupStatus: toggleStatusMutation.mutateAsync,
    
    // Estados das mutations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isToggling: toggleStatusMutation.isPending,
  };
};

// Hook para buscar um grupo específico por ID
export const useAssetGroup = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.assetGroup(id),
    queryFn: async () => {
      const data = await assetGroupsService.getAssetGroupById(id);
      return data ? toLocalFormat(data) : null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
