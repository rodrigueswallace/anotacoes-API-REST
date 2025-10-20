import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { FormLabel } from '@/components/ui/form-label';
import { FormSelect, FormSelectContent, FormSelectItem, FormSelectTrigger, FormSelectValue } from '@/components/ui/form-select';
import { FormTextarea } from '@/components/ui/form-textarea';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { DisplayField } from '@/components/ui/display-field';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { DocumentUpload, DocumentFile } from '@/components/ui/document-upload';
import { formatNumeroLei } from '@/lib/formatters';
import { useLaws } from '@/hooks/useLaws';
import { useLawDocuments } from '@/hooks/useLawDocuments';
import { Law, LawType, Jurisdiction, AssociatedProcess } from '@/types/law.types';

export interface CadastrarLeiAplicavelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: Law | null;
  isEditing?: boolean;
  onCreateSuccess?: () => void;
  onEditSuccess?: () => void;
  onCompleteCreate?: () => void;
  onCompleteEdit?: () => void;
}

const CadastrarLeiAplicavelModal = ({ 
  open, 
  onOpenChange, 
  editData, 
  isEditing = false, 
  onCreateSuccess,
  onEditSuccess,
  onCompleteCreate,
  onCompleteEdit
}: CadastrarLeiAplicavelModalProps) => {
  const { createLaw, updateLaw } = useLaws();
  const { uploadDocument, updateDocumentTitle, deleteDocument, documents: existingDocuments, refetch: refetchDocuments } = useLawDocuments(editData?.id);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    type: '' as LawType | '',
    jurisdiction: '' as Jurisdiction | '',
    associated_process: '' as AssociatedProcess | '',
    publication_date: undefined as Date | undefined,
    description: '',
    link: ''
  });

  const [pendingFiles, setPendingFiles] = useState<DocumentFile[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (isEditing && editData) {
        setFormData({
          name: editData.name || '',
          number: editData.number || '',
          type: editData.type || '',
          jurisdiction: editData.jurisdiction || '',
          associated_process: editData.associated_process || '',
          publication_date: editData.publication_date ? new Date(editData.publication_date) : undefined,
          description: editData.description || '',
          link: editData.link || ''
        });
      } else {
        resetForm();
        setPendingFiles([]);
      }
      setErrors({});
    }
  }, [open, isEditing, editData]);

  // Load existing documents when editing
  useEffect(() => {
    if (open && isEditing && editData && existingDocuments.length > 0) {
      const existingDocs: DocumentFile[] = existingDocuments.map(doc => ({
        id: doc.id.toString(),
        name: doc.title || 'Documento',
        comment: '',
        status: 'Enviado' as const,
        url: doc.public_url || doc.file_path
      }));
      
      setPendingFiles(existingDocs);
    }
  }, [open, isEditing, editData, existingDocuments]);

  const typeOptions = [
    { value: LawType.DECRETO, label: 'Decreto' },
    { value: LawType.LEI, label: 'Lei' },
    { value: LawType.NORMA, label: 'Norma' }
  ];

  const jurisdictionOptions = [
    { value: Jurisdiction.UNIAO, label: 'União' },
    { value: Jurisdiction.ESTADUAL, label: 'Estadual' },
    { value: Jurisdiction.MUNICIPAL, label: 'Municipal' }
  ];

  const processOptions = [
    { value: AssociatedProcess.CADASTRO_CONFIGURACOES, label: 'Cadastro de configurações' },
    { value: AssociatedProcess.CADASTRO_TOMBAMENTO, label: 'Cadastro e tombamento de bens' },
    { value: AssociatedProcess.INVENTARIOS, label: 'Inventários' },
    { value: AssociatedProcess.TRANSFERENCIA_INTERNA, label: 'Transferência interna' },
    { value: AssociatedProcess.TRANSFERENCIA_EXTERNA, label: 'Transferência externa' },
    { value: AssociatedProcess.DOACAO, label: 'Doação' },
    { value: AssociatedProcess.VENDA, label: 'Venda' },
    { value: AssociatedProcess.PERMUTA, label: 'Permuta' },
    { value: AssociatedProcess.REAVALIACAO, label: 'Reavaliação' },
    { value: AssociatedProcess.BAIXA_DESCARTE, label: 'Baixa e descarte de bens' },
    { value: AssociatedProcess.CESSAO_EMPRESTIMO, label: 'Cessão e empréstimo de bens' }
  ];

  // Helper function to get label from options
  const getLabelFromOptions = (options: { value: string; label: string }[], value: string) => {
    const option = options.find(opt => opt.value === value)
    return option ? option.label : value
  };

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da lei é obrigatório';
    }

    if (!formData.number.trim()) {
      newErrors.number = 'Número da lei é obrigatório';
    }

    if (!formData.type) {
      newErrors.type = 'Tipo de norma é obrigatório';
    }

    if (!formData.jurisdiction) {
      newErrors.jurisdiction = 'Esfera é obrigatória';
    }

    if (!formData.publication_date) {
      newErrors.publication_date = 'Data de Publicação é obrigatória';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Resumo/Descrição é obrigatório';
    }

    if (!formData.link.trim()) {
      newErrors.link = 'Link da norma é obrigatório';
    }

    if (formData.link.trim()) {
      const url = formData.link.trim();
      const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
      if (!urlPattern.test(url) && !url.startsWith('/')) {
        newErrors.link = 'Link inválido';
      }
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
      if (isEditing && editData) {
        onEditSuccess?.();
        
        await updateLaw({
          id: editData.id,
          name: formData.name,
          number: formData.number,
          type: formData.type as LawType,
          jurisdiction: formData.jurisdiction as Jurisdiction,
          associated_process: formData.associated_process as AssociatedProcess,
          publication_date: formData.publication_date!.toISOString(),
          description: formData.description,
          link: formData.link
        });

        // Upload new documents if any
        const newDocs = pendingFiles.filter(d => d.status === 'Criado' && d.file);
        if (newDocs.length > 0) {
          for (const pending of newDocs) {
            if (pending.file) {
              await uploadDocument({
                law_id: editData.id,
                title: pending.name,
                file: pending.file
              });
            }
          }
          await refetchDocuments();
        }

        onCompleteEdit?.();
      } else {
        onCreateSuccess?.();
        
        const newLaw = await createLaw({
          name: formData.name,
          number: formData.number,
          type: formData.type as LawType,
          jurisdiction: formData.jurisdiction as Jurisdiction,
          associated_process: formData.associated_process as AssociatedProcess,
          publication_date: formData.publication_date!.toISOString(),
          description: formData.description,
          link: formData.link
        });

        // Upload documents
        const newDocs = pendingFiles.filter(d => d.status === 'Criado' && d.file);
        if (newDocs.length > 0) {
          for (const pending of newDocs) {
            if (pending.file) {
              await uploadDocument({
                law_id: newLaw.id,
                title: pending.name,
                file: pending.file
              });
            }
          }
          await refetchDocuments();
        }

          onCompleteCreate?.();
        }

        resetForm();
      } catch (error) {
        console.error('Erro ao salvar:', error);
      }
    }, 100);
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      number: '',
      type: '',
      jurisdiction: '',
      associated_process: '',
      publication_date: undefined,
      description: '',
      link: ''
    });
    setPendingFiles([]);
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
      title={isEditing ? "Editar leis aplicáveis" : "Cadastrar leis aplicáveis"}
      actions={actions}
      className="max-w-[60vw]"
      maxHeight="70vh"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            {isEditing ? (
              <DisplayField
                label="Nome da lei"
                value={formData.name}
                required
              />
            ) : (
              <>
                <FormLabel required>Nome da lei</FormLabel>
                <FormInput
                  placeholder="Digite um texto"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!errors.name}
                />
              </>
            )}
            {errors.name && <p className="text-xs text-main-danger">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            {isEditing ? (
              <DisplayField
                label="Número da lei"
                value={formData.number}
                required
              />
            ) : (
              <>
                <FormLabel required>Número da lei</FormLabel>
                <FormInput
                  placeholder="99.999/9999"
                  value={formData.number}
                  onChange={(e) => handleInputChange('number', formatNumeroLei(e.target.value))}
                  error={!!errors.number}
                />
              </>
            )}
            {errors.number && <p className="text-xs text-main-danger">{errors.number}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            {isEditing ? (
              <DisplayField
                label="Tipo de norma"
                value={formData.type}
                required
              />
            ) : (
              <>
                <FormLabel required>Tipo de norma</FormLabel>
                <FormSelect value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <FormSelectTrigger hasValue={!!formData.type} onClear={() => handleInputChange('type', '')}>
                    <FormSelectValue placeholder="Selecione uma opção" />
                  </FormSelectTrigger>
                  <FormSelectContent>
                    {typeOptions.map((option) => (
                      <FormSelectItem key={option.value} value={option.value}>
                        {option.label}
                      </FormSelectItem>
                    ))}
                  </FormSelectContent>
                </FormSelect>
              </>
            )}
            {errors.type && <p className="text-xs text-main-danger">{errors.type}</p>}
          </div>

          <div className="space-y-2">
            {isEditing ? (
              <DisplayField
                label="Esfera"
                value={formData.jurisdiction}
                required
              />
            ) : (
              <>
                <FormLabel required>Esfera</FormLabel>
                <FormSelect value={formData.jurisdiction} onValueChange={(value) => handleInputChange('jurisdiction', value)}>
                  <FormSelectTrigger hasValue={!!formData.jurisdiction} onClear={() => handleInputChange('jurisdiction', '')}>
                    <FormSelectValue placeholder="Selecione uma opção" />
                  </FormSelectTrigger>
                  <FormSelectContent>
                    {jurisdictionOptions.map((option) => (
                      <FormSelectItem key={option.value} value={option.value}>
                        {option.label}
                      </FormSelectItem>
                    ))}
                  </FormSelectContent>
                </FormSelect>
              </>
            )}
            {errors.jurisdiction && <p className="text-xs text-main-danger">{errors.jurisdiction}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            {isEditing ? (
              <DisplayField
                label="Processo associado"
                value={formData.associated_process}
              />
            ) : (
              <>
                <FormLabel>Processo associado</FormLabel>
                <FormSelect value={formData.associated_process} onValueChange={(value) => handleInputChange('associated_process', value)}>
                  <FormSelectTrigger hasValue={!!formData.associated_process} onClear={() => handleInputChange('associated_process', '')}>
                    <FormSelectValue placeholder="Selecione uma opção" />
                  </FormSelectTrigger>
                  <FormSelectContent>
                    {processOptions.map((option) => (
                      <FormSelectItem key={option.value} value={option.value}>
                        {option.label}
                      </FormSelectItem>
                    ))}
                  </FormSelectContent>
                </FormSelect>
              </>
            )}
            {errors.associated_process && <p className="text-xs text-main-danger">{errors.associated_process}</p>}
          </div>

          <div className="space-y-2">
            {isEditing ? (
              <DisplayField
                label="Data de publicação"
                value={formData.publication_date ? formData.publication_date.toLocaleDateString('pt-BR') : ''}
                required
              />
            ) : (
              <>
                <FormLabel required>Data de publicação</FormLabel>
                <FormDatePicker
                  date={formData.publication_date}
                  onDateChange={(date) => handleInputChange('publication_date', date)}
                  placeholder="__/__/____"
                  className={errors.publication_date ? 'border-main-danger' : ''}
                />
              </>
            )}
            {errors.publication_date && <p className="text-xs text-main-danger">{errors.publication_date}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <FormLabel required>Resumo/descrição</FormLabel>
          <FormTextarea
            placeholder="Digite um texto"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            error={!!errors.description}
          />
          {errors.description && <p className="text-xs text-main-danger">{errors.description}</p>}
        </div>

        <div className="space-y-2">
          <FormLabel required>Link da norma</FormLabel>
          <FormInput
            placeholder="Digite um link"
            value={formData.link}
            onChange={(e) => handleInputChange('link', e.target.value)}
            error={!!errors.link}
          />
          {errors.link && <p className="text-xs text-main-danger">{errors.link}</p>}
        </div>

        <div className="space-y-3 pt-4 border-t border-light-white">
          <h3 className="font-sora text-sm font-medium text-second-dark">
            Anexar documentos da norma
          </h3>
          <DocumentUpload
            documents={pendingFiles}
            onDocumentsChange={setPendingFiles}
          />
        </div>
      </div>
    </Modal>
  );
};

export { CadastrarLeiAplicavelModal };
