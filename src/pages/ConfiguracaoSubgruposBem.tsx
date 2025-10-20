import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGallery } from '@/components/ui/data-gallery';
import { Breadcrumb } from '@/components/ui/breadcrumb-navigation';
import { Badge } from '@/components/ui/badge';
import { ToggleStatusIcon } from '@/components/ui/toggle-status-icon';
import { AddIcon } from '@/components/ui/add-icon';
import { CadastrarSubgrupoBemModal } from '@/components/modals/CadastrarSubgrupoBemModal';
import { HistoricoModal } from '@/components/modals/HistoricoModal';
import { StandardModalsWrapper } from '@/components/modals/StandardModalsWrapper';
import { useStandardModals } from '@/hooks/use-standard-modals';
import { UserAction } from '@/components/ui/user-action-history';
import { getHistoryIcon } from '@/lib/history-icons';
import { useToastify } from '@/hooks/use-toastify';
import { containsNormalized } from '@/lib/string-utils';
import { useAssetSubgroups } from '@/hooks/useAssetSubgroups';
import { AssetSubgroupLocal } from '@/types/asset-subgroup.types';
import { useAssetSubgroupAuditLog } from '@/hooks/useAssetSubgroupAuditLog';
import { getHistoryIconByActionType } from '@/lib/history-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ConfiguracaoSubgruposBem = () => {
  const navigate = useNavigate();
  const { toast } = useToastify();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<AssetSubgroupLocal | null>(null);
  const [selectedToggleItem, setSelectedToggleItem] = useState<AssetSubgroupLocal | null>(null);
  const [searchValue, setSearchValue] = useState('');
  
  // Estados para os modais
  const [historicoModalOpen, setHistoricoModalOpen] = useState(false);
  const [selectedSubgrupoHistorico, setSelectedSubgrupoHistorico] = useState<AssetSubgroupLocal | null>(null);

  // Integração com Supabase
  const {
    subgroups: data,
    isLoading,
    error,
    refetch,
    createAssetSubgroup,
    updateAssetSubgroup,
    toggleAssetSubgroupStatus,
    isCreating,
    isUpdating,
    isToggling,
  } = useAssetSubgroups();

  // Hook para modais padronizados
  const {
    modalStates,
    showInactivateConfirmation,
    showReactivateConfirmation,
    hideInactivateConfirmation,
    startCreateFlow,
    startEditFlow,
    startInactivateFlow,
    startReactivateFlow,
    completeCreateFlow,
    completeEditFlow,
    completeInactivateFlow,
    completeReactivateFlow,
    hideAllModals
  } = useStandardModals();

  // Hook de auditoria para histórico
  const { 
    data: auditLogs = [], 
    refetch: refetchAuditLogs 
  } = useAssetSubgroupAuditLog(
    selectedSubgrupoHistorico ? parseInt(selectedSubgrupoHistorico.id) : null
  );

  const breadcrumbPath = [
    { label: "Home", href: "/", icon: "home" as const },
    { label: "Gestão de bens móveis", href: "/?tab=gestao-bens-moveis" },
    { label: "Configurações", href: "/gestao-bens-moveis/configuracoes" },
    { label: "Subgrupos de bem", current: true }
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

  // Mapeamento de status para estilos de badge
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'border-main-success text-main-success';
      case 'inativo':
        return 'border-main-danger text-main-danger';
      default:
        return 'border-main-info text-main-info';
    }
  };

  // Função para formatar status para exibição
  const formatStatusForDisplay = (status: string) => {
    return status === 'ativo' ? 'Ativo' : 'Inativo';
  };

  const columns = [
    { key: 'nome', title: 'Nome', sortable: true, width: 'auto' },
    { key: 'grupo', title: 'Grupo', sortable: true, width: 'auto' },
    { 
      key: 'status', 
      title: 'Status', 
      sortable: true, 
      width: 'auto',
      render: (value: string) => (
        <Badge 
          variant="outline" 
          className={`bg-transparent font-normal border font-sora text-xs hover:bg-transparent ${getStatusStyles(value)}`}
        >
          {formatStatusForDisplay(value)}
        </Badge>
      )
    },
  ];

  // Filtrar e ordenar dados
  const sortedData = useMemo(() => {
    let filtered = [...data];

    // Aplicar filtro de pesquisa melhorado
    if (searchValue.trim()) {
      filtered = filtered.filter(item => {
        // Busca em campos string diretamente
        const matchesDirectFields = Object.entries(item).some(([key, value]) => {
          // Ignorar valores null ou undefined
          if (value === null || value === undefined) return false;
          
          if (typeof value === 'string') {
            return containsNormalized(value, searchValue);
          }
          if (typeof value === 'number') {
            return containsNormalized(value.toString(), searchValue);
          }
          if (typeof value === 'boolean') {
            const boolStr = value ? 'sim' : 'não';
            return containsNormalized(boolStr, searchValue);
          }
          return false;
        });

        // Busca em campos renderizados (como status formatado)
        const formattedStatus = formatStatusForDisplay(item.status);
        const matchesRenderedFields = containsNormalized(formattedStatus, searchValue);

        return matchesDirectFields || matchesRenderedFields;
      });
    }

    // Aplicar ordenação
    if (sortColumn) {
      filtered = filtered.sort((a, b) => {
        let aValue = a[sortColumn as keyof typeof a];
        let bValue = b[sortColumn as keyof typeof b];

        // Tratar valores undefined/null
        if (aValue === null || aValue === undefined) aValue = '';
        if (bValue === null || bValue === undefined) bValue = '';

        // Converter para string se necessário para comparação
        const aStr = String(aValue);
        const bStr = String(bValue);

        if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, sortColumn, sortDirection, searchValue]);

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


  // Função para lidar com ativação/inativação
  const handleToggleStatus = (item: AssetSubgroupLocal, action: 'ativar' | 'inativar') => {
    setSelectedToggleItem(item);
    
    if (action === 'ativar') {
      showReactivateConfirmation();
    } else {
      showInactivateConfirmation();
    }
  };

  const handleConfirmToggleStatus = async () => {
    if (!selectedToggleItem) return;
    
    const isActivating = selectedToggleItem.status === 'inativo';
    
    if (isActivating) {
      startReactivateFlow();
    } else {
      startInactivateFlow();
    }
    
    try {
      await toggleAssetSubgroupStatus(selectedToggleItem.id);
      await refetch();
      
      if (isActivating) {
        completeReactivateFlow();
      } else {
        completeInactivateFlow();
      }
      
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      hideAllModals();
    } finally {
      setSelectedToggleItem(null);
    }
  };

  const handleInactivateCancel = () => {
    setSelectedToggleItem(null);
    hideInactivateConfirmation();
  };

  const handleReactivateCancel = () => {
    setSelectedToggleItem(null);
    hideInactivateConfirmation();
  };

  const handleSuccessConfirm = () => {
    hideAllModals();
    setModalOpen(false);
    setEditingItem(null);
    setIsEditing(false);
  };

  const handleEdit = (item: AssetSubgroupLocal) => {
    setEditingItem(item);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleHistorico = (subgrupo: AssetSubgroupLocal) => {
    setSelectedSubgrupoHistorico(subgrupo);
    setHistoricoModalOpen(true);
  };

  // Função atualizada para obter ações baseadas no item
  const getActionsForItem = (item: AssetSubgroupLocal) => [
    {
      icon: <ToggleStatusIcon size={20} isActive={item.status === 'ativo'} />,
      label: item.status === 'ativo' ? 'Inativar' : 'Reativar',
      onClick: () => handleToggleStatus(item, item.status === 'ativo' ? 'inativar' : 'ativar'),
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

  const handleSaveSubgrupo = async (formData: any) => {
    if (isEditing && editingItem) {
      startEditFlow();
    } else {
      startCreateFlow();
    }
    
    try {
      if (isEditing && editingItem) {
        await updateAssetSubgroup({ id: editingItem.id, data: formData });
        completeEditFlow();
      } else {
        await createAssetSubgroup(formData);
        completeCreateFlow();
      }
      await refetch();
    } catch (error) {
      console.error('Erro ao salvar subgrupo:', error);
      hideAllModals();
      throw error;
    }
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
    if (historicoModalOpen && selectedSubgrupoHistorico) {
      refetchAuditLogs();
    }
  }, [historicoModalOpen, selectedSubgrupoHistorico, refetchAuditLogs]);

  return (
    <>
      {/* Breadcrumb */}
      <div className="py-2">
        <Breadcrumb path={breadcrumbPath} onBack={handleBack} />
      </div>

      {/* Layout principal */}
      <div className="flex w-full h-[calc(100vh-8rem)] min-h-0">
        <div className="flex-1 min-w-0">
          {error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <p className="text-main-danger font-medium">Erro ao carregar subgrupos de bem</p>
                <p className="text-sm text-second-dark">{error instanceof Error ? error.message : 'Erro desconhecido'}</p>
              </div>
            </div>
          ) : (
            <DataGallery
              columns={columns}
              data={paginatedData}
              getActionsForItem={getActionsForItem}
              searchPlaceholder="Pesquisar subgrupos..."
              showColumnSelector={true}
              showSearch={true}
              showExportButton={true}
              exportButtonText="Adicionar"
              exportButtonIcon={<AddIcon size={20} />}
              showRefreshButton={true}
              showStatusIndicator={true}
              getStatusColor={(item) => {
                return item.status === 'ativo' ? 'hsl(var(--main-success))' : 'hsl(var(--main-danger))';
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
              onRefresh={async () => {
                await refetch();
                toast.success({
                  title: "Dados atualizados com sucesso",
                });
              }}
              loading={isLoading}
            />
          )}
        </div>
      </div>

      {/* Modal de cadastro */}
      <CadastrarSubgrupoBemModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSaveSubgrupo}
        editData={editingItem}
        isEditing={isEditing}
      />

      {/* Modais padronizados */}
      <StandardModalsWrapper
        modalStates={modalStates}
        onInactivateConfirm={handleConfirmToggleStatus}
        onInactivateCancel={handleInactivateCancel}
        onReactivateConfirm={handleConfirmToggleStatus}
        onReactivateCancel={handleReactivateCancel}
        onSuccessConfirm={handleSuccessConfirm}
      />

      {/* Modal de histórico */}
      <HistoricoModal
        open={historicoModalOpen}
        onOpenChange={setHistoricoModalOpen}
        title={`Histórico - ${selectedSubgrupoHistorico?.nome || ''}`}
        actions={formatAuditLogsToUserActions(auditLogs)}
      />
    </>
  );
};

export default ConfiguracaoSubgruposBem;