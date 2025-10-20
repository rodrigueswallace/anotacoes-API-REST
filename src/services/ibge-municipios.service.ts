import { normalizeCityName } from '@/lib/string-utils';
import { municipiosPorUF } from '@/lib/municipios-brasil';

export interface MunicipioIBGE {
  id: number;
  nome: string;
}

export interface MunicipioOption {
  value: string;
  label: string;
}

// Cache em memória para evitar requisições repetidas
const municipiosCache: Map<string, MunicipioOption[]> = new Map();

/**
 * Busca municípios de uma UF na API do IBGE
 * Retorna lista completa de municípios com fallback para lista local
 */
export const fetchMunicipiosByUF = async (uf: string): Promise<MunicipioOption[]> => {
  if (!uf || uf.length !== 2) {
    return [];
  }

  const ufUpperCase = uf.toUpperCase();

  // Verifica cache primeiro
  if (municipiosCache.has(ufUpperCase)) {
    return municipiosCache.get(ufUpperCase)!;
  }

  try {
    // Consulta API do IBGE
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufUpperCase}/municipios`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`IBGE API returned status ${response.status}`);
    }

    const data: MunicipioIBGE[] = await response.json();

    // Transforma resposta do IBGE para o formato esperado
    const municipios: MunicipioOption[] = data
      .map((mun) => ({
        value: normalizeCityName(mun.nome),
        label: mun.nome,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));

    // Armazena no cache
    municipiosCache.set(ufUpperCase, municipios);

    return municipios;
  } catch (error) {
    // Fallback para lista local
    const fallbackMunicipios = municipiosPorUF[ufUpperCase] || [];
    
    // Armazena fallback no cache para evitar novas tentativas
    municipiosCache.set(ufUpperCase, fallbackMunicipios);

    return fallbackMunicipios;
  }
};

/**
 * Limpa o cache de municípios
 * Útil para forçar atualização dos dados
 */
export const clearMunicipiosCache = () => {
  municipiosCache.clear();
};

/**
 * Pré-carrega municípios de uma UF
 * Útil para melhorar UX quando sabemos que o usuário precisará dos dados
 */
export const prefetchMunicipiosByUF = (uf: string) => {
  fetchMunicipiosByUF(uf).catch((error) => {
    console.warn(`Erro ao pré-carregar municípios de ${uf}:`, error);
  });
};
