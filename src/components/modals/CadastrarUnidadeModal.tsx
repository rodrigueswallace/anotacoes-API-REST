import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { FormLabel } from '@/components/ui/form-label';
import { FormSelect } from '@/components/ui/form-select-simple';
import { FormSelectWithDynamic } from '@/components/ui/form-select-with-dynamic';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { DisplayField } from '@/components/ui/display-field';
import { CEPInput } from '@/components/ui/cep-input';
import { formatCNPJ, formatNumeroEndereco } from '@/lib/formatters';
import { useAgencies } from '@/hooks/useAgencies';
import { ufOptions } from '@/lib/municipios-brasil';
import { normalizeCityName } from '@/lib/string-utils';
import { useMunicipios } from '@/hooks/use-municipios';

interface CadastrarUnidadeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  editData?: any;
  isEditing?: boolean;
}

export const CadastrarUnidadeModal: React.FC<CadastrarUnidadeModalProps> = ({
  open,
  onOpenChange,
  onSave,
  editData,
  isEditing = false
}) => {
  const defaultFormData = {
    nome: '',
    sigla: '',
    cnpj: '',
    orgaoGestor: '',
    cep: '',
    uf: '',
    municipio: '',
    bairro: '',
    logradouro: '',
    numero: '',
    complemento: '',
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editData && open) {
      const address = editData.address;
      setFormData({
        nome: editData.name || '',
        sigla: editData.acronym || '',
        cnpj: editData.cnpj || '',
        orgaoGestor: editData.agencyId?.toString() || '',
        cep: address?.postalCode || '',
        uf: address?.state || '',
        municipio: address?.city || '',
        bairro: address?.neighborhood || '',
        logradouro: address?.street || '',
        numero: address?.number || '',
        complemento: address?.complement || '',
      });
    } else if (open && !editData) {
      setFormData(defaultFormData);
      setErrors({});
      setIsSaving(false);
    }
  }, [editData, open]);

  // Buscar órgãos do Supabase
  const { agencies, isLoading: agenciesLoading } = useAgencies();
  const orgaosOptions = agencies
    .filter(agency => !agency.isDeleted)
    .map(agency => ({
      value: agency.id.toString(),
      label: agency.name
    }));


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear municipio when UF changes
    if (field === 'uf') {
      setFormData(prev => ({ ...prev, municipio: '' }));
    }
    
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressFound = (address: {
    logradouro: string;
    bairro: string;
    cidade: string;
    cidadeNormalizada: string;
    uf: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      logradouro: address.logradouro,
      bairro: address.bairro,
      municipio: address.cidade, // Usa o nome original
      uf: address.uf,
    }));
    
    // Clear related errors
    setErrors(prev => ({
      ...prev,
      logradouro: '',
      bairro: '',
      municipio: '',
      uf: '',
    }));
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


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validações da unidade
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (formData.sigla.trim().length > 14) {
      newErrors.sigla = 'Sigla deve ter no máximo 14 caracteres';
    }
    if (!formData.orgaoGestor) {
      newErrors.orgaoGestor = 'Órgão gestor é obrigatório';
    }
    // Validação do CNPJ
    if (formData.cnpj) {
      const cleanCNPJ = formData.cnpj.replace(/\D/g, '');
      if (cleanCNPJ.length !== 14) {
        newErrors.cnpj = 'CNPJ deve ter 14 dígitos';
      } else if (!isValidCNPJ(formData.cnpj)) {
        newErrors.cnpj = 'CNPJ inválido';
      }
    }

    // Validações de endereço
    const cleanCEP = formData.cep.replace(/\D/g, '');
    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (cleanCEP.length !== 8) {
      newErrors.cep = 'CEP deve ter 8 dígitos';
    }
    
    if (!formData.uf) {
      newErrors.uf = 'UF é obrigatório';
    } else if (formData.uf.trim().length !== 2) {
      newErrors.uf = 'UF deve ter 2 caracteres';
    }
    
    if (!formData.municipio) {
      newErrors.municipio = 'Município é obrigatório';
    }
    
    if (!formData.logradouro.trim()) {
      newErrors.logradouro = 'Logradouro é obrigatório';
    } else if (formData.logradouro.trim().length > 32) {
      newErrors.logradouro = 'Logradouro deve ter no máximo 32 caracteres';
    }
    
    if (!formData.bairro.trim()) {
      newErrors.bairro = 'Bairro é obrigatório';
    } else if (formData.bairro.trim().length > 32) {
      newErrors.bairro = 'Bairro deve ter no máximo 32 caracteres';
    }
    
    if (!formData.numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    } else if (formData.numero.trim().length > 10) {
      newErrors.numero = 'Número deve ter no máximo 10 caracteres';
    }
    
    if (formData.complemento && formData.complemento.trim().length > 16) {
      newErrors.complemento = 'Complemento deve ter no máximo 16 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (isSaving || !validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    // Fechar modal antes de processar
    onOpenChange(false);
    
    setTimeout(async () => {
      try {
        await onSave(formData);
      } finally {
        setIsSaving(false);
      }
    }, 100);
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  // Validação de CNPJ básica
  const isValidCNPJ = (cnpj: string): boolean => {
    if (typeof cnpj !== 'string') return false;
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    return cleanCNPJ.length === 14;
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setErrors({});
    setIsSaving(false);
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleModalClose}
      title={isEditing ? "Editar unidade" : "Cadastrar unidade"}
      className="sm:max-w-2xl"
      actions={
        <div className="flex gap-3">
          <PrimaryGhostButton onClick={handleCancel} disabled={isSaving}>
            Cancelar
          </PrimaryGhostButton>
          <PrimaryButton onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Dados da Unidade */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Dados da unidade</h3>
          
          {/* Nome - linha única */}
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
                <FormInput
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  error={!!errors.nome}
                  placeholder="Digite um texto"
                />
              </>
            )}
            {errors.nome && <p className="text-xs text-main-danger">{errors.nome}</p>}
          </div>

          {/* Sigla e CNPJ - mesma linha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              {isEditing ? (
                <DisplayField
                  label="Sigla"
                  value={formData.sigla}
                />
              ) : (
                <>
                  <FormLabel>Sigla</FormLabel>
                  <FormInput
                    value={formData.sigla}
                    onChange={(e) => handleInputChange('sigla', e.target.value)}
                    error={!!errors.sigla}
                    placeholder="Ex: UCA, UNO"
                    maxLength={14}
                  />
                </>
              )}
              {errors.sigla && <p className="text-xs text-main-danger">{errors.sigla}</p>}
            </div>

            <div className="space-y-1">
              {isEditing ? (
                <DisplayField
                  label="CNPJ"
                  value={formData.cnpj}
                />
              ) : (
                <>
                  <FormLabel>CNPJ</FormLabel>
                  <FormInput
                    value={formData.cnpj}
                    onChange={(e) => handleInputChange('cnpj', formatCNPJ(e.target.value))}
                    error={!!errors.cnpj}
                    placeholder="__.___.___/____-__"
                    maxLength={18}
                  />
                </>
              )}
              {errors.cnpj && <p className="text-xs text-main-danger">{errors.cnpj}</p>}
            </div>
          </div>

          {/* Órgão gestor - linha única */}
          <div className="space-y-1">
            <FormLabel required>Órgão gestor</FormLabel>
            <FormSelect 
              value={formData.orgaoGestor} 
              onValueChange={(value) => handleInputChange('orgaoGestor', value)}
              options={orgaosOptions}
              placeholder="Selecione um órgão gestor"
              error={!!errors.orgaoGestor}
            />
            {errors.orgaoGestor && <p className="text-xs text-main-danger">{errors.orgaoGestor}</p>}
          </div>
        </div>

        {/* Endereço */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Endereço</h3>

          {/* CEP, UF, Município - mesma linha */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_auto_3fr] gap-4">
            <div className="space-y-1">
              <FormLabel required>CEP</FormLabel>
              <CEPInput
                value={formData.cep}
                onChange={(value) => handleInputChange('cep', value)}
                onAddressFound={handleAddressFound}
                error={errors.cep}
              />
            </div>

            <div className="space-y-1">
              <FormLabel required>UF</FormLabel>
              <FormSelect
                value={formData.uf}
                onValueChange={(value) => handleInputChange('uf', value)}
                options={ufOptions}
                placeholder="UF"
                error={!!errors.uf}
              />
            </div>

            <div className="space-y-1">
              <FormLabel required>Município</FormLabel>
              <FormSelectWithDynamic
                value={formData.municipio}
                onValueChange={(value) => handleInputChange('municipio', value)}
                staticOptions={municipiosOptions}
                placeholder={municipiosLoading ? "Carregando municípios..." : "Selecione um município"}
                error={!!errors.municipio}
                disabled={!formData.uf || municipiosLoading}
              />
              {municipiosError && <p className="text-xs text-amber-600 font-sora mt-1">{municipiosError}</p>}
            </div>
          </div>

          {/* Bairro - linha única */}
          <div className="space-y-1">
            <FormLabel required>Bairro</FormLabel>
            <FormInput
              value={formData.bairro}
              onChange={(e) => handleInputChange('bairro', e.target.value)}
              error={!!errors.bairro}
              placeholder="Digite o bairro"
            />
            {errors.bairro && <p className="text-xs text-main-danger">{errors.bairro}</p>}
          </div>

          {/* Logradouro e Número - mesma linha */}
          <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4">
            <div className="space-y-1">
              <FormLabel required>Logradouro</FormLabel>
              <FormInput
                value={formData.logradouro}
                onChange={(e) => handleInputChange('logradouro', e.target.value)}
                error={!!errors.logradouro}
                placeholder="Ex: Rua, Avenida, Travessa"
              />
              {errors.logradouro && <p className="text-xs text-main-danger">{errors.logradouro}</p>}
            </div>

            <div className="space-y-1">
              <FormLabel required>Número</FormLabel>
              <FormInput
                value={formData.numero}
                onChange={(e) => handleInputChange('numero', formatNumeroEndereco(e.target.value))}
                error={!!errors.numero}
                placeholder="Nº ou SN"
              />
              {errors.numero && <p className="text-xs text-main-danger">{errors.numero}</p>}
            </div>
          </div>

          {/* Complemento - linha única */}
          <div className="space-y-1">
            <FormLabel>Complemento</FormLabel>
            <FormInput
              value={formData.complemento}
              onChange={(e) => handleInputChange('complemento', e.target.value)}
              placeholder="Ex: Bloco A, Apartamento 102"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};