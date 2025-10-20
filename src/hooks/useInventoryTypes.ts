import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryTypesService } from '@/services/inventory-types.service';
import { toLocalFormat, toSupabaseFormat } from '@/types/inventory-type.types';

const QUERY_KEYS = {
  inventoryTypes: ['inventory-types'] as const,
  inventoryType: (id: number) => ['inventory-types', id] as const,
};

export const useInventoryTypes = () => {
  const queryClient = useQueryClient();

  // Query para buscar todos os tipos de inventário
  const {
    data: inventoryTypes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.inventoryTypes,
    queryFn: async () => {
      const data = await inventoryTypesService.getAllInventoryTypes();
      return data.map(toLocalFormat);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para criar tipo de inventário
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const supabaseData = toSupabaseFormat(data) as any;
      return await inventoryTypesService.createInventoryType(supabaseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventoryTypes });
    },
  });

  // Mutation para atualizar tipo de inventário
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const supabaseData = toSupabaseFormat(data) as any;
      return await inventoryTypesService.updateInventoryType(parseInt(id), supabaseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventoryTypes });
    },
  });

  // Mutation para toggle status
  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      return await inventoryTypesService.toggleInventoryTypeStatus(parseInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventoryTypes });
    },
  });

  return {
    // Dados
    inventoryTypes,
    isLoading,
    error,
    
    // Funções
    refetch,
    createInventoryType: createMutation.mutateAsync,
    updateInventoryType: updateMutation.mutateAsync,
    toggleInventoryTypeStatus: toggleStatusMutation.mutateAsync,
    
    // Estados das mutations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isToggling: toggleStatusMutation.isPending,
  };
};

// Hook para buscar um tipo específico por ID
export const useInventoryType = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.inventoryType(id),
    queryFn: async () => {
      const data = await inventoryTypesService.getInventoryTypeById(id);
      return data ? toLocalFormat(data) : null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};