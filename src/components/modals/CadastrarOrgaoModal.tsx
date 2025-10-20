import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { FormLabel } from '@/components/ui/form-label';
import { FormSelect } from '@/components/ui/form-select-simple';
import { FormSelectWithDynamic } from '@/components/ui/form-select-with-dynamic';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { DisplayField } from '@/components/ui/display-field';
import { CEPInput } from '@/components/ui/cep-input';
import { ValidatedFormInput } from '@/components/forms/ValidatedFormInput';
import { formatCNPJ, formatTelefone, formatNumeroEndereco } from '@/lib/formatters';
import { ufOptions } from '@/lib/municipios-brasil';
import { useMunicipios } from '@/hooks/use-municipios';
import { useCreateAgency, useUpdateAgency } from '@/hooks/useAgencies';
import { useAreas } from '@/hooks/useAreas';
import { CreateAgencyInput, UpdateAgencyInput } from '@/types/agency.types';
import { useToastify } from '@/hooks/use-toastify';

export interface CadastrarOrgaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: any) => void;
  editData?: any;
  isEditing?: boolean;
  useStandardModals?: {
    startCreateFlow: () => void;
    completeCreateFlow: () => void;
    startEditFlow: () => void;
    completeEditFlow: () => void;
    hideProcessingModal: () => void;
  };
}

