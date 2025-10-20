import { useQuery } from '@tanstack/react-query';
import { checkFieldUniqueness, CheckUniquenessParams } from '@/services/uniqueness-validation.service';
import { useState, useEffect } from 'react';

interface UseUniquenessValidationParams extends CheckUniquenessParams {
  enabled?: boolean;
  debounceMs?: number;
}

/**
 * Hook customizado para validação de unicidade de campos com debounce
 */
export function useUniquenessValidation({
  tableName,
  fieldName,
  fieldValue,
  excludeId,
  fieldType,
  schema = 'her',
  enabled = true,
  debounceMs = 500
}: UseUniquenessValidationParams) {
  const [debouncedValue, setDebouncedValue] = useState(fieldValue);

  // Implementa debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(fieldValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [fieldValue, debounceMs]);

  // Determina se deve executar a query
  const shouldQuery = enabled && !!debouncedValue && debouncedValue.length > 0;

  const { data: isDuplicate = false, isLoading, error } = useQuery({
    queryKey: ['uniqueness', tableName, fieldName, debouncedValue, excludeId],
    queryFn: () => checkFieldUniqueness({
      tableName,
      fieldName,
      fieldValue: debouncedValue,
      excludeId,
      fieldType,
      schema
    }),
    enabled: shouldQuery,
    staleTime: 0, // Sempre revalidar
    gcTime: 0, // Não manter em cache
    retry: 1,
  });

  return {
    isDuplicate: shouldQuery ? isDuplicate : false,
    isChecking: isLoading,
    error,
  };
}
