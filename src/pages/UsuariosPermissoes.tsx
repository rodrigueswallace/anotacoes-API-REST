import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGallery } from '@/components/ui/data-gallery';
import { Breadcrumb } from '@/components/ui/breadcrumb-navigation';
import { Badge } from '@/components/ui/badge';
import { ToggleStatusIcon } from '@/components/ui/toggle-status-icon';
import { AddIcon } from '@/components/ui/add-icon';
import { CadastrarUsuarioModal } from '@/components/modals/CadastrarUsuarioModal';
import { EditarUsuarioModal } from '@/components/modals/EditarUsuarioModal';
import { VisualizarUsuarioModal } from '@/components/modals/VisualizarUsuarioModal';
import { HistoricoModal } from '@/components/modals/HistoricoModal';
import { StandardModalsWrapper } from '@/components/modals/StandardModalsWrapper';
import { useStandardModals } from '@/hooks/use-standard-modals';
import { UserAction } from '@/components/ui/user-action-history';
import { getHistoryIconByActionType } from '@/lib/history-icons';
import { useToastify } from '@/hooks/use-toastify';
import { containsNormalized } from '@/lib/string-utils';
import { useUsers, useToggleUserStatus } from '@/hooks/useUsers';
import { useUserAuditLog } from '@/hooks/useUserAuditLog';
import type { UserComplete } from '@/types/user.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Ícone SVG de Editar (customizado)
const EditarIcon = () => (
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
);