const CadastrarOrgaoModal = ({
  open,
  onOpenChange,
  onSave,
  editData,
  isEditing = false,
  useStandardModals
}: CadastrarOrgaoModalProps) => {
  // Hooks do Supabase
  const createAgency = useCreateAgency();
  const updateAgency = useUpdateAgency();
  const { data: areas = [], isLoading: areasLoading } = useAreas();
  const { toast } = useToastify();

  const [formData, setFormData] = useState({
    id: editData?.id || undefined,
    nome: editData?.name || '',
    sigla: editData?.acronym || '',
    codigo: editData?.agencyCode || '',
    cnpj: editData?.cnpj || '',
    telefone: editData?.phoneNumber || '',
    email: editData?.email || '',
    poder: editData?.governmentPower || '',
    area: editData?.areaId?.toString() || '',
    cep: editData?.address?.postalCode || '',
    uf: editData?.address?.state || '',
    municipio: editData?.address?.city || '',
    bairro: editData?.address?.neighborhood || '',
    logradouro: editData?.address?.street || '',
    numero: editData?.address?.number || '',
    complemento: editData?.address?.complement || ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estado para gerenciar validações de campos únicos
  const [validationStates, setValidationStates] = useState({
    email: false,
    cnpj: false,
    codigo: false,
  });

  // Atualizar dados do formulário quando editData muda ou modal abre
  useEffect(() => {
    if (open && editData) {
      setFormData({
        id: editData.id,
        nome: editData.name || '',
        sigla: editData.acronym || '',
        codigo: editData.agencyCode || '',
        cnpj: formatCNPJ(editData.cnpj || ''),
        telefone: formatTelefone(editData.phoneNumber || ''),
        email: editData.email || '',
        poder: editData.governmentPower || '',
        area: editData.areaId?.toString() || '',
        cep: editData.address?.postalCode || '',
        uf: editData.address?.state || '',
        municipio: editData.address?.city || '',
        bairro: editData.address?.neighborhood || '',
        logradouro: editData.address?.street || '',
        numero: editData.address?.number || '',
        complemento: editData.address?.complement || ''
      });
    } else if (open && !editData) {
      // Reset form for new entry
      setFormData({
        id: undefined,
        nome: '',
        sigla: '',
        codigo: '',
        cnpj: '',
        telefone: '',
        email: '',
        poder: '',
        area: '',
        cep: '',
        uf: '',
        municipio: '',
        bairro: '',
        logradouro: '',
        numero: '',
        complemento: ''
      });
    }
  }, [editData, open]);

  const poderesOptions = [
    { value: 'Legislativo', label: 'Legislativo' },
    { value: 'Executivo', label: 'Executivo' },
    { value: 'Judiciário', label: 'Judiciário' }
  ];

  const ufOptionsWithDescription = [
    { value: 'AC', label: 'AC - Acre' },
    { value: 'AL', label: 'AL - Alagoas' },
    { value: 'AP', label: 'AP - Amapá' },
    { value: 'AM', label: 'AM - Amazonas' },
    { value: 'BA', label: 'BA - Bahia' },
    { value: 'CE', label: 'CE - Ceará' },
    { value: 'DF', label: 'DF - Distrito Federal' },
    { value: 'ES', label: 'ES - Espírito Santo' },
    { value: 'GO', label: 'GO - Goiás' },
    { value: 'MA', label: 'MA - Maranhão' },
    { value: 'MT', label: 'MT - Mato Grosso' },
    { value: 'MS', label: 'MS - Mato Grosso do Sul' },
    { value: 'MG', label: 'MG - Minas Gerais' },
    { value: 'PA', label: 'PA - Pará' },
    { value: 'PB', label: 'PB - Paraíba' },
    { value: 'PR', label: 'PR - Paraná' },
    { value: 'PE', label: 'PE - Pernambuco' },
    { value: 'PI', label: 'PI - Piauí' },
    { value: 'RJ', label: 'RJ - Rio de Janeiro' },
    { value: 'RN', label: 'RN - Rio Grande do Norte' },
    { value: 'RS', label: 'RS - Rio Grande do Sul' },
    { value: 'RO', label: 'RO - Rondônia' },
    { value: 'RR', label: 'RR - Roraima' },
    { value: 'SC', label: 'SC - Santa Catarina' },
    { value: 'SP', label: 'SP - São Paulo' },
    { value: 'SE', label: 'SE - Sergipe' },
    { value: 'TO', label: 'TO - Tocantins' }
  ];

  // Municípios da API do IBGE
  const { municipios: municipiosOptions, isLoading: municipiosLoading, error: municipiosError } = useMunicipios(formData.uf);

  // Áreas dinâmicas do Supabase
  const areasOptions = useMemo(() => {
    return areas
      .filter(area => area.status === 'Ativo')
      .map(area => ({
        value: area.id.toString(),
        label: area.nome
      }));
  }, [areas]);

  // Função para lidar com endereço encontrado via CEP
  const handleAddressFound = useCallback((address: {
    logradouro: string;
    bairro: string;
    cidade: string;
    cidadeNormalizada: string;
    uf: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      logradouro: address.logradouro || '',
      bairro: address.bairro || '',
      municipio: address.cidade || '',
      uf: address.uf ? address.uf.toUpperCase() : ''
    }));

    // Limpar erros de campos preenchidos automaticamente
    setErrors(prev => ({
      ...prev,
      logradouro: address.logradouro ? '' : prev.logradouro,
      bairro: address.bairro ? '' : prev.bairro,
      municipio: address.cidade ? '' : prev.municipio,
      uf: address.uf ? '' : prev.uf
    }));
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };

      // Se mudou a UF, limpar o município
      if (field === 'uf') {
        newData.municipio = '';
      }
      return newData;
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleTelefoneChange = (value: string) => {
    const formatted = formatTelefone(value);
    handleInputChange('telefone', formatted);
  };

  // Handlers para atualizar estados de validação
  const handleEmailValidationChange = (isDuplicate: boolean, isChecking: boolean) => {
    setValidationStates(prev => ({ ...prev, email: isDuplicate }));
  };

  const handleCNPJValidationChange = (isDuplicate: boolean, isChecking: boolean) => {
    setValidationStates(prev => ({ ...prev, cnpj: isDuplicate }));
  };

  const handleCodigoValidationChange = (isDuplicate: boolean, isChecking: boolean) => {
    setValidationStates(prev => ({ ...prev, codigo: isDuplicate }));
  };

  const validateCNPJ = (cnpj: string): boolean => {
    const cleaned = cnpj.replace(/\D/g, '');
    return cleaned.length === 14;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (!formData.sigla.trim()) {
      newErrors.sigla = 'Sigla é obrigatória';
    } else if (formData.sigla.length > 10) {
      newErrors.sigla = 'Sigla deve ter no máximo 10 caracteres';
    }
    if (!formData.codigo.trim()) {
      newErrors.codigo = 'Código é obrigatório';
    }
    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    } else if (!validateCNPJ(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ inválido';
    }
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (formData.telefone.replace(/\D/g, '').length < 10) {
      newErrors.telefone = 'Telefone inválido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!formData.poder) {
      newErrors.poder = 'Poder é obrigatório';
    }
    if (!formData.area) {
      newErrors.area = 'Área é obrigatória';
    }
    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (formData.cep.replace(/\D/g, '').length !== 8) {
      newErrors.cep = 'CEP inválido';
    }
    if (!formData.uf) {
      newErrors.uf = 'UF é obrigatória';
    }
    if (!formData.municipio) {
      newErrors.municipio = 'Município é obrigatório';
    }
    if (!formData.bairro.trim()) {
      newErrors.bairro = 'Bairro é obrigatório';
    } else if (formData.bairro.length > 255) {
      newErrors.bairro = 'Bairro deve ter no máximo 255 caracteres';
    }
    if (!formData.logradouro.trim()) {
      newErrors.logradouro = 'Logradouro é obrigatório';
    } else if (formData.logradouro.length > 255) {
      newErrors.logradouro = 'Logradouro deve ter no máximo 255 caracteres';
    }
    if (!formData.numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    } else if (formData.numero.length > 10) {
      newErrors.numero = 'Número deve ter no máximo 10 caracteres';
    }
    if (formData.complemento && formData.complemento.length > 255) {
      newErrors.complemento = 'Complemento deve ter no máximo 255 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    // Fechar modal antes de iniciar fluxo
    onOpenChange(false);
    
    setTimeout(async () => {
      try {
        // Iniciar fluxo padrão se disponível
        if (useStandardModals) {
          if (isEditing) {
            useStandardModals.startEditFlow();
          } else {
            useStandardModals.startCreateFlow();
          }
        }

      // Preparar dados no formato correto
      const agencyData = {
        name: formData.nome.trim(),
        acronym: formData.sigla.trim(),
        agencyCode: formData.codigo.trim(),
        cnpj: formData.cnpj.replace(/\D/g, ''),
        phoneNumber: formData.telefone.replace(/\D/g, ''),
        email: formData.email.trim(),
        governmentPower: formData.poder as 'Executivo' | 'Legislativo' | 'Judiciário',
        areaId: parseInt(formData.area),
        address: {
          postalCode: formData.cep.replace(/\D/g, ''),
          state: formData.uf,
          city: formData.municipio,
          neighborhood: formData.bairro.trim(),
          street: formData.logradouro.trim(),
          number: formData.numero.trim(),
          complement: formData.complemento.trim()
        }
      };

      if (isEditing && formData.id) {
        // Atualizar órgão existente
        await updateAgency.mutateAsync({
          id: formData.id,
          ...agencyData,
          address: {
            ...agencyData.address,
            id: editData?.address?.id
          }
        });
      } else {
        // Criar novo órgão
        await createAgency.mutateAsync(agencyData);
      }

      // Completar fluxo padrão se disponível
      if (useStandardModals) {
        if (isEditing) {
          useStandardModals.completeEditFlow();
        } else {
          useStandardModals.completeCreateFlow();
        }
      }

        resetForm();
      } catch (error: any) {
      console.error('Erro ao salvar órgão:', error);
      
      // Fechar modal de processamento
      if (useStandardModals?.hideProcessingModal) {
        useStandardModals.hideProcessingModal();
      }
      
      // Função auxiliar para extrair mensagem de erro e campo
      const getErrorMessage = (error: any): { message: string; field?: string; fieldMessage?: string } => {
        // Erro de duplicação (409 ou 23505)
        if (error?.message?.includes('duplicate key') || 
            error?.message?.includes('uq_s_her') ||
            error?.code === '23505' ||
            error?.status === 409) {
          
          if (error?.message?.includes('email')) {
            return { 
              message: 'Não foi possível salvar: este e-mail já está em uso.', 
              field: 'email' 
            };
          }
          if (error?.message?.includes('cnpj')) {
            return { 
              message: 'Não foi possível salvar: este CNPJ já está em uso.', 
              field: 'cnpj' 
            };
          }
          if (error?.message?.includes('agency_code') || error?.message?.includes('codigo')) {
            return { 
              message: 'Não foi possível salvar: este código já está em uso.', 
              field: 'codigo' 
            };
          }
          if (error?.message?.includes('phone_number') || error?.message?.includes('telefone')) {
            return { 
              message: 'Não foi possível salvar: este telefone já está em uso.', 
              field: 'telefone',
              fieldMessage: 'Telefone já cadastrado'
            };
          }
          return { message: 'Não foi possível salvar: um campo com este valor já existe.' };
        }
        
        // Erro de constraint de tamanho (string too long)
        if (error?.code === '22001' || error?.message?.includes('value too long')) {
          if (error?.message?.includes('street') || error?.message?.includes('logradouro')) {
            return { 
              message: 'Nome da rua muito longo (máximo 255 caracteres).', 
              field: 'logradouro' 
            };
          }
          if (error?.message?.includes('agency_code') || error?.message?.includes('codigo')) {
            return { 
              message: 'Código do órgão muito longo (máximo 10 caracteres).', 
              field: 'codigo' 
            };
          }
          if (error?.message?.includes('neighborhood') || error?.message?.includes('bairro')) {
            return { 
              message: 'Nome do bairro muito longo (máximo 255 caracteres).', 
              field: 'bairro' 
            };
          }
          return { message: 'Um dos campos excedeu o tamanho máximo permitido.' };
        }
        
        // Erro de foreign key (referência inválida)
        if (error?.code === '23503' || error?.message?.includes('foreign key')) {
          if (error?.message?.includes('area_id')) {
            return { 
              message: 'Área selecionada inválida.', 
              field: 'area' 
            };
          }
          return { message: 'Referência a um registro inexistente.' };
        }
        
        // Erro de violação de NOT NULL
        if (error?.code === '23502' || error?.message?.includes('null value')) {
          return { message: 'Campos obrigatórios não foram preenchidos.' };
        }
        
        // Erro de violação de CHECK constraint
        if (error?.code === '23514' || error?.message?.includes('check constraint')) {
          return { message: 'Valores informados não atendem às regras de validação.' };
        }
        
        // Erro de Row Level Security (permissão)
        if (error?.code === '42501' || error?.message?.includes('permission denied') || 
            error?.message?.includes('row-level security')) {
          return { message: 'Você não tem permissão para realizar esta operação.' };
        }
        
        // Erro de timeout/rede
        if (error?.message?.includes('timeout') || error?.message?.includes('network')) {
          return { message: 'Erro de conexão. Verifique sua internet e tente novamente.' };
        }
        
        // Erro genérico
        return { message: 'Erro ao salvar órgão. Tente novamente.' };
      };
      
      // Obter mensagem de erro clara
      const { message, field, fieldMessage } = getErrorMessage(error);
      
      // Exibir toast com mensagem de erro
      toast.error({ description: message });
      
        // Marcar campo com erro, se aplicável
        if (field) {
          setErrors(prev => ({ 
            ...prev, 
            [field]: fieldMessage || (message.includes('já está') ? message : 'Campo inválido.') 
          }));
        }
      }
    }, 100);
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      id: undefined,
      nome: '',
      sigla: '',
      codigo: '',
      cnpj: '',
      telefone: '',
      email: '',
      poder: '',
      area: '',
      cep: '',
      uf: '',
      municipio: '',
      bairro: '',
      logradouro: '',
      numero: '',
      complemento: ''
    });
    setErrors({});
    setValidationStates({ email: false, cnpj: false, codigo: false });
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const isLoading = createAgency.isPending || updateAgency.isPending || areasLoading;
  
  // Verifica se há algum campo com duplicata
  const hasAnyDuplicate = Object.values(validationStates).some(state => state === true);

  const actions = (
    <>
      <PrimaryGhostButton onClick={handleCancel} disabled={isLoading}>
        Cancelar
      </PrimaryGhostButton>
      <PrimaryButton 
        onClick={handleSave} 
        disabled={isLoading || hasAnyDuplicate}
      >
        {isEditing ? 'Salvar' : 'Criar'}
      </PrimaryButton>
    </>
  );

  return (
    <Modal
      open={open}
      onOpenChange={handleModalClose}
      title={isEditing ? 'Editar órgão' : 'Cadastrar órgão'}
      actions={actions}
      className="sm:max-w-2xl w-full"
    >
      <div className="space-y-6">
        {/* Dados do órgão */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-second-dark">Dados do órgão</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel required>Nome</FormLabel>
              <FormInput
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Digite o nome do órgão"
                error={!!errors.nome}
                className="mt-1"
              />
              {errors.nome && (
                <span className="text-main-danger text-xs font-sora">{errors.nome}</span>
              )}
            </div>

            <div className="space-y-2">
              <FormLabel required>Sigla</FormLabel>
              <FormInput
                value={formData.sigla}
                onChange={(e) => handleInputChange('sigla', e.target.value)}
                placeholder="Digite a sigla"
                error={!!errors.sigla}
                maxLength={10}
                className="mt-1"
              />
              {errors.sigla && (
                <span className="text-main-danger text-xs font-sora">{errors.sigla}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel required>Código</FormLabel>
            <FormInput
              value={formData.codigo}
              onChange={(e) => handleInputChange('codigo', e.target.value)}
              placeholder="Digite o código"
              error={!!errors.codigo}
              className="mt-1"
            />
            {errors.codigo && (
              <span className="text-main-danger text-xs font-sora">{errors.codigo}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              {isEditing ? (
                <DisplayField
                  label="CNPJ"
                  value={formatCNPJ(formData.cnpj)}
                  required
                />
              ) : (
                <>
                  <FormLabel required>CNPJ</FormLabel>
                  <FormInput
                    value={formatCNPJ(formData.cnpj)}
                    onChange={(e) => handleInputChange('cnpj', e.target.value)}
                    placeholder="__.___.___/____-__"
                    error={!!errors.cnpj}
                    maxLength={18}
                    className="mt-1"
                  />
                  {errors.cnpj && (
                    <span className="text-main-danger text-xs font-sora">{errors.cnpj}</span>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <FormLabel required>Telefone</FormLabel>
              <FormInput
                value={formData.telefone}
                onChange={(e) => handleTelefoneChange(e.target.value)}
                placeholder="(__) _____-____"
                error={!!errors.telefone}
                maxLength={15}
                className="mt-1"
              />
              {errors.telefone && (
                <span className="text-main-danger text-xs font-sora">{errors.telefone}</span>
              )}
            </div>
          </div>

          <ValidatedFormInput
            label="E-mail"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Digite o e-mail"
            type="email"
            required
            error={!!errors.email}
            errorMessage={errors.email}
            uniquenessCheck={{
              tableName: 'm_org_t_agency',
              fieldName: 'email',
              excludeId: editData?.id,
              fieldType: 'email',
              errorMessage: 'Já existe um órgão cadastrado com este e-mail. Por favor, insira um e-mail diferente.'
            }}
            onValidationChange={handleEmailValidationChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel required>Poder</FormLabel>
              <FormSelect
                options={poderesOptions}
                value={formData.poder}
                onValueChange={(value) => handleInputChange('poder', value)}
                placeholder="Selecione o poder"
                error={!!errors.poder}
                className="mt-1"
              />
              {errors.poder && (
                <span className="text-main-danger text-xs font-sora">{errors.poder}</span>
              )}
            </div>

            <div className="space-y-2">
              <FormLabel required>Área</FormLabel>
              <FormSelect
                options={areasOptions}
                value={formData.area}
                onValueChange={(value) => handleInputChange('area', value)}
                placeholder="Selecione a área"
                error={!!errors.area}
                disabled={areasLoading}
                className="mt-1"
              />
              {errors.area && (
                <span className="text-main-danger text-xs font-sora">{errors.area}</span>
              )}
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-second-dark">Endereço</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_4fr] gap-4">
            <div className="space-y-1">
              <FormLabel required>CEP</FormLabel>
              <CEPInput
                value={formData.cep}
                onChange={(value) => handleInputChange('cep', value)}
                onAddressFound={handleAddressFound}
                error={errors.cep}
              />
              {errors.cep && (
                <span className="text-main-danger text-xs font-sora">{errors.cep}</span>
              )}
            </div>

            <div className="space-y-1">
              <FormLabel required>UF</FormLabel>
              <FormSelect
                options={ufOptions}
                value={formData.uf}
                onValueChange={(value) => handleInputChange('uf', value)}
                placeholder="Selecione"
                error={!!errors.uf}
                className="mt-1"
              />
              {errors.uf && (
                <span className="text-main-danger text-xs font-sora">{errors.uf}</span>
              )}
            </div>

            <div className="space-y-1">
              <FormLabel required>Município</FormLabel>
              <FormSelectWithDynamic
                staticOptions={municipiosOptions}
                value={formData.municipio}
                onValueChange={(value) => handleInputChange('municipio', value)}
                placeholder={municipiosLoading ? "Carregando municípios..." : "Selecione o município"}
                error={!!errors.municipio}
                disabled={!formData.uf || municipiosLoading}
                className="mt-1"
              />
              {municipiosError && <p className="text-xs text-amber-600 font-sora mt-1">{municipiosError}</p>}
              {errors.municipio && (
                <span className="text-main-danger text-xs font-sora">{errors.municipio}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel required>Bairro</FormLabel>
              <FormInput
                value={formData.bairro}
                onChange={(e) => handleInputChange('bairro', e.target.value)}
                placeholder="Digite o bairro"
                error={!!errors.bairro}
                maxLength={255}
                className="mt-1"
              />
              {errors.bairro && (
                <span className="text-main-danger text-xs font-sora">{errors.bairro}</span>
              )}
            </div>

            <div className="space-y-2">
              <FormLabel required>Logradouro</FormLabel>
              <FormInput
                value={formData.logradouro}
                onChange={(e) => handleInputChange('logradouro', e.target.value)}
                placeholder="Digite o logradouro"
                error={!!errors.logradouro}
                maxLength={255}
                className="mt-1"
              />
              {errors.logradouro && (
                <span className="text-main-danger text-xs font-sora">{errors.logradouro}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel required>Número</FormLabel>
              <FormInput
                value={formData.numero}
                onChange={(e) => handleInputChange('numero', formatNumeroEndereco(e.target.value))}
                placeholder="Digite o número"
                error={!!errors.numero}
                maxLength={10}
                className="mt-1"
              />
              {errors.numero && (
                <span className="text-main-danger text-xs font-sora">{errors.numero}</span>
              )}
            </div>

            <div className="space-y-2">
              <FormLabel>Complemento</FormLabel>
              <FormInput
                value={formData.complemento}
                onChange={(e) => handleInputChange('complemento', e.target.value)}
                placeholder="Digite o complemento (opcional)"
                error={!!errors.complemento}
                maxLength={255}
                className="mt-1"
              />
              {errors.complemento && (
                <span className="text-main-danger text-xs font-sora">{errors.complemento}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { CadastrarOrgaoModal };
export default CadastrarOrgaoModal;
