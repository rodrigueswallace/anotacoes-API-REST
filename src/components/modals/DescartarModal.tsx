import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormLabel } from '@/components/ui/form-label';
import { FormTextarea } from '@/components/ui/form-textarea';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';

export interface DescartarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (justificativa: string) => void;
}

export const DescartarModal = ({ open, onOpenChange, onConfirm }: DescartarModalProps) => {
  const [justificativa, setJustificativa] = useState('');
  const [error, setError] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setJustificativa('');
      setError('');
    }
  }, [open]);

  const handleJustificativaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJustificativa(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!justificativa.trim()) {
      setError('Justificativa é obrigatória');
      return false;
    }
    return true;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      onConfirm?.(justificativa);
      resetForm();
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setJustificativa('');
    setError('');
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
      <PrimaryButton onClick={handleConfirm}>
        Descartar
      </PrimaryButton>
    </>
  );

  return (
    <Modal
      open={open}
      onOpenChange={handleModalClose}
      title="Descartar cadastro"
      actions={actions}
      className="sm:max-w-lg max-h-[90vh] sm:max-h-[85vh]"
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <FormLabel required>Justificativa</FormLabel>
          <FormTextarea
            placeholder="Digite a justificativa para descartar o cadastro"
            value={justificativa}
            onChange={handleJustificativaChange}
            rows={4}
            error={!!error}
          />
          {error && <p className="text-xs text-main-danger">{error}</p>}
        </div>
      </div>
    </Modal>
  );
};

export default DescartarModal;