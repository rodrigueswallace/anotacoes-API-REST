import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AssetInfoCard, TimelineStep } from "@/components/ui/asset-info-card";
import { ActionMenu, defaultActions } from "@/components/ui/action-menu";
import { DynamicTabs } from "@/components/ui/dynamic-tabs";
import { UserActionHistory, UserAction } from "@/components/ui/user-action-history";
import { getHistoryIcon } from '@/lib/history-icons';
import { MobileActionFab } from "@/components/ui/mobile-action-fab";
import { Breadcrumb } from "@/components/ui/breadcrumb-navigation";
import { useFixedActionMenu } from "@/hooks/use-fixed-action-menu";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { Check, Clock, Package, Truck, Home, Trash2, FileText, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { patrimonioStorage, PatrimonioData } from "@/lib/patrimonio-storage";
import { Skeleton } from "@/components/ui/skeleton";
import { FormularioRecepcaoNFe } from "@/components/forms/FormularioRecepcaoNFe";
import { FormularioEntradaAlmoxarifado } from "@/components/forms/FormularioEntradaAlmoxarifado";
import { TabelaPatrimonios } from "@/components/tables/TabelaPatrimonios";
import { TabelaTombamento } from "@/components/tables/TabelaTombamento";
import { TabelaAnexos } from "@/components/tables/TabelaAnexos";
import { PrimaryButton } from "@/components/ui/primary-buttons";
import { DescartarModal } from "@/components/modals/DescartarModal";

const ViewRecepcaoItem = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { top, right, height, shouldCollapse, isVisible } = useFixedActionMenu();
  const { isCollapsed: sidebarCollapsed } = useSidebarToggle();
  
  // Estado para dados do patrimônio
  const [patrimonioData, setPatrimonioData] = useState<PatrimonioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Estado para controlar o colapso do Action Menu
  const [actionMenuCollapsed, setActionMenuCollapsed] = useState(false);
  
  // Estado para controlar o modal de descarte
  const [isDescartarModalOpen, setIsDescartarModalOpen] = useState(false);

  // Carregar dados do patrimônio
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    // Inicializar dados mock se necessário
    patrimonioStorage.initializeMockData();
    
    if (id) {
      console.log('Buscando patrimônio com ID:', id);
      const data = patrimonioStorage.getById(id);
      console.log('Dados encontrados:', data);
      
      if (data) {
        setPatrimonioData(data);
      } else {
        setHasError(true);
        console.error('Patrimônio não encontrado para ID:', id);
      }
    } else {
      setHasError(true);
      console.error('ID não fornecido na URL');
    }
    
    setIsLoading(false);
  }, [id]);
  
  // Breadcrumb navigation dinâmico baseado nos dados
  const getBreadcrumbLabel = () => {
    if (isLoading) return "Carregando...";
    if (hasError) return "Item não encontrado";
    if (!patrimonioData) return "Item";
    
    switch (patrimonioData.type) {
      case 'nfe':
        return `NF-e: ${patrimonioData.chaveNfe?.slice(-8) || 'N/A'}`;
      case 'xml':
        return `XML: ${patrimonioData.xmlFile?.name?.slice(0, 15) || 'Arquivo XML'}`;
      case 'tombo-direto':
        return `Tombo direto: ${patrimonioData.id.slice(-8)}`;
      default:
        return "Item";
    }
  };

  const breadcrumbPath = [
    { label: "Home", href: "/", icon: "home" },
    { label: "Recepção de Nota Fiscal", href: "/recepcao-nota-fiscal" },
    { label: getBreadcrumbLabel(), current: true }
  ];

  // Timeline steps dinâmicos baseados no tipo e status
  const getTimelineSteps = (): TimelineStep[] => {
    if (isLoading || hasError || !patrimonioData) return [];

    if (patrimonioData.type === 'nfe') {
      const steps = [
        { label: "NF cadastrada", icon: <Package className="w-5 h-5" />, isCompleted: true },
        { label: "Aguardando recebimento", icon: <Clock className="w-5 h-5" />, isCompleted: patrimonioData.status !== 'processando' },
        { label: "Recebimento confirmado", icon: <Check className="w-5 h-5" />, isCompleted: ["Tombo", "Etiquetagem", "Concluído"].includes(patrimonioData.status) },
        { label: "Processamento concluído", icon: <Check className="w-5 h-5" />, isCompleted: patrimonioData.status === "Concluído" }
      ];
      return steps;
    }
    
    // Timeline padrão para outros tipos
    const baseSteps: TimelineStep[] = [];

    switch (patrimonioData.type) {
      case 'xml':
        baseSteps.push({
          label: "XML processado",
          icon: <Package className="w-full h-full" />,
          isCompleted: true
        });
        break;
      case 'tombo-direto':
        baseSteps.push({
          label: "Tombo direto criado",
          icon: <Package className="w-full h-full" />,
          isCompleted: true
        });
        break;
    }

    // Adicionar próximo passo
    if (patrimonioData.type !== 'tombo-direto') {
      baseSteps.push({
        label: "Aguardando recebimento",
        icon: <Truck className="w-full h-full" />,
        isCompleted: false
      });
    } else {
      baseSteps.push({
        label: "Aguardando tombamento",
        icon: <Clock className="w-full h-full" />,
        isCompleted: false
      });
    }

    return baseSteps;
  };

  const timelineSteps = getTimelineSteps();

  // Ações do menu de acordo com a imagem fornecida
  const actions = [
    {
      id: "confirmar-recebimento",
      label: "Confirmar Recebimento",
      icon: <Check className="w-4 h-4" />,
      type: "success" as const,
      onClick: () => console.log("Confirmar Recebimento")
    },
    {
      id: "descartar",
      label: "Descartar",
      icon: <Trash2 className="w-4 h-4" />,
      type: "warning" as const,
      onClick: () => setIsDescartarModalOpen(true)
    },
    {
      id: "termo-definitivo",
      label: "Termo Definitivo",
      icon: <FileText className="w-4 h-4" />,
      type: "info" as const,
      onClick: () => console.log("Termo Definitivo")
    },
    {
      id: "termo-provisorio",
      label: "Termo Provisório",
      icon: <FileCheck className="w-4 h-4" />,
      type: "info-dark" as const,
      onClick: () => console.log("Termo Provisório")
    }
  ];

  // Função para voltar
  const handleBack = () => {
    navigate("/recepcao-nota-fiscal");
  };

  // Função para alternar o colapso do menu
  const handleToggleActionMenu = () => {
    setActionMenuCollapsed(!actionMenuCollapsed);
  };

  // Função para confirmar descarte
  const handleConfirmDescarte = (justificativa: string) => {
    console.log('Descartando cadastro com justificativa:', justificativa);
    // Aqui você implementaria a lógica de descarte
  };

  // Dados mock para o histórico de ações
  const mockHistoryActions: UserAction[] = [
    {
      id: '1',
      user: {
        name: 'Ana Silva',
        avatar: '',
        initials: 'AS'
      },
      timestamp: '28/07/2024 - 14:30h',
      action: {
        icon: getHistoryIcon('anexo'),
        title: 'Anexou documentos',
        description: 'Adicionou 3 documentos relacionados à entrada de materiais de escritório.',
        files: [
          'Nota_Fiscal_001.pdf',
          'Certificado_Qualidade.pdf',
          'Especificacao_Tecnica.docx'
        ]
      }
    },
    {
      id: '2',
      user: {
        name: 'Carlos Santos',
        avatar: '',
        initials: 'CS'
      },
      timestamp: '28/07/2024 - 11:15h',
      action: {
        icon: getHistoryIcon('avaliacao'),
        title: 'Aprovação concluída',
        description: 'Avaliou e aprovou a entrada de 150 unidades de papel A4 e materiais de escritório conforme especificações técnicas.'
      }
    },
    {
      id: '3',
      user: {
        name: 'Marina Costa',
        avatar: '',
        initials: 'MC'
      },
      timestamp: '27/07/2024 - 16:45h',
      action: {
        icon: getHistoryIcon('edicao'),
        title: 'Editou informações',
        description: 'Atualizou a quantidade de itens de 100 para 150 unidades após conferência física no almoxarifado.'
      }
    },
    {
      id: '4',
      user: {
        name: 'Roberto Lima',
        avatar: '',
        initials: 'RL'
      },
      timestamp: '27/07/2024 - 09:20h',
      action: {
        icon: getHistoryIcon('risco'),
        title: 'Identificou risco',
        description: 'Reportou possível incompatibilidade nas especificações do papel com os requisitos do setor de impressão.',
        files: ['Relatorio_Incompatibilidade.pdf']
      }
    },
    {
      id: '5',
      user: {
        name: 'Julia Oliveira',
        avatar: '',
        initials: 'JO'
      },
      timestamp: '26/07/2024 - 13:10h',
      action: {
        icon: getHistoryIcon('comentario'),
        title: 'Adicionou comentário',
        description: 'Solicitou verificação adicional das condições de armazenamento para materiais sensíveis à umidade.'
      }
    }
  ];

  const renderNfeContent = () => (
    <FormularioRecepcaoNFe 
      patrimonioData={patrimonioData!}
    />
  );

  // Abas dinâmicas baseadas nos dados
  const tabItems = [
    {
      id: "nf-e",
      label: patrimonioData?.type === 'xml' ? 'XML' : 'NF-e',
      icon: Package,
      content: renderNfeContent()
    },
    {
      id: "entrada",
      label: "Entrada",
      icon: Truck,
      content: (
        <FormularioEntradaAlmoxarifado 
          patrimonioData={patrimonioData}
          onDataChange={(data) => {
            console.log('Dados de entrada atualizados:', data);
          }}
        />
      )
    },
    {
      id: "patrimonios",
      label: "Patrimônios",
      icon: Package,
      content: (
        <TabelaPatrimonios 
          patrimonioId={patrimonioData?.id || ''}
          className="h-full"
        />
      )
    },
    {
      id: "tombamento-etiquetas",
      label: "Tombamento / Etiquetas",
      icon: Check,
      content: (
        <div className="flex flex-col gap-4">
          <TabelaTombamento />
          <div className="flex justify-end">
            <PrimaryButton 
              onClick={() => console.log('Definir destino')}
              className="shadow-lg"
            >
              Definir destino
            </PrimaryButton>
          </div>
        </div>
      )
    },
    {
      id: "anexos",
      label: "Anexos",
      icon: Package,
      content: (
        <TabelaAnexos />
      )
    },
    {
      id: "historico",
      label: "Histórico",
      icon: Clock,
      content: (
        <div>
          <UserActionHistory actions={mockHistoryActions} />
        </div>
      )
    }
  ];

  // Calcular a largura do menu baseado no estado de colapso
  const menuWidth = (shouldCollapse || actionMenuCollapsed) ? 76 : 240; // 76px = collapsed width + padding
  
  // Se ainda está carregando, mostrar skeleton
  if (isLoading) {
    return (
      <>
        <div className="py-2">
          <Breadcrumb path={breadcrumbPath} onBack={handleBack} />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </>
    );
  }

  // Se houve erro, mostrar mensagem
  if (hasError) {
    return (
      <>
        <div className="py-2">
          <Breadcrumb path={breadcrumbPath} onBack={handleBack} />
        </div>
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm border">
          <p className="text-lg font-medium text-second-dark mb-2">Item não encontrado</p>
          <p className="text-second-black mb-4">O item solicitado não foi encontrado ou não existe.</p>
          <Button onClick={handleBack} variant="outline">
            Voltar para Recepção de Nota Fiscal
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="py-2">
        <Breadcrumb path={breadcrumbPath} onBack={handleBack} />
      </div>

      {/* Conteúdo principal */}
      <div className="">
        {/* Coluna principal - AssetInfoCard + Abas Dinâmicas */}
        <div className={`flex flex-col gap-6 h-[calc(100vh-136px)] ${isVisible ? (shouldCollapse || actionMenuCollapsed ? 'pr-[100px]' : 'pr-[264px]') : ''}`}>
          {/* AssetInfoCard */}
          <AssetInfoCard
            type={patrimonioData?.type || 'tombo-direto'}
            documentNumber={
              patrimonioData?.type === 'nfe' && patrimonioData.chaveNfe 
                ? patrimonioData.chaveNfe.slice(-9) // Últimos 9 dígitos para número da NF-e
                : patrimonioData?.numeroDocumento || patrimonioData?.id.slice(-8) || 'N/A'
            }
            entryDate={patrimonioData?.createdAt ? new Date(patrimonioData.createdAt).toLocaleDateString('pt-BR') : patrimonioData?.dataProcessamento || new Date().toLocaleDateString('pt-BR')}
            statusOrDestination={patrimonioData?.type === 'tombo-direto' ? 'Aguardando tombamento' : 'Aguardando recebimento'}
            almoxarifadoDestino={patrimonioData?.almoxarifado}
            timelineSteps={timelineSteps}
          />

          {/* Componente de Abas Dinâmicas */}
          <div className="flex-1">
            <DynamicTabs
              items={tabItems}
              defaultValue="nf-e"
              maxVisibleTabs={4}
              dependencies={[sidebarCollapsed, shouldCollapse, actionMenuCollapsed]}
              maxContentHeight="calc(100vh - 400px)"
            />
          </div>
        </div>
      </div>

      {/* Menu de Ações Fixo */}
      {isVisible && (
        <div 
          className="fixed z-30 transition-all duration-300 ease-in-out"
          style={{
            top: `${top}px`,
            right: `${right}px`,
            height,
            width: `${menuWidth}px`
          }}
        >
          <ActionMenu
            actions={actions}
            collapsed={shouldCollapse || actionMenuCollapsed}
            onBack={handleBack}
            onToggleCollapse={handleToggleActionMenu}
            className="h-full shadow-lg"
            isFixed={true}
          />
        </div>
      )}

      {/* FAB Mobile - aparece apenas quando o menu fixo não está visível */}
      {!isVisible && (
        <MobileActionFab actions={actions} />
      )}

      {/* Modal de Descarte */}
      <DescartarModal
        open={isDescartarModalOpen}
        onOpenChange={setIsDescartarModalOpen}
        onConfirm={handleConfirmDescarte}
      />
    </>
  );
};

export default ViewRecepcaoItem;
