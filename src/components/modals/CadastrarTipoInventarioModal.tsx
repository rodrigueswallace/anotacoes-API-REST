
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { FormLabel } from '@/components/ui/form-label';
import { FormTextarea } from '@/components/ui/form-textarea';
import { Switch } from '@/components/ui/switch';
import { DisplayField } from '@/components/ui/display-field';
import { FormSelectField } from '@/components/ui/form-select-field';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';

interface CadastrarTipoInventarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  editData?: any;
  isEditing?: boolean;
}

const MAX_DESCRIPTION_LENGTH = 128;

export const CadastrarTipoInventarioModal: React.FC<CadastrarTipoInventarioModalProps> = ({
  open, 
  onOpenChange, 
  onSave, 
  editData, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    frequencia: '' as 'Trimestral' | 'Semestral' | 'Anual' | '',
    exige_comissao: false,
    descricao: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const frequenciaOptions = [
    { value: 'Trimestral', label: 'Trimestral' },
    { value: 'Semestral', label: 'Semestral' },
    { value: 'Anual', label: 'Anual' }
  ];

  useEffect(() => {
    if (open) {
      if (isEditing && editData) {
        setFormData({
          nome: editData.nome || '',
          frequencia: editData.frequencia || '',
          exige_comissao: editData.exige_comissao || false,
          descricao: editData.descricao || ''
        });
      } else {
        setFormData({
          nome: '',
          frequencia: '' as 'Trimestral' | 'Semestral' | 'Anual' | '',
          exige_comissao: false,
          descricao: ''
        });
      }
      setErrors({});
    }
  }, [open, isEditing, editData]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Only validate nome when not editing (creating new record)
    if (!isEditing && !formData.nome.trim()) {
      newErrors.nome = 'Nome do tipo é obrigatório';
    }

    if (!formData.frequencia) {
      newErrors.frequencia = 'Frequência é obrigatória';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (formData.descricao.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.descricao = `Descrição não pode exceder ${MAX_DESCRIPTION_LENGTH} caracteres`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      await onSave(formData);
      resetForm();
      // Don't close modal here - let parent handle it through standard flow
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      frequencia: '' as 'Trimestral' | 'Semestral' | 'Anual' | '',
      exige_comissao: false,
      descricao: ''
    });
    setErrors({});
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const actions = (
    <>
      <PrimaryGhostButton onClick={handleCancel}>
        Cancelar
      </PrimaryGhostButton>
      <PrimaryButton onClick={handleSave}>
        Salvar
      </PrimaryButton>
    </>
  );

  return (
    <Modal
      open={open}
      onOpenChange={handleModalClose}
      title={isEditing ? "Editar tipo de inventário" : "Cadastrar tipo de inventário"}
      actions={actions}
      className="sm:max-w-lg max-h-[90vh] sm:max-h-[85vh]"
    >
      <div className="space-y-4">
        {/* Nome do tipo */}
        <div className="space-y-1">
          <FormLabel required>Nome do tipo</FormLabel>
          {isEditing ? (
            <DisplayField
              label=""
              value={formData.nome}
              required={false}
            />
          ) : (
            <FormInput
              placeholder="Digite o nome do tipo"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              error={!!errors.nome}
            />
          )}
          {errors.nome && <p className="text-xs text-main-danger">{errors.nome}</p>}
        </div>

        {/* Frequência */}
        <div className="space-y-1">
          <FormLabel required>Frequência</FormLabel>
          <FormSelectField
            value={formData.frequencia}
            onValueChange={(value) => handleInputChange('frequencia', value)}
            placeholder="Selecione uma opção"
            options={frequenciaOptions}
            error={!!errors.frequencia}
            clearable={true}
            onClear={() => handleInputChange('frequencia', '')}
          />
          {errors.frequencia && <p className="text-xs text-main-danger">{errors.frequencia}</p>}
        </div>

        {/* Exige Comissão */}
        <div className="space-y-1">
          <FormLabel required>Exige comissão?</FormLabel>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.exige_comissao}
              onCheckedChange={(checked) => handleInputChange('exige_comissao', checked)}
            />
            <span className="font-sora text-sm text-second-dark">
              {formData.exige_comissao ? 'Sim' : 'Não'}
            </span>
          </div>
        </div>

        {/* Descrição */}
        <div className="space-y-1">
          <FormLabel required>Descrição</FormLabel>
          <FormTextarea
            placeholder="Digite a descrição do tipo"
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            rows={2}
            maxLength={MAX_DESCRIPTION_LENGTH}
            error={!!errors.descricao}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.descricao.length}/{MAX_DESCRIPTION_LENGTH} caracteres
          </p>
          {errors.descricao && <p className="text-xs text-main-danger">{errors.descricao}</p>}
        </div>
      </div>
    </Modal>
  );
};
