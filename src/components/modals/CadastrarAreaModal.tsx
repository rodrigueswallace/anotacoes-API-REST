import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { FormLabel } from '@/components/ui/form-label';
import { FormTextarea } from '@/components/ui/form-textarea';
import { DisplayField } from '@/components/ui/display-field';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { Area } from '@/types/area.types';

export interface CadastrarAreaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: Omit<Area, 'id' | 'status' | 'data_criacao'>) => void;
  editData?: Area;
  isEditing?: boolean;
}

const MAX_DESCRIPTION_LENGTH = 128;

export const CadastrarAreaModal = ({ open, onOpenChange, onSave, editData, isEditing = false }: CadastrarAreaModalProps) => {
  const [formData, setFormData] = useState({
    nome: editData?.nome || '',
    descricao: editData?.descricao || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [generalError, setGeneralError] = useState<string>('');

  // Atualizar dados do formulário quando editData muda ou modal abre
  useEffect(() => {
    if (open && editData) {
      setFormData({
        nome: editData.nome || '',
        descricao: editData.descricao || ''
      });
    } else if (open && !editData) {
      // Reset form for new entry
      setFormData({
        nome: '',
        descricao: ''
      });
      setIsSaving(false);
      setGeneralError('');
    }
  }, [editData, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

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

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    setGeneralError('');
    
    // Fechar modal antes de processar
    onOpenChange(false);
    
    setTimeout(async () => {
      try {
        await onSave?.(formData);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao salvar';
        setGeneralError(message);
      } finally {
        setIsSaving(false);
      }
    }, 100);
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
    setIsSaving(false);
    setGeneralError('');
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const actions = (
    <>
      <PrimaryGhostButton onClick={handleCancel} disabled={isSaving}>
        Cancelar
      </PrimaryGhostButton>
      <PrimaryButton onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Salvando...' : 'Salvar'}
      </PrimaryButton>
    </>
  );

  return (
    <Modal
      open={open}
      onOpenChange={handleModalClose}
      title={isEditing ? "Editar área" : "Cadastrar área"}
      actions={actions}
      className="sm:max-w-lg max-h-[90vh] sm:max-h-[85vh]"
    >
      <div className="space-y-4">
        {/* Exibição de erro geral */}
        {generalError && (
          <div className="bg-main-danger/10 border border-main-danger rounded-lg p-3">
            <p className="text-sm text-main-danger font-sora">{generalError}</p>
          </div>
        )}
        
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
                placeholder="Digite um texto"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                error={!!errors.nome}
              />
              {errors.nome && <p className="text-xs text-main-danger">{errors.nome}</p>}
            </>
          )}
        </div>

        <div className="space-y-1">
          <FormLabel required>Descrição</FormLabel>
          <FormTextarea
            placeholder="Digite uma descrição"
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            rows={3}
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

export default CadastrarAreaModal;