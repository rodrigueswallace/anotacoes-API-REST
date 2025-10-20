
import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { FormLabel } from '@/components/ui/form-label';
import { FormSelect } from '@/components/ui/form-select-simple';
import { FormSelectWithDynamic } from '@/components/ui/form-select-with-dynamic';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { FormTextarea } from '@/components/ui/form-textarea';
import { DisplayField } from '@/components/ui/display-field';
import { DocumentUpload, DocumentFile } from '@/components/ui/document-upload';
import { CEPInput } from '@/components/ui/cep-input';
import { formatUF, formatCNPJ, formatTelefone, formatNumeroEndereco } from '@/lib/formatters';
import { ufOptions } from '@/lib/municipios-brasil';
import { useMunicipios } from '@/hooks/use-municipios';
import { normalizeCityName } from '@/lib/string-utils';
import { useCredentialingEntityDocuments, useUploadCredentialingEntityFile, useDeleteCredentialingEntityDocument, useCreateCredentialingEntityDocument } from '@/hooks/useCredentialingEntityDocuments';
import { useCredentialingEntities } from '@/hooks/useCredentialingEntities';
import type { CredentialingEntityLocal } from '@/types/credentialing-entity.types';

export interface CadastrarEntidadeCredenciadaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: any) => Promise<any | void>;
  editData?: any;
  isEditing?: boolean;
}


