import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormLabel } from '@/components/ui/form-label';
import { FormInput } from '@/components/ui/form-input';
import { FormSearchableSelect } from '@/components/ui/form-searchable-select';
import { DisplayField } from '@/components/ui/display-field';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { StandardModalsWrapper } from '@/components/modals/StandardModalsWrapper';
import { useStandardModals } from '@/hooks/use-standard-modals';
// Removed: validateMatricula, formatMatricula - matrícula não é mais editável
import { useUpdateUser } from '@/hooks/useUsers';
import { useAccessProfiles } from '@/hooks/useAccessProfiles';
import { useAgencies } from '@/hooks/useAgencies';
import { useUnits } from '@/hooks/useUnits';
import { useDepartments } from '@/hooks/useDepartments';
import { formatCPF } from '@/lib/formatters';
// Removed: useUniquenessValidation, Loader2 - validação de matrícula não é mais necessária
import type { UserComplete } from '@/types/user.types';

interface EditarUsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: UserComplete | null;
  onUserUpdated?: (updatedUserData: any) => void;
}

export const EditarUsuarioModal: React.FC<EditarUsuarioModalProps> = ({
  open,
  onOpenChange,
  usuario,
  onUserUpdated
}) => {
  const [formData, setFormData] = useState({
    tipoContratacao: '',
    matricula: '',
    nomeCompleto: '',
    email: '',
    cpf: '',
    telefone: '',
    perfilAcesso: '',
    orgao: '',
    unidade: '',
    setor: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const standardModals = useStandardModals();

  // Hooks para dados dinâmicos
  const { data: accessProfiles, isLoading: loadingProfiles } = useAccessProfiles();
  const { agencies, isLoading: loadingAgencies } = useAgencies();
  const { units, isLoading: loadingUnits } = useUnits();
  const { data: departments, isLoading: loadingDepartments } = useDepartments();
  
  const updateUserMutation = useUpdateUser();

  useEffect(() => {
    if (open && usuario) {
      setFormData({
        tipoContratacao: usuario.employmentType || '',
        matricula: usuario.registrationNumber || '',
        nomeCompleto: usuario.name || '',
        email: usuario.email || '',
        cpf: formatCPF(usuario.cpf || ''),
        telefone: formatPhone(usuario.phoneNumber || ''),
        perfilAcesso: usuario.accessProfileId ? String(usuario.accessProfileId) : '',
        orgao: usuario.agencyId ? String(usuario.agencyId) : '',
        unidade: usuario.unitId ? String(usuario.unitId) : '',
        setor: usuario.departmentId ? String(usuario.departmentId) : ''
      });
      
      setErrors({});
    }
  }, [open, usuario]);

  // Validação de matrícula removida - campo não é mais editável

  const formatPhone = (value: string) => {
    // Extrai apenas números e limita a 11 dígitos
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    
    if (numbers.length === 0) return '';
    
    // Formato para 10 dígitos: (99) 9999-9999
    if (numbers.length <= 10) {
      if (numbers.length <= 2) return `(${numbers}`;
      if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    
    // Formato para 11 dígitos: (99) 99999-9999
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const validatePhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length < 10) {
      return 'Telefone deve conter pelo menos 10 dígitos';
    }
    if (numbers.length > 11) {
      return 'Telefone deve conter no máximo 11 dígitos';
    }
    return null;
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'telefone') {
      formattedValue = formatPhone(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    if (field === 'telefone' && formattedValue) {
      const phoneError = validatePhone(formattedValue);
      if (phoneError) {
        setErrors(prev => ({ ...prev, [field]: phoneError }));
      }
    }
  };

  const handleClearField = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: '' }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tipoContratacao) {
      newErrors.tipoContratacao = 'Este campo é obrigatório';
    }

    // Matrícula não é mais validada pois não é editável

    if (formData.telefone.trim()) {
      const phoneError = validatePhone(formData.telefone);
      if (phoneError) {
        newErrors.telefone = phoneError;
      }
    }
    
    if (!formData.perfilAcesso) {
      newErrors.perfilAcesso = 'Este campo é obrigatório';
    }
    
    if (!formData.orgao) {
      newErrors.orgao = 'Este campo é obrigatório';
    }
    
    if (!formData.unidade) {
      newErrors.unidade = 'Este campo é obrigatório';
    }
    
    if (!formData.setor) {
      newErrors.setor = 'Este campo é obrigatório';
    }

    return newErrors;
  };

  const handleSave = () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Fechar modal antes de iniciar fluxo
    onOpenChange(false);
    
    setTimeout(() => {
      standardModals.startEditFlow();
      handleConfirmSave();
    }, 100);
  };

  const handleConfirmSave = async () => {
    if (!usuario) return;

    try {
      const updateInput = {
        id: usuario.id,
        name: formData.nomeCompleto.trim(),
        phoneNumber: formData.telefone.replace(/\D/g, ''),
        employmentType: formData.tipoContratacao,
        registrationNumber: formData.matricula,
        accessProfileId: parseInt(formData.perfilAcesso),
        departmentId: parseInt(formData.setor),
        unitId: parseInt(formData.unidade),
        agencyId: parseInt(formData.orgao),
      };

      await updateUserMutation.mutateAsync(updateInput);
      
      if (onUserUpdated) {
        onUserUpdated(updateInput);
      }
      
      standardModals.completeEditFlow();
    } catch (error: any) {
      standardModals.hideProcessingModal();
      console.error('Erro ao atualizar usuário:', error);
      alert(error.message || 'Erro ao atualizar usuário. Por favor, tente novamente.');
    }
  };

  const handleSuccessClose = () => {
    standardModals.hideSuccessModal();
    onOpenChange(false);
  };

  const handleCancel = () => {
    setErrors({});
    onOpenChange(false);
  };

  const tiposContratacao = [
    { value: 'estagiario', label: 'Estagiário' },
    { value: 'efetivo', label: 'Efetivo' },
    { value: 'comissionado', label: 'Comissionado' },
    { value: 'temporario', label: 'Temporário' },
    { value: 'terceirizado', label: 'Terceirizado' },
  ];

  const perfisAcessoOptions = useMemo(() => {
    return (accessProfiles || []).map(profile => ({
      value: String(profile.id),
      label: profile.name
    }));
  }, [accessProfiles]);

  const orgaosOptions = useMemo(() => {
    return (agencies || []).map(agency => ({
      value: String(agency.id),
      label: agency.name
    }));
  }, [agencies]);

  const unidadesOptions = useMemo(() => {
    if (!formData.orgao) return [];
    return (units || [])
      .filter(unit => String(unit.agencyId) === formData.orgao)
      .map(unit => ({
        value: String(unit.id),
        label: unit.name
      }));
  }, [units, formData.orgao]);

  const setoresOptions = useMemo(() => {
    if (!formData.unidade) return [];
    return (departments || [])
      .filter(dept => String(dept.unitId) === formData.unidade)
      .map(dept => ({
        value: String(dept.id),
        label: dept.name
      }));
  }, [departments, formData.unidade]);

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title="Editar usuário"
        description="Altere as informações do usuário conforme necessário"
        className="sm:max-w-lg w-full"
        actions={
          <>
            <PrimaryGhostButton onClick={handleCancel}>
              Cancelar
            </PrimaryGhostButton>
            <PrimaryButton onClick={handleSave}>
              Salvar
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <FormLabel required>Tipo de contratação</FormLabel>
            <FormSearchableSelect
              options={tiposContratacao}
              value={formData.tipoContratacao}
              onValueChange={(value) => handleInputChange('tipoContratacao', value)}
              placeholder="Selecione o tipo de contratação"
              error={!!errors.tipoContratacao}
              clearable
              onClear={() => handleClearField('tipoContratacao')}
              className="mt-1"
            />
            {errors.tipoContratacao && (
              <span className="text-main-danger text-xs font-sora">
                {errors.tipoContratacao}
              </span>
            )}
          </div>

          <DisplayField
            label="Matrícula"
            value={formData.matricula}
            required
            className="space-y-2"
          />

          <DisplayField
            label="Nome completo"
            value={formData.nomeCompleto}
            required
            className="space-y-2"
          />

          <DisplayField
            label="E-mail institucional"
            value={formData.email}
            required
            className="space-y-2"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DisplayField
              label="CPF"
              value={formData.cpf}
              required
              className="space-y-2"
            />

            <div className="space-y-2">
              <FormLabel>Telefone/celular</FormLabel>
              <FormInput
                type="text"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                error={!!errors.telefone}
                className="mt-1"
                maxLength={15}
              />
              {errors.telefone && (
                <span className="text-main-danger text-xs font-sora">
                  {errors.telefone}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel required>Perfil de acesso</FormLabel>
            <FormSearchableSelect
              options={perfisAcessoOptions}
              value={formData.perfilAcesso}
              onValueChange={(value) => handleInputChange('perfilAcesso', value)}
              placeholder="Selecione o perfil de acesso"
              error={!!errors.perfilAcesso}
              clearable
              onClear={() => handleClearField('perfilAcesso')}
              className="mt-1"
              disabled={loadingProfiles}
            />
            {errors.perfilAcesso && (
              <span className="text-main-danger text-xs font-sora">
                {errors.perfilAcesso}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <FormLabel required>Órgão</FormLabel>
            <FormSearchableSelect
              options={orgaosOptions}
              value={formData.orgao}
              onValueChange={(value) => {
                handleInputChange('orgao', value);
                setFormData(prev => ({ ...prev, unidade: '', setor: '' }));
              }}
              placeholder="Selecione o órgão"
              error={!!errors.orgao}
              clearable
              onClear={() => {
                handleClearField('orgao');
                setFormData(prev => ({ ...prev, unidade: '', setor: '' }));
              }}
              className="mt-1"
              disabled={loadingAgencies}
            />
            {errors.orgao && (
              <span className="text-main-danger text-xs font-sora">
                {errors.orgao}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <FormLabel required>Unidade</FormLabel>
            <FormSearchableSelect
              options={unidadesOptions}
              value={formData.unidade}
              onValueChange={(value) => {
                handleInputChange('unidade', value);
                setFormData(prev => ({ ...prev, setor: '' }));
              }}
              placeholder="Primeiro selecione um órgão"
              error={!!errors.unidade}
              clearable
              onClear={() => {
                handleClearField('unidade');
                setFormData(prev => ({ ...prev, setor: '' }));
              }}
              className="mt-1"
              disabled={!formData.orgao || loadingUnits}
            />
            {errors.unidade && (
              <span className="text-main-danger text-xs font-sora">
                {errors.unidade}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <FormLabel required>Setor</FormLabel>
            <FormSearchableSelect
              options={setoresOptions}
              value={formData.setor}
              onValueChange={(value) => handleInputChange('setor', value)}
              placeholder="Primeiro selecione uma unidade"
              error={!!errors.setor}
              clearable
              onClear={() => handleClearField('setor')}
              className="mt-1"
              disabled={!formData.unidade || loadingDepartments}
              side="top"
            />
            {errors.setor && (
              <span className="text-main-danger text-xs font-sora">
                {errors.setor}
              </span>
            )}
          </div>
        </div>
      </Modal>

      <StandardModalsWrapper
        modalStates={standardModals.modalStates}
        onInactivateConfirm={() => {}}
        onInactivateCancel={() => {}}
        onSuccessConfirm={handleSuccessClose}
      />
    </>
  );
};
