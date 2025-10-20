import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { FormSelect, FormSelectContent, FormSelectItem, FormSelectTrigger, FormSelectValue } from "@/components/ui/form-select";
import { GhostButtonWithIconLeft, GhostButtonWithIcon } from "@/components/ui/primary-buttons";
import { GhostButtonNaturalCursor } from "@/components/ui/ghost-button-natural-cursor";
import { ColumnSelector } from "@/components/ui/column-selector";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Search, 
  Download, 
  Eye,
  Edit,
  Star,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { SortIcon } from "@/components/ui/sort-icon";
import { ReloadIcon } from "@/components/ui/reload-icon";

// Tipos para configuração das colunas
export interface DataGalleryColumn {
  key: string;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

// Tipos para ações nas linhas
export interface DataGalleryAction {
  icon: React.ReactNode;
  label: string;
  onClick: (row: any) => void;
  variant?: "default" | "ghost" | "outline";
  tooltip?: string;
}

// Tipos para configuração da galeria
export interface DataGalleryProps {
  // Dados
  data: any[];
  columns: DataGalleryColumn[];
  
  // Cabeçalho
  showColumnSelector?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onVisibleColumnsChange?: (visibleColumns: string[]) => void;
  showExportButton?: boolean;
  exportButtonText?: string;
  exportButtonIcon?: React.ReactNode;
  onExport?: () => void;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
  
  // Tabela
  showStatusIndicator?: boolean;
  getStatusColor?: (row: any) => string;
  actions?: DataGalleryAction[];
  getActionsForItem?: (item: any) => DataGalleryAction[];
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  
  // Paginação
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  
  // Personalização
  className?: string;
  loading?: boolean;
}

const DataGallery = React.forwardRef<HTMLDivElement, DataGalleryProps>(
  ({
    data = [],
    columns = [],
    
    // Cabeçalho - padrões
    showColumnSelector = true,
    showSearch = true,
    searchPlaceholder = "Pesquisar",
    searchValue = "",
    onSearchChange,
    onVisibleColumnsChange,
    showExportButton = true,
    exportButtonText = "Exportar",
    exportButtonIcon = <Download className="h-4 w-4" />,
    onExport,
    showRefreshButton = true,
    onRefresh,
    
    // Tabela - padrões
    showStatusIndicator = false,
    getStatusColor,
    actions = [],
    getActionsForItem,
    onSort,
    sortColumn,
    sortDirection,
    
    // Paginação - padrões
    showPagination = true,
    currentPage = 1,
    totalPages = 1,
    pageSize = 10,
    totalItems = 0,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20, 50, 100],
    
    // Personalização
    className,
    loading = false,
    ...props
  }, ref) => {
    // Estados internos
    const [visibleColumns, setVisibleColumns] = React.useState<string[]>(
      columns.map(col => col.key)
    );
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    
    // Refs para medir o espaço disponível
    const headerRef = React.useRef<HTMLDivElement>(null);
    const leftSideRef = React.useRef<HTMLDivElement>(null);
    const rightSideRef = React.useRef<HTMLDivElement>(null);
    const searchRef = React.useRef<HTMLDivElement>(null);
    
    // Estado para largura dinâmica da pesquisa
    const [searchWidth, setSearchWidth] = React.useState(320); // w-80 = 320px
    
    // Hook para ajustar largura da pesquisa baseado no espaço disponível
    React.useEffect(() => {
      const adjustSearchWidth = () => {
        if (!headerRef.current || !leftSideRef.current || !rightSideRef.current || !searchRef.current) return;
        
        const headerWidth = headerRef.current.offsetWidth;
        const leftSideWidth = leftSideRef.current.offsetWidth;
        const rightSideWidth = rightSideRef.current.offsetWidth;
        const padding = 32; // 16px each side
        const minGap = 8; // Espaçamento mínimo de 8px
        const minSearchWidth = 200; // Largura mínima da pesquisa
        
        // Calcula o espaço disponível para a pesquisa
        const availableSpace = headerWidth - leftSideWidth - rightSideWidth - padding - minGap;
        
        // Se o espaço disponível é menor que a largura atual da pesquisa, ajusta
        if (availableSpace < searchWidth) {
          const newWidth = Math.max(minSearchWidth, availableSpace);
          setSearchWidth(newWidth);
        } else if (availableSpace > 320 && searchWidth < 320) {
          // Se há espaço suficiente, volta para a largura padrão
          setSearchWidth(320);
        }
      };
      
      // Observa mudanças no tamanho da galeria
      const resizeObserver = new ResizeObserver(adjustSearchWidth);
      
      if (headerRef.current) {
        resizeObserver.observe(headerRef.current);
      }
      
      // Ajusta na primeira renderização
      adjustSearchWidth();
      
      return () => resizeObserver.disconnect();
    }, [searchWidth]);

    const handleVisibleColumnsChange = React.useCallback((newVisibleColumns: string[]) => {
      setVisibleColumns(newVisibleColumns);
      onVisibleColumnsChange?.(newVisibleColumns);
    }, [onVisibleColumnsChange]);

    const handleSort = (columnKey: string) => {
      if (!onSort) return;
      
      const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(columnKey, newDirection);
    };

    const getSortIcon = (columnKey: string) => {
      if (sortColumn !== columnKey) {
        return <SortIcon sortState="none" />;
      }
      return <SortIcon sortState={sortDirection === 'asc' ? 'asc' : 'desc'} />;
    };

    const handleRefresh = () => {
      setIsRefreshing(true);
      onRefresh?.();
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1500);
    };

