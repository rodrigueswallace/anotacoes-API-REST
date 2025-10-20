import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetSubgroupsService } from '@/services/asset-subgroups.service';
import { AssetSubgroupInsert, AssetSubgroupUpdate, toLocalFormat, toSupabaseFormat } from '@/types/asset-subgroup.types';

const QUERY_KEYS = {
  assetSubgroups: ['asset-subgroups'] as const,
  assetSubgroup: (id: number) => ['asset-subgroups', id] as const,
  assetSubgroupsByGroup: (groupId: number) => ['asset-subgroups', 'by-group', groupId] as const,
};

export const useAssetSubgroups = () => {
  const queryClient = useQueryClient();

  // Query para buscar todos os subgrupos de bem
  const {
    data: subgroups = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.assetSubgroups,
    queryFn: async () => {
      const data = await assetSubgroupsService.getAllAssetSubgroups();
      return data.map(toLocalFormat);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para criar subgrupo de bem
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const supabaseData = toSupabaseFormat(data);
      return await assetSubgroupsService.createAssetSubgroup(supabaseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assetSubgroups });
    },
  });

  // Mutation para atualizar subgrupo de bem
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const supabaseData = toSupabaseFormat(data);
      return await assetSubgroupsService.updateAssetSubgroup(parseInt(id), supabaseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assetSubgroups });
    },
  });

  // Mutation para toggle status
  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      return await assetSubgroupsService.toggleAssetSubgroupStatus(parseInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assetSubgroups });
    },
  });

  return {
    // Dados
    subgroups,
    isLoading,
    error,
    
    // Funções
    refetch,
    createAssetSubgroup: createMutation.mutateAsync,
    updateAssetSubgroup: updateMutation.mutateAsync,
    toggleAssetSubgroupStatus: toggleStatusMutation.mutateAsync,
    
    // Estados das mutations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isToggling: toggleStatusMutation.isPending,
  };
};

// Hook para buscar um subgrupo específico por ID
export const useAssetSubgroup = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.assetSubgroup(id),
    queryFn: async () => {
      const data = await assetSubgroupsService.getAssetSubgroupById(id);
      return data ? toLocalFormat(data) : null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar subgrupos de um grupo específico
export const useAssetSubgroupsByGroup = (groupId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.assetSubgroupsByGroup(groupId),
    queryFn: async () => {
      const data = await assetSubgroupsService.getAssetSubgroupsByGroupId(groupId);
      return data.map(toLocalFormat);
    },
    enabled: !!groupId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
