import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { FormLabel } from '@/components/ui/form-label';
import { FormSelect, FormSelectContent, FormSelectItem, FormSelectTrigger, FormSelectValue } from '@/components/ui/form-select';
import { DisplayField } from '@/components/ui/display-field';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { useAssetGroups } from '@/hooks/useAssetGroups';

interface CadastrarSubgrupoBemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  editData?: any;
  isEditing?: boolean;
}

export function CadastrarSubgrupoBemModal({
  open,
  onOpenChange,
  onSave,
  editData,
  isEditing = false
}: CadastrarSubgrupoBemModalProps) {
  const { groups, isLoading: isLoadingGroups } = useAssetGroups();
  
  const [formData, setFormData] = useState({
    nome: '',
    grupo_id: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Atualizar form quando editData mudar
  useEffect(() => {
    if (editData && isEditing) {
      setFormData({
        nome: editData.nome || '',
        grupo_id: editData.grupo_id || '',
      });
    } else {
      // Para modo de adição, limpa o formulário
      setFormData({
        nome: '',
        grupo_id: '',
      });
    }
    setErrors({});
  }, [editData, isEditing, open]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.grupo_id) {
      newErrors.grupo_id = 'Grupo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave?.(formData);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      grupo_id: '',
    });
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const handleInputChange = (field: string, value: string | Date | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getGrupoLabel = (id: string) => {
    const grupo = groups.find(g => g.id === id);
    return grupo ? grupo.nome : id;
  };

  // Filtrar apenas grupos ativos
  const activeGroups = groups.filter(g => g.status === 'ativo');

  const actions = (
    <>
      <PrimaryGhostButton onClick={handleCancel}>
        Cancelar
      </PrimaryGhostButton>
      <PrimaryButton onClick={handleSave} disabled={isLoadingGroups}>
        Salvar
      </PrimaryButton>
    </>
  );

  return (
    <Modal
      open={open}
      onOpenChange={handleModalClose}
      title={isEditing ? 'Editar subgrupo do bem' : 'Cadastrar subgrupo do bem'}
      actions={actions}
      className="sm:max-w-2xl"
    >
      <div className="space-y-6">
        {/* Informações básicas */}
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
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Digite o nome do subgrupo"
                  error={!!errors.nome}
                />
              </>
            )}
            {errors.nome && (
              <p className="text-xs text-main-danger">{errors.nome}</p>
            )}
          </div>

          <div className="space-y-1">
            {isEditing ? (
              <DisplayField
                label="Grupo"
                value={getGrupoLabel(formData.grupo_id)}
                required
              />
            ) : (
              <>
                <FormLabel required>Grupo</FormLabel>
                <FormSelect 
                  value={formData.grupo_id} 
                  onValueChange={(value) => handleInputChange('grupo_id', value)}
                  disabled={isLoadingGroups}
                >
                  <FormSelectTrigger 
                    className={errors.grupo_id ? 'border-main-danger' : ''}
                    hasValue={!!formData.grupo_id}
                  >
                    <FormSelectValue placeholder={isLoadingGroups ? "Carregando grupos..." : "Selecione o grupo de bem"} />
                  </FormSelectTrigger>
                  <FormSelectContent>
                    {activeGroups.map(grupo => (
                      <FormSelectItem key={grupo.id} value={grupo.id}>
                        {grupo.nome}
                      </FormSelectItem>
                    ))}
                  </FormSelectContent>
                </FormSelect>
              </>
            )}
            {errors.grupo_id && (
              <p className="text-xs text-main-danger">{errors.grupo_id}</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
