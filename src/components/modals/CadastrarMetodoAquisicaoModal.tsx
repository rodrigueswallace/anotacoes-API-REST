import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { FormLabel } from '@/components/ui/form-label';
import { FormTextarea } from '@/components/ui/form-textarea';
import { Switch } from '@/components/ui/switch';
import { DisplayField } from '@/components/ui/display-field';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { Plus, Trash2 } from "lucide-react";
import { useAcquisitionMethods } from '@/hooks/useAcquisitionMethods';
import { acquisitionMethodRequiredDocumentsService } from '@/services/acquisition-method-required-documents.service';

interface CadastrarMetodoAquisicaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  editData?: any;
  isEditing?: boolean;
  onSuccess?: () => void;
}

export const CadastrarMetodoAquisicaoModal: React.FC<CadastrarMetodoAquisicaoModalProps> = ({ 
  open, 
  onOpenChange, 
  onSave, 
  editData, 
  isEditing = false,
  onSuccess 
}) => {
  const { createAcquisitionMethod, updateAcquisitionMethod, checkCodeExists, isCreating, isUpdating } = useAcquisitionMethods();
  
  const [formData, setFormData] = useState({
    nome: '',
    codigo_interno: '',
    exige_documento: false,
    documentos_obrigatorios: [] as string[],
    descricao: ''
  });
  
  const [newDocumentName, setNewDocumentName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (open) {
      if (isEditing && editData) {
        setFormData({
          nome: editData.nome || '',
          codigo_interno: editData.codigo_interno || '',
          exige_documento: editData.exige_documento || false,
          documentos_obrigatorios: editData.documentos_obrigatorios || [],
          descricao: editData.descricao || ''
        });
      } else {
        setFormData({
          nome: '',
          codigo_interno: '',
          exige_documento: false,
          documentos_obrigatorios: [],
          descricao: ''
        });
      }
      setErrors({});
      setNewDocumentName('');
    }
  }, [open, isEditing, editData]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddDocument = () => {
    const trimmedName = newDocumentName.trim();
    if (trimmedName && !formData.documentos_obrigatorios.includes(trimmedName)) {
      setFormData(prev => ({
        ...prev,
        documentos_obrigatorios: [...prev.documentos_obrigatorios, trimmedName]
      }));
      setNewDocumentName('');
    }
  };

  const handleRemoveDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documentos_obrigatorios: prev.documentos_obrigatorios.filter((_, i) => i !== index)
    }));
  };

  const validateForm = async () => {
    const newErrors: Record<string, string> = {};

    // Only validate nome when not editing (creating new record)
    if (!isEditing && !formData.nome.trim()) {
      newErrors.nome = 'Nome do método é obrigatório';
    }

    // Validate codigo_interno
    if (!isEditing && formData.codigo_interno.trim()) {
      if (formData.codigo_interno.length < 3) {
        newErrors.codigo_interno = 'Código interno deve ter pelo menos 3 caracteres';
      } else {
        // Verificar se o código já existe
        try {
          setIsValidating(true);
          const codeExists = await checkCodeExists(
            formData.codigo_interno.trim(), 
            editData?.id
          );
          
          if (codeExists) {
            newErrors.codigo_interno = 'Este código já está em uso. Por favor, escolha outro código.';
          }
        } catch (error) {
          console.error('Erro ao validar código:', error);
          newErrors.codigo_interno = 'Erro ao validar código. Tente novamente.';
        } finally {
          setIsValidating(false);
        }
      }
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    const isValid = await validateForm();
    
    if (isValid) {
      // Fechar modal antes de processar
      onOpenChange(false);
      
      setTimeout(async () => {
        try {
        let savedMethod;
        
        if (isEditing && editData) {
          savedMethod = await updateAcquisitionMethod({ id: editData.id, data: formData });
        } else {
          savedMethod = await createAcquisitionMethod(formData);
        }

        // Sincronizar documentos obrigatórios
        if (formData.documentos_obrigatorios.length > 0 || isEditing) {
          await acquisitionMethodRequiredDocumentsService.syncDocuments(
            savedMethod.id,
            formData.documentos_obrigatorios
          );
          }

          resetForm();
          onSuccess?.();
        } catch (error: any) {
        console.error('Erro ao salvar método:', error);
        
          // Tratar erro 409 (conflict) do backend
          if (error?.code === '23505' || error?.message?.includes('duplicate') || error?.message?.includes('409')) {
            setErrors(prev => ({
              ...prev,
              codigo_interno: 'Este código já está em uso. Por favor, escolha outro código.'
            }));
          }
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
      codigo_interno: '',
      exige_documento: false,
      documentos_obrigatorios: [],
      descricao: ''
    });
    setNewDocumentName('');
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
      <PrimaryGhostButton onClick={handleCancel} disabled={isCreating || isUpdating || isValidating}>
        Cancelar
      </PrimaryGhostButton>
      <PrimaryButton onClick={handleSave} disabled={isCreating || isUpdating || isValidating}>
        {isValidating ? 'Validando...' : isCreating || isUpdating ? 'Salvando...' : 'Salvar'}
      </PrimaryButton>
    </>
  );

  return (
    <Modal
      open={open}
      onOpenChange={handleModalClose}
      title={isEditing ? "Editar método de aquisição" : "Cadastrar método de aquisição"}
      actions={actions}
      className="!w-[512px]"
    >
      <div className="space-y-4">
        {/* Nome do método */}
        <div className="space-y-1">
          <FormLabel required>Nome do método</FormLabel>
          {isEditing ? (
            <DisplayField
              label=""
              value={formData.nome}
              required={false}
            />
          ) : (
            <FormInput
              placeholder="Digite um texto"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              error={!!errors.nome}
            />
          )}
          {errors.nome && <p className="text-xs text-main-danger">{errors.nome}</p>}
        </div>

        {/* Código interno */}
        <div className="space-y-1">
          <FormLabel>Código interno</FormLabel>
          {isEditing ? (
            <DisplayField
              label=""
              value={formData.codigo_interno}
              required={false}
            />
          ) : (
            <FormInput
              placeholder="Digite o código"
              value={formData.codigo_interno}
              onChange={(e) => handleInputChange('codigo_interno', e.target.value)}
              error={!!errors.codigo_interno}
            />
          )}
          {errors.codigo_interno && <p className="text-xs text-main-danger">{errors.codigo_interno}</p>}
        </div>

        {/* Exige documento em anexo */}
        <div className="space-y-1">
          <FormLabel required>Exige documento em anexo?</FormLabel>
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.exige_documento}
              onCheckedChange={(checked) => handleInputChange('exige_documento', checked)}
            />
            <span className="font-sora text-sm text-second-dark">
              {formData.exige_documento ? 'Sim' : 'Não'}
            </span>
          </div>
        </div>

        {/* Lista de documentos obrigatórios */}
        {formData.exige_documento && (
          <div className="space-y-3">
            <FormLabel>Anexo obrigatório</FormLabel>
            
            {/* Input para adicionar novo documento */}
            <div className="flex gap-2">
              <FormInput
                placeholder="Digite o nome do anexo"
                value={newDocumentName}
                onChange={(e) => setNewDocumentName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDocument();
                  }
                }}
                className="flex-1"
              />
              <button
                onClick={handleAddDocument}
                disabled={!newDocumentName.trim()}
                className="w-8 h-8 rounded-full bg-second-primary text-main-white hover:bg-second-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Lista de documentos adicionados */}
            {formData.documentos_obrigatorios.length > 0 && (
              <div className="space-y-2">
                {formData.documentos_obrigatorios.map((doc, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                  >
                    <span className="font-sora text-sm text-second-dark">{doc}</span>
                    <button
                      onClick={() => handleRemoveDocument(index)}
                      className="text-main-danger hover:text-main-danger/80 transition-colors"
                      aria-label="Remover documento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Descrição */}
        <div className="space-y-1">
          <FormLabel required>Descrição</FormLabel>
          <FormTextarea
            placeholder="Digite um texto"
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            rows={4}
            error={!!errors.descricao}
          />
          {errors.descricao && <p className="text-sm text-destructive">{errors.descricao}</p>}
        </div>
      </div>
    </Modal>
  );
};