    const renderPagination = () => {
      if (!showPagination) return null;

      const startItem = (currentPage - 1) * pageSize + 1;
      const endItem = Math.min(currentPage * pageSize, totalItems);

      return (
        <div className="bg-main-white border-t border-light-black/20 rounded-b-md">
          {/* Desktop: Layout original em uma linha */}
          <div className="hidden md:flex items-center justify-between px-4 py-4">
            {/* Controle de itens por página */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-sora text-second-dark">
                Mostrando
              </span>
              <FormSelect value={pageSize.toString()} onValueChange={(value) => onPageSizeChange?.(Number(value))}>
                <FormSelectTrigger className="w-auto min-w-[70px] h-8 px-3 py-1 text-sm" hasValue={true}>
                  <FormSelectValue />
                </FormSelectTrigger>
                <FormSelectContent>
                  {pageSizeOptions.map(size => (
                    <FormSelectItem key={size} value={size.toString()}>{size}</FormSelectItem>
                  ))}
                </FormSelectContent>
              </FormSelect>
              <span className="text-sm font-sora text-second-dark">
                de {totalItems} registros
              </span>
            </div>

            {/* Navegação de páginas */}
            <div className="flex items-center gap-1">
              {/* Botão Primeira Página */}
              <button
                onClick={() => currentPage > 1 && onPageChange?.(1)}
                disabled={currentPage <= 1}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded text-lg font-medium transition-colors",
                  "bg-second-white text-main-dark hover:bg-light-black/10 disabled:hover:bg-second-white",
                  currentPage <= 1 && "opacity-40 cursor-not-allowed"
                )}
              >
                «
              </button>
              
              {/* Botão Página Anterior */}
              <button
                onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
                disabled={currentPage <= 1}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded text-lg font-medium transition-colors",
                  "bg-second-white text-main-dark hover:bg-light-black/10 disabled:hover:bg-second-white",
                  currentPage <= 1 && "opacity-40 cursor-not-allowed"
                )}
              >
                ‹
              </button>

              {/* Páginas numeradas */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                const isActive = currentPage === page;
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange?.(page)}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-second-primary text-main-white" 
                        : "bg-second-white text-main-dark hover:bg-light-black/10"
                    )}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Reticências */}
              {totalPages > 5 && (
                <span className="flex items-center justify-center w-8 h-8 text-sm text-second-dark/60">
                  ...
                </span>
              )}

              {/* Botão Próxima Página */}
              <button
                onClick={() => currentPage < totalPages && onPageChange?.(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded text-lg font-medium transition-colors",
                  "bg-second-white text-main-dark hover:bg-light-black/10 disabled:hover:bg-second-white",
                  currentPage >= totalPages && "opacity-40 cursor-not-allowed"
                )}
              >
                ›
              </button>

              {/* Botão Última Página */}
              <button
                onClick={() => currentPage < totalPages && onPageChange?.(totalPages)}
                disabled={currentPage >= totalPages}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded text-lg font-medium transition-colors",
                  "bg-second-white text-main-dark hover:bg-light-black/10 disabled:hover:bg-second-white",
                  currentPage >= totalPages && "opacity-40 cursor-not-allowed"
                )}
              >
                »
              </button>
            </div>
          </div>

          {/* Mobile: Layout em duas linhas */}
          <div className="md:hidden">
            {/* Primeira linha: Informações de registros e seletor de items */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-light-black/10">
              <span className="text-sm font-sora text-second-dark">
                {startItem}-{endItem} de {totalItems}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-sora text-second-dark">
                  Por página:
                </span>
                <FormSelect value={pageSize.toString()} onValueChange={(value) => onPageSizeChange?.(Number(value))}>
                  <FormSelectTrigger className="w-auto min-w-[60px] h-8 px-2 py-1 text-sm" hasValue={true}>
                    <FormSelectValue />
                  </FormSelectTrigger>
                  <FormSelectContent>
                    {pageSizeOptions.map(size => (
                      <FormSelectItem key={size} value={size.toString()}>{size}</FormSelectItem>
                    ))}
                  </FormSelectContent>
                </FormSelect>
              </div>
            </div>

            {/* Segunda linha: Navegação de páginas simplificada */}
            <div className="flex items-center justify-between px-4 py-3">
              {/* Botões de navegação anterior */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => currentPage > 1 && onPageChange?.(1)}
                  disabled={currentPage <= 1}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded text-lg font-medium transition-colors",
                    "bg-second-white text-main-dark hover:bg-light-black/10 disabled:hover:bg-second-white",
                    currentPage <= 1 && "opacity-40 cursor-not-allowed"
                  )}
                >
                  «
                </button>
                <button
                  onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded text-lg font-medium transition-colors",
                    "bg-second-white text-main-dark hover:bg-light-black/10 disabled:hover:bg-second-white",
                    currentPage <= 1 && "opacity-40 cursor-not-allowed"
                  )}
                >
                  ‹
                </button>
              </div>

              {/* Indicador de página atual */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-sora text-second-dark">
                  Página {currentPage} de {totalPages}
                </span>
              </div>

              {/* Botões de navegação posterior */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => currentPage < totalPages && onPageChange?.(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded text-lg font-medium transition-colors",
                    "bg-second-white text-main-dark hover:bg-light-black/10 disabled:hover:bg-second-white",
                    currentPage >= totalPages && "opacity-40 cursor-not-allowed"
                  )}
                >
                  ›
                </button>
                <button
                  onClick={() => currentPage < totalPages && onPageChange?.(totalPages)}
                  disabled={currentPage >= totalPages}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded text-lg font-medium transition-colors",
                    "bg-second-white text-main-dark hover:bg-light-black/10 disabled:hover:bg-second-white",
                    currentPage >= totalPages && "opacity-40 cursor-not-allowed"
                  )}
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div 
        ref={ref}
        className={cn("flex flex-col h-full bg-main-white rounded-md shadow-lg border border-second-white", className)}
        {...props}
      >
        {/* Cabeçalho da galeria - responsivo */}
        <div className="flex-shrink-0 border-b border-light-black/20">
          {/* Desktop: Layout original em uma linha */}
          <div ref={headerRef} className="hidden md:flex items-center justify-between px-4 py-4 h-16">
            {/* Lado esquerdo */}
            <div ref={leftSideRef} className="flex items-center gap-2">
              {/* Seletor de colunas */}
              {showColumnSelector && (
                <ColumnSelector
                  columns={columns}
                  visibleColumns={visibleColumns}
                  onColumnsChange={handleVisibleColumnsChange}
                />
              )}

              {/* Busca */}
              {showSearch && (
                <div ref={searchRef} className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-second-black/60" />
                  <FormInput
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="pl-10"
                    style={{ width: `${searchWidth}px` }}
                  />
                </div>
              )}
            </div>

            {/* Lado direito */}
            <div ref={rightSideRef} className="flex items-center gap-2">
              {/* Botão Exportar/Adicionar */}
              {showExportButton && (
                <GhostButtonWithIconLeft 
                  onClick={onExport}
                  icon={exportButtonIcon}
                >
                  {exportButtonText}
                </GhostButtonWithIconLeft>
              )}

              {/* Botão Atualizar */}
              {showRefreshButton && (
                <GhostButtonNaturalCursor 
                  onClick={handleRefresh}
                  disabled={loading || isRefreshing}
                  icon={<ReloadIcon size={20} className={(loading || isRefreshing) ? "animate-spin" : ""} />}
                />
              )}
            </div>
          </div>

          {/* Mobile: Layout em uma linha única */}
          <div className="md:hidden">
            <div className="flex items-center gap-2 px-4 py-3 min-h-[52px]">
              {/* Seletor de colunas */}
              {showColumnSelector && (
                <ColumnSelector
                  columns={columns}
                  visibleColumns={visibleColumns}
                  onColumnsChange={handleVisibleColumnsChange}
                />
              )}

              {/* Busca - ocupa todo o espaço disponível */}
              {showSearch && (
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-second-black/60" />
                  <FormInput
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              )}

              {/* Botões de ação */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Botão Exportar/Adicionar */}
                {showExportButton && (
                  <GhostButtonWithIcon 
                    onClick={onExport}
                    icon={exportButtonIcon}
                  />
                )}

                {/* Botão Atualizar */}
                {showRefreshButton && (
                  <GhostButtonNaturalCursor 
                    onClick={handleRefresh}
                    disabled={loading || isRefreshing}
                    icon={<ReloadIcon size={20} className={(loading || isRefreshing) ? "animate-spin" : ""} />}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Área da tabela unificada - com scroll sincronizado */}
        <div className="flex-1 h-full overflow-auto bg-main-white rounded-md">
          <Table className="min-w-max">
            {/* Cabeçalho fixo */}
            <TableHeader className="sticky top-0 z-30">
              <TableRow className="group h-11 border-b border-light-black/20 bg-light-black hover:bg-light-white transition-colors">
                {/* Coluna do indicador de status */}
                {showStatusIndicator && (
                  <TableHead className="sticky left-0 w-2 p-0 bg-light-black group-hover:bg-light-white transition-colors z-20"></TableHead>
                )}
                
                {/* Colunas visíveis */}
                {columns
                  .filter(column => visibleColumns.includes(column.key))
                  .map(column => (
                    <TableHead 
                      key={column.key}
                      className="px-4 py-1.5 font-sora font-semibold text-sm text-second-dark whitespace-nowrap"
                      style={{ 
                        width: column.width,
                        minWidth: column.width || '120px'
                      }}
                    >
                      <div 
                        className={cn(
                          "flex items-center gap-2",
                          column.sortable && "cursor-pointer"
                        )}
                        onClick={column.sortable ? () => handleSort(column.key) : undefined}
                      >
                        <span>{column.title}</span>
                        {column.sortable && (
                          <div>
                            {getSortIcon(column.key)}
                          </div>
                        )}
                      </div>
                    </TableHead>
                  ))}

                {/* Coluna de ações - sempre visível */}
                {(actions.length > 0 || getActionsForItem) && (
                  <TableHead className="sticky right-0 w-32 px-4 py-1.5 font-sora font-semibold text-sm text-second-dark bg-light-black group-hover:bg-light-white shadow-lg z-20 transition-colors">
                    Ações
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            {/* Corpo da tabela */}
            <TableBody className="border-b-2 border-light-black/35">
              {data.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length + (showStatusIndicator ? 1 : 0) + ((actions.length > 0 || getActionsForItem) ? 1 : 0)}
                    className="text-center py-12 text-second-dark/60 font-sora text-sm"
                  >
                    Nenhum dado correspondente foi encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                <TableRow 
                  key={index} 
                  className="group h-14 min-h-[56px] max-h-[56px] border-b-2 border-light-black/35 hover:bg-light-white transition-colors"
                >
                  {/* Indicador de status */}
                  {showStatusIndicator && (
                    <TableCell className="sticky left-0 w-2 p-0 bg-main-white group-hover:bg-light-white z-10 transition-colors">
                      <div 
                        className="w-1 h-14 rounded-r"
                        style={{ backgroundColor: getStatusColor?.(row) || '#e5e7eb' }}
                      />
                    </TableCell>
                  )}

                  {/* Células de dados */}
                  {columns
                    .filter(column => visibleColumns.includes(column.key))
                    .map(column => (
                      <TableCell 
                        key={column.key}
                        className="px-4 py-4 font-sora text-sm text-second-dark whitespace-nowrap"
                        style={{ 
                          minWidth: column.width || '120px'
                        }}
                      >
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </TableCell>
                    ))}

                   {/* Ações - sempre visível */}
                  {(actions.length > 0 || getActionsForItem) && (
                    <TableCell className="sticky right-0 px-4 py-4 bg-main-white group-hover:bg-light-white shadow-lg z-10 transition-colors">
                         <div className="flex items-center justify-center gap-1">
                           {(getActionsForItem ? getActionsForItem(row) : actions).map((action, actionIndex) => (
                             <Tooltip key={actionIndex}>
                               <TooltipTrigger asChild>
                                  <GhostButtonWithIcon
                                    onClick={() => action.onClick(row)}
                                    icon={action.icon}
                                    className="h-7 w-7"
                                    withBorder={false}
                                  />
                               </TooltipTrigger>
                               <TooltipContent>
                                 <p>{action.tooltip || action.label}</p>
                               </TooltipContent>
                             </Tooltip>
                           ))}
                         </div>
                    </TableCell>
                   )}
                 </TableRow>
               ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Rodapé com paginação - sempre visível na base */}
        <div className="flex-shrink-0">
          {renderPagination()}
        </div>
      </div>
    );
  }
);

DataGallery.displayName = "DataGallery";

export { DataGallery };