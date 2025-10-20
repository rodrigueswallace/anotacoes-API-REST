import React, { useState, useMemo } from 'react';
import { DataGallery } from '@/components/ui/data-gallery';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { EditarPatrimonioModal } from '@/components/modals/EditarPatrimonioModal';
import { ConfirmationModal, LoadingModal } from '@/components/ui/headerless-modals';

export interface PatrimonioItem {
  id: string;
  nome: string;
  quantidade: number;
  categoria: string;
  valor: number;
}

interface TabelaPatrimoniosProps {
  patrimonioId?: string;
  className?: string;
}

export const TabelaPatrimonios: React.FC<TabelaPatrimoniosProps> = ({
  patrimonioId,
  className
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchValue, setSearchValue] = useState('');
  
  // Estados dos modais
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [loadingModalOpen, setLoadingModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PatrimonioItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<PatrimonioItem | null>(null);

  // Dados mock dos patrimônios
  const [data, setData] = useState<PatrimonioItem[]>([
    {
      id: '1',
      nome: 'Notebook Dell Inspiron 15',
      quantidade: 25,
      categoria: 'Equipamentos de TI',
      valor: 2500.00
    },
    {
      id: '2',
      nome: 'Monitor 24" Samsung',
      quantidade: 50,
      categoria: 'Equipamentos de TI',
      valor: 800.00
    },
    {
      id: '3',
      nome: 'Cadeira Ergonômica',
      quantidade: 100,
      categoria: 'Mobiliário',
      valor: 450.00
    },
    {
      id: '4',
      nome: 'Mesa de Escritório',
      quantidade: 75,
      categoria: 'Mobiliário',
      valor: 350.00
    },
    {
      id: '5',
      nome: 'Impressora Multifuncional',
      quantidade: 10,
      categoria: 'Equipamentos de TI',
      valor: 1200.00
    }
  ]);

  // Formatador de valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Colunas da tabela
  const columns = [
    { key: 'nome', title: 'Nome', sortable: true, width: 'auto' },
    { 
      key: 'quantidade', 
      title: 'Quantidade', 
      sortable: true, 
      width: 'auto',
      render: (value: number) => (
        <span className="font-medium">{value.toLocaleString('pt-BR')}</span>
      )
    },
    { key: 'categoria', title: 'Categoria', sortable: true, width: 'auto' },
    { 
      key: 'valor', 
      title: 'Valor', 
      sortable: true, 
      width: 'auto',
      render: (value: number) => (
        <span className="font-medium text-main-success">{formatCurrency(value)}</span>
      )
    },
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

  // Filtrar e ordenar dados
  const sortedData = useMemo(() => {
    let filtered = [...data];

    // Aplicar filtro de pesquisa
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase().trim();
      filtered = filtered.filter(item => {
        return columns.some(column => {
          let value = item[column.key as keyof PatrimonioItem];
          if (column.key === 'valor') {
            // Para valores, buscar também no formato monetário
            return String(value).toLowerCase().includes(searchLower) ||
                   formatCurrency(value as number).toLowerCase().includes(searchLower);
          }
          return String(value).toLowerCase().includes(searchLower);
        });
      });
    }

    // Aplicar ordenação
    if (sortColumn) {
      filtered = filtered.sort((a, b) => {
        let aValue = a[sortColumn as keyof PatrimonioItem];
        let bValue = b[sortColumn as keyof PatrimonioItem];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, sortColumn, sortDirection, searchValue, columns]);

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

  // Função para editar item
  const handleEdit = (item: PatrimonioItem) => {
    setEditingItem(item);
    setEditModalOpen(true);
  };

  // Função para confirmar exclusão
  const handleDelete = (item: PatrimonioItem) => {
    setDeletingItem(item);
    setConfirmationModalOpen(true);
  };

  // Função para confirmar exclusão
  const handleConfirmDelete = async () => {
    if (deletingItem) {
      setConfirmationModalOpen(false);
      setLoadingModalOpen(true);
      
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Remove o item dos dados
      setData(prev => prev.filter(item => item.id !== deletingItem.id));
      
      setLoadingModalOpen(false);
      setDeletingItem(null);
    }
  };

  // Função para salvar edições
  const handleSave = async (formData: Partial<PatrimonioItem>) => {
    setLoadingModalOpen(true);
    
    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (editingItem) {
      // Atualizar item existente
      setData(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
    }
    
    setLoadingModalOpen(false);
    setEditModalOpen(false);
    setEditingItem(null);
  };

  // Função para obter ações de cada item
  const getActionsForItem = (item: PatrimonioItem) => [
    {
      icon: <Edit size={16} />,
      label: 'Editar',
      onClick: () => handleEdit(item),
    },
    {
      icon: <Trash2 size={16} />,
      label: 'Excluir',
      onClick: () => handleDelete(item),
    },
  ];

  return (
    <>
      <div className={className}>
        <DataGallery
          columns={columns}
          data={paginatedData}
          getActionsForItem={getActionsForItem}
          searchPlaceholder="Pesquisar patrimônios..."
          showColumnSelector={false}
          showSearch={true}
          showExportButton={false}
          showRefreshButton={false}
          showStatusIndicator={false}
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
        />
      </div>

      {/* Modal de edição */}
      <EditarPatrimonioModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleSave}
        patrimonio={editingItem}
      />

      {/* Modal de confirmação de exclusão */}
      <ConfirmationModal
        open={confirmationModalOpen}
        onOpenChange={setConfirmationModalOpen}
        title="Deseja excluir este item?"
        subtitle="Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmationModalOpen(false)}
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      {/* Modal de loading */}
      <LoadingModal 
        open={loadingModalOpen}
        onOpenChange={setLoadingModalOpen}
        title="Carregando..."
        subtitle={
          deletingItem 
            ? "O item está sendo excluído." 
            : "O item está sendo salvo."
        }
      />
    </>
  );
};