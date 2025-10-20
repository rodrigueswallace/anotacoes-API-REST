import React, { useState, useEffect } from 'react'
import { DataGallery, DataGalleryColumn, DataGalleryAction } from '../ui/data-gallery'
import { Badge } from '../ui/badge'
import { Checkbox } from '../ui/checkbox'
import { Eye, Download, Paperclip } from 'lucide-react'
import { ErrorBoundary } from '../ErrorBoundary'

export interface TombamentoItem {
  id: string
  patrimonio: string
  numeroTombo: string
  destino: string
  statusEtiqueta: 'Pendente' | 'Gerada' | 'Anexada'
  selecionado: boolean
}

interface TabelaTombamentoProps {
  className?: string
}

export function TabelaTombamento({ className }: TabelaTombamentoProps) {
  const [dados, setDados] = useState<TombamentoItem[]>([
    {
      id: '1',
      patrimonio: 'Computador Dell I5',
      numeroTombo: '254815545464544',
      destino: 'SEFAS',
      statusEtiqueta: 'Pendente',
      selecionado: false
    },
    {
      id: '2', 
      patrimonio: 'Notebook HP Ryzen 5',
      numeroTombo: '254815545464545',
      destino: 'EAD',
      statusEtiqueta: 'Gerada',
      selecionado: false
    },
    {
      id: '3',
      patrimonio: 'Monitor Samsung 24"',
      numeroTombo: '254815545464546', 
      destino: 'SEFAS',
      statusEtiqueta: 'Anexada',
      selecionado: false
    }
  ])

  const [todosSelecionados, setTodosSelecionados] = useState(false)

  useEffect(() => {
    console.log('TabelaTombamento: mounted', { total: dados.length })
  }, [])

  const handleSelecionarTodos = (checked: boolean) => {
    setTodosSelecionados(checked)
    setDados(prev => prev.map(item => ({ ...item, selecionado: checked })))
  }

  const handleSelecionarItem = (id: string, checked: boolean) => {
    setDados(prev => {
      const novoDados = prev.map(item => 
        item.id === id ? { ...item, selecionado: checked } : item
      )
      
      // Atualizar estado "todos selecionados"
      const todosSelecionadosAgora = novoDados.every(item => item.selecionado)
      setTodosSelecionados(todosSelecionadosAgora)
      
      return novoDados
    })
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Pendente':
        return <Badge variant="warning">{status}</Badge>
      case 'Gerada':
        return <Badge variant="info">{status}</Badge>
      case 'Anexada':
        return <Badge variant="success">{status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const colunas: DataGalleryColumn[] = [
    {
      key: 'checkbox',
      title: '',
      sortable: false,
      width: '48px',
      render: (_value, row: TombamentoItem) => (
        <Checkbox
          checked={row.selecionado}
          onCheckedChange={(checked) => handleSelecionarItem(row.id, Boolean(checked))}
          aria-label={`Selecionar ${row.patrimonio}`}
        />
      )
    },
    {
      key: 'patrimonio',
      title: 'Patrimônio',
      sortable: true,
      render: (value: string) => (
        <span className="text-second-dark font-medium">{value}</span>
      )
    },
    {
      key: 'numeroTombo',
      title: 'Número do tombo',
      sortable: true,
      render: (value: string) => (
        <span className="text-second-black font-mono text-sm">{value}</span>
      )
    },
    {
      key: 'destino',
      title: 'Destino',
      sortable: true,
      render: (value: string) => (
        <span className="text-second-dark">{value}</span>
      )
    },
    {
      key: 'statusEtiqueta',
      title: 'Status etiquetas',
      sortable: true,
      render: (_value, row: TombamentoItem) => renderStatusBadge(row.statusEtiqueta)
    }
  ]

  const acoes: DataGalleryAction[] = [
    {
      icon: <Eye className="h-4 w-4" />,
      label: 'Visualizar',
      onClick: (item) => console.log('Visualizar:', item.patrimonio)
    },
    {
      icon: <Download className="h-4 w-4" />,
      label: 'Download',
      onClick: (item) => console.log('Download:', item.patrimonio)
    },
    {
      icon: <Paperclip className="h-4 w-4" />,
      label: 'Anexo',
      onClick: (item) => console.log('Anexo:', item.patrimonio)
    }
  ]

  return (
    <ErrorBoundary componentName="TabelaTombamento">
      <div className={className}>
        <DataGallery
          data={dados}
          columns={colunas}
          actions={acoes}
          searchPlaceholder="Pesquisar patrimônios..."
          showColumnSelector={false}
          showExportButton={false}
          showRefreshButton={false}
        />
      </div>
    </ErrorBoundary>
  )
}