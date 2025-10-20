import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormLabel } from '@/components/ui/form-label';
import { FormInput } from '@/components/ui/form-input';
import { FormSearchableSelect } from '@/components/ui/form-searchable-select';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { StandardModalsWrapper } from '@/components/modals/StandardModalsWrapper';
import { useStandardModals } from '@/hooks/use-standard-modals';
import { formatMatricula, validateMatricula, formatCPF, formatTelefone } from '@/lib/formatters';
import { useCreateUser } from '@/hooks/useUsers';
import { checkEmailExistsInAuth } from '@/services/users.service';
import { useAccessProfiles } from '@/hooks/useAccessProfiles';
import { useAgencies } from '@/hooks/useAgencies';
import { useUnits } from '@/hooks/useUnits';
import { useDepartments } from '@/hooks/useDepartments';
import { useUniquenessValidation } from '@/hooks/useUniquenessValidation';
import { Loader2 } from 'lucide-react';

interface CadastrarUsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated?: (userData: any) => void;
}

export const CadastrarUsuarioModal: React.FC<CadastrarUsuarioModalProps> = ({
  open,
  onOpenChange,
  onUserCreated,
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
  
  // Standard modals hook
  const standardModals = useStandardModals();

  // Hooks para dados dinâmicos
  const { data: accessProfiles, isLoading: loadingProfiles } = useAccessProfiles();
  const { agencies, isLoading: loadingAgencies } = useAgencies();
  const { units, isLoading: loadingUnits } = useUnits();
  const { data: departments, isLoading: loadingDepartments } = useDepartments();
  
  // Mutation para criar usuário
  const createUserMutation = useCreateUser();

  // Função para validar email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação de duplicidade em tempo real para CPF
  const cpfValidation = useUniquenessValidation({
    tableName: 'users_data',
    fieldName: 'cpf',
    fieldValue: formData.cpf.replace(/\D/g, ''),
    fieldType: 'cpf',
    enabled: formData.cpf.replace(/\D/g, '').length === 11,
    debounceMs: 500
  });

  // Validação de duplicidade em tempo real para Matrícula
  const matriculaValidation = useUniquenessValidation({
    tableName: 'users_data',
    fieldName: 'registration_number',
    fieldValue: formData.matricula,
    enabled: formData.matricula.length > 0 && formData.tipoContratacao !== 'estagiario',
    debounceMs: 500
  });

  // Validação de duplicidade em tempo real para Email
  const emailValidation = useUniquenessValidation({
    tableName: 'users_data',
    fieldName: 'email',
    fieldValue: formData.email.trim().toLowerCase(),
    fieldType: 'email',
    enabled: isValidEmail(formData.email),
    debounceMs: 500
  });

  // Atualizar erro de CPF quando validação mudar
  useEffect(() => {
    if (formData.cpf.replace(/\D/g, '').length === 11) {
      if (cpfValidation.isDuplicate) {
        setErrors(prev => ({ ...prev, cpf: 'Este CPF já está cadastrado no sistema.' }));
      } else if (!cpfValidation.isChecking && errors.cpf === 'Este CPF já está cadastrado no sistema.') {
        // Limpar erro de duplicidade se não for mais duplicado
        setErrors(prev => {
          const { cpf, ...rest } = prev;
          return rest;
        });
      }
    }
  }, [cpfValidation.isDuplicate, cpfValidation.isChecking, formData.cpf, errors.cpf]);

  // Atualizar erro de Matrícula quando validação mudar
  useEffect(() => {
    if (formData.matricula.length > 0 && formData.tipoContratacao !== 'estagiario') {
      if (matriculaValidation.isDuplicate) {
        setErrors(prev => ({ ...prev, matricula: 'Esta matrícula já está cadastrada no sistema.' }));
      } else if (!matriculaValidation.isChecking && errors.matricula === 'Esta matrícula já está cadastrada no sistema.') {
        // Limpar erro de duplicidade se não for mais duplicado
        setErrors(prev => {
          const { matricula, ...rest } = prev;
          return rest;
        });
      }
    }
  }, [matriculaValidation.isDuplicate, matriculaValidation.isChecking, formData.matricula, formData.tipoContratacao, errors.matricula]);

  // Atualizar erro de Email quando validação mudar
  useEffect(() => {
    if (isValidEmail(formData.email)) {
      if (emailValidation.isDuplicate) {
        setErrors(prev => ({ ...prev, email: 'Este e-mail já está cadastrado no sistema.' }));
      } else if (!emailValidation.isChecking && errors.email === 'Este e-mail já está cadastrado no sistema.') {
        // Limpar erro de duplicidade se não for mais duplicado
        setErrors(prev => {
          const { email, ...rest } = prev;
          return rest;
        });
      }
    }
  }, [emailValidation.isDuplicate, emailValidation.isChecking, formData.email, errors.email]);

  // Função para validar CPF
  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    
    // Verifica se tem exatamente 11 dígitos
    if (numbers.length !== 11) {
      return 'CPF deve conter 11 dígitos';
    }
    
    // Verifica se não são todos dígitos iguais (000.000.000-00, 111.111.111-11, etc)
    if (/^(\d)\1{10}$/.test(numbers)) {
      return 'CPF inválido';
    }
    
    return null;
  };

  // Função para validar telefone
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
    
    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'telefone') {
      formattedValue = formatTelefone(value);
    } else if (field === 'matricula') {
      formattedValue = formatMatricula(value);
    } else if (field === 'nomeCompleto') {
      formattedValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
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

    if (field === 'cpf' && formattedValue) {
      const cpfError = validateCPF(formattedValue);
      if (cpfError) {
        setErrors(prev => ({ ...prev, [field]: cpfError }));
      }
    }

    if (field === 'matricula' && formattedValue) {
      const matriculaError = validateMatricula(formattedValue);
      if (matriculaError) {
        setErrors(prev => ({ ...prev, [field]: matriculaError }));
      }
    }

    // Preencher automaticamente a matrícula com "00000" quando Estagiário for selecionado
    if (field === 'tipoContratacao' && value === 'estagiario') {
      setFormData(prev => ({ ...prev, matricula: '00000' }));
    } else if (field === 'tipoContratacao' && value !== 'estagiario') {
      setFormData(prev => ({ ...prev, matricula: '' }));
    }
  };

  const handleClearField = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: '' }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Função para validar todo o formulário
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.tipoContratacao) {
      newErrors.tipoContratacao = 'Este campo é obrigatório';
    }
    
    if (!formData.matricula.trim()) {
      newErrors.matricula = 'Este campo é obrigatório';
    } else if (formData.tipoContratacao === 'estagiario' && formData.matricula !== '00000') {
      newErrors.matricula = 'Matrícula de estagiário deve ser 00000';
    } else if (formData.tipoContratacao !== 'estagiario') {
      const matriculaError = validateMatricula(formData.matricula);
      if (matriculaError) {
        newErrors.matricula = matriculaError;
      }
    }
    
    // Validação de duplicidade de matrícula (não aplicável para estagiários)
    if (formData.tipoContratacao !== 'estagiario' && matriculaValidation.isDuplicate) {
      newErrors.matricula = 'Esta matrícula já está cadastrada no sistema.';
    }
    
    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Este campo é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Este campo é obrigatório';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Formato de e-mail inválido';
    }
    
    // Validação de duplicidade de email
    if (emailValidation.isDuplicate) {
      newErrors.email = 'Este e-mail já está cadastrado no sistema.';
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'Este campo é obrigatório';
    } else {
      const cpfError = validateCPF(formData.cpf);
      if (cpfError) {
        newErrors.cpf = cpfError;
      }
    }
    
    // Validação de duplicidade de CPF
    if (cpfValidation.isDuplicate) {
      newErrors.cpf = 'Este CPF já está cadastrado no sistema.';
    }

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
      standardModals.startCreateFlow();
      handleConfirmSave();
    }, 100);
  };

  const handleConfirmSave = async () => {
    try {
      const createInput = {
        name: formData.nomeCompleto.trim(),
        email: formData.email.trim().toLowerCase(),
        cpf: formData.cpf.replace(/\D/g, ''),
        phoneNumber: formData.telefone.replace(/\D/g, ''),
        employmentType: formData.tipoContratacao,
        registrationNumber: formData.matricula,
        accessProfileId: parseInt(formData.perfilAcesso),
        departmentId: parseInt(formData.setor),
        unitId: parseInt(formData.unidade),
        agencyId: parseInt(formData.orgao),
      };

      await createUserMutation.mutateAsync(createInput);
      
      if (onUserCreated) {
        onUserCreated(createInput);
      }
      
      standardModals.completeCreateFlow();
    } catch (error: any) {
      standardModals.hideProcessingModal();
      console.error('Erro ao criar usuário:', error);
      
      // Detectar erro específico de e-mail duplicado
      if (error?.code === 'EMAIL_EXISTS' || 
          error?.message?.includes('já está cadastrado')) {
        setErrors(prev => ({
          ...prev,
          email: 'Este e-mail já está cadastrado no sistema.'
        }));
        return;
      }
      
      // Detectar outros erros de duplicidade
      if (error?.message?.includes('duplicate key') || 
          error?.message?.includes('uq_s_her') ||
          error?.code === '23505' ||
          error?.status === 409) {
        if (error?.message?.includes('cpf')) {
          alert('Não foi possível salvar: este CPF já está em uso.');
        } else if (error?.message?.includes('registration_number') || error?.message?.includes('matrícula')) {
          // Permitir duplicata se for estagiário
          if (formData.tipoContratacao !== 'estagiario') {
            setErrors(prev => ({ ...prev, matricula: 'Esta matrícula já está cadastrada no sistema.' }));
          } else {
            alert(error.message || 'Erro ao criar usuário. Por favor, tente novamente.');
          }
        } else {
          alert('Não foi possível salvar: um registro com estes dados já existe.');
        }
      } else {
        alert(error.message || 'Erro ao criar usuário. Por favor, tente novamente.');
      }
    }
  };

  const handleSuccessClose = () => {
    standardModals.hideSuccessModal();
    handleCancel(); // Limpar formulário e fechar modal principal
  };

  const handleCancel = () => {
    setFormData({
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

  // Transformar dados do banco em opções de select
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
        title="Cadastrar usuários"
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

          <div className="space-y-2">
            <FormLabel required>Matrícula</FormLabel>
            <div className="relative">
              <FormInput
                type="text"
                placeholder="Digite a matrícula (8 dígitos)"
                value={formData.matricula}
                onChange={(e) => handleInputChange('matricula', e.target.value)}
                error={!!errors.matricula}
                className="mt-1"
                maxLength={8}
                disabled={formData.tipoContratacao === 'estagiario'}
              />
              {matriculaValidation.isChecking && formData.tipoContratacao !== 'estagiario' && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            {errors.matricula && (
              <span className="text-main-danger text-xs font-sora">
                {errors.matricula}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <FormLabel required>Nome completo</FormLabel>
            <FormInput
              type="text"
              placeholder="Digite o nome completo"
              value={formData.nomeCompleto}
              onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
              error={!!errors.nomeCompleto}
              className="mt-1"
            />
            {errors.nomeCompleto && (
              <span className="text-main-danger text-xs font-sora">
                {errors.nomeCompleto}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <FormLabel required>E-mail institucional</FormLabel>
            <div className="relative">
              <FormInput
                type="email"
                placeholder="Digite o e-mail institucional"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                className="mt-1"
              />
              {emailValidation.isChecking && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            {errors.email && (
              <span className="text-main-danger text-xs font-sora">
                {errors.email}
              </span>
            )}
          </div>

          {/* CPF e Telefone na mesma linha - responsivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel required>CPF</FormLabel>
              <div className="relative">
                <FormInput
                  type="text"
                  placeholder="___.___.___-__"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  error={!!errors.cpf}
                  className="mt-1"
                  maxLength={14}
                />
                {cpfValidation.isChecking && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              {errors.cpf && (
                <span className="text-main-danger text-xs font-sora">
                  {errors.cpf}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <FormLabel>Telefone/celular</FormLabel>
              <FormInput
                type="text"
                placeholder="(__) _____-____"
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
                // Limpar unidade e setor quando órgão mudar
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
                // Limpar setor quando unidade mudar
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

      {/* Standard Modals */}
      <StandardModalsWrapper
        modalStates={standardModals.modalStates}
        onInactivateConfirm={() => {}}
        onInactivateCancel={() => {}}
        onSuccessConfirm={handleSuccessClose}
      />
    </>
  );
};
