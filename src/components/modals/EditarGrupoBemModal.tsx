import React from 'react';
import { CadastrarGrupoBemModal } from './CadastrarGrupoBemModal';

interface EditarGrupoBemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  onGrupoBemUpdated?: (data: any) => void;
  grupoBem: any;
}

export const EditarGrupoBemModal: React.FC<EditarGrupoBemModalProps> = ({
  open,
  onOpenChange,
  onSave,
  onGrupoBemUpdated,
  grupoBem
}) => {
  return (
    <CadastrarGrupoBemModal
      open={open}
      onOpenChange={onOpenChange}
      onSave={onSave}
      onGrupoBemUpdated={onGrupoBemUpdated}
      editData={grupoBem}
      isEditing={true}
    />
  );
};