import React, { useState, useEffect } from 'react'
import { DataGallery, DataGalleryColumn, DataGalleryAction } from '../ui/data-gallery'
import { Eye } from 'lucide-react'
import { ErrorBoundary } from '../ErrorBoundary'

export interface AnexoItem {
  id: string
  etapa: string
  nome: string
  comentario: string
  dataCriacao: string
}

interface TabelaAnexosProps {
  className?: string
}

export const TabelaAnexos: React.FC<TabelaAnexosProps> = ({ className = '' }) => {
  const [dados] = useState<AnexoItem[]>([
    {
      id: '1',
      etapa: 'Recepção NF-e',
      nome: 'Nota_Fiscal_001.pdf',
      comentario: 'Documento fiscal principal da entrada',
      dataCriacao: '28/07/2024'
    },
    {
      id: '2',
      etapa: 'Conferência',
      nome: 'Certificado_Qualidade.pdf',
      comentario: 'Certificado de qualidade dos materiais recebidos',
      dataCriacao: '28/07/2024'
    },
    {
      id: '3',
      etapa: 'Entrada Almoxarifado',
      nome: 'Especificacao_Tecnica.docx',
      comentario: 'Especificações técnicas detalhadas dos itens',
      dataCriacao: '27/07/2024'
    },
    {
      id: '4',
      etapa: 'Avaliação',
      nome: 'Relatorio_Incompatibilidade.pdf',
      comentario: 'Relatório de análise de compatibilidade',
      dataCriacao: '27/07/2024'
    },
    {
      id: '5',
      etapa: 'Aprovação',
      nome: 'Termo_Aprovacao.pdf',
      comentario: 'Documento de aprovação final do processo',
      dataCriacao: '26/07/2024'
    }
  ])

  useEffect(() => {
    console.log('TabelaAnexos: mounted', { total: dados.length })
  }, [])

  const colunas: DataGalleryColumn[] = [
    {
      key: 'etapa',
      title: 'Etapa',
      width: '200px',
      render: (_value, row: AnexoItem) => (
        <span className="text-second-dark font-medium">
          {row.etapa}
        </span>
      )
    },
    {
      key: 'nome',
      title: 'Nome',
      width: '250px',
      render: (_value, row: AnexoItem) => (
        <span className="text-second-black">
          {row.nome}
        </span>
      )
    },
    {
      key: 'comentario',
      title: 'Comentário',
      width: '300px',
      render: (_value, row: AnexoItem) => (
        <span className="text-second-black text-sm">
          {row.comentario}
        </span>
      )
    },
    {
      key: 'dataCriacao',
      title: 'Data de Criação',
      width: '150px',
      render: (_value, row: AnexoItem) => (
        <span className="text-second-black">
          {row.dataCriacao}
        </span>
      )
    }
  ]

  const acoes: DataGalleryAction[] = [
    {
      label: 'Visualizar',
      icon: <Eye className="w-4 h-4" />,
      variant: 'ghost' as const,
      onClick: (item) => {
        console.log('Visualizar anexo:', item.nome)
      }
    }
  ]

  return (
    <ErrorBoundary componentName="TabelaAnexos">
      <div className={`${className} relative`}>
        <DataGallery
          data={dados}
          columns={colunas}
          actions={acoes}
          searchPlaceholder="Pesquisar anexos..."
          showColumnSelector={false}
          showExportButton={false}
          showRefreshButton={false}
        />
      </div>
    </ErrorBoundary>
  )
}