
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGallery } from '@/components/ui/data-gallery';
import { Breadcrumb } from '@/components/ui/breadcrumb-navigation';
import { Badge } from '@/components/ui/badge';
import { ToggleStatusIcon } from '@/components/ui/toggle-status-icon';
import { AddIcon } from '@/components/ui/add-icon';
import { CadastrarLeiAplicavelModal } from '@/components/modals/CadastrarLeiAplicavelModal';
import { HistoricoModal } from '@/components/modals/HistoricoModal';
import { StandardModalsWrapper } from '@/components/modals/StandardModalsWrapper';
import { useStandardModals } from '@/hooks/use-standard-modals';
import { UserAction } from '@/components/ui/user-action-history';
import { getHistoryIconByActionType } from '@/lib/history-icons';
import { containsNormalized } from '@/lib/string-utils';
import { useToastify } from '@/hooks/use-toastify';
import { useLaws } from '@/hooks/useLaws';
import { useLawDocuments } from '@/hooks/useLawDocuments';
import { useLawAuditLog } from '@/hooks/useLawAuditLog';
import { useLawDocumentAuditLog } from '@/hooks/useLawDocumentAuditLog';
import { Law } from '@/types/law.types';
import { FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ConfiguracaoLeisAplicaveis = () => {
  const navigate = useNavigate();
  const { toast } = useToastify();
  const { laws, isLoading, refetch, toggleStatus } = useLaws();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Law | null>(null);
  const [selectedItem, setSelectedItem] = useState<Law | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [historicoModalOpen, setHistoricoModalOpen] = useState(false);
  const [selectedItemHistorico, setSelectedItemHistorico] = useState<Law | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Hook para buscar histórico da lei selecionada
  const { 
    data: auditLogs = [], 
    refetch: refetchAuditLogs 
  } = useLawAuditLog(
    selectedItemHistorico ? selectedItemHistorico.id : null
  );

  // Hook para buscar histórico de documentos da lei selecionada
  const { 
    data: documentsAuditLogs = [], 
    refetch: refetchDocumentsAuditLogs 
  } = useLawDocumentAuditLog(
    selectedItemHistorico ? selectedItemHistorico.id : null
  );

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
    hideAllModals
  } = useStandardModals();

  // Dados do banco
  const data = laws;

  const breadcrumbPath = [
    { label: "Home", href: "/", icon: "home" as const },
    { label: "Gestão de bens móveis", href: "/?tab=gestao-bens-moveis" },
    { label: "Configurações", href: "/gestao-bens-moveis/configuracoes" },
    { label: "Leis aplicáveis", current: true }
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
    { 
      key: 'name', 
      title: 'Nome da lei', 
      sortable: true, 
      width: 'auto' 
    },
    { 
      key: 'number', 
      title: 'Número da lei', 
      sortable: true, 
      width: 'auto' 
    },
    { 
      key: 'type', 
      title: 'Tipo de norma', 
      sortable: true, 
      width: 'auto',
      render: (value: string) => value
    },
    { 
      key: 'jurisdiction', 
      title: 'Esfera', 
      sortable: true, 
      width: 'auto',
      render: (value: string) => value
    },
    { 
      key: 'associated_process', 
      title: 'Processo associado', 
      sortable: true, 
      width: 'auto',
      render: (value: string) => value
    },
    { 
      key: 'publication_date', 
      title: 'Data de publicação', 
      sortable: true, 
      width: 'auto',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    },
    { 
      key: 'is_deleted', 
      title: 'Status', 
      sortable: true, 
      width: 'auto',
      render: (value: boolean) => (
        <Badge 
          variant="outline" 
          className={`bg-transparent font-normal border font-sora text-xs hover:bg-transparent ${
            !value ? 'border-main-success text-main-success' : 'border-main-danger text-main-danger'
          }`}
        >
          {!value ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    },
  ];

  const sortedData = useMemo(() => {
    let filtered = [...data];
    if (searchValue.trim()) {
      const searchTerm = searchValue.trim();
      filtered = filtered.filter(item => {
        return columns.some(column => {
          let value = item[column.key as keyof Law];
          
          if (column.key === 'publication_date') {
            value = new Date(value as string).toLocaleDateString('pt-BR');
          } else if (column.key === 'is_deleted') {
            value = !(value as boolean) ? 'Ativo' : 'Inativo';
          }
          
          return containsNormalized(String(value), searchTerm);
        });
      });
    }
    if (sortColumn) {
      filtered = filtered.sort((a, b) => {
        let aValue = a[sortColumn as keyof Law];
        let bValue = b[sortColumn as keyof Law];

        // Tratamento para datas ISO
        if (sortColumn === 'publication_date') {
          const aTime = new Date(aValue as string).getTime();
          const bTime = new Date(bValue as string).getTime();
          return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [data, sortColumn, sortDirection, searchValue]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleToggleStatus = (item: Law, action: 'ativar' | 'inativar') => { 
    setSelectedItem(item); 
    if (action === 'ativar') {
      showReactivateConfirmation();
    } else {
      showInactivateConfirmation();
    }
  };
  
  const handleConfirmToggleStatus = async () => {
    if (selectedItem) {
      const isActivating = selectedItem.is_deleted;
      
      if (isActivating) {
        startReactivateFlow();
      } else {
        startInactivateFlow();
      }

      try {
        await toggleStatus({ id: selectedItem.id, currentStatus: selectedItem.is_deleted });
        
        if (isActivating) {
          completeReactivateFlow();
        } else {
          completeInactivateFlow();
        }
      } catch (error) {
        console.error('Erro ao alterar status:', error);
      }
      
      setSelectedItem(null);
    }
  };

  const handleEdit = (item: Law) => { 
    setEditingItem(item); 
    setIsEditing(true); 
    setModalOpen(true); 
  };
  
  const handleAddNew = () => { 
    setEditingItem(null); 
    setIsEditing(false); 
    setModalOpen(true); 
  };
  
  const handleHistorico = (item: Law) => { 
    setSelectedItemHistorico(item); 
    setHistoricoModalOpen(true); 
  };

  const getActionsForItem = (item: Law) => [
    { 
      icon: <ToggleStatusIcon size={20} isActive={!item.is_deleted} />, 
      label: !item.is_deleted ? 'Inativar' : 'Reativar', 
      onClick: () => handleToggleStatus(item, !item.is_deleted ? 'inativar' : 'ativar') 
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
      onClick: () => handleEdit(item)
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
      onClick: () => handleHistorico(item) 
    },
  ];

  const handleSave = () => {
    // A lógica de salvar foi movida para o modal
    // Este handler não é mais necessário aqui
  };

  // Função para fechar todos os modais após sucesso
  const handleSuccessConfirm = () => {
    hideAllModals();
    setModalOpen(false);
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

  // Função para combinar histórico de lei + documentos em timeline única
  const formatUnifiedHistory = (): UserAction[] => {
    const lawActions = formatAuditLogsToUserActions(auditLogs);
    const documentActions = formatAuditLogsToUserActions(documentsAuditLogs);
    
    // Combinar e ordenar por data (mais recente primeiro)
    return [...lawActions, ...documentActions]
      .sort((a, b) => {
        const parseTimestamp = (timestamp: string): Date => {
          const [datePart, timePart] = timestamp.split(' - ');
          const [day, month, year] = datePart.split('/').map(Number);
          const [hours, minutes] = timePart.replace('h', '').split(':').map(Number);
          return new Date(year, month - 1, day, hours, minutes);
        };
        
        const dateA = parseTimestamp(a.timestamp);
        const dateB = parseTimestamp(b.timestamp);
        return dateB.getTime() - dateA.getTime();
      });
  };

  // Atualizar histórico quando o modal abrir
  useEffect(() => {
    if (historicoModalOpen && selectedItemHistorico) {
      refetchAuditLogs();
      refetchDocumentsAuditLogs();
    }
  }, [historicoModalOpen, selectedItemHistorico, refetchAuditLogs, refetchDocumentsAuditLogs]);

  return (
    <>
      <div className="py-2">
        <Breadcrumb path={breadcrumbPath} onBack={handleBack} />
      </div>
      
      <div className="flex w-full h-[calc(100vh-8rem)] min-h-0">
        <div className="flex-1 min-w-0">
          <DataGallery 
            columns={columns} 
            data={paginatedData} 
            getActionsForItem={getActionsForItem} 
            searchPlaceholder="Pesquisar leis aplicáveis..." 
            showColumnSelector={true} 
            showSearch={true} 
            showExportButton={true} 
            exportButtonText="Adicionar" 
            exportButtonIcon={<AddIcon size={20} />} 
            showRefreshButton={true} 
            showStatusIndicator={true} 
            getStatusColor={(item) => !item.is_deleted ? 'hsl(var(--main-success))' : 'hsl(var(--main-danger))'}
            loading={isLoading || isRefreshing}
            showPagination={true}
            pageSize={pageSize} 
            totalItems={sortedData.length} 
            currentPage={currentPage} 
            totalPages={Math.ceil(sortedData.length / pageSize)} 
            onPageChange={setCurrentPage} 
            onPageSizeChange={(newSize) => { setPageSize(newSize); setCurrentPage(1); }} 
            sortColumn={sortColumn} 
            sortDirection={sortDirection} 
            onSort={handleSort} 
            searchValue={searchValue} 
            onSearchChange={setSearchValue} 
            onExport={handleAddNew} 
            onRefresh={async () => {
              setIsRefreshing(true);
              await refetch();
              setIsRefreshing(false);
              toast.success({
                title: "Dados atualizados com sucesso",
              });
            }}
          />
        </div>
      </div>
      
      <CadastrarLeiAplicavelModal 
        open={modalOpen} 
        onOpenChange={setModalOpen}
        editData={editingItem} 
        isEditing={isEditing}
        onCreateSuccess={startCreateFlow}
        onEditSuccess={startEditFlow}
        onCompleteCreate={completeCreateFlow}
        onCompleteEdit={completeEditFlow}
      />
      
      <StandardModalsWrapper
        modalStates={modalStates}
        onInactivateConfirm={handleConfirmToggleStatus}
        onInactivateCancel={hideInactivateConfirmation}
        onReactivateConfirm={handleConfirmToggleStatus}
        onReactivateCancel={hideInactivateConfirmation}
        onSuccessConfirm={handleSuccessConfirm}
      />
      
      {/* Modal de histórico unificado */}
      <HistoricoModal
        open={historicoModalOpen}
        onOpenChange={setHistoricoModalOpen}
        title={`Histórico - ${selectedItemHistorico?.name || ''}`}
        actions={formatUnifiedHistory()}
      />
    </>
  );
};

export default ConfiguracaoLeisAplicaveis;
