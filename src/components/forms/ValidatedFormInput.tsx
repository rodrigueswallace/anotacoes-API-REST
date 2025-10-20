import { FormInput } from '@/components/ui/form-input';
import { FormLabel } from '@/components/ui/form-label';
import { useUniquenessValidation } from '@/hooks/useUniquenessValidation';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface UniquenessCheckConfig {
  tableName: string;
  fieldName: string;
  excludeId?: number;
  fieldType?: 'email' | 'cpf' | 'cnpj' | 'code';
  errorMessage?: string;
}

interface ValidatedFormInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  uniquenessCheck?: UniquenessCheckConfig;
  onValidationChange?: (isDuplicate: boolean, isChecking: boolean) => void;
  maxLength?: number;
}

/**
 * Componente de input com validação automática de unicidade
 */
export function ValidatedFormInput({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  error = false,
  errorMessage,
  uniquenessCheck,
  onValidationChange,
  maxLength,
}: ValidatedFormInputProps) {
  const { isDuplicate, isChecking } = useUniquenessValidation({
    tableName: uniquenessCheck?.tableName || '',
    fieldName: uniquenessCheck?.fieldName || '',
    fieldValue: value,
    excludeId: uniquenessCheck?.excludeId,
    fieldType: uniquenessCheck?.fieldType,
    enabled: !!uniquenessCheck && !!value,
  });

  // Notifica o componente pai sobre mudanças no estado de validação
  useEffect(() => {
    if (onValidationChange && uniquenessCheck) {
      onValidationChange(isDuplicate, isChecking);
    }
  }, [isDuplicate, isChecking, onValidationChange, uniquenessCheck]);

  const hasError = error || isDuplicate;
  const displayErrorMessage = isDuplicate 
    ? (uniquenessCheck?.errorMessage || `Já existe um registro com este ${label.toLowerCase()}. Por favor, insira um valor diferente.`)
    : errorMessage;

  return (
    <div className="space-y-2">
      <FormLabel required={required}>{label}</FormLabel>
      <FormInput
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        type={type}
        disabled={disabled || isChecking}
        error={hasError}
        maxLength={maxLength}
        className="mt-1"
      />
      
      {isChecking && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Verificando...</span>
        </div>
      )}
      
      {hasError && displayErrorMessage && (
        <p className="text-xs text-main-danger">{displayErrorMessage}</p>
      )}
    </div>
  );
}


//
