
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { FormTextarea } from '@/components/ui/form-textarea';
import { FormLabel } from '@/components/ui/form-label';
import { FormSearchableSelect } from '@/components/ui/form-searchable-select';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { CurrencyInput } from '@/components/ui/currency-input';
import { DisplayField } from '@/components/ui/display-field';
import { PrimaryButton, PrimaryGhostButton } from '@/components/ui/primary-buttons';
import { DocumentUpload, DocumentFile } from '@/components/ui/document-upload';
import { formatCNPJ } from '@/lib/formatters';
import { useFundingSources } from '@/hooks/useFundingSources';
import { useExternalParties } from '@/hooks/useExternalParties';
import { useAgreementDocuments, useUploadAgreementFile, useCreateAgreementDocument, useDeleteAgreementDocument } from '@/hooks/useAgreementDocuments';
import { useCheckAgreementCode, useCheckAgreementCNPJ } from '@/hooks/useAgreements';
import { agreementDocumentsService } from '@/services/agreement-documents.service';
import { toLocalFormat as docToLocalFormat } from '@/types/agreement-document.types';
import type { AgreementLocal } from '@/types/agreement.types';
import { format, parse } from 'date-fns';

const MAX_DESCRIPTION_LENGTH = 128;

export interface CadastrarConvenioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: Partial<AgreementLocal>) => void;
  onSuccess?: () => void;
  editingItem?: AgreementLocal;
  viewingItem?: AgreementLocal;
}

