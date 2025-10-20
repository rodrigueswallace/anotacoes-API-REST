import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGallery } from '@/components/ui/data-gallery';
import { FilterMenu } from '@/components/ui/filter-menu';
import { Breadcrumb } from '@/components/ui/breadcrumb-navigation';
import { Badge } from '@/components/ui/badge';
import { Eye, Settings, Star } from 'lucide-react';
import { useResponsiveCollapse } from '@/hooks/use-responsive-collapse';
import { MobileFilterDrawer } from '@/components/ui/mobile-filter-drawer';
import { CadastrarPatrimonioModal } from '@/components/modals/CadastrarPatrimonioModal';
import { patrimonioStorage, PatrimonioData } from '@/lib/patrimonio-storage';
import { useToast } from "@/hooks/use-toast";

const RecepcaoNotaFiscal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estados para filtros
  const [activeFilters, setActiveFilters] = useState<string[]>(['todos']);
  const [activeTipoFilters, setActiveTipoFilters] = useState<string[]>([]);
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Estados para ordenação
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Estado para pesquisa
  const [searchValue, setSearchValue] = useState('');
  
  // Estado para controle responsivo
  const [filterMenuCollapsed, setFilterMenuCollapsed] = useState(false);
  const { shouldCollapse: shouldAutoCollapse, isMobile } = useResponsiveCollapse();

  // Estado para o modal de cadastrar patrimônio
  const [cadastrarPatrimonioModalOpen, setCadastrarPatrimonioModalOpen] = useState(false);

  // Estado para dados reais do patrimônio
  const [patrimonios, setPatrimonios] = useState<PatrimonioData[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    patrimonioStorage.initializeMockData();
    loadPatrimonios();
  }, [refreshKey]);

  const loadPatrimonios = () => {
    const data = patrimonioStorage.getAll();
    setPatrimonios(data);
  };

  // Mapear dados para formato da DataGallery
  const data = useMemo(() => {
    return patrimonios.map(patrimonio => patrimonioStorage.mapToDataGalleryFormat(patrimonio));
  }, [patrimonios]);

  // Mapeamento de status para estilos de badge (igual ao Index.tsx)
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Recebimento':
        return 'border-main-info text-main-info';
      case 'Tombo':
        return 'border-main-danger text-main-danger';
      case 'Etiquetagem':
        return 'border-main-warning text-main-warning';
      case 'Concluído':
        return 'border-main-success text-main-success';
      default:
        return 'border-main-info text-main-info';
    }
  };

  // Colunas da galeria baseadas na imagem
  const columns = [
    { key: 'nf', title: 'NF', sortable: true, width: 'auto' },
    { key: 'empenho', title: 'Empenho', sortable: true, width: 'auto' },
    { key: 'elemento_despesa', title: 'Elemento da despesa', sortable: true, width: 'auto' },
    { key: 'numero_itens', title: 'Número de itens', sortable: true, width: 'auto' },
    { key: 'data_aquisicao', title: 'Data aquisição', sortable: true, width: 'auto' },
    { key: 'tipo_aquisicao', title: 'Tipo de aquisição', sortable: true, width: 'auto' },
    { 
      key: 'tipo', 
      title: 'Tipo', 
      sortable: true, 
      width: 'auto',
      render: (value: string, item: any) => {
        const tipo = item.nf && item.nf !== '-' ? 'NF' : 'Tombo direto';
        return (
          <span className="font-sora text-sm text-second-dark">
            {tipo}
          </span>
        );
      }
    },
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
          {value}
        </Badge>
      )
    },
  ];

  // Estado para colunas visíveis
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map(col => col.key)
  );

  // Breadcrumb navigation
  const breadcrumbPath = [
    { label: "Home", href: "/", icon: "home" as const },
    { label: "Gestão de bens móveis", href: "/?tab=gestao-bens-moveis" },
    { label: "Recepção de nota fiscal", current: true }
  ];

  // Função para avançar status do patrimônio
  const handleAdvanceStatus = (item: any) => {
    const success = patrimonioStorage.advanceStatus(item.id);
    if (success) {
      loadPatrimonios();
      toast({
        title: "Status atualizado",
        description: "O status do patrimônio foi avançado com sucesso.",
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível avançar o status do patrimônio.",
        variant: "destructive",
      });
    }
  };

  // Função para lidar com fechamento do modal e atualizar dados
  const handleModalClose = (open: boolean) => {
    setCadastrarPatrimonioModalOpen(open);
    if (!open) {
      // Recarregar dados quando o modal for fechado
      setRefreshKey(prev => prev + 1);
      toast({
        title: "Dados atualizados",
        description: "A lista foi atualizada com os novos patrimônios.",
      });
    }
  };

  // Função para voltar
  const handleBack = () => {
    navigate("/?tab=gestao-bens-moveis");
  };

  // Dados de exemplo removidos - agora usando dados reais do localStorage

  // Função para contar itens por status (usando dados originais para contadores totais)
  const getStatusCount = (status: string) => {
    return data.filter(item => item.status === status).length;
  };

  // Função para contar itens por tipo (usando dados originais para contadores totais)
  const getTipoCount = (tipo: string) => {
    if (tipo === 'nf') {
      return data.filter(item => item.nf && item.nf !== '-').length;
    } else if (tipo === 'tombo-direto') {
      return data.filter(item => !item.nf || item.nf === '-').length;
    }
    return 0;
  };

  // Função para lidar com cliques nos filtros de tipo
  const handleTipoFilterToggle = (tipoId: string) => {
    if (activeTipoFilters.includes(tipoId)) {
      setActiveTipoFilters(activeTipoFilters.filter(f => f !== tipoId));
    } else {
      setActiveTipoFilters([...activeTipoFilters, tipoId]);
    }
  };

  // Tag groups para tipo com funcionalidade e cores
  const tagGroups = [
    {
      id: 'tipo',
      title: 'Tipo',
      tags: [
        { 
          id: 'nf', 
          label: 'Nota fiscal', 
          active: activeTipoFilters.includes('nf'), 
          onClick: () => handleTipoFilterToggle('nf'),
          color: 'main-success'
        },
        { 
          id: 'tombo-direto', 
          label: 'Tombo direto', 
          active: activeTipoFilters.includes('tombo-direto'), 
          onClick: () => handleTipoFilterToggle('tombo-direto'),
          color: 'main-warning'
        },
      ]
    }
  ];

  // Função para lidar com ordenação
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Função para lidar com mudança de pesquisa
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1); // Reset para primeira página quando pesquisar
  };

  // Função para lidar com mudança de colunas visíveis
  const handleVisibleColumnsChange = (newVisibleColumns: string[]) => {
    setVisibleColumns(newVisibleColumns);
  };

  // Filtrar e ordenar dados
  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Aplicar filtro de pesquisa
    if (searchValue.trim()) {
      const searchTerm = searchValue.toLowerCase().trim();
      filtered = filtered.filter(item => {
        // Pesquisar apenas em colunas visíveis
        const visibleRegularColumns = visibleColumns.filter(col => 
          col !== 'tipo' && item.hasOwnProperty(col)
        );
        const regularMatch = visibleRegularColumns.some(col => {
          const value = item[col as keyof typeof item];
          return value && value.toString().toLowerCase().includes(searchTerm);
        });

        if (regularMatch) return true;

        // Pesquisar em coluna customizada 'tipo' apenas se estiver visível
        if (visibleColumns.includes('tipo')) {
          const tipo = item.nf && item.nf !== '-' ? 'NF' : 'Tombo direto';
          if (tipo.toLowerCase().includes(searchTerm)) return true;
        }

        return false;
      });
    }

    // Filtrar por status
    if (!activeFilters.includes('todos')) {
      const statusMap: { [key: string]: string } = {
        'recebimento': 'Recebimento',
        'tombo': 'Tombo',
        'etiquetagem': 'Etiquetagem',
        'concluido': 'Concluído'
      };

      filtered = filtered.filter(item => 
        activeFilters.some(filter => statusMap[filter] === item.status)
      );
    }

    // Filtrar por tipo
    if (activeTipoFilters.length > 0) {
      filtered = filtered.filter(item => {
        const itemTipo = item.nf && item.nf !== '-' ? 'nf' : 'tombo-direto';
        return activeTipoFilters.includes(itemTipo);
      });
    }

    // Aplicar ordenação
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortColumn as keyof typeof a];
        let bValue = b[sortColumn as keyof typeof b];

        // Tratamento especial para coluna 'tipo'
        if (sortColumn === 'tipo') {
          aValue = a.nf && a.nf !== '-' ? 'NF' : 'Tombo direto';
          bValue = b.nf && b.nf !== '-' ? 'NF' : 'Tombo direto';
        }

        // Tratamento para números
        if (sortColumn === 'numero_itens') {
          const aNum = parseInt(aValue as string);
          const bNum = parseInt(bValue as string);
          return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
        }

        // Tratamento para datas (formato DD/MM/YYYY)
        if (sortColumn === 'data_aquisicao') {
          const [aDay, aMonth, aYear] = (aValue as string).split('/');
          const [bDay, bMonth, bYear] = (bValue as string).split('/');
          const aTime = new Date(parseInt(aYear), parseInt(aMonth) - 1, parseInt(aDay)).getTime();
          const bTime = new Date(parseInt(bYear), parseInt(bMonth) - 1, parseInt(bDay)).getTime();
          return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, activeFilters, activeTipoFilters, sortColumn, sortDirection, searchValue, visibleColumns]);

  // Dados paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage, pageSize]);

  // Função para lidar com mudança de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Função para lidar com mudança de tamanho da página
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset para primeira página
  };

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

  // Função para lidar com cliques nos filtros
  const handleFilterClick = (filterId: string) => {
    if (filterId === 'todos') {
      setActiveFilters(['todos']);
    } else {
      // Remove 'todos' se outro filtro for selecionado
      const newFilters = activeFilters.filter(f => f !== 'todos');
      
      if (newFilters.includes(filterId)) {
        // Remove o filtro se já estiver ativo
        const updatedFilters = newFilters.filter(f => f !== filterId);
        // Se não sobrar nenhum filtro, volta para 'todos'
        setActiveFilters(updatedFilters.length > 0 ? updatedFilters : ['todos']);
      } else {
        // Adiciona o novo filtro
        setActiveFilters([...newFilters, filterId]);
      }
    }
  };

  // Filter items com dados dinâmicos
  const filterItems = [
    { 
      id: 'todos', 
      label: 'Todos', 
      count: data.length, 
      active: activeFilters.includes('todos'), 
      onClick: () => handleFilterClick('todos') 
    },
    { 
      id: 'recebimento', 
      label: 'Recebimento', 
      count: getStatusCount('Recebimento'), 
      active: activeFilters.includes('recebimento'), 
      onClick: () => handleFilterClick('recebimento') 
    },
    { 
      id: 'tombo', 
      label: 'Tombo', 
      count: getStatusCount('Tombo'), 
      active: activeFilters.includes('tombo'), 
      onClick: () => handleFilterClick('tombo') 
    },
    { 
      id: 'etiquetagem', 
      label: 'Etiquetagem', 
      count: getStatusCount('Etiquetagem'), 
      active: activeFilters.includes('etiquetagem'), 
      onClick: () => handleFilterClick('etiquetagem') 
    },
    { 
      id: 'concluido', 
      label: 'Concluído', 
      count: getStatusCount('Concluído'), 
      active: activeFilters.includes('concluido'), 
      onClick: () => handleFilterClick('concluido') 
    },
    { 
      id: 'favoritos', 
      label: 'Favoritos', 
      count: 0, 
      active: false, 
      onClick: () => {} 
    },
  ];

  // Contar filtros ativos para o botão mobile
  const getActiveFiltersCount = () => {
    let count = 0;
    if (!activeFilters.includes('todos')) {
      count += activeFilters.length;
    }
    count += activeTipoFilters.length;
    return count;
  };

  // Função para limpar todos os filtros
  const handleClearAllFilters = () => {
    setActiveFilters(['todos']);
    setActiveTipoFilters([]);
  };

  // Ações disponíveis para cada linha
  const actions = [
    {
      icon: <Eye size={16} />,
      label: 'Visualizar',
      onClick: (item: any) => navigate(`/recepcao-nota-fiscal/${item.id}`),
    },
    {
      icon: <Settings size={16} />,
      label: 'Avançar Status',
      onClick: handleAdvanceStatus,
    },
    {
      icon: <Star size={16} />,
      label: 'Favoritar',
      onClick: (item: any) => {
        toast({
          title: "Favorito",
          description: "Item adicionado aos favoritos.",
        });
      },
    },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="py-2">
        <Breadcrumb path={breadcrumbPath} onBack={handleBack} />
      </div>

      {/* Layout principal com filtros e galeria - responsivo */}
      <div className="flex w-full h-[calc(100vh-8rem)] min-h-0 gap-4">
        {/* Menu de filtros lateral - responsivo */}
        {!shouldAutoCollapse && (
          <div className={`flex-shrink-0 min-w-0 ${filterMenuCollapsed ? 'w-[76px]' : 'w-60'}`}>
            <FilterMenu
              title="Recepção da NF"
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>}
              filterItems={filterItems}
              tagGroups={tagGroups}
              onFilterClick={() => {}}
              actionButton={{
                label: "Cadastrar patrimônio",
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>,
                onClick: () => setCadastrarPatrimonioModalOpen(true)
              }}
              collapsed={filterMenuCollapsed}
              onToggleCollapse={() => setFilterMenuCollapsed(!filterMenuCollapsed)}
            />
          </div>
        )}

        {/* Galeria de dados principal - ocupa todo o espaço restante */}
        <div className="flex-1 min-w-0">
          {/* Botão de filtros mobile - apenas visível quando o menu lateral está oculto */}
          {shouldAutoCollapse && (
            <div className="flex justify-between items-center p-4 border-b bg-main-white">
              <h1 className="text-lg font-semibold text-second-dark">Recepção da NF</h1>
              <MobileFilterDrawer
                title="Filtros"
                filterItems={filterItems}
                tagGroups={tagGroups}
                activeFiltersCount={getActiveFiltersCount()}
                onClearAllFilters={handleClearAllFilters}
                onFilterClick={() => {}}
              />
            </div>
          )}
          
          {/* DataGallery */}
          <div className={shouldAutoCollapse ? "h-[calc(100%-73px)]" : "h-full"}>
            <DataGallery
                columns={columns}
                data={paginatedData}
                actions={actions}
                searchPlaceholder="Pesquisar..."
                showColumnSelector={true}
                showSearch={true}
                showExportButton={true}
                showRefreshButton={true}
                showStatusIndicator={true}
                getStatusColor={(item) => {
                  const tipo = item.nf && item.nf !== '-' ? 'NF' : 'Tombo direto';
                  return tipo === 'NF' ? 'hsl(var(--main-success))' : 'hsl(var(--main-warning))';
                }}
                showPagination={true}
                pageSize={pageSize}
                totalItems={filteredAndSortedData.length}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                onVisibleColumnsChange={handleVisibleColumnsChange}
                onExport={() => {
                  toast({
                    title: "Exportação",
                    description: "Dados exportados com sucesso.",
                  });
                }}
                onRefresh={() => {
                  setRefreshKey(prev => prev + 1);
                  toast({
                    title: "Atualizado",
                    description: "Lista atualizada com sucesso.",
                  });
                }}
              />
          </div>
        </div>
      </div>

      {/* Modal de Cadastrar Patrimônio */}
      <CadastrarPatrimonioModal
        open={cadastrarPatrimonioModalOpen}
        onOpenChange={handleModalClose}
      />
    </>
  );
};

export default RecepcaoNotaFiscal;
