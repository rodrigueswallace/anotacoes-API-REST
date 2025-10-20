import { supabase } from '@/integrations/supabase/client';

/**
 * Normaliza valores de campos para comparação consistente
 */
function normalizeFieldValue(value: string, fieldType?: 'email' | 'cpf' | 'cnpj' | 'code'): string {
  if (!value) return '';
  
  const trimmed = value.trim();
  
  switch (fieldType) {
    case 'email':
      return trimmed.toLowerCase();
    case 'cpf':
    case 'cnpj':
      return trimmed.replace(/\D/g, ''); // Remove tudo exceto dígitos
    case 'code':
      return trimmed.toUpperCase();
    default:
      return trimmed;
  }
}

export interface CheckUniquenessParams {
  tableName: string;
  fieldName: string;
  fieldValue: string;
  excludeId?: number;
  fieldType?: 'email' | 'cpf' | 'cnpj' | 'code';
  schema?: string;
}

/**
 * Verifica se um valor de campo já existe na tabela do Supabase
 * @returns true se o valor já existe (duplicado), false se está livre
 */
export async function checkFieldUniqueness({
  tableName,
  fieldName,
  fieldValue,
  excludeId,
  fieldType,
  schema = 'her'
}: CheckUniquenessParams): Promise<boolean> {
  if (!fieldValue) return false;

  const normalizedValue = normalizeFieldValue(fieldValue, fieldType);
  if (!normalizedValue) return false;

  try {
    // Constrói a query dinamicamente
    let query = supabase
      .from(tableName)
      .select('id')
      .eq(fieldName, normalizedValue)
      .eq('is_deleted', false);

    // Exclui o próprio registro no modo de edição
    if (excludeId !== undefined && excludeId !== null) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error('Erro ao verificar unicidade:', error);
      throw error;
    }

    // Retorna true se encontrou um registro (duplicado)
    return !!data;
  } catch (error) {
    console.error('Erro ao verificar unicidade do campo:', error);
    throw error;
  }
}

/**
 * Helpers específicos para casos comuns
 */
export const uniquenessValidationService = {
  checkEmail: (tableName: string, email: string, excludeId?: number) =>
    checkFieldUniqueness({
      tableName,
      fieldName: 'email',
      fieldValue: email,
      excludeId,
      fieldType: 'email'
    }),

  checkCNPJ: (tableName: string, cnpj: string, excludeId?: number) =>
    checkFieldUniqueness({
      tableName,
      fieldName: 'cnpj',
      fieldValue: cnpj,
      excludeId,
      fieldType: 'cnpj'
    }),

  checkCPF: (tableName: string, cpf: string, excludeId?: number) =>
    checkFieldUniqueness({
      tableName,
      fieldName: 'cpf',
      fieldValue: cpf,
      excludeId,
      fieldType: 'cpf'
    }),

  checkCode: (tableName: string, code: string, excludeId?: number) =>
    checkFieldUniqueness({
      tableName,
      fieldName: 'agency_code',
      fieldValue: code,
      excludeId,
      fieldType: 'code'
    })
};
