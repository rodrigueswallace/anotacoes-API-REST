
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { FormInput } from '@/components/ui/form-input';
import { FormLabel } from '@/components/ui/form-label';
import { FormTextarea } from '@/components/ui/form-textarea';

interface CadastrarEstadoConservacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  editData?: any;
  isEditing?: boolean;
}

const MAX_DESCRIPTION_LENGTH = 128;

export function CadastrarEstadoConservacaoModal({
  open,
  onOpenChange,
  onSave,
  editData,
  isEditing = false
}: CadastrarEstadoConservacaoModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Atualizar form quando editData mudar ou modal abrir
  useEffect(() => {
    if (open && editData) {
      setFormData({
        nome: editData.nome || '',
        descricao: editData.descricao || '',
      });
    } else if (open && !editData) {
      // Reset form for new entry
      setFormData({
        nome: '',
        descricao: '',
      });
    }
    setErrors({});
  }, [editData, open]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (formData.descricao.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.descricao = `Descrição não pode exceder ${MAX_DESCRIPTION_LENGTH} caracteres`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
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
      descricao: '',
    });
    setErrors({});
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
      title={isEditing ? 'Editar estado de conservação' : 'Cadastrar estado de conservação'}
      actions={actions}
      className="sm:max-w-lg"
      maxHeight="calc(100vh - 6rem)"
    >
      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="space-y-4">
          {/* Nome */}
          <div className="space-y-1">
            <FormLabel required>Nome</FormLabel>
            <FormInput
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Digite um texto"
              error={!!errors.nome}
            />
            {errors.nome && (
              <p className="text-xs text-main-danger">{errors.nome}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-1">
            <FormLabel required>Descrição</FormLabel>
            <FormTextarea
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              placeholder="Digite um texto"
              rows={4}
              maxLength={MAX_DESCRIPTION_LENGTH}
              error={!!errors.descricao}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.descricao.length}/{MAX_DESCRIPTION_LENGTH} caracteres
            </p>
            {errors.descricao && (
              <p className="text-xs text-main-danger">{errors.descricao}</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
