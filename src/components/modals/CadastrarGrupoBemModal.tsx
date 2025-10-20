import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { FormLabel } from '@/components/ui/form-label';
import { FormSelect, FormSelectContent, FormSelectItem, FormSelectTrigger, FormSelectValue } from '@/components/ui/form-select';
import { DisplayField } from '@/components/ui/display-field';
import { Switch } from '@/components/ui/switch';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
interface CadastrarGrupoBemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  onGrupoBemUpdated?: (data: any) => void;
  editData?: any;
  isEditing?: boolean;
}

// Tipos de veículo disponíveis
const tiposVeiculo = [
  { value: 'Terrestre', label: 'Terrestre' },
  { value: 'Aquaviário', label: 'Aquaviário' },
  { value: 'Aeronáutico', label: 'Aeronáutico' }
];
export function CadastrarGrupoBemModal({
  open,
  onOpenChange,
  onSave,
  onGrupoBemUpdated,
  editData,
  isEditing = false
}: CadastrarGrupoBemModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    codigo_contabil: '',
    depreciacao_aplicavel: true,
    veiculo_licenciavel: false,
    etiqueta_qrcode: true,
    percentual_depreciacao_anual: '',
    percentual_depreciacao_mensal: '',
    vida_util_anos: '',
    valor_residual: '',
    tipo_veiculo: ''
  });
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>('');

  // Atualizar form quando editData mudar
  useEffect(() => {
    if (editData && isEditing) {
      setFormData({
        nome: editData.nome || '',
        codigo_contabil: editData.codigo_contabil || '',
        depreciacao_aplicavel: editData.depreciacao_aplicavel ?? true,
        veiculo_licenciavel: editData.veiculo_licenciavel ?? false,
        etiqueta_qrcode: editData.etiqueta_qrcode ?? true,
        percentual_depreciacao_anual: String(
          editData.taxa_depreciacao_anual ?? 
          editData.percentual_depreciacao_anual ?? 
          ''
        ),
        percentual_depreciacao_mensal: String(
          editData.taxa_depreciacao_mensal ?? 
          editData.percentual_depreciacao_mensal ?? 
          ''
        ),
        vida_util_anos: String(
          editData.vida_util ?? 
          editData.vida_util_anos ?? 
          ''
        ),
        valor_residual: editData.valor_residual || '',
        tipo_veiculo: editData.tipo_veiculo || ''
      });
    } else {
      setFormData({
        nome: '',
        codigo_contabil: '',
        depreciacao_aplicavel: true,
        veiculo_licenciavel: false,
        etiqueta_qrcode: true,
        percentual_depreciacao_anual: '',
        percentual_depreciacao_mensal: '',
        vida_util_anos: '',
        valor_residual: '',
        tipo_veiculo: ''
      });
    }
    setErrors({});
    setGeneralError('');
    setIsLoading(false);
  }, [editData, isEditing, open]);
  const validateForm = () => {
    const newErrors: {
      [key: string]: string;
    } = {};

    // Validar nome apenas no modo de criação
    if (!isEditing && !formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (!formData.codigo_contabil.trim()) {
      newErrors.codigo_contabil = 'Código contábil é obrigatório';
    } else {
      // Remove dots and check if we have up to 13 digits
      const digits = formData.codigo_contabil.replace(/\D/g, '');
      if (digits.length < 1 || digits.length > 13) {
        newErrors.codigo_contabil = 'Código contábil deve conter de 1 a 13 dígitos';
      }
    }

    // Validar campos de depreciação se a depreciação estiver aplicável (apenas em modo de criação)
    if (formData.depreciacao_aplicavel && !isEditing) {
      if (!formData.percentual_depreciacao_anual.trim()) {
        newErrors.percentual_depreciacao_anual = 'Percentual de depreciação anual é obrigatório';
      } else if (!/^\d+(\.\d+)?$/.test(formData.percentual_depreciacao_anual.trim())) {
        newErrors.percentual_depreciacao_anual = 'Percentual deve ser um número válido';
      }
      if (!formData.percentual_depreciacao_mensal.trim()) {
        newErrors.percentual_depreciacao_mensal = 'Percentual de depreciação mensal é obrigatório';
      } else if (!/^\d+(\.\d+)?$/.test(formData.percentual_depreciacao_mensal.trim())) {
        newErrors.percentual_depreciacao_mensal = 'Percentual deve ser um número válido';
      }
      if (!formData.vida_util_anos.trim()) {
        newErrors.vida_util_anos = 'Vida útil em anos é obrigatória';
      } else if (!/^\d+$/.test(formData.vida_util_anos.trim())) {
        newErrors.vida_util_anos = 'Vida útil deve ser um número inteiro';
      }
    }

    // Validar valor residual (sempre editável quando depreciação aplicável)
    if (formData.depreciacao_aplicavel) {
      if (!formData.valor_residual.trim()) {
        newErrors.valor_residual = 'Valor residual é obrigatório';
      } else if (!/^\d+(\.\d+)?$/.test(formData.valor_residual.trim())) {
        newErrors.valor_residual = 'Valor residual deve ser um número válido';
      }
    }

    // Validar tipo de veículo (obrigatório apenas se veículo licenciável)
    if (formData.veiculo_licenciavel && !formData.tipo_veiculo.trim()) {
      newErrors.tipo_veiculo = 'Tipo de veículo é obrigatório';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setGeneralError('');
    
    // Fechar modal antes de processar
    onOpenChange(false);
    
    setTimeout(async () => {
      try {
      if (isEditing && onGrupoBemUpdated) {
        const updatedData = {
          id: editData.id,
          nome: formData.nome,
          codigo_contabil: formData.codigo_contabil,
          depreciacao_aplicavel: formData.depreciacao_aplicavel,
          veiculo_licenciavel: formData.veiculo_licenciavel,
          etiqueta_qrcode: formData.etiqueta_qrcode,
          valor_residual: formData.valor_residual,
          tipo_veiculo: formData.tipo_veiculo
        };
        await onGrupoBemUpdated(updatedData);
      } else {
        await onSave({
          ...formData,
          depreciacao_aplicavel: formData.depreciacao_aplicavel ?? false,
          veiculo_licenciavel: formData.veiculo_licenciavel ?? false,
          etiqueta_qrcode: formData.etiqueta_qrcode ?? false,
        });
        }
        resetForm();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao salvar';
        setGeneralError(message);
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };
  const resetForm = () => {
    setFormData({
      nome: '',
      codigo_contabil: '',
      depreciacao_aplicavel: true,
      veiculo_licenciavel: false,
      etiqueta_qrcode: true,
      percentual_depreciacao_anual: '',
      percentual_depreciacao_mensal: '',
      vida_util_anos: '',
      valor_residual: '',
      tipo_veiculo: ''
    });
    setErrors({});
    setGeneralError('');
    setIsLoading(false);
  };
  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };
  const handleModalClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };
  const formatCodigoContabil = (value: string) => {
    // Remove todos os caracteres não numéricos
    const digits = value.replace(/\D/g, '');
    
    // Limita a 13 dígitos
    const limited = digits.slice(0, 13);
    
    // Adiciona pontos a cada 2 dígitos
    const formatted = limited.replace(/(\d{2})(?=\d)/g, '$1.');
    
    return formatted;
  };

  const handleCodigoContabilChange = (value: string) => {
    const formatted = formatCodigoContabil(value);
    handleInputChange('codigo_contabil', formatted);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  const handleSwitchChange = (field: string, value: boolean) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Limpar tipo de veículo quando veículo licenciável for desabilitado
      if (field === 'veiculo_licenciavel' && !value) {
        newData.tipo_veiculo = '';
      }
      
      return newData;
    });
  };
  const actions = <>
      <PrimaryGhostButton onClick={handleCancel} disabled={isLoading}>
        Cancelar
      </PrimaryGhostButton>
      <PrimaryButton onClick={handleSave} disabled={isLoading}>
        {isLoading ? 'Salvando...' : 'Salvar'}
      </PrimaryButton>
    </>;
  return <Modal open={open} onOpenChange={handleModalClose} title={isEditing ? 'Editar grupo de bem' : 'Cadastrar grupo de bem'} actions={actions} className="sm:max-w-lg max-h-[90vh] sm:max-h-[85vh]">
      <div className="space-y-4">
        {/* Exibição de erro geral */}
        {generalError && (
          <div className="bg-main-danger/10 border border-main-danger rounded-lg p-3">
            <p className="text-sm text-main-danger font-sora">{generalError}</p>
          </div>
        )}
        
        {/* Nome */}
        <div className="space-y-1">
          {isEditing ? (
            <DisplayField
              label="Nome"
              value={formData.nome}
              required
            />
          ) : (
            <>
              <FormLabel required>Nome</FormLabel>
              <FormInput value={formData.nome} onChange={e => handleInputChange('nome', e.target.value)} placeholder="Digite o nome do grupo de bem" error={!!errors.nome} />
              {errors.nome && <p className="text-xs text-main-danger">{errors.nome}</p>}
            </>
          )}
        </div>

        {/* Código Contábil */}
        <div className="space-y-1">
          <FormLabel required>Código Contábil</FormLabel>
          <FormInput 
            value={formData.codigo_contabil} 
            onChange={e => handleCodigoContabilChange(e.target.value)} 
            placeholder="Até 13 dígitos (ex: 12.34.56)" 
            error={!!errors.codigo_contabil}
            maxLength={19}
          />
          {errors.codigo_contabil && <p className="text-xs text-main-danger">{errors.codigo_contabil}</p>}
        </div>

        {/* Depreciação Aplicável */}
        <div className="flex items-center justify-between">
          <FormLabel required>Depreciação aplicável</FormLabel>
          <Switch checked={formData.depreciacao_aplicavel} onCheckedChange={checked => handleSwitchChange('depreciacao_aplicavel', checked)} />
        </div>

        {/* Campos condicionais de depreciação */}
        {formData.depreciacao_aplicavel && <div className="space-y-4 pl-4 border-l-2 border-primary/20">
            {/* Percentuais de depreciação - mesma linha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <FormLabel required>Percentual de depreciação anual</FormLabel>
                <div className="relative">
                  <FormInput value={formData.percentual_depreciacao_anual} onChange={e => handleInputChange('percentual_depreciacao_anual', e.target.value)} placeholder="Digite o percentual anual" error={!!errors.percentual_depreciacao_anual} disabled={isEditing} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                </div>
                {errors.percentual_depreciacao_anual && <p className="text-xs text-main-danger">{errors.percentual_depreciacao_anual}</p>}
              </div>

              <div className="space-y-1">
                <FormLabel required>Percentual de depreciação mensal</FormLabel>
                <div className="relative">
                  <FormInput value={formData.percentual_depreciacao_mensal} onChange={e => handleInputChange('percentual_depreciacao_mensal', e.target.value)} placeholder="Digite o percentual mensal" error={!!errors.percentual_depreciacao_mensal} disabled={isEditing} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                </div>
                {errors.percentual_depreciacao_mensal && <p className="text-xs text-main-danger">{errors.percentual_depreciacao_mensal}</p>}
              </div>
            </div>

            {/* Vida útil e Valor residual - mesma linha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <FormLabel required>Vida útil (anos)</FormLabel>
                <FormInput value={formData.vida_util_anos} onChange={e => handleInputChange('vida_util_anos', e.target.value)} placeholder="Digite um valor numérico" error={!!errors.vida_util_anos} disabled={isEditing} />
                {errors.vida_util_anos && <p className="text-xs text-main-danger">{errors.vida_util_anos}</p>}
              </div>

              <div className="space-y-1">
                <FormLabel required>Valor residual</FormLabel>
                <div className="relative">
                  <FormInput value={formData.valor_residual} onChange={e => handleInputChange('valor_residual', e.target.value)} placeholder="Digite o valor residual" error={!!errors.valor_residual} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                </div>
                {errors.valor_residual && <p className="text-xs text-main-danger">{errors.valor_residual}</p>}
              </div>
            </div>
          </div>}

        {/* Exige etiqueta QR Code? */}
        <div className="flex items-center justify-between">
          <FormLabel required>Exige etiqueta QR Code?</FormLabel>
          <Switch checked={formData.etiqueta_qrcode} onCheckedChange={checked => handleSwitchChange('etiqueta_qrcode', checked)} />
        </div>

        {/* Veículo Licenciável */}
        <div className="flex items-center justify-between">
          <FormLabel required>Veículo licenciável</FormLabel>
          <Switch checked={formData.veiculo_licenciavel} onCheckedChange={checked => handleSwitchChange('veiculo_licenciavel', checked)} />
        </div>

        {/* Tipo de veículo - condicional */}
        <div className="space-y-1">
          <FormLabel required={formData.veiculo_licenciavel}>Tipo do veículo</FormLabel>
          <FormSelect 
            value={formData.tipo_veiculo} 
            onValueChange={value => handleInputChange('tipo_veiculo', value)}
          >
            <FormSelectTrigger 
              className={errors.tipo_veiculo ? 'border-main-danger' : ''} 
              hasValue={!!formData.tipo_veiculo}
            >
              <FormSelectValue placeholder="Selecione o tipo de veículo" />
            </FormSelectTrigger>
            <FormSelectContent>
              {tiposVeiculo.map(tipo => <FormSelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </FormSelectItem>)}
            </FormSelectContent>
          </FormSelect>
          {errors.tipo_veiculo && <p className="text-xs text-main-danger">{errors.tipo_veiculo}</p>}
        </div>
      </div>
    </Modal>;
}