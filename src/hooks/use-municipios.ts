import { useState, useEffect } from 'react';
import { fetchMunicipiosByUF } from '@/services/ibge-municipios.service';

export interface MunicipioOption {
  value: string;
  label: string;
}

export interface UseMunicipiosReturn {
  municipios: MunicipioOption[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook para buscar municípios de uma UF usando a API do IBGE
 * Retorna lista completa de municípios com loading e error states
 */
export const useMunicipios = (uf: string): UseMunicipiosReturn => {
  const [municipios, setMunicipios] = useState<MunicipioOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset quando UF muda
    if (!uf || uf.length !== 2) {
      setMunicipios([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const loadMunicipios = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchMunicipiosByUF(uf);
        setMunicipios(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar municípios';
        setError(errorMessage);
        setMunicipios([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMunicipios();
  }, [uf]);

  return {
    municipios,
    isLoading,
    error,
  };
};
