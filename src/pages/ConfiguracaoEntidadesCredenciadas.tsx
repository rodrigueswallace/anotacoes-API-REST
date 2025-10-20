
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGallery } from '@/components/ui/data-gallery';
import { Breadcrumb } from '@/components/ui/breadcrumb-navigation';
import { Badge } from '@/components/ui/badge';
import { ToggleStatusIcon } from '@/components/ui/toggle-status-icon';
import { AddIcon } from '@/components/ui/add-icon';
import { CadastrarEntidadeCredenciadaModal } from '@/components/modals/CadastrarEntidadeCredenciadaModal';
import { StandardModalsWrapper } from '@/components/modals/StandardModalsWrapper';
import { useStandardModals } from '@/hooks/use-standard-modals';
import { useToastify } from '@/hooks/use-toastify';
import { useCredentialingEntities } from '@/hooks/useCredentialingEntities';
import { containsNormalized } from '@/lib/string-utils';
import { formatCNPJ } from '@/lib/formatters';
import { useCredentialingEntityAuditLog } from '@/hooks/useCredentialingEntityAuditLog';
import { HistoricoModal } from '@/components/modals/HistoricoModal';
import { getHistoryIconByActionType } from '@/lib/history-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { UserAction } from '@/components/ui/user-action-history';

