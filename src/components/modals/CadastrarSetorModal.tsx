import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { FormLabel } from '@/components/ui/form-label';
import { FormSelect, FormSelectContent, FormSelectItem, FormSelectTrigger, FormSelectValue } from '@/components/ui/form-select';
import { DisplayField } from '@/components/ui/display-field';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { Switch } from '@/components/ui/switch';
import { useAgencies } from '@/hooks/useAgencies';
import { useUnits } from '@/hooks/useUnits';
import { useCreateDepartment, useUpdateDepartment } from '@/hooks/useDepartments';
import type { CreateDepartmentInput, UpdateDepartmentInput } from '@/types/department.types';

export interface CadastrarSetorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (formData: any) => Promise<void>;
  editData?: {
    id: number;
    name: string;
    unitId: number;
    agencyId?: number;
    isStockroom?: boolean;
  };
  isEditing?: boolean;
}

const CadastrarSetorModal = ({ open, onOpenChange, onSave, editData, isEditing = false }: CadastrarSetorModalProps) => {
  const { agencies } = useAgencies();
  const { units } = useUnits();
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  
  const [formData, setFormData] = useState({
    nome: '',
    orgaoId: '',
    unidadeId: '',
    almoxarifadoDeposito: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [unidadesOptions, setUnidadesOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (editData && isEditing) {
      setFormData({
        nome: editData.name || '',
        orgaoId: editData.agencyId?.toString() || '',
        unidadeId: editData.unitId?.toString() || '',
        almoxarifadoDeposito: editData.isStockroom || false,
      });
    } else {
      resetForm();
    }
  }, [editData, isEditing, open]);

  useEffect(() => {
    if (formData.orgaoId && units) {
      const unidadesDoOrgao = units.filter(
        (unit) => unit.agencyId?.toString() === formData.orgaoId && !unit.isDeleted
      );
      
      setUnidadesOptions(
        unidadesDoOrgao.map((unit) => ({
          value: unit.id!.toString(),
          label: unit.name,
        }))
      );

      if (!unidadesDoOrgao.find((u) => u.id!.toString() === formData.unidadeId)) {
        setFormData(prev => ({ ...prev, unidadeId: '' }));
      }
    } else {
      setUnidadesOptions([]);
      setFormData(prev => ({ ...prev, unidadeId: '' }));
    }
  }, [formData.orgaoId, units]);

  const orgaosOptions = agencies
    ?.filter(agency => !agency.isDeleted)
    .map(agency => ({
      value: agency.id!.toString(),
      label: agency.name
    })) || [];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.orgaoId) {
      newErrors.orgaoId = 'Órgão é obrigatório';
    }

    if (!formData.unidadeId) {
      newErrors.unidadeId = 'Unidade é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    // Fechar modal antes de processar
    onOpenChange(false);
    
    setTimeout(async () => {
      try {
      const inputData = {
        name: formData.nome.trim(),
        unitId: parseInt(formData.unidadeId),
        isStockroom: formData.almoxarifadoDeposito,
      };

      if (onSave) {
        await onSave(inputData);
      } else {
        if (isEditing && editData?.id) {
          await updateDepartment.mutateAsync({
            ...inputData,
            id: editData.id,
          } as UpdateDepartmentInput);
        } else {
          await createDepartment.mutateAsync(inputData as CreateDepartmentInput);
          }
        }

        resetForm();
      } catch (error) {
        console.error('Error saving setor:', error);
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
      orgaoId: '',
      unidadeId: '',
      almoxarifadoDeposito: false,
    });
    setErrors({});
    setUnidadesOptions([]);
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
      title={isEditing ? "Editar setor" : "Cadastrar setor"}
      actions={actions}
      className="sm:max-w-lg max-h-[90vh] sm:max-h-[85vh]"
    >
      <div className="space-y-4">
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
                placeholder="Digite o nome do setor"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                error={!!errors.nome}
              />
            </>
          )}
          {errors.nome && <p className="text-xs text-main-danger">{errors.nome}</p>}
        </div>

        <div className="space-y-1">
          <FormLabel required>Órgão</FormLabel>
          <FormSelect value={formData.orgaoId} onValueChange={(value) => handleInputChange('orgaoId', value)}>
            <FormSelectTrigger hasValue={!!formData.orgaoId} onClear={() => handleInputChange('orgaoId', '')}>
              <FormSelectValue placeholder="Selecione uma opção" />
            </FormSelectTrigger>
            <FormSelectContent>
              {orgaosOptions.map((option) => (
                <FormSelectItem key={option.value} value={option.value}>
                  {option.label}
                </FormSelectItem>
              ))}
            </FormSelectContent>
          </FormSelect>
          {errors.orgaoId && <p className="text-xs text-main-danger">{errors.orgaoId}</p>}
        </div>

        <div className="space-y-1">
          <FormLabel required>Unidade</FormLabel>
          <FormSelect 
            value={formData.unidadeId} 
            onValueChange={(value) => handleInputChange('unidadeId', value)}
            disabled={!formData.orgaoId}
          >
            <FormSelectTrigger hasValue={!!formData.unidadeId} onClear={() => handleInputChange('unidadeId', '')}>
              <FormSelectValue placeholder={formData.orgaoId ? "Selecione uma opção" : "Selecione um órgão primeiro"} />
            </FormSelectTrigger>
            <FormSelectContent>
              {unidadesOptions.map((option) => (
                <FormSelectItem key={option.value} value={option.value}>
                  {option.label}
                </FormSelectItem>
              ))}
            </FormSelectContent>
          </FormSelect>
          {errors.unidadeId && <p className="text-xs text-main-danger">{errors.unidadeId}</p>}
        </div>

        <div className="space-y-1">
          <FormLabel required htmlFor="almoxarifado-switch">Almoxarifado/depósito</FormLabel>
          <div className="flex items-center gap-2">
            <Switch
              id="almoxarifado-switch"
              checked={formData.almoxarifadoDeposito}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, almoxarifadoDeposito: checked }))
              }
            />
            <span className="text-sm">
              {formData.almoxarifadoDeposito ? 'Sim' : 'Não'}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { CadastrarSetorModal };
