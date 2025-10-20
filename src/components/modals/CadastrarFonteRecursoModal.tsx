import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { FormTextarea } from '@/components/ui/form-textarea';
import { FormLabel } from '@/components/ui/form-label';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { DisplayField } from '@/components/ui/display-field';

import type { FundingSource } from '@/types/funding-source.types';

const MAX_NAME_LENGTH = 64;
const MAX_DESCRIPTION_LENGTH = 64;

interface CadastrarFonteRecursoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<FundingSource>) => void;
  editData?: FundingSource | null;
  isEditing?: boolean;
  onSuccess?: () => void;
}

export const CadastrarFonteRecursoModal: React.FC<CadastrarFonteRecursoModalProps> = ({
  open,
  onOpenChange,
  onSave,
  editData,
  isEditing = false,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (open) {
      if (isEditing && editData) {
        setFormData({
          nome: editData.nome || '',
          descricao: editData.descricao || ''
        });
      } else {
        setFormData({
          nome: '',
          descricao: ''
        });
      }
      setErrors({});
    }
  }, [open, isEditing, editData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validações do campo Nome
    if (!isEditing) {
      if (!formData.nome.trim()) {
        newErrors.nome = 'Nome é obrigatório';
      }
    }
    
    if (formData.nome.length > MAX_NAME_LENGTH) {
      newErrors.nome = `Nome não pode exceder ${MAX_NAME_LENGTH} caracteres`;
    }

    // Validações do campo Descrição
    if (formData.descricao.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.descricao = `Descrição não pode exceder ${MAX_DESCRIPTION_LENGTH} caracteres`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      // Fechar modal antes de processar
      onOpenChange(false);
      
      setTimeout(async () => {
        setIsLoading(true);
        try {
          await onSave(formData);
        } catch (error) {
          console.error('Erro ao salvar fonte de recurso:', error);
        } finally {
          setIsLoading(false);
        }
      }, 100);
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
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
      <PrimaryButton onClick={handleSave} disabled={isLoading}>
        {isLoading ? 'Salvando...' : 'Salvar'}
      </PrimaryButton>
    </>
  );

  return (
    <Modal
      open={open}
      onOpenChange={handleModalClose}
      title={isEditing ? 'Editar fonte de recurso' : 'Cadastrar fonte de recurso'}
      actions={actions}
      className="sm:max-w-lg"
      maxHeight="calc(100vh - 6rem)"
    >
      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="space-y-4">
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
                <FormInput
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Digite um texto"
                  maxLength={MAX_NAME_LENGTH}
                  error={!!errors.nome}
                />
                {errors.nome && (
                  <p className="text-xs text-main-danger">{errors.nome}</p>
                )}
              </>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-1">
            <FormLabel>Descrição</FormLabel>
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
};