// Ícone SVG de Histórico (customizado)
const HistoricoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.3335 4.99996V15.8333C3.3335 17.214 4.45278 18.3333 5.8335 18.3333H14.1668C15.5475 18.3333 16.6668 17.214 16.6668 15.8333V7.49996C16.6668 6.11925 15.5475 4.99996 14.1668 4.99996H3.3335ZM3.3335 4.99996V4.16663" stroke="#14664A" strokeWidth="1.5"/>
    <path d="M15.0002 5.00002V5.75002H15.7502V5.00002H15.0002ZM13.0978 1.93845L12.9917 1.19599L13.0978 1.93845ZM4.09983 3.22387L3.99376 2.48141H3.99376L4.09983 3.22387ZM4.22605 5.00002V5.75002H15.0002V5.00002V4.25002H4.22605V5.00002ZM15.0002 5.00002H15.7502V3.58837H15.0002H14.2502V5.00002H15.0002ZM13.0978 1.93845L12.9917 1.19599L3.99376 2.48141L4.09983 3.22387L4.20589 3.96634L13.2039 2.68091L13.0978 1.93845ZM4.09983 3.22387L3.99376 2.48141C3.18455 2.59701 2.5835 3.29004 2.5835 4.10746H3.3335H4.0835C4.0835 4.03652 4.13566 3.97637 4.20589 3.96634L4.09983 3.22387ZM15.0002 3.58837H15.7502C15.7502 2.11771 14.4476 0.988006 12.9917 1.19599L13.0978 1.93845L13.2039 2.68091C13.7561 2.60202 14.2502 3.03053 14.2502 3.58837H15.0002ZM4.22605 5.00002V4.25002C4.14732 4.25002 4.0835 4.18619 4.0835 4.10746H3.3335H2.5835C2.5835 5.01462 3.31889 5.75002 4.22605 5.75002V5.00002Z" fill="#14664A"/>
    <path opacity="0.5" d="M6.6665 10H13.3332" stroke="#14664A" strokeWidth="1.5" strokeLinecap="round"/>
    <path opacity="0.5" d="M6.6665 12.9166H11.2498" stroke="#14664A" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const UsuariosPermissoes = () => {
  const navigate = useNavigate();
  const { toast } = useToastify();
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Estados para ordenação
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Estado para loading do refresh
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Standard modals hook
  const {
    modalStates,
    showInactivateConfirmation,
    showReactivateConfirmation,
    hideInactivateConfirmation,
    startInactivateFlow,
    completeInactivateFlow,
    startReactivateFlow,
    completeReactivateFlow,
    startCreateFlow,
    completeCreateFlow,
    startEditFlow,
    completeEditFlow,
    hideAllModals,
  } = useStandardModals();

  // Estados para os modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserComplete | null>(null);
  
  // Estados para ações (ativar/inativar e histórico)
  const [userToToggle, setUserToToggle] = useState<UserComplete | null>(null);
  const [historicoModalOpen, setHistoricoModalOpen] = useState(false);
  const [selectedUserHistorico, setSelectedUserHistorico] = useState<UserComplete | null>(null);

  // Hooks para dados
  const { data: users, isLoading, refetch } = useUsers();
  const toggleStatusMutation = useToggleUserStatus();

  // Breadcrumb navigation
  const breadcrumbPath = [
    { label: "Home", href: "/", icon: "home" as const },
    { label: "Gestão de bens móveis", href: "/?tab=gestao-bens-moveis" },
    { label: "Configurações", href: "/gestao-bens-moveis/configuracoes" },
    { label: "Usuários", current: true }
  ];

  // Função para voltar
  const handleBack = () => {
    navigate("/gestao-bens-moveis/configuracoes");
  };

  // Usar dados do banco ao invés de mock data
  const data = users || [];

  // Callbacks após criar/editar usuário
  const handleUserCreated = () => {
    refetch();
  };

  const handleUserUpdated = () => {
    refetch();
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

  // Colunas da galeria adaptadas para os novos dados
  const columns = [
    { key: 'name', title: 'Nome', sortable: true, width: 'auto' },
    { key: 'email', title: 'E-mail', sortable: true, width: 'auto' },
    { 
      key: 'accessProfileName', 
      title: 'Perfil', 
      sortable: true, 
      width: 'auto',
      render: (value: string) => (
        <Badge 
          variant="outline" 
          className={`bg-transparent font-normal border font-sora text-xs hover:bg-transparent ${getPerfilStyles(value)}`}
        >
          {value || '-'}
        </Badge>
      )
    },
    { key: 'departmentName', title: 'Setor', sortable: true, width: 'auto' },
    { 
      key: 'isDeleted', 
      title: 'Status', 
      sortable: true, 
      width: 'auto',
      render: (value: boolean) => {
        const statusText = value ? 'Inativo' : 'Ativo';
        return (
          <Badge 
            variant="outline" 
            className={`bg-transparent font-normal border font-sora text-xs hover:bg-transparent ${getStatusStyles(statusText)}`}
          >
            {statusText}
          </Badge>
        );
      }
    }
  ];

  // Estados para busca
  const [searchValue, setSearchValue] = useState('');

  // Filtrar e ordenar dados
  const sortedData = useMemo(() => {
    let filtered = [...data];

    // Aplicar filtro de pesquisa
    if (searchValue.trim()) {
      const searchTerm = searchValue.trim();
      filtered = filtered.filter(user => {
        return (
          containsNormalized(user.name, searchTerm) ||
          containsNormalized(user.email, searchTerm) ||
          containsNormalized(user.accessProfileName || '', searchTerm) ||
          containsNormalized(user.departmentName || '', searchTerm) ||
          containsNormalized(user.cpf, searchTerm) ||
          containsNormalized(user.phoneNumber, searchTerm)
        );
      });
    }

    // Aplicar ordenação
    if (sortColumn) {
      filtered = filtered.sort((a, b) => {
        let aValue = a[sortColumn as keyof typeof a];
        let bValue = b[sortColumn as keyof typeof b];

        // Tratamento para datas (formato DD/MM/YYYY)
        if (sortColumn === 'data_criacao') {
          const [aDay, aMonth, aYear] = (aValue as string).split('/');
          const [bDay, bMonth, bYear] = (bValue as string).split('/');
          const aTime = new Date(parseInt(aYear), parseInt(aMonth) - 1, parseInt(aDay)).getTime();
          const bTime = new Date(parseInt(bYear), parseInt(bMonth) - 1, parseInt(bDay)).getTime();
          return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
        }

        // Tratamento para último acesso (formato DD/MM/YYYY HH:MM)
        if (sortColumn === 'ultimo_acesso') {
          const [aDate, aTime] = (aValue as string).split(' ');
          const [bDate, bTime] = (bValue as string).split(' ');
          const [aDay, aMonth, aYear] = aDate.split('/');
          const [bDay, bMonth, bYear] = bDate.split('/');
          const [aHour, aMin] = aTime.split(':');
          const [bHour, bMin] = bTime.split(':');
          
          const aDateTime = new Date(parseInt(aYear), parseInt(aMonth) - 1, parseInt(aDay), parseInt(aHour), parseInt(aMin)).getTime();
          const bDateTime = new Date(parseInt(bYear), parseInt(bMonth) - 1, parseInt(bDay), parseInt(bHour), parseInt(bMin)).getTime();
          return sortDirection === 'asc' ? aDateTime - bDateTime : bDateTime - aDateTime;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
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
    setCurrentPage(1); // Reset para primeira página
  };

  // Função para lidar com o refresh dos dados
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    
    toast.success({
      title: "Dados atualizados com sucesso",
    });
  };

  // Calcular total de páginas
  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Função para lidar com ativação/inativação
  const handleToggleStatus = (user: UserComplete) => {
    setUserToToggle(user);
    if (!user.isDeleted) {
      showInactivateConfirmation();
    } else {
      showReactivateConfirmation();
    }
  };

  const handleConfirmToggleStatus = async () => {
    if (userToToggle) {
      const isInactivating = !userToToggle.isDeleted;
      
      if (isInactivating) {
        startInactivateFlow();
      } else {
        startReactivateFlow();
      }
      
      await toggleStatusMutation.mutateAsync({
        id: userToToggle.id,
        currentStatus: userToToggle.isDeleted
      });
      
      if (isInactivating) {
        completeInactivateFlow();
      } else {
        completeReactivateFlow();
      }
      setUserToToggle(null);
    }
  };

  // Hook para buscar histórico de auditoria
  const { data: auditLog, isLoading: isLoadingHistory } = useUserAuditLog(
    selectedUserHistorico?.id || null
  );

  // Mapear dados reais do banco para o formato do componente
  const historicoActions: UserAction[] = useMemo(() => {
    if (!auditLog || auditLog.length === 0) return [];
    
    return auditLog.map((log) => ({
      id: log.id,
      user: {
        name: log.performed_by_name || 'Sistema',
        avatar: undefined,
        initials: log.performed_by_name 
          ? log.performed_by_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
          : 'SI'
      },
      timestamp: format(new Date(log.created_at), "dd/MM/yyyy - HH:mm'h'", { locale: ptBR }),
      action: {
        icon: getHistoryIconByActionType(log.action_type),
        title: log.action_label,
        description: log.action_description || ''
      }
    }));
  }, [auditLog]);

  // Função para abrir modal de histórico
  const handleHistorico = (usuario: any) => {
    setSelectedUserHistorico(usuario);
    setHistoricoModalOpen(true);
  };

  // Função para fechar todos os modais após sucesso
  const handleSuccessConfirm = () => {
    hideAllModals();
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedUser(null);
  };

  // Função para abrir modal de visualização
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  // Função para abrir modal de edição
  const handleEditUser = (user: any) => {
    console.log('Abrindo modal de edição com usuário:', user);
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };


  // Mapeamento de status para estilos de badge
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'border-main-success text-main-success';
      case 'Inativo':
        return 'border-main-danger text-main-danger';
      default:
        return 'border-main-info text-main-info';
    }
  };

  // Mapeamento de perfil para estilos de badge
  const getPerfilStyles = (perfil: string) => {
    switch (perfil) {
      case 'Administrador':
        return 'border-main-danger text-main-danger';
      case 'Gestor':
        return 'border-main-warning text-main-warning';
      case 'Auditor':
        return 'border-main-info text-main-info';
      case 'Operador':
        return 'border-main-success text-main-success';
      default:
        return 'border-main-info text-main-info';
    }
  };

  // Função para obter ações baseadas no item
  const getActionsForItem = (item: any) => [
    {
      icon: <ToggleStatusIcon size={16} isActive={!item.isDeleted} />,
      label: !item.isDeleted ? 'Inativar' : 'Ativar',
      onClick: () => handleToggleStatus(item),
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
      onClick: () => handleEditUser(item),
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

  return (
    <>
      {/* Breadcrumb */}
      <div className="py-2">
        <Breadcrumb path={breadcrumbPath} onBack={handleBack} />
      </div>

      {/* Layout principal - ocupa altura total menos breadcrumb */}
      <div className="flex w-full h-[calc(100vh-8rem)] min-h-0">
        {/* Galeria de dados principal - ocupa todo o espaço */}
        <div className="flex-1 min-w-0">
          <DataGallery
            columns={columns}
            data={paginatedData}
            getActionsForItem={getActionsForItem}
            searchPlaceholder="Pesquisar usuários..."
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
            onExport={() => setIsModalOpen(true)}
            onRefresh={handleRefresh}
            loading={isRefreshing}
          />
        </div>
      </div>

      {/* Modal de cadastro de usuário */}
      <CadastrarUsuarioModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onUserCreated={handleUserCreated}
      />

      {/* Modal de visualização de usuário */}
      <VisualizarUsuarioModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        usuario={selectedUser}
      />

      {/* Modal de edição de usuário */}
      <EditarUsuarioModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        usuario={selectedUser}
        onUserUpdated={handleUserUpdated}
      />

      {/* Modal de histórico */}
      <HistoricoModal
        open={historicoModalOpen}
        onOpenChange={setHistoricoModalOpen}
        title={`Histórico - ${selectedUserHistorico?.name || 'Usuário'}`}
        actions={historicoActions}
      />

      {/* Standard Modals */}
      <StandardModalsWrapper
        modalStates={modalStates}
        onInactivateConfirm={handleConfirmToggleStatus}
        onInactivateCancel={hideInactivateConfirmation}
        onSuccessConfirm={handleSuccessConfirm}
      />
    </>
  );
};

export default UsuariosPermissoes;
