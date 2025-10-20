import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agreementsService } from '@/services/agreements.service';
import type { AgreementLocal } from '@/types/agreement.types';
import { toSupabaseInsertFormat, toSupabaseUpdateFormat } from '@/types/agreement.types';

const AGREEMENTS_QUERY_KEY = 'agreements';

export const useAgreements = () => {
  return useQuery({
    queryKey: [AGREEMENTS_QUERY_KEY],
    queryFn: () => agreementsService.getAllAgreements(),
  });
};

export const useAgreement = (id: string) => {
  return useQuery({
    queryKey: [AGREEMENTS_QUERY_KEY, id],
    queryFn: () => agreementsService.getAgreementById(id),
    enabled: !!id,
  });
};

export const useCreateAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agreementData: Partial<AgreementLocal>) => {
      const supabaseData = toSupabaseInsertFormat(agreementData);
      return agreementsService.createAgreement(supabaseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGREEMENTS_QUERY_KEY] });
    },
  });
};

export const useUpdateAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AgreementLocal> }) => {
      const supabaseData = toSupabaseUpdateFormat(data);
      return agreementsService.updateAgreement(id, supabaseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGREEMENTS_QUERY_KEY] });
    },
  });
};

export const useToggleAgreementStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isDeleted }: { id: string; isDeleted: boolean }) => {
      return agreementsService.toggleAgreementStatus(id, isDeleted);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGREEMENTS_QUERY_KEY] });
    },
  });
};

export const useCheckAgreementCode = () => {
  return useMutation({
    mutationFn: ({ code, excludeId }: { code: string; excludeId?: string }) =>
      agreementsService.checkCodeExists(code, excludeId),
  });
};

export const useCheckAgreementCNPJ = () => {
  return useMutation({
    mutationFn: ({ cnpj, excludeId }: { cnpj: string; excludeId?: string }) =>
      agreementsService.checkCNPJExists(cnpj, excludeId),
  });
};
