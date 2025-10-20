import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGallery } from '@/components/ui/data-gallery';
import { Breadcrumb } from '@/components/ui/breadcrumb-navigation';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
import { ToggleStatusIcon } from '@/components/ui/toggle-status-icon';
import { AddIcon } from '@/components/ui/add-icon';
import { CadastrarOrgaoModal } from '@/components/modals/CadastrarOrgaoModal';
import { HistoricoModal } from '@/components/modals/HistoricoModal';
import { StandardModalsWrapper } from '@/components/modals/StandardModalsWrapper';
import { useStandardModals } from '@/hooks/use-standard-modals';
import { useAgencies, useToggleAgencyStatus, useToggleAgencyStatusWithCascade, useGetActiveLinkedUnits } from '@/hooks/useAgencies';
import { useToastify } from '@/hooks/use-toastify';
import { containsNormalized } from '@/lib/string-utils';
import { formatCNPJ } from '@/lib/formatters';
import { AgencyDependenciesModal } from '@/components/modals/AgencyDependenciesModal';
import { useAgencyAuditLog } from '@/hooks/useAgencyAuditLog';
import { getHistoryIconByActionType } from '@/lib/history-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect } from 'react';
import { UserAction } from '@/components/ui/user-action-history';

const ConfiguracaoOrgaos = () => {
  const navigate = useNavigate();
  const { toast } = useToastify();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedToggleItem, setSelectedToggleItem] = useState<{ item: any; action: 'ativar' | 'inativar' } | null>(null);
  
  // Estados para o modal de histórico
  const [historicoModalOpen, setHistoricoModalOpen] = useState(false);
  const [selectedOrgaoHistorico, setSelectedOrgaoHistorico] = useState<any>(null);
  
  // Estados para o modal de dependências
  const [dependenciesModalOpen, setDependenciesModalOpen] = useState(false);
  const [checkingAgencyId, setCheckingAgencyId] = useState<number | undefined>();
  
  // Hook para gerenciar modais padronizados
  const {
    modalStates,
    showInactivateConfirmation,
    showReactivateConfirmation,
    hideInactivateConfirmation,
    startCreateFlow,
    completeCreateFlow,
    startEditFlow,
    completeEditFlow,
    startInactivateFlow,
    completeInactivateFlow,
    startReactivateFlow,
    completeReactivateFlow,
    hideAllModals,
    hideProcessingModal,
  } = useStandardModals();

  // Hooks do Supabase
  const { agencies, isLoading, error, refetch } = useAgencies();
  const toggleAgencyStatus = useToggleAgencyStatus();
  const toggleAgencyStatusWithCascade = useToggleAgencyStatusWithCascade();
  const { data: linkedUnits = [] } = useGetActiveLinkedUnits(checkingAgencyId);
  
  // Hook para buscar histórico do órgão selecionado
  const { 
    data: auditLogs = [], 
    refetch: refetchAuditLogs 
  } = useAgencyAuditLog(
    selectedOrgaoHistorico ? selectedOrgaoHistorico.id : null
  );

  // Mapeamentos para exibição na galeria
  const poderesMap = {
    'EXECUTIVO': 'Executivo',
    'LEGISLATIVO': 'Legislativo',
    'JUDICIARIO': 'Judiciário'
  };

  // Helper functions para conversão
  const getPoderLabel = (value: string) => poderesMap[value as keyof typeof poderesMap] || value;

  // Breadcrumb navigation
  const breadcrumbPath = [
    { label: "Home", href: "/", icon: "home" as const },
    { label: "Gestão de bens móveis", href: "/?tab=gestao-bens-moveis" },
    { label: "Configurações", href: "/gestao-bens-moveis/configuracoes" },
    { label: "Órgãos", current: true }
  ];

  // Função para voltar
  const handleBack = () => {
    navigate("/gestao-bens-moveis/configuracoes");
  };


  // Função para lidar com ordenação
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Colunas da galeria
  const columns = [
    { key: 'name', title: 'Nome', sortable: true, width: 'auto' },
    { key: 'acronym', title: 'Sigla', sortable: true, width: 'auto' },
    { 
      key: 'cnpj', 
      title: 'CNPJ', 
      sortable: true, 
      width: 'auto',
      render: (value: string) => (
        <span className="text-sm">{formatCNPJ(value)}</span>
      )
    },
    { 
      key: 'governmentPower', 
      title: 'Poder', 
      sortable: true, 
      width: 'auto',
      render: (value: string) => getPoderLabel(value)
    },
    { 
      key: 'address.state', 
      title: 'UF', 
      sortable: true, 
      width: 'auto',
      render: (value: string, item: any) => item.address?.state || '-'
    },
    { 
      key: 'address.city', 
      title: 'Município', 
      sortable: true, 
      width: 'auto',
      render: (value: string, item: any) => item.address?.city || '-'
    },
    { 
      key: 'isDeleted', 
      title: 'Status', 
      sortable: true, 
      width: 'auto',
      render: (value: boolean) => (
        <Badge 
          variant="outline" 
          className={`bg-transparent font-normal border font-sora text-xs hover:bg-transparent ${getStatusStyles(!value)}`}
        >
          {!value ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    },
  ];

  // Filtrar e ordenar dados
  const sortedData = useMemo(() => {
    if (!agencies) return [];
    
    let filtered = [...agencies];

    // Aplicar filtro de pesquisa
    if (searchValue.trim()) {
      filtered = filtered.filter(item => {
        const searchFields = [
          item.name,
          item.acronym,
          item.cnpj,
          getPoderLabel(item.governmentPower),
          item.address?.state,
          item.address?.city,
          !item.isDeleted ? 'Ativo' : 'Inativo'
        ];
        
        return searchFields.some(field => 
          field && containsNormalized(String(field), searchValue)
        );
      });
    }

    // Aplicar ordenação
    if (sortColumn) {
      filtered = filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        // Tratar campos nested
        if (sortColumn === 'address.state') {
          aValue = a.address?.state || '';
          bValue = b.address?.state || '';
        } else if (sortColumn === 'address.city') {
          aValue = a.address?.city || '';
          bValue = b.address?.city || '';
        } else if (sortColumn === 'isDeleted') {
          aValue = a.isDeleted ? 1 : 0;
          bValue = b.isDeleted ? 1 : 0;
        } else {
          aValue = a[sortColumn as keyof typeof a];
          bValue = b[sortColumn as keyof typeof b];
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [agencies, sortColumn, sortDirection, searchValue]);

  // Dados paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  // Função para lidar com mudança de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Função para lidar com mudança de tamanho da página
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // Calcular total de páginas
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Mapeamento de status para estilos de badge
  const getStatusStyles = (isActive: boolean) => {
    return isActive
      ? 'border-main-success text-main-success'
      : 'border-main-danger text-main-danger';
  };

  // Mapeamento de poder para estilos de badge
  const getPoderStyles = (poder: string) => {
    const poderLabel = getPoderLabel(poder);
    switch (poderLabel) {
      case 'Executivo':
        return 'border-main-info text-main-info';
      case 'Legislativo':
        return 'border-main-warning text-main-warning';
      case 'Judiciário':
        return 'border-main-danger text-main-danger';
      case 'Ministério Público':
        return 'border-second-primary text-second-primary';
      case 'Defensoria Pública':
        return 'border-main-success text-main-success';
      default:
        return 'border-main-info text-main-info';
    }
  };

  // Função para lidar com ativação/inativação
  const handleToggleStatus = async (item: any, action: 'ativar' | 'inativar') => {
    setSelectedToggleItem({ item, action });
    
    if (action === 'inativar') {
      // Verificar se há unidades vinculadas
      setCheckingAgencyId(item.id);
      
      // Aguardar um momento para o hook buscar os dados
      setTimeout(() => {
        // Se houver unidades vinculadas, mostrar modal de dependências
        // Caso contrário, mostrar modal de confirmação padrão
        showInactivateConfirmation();
      }, 100);
    } else {
      showReactivateConfirmation();
    }
  };

  // Verificar se deve abrir o modal de dependências quando linkedUnits mudar
  React.useEffect(() => {
    if (selectedToggleItem?.action === 'inativar' && linkedUnits.length > 0 && modalStates.showInactivateConfirmation) {
      hideInactivateConfirmation();
      setDependenciesModalOpen(true);
    }
  }, [linkedUnits, selectedToggleItem]);

  const handleConfirmToggleStatus = async () => {
    if (!selectedToggleItem) return;
    
    const { item, action } = selectedToggleItem;
    
    if (action === 'inativar') {
      startInactivateFlow();
    } else {
      startReactivateFlow();
    }
    
    try {
      await toggleAgencyStatus.mutateAsync({
        id: item.id,
        currentStatus: !item.isDeleted
      });
      
      if (action === 'inativar') {
        completeInactivateFlow();
      } else {
        completeReactivateFlow();
      }
    } catch (error) {
      // Erro já tratado pelo hook
      hideAllModals();
    }
    
    // Limpar item selecionado e checkingAgencyId
    setSelectedToggleItem(null);
    setCheckingAgencyId(undefined);
  };

  const handleConfirmWithCascade = async (inactivateUnits: boolean) => {
    if (!selectedToggleItem) return;
    
    const { item } = selectedToggleItem;
    
    startInactivateFlow();
    
    try {
      await toggleAgencyStatusWithCascade.mutateAsync({
        id: item.id,
        currentStatus: !item.isDeleted,
        inactivateUnits
      });
      
      completeInactivateFlow();
    } catch (error) {
      // Erro já tratado pelo hook
      hideAllModals();
    }
    
    // Limpar item selecionado e checkingAgencyId
    setSelectedToggleItem(null);
    setCheckingAgencyId(undefined);
  };

  // Função para cancelar inativação/reativação
  const handleInactivateCancel = () => {
    setSelectedToggleItem(null);
    setCheckingAgencyId(undefined);
    hideInactivateConfirmation();
  };

  // Função para lidar com edição
  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsEditing(true);
    setModalOpen(true);
  };

  // Função para adicionar novo órgão
  const handleAddNew = () => {
    setEditingItem(null);
    setIsEditing(false);
    setModalOpen(true);
  };

  // Função para abrir modal de histórico
  const handleHistorico = (orgao: any) => {
    setSelectedOrgaoHistorico(orgao);
    setHistoricoModalOpen(true);
  };

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
  useEffect(() => {
    if (historicoModalOpen && selectedOrgaoHistorico) {
      refetchAuditLogs();
    }
  }, [historicoModalOpen, selectedOrgaoHistorico, refetchAuditLogs]);

  // Função para obter ações baseadas no item
  const getActionsForItem = (item: any) => [
    {
      icon: <ToggleStatusIcon size={20} isActive={!item.isDeleted} />,
      label: !item.isDeleted ? 'Inativar' : 'Reativar',
      onClick: () => handleToggleStatus(item, !item.isDeleted ? 'inativar' : 'ativar'),
    },
    {
      icon: (
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
      ),
      label: 'Editar',
      onClick: () => handleEdit(item),
    },
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
      onClick: () => handleHistorico(item),
    },
  ];

  const handleSaveOrgao = async (formData: any) => {
    // Modal já gerencia o fluxo de criar/editar com Supabase
    // Esta função não é mais necessária, mas mantida por compatibilidade
    setModalOpen(false);
    setEditingItem(null);
    setIsEditing(false);
  };

  // Função para fechar todos os modais após sucesso
  const handleSuccessConfirm = () => {
    hideAllModals();
    setModalOpen(false);
    setEditingItem(null);
    setIsEditing(false);
  };

  // Função para lidar com o refresh dos dados
  const handleRefresh = async () => {
    await refetch();
    
    toast.success({
      title: "Dados atualizados com sucesso",
    });
  };



  return (
    <>
      {/* Breadcrumb */}
      <div className="py-2">
        <Breadcrumb path={breadcrumbPath} onBack={handleBack} />
      </div>

      {/* Layout principal */}
      <div className="flex w-full h-[calc(100vh-8rem)] min-h-0">
        <div className="flex-1 min-w-0">
          <DataGallery
            columns={columns}
            data={paginatedData}
            getActionsForItem={getActionsForItem}
            searchPlaceholder="Pesquisar órgãos..."
            showColumnSelector={true}
            showSearch={true}
            showExportButton={true}
            exportButtonText="Adicionar"
            exportButtonIcon={<AddIcon size={20} />}
            showRefreshButton={true}
            showStatusIndicator={true}
            getStatusColor={(item) => {
              return !item.isDeleted ? 'hsl(var(--main-success))' : 'hsl(var(--main-danger))';
            }}
            showPagination={true}
            pageSize={pageSize}
            totalItems={sortedData.length}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onExport={handleAddNew}
            onRefresh={handleRefresh}
            loading={isLoading || toggleAgencyStatus.isPending}
          />
        </div>
      </div>

      {/* Modal de cadastro */}
      <CadastrarOrgaoModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) {
            setEditingItem(null);
            setIsEditing(false);
          }
        }}
        onSave={handleSaveOrgao}
        editData={editingItem}
        isEditing={isEditing}
        useStandardModals={{
          startCreateFlow,
          completeCreateFlow,
          startEditFlow,
          completeEditFlow,
          hideProcessingModal
        }}
      />

      {/* Modais padronizados */}
      <StandardModalsWrapper
        modalStates={modalStates}
        onInactivateConfirm={handleConfirmToggleStatus}
        onInactivateCancel={handleInactivateCancel}
        onSuccessConfirm={handleSuccessConfirm}
      />

      {/* Modal de dependências */}
      <AgencyDependenciesModal
        open={dependenciesModalOpen}
        onOpenChange={setDependenciesModalOpen}
        onConfirm={handleConfirmWithCascade}
        agencyName={selectedToggleItem?.item?.name || ''}
        linkedUnits={linkedUnits}
      />

      {/* Modal de histórico */}
      <HistoricoModal
        open={historicoModalOpen}
        onOpenChange={setHistoricoModalOpen}
        title={`Histórico - ${selectedOrgaoHistorico?.name || ''}`}
        actions={formatAuditLogsToUserActions(auditLogs)}
      />
    </>
  );
};

export default ConfiguracaoOrgaos;