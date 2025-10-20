export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface AddressData {
  logradouro: string;
  bairro: string;
  cidade: string;
  cidadeNormalizada: string; // Versão normalizada para matching
  uf: string;
}

import { normalizeCityName } from '@/lib/string-utils';

export class ViaCEPService {
  private static readonly BASE_URL = 'https://viacep.com.br/ws';

  static async searchCEP(cep: string): Promise<AddressData | null> {
    // Remove caracteres não numéricos
    const cleanCEP = cep.replace(/\D/g, '');
    
    // Valida formato do CEP brasileiro (8 dígitos)
    if (cleanCEP.length !== 8) {
      throw new Error('CEP deve conter 8 dígitos');
    }

    try {
      const response = await fetch(`${this.BASE_URL}/${cleanCEP}/json/`);
      
      if (!response.ok) {
        throw new Error('Erro na consulta do CEP');
      }

      const data: ViaCEPResponse = await response.json();
      
      // ViaCEP retorna erro: true quando CEP não existe
      if (data.erro) {
        return null;
      }

      return {
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        cidadeNormalizada: normalizeCityName(data.localidade),
        uf: data.uf
      };
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      throw error;
    }
  }
}