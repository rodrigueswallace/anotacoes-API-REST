export const formatCPF = (value: string) => {
  if (typeof value !== 'string') return '';
  const cleanValue = value.replace(/\D/g, '');
  
  // Formata progressivamente desde o primeiro dígito
  if (cleanValue.length === 0) {
    return '';
  } else if (cleanValue.length <= 3) {
    return cleanValue;
  } else if (cleanValue.length <= 6) {
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3)}`;
  } else if (cleanValue.length <= 9) {
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6)}`;
  } else {
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6, 9)}-${cleanValue.slice(9, 11)}`;
  }
};

export const formatCNPJ = (value: string) => {
  if (typeof value !== 'string') return '';
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length <= 14) {
    return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return cleanValue.slice(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

export const formatTelefone = (value: string) => {
  if (typeof value !== 'string') return '';
  const cleanValue = value.replace(/\D/g, '');
  
  // Formata progressivamente desde o primeiro dígito
  if (cleanValue.length === 0) {
    return '';
  } else if (cleanValue.length <= 2) {
    return `(${cleanValue}`;
  } else if (cleanValue.length <= 6) {
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`;
  } else if (cleanValue.length <= 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 6)}-${cleanValue.slice(6, 10)}`;
  } else {
    // Celular: (XX) XXXXX-XXXX
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2, 7)}-${cleanValue.slice(7, 11)}`;
  }
};

export const formatCPFOrCNPJ = (value: string) => {
  if (typeof value !== 'string') return '';
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length <= 11) {
    return formatCPF(value);
  }
  return formatCNPJ(value);
};

export const formatCEP = (value: string) => {
  if (typeof value !== 'string') return '';
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length <= 5) {
    return cleanValue;
  }
  return cleanValue.slice(0, 8).replace(/(\d{5})(\d{0,3})/, '$1-$2');
};

export const formatUF = (value: string) => {
  if (typeof value !== 'string') return '';
  return value.toUpperCase().slice(0, 2);
};

export const formatMatricula = (value: string) => {
  if (typeof value !== 'string') return '';
  const cleanValue = value.replace(/\D/g, '');
  return cleanValue.slice(0, 8);
};

export const validateMatricula = (value: string) => {
  if (typeof value !== 'string') return 'Matrícula inválida';
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length !== 8) {
    return 'Matrícula deve conter exatamente 8 dígitos';
  }
  return null;
};

export const formatNumeroEndereco = (value: string) => {
  if (typeof value !== 'string') return '';
  
  // Aceita apenas números ou "SN"/"sn"
  const upperValue = value.toUpperCase();
  
  // Se começar com "S", permitir apenas "SN"
  if (upperValue.startsWith('S')) {
    if (upperValue.length === 1) return 'S';
    if (upperValue.length >= 2) return 'SN';
  }
  
  // Caso contrário, aceitar apenas números (máximo 10 caracteres)
  const cleanValue = value.replace(/\D/g, '');
  return cleanValue.slice(0, 10);
};

export const formatNumeroLei = (value: string) => {
  if (typeof value !== 'string') return '';
  
  // Remove todos os caracteres não numéricos
  const cleanValue = value.replace(/\D/g, '');
  
  // Limita a 9 dígitos (2 + 3 + 4)
  const limitedValue = cleanValue.slice(0, 9);
  
  // Aplica a máscara: 99.999/9999
  if (limitedValue.length <= 2) {
    return limitedValue;
  } else if (limitedValue.length <= 5) {
    return `${limitedValue.slice(0, 2)}.${limitedValue.slice(2)}`;
  } else {
    return `${limitedValue.slice(0, 2)}.${limitedValue.slice(2, 5)}/${limitedValue.slice(5)}`;
  }
};