const CadastrarEntidadeCredenciadaModal = ({ 
  open, 
  onOpenChange, 
  onSave, 
  editData, 
  isEditing = false 
}: CadastrarEntidadeCredenciadaModalProps) => {
  const { 
    checkCNPJExists, 
    checkEmailExists, 
    checkPhoneExists 
  } = useCredentialingEntities();

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    tipoEntidade: '',
    emailResponsavel: '',
    telefoneResponsavel: '',
    descricao: '',
    linkEdital: '',
    // Campos de endereço
    cep: '',
    uf: '',
    municipio: '',
    bairro: '',
    logradouro: '',
    numero: '',
    complemento: ''
  });

  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [documentsToDelete, setDocumentsToDelete] = useState<number[]>([]); // IDs dos documentos marcados para exclusão
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  
  // Hooks para documentos
  const { data: existingDocuments = [], refetch: refetchDocuments } = useCredentialingEntityDocuments(editData?.id || null);
  const uploadFileMutation = useUploadCredentialingEntityFile();
  const deleteDocMutation = useDeleteCredentialingEntityDocument();
  const createDocMutation = useCreateCredentialingEntityDocument();


  // Effect 1: Initialize form when modal opens
  useEffect(() => {
    if (open && editData) {
      setFormData({
        nome: editData.nome || '',
        cnpj: formatCNPJ(editData.cnpj || ''),
        tipoEntidade: editData.tipoEntidade || '',
        emailResponsavel: editData.emailResponsavel || '',
        telefoneResponsavel: formatTelefone(editData.telefoneResponsavel || ''),
        descricao: editData.descricao || '',
        linkEdital: editData.linkEdital || '',
        // Campos de endereço
        cep: editData.cep || '',
        uf: editData.uf || '',
        municipio: editData.municipio || '',
        bairro: editData.bairro || '',
        logradouro: editData.logradouro || '',
        numero: editData.numero || '',
        complemento: editData.complemento || ''
      });
    } else if (open && !editData) {
      setFormData({
        nome: '',
        cnpj: '',
        tipoEntidade: '',
        emailResponsavel: '',
        telefoneResponsavel: '',
        descricao: '',
        linkEdital: '',
        // Campos de endereço
        cep: '',
        uf: '',
        municipio: '',
        bairro: '',
        logradouro: '',
        numero: '',
        complemento: ''
      });
      setDocuments([]);
    }
  }, [open, editData]);

  // Effect 2: Load existing documents when editing
  useEffect(() => {
    if (open && editData && existingDocuments.length > 0) {
      const existingDocs: DocumentFile[] = existingDocuments.map(doc => ({
        id: doc.id.toString(),
        name: doc.title || doc.file_path?.split('/').pop() || 'Documento',
        comment: doc.description || '',
        status: 'Enviado' as const,
        url: doc.file_path
      }));
      
      setDocuments(existingDocs);
      setDocumentsToDelete([]); // Limpar lista de exclusões ao carregar documentos
    }
  }, [open, editData, existingDocuments]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };


  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    handleInputChange('cnpj', formatted);
  };


  const handleTelefoneChange = (value: string) => {
    const formatted = formatTelefone(value);
    handleInputChange('telefoneResponsavel', formatted);
  };

  const handleAddressFound = (address: {
    logradouro: string;
    bairro: string;
    cidade: string;
    cidadeNormalizada: string;
    uf: string;
  }) => {
    const ufUpperCase = address.uf.toUpperCase();
    
    // Usa o nome da cidade original (capitalizado) do ViaCEP
    setFormData(prev => ({
      ...prev,
      uf: ufUpperCase,
      logradouro: address.logradouro,
      bairro: address.bairro,
      municipio: address.cidade // Usa o nome original
    }));
    
    // Limpa possíveis erros dos campos preenchidos automaticamente
    const fieldsToClean = ['logradouro', 'bairro', 'municipio', 'uf'];
    setErrors(prev => {
      const newErrors = { ...prev };
      fieldsToClean.forEach(field => {
        if (newErrors[field]) delete newErrors[field];
      });
      return newErrors;
    });
  };

  const handleUFChange = (value: string) => {
    setFormData(prev => {
      const newData = { ...prev, uf: value };
      // Se mudou a UF, limpar o município
      newData.municipio = '';
      return newData;
    });
    // Clear error when field is modified
    if (errors.uf) {
      setErrors(prev => ({ ...prev, uf: '' }));
    }
  };

  // Municípios da API do IBGE
  const { municipios: municipiosOptions, isLoading: municipiosLoading, error: municipiosError } = useMunicipios(formData.uf);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const validateForm = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da entidade é obrigatório';
    }

    if (!isEditing) {
      if (!formData.cnpj.trim()) {
        newErrors.cnpj = 'CNPJ é obrigatório';
      } else if (formData.cnpj.replace(/\D/g, '').length !== 14) {
        newErrors.cnpj = 'CNPJ inválido';
      } else {
        // Check for duplicate CNPJ
        try {
          const exists = await checkCNPJExists(formData.cnpj, editData?.id);
          if (exists) {
            newErrors.cnpj = 'Este CNPJ já está cadastrado. Por favor, verifique.';
          }
        } catch (error) {
          console.error('Error checking CNPJ:', error);
        }
      }
    }

    if (!formData.tipoEntidade) {
      newErrors.tipoEntidade = 'Tipo de entidade é obrigatório';
    }

    if (!formData.emailResponsavel.trim()) {
      newErrors.emailResponsavel = 'E-mail do responsável é obrigatório';
    } else if (!validateEmail(formData.emailResponsavel)) {
      newErrors.emailResponsavel = 'E-mail inválido';
    } else {
      // Check for duplicate email
      try {
        const exists = await checkEmailExists(formData.emailResponsavel, editData?.id);
        if (exists) {
          newErrors.emailResponsavel = 'Este e-mail já está em uso. Por favor, use outro.';
        }
      } catch (error) {
        console.error('Error checking email:', error);
      }
    }

    // Check for duplicate phone if provided
    if (formData.telefoneResponsavel.trim()) {
      try {
        const exists = await checkPhoneExists(formData.telefoneResponsavel, editData?.id);
        if (exists) {
          newErrors.telefoneResponsavel = 'Este telefone já está cadastrado. Por favor, use outro.';
        }
      } catch (error) {
        console.error('Error checking phone:', error);
      }
    }

    // Validações de endereço
    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
    if (!formData.uf.trim()) newErrors.uf = 'UF é obrigatório';
    if (!formData.municipio.trim()) newErrors.municipio = 'Município é obrigatório';
    if (!formData.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório';
    if (!formData.logradouro.trim()) newErrors.logradouro = 'Logradouro é obrigatório';
    if (!formData.numero.trim()) newErrors.numero = 'Número é obrigatório';

    // Validação de UF (2 caracteres)
    if (formData.uf.trim() && formData.uf.length !== 2) {
      newErrors.uf = 'UF deve ter 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setIsValidating(true);
    const isValid = await validateForm();
    setIsValidating(false);

    if (isValid) {
      // Fechar modal antes de processar
      onOpenChange(false);
      
      setTimeout(async () => {
        try {
        const savedEntity = await onSave?.({ ...formData });
      
      // Processar exclusões de documentos marcados para exclusão
      if (isEditing && documentsToDelete.length > 0) {
        for (const docId of documentsToDelete) {
          try {
            await deleteDocMutation.mutateAsync(docId);
          } catch (error) {
            console.error('Error deleting document:', error);
          }
        }
      }
      
      // Get only newly created documents (status === 'Criado')
      const newDocuments = documents.filter(doc => doc.status === 'Criado' && doc.file);
      
      // Upload new documents if editing an existing entity
      if (isEditing && editData?.id && newDocuments.length > 0) {
        for (const doc of newDocuments) {
          if (!doc.file) continue;
          
          try {
            const publicUrl = await uploadFileMutation.mutateAsync({
              file: doc.file,
              entityId: editData.id
            });
            
            await createDocMutation.mutateAsync({
              title: doc.name || doc.file.name,
              description: doc.comment || undefined,
              file_path: publicUrl,
              mime_type: doc.file.type || 'application/octet-stream',
              s_her_m_org_t_credentialing_entity_c_id: editData.id
            });
          } catch (error) {
            console.error('Error uploading document:', error);
          }
        }
        
        await refetchDocuments();
      }
      
      // Handle new entity creation with new documents
      if (!isEditing && savedEntity?.id && newDocuments.length > 0) {
        for (const doc of newDocuments) {
          if (!doc.file) continue;
          
          try {
            const publicUrl = await uploadFileMutation.mutateAsync({
              file: doc.file,
              entityId: savedEntity.id
            });
            
            await createDocMutation.mutateAsync({
              title: doc.name || doc.file.name,
              description: doc.comment || undefined,
              file_path: publicUrl,
              mime_type: doc.file.type || 'application/octet-stream',
              s_her_m_org_t_credentialing_entity_c_id: savedEntity.id
            });
          } catch (error) {
            console.error('Error uploading document:', error);
          }
        }
          
          await refetchDocuments();
        }
            
        resetForm();
      } catch (error: any) {
        console.error('Error saving entity:', error);
        
        // Handle 409 conflict errors
        if (error?.message?.includes('409') || error?.code === '23505') {
          if (error?.message?.toLowerCase().includes('cnpj')) {
            setErrors(prev => ({ ...prev, cnpj: 'Este CNPJ já está cadastrado. Por favor, verifique.' }));
          } else if (error?.message?.toLowerCase().includes('email') || error?.message?.toLowerCase().includes('e-mail')) {
            setErrors(prev => ({ ...prev, emailResponsavel: 'Este e-mail já está em uso. Por favor, use outro.' }));
          } else if (error?.message?.toLowerCase().includes('phone') || error?.message?.toLowerCase().includes('telefone')) {
            setErrors(prev => ({ ...prev, telefoneResponsavel: 'Este telefone já está cadastrado. Por favor, use outro.' }));
          }
        }
      }
      }, 100);
    }
  };

  const handleCancel = () => {
    // Restaurar documentos originais ao cancelar
    if (isEditing && existingDocuments.length > 0) {
      const existingDocs: DocumentFile[] = existingDocuments.map(doc => ({
        id: doc.id.toString(),
        name: doc.title || doc.file_path?.split('/').pop() || 'Documento',
        comment: doc.description || '',
        status: 'Enviado' as const,
        url: doc.file_path
      }));
      setDocuments(existingDocs);
    }
    setDocumentsToDelete([]); // Limpar lista de exclusões
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cnpj: '',
      tipoEntidade: '',
      emailResponsavel: '',
      telefoneResponsavel: '',
      descricao: '',
      linkEdital: '',
      // Campos de endereço
      cep: '',
      uf: '',
      municipio: '',
      bairro: '',
      logradouro: '',
      numero: '',
      complemento: ''
    });
    setDocuments([]);
    setDocumentsToDelete([]);
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
      <PrimaryGhostButton onClick={handleCancel} disabled={isValidating}>
        Cancelar
      </PrimaryGhostButton>
      <PrimaryButton onClick={handleSave} disabled={isValidating}>
        {isValidating ? 'Validando...' : 'Salvar'}
      </PrimaryButton>
    </>
  );

  return (
    <Modal
      open={open}
      onOpenChange={handleModalClose}
      title={isEditing ? "Editar entidades credenciadas" : "Cadastrar entidades credenciadas"}
      actions={actions}
      className="sm:max-w-4xl"
      preventCloseOnEscape
      preventCloseOnInteractOutside
    >
      <div className="space-y-6">
        {/* Seção: Dados da entidade */}
        <div className="space-y-4">
          <h3 className="font-sora text-base font-semibold text-second-dark">
            Dados da entidade
          </h3>
          
          <div className="space-y-4">
            {/* Nome da entidade - linha completa */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-12 space-y-2">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Nome da entidade <span className="text-main-danger">*</span>
                </FormLabel>
                <FormInput
                  placeholder="Digite um texto"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  error={!!errors.nome}
                  className="font-sora"
                />
                {errors.nome && <p className="text-xs text-main-danger font-sora">{errors.nome}</p>}
              </div>
            </div>

            {/* Tipo de entidade e CNPJ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-w-0">
              <div className="lg:col-span-6 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Tipo de entidade <span className="text-main-danger">*</span>
                </FormLabel>
                <FormInput
                  placeholder="Digite o tipo de entidade"
                  value={formData.tipoEntidade}
                  onChange={(e) => handleInputChange('tipoEntidade', e.target.value)}
                  error={!!errors.tipoEntidade}
                  className="font-sora"
                />
                {errors.tipoEntidade && <p className="text-xs text-main-danger font-sora">{errors.tipoEntidade}</p>}
              </div>

              <div className="lg:col-span-6 space-y-2 min-w-0">
                {isEditing ? (
                  <DisplayField
                    label="CNPJ"
                    value={formData.cnpj}
                    required
                  />
                ) : (
                  <>
                    <FormLabel className="font-sora text-sm font-medium text-second-dark">
                      CNPJ <span className="text-main-danger">*</span>
                    </FormLabel>
                    <FormInput
                      placeholder="__.___.___/____-__"
                      value={formData.cnpj}
                      onChange={(e) => handleCNPJChange(e.target.value)}
                      error={!!errors.cnpj}
                      className="font-sora"
                    />
                    {errors.cnpj && <p className="text-xs text-main-danger font-sora">{errors.cnpj}</p>}
                  </>
                )}
              </div>
            </div>

            {/* E-mail e Telefone */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-w-0">
              <div className="lg:col-span-8 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  E-mail do responsável <span className="text-main-danger">*</span>
                </FormLabel>
                <FormInput
                  type="email"
                  placeholder="email.institucional@exemplo.com"
                  value={formData.emailResponsavel}
                  onChange={(e) => handleInputChange('emailResponsavel', e.target.value)}
                  error={!!errors.emailResponsavel}
                  className="font-sora"
                />
                {errors.emailResponsavel && <p className="text-xs text-main-danger font-sora">{errors.emailResponsavel}</p>}
              </div>

              <div className="lg:col-span-4 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Telefone do responsável
                </FormLabel>
                <FormInput
                  placeholder="(__) _____-____"
                  value={formData.telefoneResponsavel}
                  onChange={(e) => handleTelefoneChange(e.target.value)}
                  className="font-sora"
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-12 space-y-2">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Descrição
                </FormLabel>
                <FormTextarea
                  placeholder="Digite um texto"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  rows={4}
                  className="font-sora"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seção: Endereço da entidade */}
        <div className="space-y-4">
          <h3 className="font-sora text-base font-semibold text-second-dark">
            Endereço da entidade
          </h3>
          
          <div className="space-y-4">
            {/* CEP, UF, Município, Bairro */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-w-0">
              <div className="lg:col-span-3 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  CEP <span className="text-main-danger">*</span>
                </FormLabel>
                <CEPInput
                  value={formData.cep}
                  onChange={(value) => handleInputChange('cep', value)}
                  onAddressFound={handleAddressFound}
                  placeholder="00000-000"
                  error={errors.cep}
                />
              </div>

              <div className="lg:col-span-2 space-y-2">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  UF <span className="text-main-danger">*</span>
                </FormLabel>
                <FormSelect
                  value={formData.uf}
                  onValueChange={handleUFChange}
                  placeholder="Selecione"
                  options={ufOptions}
                  error={!!errors.uf}
                />
                {errors.uf && <p className="text-xs text-main-danger font-sora">{errors.uf}</p>}
              </div>

              <div className="lg:col-span-4 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Município <span className="text-main-danger">*</span>
                </FormLabel>
                <FormSelectWithDynamic
                  value={formData.municipio}
                  onValueChange={(value) => handleInputChange('municipio', value)}
                  placeholder={municipiosLoading ? "Carregando municípios..." : "Selecione um município"}
                  staticOptions={municipiosOptions}
                  error={!!errors.municipio}
                  disabled={!formData.uf || municipiosLoading}
                  className="font-sora"
                />
                {municipiosError && <p className="text-xs text-amber-600 font-sora">{municipiosError}</p>}
                {errors.municipio && <p className="text-xs text-main-danger font-sora">{errors.municipio}</p>}
              </div>

              <div className="lg:col-span-3 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Bairro <span className="text-main-danger">*</span>
                </FormLabel>
                <FormInput 
                  value={formData.bairro} 
                  onChange={(e) => handleInputChange('bairro', e.target.value)} 
                  placeholder="Digite o bairro" 
                  error={!!errors.bairro} 
                  className="font-sora" 
                />
                {errors.bairro && <p className="text-xs text-main-danger font-sora">{errors.bairro}</p>}
              </div>
            </div>

            {/* Logradouro */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-w-0">
              <div className="lg:col-span-12 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Logradouro <span className="text-main-danger">*</span>
                </FormLabel>
                <FormInput 
                  value={formData.logradouro} 
                  onChange={(e) => handleInputChange('logradouro', e.target.value)} 
                  placeholder="Digite o logradouro" 
                  error={!!errors.logradouro} 
                  className="font-sora" 
                />
                {errors.logradouro && <p className="text-xs text-main-danger font-sora">{errors.logradouro}</p>}
              </div>
            </div>

            {/* Número e Complemento */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-w-0">
              <div className="lg:col-span-3 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Número <span className="text-main-danger">*</span>
                </FormLabel>
                <FormInput 
                  value={formData.numero} 
                  onChange={(e) => handleInputChange('numero', formatNumeroEndereco(e.target.value))} 
                  placeholder="Nº ou SN" 
                  error={!!errors.numero} 
                  className="font-sora" 
                />
                {errors.numero && <p className="text-xs text-main-danger font-sora">{errors.numero}</p>}
              </div>

              <div className="lg:col-span-9 space-y-2 min-w-0">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Complemento
                </FormLabel>
                <FormInput 
                  value={formData.complemento} 
                  onChange={(e) => handleInputChange('complemento', e.target.value)} 
                  placeholder="Digite o complemento" 
                  error={!!errors.complemento} 
                  className="font-sora" 
                />
                {errors.complemento && <p className="text-xs text-main-danger font-sora">{errors.complemento}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Seção: Anexos */}
        <div className="space-y-4">
          <h3 className="font-sora text-base font-semibold text-second-dark">
            Anexos
          </h3>
          
          <div className="space-y-4">
            {/* Link do edital */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-12 space-y-2">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Link do edital
                </FormLabel>
                <FormInput
                  placeholder="Digite um link"
                  value={formData.linkEdital}
                  onChange={(e) => handleInputChange('linkEdital', e.target.value)}
                  className="font-sora"
                />
              </div>
            </div>

            {/* Anexar documentos do edital */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-12 space-y-2">
                <FormLabel className="font-sora text-sm font-medium text-second-dark">
                  Anexar documentos do edital
                </FormLabel>
                <DocumentUpload
                  documents={documents}
                  onDocumentsChange={(updatedDocs) => {
                    // Identificar documentos existentes que foram removidos
                    const deletedDocs = documents.filter(
                      doc => doc.status === 'Enviado' && !updatedDocs.find(d => d.id === doc.id)
                    );
                    
                    // Marcar documentos para exclusão em vez de deletar imediatamente
                    deletedDocs.forEach((doc) => {
                      const numericId = parseInt(doc.id);
                      if (!isNaN(numericId) && !documentsToDelete.includes(numericId)) {
                        setDocumentsToDelete(prev => [...prev, numericId]);
                      }
                    });
                    
                    setDocuments(updatedDocs);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { CadastrarEntidadeCredenciadaModal };