const ConfiguracaoEntidadesCredenciadas = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [historicoModalOpen, setHistoricoModalOpen] = useState(false);
  const [selectedEntityHistorico, setSelectedEntityHistorico] = useState<any>(null);
  
  const modalStates = useStandardModals();
  const { toast } = useToastify();
  const { entities, isLoading, refetch, createEntity, updateEntity, toggleStatus } = useCredentialingEntities();

  // Hook para buscar histórico da entidade selecionada
  const { data: entityAuditLogs = [], refetch: refetchAuditLogs } = useCredentialingEntityAuditLog(
    selectedEntityHistorico?.id || null
  );

  const getTipoEntidadeLabel = (value: string) => {
    const options = [
      { value: 'empresa-privada', label: 'Empresa Privada' },
      { value: 'sociedade-anonima', label: 'Sociedade Anônima' },
      { value: 'microempresa', label: 'Microempresa' },
      { value: 'empresa-publica', label: 'Empresa Pública' },
      { value: 'autarquia', label: 'Autarquia' },
      { value: 'fundacao', label: 'Fundação' }
    ];
    return options.find(opt => opt.value === value)?.label || value;
  };

  const getEsferaAdministrativaLabel = (value: string) => {
    const options = [
      { value: 'federal', label: 'Federal' },
      { value: 'estadual', label: 'Estadual' },
      { value: 'municipal', label: 'Municipal' }
    ];
    return options.find(opt => opt.value === value)?.label || value;
  };

  const breadcrumbPath = [
    { label: "Home", href: "/", icon: "home" as const },
    { label: "Gestão de bens móveis", href: "/?tab=gestao-bens-moveis" },
    { label: "Configurações", href: "/gestao-bens-moveis/configuracoes" },
    { label: "Entidades credenciadas", current: true }
  ];

  const columns = [
    { key: 'nome', title: 'Nome da entidade', sortable: true, width: 'auto' },
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
      key: 'tipoEntidade', 
      title: 'Tipo de entidade', 
      sortable: true, 
      width: 'auto'
    },
    { key: 'emailResponsavel', title: 'E-mail do responsável', sortable: true, width: 'auto' },
    { key: 'telefoneResponsavel', title: 'Telefone do responsável', sortable: true, width: 'auto' },
    { 
      key: 'ativo', 
      title: 'Status', 
      sortable: true, 
      width: 'auto',
      render: (value: boolean) => {
        const statusDisplay = value ? 'Ativo' : 'Inativo';
        return (
          <Badge 
            variant="outline" 
            className={`bg-transparent font-normal border font-sora text-xs hover:bg-transparent ${
              statusDisplay === 'Ativo'
                ? 'border-main-success text-main-success' 
                : 'border-main-danger text-main-danger'
            }`}
          >
            {statusDisplay}
          </Badge>
        );
      }
    }
  ];

  const sortedData = useMemo(() => {
    return entities.filter(item => 
      !searchValue.trim() || 
      containsNormalized(item.nome, searchValue) ||
      containsNormalized(item.cnpj, searchValue) ||
      containsNormalized(item.tipoEntidade, searchValue) ||
      containsNormalized(item.emailResponsavel, searchValue)
    );
  }, [entities, searchValue]);

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

  const handleEdit = (item: any) => {
    setSelectedEntity(item);
    setEditModalOpen(true);
  };

  const handleToggleStatus = (item: any, action: 'ativar' | 'inativar') => {
    setSelectedItem(item);
    if (action === 'ativar') {
      modalStates.showReactivateConfirmation();
    } else {
      modalStates.showInactivateConfirmation(
        'Deseja inativar este item?',
        'Ele não estará mais visível fora das configurações.'
      );
    }
  };

  const handleConfirmToggleStatus = async () => {
    if (selectedItem) {
      const isActivating = !selectedItem.ativo;
      
      modalStates.hideInactivateConfirmation();
      
      modalStates.showProcessingModal(
        isActivating ? 'O item está sendo ativado.' : 'O item está sendo inativado.'
      );
      
      try {
        await toggleStatus(selectedItem.id);
        await refetch();
        
        modalStates.showSuccessModal(
          isActivating ? 'Item ativado com sucesso!' : 'Item inativado com sucesso!'
        );
      } catch (error) {
        console.error('Error toggling status:', error);
      }
      
      setSelectedItem(null);
    }
  };

  const handleSuccessConfirm = () => {
    modalStates.hideAllModals();
    setModalOpen(false);
    setEditModalOpen(false);
    setSelectedEntity(null);
  };

  // Atualizar histórico quando o modal abrir
  useEffect(() => {
    if (historicoModalOpen && selectedEntityHistorico) {
      refetchAuditLogs();
    }
  }, [historicoModalOpen, selectedEntityHistorico, refetchAuditLogs]);

  const handleSave = async (formData: any) => {
    if (selectedEntity) {
      modalStates.startEditFlow();
    } else {
      modalStates.startCreateFlow();
    }
    
    try {
      let savedEntity;
      if (selectedEntity) {
        savedEntity = await updateEntity({ id: selectedEntity.id, data: formData });
        modalStates.completeEditFlow();
      } else {
        savedEntity = await createEntity(formData);
        modalStates.completeCreateFlow();
      }
      
      await refetch();
      return savedEntity;
    } catch (error) {
      console.error('Error saving entity:', error);
      modalStates.hideAllModals();
    }
  };

  const getActionsForItem = (item: any) => [
    {
      icon: <ToggleStatusIcon size={20} isActive={item.ativo} />,
      label: item.ativo ? 'Inativar' : 'Ativar',
      onClick: () => handleToggleStatus(item, item.ativo ? 'inativar' : 'ativar')
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
      onClick: () => {
        setSelectedEntityHistorico(item);
        setHistoricoModalOpen(true);
      }
    }
  ];

  return (
    <>
      <div className="py-2">
        <Breadcrumb 
          path={breadcrumbPath} 
          onBack={() => navigate("/gestao-bens-moveis/configuracoes")} 
        />
      </div>
      
      <div className="flex w-full h-[calc(100vh-8rem)] min-h-0">
        <div className="flex-1 min-w-0">
          <DataGallery 
            columns={columns}
            data={sortedData}
            getActionsForItem={getActionsForItem}
            searchPlaceholder="Pesquisar entidades credenciadas..."
            showColumnSelector={true}
            showSearch={true}
            showExportButton={true}
            exportButtonText="Adicionar"
            exportButtonIcon={<AddIcon size={20} />}
            showStatusIndicator={true}
            getStatusColor={(item) => {
              return item.ativo ? 'hsl(var(--main-success))' : 'hsl(var(--main-danger))';
            }}
            onExport={() => setModalOpen(true)}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onRefresh={async () => {
              setIsRefreshing(true);
              await refetch();
              setIsRefreshing(false);
              toast.success({
                title: "Dados atualizados com sucesso",
              });
            }}
            loading={isLoading || isRefreshing}
          />
        </div>
      </div>

      <CadastrarEntidadeCredenciadaModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
      />

      <CadastrarEntidadeCredenciadaModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleSave}
        editData={selectedEntity}
        isEditing={true}
      />

      <StandardModalsWrapper
        modalStates={modalStates.modalStates}
        onInactivateConfirm={handleConfirmToggleStatus}
        onInactivateCancel={() => modalStates.hideInactivateConfirmation()}
        onReactivateConfirm={handleConfirmToggleStatus}
        onReactivateCancel={() => modalStates.hideInactivateConfirmation()}
        onSuccessConfirm={handleSuccessConfirm}
      />

      <HistoricoModal
        open={historicoModalOpen}
        onOpenChange={setHistoricoModalOpen}
        title={`Histórico - ${selectedEntityHistorico?.nome || ''}`}
        actions={formatAuditLogsToUserActions(entityAuditLogs)}
      />
    </>
  );
};

export default ConfiguracaoEntidadesCredenciadas;
