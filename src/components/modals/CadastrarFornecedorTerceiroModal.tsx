import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { FormInput } from '@/components/ui/form-input';
import { CEPInput } from '@/components/ui/cep-input';
import { Textarea } from '@/components/ui/textarea';
import { FormLabel } from '@/components/ui/form-label';
import { FormSelect } from '@/components/ui/form-select-simple';
import { FormSelectWithDynamic } from '@/components/ui/form-select-with-dynamic';
import { DisplayField } from '@/components/ui/display-field';
import { formatCPF, formatCNPJ, formatTelefone, formatUF, formatNumeroEndereco } from '@/lib/formatters';
import { ufOptions } from '@/lib/municipios-brasil';
import { useMunicipios } from '@/hooks/use-municipios';
import { normalizeCityName } from '@/lib/string-utils';
import type { ExternalPartyLocal } from '@/types/external-party.types';

interface CadastrarFornecedorTerceiroModalProps {
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onSave: (data: Partial<ExternalPartyLocal>) => Promise<void>; 
  editData?: any; 
  isEditing?: boolean;
  modalStates?: any;
}

export const CadastrarFornecedorTerceiroModal: React.FC<CadastrarFornecedorTerceiroModalProps> = ({
  open, onOpenChange, onSave, editData, isEditing = false, modalStates
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    tipo_documento: '',
    cpf_cnpj: '',
    email: '',
    telefone: '',
    representante_legal: '',
    cep: '',
    uf: '',
    municipio: '',
    bairro: '',
    logradouro: '',
    numero: '',
    complemento: '',
    observacoes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string>('');


  useEffect(() => {
    if (open) {
      if (isEditing && editData) {
        const tipoDoc = editData.tipoDocumento?.toUpperCase() || '';
        let docFormatted = editData.cpf_cnpj || '';
        
        // Aplicar formatação baseada no tipo
        if (tipoDoc === 'CPF') {
          docFormatted = formatCPF(docFormatted);
        } else if (tipoDoc === 'CNPJ') {
          docFormatted = formatCNPJ(docFormatted);
        }
        
        setFormData({
          nome: editData.nome || '',
          tipo_documento: tipoDoc,
          cpf_cnpj: docFormatted,
          email: editData.email || '',
          telefone: formatTelefone(editData.telefone || ''),
          representante_legal: editData.representanteLegal || '',
          cep: editData.cep || '',
          uf: editData.uf || '',
          municipio: editData.municipio || '',
          bairro: editData.bairro || '',
          logradouro: editData.logradouro || '',
          numero: editData.numero || '',
          complemento: editData.complemento || '',
          observacoes: editData.observacoes || ''
        });
      } else {
        setFormData({
          nome: '',
          tipo_documento: '',
          cpf_cnpj: '',
          email: '',
          telefone: '',
          representante_legal: '',
          cep: '',
          uf: '',
          municipio: '',
          bairro: '',
          logradouro: '',
          numero: '',
          complemento: '',
          observacoes: ''
        });
      }
      setErrors({});
      setGeneralError('');
      setIsLoading(false);
    }
  }, [open, isEditing, editData]);

  // Opções para tipo de documento
  const tipoDocumentoOptions = [
    { value: 'CPF', label: 'CPF' },
    { value: 'CNPJ', label: 'CNPJ' }
  ];

  // Helper function to get label from tipoDocumentoOptions
  const getTipoDocumentoLabel = (value: string) => {
    const option = tipoDocumentoOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  // Funções de formatação

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleDocumentChange = (value: string) => {
    let formattedValue = value;
    if (formData.tipo_documento === 'CPF') {
      formattedValue = formatCPF(value);
    } else if (formData.tipo_documento === 'CNPJ') {
      formattedValue = formatCNPJ(value);
    }
    handleInputChange('cpf_cnpj', formattedValue);
  };

  const handleTelefoneChange = (value: string) => {
    const formattedValue = formatTelefone(value);
    handleInputChange('telefone', formattedValue);
  };

  const handleAddressFound = (address: {
    logradouro: string;
    bairro: string;
    cidade: string;
    cidadeNormalizada: string;
    uf: string;
  }) => {
    const ufUpperCase = address.uf.toUpperCase();
    
    // Usa o nome da cidade original (capitalizado) do ViaCEP
    setFormData(prev => ({
      ...prev,
      uf: ufUpperCase,
      logradouro: address.logradouro,
      bairro: address.bairro,
      municipio: address.cidade // Usa o nome original
    }));
    
    // Limpa possíveis erros dos campos preenchidos automaticamente
    const fieldsToClean = ['logradouro', 'bairro', 'municipio', 'uf'];
    setErrors(prev => {
      const newErrors = { ...prev };
      fieldsToClean.forEach(field => {
        if (newErrors[field]) delete newErrors[field];
      });
      return newErrors;
    });
  };

  const handleUFChange = (value: string) => {
    setFormData(prev => {
      const newData = { ...prev, uf: value };
      // Se mudou a UF, limpar o município
      newData.municipio = '';
      return newData;
    });
    // Clear error when field is modified
    if (errors.uf) {
      setErrors(prev => ({ ...prev, uf: '' }));
    }
  };

  // Municípios da API do IBGE
  const { municipios: municipiosOptions, isLoading: municipiosLoading, error: municipiosError } = useMunicipios(formData.uf);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Campos obrigatórios
    if (!formData.nome.trim()) newErrors.nome = 'Nome / razão social é obrigatório';
    if (!formData.tipo_documento.trim()) newErrors.tipo_documento = 'Tipo de documento é obrigatório';
    if (!formData.cpf_cnpj.trim()) newErrors.cpf_cnpj = 'CPF/CNPJ é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    if (!formData.uf.trim()) newErrors.uf = 'UF é obrigatório';
    if (!formData.municipio.trim()) newErrors.municipio = 'Município é obrigatório';
    if (!formData.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório';
    if (!formData.logradouro.trim()) newErrors.logradouro = 'Logradouro é obrigatório';
    if (!formData.numero.trim()) newErrors.numero = 'Número é obrigatório';

    // Validação de email
    if (formData.email.trim() && !validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    // Validação de CPF/CNPJ
    if (formData.cpf_cnpj.trim()) {
      const cleanDoc = formData.cpf_cnpj.replace(/\D/g, '');
      if (formData.tipo_documento === 'CPF' && cleanDoc.length !== 11) {
        newErrors.cpf_cnpj = 'CPF deve ter 11 dígitos';
      } else if (formData.tipo_documento === 'CNPJ' && cleanDoc.length !== 14) {
        newErrors.cpf_cnpj = 'CNPJ deve ter 14 dígitos';
      }
    }

    // Validação de UF (2 caracteres)
    if (formData.uf.trim() && formData.uf.length !== 2) {
      newErrors.uf = 'UF deve ter 2 caracteres';
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
        await onSave(formData);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao salvar';
        setGeneralError(message);
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };

  return (
    <Modal 
      open={open} 
      onOpenChange={onOpenChange} 
      title={isEditing ? "Editar fornecedor/terceiro" : "Cadastrar fornecedor/terceiro"} 
      maxHeight="70vh"
      className="max-w-[60vw]"
      actions={
        <div className="flex justify-end gap-3">
          <PrimaryGhostButton onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </PrimaryGhostButton>
          <PrimaryButton onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Exibição de erro geral */}
        {generalError && (
          <div className="bg-main-danger/10 border border-main-danger rounded-lg p-3">
            <p className="text-sm text-main-danger font-sora">{generalError}</p>
          </div>
        )}
        
        {/* Seção: Dados do fornecedor / terceiro */}
        <div className="space-y-4">
          <h3 className="font-sora text-base font-semibold text-second-dark">
            Dados do fornecedor / terceiro
          </h3>
          
          <div className="space-y-4">
            {/* Nome / razão social - linha completa */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-12 space-y-2">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Nome / razão social <span className="text-main-danger">*</span>
                </FormLabel>
                <FormInput 
                  value={formData.nome} 
                  onChange={(e) => handleInputChange('nome', e.target.value)} 
                  placeholder="Digite o nome do fornecedor/terceiro" 
                  error={!!errors.nome} 
                  className="font-sora" 
                />
                {errors.nome && <p className="text-xs text-main-danger font-sora">{errors.nome}</p>}
              </div>
            </div>

            {/* Tipo de documento e CPF/CNPJ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-w-0">
              <div className="lg:col-span-3 space-y-2 min-w-0">
                {isEditing ? (
                  <DisplayField
                    label="Tipo de documento"
                    value={getTipoDocumentoLabel(formData.tipo_documento)}
                    required
                  />
                ) : (
                  <>
                    <FormLabel className="font-sora text-sm font-medium text-second-dark">
                      Tipo de documento <span className="text-main-danger">*</span>
                    </FormLabel>
                    <FormSelect
                      value={formData.tipo_documento}
                      onValueChange={(value) => {
                        handleInputChange('tipo_documento', value);
                        handleInputChange('cpf_cnpj', ''); // Limpa o documento ao trocar o tipo
                      }}
                      placeholder="Selecione"
                      options={tipoDocumentoOptions}
                      error={!!errors.tipo_documento}
                    />
                  </>
                )}
                {errors.tipo_documento && <p className="text-xs text-main-danger font-sora">{errors.tipo_documento}</p>}
              </div>

              <div className="lg:col-span-4 space-y-2 min-w-0">
                {isEditing ? (
                  <DisplayField
                    label={formData.tipo_documento === 'CPF' ? 'CPF' : formData.tipo_documento === 'CNPJ' ? 'CNPJ' : 'CPF/CNPJ'}
                    value={formData.cpf_cnpj}
                    required
                  />
                ) : (
                  <>
                    <FormLabel className="font-sora text-sm font-medium text-second-dark">
                      {formData.tipo_documento === 'CPF' ? 'CPF' : formData.tipo_documento === 'CNPJ' ? 'CNPJ' : 'CPF/CNPJ'} <span className="text-main-danger">*</span>
                    </FormLabel>
                    <FormInput 
                      value={formData.cpf_cnpj} 
                      onChange={(e) => handleDocumentChange(e.target.value)}
                      placeholder={formData.tipo_documento === 'CPF' ? '___.___.___-__' : formData.tipo_documento === 'CNPJ' ? '__.___.___/____-__' : 'Digite o documento'}
                      error={!!errors.cpf_cnpj} 
                      className="font-sora" 
                    />
                  </>
                )}
                {errors.cpf_cnpj && <p className="text-xs text-main-danger font-sora">{errors.cpf_cnpj}</p>}
              </div>
            </div>

            {/* E-mail e Telefone */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-w-0">
              <div className="lg:col-span-8 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  E-mail <span className="text-main-danger">*</span>
                </FormLabel>
                <FormInput 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)} 
                  placeholder="Digite o e-mail" 
                  error={!!errors.email} 
                  className="font-sora" 
                />
                {errors.email && <p className="text-xs text-main-danger font-sora">{errors.email}</p>}
              </div>

              <div className="lg:col-span-4 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Telefone / celular
                </FormLabel>
                <FormInput 
                  value={formData.telefone} 
                  onChange={(e) => handleTelefoneChange(e.target.value)}
                  placeholder="(__) _____-____" 
                  error={!!errors.telefone} 
                  className="font-sora" 
                />
                {errors.telefone && <p className="text-xs text-main-danger font-sora">{errors.telefone}</p>}
              </div>
            </div>

            {/* Representante legal */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-w-0">
              <div className="lg:col-span-12 space-y-2">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Representante legal
                </FormLabel>
                <FormInput 
                  value={formData.representante_legal} 
                  onChange={(e) => handleInputChange('representante_legal', e.target.value)} 
                  placeholder="Digite o nome do representante legal" 
                  error={!!errors.representante_legal} 
                  className="font-sora" 
                />
                {errors.representante_legal && <p className="text-xs text-main-danger font-sora">{errors.representante_legal}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Seção: Endereço do fornecedor / terceiro */}
        <div className="space-y-4">
          <h3 className="font-sora text-base font-semibold text-second-dark">
            Endereço do fornecedor / terceiro
          </h3>
          
          <div className="space-y-4">
            {/* CEP, UF, Município, Bairro */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-w-0">
              <div className="lg:col-span-3 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  CEP <span className="text-main-danger">*</span>
                </FormLabel>
                <CEPInput
                  value={formData.cep}
                  onChange={(value) => handleInputChange('cep', value)}
                  onAddressFound={handleAddressFound}
                  placeholder="00000-000"
                  error={errors.cep}
                />
              </div>

              <div className="lg:col-span-2 space-y-2">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  UF <span className="text-main-danger">*</span>
                </FormLabel>
                <FormSelect
                  value={formData.uf}
                  onValueChange={handleUFChange}
                  placeholder="Selecione"
                  options={ufOptions}
                  error={!!errors.uf}
                />
                {errors.uf && <p className="text-xs text-main-danger font-sora">{errors.uf}</p>}
              </div>

              <div className="lg:col-span-4 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Município <span className="text-main-danger">*</span>
                </FormLabel>
                <FormSelectWithDynamic
                  value={formData.municipio}
                  onValueChange={(value) => handleInputChange('municipio', value)}
                  placeholder={municipiosLoading ? "Carregando municípios..." : "Selecione um município"}
                  staticOptions={municipiosOptions}
                  error={!!errors.municipio}
                  disabled={!formData.uf || municipiosLoading}
                  className="font-sora"
                />
                {municipiosError && <p className="text-xs text-amber-600 font-sora">{municipiosError}</p>}
                {errors.municipio && <p className="text-xs text-main-danger font-sora">{errors.municipio}</p>}
              </div>

              <div className="lg:col-span-3 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Bairro <span className="text-main-danger">*</span>
                </FormLabel>
                <FormInput 
                  value={formData.bairro} 
                  onChange={(e) => handleInputChange('bairro', e.target.value)} 
                  placeholder="Digite o bairro" 
                  error={!!errors.bairro} 
                  className="font-sora" 
                />
                {errors.bairro && <p className="text-xs text-main-danger font-sora">{errors.bairro}</p>}
              </div>
            </div>

            {/* Logradouro, Número, Complemento */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-w-0">
              <div className="lg:col-span-7 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Logradouro <span className="text-main-danger">*</span>
                </FormLabel>
                <FormInput 
                  value={formData.logradouro} 
                  onChange={(e) => handleInputChange('logradouro', e.target.value)} 
                  placeholder="Digite o logradouro" 
                  error={!!errors.logradouro} 
                  className="font-sora" 
                />
                {errors.logradouro && <p className="text-xs text-main-danger font-sora">{errors.logradouro}</p>}
              </div>

              <div className="lg:col-span-2 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Número <span className="text-main-danger">*</span>
                </FormLabel>
                <FormInput 
                  value={formData.numero} 
                  onChange={(e) => handleInputChange('numero', formatNumeroEndereco(e.target.value))} 
                  placeholder="Nº ou SN" 
                  error={!!errors.numero} 
                  className="font-sora" 
                />
                {errors.numero && <p className="text-xs text-main-danger font-sora">{errors.numero}</p>}
              </div>

              <div className="lg:col-span-3 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Complemento
                </FormLabel>
                <FormInput 
                  value={formData.complemento} 
                  onChange={(e) => handleInputChange('complemento', e.target.value)} 
                  placeholder="Complemento (opcional)" 
                  error={!!errors.complemento} 
                  className="font-sora" 
                />
                {errors.complemento && <p className="text-xs text-main-danger font-sora">{errors.complemento}</p>}
              </div>
            </div>

            {/* Observações - linha completa */}
            <div className="space-y-2">
              <FormLabel className="font-sora text-sm font-medium text-second-dark">
                Observações
              </FormLabel>
              <Textarea 
                value={formData.observacoes} 
                onChange={(e) => handleInputChange('observacoes', e.target.value)} 
                placeholder="Digite observações (opcional)" 
                className="font-sora resize-none min-h-[100px]" 
                rows={4} 
              />
              {errors.observacoes && <p className="text-xs text-main-danger font-sora">{errors.observacoes}</p>}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
