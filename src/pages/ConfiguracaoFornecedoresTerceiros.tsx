import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGallery } from '@/components/ui/data-gallery';
import { Breadcrumb } from '@/components/ui/breadcrumb-navigation';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
import { ToggleStatusIcon } from '@/components/ui/toggle-status-icon';
import { AddIcon } from '@/components/ui/add-icon';
import { CadastrarFornecedorTerceiroModal } from '@/components/modals/CadastrarFornecedorTerceiroModal';
import { HistoricoModal } from '@/components/modals/HistoricoModal';
import { StandardModalsWrapper } from '@/components/modals/StandardModalsWrapper';
import { useStandardModals } from '@/hooks/use-standard-modals';
import { UserAction } from '@/components/ui/user-action-history';
import { formatCPFOrCNPJ, formatTelefone } from '@/lib/formatters';
import { useToastify } from '@/hooks/use-toastify';
import { containsNormalized } from '@/lib/string-utils';
import { useExternalParties } from '@/hooks/useExternalParties';
import type { ExternalPartyLocal } from '@/types/external-party.types';
import { useExternalPartyAuditLog } from '@/hooks/useExternalPartyAuditLog';
import { getHistoryIconByActionType } from '@/lib/history-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ConfiguracaoFornecedoresTerceiros = () => {
  const navigate = useNavigate();
  const { toast } = useToastify();
  const modalStates = useStandardModals();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<ExternalPartyLocal | null>(null);
  const [selectedItem, setSelectedItem] = useState<ExternalPartyLocal | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [historicoModalOpen, setHistoricoModalOpen] = useState(false);
  const [selectedItemHistorico, setSelectedItemHistorico] = useState<ExternalPartyLocal | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const {
    externalParties,
    isLoading,
    refetch,
    createExternalParty,
    updateExternalParty,
    toggleStatus
  } = useExternalParties();

  // Hook para buscar histórico do fornecedor/terceiro selecionado
  const { 
    data: auditLogs = [], 
    refetch: refetchAuditLogs 
  } = useExternalPartyAuditLog(
    selectedItemHistorico ? selectedItemHistorico.id : null
  );

  const breadcrumbPath = [
    { label: "Home", href: "/", icon: "home" as const },
    { label: "Gestão de bens móveis", href: "/?tab=gestao-bens-moveis" },
    { label: "Configurações", href: "/gestao-bens-moveis/configuracoes" },
    { label: "Fornecedores e terceiros", current: true }
  ];

  const handleBack = () => navigate("/gestao-bens-moveis/configuracoes");
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const columns = [
    { key: 'nome', title: 'Nome', sortable: true, width: 'auto' },
    { 
      key: 'cpf_cnpj', title: 'CPF/CNPJ', sortable: true, width: 'auto',
      render: (value: string) => (
        <span className="text-sm">{formatCPFOrCNPJ(value)}</span>
      )
    },
    { key: 'email', title: 'E-mail', sortable: true, width: 'auto' },
    { 
      key: 'telefone', title: 'Telefone', sortable: true, width: 'auto',
      render: (value: string) => (
        <span className="text-sm">{formatTelefone(value)}</span>
      )
    },
    
    { 
      key: 'localizacao', title: 'Localização', sortable: false, width: 'auto',
      render: (_: string, item: any) => (
        <span className="text-sm">{item.municipio}/{item.uf}</span>
      )
    },
    { 
      key: 'ativo', title: 'Status', sortable: true, width: 'auto',
      render: (value: boolean) => (
        <Badge variant="outline" className={`bg-transparent font-normal border font-sora text-xs hover:bg-transparent ${value ? 'border-main-success text-main-success' : 'border-main-danger text-main-danger'}`}>
          {value ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    },
  ];

  const sortedData = useMemo(() => {
    let filtered = [...externalParties];
    if (searchValue.trim()) {
      const searchTerm = searchValue.trim();
      filtered = filtered.filter(item => {
        const statusText = item.ativo ? 'ativo' : 'inativo';
        const formattedCPFCNPJ = formatCPFOrCNPJ(item.cpf_cnpj);
        const formattedTelefone = item.telefone ? formatTelefone(item.telefone) : '';
        
        return containsNormalized(item.nome, searchTerm) || 
               containsNormalized(item.cpf_cnpj, searchTerm) || 
               containsNormalized(formattedCPFCNPJ, searchTerm) ||
               containsNormalized(item.email, searchTerm) || 
               containsNormalized(item.telefone, searchTerm) || 
               containsNormalized(formattedTelefone, searchTerm) ||
               containsNormalized(item.municipio, searchTerm) || 
               containsNormalized(item.uf, searchTerm) || 
               containsNormalized(statusText, searchTerm);
      });
    }
    if (sortColumn) {
      filtered = filtered.sort((a, b) => {
        let aValue = a[sortColumn as keyof typeof a];
        let bValue = b[sortColumn as keyof typeof b];
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [externalParties, sortColumn, sortDirection, searchValue]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleToggleStatus = (item: ExternalPartyLocal, isActivating: boolean) => {
    setSelectedItem(item);
    if (isActivating) {
      modalStates.showReactivateConfirmation();
    } else {
      modalStates.showInactivateConfirmation(
        `Deseja inativar "${item.nome}"?`,
        'O item não estará mais visível fora das configurações.'
      );
    }
  };

  const handleConfirmToggleStatus = async () => {
    if (selectedItem) {
      const isActivating = !selectedItem.ativo;
      if (isActivating) {
        modalStates.startReactivateFlow();
      } else {
        modalStates.startInactivateFlow();
      }
      
      try {
        await toggleStatus(selectedItem.id);
        
        if (isActivating) {
          modalStates.completeReactivateFlow();
        } else {
          modalStates.completeInactivateFlow();
        }
        setSelectedItem(null);
      } catch (error) {
        console.error('Erro ao alternar status:', error);
        modalStates.hideAllModals();
        setSelectedItem(null);
      }
    }
  };

  const handleConfirmReactivateStatus = async () => {
    await handleConfirmToggleStatus();
  };

  const reloadData = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    toast.success({
      title: "Dados atualizados com sucesso",
    });
  };

  // Função para fechar todos os modais após sucesso
  const handleSuccessConfirm = () => {
    modalStates.hideAllModals();
    setModalOpen(false);
    setEditingItem(null);
    setIsEditing(false);
  };

  const handleEdit = (item: any) => { setEditingItem(item); setIsEditing(true); setModalOpen(true); };
  const handleAddNew = () => { setEditingItem(null); setIsEditing(false); setModalOpen(true); };
  const handleHistorico = (item: any) => { setSelectedItemHistorico(item); setHistoricoModalOpen(true); };

  const getActionsForItem = (item: ExternalPartyLocal) => [
    { icon: <ToggleStatusIcon size={20} isActive={item.ativo} />, label: item.ativo ? 'Inativar' : 'Reativar', onClick: () => handleToggleStatus(item, !item.ativo) },
    { icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_4365_29822)">
            <path opacity="0.5" d="M18.3332 8.74996V9.99996C18.3332 13.9283 18.3332 15.8925 17.1128 17.1129C15.8924 18.3333 13.9282 18.3333 9.99984 18.3333C6.07147 18.3333 4.10728 18.3333 2.88689 17.1129C1.6665 15.8925 1.6665 13.9283 1.6665 9.99996C1.6665 6.07159 1.6665 4.1074 2.88689 2.88701C4.10728 1.66663 6.07147 1.66663 9.99984 1.66663H11.2498" stroke="#14664A" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M14.4172 2.3385L13.8765 2.87918L8.90582 7.8499C8.56914 8.18658 8.4008 8.35492 8.25603 8.54053C8.08525 8.75948 7.93883 8.99639 7.81937 9.24706C7.7181 9.45955 7.64281 9.6854 7.49225 10.1371L7.01019 11.5833L6.69827 12.5191C6.62417 12.7413 6.68202 12.9864 6.84771 13.1521C7.01339 13.3178 7.25846 13.3756 7.48074 13.3015L8.4165 12.9896L9.86269 12.5075C10.3144 12.357 10.5402 12.2817 10.7527 12.1804C11.0034 12.061 11.2403 11.9145 11.4593 11.7438C11.6449 11.599 11.8132 11.4307 12.1499 11.094L17.1206 6.12325L17.6613 5.58257C18.5571 4.68675 18.5571 3.23432 17.6613 2.3385C16.7655 1.44267 15.3131 1.44267 14.4172 2.3385Z" stroke="#14664A" strokeWidth="1.5"/>
            <path opacity="0.5" d="M13.8771 2.87927C13.8771 2.87927 13.9447 4.02822 14.9585 5.04199C15.9722 6.05577 17.1212 6.12335 17.1212 6.12335M8.41706 12.9897L7.01074 11.5834" stroke="#14664A" strokeWidth="1.5"/>
          </g>
          <defs>
            <clipPath id="clip0_4365_29822">
              <rect width="20" height="20" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      ), label: 'Editar', onClick: () => handleEdit(item) },
    { 
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.3335 4.99996V15.8333C3.3335 17.214 4.45278 18.3333 5.8335 18.3333H14.1668C15.5475 18.3333 16.6668 17.214 16.6668 15.8333V7.49996C16.6668 6.11925 15.5475 4.99996 14.1668 4.99996H3.3335ZM3.3335 4.99996V4.16663" stroke="#14664A" strokeWidth="1.5"/>
          <path d="M15.0002 5.00002V5.75002H15.7502V5.00002H15.0002ZM13.0978 1.93845L12.9917 1.19599L13.0978 1.93845ZM4.09983 3.22387L3.99376 2.48141H3.99376L4.09983 3.22387ZM4.22605 5.00002V5.75002H15.0002V5.00002V4.25002H4.22605V5.00002ZM15.0002 5.00002H15.7502V3.58837H15.0002H14.2502V5.00002H15.0002ZM13.0978 1.93845L12.9917 1.19599L3.99376 2.48141L4.09983 3.22387L4.20589 3.96634L13.2039 2.68091L13.0978 1.93845ZM4.09983 3.22387L3.99376 2.48141C3.18455 2.59701 2.5835 3.29004 2.5835 4.10746H3.3335H4.0835C4.0835 4.03652 4.13566 3.97637 4.20589 3.96634L4.09983 3.22387ZM15.0002 3.58837H15.7502C15.7502 2.11771 14.4476 0.988006 12.9917 1.19599L13.0978 1.93845L13.2039 2.68091C13.7561 2.60202 14.2502 3.03053 14.2502 3.58837H15.0002ZM4.22605 5.00002V4.25002C4.14732 4.25002 4.0835 4.18619 4.0835 4.10746H3.3335H2.5835C2.5835 5.01462 3.31889 5.75002 4.22605 5.75002V5.00002Z" fill="#14664A"/>
          <path opacity="0.5" d="M6.6665 10H13.3332" stroke="#14664A" strokeWidth="1.5" strokeLinecap="round"/>
          <path opacity="0.5" d="M6.6665 12.9166H11.2498" stroke="#14664A" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ), 
      label: 'Histórico', 
      onClick: () => handleHistorico(item) 
    },
  ];

  // Função para formatar logs de auditoria para o formato do modal
  const formatAuditLogsToUserActions = (logs: any[]): UserAction[] => {
    return logs.map(log => ({
      id: log.id,
      user: {
        name: log.performed_by_name || 'Sistema',
        initials: log.performed_by_name 
          ? log.performed_by_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
          : 'SI',
        avatarUrl: undefined,
      },
      timestamp: format(new Date(log.created_at), "dd/MM/yyyy - HH:mm'h'", { locale: ptBR }),
      action: {
        icon: getHistoryIconByActionType(log.action_type),
        title: log.action_label,
        description: log.action_description || '',
      },
    }));
  };

  // Atualizar histórico quando o modal abrir
  React.useEffect(() => {
    if (historicoModalOpen && selectedItemHistorico) {
      refetchAuditLogs();
    }
  }, [historicoModalOpen, selectedItemHistorico, refetchAuditLogs]);

  // Converte dados do modal (snake_case) para formato esperado (camelCase)
  const convertFormDataToLocal = (formData: any): Partial<ExternalPartyLocal> => {
    return {
      nome: formData.nome,
      tipoDocumento: formData.tipoDocumento,
      cpf_cnpj: formData.cpf_cnpj,
      email: formData.email,
      telefone: formData.telefone,
      representanteLegal: formData.representante_legal || formData.representanteLegal,
      observacoes: formData.observacoes,
      cep: formData.cep,
      logradouro: formData.logradouro,
      numero: formData.numero,
      complemento: formData.complemento,
      bairro: formData.bairro,
      uf: formData.uf,
      municipio: formData.municipio,
    };
  };

  const handleSave = async (formData: Partial<ExternalPartyLocal>) => {
    if (isEditing && editingItem) {
      modalStates.startEditFlow();
    } else {
      modalStates.startCreateFlow();
    }
    
    try {
      const convertedData = convertFormDataToLocal(formData);
      
      if (isEditing && editingItem) {
        await updateExternalParty({ id: editingItem.id, data: convertedData });
        modalStates.completeEditFlow();
      } else {
        await createExternalParty(convertedData);
        modalStates.completeCreateFlow();
      }
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      modalStates.hideAllModals();
      throw error;
    }
  };

  return (
    <>
      <div className="py-2"><Breadcrumb path={breadcrumbPath} onBack={handleBack} /></div>
      <div className="flex w-full h-[calc(100vh-8rem)] min-h-0">
        <div className="flex-1 min-w-0">
          <DataGallery
            columns={columns} data={paginatedData} getActionsForItem={getActionsForItem}
            loading={isLoading || isRefreshing}
            searchPlaceholder="Pesquisar fornecedores e terceiros..." showColumnSelector={true} showSearch={true}
            showExportButton={true} exportButtonText="Adicionar" exportButtonIcon={<AddIcon size={20} />}
            showRefreshButton={true} showStatusIndicator={true}
            getStatusColor={(item) => item.ativo ? 'hsl(var(--main-success))' : 'hsl(var(--main-danger))'}
            showPagination={true} pageSize={pageSize} totalItems={sortedData.length} currentPage={currentPage}
            totalPages={Math.ceil(sortedData.length / pageSize)} onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => { setPageSize(newSize); setCurrentPage(1); }}
            sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}
            searchValue={searchValue} onSearchChange={setSearchValue} onExport={handleAddNew} onRefresh={reloadData}
          />
        </div>
      </div>
      <CadastrarFornecedorTerceiroModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        onSave={handleSave} 
        editData={editingItem} 
        isEditing={isEditing} 
        modalStates={modalStates}
      />
      <StandardModalsWrapper
        modalStates={modalStates.modalStates}
        onInactivateConfirm={handleConfirmToggleStatus}
        onInactivateCancel={() => modalStates.hideInactivateConfirmation()}
        onReactivateConfirm={handleConfirmReactivateStatus}
        onReactivateCancel={() => modalStates.hideInactivateConfirmation()}
        onSuccessConfirm={handleSuccessConfirm}
      />
      <HistoricoModal 
        open={historicoModalOpen} 
        onOpenChange={setHistoricoModalOpen} 
        title={`Histórico - ${selectedItemHistorico?.nome || ''}`} 
        actions={formatAuditLogsToUserActions(auditLogs)} 
      />
    </>
  );
};

export default ConfiguracaoFornecedoresTerceiros;
