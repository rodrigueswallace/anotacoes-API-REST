import React, { useState, useMemo } from 'react';
import { FormSearchableSelect, FormSearchableSelectOption } from './form-searchable-select';
import { normalizeCityName } from '@/lib/string-utils';

interface FormSelectWithDynamicProps {
  value: string;
  onValueChange: (value: string) => void;
  staticOptions: FormSearchableSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

/**
 * Select que aceita valores dinâmicos além das opções estáticas
 * Faz matching normalizado de nomes de municípios
 */
export const FormSelectWithDynamic: React.FC<FormSelectWithDynamicProps> = ({
  value,
  onValueChange,
  staticOptions,
  placeholder,
  disabled,
  error,
  className
}) => {
  const [dynamicOptions, setDynamicOptions] = useState<FormSearchableSelectOption[]>([]);

  // Combina opções estáticas e dinâmicas
  const allOptions = useMemo(() => {
    const combined = [...staticOptions, ...dynamicOptions];
    // Remove duplicatas baseado no value normalizado
    const seen = new Set<string>();
    return combined.filter(option => {
      const normalizedValue = normalizeCityName(option.value);
      if (seen.has(normalizedValue)) {
        return false;
      }
      seen.add(normalizedValue);
      return true;
    });
  }, [staticOptions, dynamicOptions]);

  // Encontra o value correspondente ou cria um novo
  const findOrCreateValue = (searchValue: string): string => {
    if (!searchValue) return '';

    const normalized = normalizeCityName(searchValue);
    
    // Procura nas opções existentes
    const existing = allOptions.find(
      opt => normalizeCityName(opt.value) === normalized || 
             normalizeCityName(opt.label) === normalized
    );

    if (existing) {
      return existing.value;
    }

    // Cria uma nova opção dinâmica
    const newOption: FormSearchableSelectOption = {
      value: searchValue,
      label: searchValue
    };

    setDynamicOptions(prev => {
      // Verifica se já existe antes de adicionar
      const alreadyExists = prev.some(
        opt => normalizeCityName(opt.value) === normalized
      );
      if (alreadyExists) return prev;
      return [...prev, newOption];
    });

    return searchValue;
  };

  // Garante que o valor atual está nas opções
  useMemo(() => {
    if (value && !allOptions.find(opt => opt.value === value)) {
      findOrCreateValue(value);
    }
  }, [value, allOptions]);

  const handleValueChange = (newValue: string) => {
    const finalValue = findOrCreateValue(newValue);
    onValueChange(finalValue);
  };

  return (
    <FormSearchableSelect
      options={allOptions}
      value={value}
      onValueChange={handleValueChange}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      className={className}
    />
  );
};