const CadastrarConvenioModal = ({ 
  open, 
  onOpenChange, 
  onSave, 
  onSuccess,
  editingItem, 
  viewingItem 
}: CadastrarConvenioModalProps) => {
  const { data: fundingSources = [], isLoading: isLoadingFundingSources } = useFundingSources();
  const { externalParties = [], isLoading: isLoadingParties } = useExternalParties();
  const checkCodeMutation = useCheckAgreementCode();
  const checkCNPJMutation = useCheckAgreementCNPJ();
  
  const agreementId = editingItem?.id || viewingItem?.id || null;
  const { data: existingDocuments = [] } = useAgreementDocuments(agreementId);
  const uploadFileMutation = useUploadAgreementFile();
  const createDocumentMutation = useCreateAgreementDocument();
  const deleteDocumentMutation = useDeleteAgreementDocument();

  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    cnpj: '',
    objeto: '',
    data_inicio: '',
    data_fim: '',
    valor_total: '',
    fonte_recurso_id: '',
    fornecedor_id: '',
    descricao: ''
  });

  const [dateInicio, setDateInicio] = useState<Date | undefined>(undefined);
  const [dateFim, setDateFim] = useState<Date | undefined>(undefined);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const isEditing = !!editingItem;
  const isViewing = !!viewingItem;

  // Reset form when modal opens/closes (Effect 1: Form initialization)
  useEffect(() => {
    if (open) {
      if (editingItem) {
        setFormData({
          codigo: editingItem.codigo || '',
          nome: editingItem.nome || '',
          cnpj: formatCNPJ(editingItem.cnpj || ''),
          objeto: editingItem.objeto || '',
          data_inicio: editingItem.data_inicio || '',
          data_fim: editingItem.data_fim || '',
          valor_total: editingItem.valor_total || '',
          fonte_recurso_id: editingItem.fonte_recurso_id || '',
          fornecedor_id: editingItem.fornecedor_id || '',
          descricao: editingItem.descricao || ''
        });
        // Parse dates for date pickers - only if valid
        if (editingItem.data_inicio && editingItem.data_inicio.trim() !== '') {
          const parsedDate = parse(editingItem.data_inicio, 'yyyy-MM-dd', new Date());
          if (!isNaN(parsedDate.getTime())) {
            setDateInicio(parsedDate);
          } else {
            setDateInicio(undefined);
          }
        } else {
          setDateInicio(undefined);
        }
        if (editingItem.data_fim && editingItem.data_fim.trim() !== '') {
          const parsedDate = parse(editingItem.data_fim, 'yyyy-MM-dd', new Date());
          if (!isNaN(parsedDate.getTime())) {
            setDateFim(parsedDate);
          } else {
            setDateFim(undefined);
          }
        } else {
          setDateFim(undefined);
        }
      } else if (viewingItem) {
        setFormData({
          codigo: viewingItem.codigo || '',
          nome: viewingItem.nome || '',
          cnpj: formatCNPJ(viewingItem.cnpj || ''),
          objeto: viewingItem.objeto || '',
          data_inicio: viewingItem.data_inicio || '',
          data_fim: viewingItem.data_fim || '',
          valor_total: viewingItem.valor_total || '',
          fonte_recurso_id: viewingItem.fonte_recurso_id || '',
          fornecedor_id: viewingItem.fornecedor_id || '',
          descricao: viewingItem.descricao || ''
        });
        // Parse dates for date pickers - only if valid
        if (viewingItem.data_inicio && viewingItem.data_inicio.trim() !== '') {
          const parsedDate = parse(viewingItem.data_inicio, 'yyyy-MM-dd', new Date());
          if (!isNaN(parsedDate.getTime())) {
            setDateInicio(parsedDate);
          } else {
            setDateInicio(undefined);
          }
        } else {
          setDateInicio(undefined);
        }
        if (viewingItem.data_fim && viewingItem.data_fim.trim() !== '') {
          const parsedDate = parse(viewingItem.data_fim, 'yyyy-MM-dd', new Date());
          if (!isNaN(parsedDate.getTime())) {
            setDateFim(parsedDate);
          } else {
            setDateFim(undefined);
          }
        } else {
          setDateFim(undefined);
        }
      } else {
        setFormData({
          codigo: '',
          nome: '',
          cnpj: '',
          objeto: '',
          data_inicio: '',
          data_fim: '',
          valor_total: '',
          fonte_recurso_id: '',
          fornecedor_id: '',
          descricao: ''
        });
        setDateInicio(undefined);
        setDateFim(undefined);
        setDocuments([]);
      }
      setErrors({});
    }
  }, [open, editingItem, viewingItem]);

  // Load documents separately (Effect 2: Document loading)
  useEffect(() => {
    if (open && (editingItem || viewingItem) && existingDocuments.length > 0) {
      const docs = existingDocuments.map(docToLocalFormat);
      setDocuments(docs.map(d => ({
        id: d.id,
        name: d.nome,
        comment: d.comentario,
        status: 'Enviado' as const,
        url: d.url
      })));
    }
  }, [open, editingItem, viewingItem, existingDocuments]);

  const fundingSourceOptions = fundingSources.map(fs => ({
    value: fs.id,
    label: fs.nome
  }));

  const externalPartyOptions = externalParties.map(ep => ({
    value: ep.id.toString(),
    label: ep.nome
  }));

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDateInicioChange = (date: Date | undefined) => {
    setDateInicio(date);
    if (date && !isNaN(date.getTime()) && date.getFullYear() >= 1900 && date.getFullYear() <= 2100) {
      handleInputChange('data_inicio', format(date, 'yyyy-MM-dd'));
    } else {
      handleInputChange('data_inicio', '');
    }
  };

  const handleDateFimChange = (date: Date | undefined) => {
    setDateFim(date);
    if (date && !isNaN(date.getTime()) && date.getFullYear() >= 1900 && date.getFullYear() <= 2100) {
      handleInputChange('data_fim', format(date, 'yyyy-MM-dd'));
    } else {
      handleInputChange('data_fim', '');
    }
  };

  const handleCurrencyChange = (numericValue: number) => {
    handleInputChange('valor_total', numericValue.toString());
  };


  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    handleInputChange('cnpj', formatted);
  };

  const validateForm = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'Código do convênio é obrigatório';
    } else if (formData.codigo.trim().length < 3) {
      newErrors.codigo = 'Código deve ter no mínimo 3 caracteres';
    } else {
      // Check for duplicate code
      try {
        const exists = await checkCodeMutation.mutateAsync({ 
          code: formData.codigo, 
          excludeId: editingItem?.id 
        });
        if (exists) {
          newErrors.codigo = 'Este código já está em uso. Por favor, escolha outro código.';
        }
      } catch (error) {
        console.error('Error checking code:', error);
      }
    }

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome do convênio é obrigatório';
    }

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    } else if (formData.cnpj.replace(/\D/g, '').length !== 14) {
      newErrors.cnpj = 'CNPJ deve conter 14 dígitos';
    } else {
      // Check for duplicate CNPJ
      try {
        const exists = await checkCNPJMutation.mutateAsync({ 
          cnpj: formData.cnpj, 
          excludeId: editingItem?.id 
        });
        if (exists) {
          newErrors.cnpj = 'Este CNPJ já está cadastrado para outro convênio.';
        }
      } catch (error) {
        console.error('Error checking CNPJ:', error);
      }
    }

    if (!formData.objeto.trim()) {
      newErrors.objeto = 'Objeto do convênio é obrigatório';
    }

    if (!formData.data_inicio) {
      newErrors.data_inicio = 'Data de início é obrigatória';
    }

    if (!formData.data_fim) {
      newErrors.data_fim = 'Data de fim é obrigatória';
    }

    if (formData.data_inicio && formData.data_fim && formData.data_inicio >= formData.data_fim) {
      newErrors.data_fim = 'Data de fim deve ser posterior à data de início';
    }

    if (!formData.valor_total || formData.valor_total.trim() === '' || formData.valor_total === '0') {
      newErrors.valor_total = 'Valor total é obrigatório';
    } else {
      const numericValue = parseFloat(formData.valor_total);
      if (isNaN(numericValue) || numericValue <= 0) {
        newErrors.valor_total = 'Valor deve ser maior que zero';
      }
    }

    if (!formData.fonte_recurso_id) {
      newErrors.fonte_recurso_id = 'Fonte de recurso é obrigatória';
    }

    if (!formData.fornecedor_id) {
      newErrors.fornecedor_id = 'Fornecedor é obrigatório';
    }

    if (formData.descricao && formData.descricao.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.descricao = `Descrição não pode exceder ${MAX_DESCRIPTION_LENGTH} caracteres`;
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
        setIsLoading(true);
        try {
          // Verificar se há mudanças nos dados do convênio (apenas em modo de edição)
          const hasDataChanges = isEditing && (
            formData.codigo !== editingItem?.codigo ||
            formData.nome !== editingItem?.nome ||
            formData.cnpj !== editingItem?.cnpj ||
            formData.objeto !== editingItem?.objeto ||
            formData.valor_total !== editingItem?.valor_total ||
            formData.data_inicio !== editingItem?.data_inicio ||
            formData.data_fim !== editingItem?.data_fim ||
            formData.descricao !== editingItem?.descricao ||
            formData.fonte_recurso_id !== editingItem?.fonte_recurso_id?.toString() ||
            formData.fornecedor_id !== editingItem?.fornecedor_id?.toString()
          );

          // Só atualizar convênio se houver mudanças ou for criação
          if (!isEditing || hasDataChanges) {
            await onSave?.(formData);
          }
        
          // Upload new documents (sempre processar)
          const newDocs = documents.filter(d => d.status === 'Criado' && d.file);
          const currentAgreementId = editingItem?.id || agreementId;
        
          if (currentAgreementId && newDocs.length > 0) {
            for (const doc of newDocs) {
              if (doc.file) {
                const publicUrl = await uploadFileMutation.mutateAsync({ 
                  file: doc.file, 
                  agreementId: currentAgreementId 
                });
              
                await createDocumentMutation.mutateAsync({
                  s_her_m_fin_t_agreement_c_id: parseInt(currentAgreementId),
                  title: doc.name,
                  file_path: publicUrl,
                  mime_type: doc.file.type,
                  description: doc.comment || null
                });
              }
            }
          }
        
          onSuccess?.();
        } catch (error: any) {
          console.error('Erro ao salvar convênio:', error);
        
          // Handle 409 conflict errors
          if (error?.message?.includes('409') || error?.code === '23505') {
            if (error?.message?.toLowerCase().includes('code') || error?.message?.toLowerCase().includes('código')) {
              setErrors(prev => ({ ...prev, codigo: 'Este código já está em uso. Por favor, escolha outro código.' }));
            } else if (error?.message?.toLowerCase().includes('cnpj')) {
              setErrors(prev => ({ ...prev, cnpj: 'Este CNPJ já está cadastrado para outro convênio.' }));
            }
          }
        } finally {
          setIsLoading(false);
        }
      }, 100);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const actions = !isViewing ? (
    <>
      <PrimaryGhostButton onClick={handleCancel} disabled={isLoading || isValidating}>
        Cancelar
      </PrimaryGhostButton>
      <PrimaryButton onClick={handleSave} disabled={isLoading || isValidating}>
        {isValidating ? 'Validando...' : isLoading ? 'Salvando...' : 'Salvar'}
      </PrimaryButton>
    </>
  ) : (
    <PrimaryGhostButton onClick={handleCancel}>
      Fechar
    </PrimaryGhostButton>
  );

  const modalTitle = isViewing 
    ? "Visualizar convênio" 
    : isEditing 
      ? "Editar convênio" 
      : "Cadastrar convênio";

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={modalTitle}
      actions={actions}
      className="max-w-[60vw]"
      maxHeight="70vh"
      preventCloseOnInteractOutside
      preventCloseOnEscape
    >
      <div className="space-y-4">
        {/* Primeira linha → Código do convênio (menor) + Nome do convênio (maior) */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          <div className="lg:col-span-2 space-y-1">
            {isViewing ? (
              <DisplayField
                label="Código do convênio"
                value={formData.codigo}
                required
              />
            ) : (
              <>
                <FormLabel required>Código do convênio</FormLabel>
                <FormInput
                  placeholder="Digite o código"
                  value={formData.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value)}
                  error={!!errors.codigo}
                  disabled={isEditing}
                />
                {errors.codigo && <p className="text-xs text-main-danger">{errors.codigo}</p>}
              </>
            )}
          </div>

          <div className="lg:col-span-5 space-y-1">
            {isViewing ? (
              <DisplayField
                label="Nome do convênio"
                value={formData.nome}
                required
              />
            ) : (
              <>
                <FormLabel required>Nome do convênio</FormLabel>
                <FormInput
                  placeholder="Digite o nome do convênio"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  error={!!errors.nome}
                  disabled={isEditing}
                />
                {errors.nome && <p className="text-xs text-main-danger">{errors.nome}</p>}
              </>
            )}
          </div>
        </div>

        {/* Segunda linha → CNPJ + Entidade concedente */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          <div className="lg:col-span-2 space-y-1">
            {isViewing ? (
              <DisplayField
                label="CNPJ"
                value={formData.cnpj}
                required
              />
            ) : (
              <>
                <FormLabel required>CNPJ</FormLabel>
                <FormInput
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={(e) => handleCNPJChange(e.target.value)}
                  error={!!errors.cnpj}
                  disabled={isEditing}
                />
                {errors.cnpj && <p className="text-xs text-main-danger">{errors.cnpj}</p>}
              </>
            )}
          </div>

          <div className="lg:col-span-5 space-y-1">
            <FormLabel required>Entidade concedente</FormLabel>
            {isViewing ? (
              <DisplayField
                label=""
                value={externalPartyOptions.find(opt => opt.value === formData.fornecedor_id)?.label || formData.fornecedor_id}
                className="space-y-0"
              />
            ) : (
              <>
                <FormSearchableSelect
                  placeholder="Selecione uma entidade concedente"
                  value={formData.fornecedor_id}
                  onValueChange={(value) => handleInputChange('fornecedor_id', value)}
                  options={externalPartyOptions}
                  error={!!errors.fornecedor_id}
                  disabled={isViewing || isLoadingParties || isEditing}
                />
                {errors.fornecedor_id && <p className="text-xs text-main-danger">{errors.fornecedor_id}</p>}
              </>
            )}
          </div>
        </div>

        {/* Terceira linha → Objeto do convênio */}
        <div className="space-y-1">
          {isViewing ? (
            <DisplayField
              label="Objeto do convênio"
              value={formData.objeto}
              required
            />
          ) : (
            <>
              <FormLabel required>Objeto do convênio</FormLabel>
              <FormTextarea
                placeholder="Descreva o objeto do convênio"
                value={formData.objeto}
                onChange={(e) => handleInputChange('objeto', e.target.value)}
                error={!!errors.objeto}
                rows={4}
              />
              {errors.objeto && <p className="text-xs text-main-danger">{errors.objeto}</p>}
            </>
          )}
        </div>

        {/* Quarta linha → Data de início + Data de fim + Valor total */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            {isViewing ? (
              <DisplayField
                label="Data de início"
                value={formData.data_inicio ? format(parse(formData.data_inicio, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy') : ''}
                required
              />
            ) : (
              <>
                <FormLabel required>Data de início</FormLabel>
                <FormDatePicker
                  date={dateInicio}
                  onDateChange={handleDateInicioChange}
                  placeholder="Selecione a data"
                  disabled={isEditing}
                />
                {errors.data_inicio && <p className="text-xs text-main-danger">{errors.data_inicio}</p>}
              </>
            )}
          </div>

          <div className="space-y-1">
            {isViewing ? (
              <DisplayField
                label="Data de fim"
                value={formData.data_fim ? format(parse(formData.data_fim, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy') : ''}
                required
              />
            ) : (
              <>
                <FormLabel required>Data de fim</FormLabel>
                <FormDatePicker
                  date={dateFim}
                  onDateChange={handleDateFimChange}
                  placeholder="Selecione a data"
                />
                {errors.data_fim && <p className="text-xs text-main-danger">{errors.data_fim}</p>}
              </>
            )}
          </div>

          <div className="space-y-1">
            {isViewing ? (
              <DisplayField
                label="Valor total"
                value={`R$ ${parseFloat(formData.valor_total || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                required
              />
            ) : (
              <>
                <FormLabel required>Valor total</FormLabel>
                <CurrencyInput
                  value={parseFloat(formData.valor_total || '0')}
                  onValueChange={handleCurrencyChange}
                  placeholder="R$ 0,00"
                  className={errors.valor_total ? 'border-main-danger' : ''}
                />
                {errors.valor_total && <p className="text-xs text-main-danger">{errors.valor_total}</p>}
              </>
            )}
          </div>
        </div>

        {/* Quinta linha → Fonte de recurso vinculada (largura completa) */}
        <div className="space-y-1">
          <FormLabel required>Fonte de recurso vinculada</FormLabel>
          {isViewing ? (
            <DisplayField
              label=""
              value={fundingSourceOptions.find(opt => opt.value === formData.fonte_recurso_id)?.label || formData.fonte_recurso_id}
              className="space-y-0"
            />
          ) : (
            <>
              <FormSearchableSelect
                placeholder="Selecione uma fonte de recurso"
                value={formData.fonte_recurso_id}
                onValueChange={(value) => handleInputChange('fonte_recurso_id', value)}
                options={fundingSourceOptions}
                error={!!errors.fonte_recurso_id}
                disabled={isViewing || isLoadingFundingSources || isEditing}
              />
              {errors.fonte_recurso_id && <p className="text-xs text-main-danger">{errors.fonte_recurso_id}</p>}
            </>
          )}
        </div>

        {/* Sexta linha → Descrição (full width) */}
        <div className="space-y-1">
          <FormLabel>Descrição</FormLabel>
          <FormTextarea
            placeholder="Digite uma descrição adicional (opcional)"
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            rows={4}
            maxLength={MAX_DESCRIPTION_LENGTH}
            error={!!errors.descricao}
            disabled={isViewing}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.descricao.length}/{MAX_DESCRIPTION_LENGTH} caracteres
          </p>
          {errors.descricao && <p className="text-xs text-main-danger">{errors.descricao}</p>}
        </div>

        {/* Anexar documentos do convênio */}
        <div className="space-y-3 pt-4 border-t border-light-white">
          <h3 className="font-sora text-sm font-medium text-second-dark">
            Anexar documentos do convênio
          </h3>
          <DocumentUpload
            documents={documents}
            onDocumentsChange={setDocuments}
          />
        </div>
      </div>
    </Modal>
  );
};

export { CadastrarConvenioModal };
