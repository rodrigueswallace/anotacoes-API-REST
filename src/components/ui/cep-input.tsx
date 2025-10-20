import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FormInput } from './form-input';
import { useCEPLookup } from '@/hooks/use-cep-lookup';
import { formatCEP } from '@/lib/formatters';
import { Loader2, MapPin, AlertCircle } from 'lucide-react';

interface CEPInputProps {
  value: string;
  onChange: (value: string) => void;
  onAddressFound: (address: {
    logradouro: string;
    bairro: string;
    cidade: string;
    cidadeNormalizada: string;
    uf: string;
  }) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const CEPInput: React.FC<CEPInputProps> = ({
  value,
  onChange,
  onAddressFound,
  error: externalError,
  placeholder = "00000-000",
  disabled = false
}) => {
  const { isLoading, error: lookupError, lookupCEP, clearError } = useCEPLookup();
  const [lastSearchedCEP, setLastSearchedCEP] = useState('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleCEPChange = (newValue: string) => {
    const formatted = formatCEP(newValue);
    onChange(formatted);
    
    // Limpa erro quando usuário começa a digitar
    if (lookupError) {
      clearError();
    }
  };

  const debouncedLookup = useCallback((cepValue: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      const cleanCEP = cepValue.replace(/\D/g, '');
      
      if (cleanCEP.length === 8 && cleanCEP !== lastSearchedCEP) {
        setLastSearchedCEP(cleanCEP);
        
        const address = await lookupCEP(cepValue);
        if (address) {
          onAddressFound(address);
        }
      }
    }, 500);
  }, [lastSearchedCEP, lookupCEP, onAddressFound]);

  useEffect(() => {
    if (!value || typeof value !== 'string') {
      return;
    }
    
    const cleanCEP = value.replace(/\D/g, '');
    
    if (cleanCEP.length === 8) {
      debouncedLookup(value);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, debouncedLookup]);

  const displayError = externalError || lookupError;

  return (
    <div className="relative">
      <FormInput
        type="text"
        value={formatCEP(value || '')}
        onChange={(e) => handleCEPChange(e.target.value)}
        placeholder={placeholder}
        maxLength={10}
        disabled={disabled || isLoading}
        error={!!displayError}
        className="pr-10"
      />
      
      {/* Ícone de status */}
      <div className="absolute right-3 top-4 -translate-y-1/2 flex items-center">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : lookupError ? (
          <AlertCircle className="h-4 w-4 text-destructive" />
        ) : value && value.replace(/\D/g, '').length === 8 && !lookupError ? (
          <MapPin className="h-4 w-4 text-success" />
        ) : null}
      </div>
      
      {/* Mensagem de erro */}
      {displayError && (
        <p className="text-sm text-destructive mt-1">{displayError}</p>
      )}
    </div>
  );
};