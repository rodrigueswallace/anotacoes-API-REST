import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fundingSourcesService } from '@/services/funding-sources.service';
import type { FundingSource, FundingSourceInsert, FundingSourceUpdate } from '@/types/funding-source.types';
import { toSupabaseFormat, toSupabaseUpdateFormat } from '@/types/funding-source.types';

const FUNDING_SOURCES_QUERY_KEY = 'funding-sources';

export const useFundingSources = () => {
  return useQuery({
    queryKey: [FUNDING_SOURCES_QUERY_KEY],
    queryFn: fundingSourcesService.getAllFundingSources,
  });
};

export const useFundingSource = (id: string) => {
  return useQuery({
    queryKey: [FUNDING_SOURCES_QUERY_KEY, id],
    queryFn: () => fundingSourcesService.getFundingSourceById(id),
    enabled: !!id,
  });
};

export const useCreateFundingSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fundingSourceData: Partial<FundingSource>) => {
      const supabaseData = toSupabaseFormat(fundingSourceData);
      return fundingSourcesService.createFundingSource(supabaseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FUNDING_SOURCES_QUERY_KEY] });
    },
  });
};

export const useUpdateFundingSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FundingSource> }) => {
      const supabaseData = toSupabaseUpdateFormat(data);
      return fundingSourcesService.updateFundingSource(id, supabaseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FUNDING_SOURCES_QUERY_KEY] });
    },
  });
};

export const useToggleFundingSourceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isDeleted }: { id: string; isDeleted: boolean }) => {
      return fundingSourcesService.toggleFundingSourceStatus(id, isDeleted);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FUNDING_SOURCES_QUERY_KEY] });
    },
  });
};