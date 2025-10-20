/**
 * Utilitários para normalização de strings
 */

/**
 * Normaliza uma string removendo acentos, pontuação e convertendo para minúsculas
 * @param str - String a ser normalizada
 * @returns String normalizada
 */
export const normalizeString = (str: string): string => {
  if (!str) return '';
  
  return str
    .toLowerCase() // Converter para minúsculas
    .normalize('NFD') // Decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remover diacríticos (acentos)
    .replace(/[^\w\s]/g, '') // Remover pontuação exceto espaços e letras/números
    .trim(); // Remover espaços extras no início e fim
};

/**
 * Normaliza especificamente nomes de municípios/cidades
 * Remove prefixos comuns, acentos e converte para formato consistente
 * @param cityName - Nome da cidade a ser normalizado
 * @returns Nome da cidade normalizado
 */
export const normalizeCityName = (cityName: string): string => {
  if (!cityName) return '';
  
  let normalized = cityName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .trim();
  
  // Remove prefixos comuns de municípios
  const prefixes = [
    'municipio de ',
    'municipio do ',
    'municipio da ',
    'municipio dos ',
    'municipio das '
  ];
  
  for (const prefix of prefixes) {
    if (normalized.startsWith(prefix)) {
      normalized = normalized.substring(prefix.length);
      break;
    }
  }
  
  // Remove espaços extras
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
};

/**
 * Verifica se uma string contém outra, ignorando acentos, maiúsculas e pontuação
 * @param haystack - String onde buscar
 * @param needle - String a ser procurada
 * @returns true se a needle está contida na haystack
 */
export const containsNormalized = (haystack: string, needle: string): boolean => {
  const normalizedHaystack = normalizeString(haystack);
  const normalizedNeedle = normalizeString(needle);
  
  return normalizedHaystack.includes(normalizedNeedle);
};