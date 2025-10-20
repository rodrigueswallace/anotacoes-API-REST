import { useState, useCallback, useRef } from 'react';
import { ViaCEPService, AddressData } from '@/services/viacep.service';

interface UseCEPLookupReturn {
  isLoading: boolean;
  error: string | null;
  lookupCEP: (cep: string) => Promise<AddressData | null>;
  clearError: () => void;
}

export const useCEPLookup = (): UseCEPLookupReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Record<string, AddressData | null>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const lookupCEP = useCallback(async (cep: string): Promise<AddressData | null> => {
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (!cep || cleanCEP.length !== 8) {
      return null;
    }

    // Verificar cache
    if (cacheRef.current[cleanCEP] !== undefined) {
      return cacheRef.current[cleanCEP];
    }

    setIsLoading(true);
    setError(null);

    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      // Adicionar timeout de 10 segundos
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error('Tempo limite excedido'));
        }, 10000);
      });

      const result = await Promise.race([
        ViaCEPService.searchCEP(cep),
        timeoutPromise
      ]);
      
      // Limpar timeout se sucesso
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Armazenar no cache
      cacheRef.current[cleanCEP] = result;
      
      if (!result) {
        setError('CEP não encontrado');
        return null;
      }

      return result;
    } catch (err) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar CEP';
      setError(errorMessage);
      
      // Cache do erro também
      cacheRef.current[cleanCEP] = null;
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    lookupCEP,
    clearError
  };
};