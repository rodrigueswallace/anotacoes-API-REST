import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton, PrimaryButtonWithIconRight, PrimaryButtonWithIconLeft, PrimaryButtonWithIcon, PrimaryGhostButton, GhostButtonWithIconRight, GhostButtonWithIconLeft, GhostButtonWithIcon } from '@/components/ui/primary-buttons';
import { HeritageIcon } from '@/components/ui/heritage-icon';
import { DefaultIcon } from '@/components/ui/icon';
import { FormDemo } from '@/components/forms/FormDemo';
import { Modal } from '@/components/ui/modal';
import { FormInput } from '@/components/ui/form-input';
import { FormTextarea } from '@/components/ui/form-textarea';
import { FormLabel } from '@/components/ui/form-label';
import { FormSelect, FormSelectContent, FormSelectItem, FormSelectTrigger, FormSelectValue } from '@/components/ui/form-select';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { PhoneInput } from '@/components/ui/phone-input';
import { CpfCnpjInput } from '@/components/ui/cpf-cnpj-input';
import { CpfInput } from '@/components/ui/cpf-input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { ConfirmationModal, LoadingModal, SuccessModal } from '@/components/ui/headerless-modals';
import { DataGallery } from '@/components/ui/data-gallery';
import { Badge } from '@/components/ui/badge';
import { DynamicTabs } from '@/components/ui/dynamic-tabs';
import { UserActionHistory, UserAction } from '@/components/ui/user-action-history';
import { getHistoryIcon } from '@/lib/history-icons';
import { ActionMenu, defaultActions } from '@/components/ui/action-menu';
import { FilterMenu, defaultFilterItems, defaultTagGroups } from '@/components/ui/filter-menu';
import { TabbedModuleCards } from '@/components/ui/tabbed-module-cards';
import { ModuleCard } from '@/components/ui/module-card';
import { AssetInfoCard } from '@/components/ui/asset-info-card';
import { Eye, Edit, Star, FileText, Package, Paperclip, History, Tag, Receipt, Check, X, Trash2, Menu, Plus, Home, Settings, HelpCircle, BarChart3, ShoppingCart, Wrench, Users, Globe, Shield, CheckCircle, AlertTriangle, Box } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb-navigation';
const Index = () => {
  const navigate = useNavigate();
  
  // Breadcrumb demo data
  const breadcrumbPath = [
    { label: "Home", href: "/", icon: "home" as const },
    { label: "Smart Assistance", href: "/?tab=smart-assistance" },
    { label: "Design System", current: true }
  ];

  // Função para voltar
  const handleBack = () => {
    navigate("/?tab=smart-assistance");
  };
  // Estados para controlar os modais
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  
  // Estados para os novos modais sem cabeçalho
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [loadingModalOpen, setLoadingModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  
  // Estados para os modais de diferentes tamanhos
  const [cadastroSimplesModalOpen, setCadastroSimplesModalOpen] = useState(false);
  const [cadastroComumModalOpen, setCadastroComumModalOpen] = useState(false);
  const [cadastroAvancadoModalOpen, setCadastroAvancadoModalOpen] = useState(false);
  
  // Estados para o Action Menu
  const [actionMenuCollapsed, setActionMenuCollapsed] = useState(false);
  const [filterMenuCollapsed, setFilterMenuCollapsed] = useState(false);
  
  // Estados para aplicação
  const [notificationCount] = useState(4);
  
  // Estados para os formulários
  const [comment, setComment] = useState('');
  const [planType, setPlanType] = useState('');
  const [priority, setPriority] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  
  // Estados para o formulário maior (duas colunas)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    description: '',
    category: '',
    urgency: '',
    requestDate: undefined as Date | undefined,
    deadline: undefined as Date | undefined
  });

  // Estados para a galeria de dados
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Estados para filtros
  const [activeFilters, setActiveFilters] = useState<string[]>(['todos']);
  const [activePriorityFilters, setActivePriorityFilters] = useState<string[]>([]);

  // Dados para o TabbedModuleCards
  const tabbedModuleData = [
    {
      id: 'gestao-bens',
      label: 'Gestão de bens móveis',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.50626 15.2647C7.61657 15.6639 8.02965 15.8982 8.4289 15.7879C8.82816 15.6776 9.06241 15.2645 8.9521 14.8652L8.22918 15.0649L7.50626 15.2647ZM6.07692 7.27442L6.79984 7.0747L6.79984 7.0747L6.07692 7.27442ZM4.7037 5.91995L4.50319 6.64265L4.50319 6.64265L4.7037 5.91995ZM3.20051 4.72457C2.80138 4.61383 2.38804 4.84762 2.2773 5.24675C2.16656 5.64589 2.40035 6.05923 2.79949 6.16997L3 5.44727L3.20051 4.72457ZM20.1886 15.7254C20.5895 15.6213 20.8301 15.2118 20.7259 14.8109C20.6217 14.41 20.2123 14.1695 19.8114 14.2737L20 14.9996L20.1886 15.7254ZM10.9207 17.3591L10.1978 17.5588C10.5074 18.6795 9.82778 19.8618 8.62389 20.1747L8.81253 20.9006L9.00118 21.6265C10.9782 21.1127 12.1863 19.1239 11.6436 17.1594L10.9207 17.3591ZM8.81253 20.9006L8.62389 20.1747C7.41216 20.4896 6.19622 19.7863 5.88401 18.6562L5.16109 18.8559L4.43817 19.0556C4.97829 21.0107 7.03196 22.1383 9.00118 21.6265L8.81253 20.9006ZM5.16109 18.8559L5.88401 18.6562C5.57441 17.5355 6.254 16.3532 7.4579 16.0403L7.26925 15.3144L7.08061 14.5885C5.10356 15.1023 3.89544 17.0911 4.43817 19.0556L5.16109 18.8559ZM7.26925 15.3144L7.4579 16.0403C8.66962 15.7254 9.88556 16.4287 10.1978 17.5588L10.9207 17.3591L11.6436 17.1594C11.1035 15.2043 9.04982 14.0768 7.08061 14.5885L7.26925 15.3144ZM8.22918 15.0649L8.9521 14.8652L6.79984 7.0747L6.07692 7.27442L5.354 7.47414L7.50626 15.2647L8.22918 15.0649ZM4.7037 5.91995L4.90421 5.19725L3.20051 4.72457L3 5.44727L2.79949 6.16997L4.50319 6.64265L4.7037 5.91995ZM6.07692 7.27442L6.79984 7.0747C6.54671 6.15847 5.8211 5.45164 4.90421 5.19725L4.7037 5.91995L4.50319 6.64265C4.92878 6.76073 5.24573 7.08223 5.354 7.47414L6.07692 7.27442ZM10.9207 17.3591L11.1093 18.085L20.1886 15.7254L20 14.9996L19.8114 14.2737L10.732 16.6332L10.9207 17.3591Z" fill="currentColor"/>
          <path opacity="0.5" d="M9.56541 8.73049C9.0804 6.97492 8.8379 6.09714 9.24954 5.40562C9.66119 4.71409 10.5662 4.47889 12.3763 4.00849L14.2962 3.50955C16.1062 3.03915 17.0113 2.80394 17.7242 3.20319C18.4372 3.60244 18.6797 4.48023 19.1647 6.2358L19.6792 8.09786C20.1642 9.85343 20.4067 10.7312 19.995 11.4227C19.5834 12.1143 18.6784 12.3495 16.8683 12.8199L14.9484 13.3188C13.1384 13.7892 12.2333 14.0244 11.5203 13.6252C10.8073 13.2259 10.5648 12.3481 10.0798 10.5926L9.56541 8.73049Z" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      ),
      cards: [
        {
          id: 'recepcao-nota-fiscal',
          title: 'Recepção da nota fiscal',
          icon: (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M22.4766 5.59776C21.2485 5.76006 19.732 6.10839 17.5748 6.60622L15.1184 7.17307C13.2964 7.59354 12.0416 7.88503 11.0832 8.21396C10.158 8.53151 9.63454 8.84457 9.23955 9.23955C8.84457 9.63454 8.53151 10.158 8.21396 11.0832C7.88503 12.0416 7.59354 13.2964 7.17307 15.1184L6.60622 17.5748C6.10839 19.732 5.76006 21.2485 5.59776 22.4766C5.43965 23.673 5.4761 24.4825 5.68716 25.2184C5.89821 25.9543 6.29633 26.6601 7.06451 27.5909C7.85303 28.5463 8.95214 29.6476 10.5176 31.2131L14.1769 34.8724C16.8959 37.5914 18.8307 39.5216 20.494 40.7907C22.1228 42.0334 23.3138 42.5 24.5246 42.5C25.7355 42.5 26.9265 42.0334 28.5553 40.7907C30.2186 39.5216 32.1534 37.5914 34.8724 34.8724C37.5914 32.1534 39.5216 30.2186 40.7907 28.5553C42.0334 26.9265 42.5 25.7355 42.5 24.5246C42.5 23.3138 42.0334 22.1228 40.7907 20.494C39.5216 18.8307 37.5914 16.8959 34.8724 14.1769L31.2131 10.5176C29.6476 8.95214 28.5463 7.85303 27.5909 7.06451C26.6601 6.29633 25.9543 5.89821 25.2184 5.68716C24.4825 5.4761 23.673 5.43965 22.4766 5.59776ZM22.0836 2.62362C23.5182 2.43403 24.7762 2.43938 26.0455 2.80341C27.3148 3.16744 28.3844 3.82963 29.5005 4.75076C30.5794 5.6412 31.7809 6.84277 33.282 8.34386L37.0736 12.1355C39.6949 14.7567 41.7702 16.832 43.1758 18.6743C44.6221 20.5699 45.5 22.3941 45.5 24.5246C45.5 26.6552 44.6221 28.4794 43.1758 30.375C41.7702 32.2173 39.6948 34.2926 37.0736 36.9138L36.9138 37.0736C34.2926 39.6948 32.2173 41.7702 30.375 43.1758C28.4794 44.6221 26.6552 45.5 24.5246 45.5C22.3941 45.5 20.5699 44.6221 18.6743 43.1758C16.832 41.7701 14.7567 39.6948 12.1354 37.0735L8.34391 33.282C6.84279 31.7809 5.64121 30.5794 4.75076 29.5005C3.82963 28.3844 3.16744 27.3148 2.80341 26.0455C2.43938 24.7762 2.43403 23.5182 2.62362 22.0836C2.8069 20.6967 3.18901 19.0409 3.66638 16.9724L4.26771 14.3667C4.66604 12.6405 4.99086 11.2328 5.37643 10.1094C5.7791 8.93612 6.28626 7.9502 7.11823 7.11823C7.9502 6.28627 8.93612 5.7791 10.1094 5.37643C11.2328 4.99086 12.6405 4.66604 14.3667 4.2677L16.9724 3.66638C19.0409 3.18901 20.6967 2.8069 22.0836 2.62362ZM18.9818 15.9904C18.0055 15.0141 16.4226 15.0141 15.4463 15.9904C14.47 16.9667 14.47 18.5497 15.4463 19.526C16.4226 20.5023 18.0055 20.5023 18.9818 19.526C19.9581 18.5497 19.9581 16.9667 18.9818 15.9904ZM13.325 13.8691C15.4729 11.7212 18.9553 11.7212 21.1032 13.8691C23.251 16.017 23.251 19.4994 21.1032 21.6473C18.9553 23.7952 15.4729 23.7952 13.325 21.6473C11.1771 19.4994 11.1771 16.017 13.325 13.8691ZM25.9858 24.2139C25.632 24.2106 25.167 24.3694 24.7682 24.7682C23.9931 25.5432 24.1969 26.3183 24.4146 26.5359C24.6323 26.7536 25.4073 26.9574 26.1824 26.1824C27.7504 24.6143 30.4578 24.0939 32.1928 25.8288C33.5387 27.1748 33.5273 29.1059 32.7224 30.6364C33.1246 31.2207 33.066 32.0267 32.5463 32.5463C32.0285 33.0642 31.2262 33.1242 30.6424 32.7265C29.7286 33.2121 28.6891 33.3941 27.698 33.1905C26.8865 33.0237 26.3639 32.2307 26.5306 31.4192C26.6974 30.6078 27.4904 30.0851 28.3019 30.2519C28.6562 30.3247 29.2274 30.2084 29.7179 29.7179C30.493 28.9428 30.2891 28.1678 30.0715 27.9501C29.8538 27.7325 29.0788 27.5286 28.3037 28.3037C26.7356 29.8718 24.0282 30.3922 22.2933 28.6572C20.9474 27.3113 20.9588 25.3802 21.7637 23.8497C21.3614 23.2654 21.4201 22.4594 21.9397 21.9397C22.4575 21.422 23.2595 21.3619 23.8433 21.7593C24.523 21.3981 25.2699 21.207 26.0141 21.214C26.8425 21.2219 27.5077 21.8997 27.4999 22.7281C27.4921 23.5565 26.8142 24.2217 25.9858 24.2139Z" fill="white"/>
            </svg>
          ),
          href: '/recepcao-nota-fiscal'
        },
        {
          id: 'patrimonio-movel',
          title: 'Patrimônio móvel',
          icon: <Package size={48} color="white" />,
          href: '/patrimonio-movel'
        },
        {
          id: 'inventario',
          title: 'Inventário',
          icon: <BarChart3 size={48} color="white" />,
          href: '/inventario'
        },
        {
          id: 'relatorios',
          title: 'Relatórios',
          icon: <FileText size={48} color="white" />,
          href: '/relatorios'
        },
        {
          id: 'ecommerce',
          title: 'E-commerce',
          icon: <ShoppingCart size={48} color="white" />,
          href: '/ecommerce'
        },
        {
          id: 'configuracoes',
          title: 'Configurações',
          icon: <Settings size={48} color="white" />,
          href: '/configuracoes'
        }
      ]
    },
    {
      id: 'gestao-imoveis',
      label: 'Gestão de imóveis',
      icon: <Home size={24} />,
      cards: [
        {
          id: 'cadastro-imoveis',
          title: 'Cadastro de imóveis',
          icon: <Home size={48} color="white" />,
          href: '/cadastro-imoveis'
        },
        {
          id: 'manutencao',
          title: 'Manutenção',
          icon: <Wrench size={48} color="white" />,
          href: '/manutencao'
        },
        {
          id: 'contratos',
          title: 'Contratos',
          icon: <FileText size={48} color="white" />,
          href: '/contratos'
        }
      ]
    },
    {
      id: 'smart-assistance',
      label: 'Smart Assistance',
      icon: <HelpCircle size={24} />,
      cards: [
        {
          id: 'assistente-ia',
          title: 'Assistente IA',
          icon: <HelpCircle size={48} color="white" />,
          href: '/assistente-ia'
        },
        {
          id: 'automacao',
          title: 'Automação',
          icon: <Settings size={48} color="white" />,
          href: '/automacao'
        }
      ]
    }
  ];

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
    },
    {
      id: '6',
      user: {
        name: 'Pedro Fernandes',
        avatar: '',
        initials: 'PF'
      },
      timestamp: '26/07/2024 - 08:30h',
      action: {
        icon: getHistoryIcon('configuracao'),
        title: 'Configurou patrimônio',
        description: 'Definiu códigos de tombamento e configurou alertas automáticos para controle de estoque mínimo.'
      }
    }
  ];

  // Dados simulados para a galeria
  const sampleData = [
    {
      id: 1589,
      codigo: 1589,
      titulo: "Desligamento",
      prazo: "12/04/2024",
      diasRestantes: "11 dias",
      responsavel: "Bart Silva",
      departamento: "Recursos Humanos",
      prioridade: "Alta",
      categoria: "Administrativo",
      custoEstimado: 2500.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1588,
      codigo: 1588,
      titulo: "Fechar unida...",
      prazo: "02/04/2024",
      diasRestantes: "2d atrasado",
      responsavel: "Bart Silva",
      departamento: "Operações",
      prioridade: "Média",
      categoria: "Operacional",
      custoEstimado: 1800.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1586,
      codigo: 1586,
      titulo: "Abertura de ...",
      prazo: "05/04/2024",
      diasRestantes: "2 dias",
      responsavel: "Matheus Souza",
      departamento: "Comercial",
      prioridade: "Baixa",
      categoria: "Comercial",
      custoEstimado: 5000.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1585,
      codigo: 1585,
      titulo: "Criar novo ...",
      prazo: "02/04/2024",
      diasRestantes: "2d atrasado",
      responsavel: "Bart Silva",
      departamento: "Tecnologia",
      prioridade: "Alta",
      categoria: "Desenvolvimento",
      custoEstimado: 8500.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1584,
      codigo: 1584,
      titulo: "Análise de sistema",
      prazo: "15/04/2024",
      diasRestantes: "14 dias",
      responsavel: "Ana Costa",
      departamento: "Tecnologia",
      prioridade: "Média",
      categoria: "Análise",
      custoEstimado: 3200.00,
      status: "Em andamento",
      statusColor: "#F59E0B"
    },
    {
      id: 1583,
      codigo: 1583,
      titulo: "Backup de dados",
      prazo: "10/04/2024",
      diasRestantes: "9 dias",
      responsavel: "Carlos Lima",
      departamento: "Tecnologia",
      prioridade: "Alta",
      categoria: "Infraestrutura",
      custoEstimado: 1200.00,
      status: "Pendente",
      statusColor: "#EF4444"
    },
    {
      id: 1582,
      codigo: 1582,
      titulo: "Migração server",
      prazo: "18/04/2024",
      diasRestantes: "17 dias",
      responsavel: "João Santos",
      departamento: "Infraestrutura",
      prioridade: "Alta",
      categoria: "Infraestrutura",
      custoEstimado: 12000.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1581,
      codigo: 1581,
      titulo: "Atualização firmware",
      prazo: "08/04/2024",
      diasRestantes: "7 dias",
      responsavel: "Maria Silva",
      departamento: "Tecnologia",
      prioridade: "Média",
      categoria: "Manutenção",
      custoEstimado: 800.00,
      status: "Em andamento",
      statusColor: "#F59E0B"
    },
    {
      id: 1580,
      codigo: 1580,
      titulo: "Instalação equipamento",
      prazo: "20/04/2024",
      diasRestantes: "19 dias",
      responsavel: "Pedro Oliveira",
      departamento: "Infraestrutura",
      prioridade: "Baixa",
      categoria: "Instalação",
      custoEstimado: 15000.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1579,
      codigo: 1579,
      titulo: "Configuração rede",
      prazo: "06/04/2024",
      diasRestantes: "5 dias",
      responsavel: "Lucas Ferreira",
      departamento: "Redes",
      prioridade: "Alta",
      categoria: "Configuração",
      custoEstimado: 2200.00,
      status: "Pendente",
      statusColor: "#EF4444"
    },
    {
      id: 1578,
      codigo: 1578,
      titulo: "Manutenção preventiva",
      prazo: "22/04/2024",
      diasRestantes: "21 dias",
      responsavel: "Sofia Alves",
      departamento: "Manutenção",
      prioridade: "Baixa",
      categoria: "Manutenção",
      custoEstimado: 900.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1577,
      codigo: 1577,
      titulo: "Auditoria interna",
      prazo: "25/04/2024",
      diasRestantes: "24 dias",
      responsavel: "Roberto Costa",
      departamento: "Auditoria",
      prioridade: "Média",
      categoria: "Auditoria",
      custoEstimado: 4500.00,
      status: "Em andamento",
      statusColor: "#F59E0B"
    },
    {
      id: 1576,
      codigo: 1576,
      titulo: "Treinamento equipe",
      prazo: "28/04/2024",
      diasRestantes: "27 dias",
      responsavel: "Camila Santos",
      departamento: "Recursos Humanos",
      prioridade: "Baixa",
      categoria: "Treinamento",
      custoEstimado: 3800.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1575,
      codigo: 1575,
      titulo: "Documentação sistema",
      prazo: "30/04/2024",
      diasRestantes: "29 dias",
      responsavel: "Rafael Lima",
      departamento: "Documentação",
      prioridade: "Baixa",
      categoria: "Documentação",
      custoEstimado: 1600.00,
      status: "Pendente",
      statusColor: "#EF4444"
    },
    {
      id: 1574,
      codigo: 1574,
      titulo: "Teste de performance",
      prazo: "03/05/2024",
      diasRestantes: "32 dias",
      responsavel: "Beatriz Silva",
      departamento: "Qualidade",
      prioridade: "Alta",
      categoria: "Teste",
      custoEstimado: 2800.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1573,
      codigo: 1573,
      titulo: "Implementação API",
      prazo: "05/05/2024",
      diasRestantes: "34 dias",
      responsavel: "Diego Oliveira",
      departamento: "Desenvolvimento",
      prioridade: "Alta",
      categoria: "Desenvolvimento",
      custoEstimado: 6700.00,
      status: "Em andamento",
      statusColor: "#F59E0B"
    },
    {
      id: 1572,
      codigo: 1572,
      titulo: "Revisão de código",
      prazo: "08/05/2024",
      diasRestantes: "37 dias",
      responsavel: "Fernanda Costa",
      departamento: "Desenvolvimento",
      prioridade: "Média",
      categoria: "Revisão",
      custoEstimado: 1400.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1571,
      codigo: 1571,
      titulo: "Deploy produção",
      prazo: "10/05/2024",
      diasRestantes: "39 dias",
      responsavel: "Gustavo Santos",
      departamento: "DevOps",
      prioridade: "Alta",
      categoria: "Deploy",
      custoEstimado: 3500.00,
      status: "Pendente",
      statusColor: "#EF4444"
    },
    {
      id: 1570,
      codigo: 1570,
      titulo: "Monitoramento logs",
      prazo: "12/05/2024",
      diasRestantes: "41 dias",
      responsavel: "Helena Lima",
      departamento: "Monitoramento",
      prioridade: "Baixa",
      categoria: "Monitoramento",
      custoEstimado: 1100.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1569,
      codigo: 1569,
      titulo: "Otimização banco",
      prazo: "15/05/2024",
      diasRestantes: "44 dias",
      responsavel: "Igor Silva",
      departamento: "Banco de Dados",
      prioridade: "Média",
      categoria: "Otimização",
      custoEstimado: 4200.00,
      status: "Em andamento",
      statusColor: "#F59E0B"
    },
    {
      id: 1568,
      codigo: 1568,
      titulo: "Configuração firewall",
      prazo: "18/05/2024",
      diasRestantes: "47 dias",
      responsavel: "Julia Oliveira",
      departamento: "Segurança",
      prioridade: "Alta",
      categoria: "Segurança",
      custoEstimado: 3900.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1567,
      codigo: 1567,
      titulo: "Validação certificados",
      prazo: "20/05/2024",
      diasRestantes: "49 dias",
      responsavel: "Kevin Costa",
      departamento: "Segurança",
      prioridade: "Média",
      categoria: "Validação",
      custoEstimado: 700.00,
      status: "Pendente",
      statusColor: "#EF4444"
    },
    {
      id: 1566,
      codigo: 1566,
      titulo: "Integração sistemas",
      prazo: "22/05/2024",
      diasRestantes: "51 dias",
      responsavel: "Larissa Santos",
      departamento: "Integração",
      prioridade: "Alta",
      categoria: "Integração",
      custoEstimado: 9800.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1565,
      codigo: 1565,
      titulo: "Relatório mensal",
      prazo: "25/05/2024",
      diasRestantes: "54 dias",
      responsavel: "Marcos Lima",
      departamento: "Relatórios",
      prioridade: "Baixa",
      categoria: "Relatório",
      custoEstimado: 500.00,
      status: "Em andamento",
      statusColor: "#F59E0B"
    },
    {
      id: 1564,
      codigo: 1564,
      titulo: "Backup incremental",
      prazo: "27/05/2024",
      diasRestantes: "56 dias",
      responsavel: "Natália Silva",
      departamento: "Backup",
      prioridade: "Média",
      categoria: "Backup",
      custoEstimado: 1300.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1563,
      codigo: 1563,
      titulo: "Upgrade infraestrutura",
      prazo: "30/05/2024",
      diasRestantes: "59 dias",
      responsavel: "Otávio Oliveira",
      departamento: "Infraestrutura",
      prioridade: "Alta",
      categoria: "Upgrade",
      custoEstimado: 25000.00,
      status: "Pendente",
      statusColor: "#EF4444"
    },
    {
      id: 1562,
      codigo: 1562,
      titulo: "Teste segurança",
      prazo: "02/06/2024",
      diasRestantes: "62 dias",
      responsavel: "Paula Costa",
      departamento: "Segurança",
      prioridade: "Alta",
      categoria: "Teste",
      custoEstimado: 5600.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1561,
      codigo: 1561,
      titulo: "Análise vulnerabilidades",
      prazo: "05/06/2024",
      diasRestantes: "65 dias",
      responsavel: "Quintino Santos",
      departamento: "Segurança",
      prioridade: "Alta",
      categoria: "Análise",
      custoEstimado: 4800.00,
      status: "Em andamento",
      statusColor: "#F59E0B"
    },
    {
      id: 1560,
      codigo: 1560,
      titulo: "Instalação patches",
      prazo: "08/06/2024",
      diasRestantes: "68 dias",
      responsavel: "Regina Lima",
      departamento: "Manutenção",
      prioridade: "Média",
      categoria: "Patch",
      custoEstimado: 600.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1559,
      codigo: 1559,
      titulo: "Configuração DNS",
      prazo: "10/06/2024",
      diasRestantes: "70 dias",
      responsavel: "Sérgio Silva",
      departamento: "Redes",
      prioridade: "Baixa",
      categoria: "Configuração",
      custoEstimado: 800.00,
      status: "Pendente",
      statusColor: "#EF4444"
    },
    {
      id: 1558,
      codigo: 1558,
      titulo: "Monitoramento uptime",
      prazo: "12/06/2024",
      diasRestantes: "72 dias",
      responsavel: "Tatiana Oliveira",
      departamento: "Monitoramento",
      prioridade: "Baixa",
      categoria: "Monitoramento",
      custoEstimado: 900.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1557,
      codigo: 1557,
      titulo: "Limpeza logs antigos",
      prazo: "15/06/2024",
      diasRestantes: "75 dias",
      responsavel: "Ulysses Costa",
      departamento: "Limpeza",
      prioridade: "Baixa",
      categoria: "Limpeza",
      custoEstimado: 300.00,
      status: "Em andamento",
      statusColor: "#F59E0B"
    },
    {
      id: 1556,
      codigo: 1556,
      titulo: "Verificação licenças",
      prazo: "18/06/2024",
      diasRestantes: "78 dias",
      responsavel: "Valéria Santos",
      departamento: "Licenças",
      prioridade: "Média",
      categoria: "Verificação",
      custoEstimado: 1000.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1555,
      codigo: 1555,
      titulo: "Atualização antivírus",
      prazo: "20/06/2024",
      diasRestantes: "80 dias",
      responsavel: "Wagner Lima",
      departamento: "Segurança",
      prioridade: "Média",
      categoria: "Atualização",
      custoEstimado: 1200.00,
      status: "Pendente",
      statusColor: "#EF4444"
    },
    {
      id: 1554,
      codigo: 1554,
      titulo: "Configuração proxy",
      prazo: "22/06/2024",
      diasRestantes: "82 dias",
      responsavel: "Ximena Silva",
      departamento: "Redes",
      prioridade: "Baixa",
      categoria: "Configuração",
      custoEstimado: 700.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1553,
      codigo: 1553,
      titulo: "Teste disaster recovery",
      prazo: "25/06/2024",
      diasRestantes: "85 dias",
      responsavel: "Yuri Oliveira",
      departamento: "Contingência",
      prioridade: "Alta",
      categoria: "Teste",
      custoEstimado: 8900.00,
      status: "Em andamento",
      statusColor: "#F59E0B"
    },
    {
      id: 1552,
      codigo: 1552,
      titulo: "Análise capacidade",
      prazo: "28/06/2024",
      diasRestantes: "88 dias",
      responsavel: "Zara Costa",
      departamento: "Capacidade",
      prioridade: "Média",
      categoria: "Análise",
      custoEstimado: 2600.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1551,
      codigo: 1551,
      titulo: "Implementação cache",
      prazo: "30/06/2024",
      diasRestantes: "90 dias",
      responsavel: "André Santos",
      departamento: "Performance",
      prioridade: "Baixa",
      categoria: "Implementação",
      custoEstimado: 3200.00,
      status: "Pendente",
      statusColor: "#EF4444"
    },
    {
      id: 1550,
      codigo: 1550,
      titulo: "Configuração SSL",
      prazo: "02/07/2024",
      diasRestantes: "92 dias",
      responsavel: "Bruna Lima",
      departamento: "Segurança",
      prioridade: "Alta",
      categoria: "Configuração",
      custoEstimado: 1500.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1549,
      codigo: 1549,
      titulo: "Migração dados",
      prazo: "05/07/2024",
      diasRestantes: "95 dias",
      responsavel: "Caio Silva",
      departamento: "Migração",
      prioridade: "Alta",
      categoria: "Migração",
      custoEstimado: 7800.00,
      status: "Em andamento",
      statusColor: "#F59E0B"
    },
    {
      id: 1548,
      codigo: 1548,
      titulo: "Teste integração",
      prazo: "08/07/2024",
      diasRestantes: "98 dias",
      responsavel: "Daniela Oliveira",
      departamento: "Teste",
      prioridade: "Média",
      categoria: "Teste",
      custoEstimado: 2100.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1547,
      codigo: 1547,
      titulo: "Configuração LDAP",
      prazo: "10/07/2024",
      diasRestantes: "100 dias",
      responsavel: "Eduardo Costa",
      departamento: "Autenticação",
      prioridade: "Média",
      categoria: "Configuração",
      custoEstimado: 2800.00,
      status: "Pendente",
      statusColor: "#EF4444"
    },
    {
      id: 1546,
      codigo: 1546,
      titulo: "Análise performance",
      prazo: "12/07/2024",
      diasRestantes: "102 dias",
      responsavel: "Fabiana Santos",
      departamento: "Performance",
      prioridade: "Baixa",
      categoria: "Análise",
      custoEstimado: 1900.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1545,
      codigo: 1545,
      titulo: "Implementação CI/CD",
      prazo: "15/07/2024",
      diasRestantes: "105 dias",
      responsavel: "Gabriel Lima",
      departamento: "DevOps",
      prioridade: "Alta",
      categoria: "Implementação",
      custoEstimado: 12500.00,
      status: "Em andamento",
      statusColor: "#F59E0B"
    },
    {
      id: 1544,
      codigo: 1544,
      titulo: "Teste carga",
      prazo: "18/07/2024",
      diasRestantes: "108 dias",
      responsavel: "Heloísa Silva",
      departamento: "Teste",
      prioridade: "Média",
      categoria: "Teste",
      custoEstimado: 3400.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1543,
      codigo: 1543,
      titulo: "Configuração VPN",
      prazo: "20/07/2024",
      diasRestantes: "110 dias",
      responsavel: "Ivan Oliveira",
      departamento: "Redes",
      prioridade: "Alta",
      categoria: "Configuração",
      custoEstimado: 4200.00,
      status: "Pendente",
      statusColor: "#EF4444"
    },
    {
      id: 1542,
      codigo: 1542,
      titulo: "Monitoramento métricas",
      prazo: "22/07/2024",
      diasRestantes: "112 dias",
      responsavel: "Joana Costa",
      departamento: "Monitoramento",
      prioridade: "Baixa",
      categoria: "Monitoramento",
      custoEstimado: 1100.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1541,
      codigo: 1541,
      titulo: "Implementação logs",
      prazo: "25/07/2024",
      diasRestantes: "115 dias",
      responsavel: "Klaus Santos",
      departamento: "Logs",
      prioridade: "Média",
      categoria: "Implementação",
      custoEstimado: 2300.00,
      status: "Em andamento",
      statusColor: "#F59E0B"
    },
    {
      id: 1540,
      codigo: 1540,
      titulo: "Teste usabilidade",
      prazo: "28/07/2024",
      diasRestantes: "118 dias",
      responsavel: "Luana Lima",
      departamento: "UX",
      prioridade: "Baixa",
      categoria: "Teste",
      custoEstimado: 2800.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1539,
      codigo: 1539,
      titulo: "Configuração CDN",
      prazo: "30/07/2024",
      diasRestantes: "120 dias",
      responsavel: "Márcio Silva",
      departamento: "Infraestrutura",
      prioridade: "Média",
      categoria: "Configuração",
      custoEstimado: 5400.00,
      status: "Pendente",
      statusColor: "#EF4444"
    },
    {
      id: 1538,
      codigo: 1538,
      titulo: "Análise conformidade",
      prazo: "02/08/2024",
      diasRestantes: "123 dias",
      responsavel: "Nina Oliveira",
      departamento: "Conformidade",
      prioridade: "Alta",
      categoria: "Análise",
      custoEstimado: 6700.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1537,
      codigo: 1537,
      titulo: "Implementação alertas",
      prazo: "05/08/2024",
      diasRestantes: "126 dias",
      responsavel: "Orlando Costa",
      departamento: "Alertas",
      prioridade: "Média",
      categoria: "Implementação",
      custoEstimado: 1800.00,
      status: "Em andamento",
      statusColor: "#F59E0B"
    },
    {
      id: 1536,
      codigo: 1536,
      titulo: "Teste regressão",
      prazo: "08/08/2024",
      diasRestantes: "129 dias",
      responsavel: "Priscila Santos",
      departamento: "Qualidade",
      prioridade: "Baixa",
      categoria: "Teste",
      custoEstimado: 2200.00,
      status: "Aprovado",
      statusColor: "#10B981"
    },
    {
      id: 1535,
      codigo: 1535,
      titulo: "Configuração cluster",
      prazo: "10/08/2024",
      diasRestantes: "131 dias",
      responsavel: "Quirino Lima",
      departamento: "Infraestrutura",
      prioridade: "Alta",
      categoria: "Configuração",
      custoEstimado: 18000.00,
      status: "Pendente",
      statusColor: "#EF4444"
    }
  ];

  // Função para alternar filtros
  const handleFilterToggle = (filterId: string) => {
    if (filterId === 'todos') {
      // Se clica em "Todos", ativa apenas ele
      setActiveFilters(['todos']);
    } else {
      // Se clica em outro filtro
      if (activeFilters.includes('todos')) {
        // Se "Todos" estava ativo, desativa ele e ativa o novo
        setActiveFilters([filterId]);
      } else {
        // Se "Todos" não estava ativo, alterna o filtro clicado
        if (activeFilters.includes(filterId)) {
          const newFilters = activeFilters.filter(f => f !== filterId);
          // Se não sobrou nenhum filtro, ativa "Todos"
          setActiveFilters(newFilters.length === 0 ? ['todos'] : newFilters);
        } else {
          setActiveFilters([...activeFilters, filterId]);
        }
      }
    }
  };

  // Contar status dos dados
  const statusCounts = sampleData.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Criar filterItems baseados nos status
  const filterItems = [
    {
      id: 'todos',
      label: 'Todos',
      count: sampleData.length,
      onClick: () => handleFilterToggle('todos'),
      active: activeFilters.includes('todos')
    },
    {
      id: 'pendente',
      label: 'Pendente',
      count: statusCounts['Pendente'] || 0,
      onClick: () => handleFilterToggle('pendente'),
      active: activeFilters.includes('pendente')
    },
    {
      id: 'em-andamento',
      label: 'Em andamento',
      count: statusCounts['Em andamento'] || 0,
      onClick: () => handleFilterToggle('em-andamento'),
      active: activeFilters.includes('em-andamento')
    },
    {
      id: 'aprovado',
      label: 'Aprovado',
      count: statusCounts['Aprovado'] || 0,
      onClick: () => handleFilterToggle('aprovado'),
      active: activeFilters.includes('aprovado')
    }
  ];

  // Filtrar dados baseado nos filtros ativos
  let filteredData = activeFilters.includes('todos') 
    ? sampleData 
    : sampleData.filter(item => {
        const statusMap: Record<string, string> = {
          'pendente': 'Pendente',
          'em-andamento': 'Em andamento',
          'aprovado': 'Aprovado'
        };
        return activeFilters.some(filter => statusMap[filter] === item.status);
      });

  // Aplicar filtro de prioridade se houver filtros ativos
  if (activePriorityFilters.length > 0) {
    filteredData = filteredData.filter(item => {
      const priorityMap: Record<string, string> = {
        'alta': 'Alta',
        'media': 'Média',
        'baixa': 'Baixa'
      };
      return activePriorityFilters.some(filter => priorityMap[filter] === item.prioridade);
    });
  }

  // Função para alternar filtros de prioridade
  const handlePriorityFilterToggle = (priorityId: string) => {
    if (activePriorityFilters.includes(priorityId)) {
      setActivePriorityFilters(activePriorityFilters.filter(f => f !== priorityId));
    } else {
      setActivePriorityFilters([...activePriorityFilters, priorityId]);
    }
  };

  // Criar tagGroup para prioridade
  const priorityTagGroups = [
    {
      title: 'Prioridade',
      tags: [
        {
          id: 'alta',
          label: 'Alta',
          active: activePriorityFilters.includes('alta'),
          onClick: () => handlePriorityFilterToggle('alta')
        },
        {
          id: 'media',
          label: 'Média',
          active: activePriorityFilters.includes('media'),
          onClick: () => handlePriorityFilterToggle('media')
        },
        {
          id: 'baixa',
          label: 'Baixa',
          active: activePriorityFilters.includes('baixa'),
          onClick: () => handlePriorityFilterToggle('baixa')
        }
      ]
    }
  ];

  // Configuração das colunas
  const columns = [
    {
      key: 'codigo',
      title: 'Código',
      sortable: true,
      width: '100px'
    },
    {
      key: 'titulo',
      title: 'Título',
      sortable: true
    },
    {
      key: 'prazo',
      title: 'Prazo',
      sortable: true,
      width: '120px'
    },
    {
      key: 'diasRestantes',
      title: 'Dias rest.',
      sortable: true,
      width: '140px'
    },
    {
      key: 'responsavel',
      title: 'Responsável',
      sortable: true
    },
    {
      key: 'departamento',
      title: 'Departamento',
      sortable: true,
      width: '150px'
    },
    {
      key: 'prioridade',
      title: 'Prioridade',
      sortable: true,
      width: '120px',
      render: (value: any) => {
        const getPriorityStyles = (priority: string) => {
          switch (priority) {
            case 'Alta':
              return 'border-red-500 text-red-500';
            case 'Média':
              return 'border-yellow-500 text-yellow-500';
            case 'Baixa':
              return 'border-green-500 text-green-500';
            default:
              return 'border-gray-500 text-gray-500';
          }
        };
        
        return (
          <Badge 
            variant="outline" 
            className={`bg-transparent font-normal border font-sora text-xs hover:bg-transparent ${getPriorityStyles(value)}`}
          >
            {value}
          </Badge>
        );
      }
    },
    {
      key: 'categoria',
      title: 'Categoria',
      sortable: true,
      width: '130px'
    },
    {
      key: 'custoEstimado',
      title: 'Custo Est.',
      sortable: true,
      width: '120px',
      render: (value: any) => {
        return (
          <span className="text-sm">
            R$ {value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
          </span>
        );
      }
    },
    {
      key: 'status',
      title: 'Status',
      sortable: false,
      width: '120px',
      render: (value: any) => {
        const getStatusStyles = (status: string) => {
          switch (status) {
            case 'Aprovado':
              return 'border-main-success text-main-success';
            case 'Pendente':
              return 'border-main-warning text-main-warning';
            case 'Em andamento':
              return 'border-main-info text-main-info';
            default:
              return 'border-main-info text-main-info';
          }
        };
        
        return (
          <Badge 
            variant="outline" 
            className={`bg-transparent font-normal border font-sora text-xs hover:bg-transparent ${getStatusStyles(value)}`}
          >
            {value}
          </Badge>
        );
      }
    }
  ];

  // Ações disponíveis para cada linha
  const actions = [
    {
      icon: <Eye className="h-4 w-4" />,
      label: "Visualizar",
      onClick: (row: any) => console.log('Visualizar:', row),
      variant: "ghost" as const
    },
    {
      icon: <Edit className="h-4 w-4" />,
      label: "Editar",
      onClick: (row: any) => console.log('Editar:', row),
      variant: "ghost" as const
    },
    {
      icon: <Star className="h-4 w-4" />,
      label: "Favoritar",
      onClick: (row: any) => console.log('Favoritar:', row),
      variant: "ghost" as const
    }
  ];

  return (
    <>
        {/* Breadcrumb Navigation */}
        <div className="py-2">
          <Breadcrumb path={breadcrumbPath} onBack={handleBack} />
        </div>
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-main-primary mb-4 font-sora">
            Sistema de Gestão de Patrimônio Público
          </h1>
          <p className="text-xl text-second-black">
            Design System e Componentes Reutilizáveis
          </p>
        </div>

        {/* Color Tokens Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-main-primary mb-6 font-sora">Tokens de Cor</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Primary Colors */}
            <div className="space-y-3">
              <h3 className="font-semibold text-main-dark">Primary</h3>
              <div className="space-y-2">
                <div className="h-12 bg-main-primary rounded-md flex items-center justify-center">
                  <span className="text-main-white text-xs font-sora">Main</span>
                </div>
                <div className="h-12 bg-light-primary rounded-md flex items-center justify-center">
                  <span className="text-main-primary text-xs font-sora">Light</span>
                </div>
                <div className="h-12 bg-second-primary rounded-md flex items-center justify-center">
                  <span className="text-main-white text-xs font-sora">Second</span>
                </div>
              </div>
            </div>

            {/* Info Colors */}
            <div className="space-y-3">
              <h3 className="font-semibold text-main-dark">Info</h3>
              <div className="space-y-2">
                <div className="h-12 bg-main-info rounded-md flex items-center justify-center">
                  <span className="text-main-white text-xs font-sora">Main</span>
                </div>
                <div className="h-12 bg-light-info rounded-md flex items-center justify-center">
                  <span className="text-main-info text-xs font-sora">Light</span>
                </div>
                <div className="h-12 bg-second-info rounded-md flex items-center justify-center">
                  <span className="text-main-white text-xs font-sora">Second</span>
                </div>
              </div>
            </div>

            {/* Success Colors */}
            <div className="space-y-3">
              <h3 className="font-semibold text-main-dark">Success</h3>
              <div className="space-y-2">
                <div className="h-12 bg-main-success rounded-md flex items-center justify-center">
                  <span className="text-main-white text-xs font-sora">Main</span>
                </div>
                <div className="h-12 bg-light-success rounded-md flex items-center justify-center">
                  <span className="text-main-success text-xs font-sora">Light</span>
                </div>
                <div className="h-12 bg-second-success rounded-md flex items-center justify-center">
                  <span className="text-main-white text-xs font-sora">Second</span>
                </div>
              </div>
            </div>

            {/* Warning Colors */}
            <div className="space-y-3">
              <h3 className="font-semibold text-main-dark">Warning</h3>
              <div className="space-y-2">
                <div className="h-12 bg-main-warning rounded-md flex items-center justify-center">
                  <span className="text-main-white text-xs font-sora">Main</span>
                </div>
                <div className="h-12 bg-light-warning rounded-md flex items-center justify-center">
                  <span className="text-main-warning text-xs font-sora">Light</span>
                </div>
                <div className="h-12 bg-second-warning rounded-md flex items-center justify-center">
                  <span className="text-main-dark text-xs font-sora">Second</span>
                </div>
              </div>
            </div>

            {/* Danger Colors */}
            <div className="space-y-3">
              <h3 className="font-semibold text-main-dark">Danger</h3>
              <div className="space-y-2">
                <div className="h-12 bg-main-danger rounded-md flex items-center justify-center">
                  <span className="text-main-white text-xs font-sora">Main</span>
                </div>
                <div className="h-12 bg-light-danger rounded-md flex items-center justify-center">
                  <span className="text-main-danger text-xs font-sora">Light</span>
                </div>
                <div className="h-12 bg-second-danger rounded-md flex items-center justify-center">
                  <span className="text-main-white text-xs font-sora">Second</span>
                </div>
              </div>
            </div>

            {/* Dark Colors */}
            <div className="space-y-3">
              <h3 className="font-semibold text-main-dark">Dark</h3>
              <div className="space-y-2">
                <div className="h-12 bg-main-dark rounded-md flex items-center justify-center">
                  <span className="text-main-white text-xs font-sora">Main</span>
                </div>
                <div className="h-12 bg-light-dark rounded-md flex items-center justify-center">
                  <span className="text-main-dark text-xs font-sora">Light</span>
                </div>
                <div className="h-12 bg-second-dark rounded-md flex items-center justify-center">
                  <span className="text-main-white text-xs font-sora">Second</span>
                </div>
              </div>
            </div>

            {/* White Colors */}
            <div className="space-y-3">
              <h3 className="font-semibold text-main-dark">White</h3>
              <div className="space-y-2">
                <div className="h-12 bg-main-white rounded-md border border-gray-200 flex items-center justify-center">
                  <span className="text-main-dark text-xs font-sora">Main</span>
                </div>
                <div className="h-12 bg-light-white rounded-md border border-gray-200 flex items-center justify-center">
                  <span className="text-main-dark text-xs font-sora">Light</span>
                </div>
                <div className="h-12 bg-second-white rounded-md border border-gray-200 flex items-center justify-center">
                  <span className="text-main-dark text-xs font-sora">Second</span>
                </div>
              </div>
            </div>

            {/* Secondary Colors */}
            <div className="space-y-3">
              <h3 className="font-semibold text-main-dark">Secondary</h3>
              <div className="space-y-2">
                <div className="h-12 bg-main-secondary rounded-md flex items-center justify-center">
                  <span className="text-main-white text-xs font-sora">Main</span>
                </div>
                <div className="h-12 bg-light-secondary rounded-md flex items-center justify-center">
                  <span className="text-main-secondary text-xs font-sora">Light</span>
                </div>
                <div className="h-12 bg-second-secondary rounded-md flex items-center justify-center">
                  <span className="text-main-white text-xs font-sora">Second</span>
                </div>
              </div>
            </div>

            {/* Black Colors */}
            <div className="space-y-3">
              <h3 className="font-semibold text-main-dark">Black</h3>
              <div className="space-y-2">
                <div className="h-12 bg-main-black rounded-md flex items-center justify-center">
                  <span className="text-main-white text-xs font-sora">Main</span>
                </div>
                <div className="h-12 bg-light-black rounded-md border border-gray-200 flex items-center justify-center">
                  <span className="text-main-black text-xs font-sora">Light</span>
                </div>
                <div className="h-12 bg-second-black rounded-md flex items-center justify-center">
                  <span className="text-main-white text-xs font-sora">Second</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Button Components Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-main-primary mb-6 font-sora">Componentes de Botão</h2>
          
          <div className="bg-light-primary p-8 rounded-lg bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Primary Button */}
              <div className="space-y-3">
                <h3 className="font-semibold text-main-primary">PrimaryButton</h3>
                <PrimaryButton onClick={() => console.log('Primary button clicked')}>
                  Cadastrar Patrimônio
                </PrimaryButton>
              </div>

              {/* Button with Icon Right */}
              <div className="space-y-3">
                <h3 className="font-semibold text-main-primary">IconRight</h3>
                <PrimaryButtonWithIconRight onClick={() => console.log('Icon right clicked')} icon={<DefaultIcon />}>
                  Exportar Dados
                </PrimaryButtonWithIconRight>
              </div>

              {/* Button with Icon Left */}
              <div className="space-y-3">
                <h3 className="font-semibold text-main-primary">IconLeft</h3>
                <PrimaryButtonWithIconLeft onClick={() => console.log('Icon left clicked')} icon={<DefaultIcon />}>
                  Importar Planilha
                </PrimaryButtonWithIconLeft>
              </div>

              {/* Button with Icon Only */}
              <div className="space-y-3">
                <h3 className="font-semibold text-main-primary">IconOnly</h3>
                <PrimaryButtonWithIcon onClick={() => console.log('Icon only clicked')} icon={<DefaultIcon />} />
              </div>

              {/* Ghost Button */}
              <div className="space-y-3">
                <h3 className="font-semibold text-main-primary">GhostButton</h3>
                <PrimaryGhostButton onClick={() => console.log('Ghost button clicked')}>
                  Cancelar Operação
                </PrimaryGhostButton>
              </div>

              {/* Ghost Button with Icon Right */}
              <div className="space-y-3">
                <h3 className="font-semibold text-main-primary">GhostIconRight</h3>
                <GhostButtonWithIconRight onClick={() => console.log('Ghost icon right clicked')} icon={<DefaultIcon />}>
                  Filtrar Lista
                </GhostButtonWithIconRight>
              </div>

              {/* Ghost Button with Icon Left */}
              <div className="space-y-3">
                <h3 className="font-semibold text-main-primary">GhostIconLeft</h3>
                <GhostButtonWithIconLeft onClick={() => console.log('Ghost icon left clicked')} icon={<DefaultIcon />}>
                  Ver Detalhes
                </GhostButtonWithIconLeft>
              </div>

              {/* Ghost Button with Icon Only */}
              <div className="space-y-3">
                <h3 className="font-semibold text-main-primary">GhostIconOnly</h3>
                <GhostButtonWithIcon onClick={() => console.log('Ghost icon only clicked')} icon={<DefaultIcon />} />
              </div>

              {/* Disabled State */}
              <div className="space-y-3">
                <h3 className="font-semibold text-main-primary">Disabled State</h3>
                <PrimaryButton disabled>
                  Botão Desabilitado
                </PrimaryButton>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Components Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-main-primary mb-6 font-sora">Componentes de Modal</h2>
          
          <div className="bg-light-primary p-8 rounded-lg bg-slate-50">
            <div className="flex flex-wrap gap-4 mb-6">
              <PrimaryButton onClick={() => setApproveModalOpen(true)}>
                Modal de Aprovação
              </PrimaryButton>
              
              <PrimaryButton onClick={() => setFilterModalOpen(true)}>
                Modal de Filtros
              </PrimaryButton>
              
              <PrimaryButton onClick={() => setFormModalOpen(true)}>
                Modal de Formulário
              </PrimaryButton>
              
              <PrimaryButton onClick={() => setConfirmationModalOpen(true)}>
                Modal de Confirmação
              </PrimaryButton>
            </div>
            
            <div className="border-t border-light-white pt-6">
              <h3 className="text-lg font-medium text-main-dark mb-4 font-sora">Modais por Tamanho</h3>
              <div className="flex flex-wrap gap-4">
                <PrimaryButton onClick={() => setCadastroSimplesModalOpen(true)}>
                  Modal Pequeno
                </PrimaryButton>
                
                <PrimaryButton onClick={() => setCadastroComumModalOpen(true)}>
                  Modal Médio
                </PrimaryButton>
                
                <PrimaryButton onClick={() => setCadastroAvancadoModalOpen(true)}>
                  Modal Grande
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>

        {/* Data Gallery Demo com Filter Menu */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-main-primary mb-6 font-sora">Galeria de Dados com Menu de Filtros</h2>
          
          <div className="flex gap-4">
            <FilterMenu
              title="Recepção da NF"
              icon={<HeritageIcon size={24} className="text-main-dark" />}
              filterItems={filterItems}
              tagGroups={priorityTagGroups}
              onFilterClick={() => alert("Abrindo modal de filtros...")}
              actionButton={{
                label: "Cadastrar patrimônio",
                icon: <Plus size={16} />,
                onClick: () => alert("Criando novo patrimônio...")
              }}
              collapsed={filterMenuCollapsed}
              onToggleCollapse={() => setFilterMenuCollapsed(!filterMenuCollapsed)}
            />
            
            <DataGallery
            data={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            columns={columns}
            actions={actions}
            showStatusIndicator={true}
            getStatusColor={(row) => row.statusColor}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / pageSize)}
            pageSize={pageSize}
            totalItems={filteredData.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1); // Reset to first page when changing page size
            }}
            onSort={(column, direction) => {
              setSortColumn(column);
              setSortDirection(direction);
              console.log('Ordenar por:', column, direction);
            }}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
              onExport={() => console.log('Exportar dados')}
              onRefresh={() => console.log('Atualizar dados')}
              className="max-w-full"
            />
          </div>
        </div>

        {/* Form Components Demo */}
        <FormDemo />

        {/* Modal de Aprovação */}
        <Modal
          open={approveModalOpen}
          onOpenChange={setApproveModalOpen}
          title="Aprovar plano de ação!"
          actions={
            <>
              <PrimaryGhostButton onClick={() => setApproveModalOpen(false)}>
                Cancelar
              </PrimaryGhostButton>
              <PrimaryButton onClick={() => {
                console.log('Aprovado com comentário:', comment);
                setApproveModalOpen(false);
                setComment('');
              }}>
                Aprovar
              </PrimaryButton>
            </>
          }
        >
          <div>
            <FormLabel required>Comentário:</FormLabel>
            <FormTextarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="digite aqui"
              className="mt-1"
            />
          </div>
        </Modal>

        {/* Modal de Filtros */}
        <Modal
          open={filterModalOpen}
          onOpenChange={setFilterModalOpen}
          title="Selecionar filtros"
          actions={
            <>
              <PrimaryGhostButton onClick={() => {
                setFilterModalOpen(false);
                setPlanType('');
                setPriority('');
                setStartDate(undefined);
                setEndDate(undefined);
              }}>
                Cancelar
              </PrimaryGhostButton>
              <PrimaryButton onClick={() => {
                console.log('Filtros aplicados:', { planType, priority, startDate, endDate });
                setFilterModalOpen(false);
              }}>
                Aplicar filtros
              </PrimaryButton>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <FormLabel>Tipo do plano</FormLabel>
              <FormSelect value={planType} onValueChange={setPlanType}>
                <FormSelectTrigger className="mt-1" hasValue={!!planType} onClear={() => setPlanType("")}>
                  <FormSelectValue placeholder="Seleção" />
                </FormSelectTrigger>
                <FormSelectContent>
                  <FormSelectItem value="operacional">Operacional</FormSelectItem>
                  <FormSelectItem value="estrategico">Estratégico</FormSelectItem>
                  <FormSelectItem value="tatico">Tático</FormSelectItem>
                </FormSelectContent>
              </FormSelect>
            </div>

            <div>
              <FormLabel>Prioridade</FormLabel>
              <FormSelect value={priority} onValueChange={setPriority}>
                <FormSelectTrigger className="mt-1" hasValue={!!priority} onClear={() => setPriority("")}>
                  <FormSelectValue placeholder="Seleção" />
                </FormSelectTrigger>
                <FormSelectContent>
                  <FormSelectItem value="alta">Alta</FormSelectItem>
                  <FormSelectItem value="media">Média</FormSelectItem>
                  <FormSelectItem value="baixa">Baixa</FormSelectItem>
                </FormSelectContent>
              </FormSelect>
            </div>

            <div>
              <FormLabel>Prazo de</FormLabel>
              <div className="flex gap-4 mt-1">
                <div className="flex-1">
                  <FormDatePicker
                    date={startDate}
                    onDateChange={setStartDate}
                    placeholder="Início"
                  />
                </div>
                <div className="flex-1">
                  <FormDatePicker
                    date={endDate}
                    onDateChange={setEndDate}
                    placeholder="Fim"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* Modal de Formulário com Duas Colunas */}
        <Modal
          open={formModalOpen}
          onOpenChange={setFormModalOpen}
          title="Cadastro de Solicitação"
          description="Preencha os dados para criar uma nova solicitação"
          className="sm:max-w-4xl"
          actions={
            <>
              <PrimaryGhostButton onClick={() => {
                setFormModalOpen(false);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  department: '',
                  position: '',
                  description: '',
                  category: '',
                  urgency: '',
                  requestDate: undefined,
                  deadline: undefined
                });
              }}>
                Cancelar
              </PrimaryGhostButton>
              <PrimaryButton onClick={() => {
                console.log('Formulário enviado:', formData);
                setFormModalOpen(false);
              }}>
                Enviar Solicitação
              </PrimaryButton>
            </>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Coluna 1 */}
            <div className="space-y-4">
              <div>
                <FormLabel required>Nome Completo</FormLabel>
                <FormInput
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite o nome completo"
                  className="mt-1"
                />
              </div>

              <div>
                <FormLabel required>E-mail</FormLabel>
                <FormInput
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="exemplo@email.com"
                  className="mt-1"
                />
              </div>

              <div>
                <FormLabel>Telefone</FormLabel>
                <FormInput
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                  className="mt-1"
                />
              </div>

              <div>
                <FormLabel required>Departamento</FormLabel>
                <FormSelect value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                  <FormSelectTrigger className="mt-1" hasValue={!!formData.department} onClear={() => setFormData(prev => ({ ...prev, department: "" }))}>
                    <FormSelectValue placeholder="Selecione o departamento" />
                  </FormSelectTrigger>
                  <FormSelectContent>
                    <FormSelectItem value="ti">Tecnologia da Informação</FormSelectItem>
                    <FormSelectItem value="rh">Recursos Humanos</FormSelectItem>
                    <FormSelectItem value="financeiro">Financeiro</FormSelectItem>
                    <FormSelectItem value="operacoes">Operações</FormSelectItem>
                  </FormSelectContent>
                </FormSelect>
              </div>

              <div>
                <FormLabel>Data da Solicitação</FormLabel>
                <FormDatePicker
                  date={formData.requestDate}
                  onDateChange={(date) => setFormData(prev => ({ ...prev, requestDate: date }))}
                  placeholder="Selecione a data"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Coluna 2 */}
            <div className="space-y-4">
              <div>
                <FormLabel>Cargo</FormLabel>
                <FormInput
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Digite o cargo"
                  className="mt-1"
                />
              </div>

              <div>
                <FormLabel required>Categoria</FormLabel>
                <FormSelect value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <FormSelectTrigger className="mt-1" hasValue={!!formData.category} onClear={() => setFormData(prev => ({ ...prev, category: "" }))}>
                    <FormSelectValue placeholder="Selecione a categoria" />
                  </FormSelectTrigger>
                  <FormSelectContent>
                    <FormSelectItem value="manutencao">Manutenção</FormSelectItem>
                    <FormSelectItem value="suporte">Suporte Técnico</FormSelectItem>
                    <FormSelectItem value="desenvolvimento">Desenvolvimento</FormSelectItem>
                    <FormSelectItem value="infraestrutura">Infraestrutura</FormSelectItem>
                  </FormSelectContent>
                </FormSelect>
              </div>

              <div>
                <FormLabel required>Urgência</FormLabel>
                <FormSelect value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                  <FormSelectTrigger className="mt-1" hasValue={!!formData.urgency} onClear={() => setFormData(prev => ({ ...prev, urgency: "" }))}>
                    <FormSelectValue placeholder="Selecione a urgência" />
                  </FormSelectTrigger>
                  <FormSelectContent>
                    <FormSelectItem value="baixa">Baixa</FormSelectItem>
                    <FormSelectItem value="media">Média</FormSelectItem>
                    <FormSelectItem value="alta">Alta</FormSelectItem>
                    <FormSelectItem value="critica">Crítica</FormSelectItem>
                  </FormSelectContent>
                </FormSelect>
              </div>

              <div>
                <FormLabel>Prazo</FormLabel>
                <FormDatePicker
                  date={formData.deadline}
                  onDateChange={(date) => setFormData(prev => ({ ...prev, deadline: date }))}
                  placeholder="Selecione o prazo"
                  className="mt-1"
                />
              </div>

              <div>
                <FormLabel>Descrição</FormLabel>
                <FormTextarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva detalhadamente a solicitação"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </Modal>

        {/* Novos modais sem cabeçalho */}
        <ConfirmationModal
          open={confirmationModalOpen}
          onOpenChange={setConfirmationModalOpen}
          title="Deseja deletar o arquivo?"
          subtitle="Você não poderá desfazer esta ação!"
          onConfirm={() => {
            setConfirmationModalOpen(false);
            setLoadingModalOpen(true);
            // Simula carregamento
            setTimeout(() => {
              setLoadingModalOpen(false);
              setSuccessModalOpen(true);
            }, 2000);
          }}
          onCancel={() => setConfirmationModalOpen(false)}
        />

        <LoadingModal
          open={loadingModalOpen}
          onOpenChange={setLoadingModalOpen}
          title="Carregando!"
          subtitle="O arquivo está sendo excluído"
        />

        <SuccessModal
          open={successModalOpen}
          onOpenChange={setSuccessModalOpen}
          title="Deletado!"
          subtitle="O arquivo foi excluído"
          onOk={() => setSuccessModalOpen(false)}
        />

        {/* Modal Cadastro Simples (max-w-xl) */}
        <Modal
          open={cadastroSimplesModalOpen}
          onOpenChange={setCadastroSimplesModalOpen}
          title="Título do modal"
          description="Exemplo de modal para formulários com poucos campos"
          className="sm:max-w-xl"
          actions={
            <>
              <PrimaryGhostButton onClick={() => setCadastroSimplesModalOpen(false)}>
                Cancelar
              </PrimaryGhostButton>
              <PrimaryButton onClick={() => setCadastroSimplesModalOpen(false)}>
                Salvar
              </PrimaryButton>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <FormLabel required>Nome completo</FormLabel>
              <FormInput
                placeholder="Digite seu nome completo"
                className="mt-1"
              />
            </div>
            
            <div>
              <FormLabel required>E-mail</FormLabel>
              <FormInput
                type="email"
                placeholder="seu.email@exemplo.com"
                className="mt-1"
              />
            </div>
            
            <div>
              <FormLabel required>Senha</FormLabel>
              <FormInput
                type="password"
                placeholder="Digite sua senha"
                className="mt-1"
              />
            </div>
          </div>
        </Modal>

        {/* Modal Cadastro Comum (max-w-2xl) */}
        <Modal
          open={cadastroComumModalOpen}
          onOpenChange={setCadastroComumModalOpen}
          title="Título do modal"
          description="Exemplo de modal para formulários com 2-3 grupos de campos"
          className="sm:max-w-2xl"
          actions={
            <>
              <PrimaryGhostButton onClick={() => setCadastroComumModalOpen(false)}>
                Cancelar
              </PrimaryGhostButton>
              <PrimaryButton onClick={() => setCadastroComumModalOpen(false)}>
                Salvar
              </PrimaryButton>
            </>
          }
        >
          <div className="space-y-6">
            {/* Grupo 1: Informações Pessoais */}
            <div>
              <h3 className="font-sora text-sm font-semibold text-main-black mb-4">Informações pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel required>Nome completo</FormLabel>
                  <FormInput
                    placeholder="Digite seu nome completo"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <FormLabel required>CPF</FormLabel>
                  <CpfInput
                    placeholder="000.000.000-00"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <FormLabel required>E-mail</FormLabel>
                  <FormInput
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <FormLabel required>Telefone</FormLabel>
                  <PhoneInput
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Grupo 2: Informações Profissionais */}
            <div>
              <h3 className="font-sora text-sm font-semibold text-main-black mb-4">Informações profissionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel required>Departamento</FormLabel>
                  <FormSelect>
                    <FormSelectTrigger className="mt-1">
                      <FormSelectValue placeholder="Selecione o departamento" />
                    </FormSelectTrigger>
                    <FormSelectContent>
                      <FormSelectItem value="ti">Tecnologia da Informação</FormSelectItem>
                      <FormSelectItem value="rh">Recursos Humanos</FormSelectItem>
                      <FormSelectItem value="financeiro">Financeiro</FormSelectItem>
                    </FormSelectContent>
                  </FormSelect>
                </div>
                
                <div>
                  <FormLabel required>Cargo</FormLabel>
                  <FormInput
                    placeholder="Digite o cargo"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <FormLabel>Data de admissão</FormLabel>
                  <FormDatePicker className="mt-1" />
                </div>
                
                <div>
                  <FormLabel>Salário</FormLabel>
                  <CurrencyInput
                    placeholder="0,00"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Grupo 3: Observações */}
            <div>
              <FormLabel>Observações</FormLabel>
              <FormTextarea
                placeholder="Digite observações adicionais"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        </Modal>

        {/* Modal Cadastro Avançado (max-w-4xl) */}
        <Modal
          open={cadastroAvancadoModalOpen}
          onOpenChange={setCadastroAvancadoModalOpen}
          title="Título do modal"
          description="Exemplo de modal para formulários longos com múltiplas seções"
          className="sm:max-w-4xl"
          actions={
            <>
              <PrimaryGhostButton onClick={() => setCadastroAvancadoModalOpen(false)}>
                Cancelar
              </PrimaryGhostButton>
              <PrimaryButton onClick={() => setCadastroAvancadoModalOpen(false)}>
                Salvar
              </PrimaryButton>
            </>
          }
        >
          <div className="space-y-8">
            {/* Seção 1: Dados Básicos */}
            <div>
              <h3 className="font-sora text-sm font-semibold text-main-black mb-4 border-b border-light-white pb-2">
                1. Dados Básicos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <FormLabel required>Nome completo</FormLabel>
                  <FormInput placeholder="Digite o nome completo" className="mt-1" />
                </div>
                <div>
                  <FormLabel required>CPF/CNPJ</FormLabel>
                  <CpfCnpjInput className="mt-1" />
                </div>
                <div>
                  <FormLabel required>RG</FormLabel>
                  <FormInput placeholder="00.000.000-0" className="mt-1" />
                </div>
                <div>
                  <FormLabel required>Data de nascimento</FormLabel>
                  <FormDatePicker className="mt-1" />
                </div>
                <div>
                  <FormLabel>Estado civil</FormLabel>
                  <FormSelect>
                    <FormSelectTrigger className="mt-1">
                      <FormSelectValue placeholder="Selecione" />
                    </FormSelectTrigger>
                    <FormSelectContent>
                      <FormSelectItem value="solteiro">Solteiro(a)</FormSelectItem>
                      <FormSelectItem value="casado">Casado(a)</FormSelectItem>
                      <FormSelectItem value="divorciado">Divorciado(a)</FormSelectItem>
                    </FormSelectContent>
                  </FormSelect>
                </div>
                <div>
                  <FormLabel>Nacionalidade</FormLabel>
                  <FormInput placeholder="Brasileiro" className="mt-1" />
                </div>
              </div>
            </div>

            {/* Seção 2: Contato */}
            <div>
              <h3 className="font-sora text-sm font-semibold text-main-black mb-4 border-b border-light-white pb-2">
                2. Informações de Contato
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel required>E-mail principal</FormLabel>
                  <FormInput type="email" placeholder="seu.email@exemplo.com" className="mt-1" />
                </div>
                <div>
                  <FormLabel>E-mail secundário</FormLabel>
                  <FormInput type="email" placeholder="outro.email@exemplo.com" className="mt-1" />
                </div>
                <div>
                  <FormLabel required>Telefone principal</FormLabel>
                  <PhoneInput className="mt-1" />
                </div>
                <div>
                  <FormLabel>Telefone secundário</FormLabel>
                  <PhoneInput className="mt-1" />
                </div>
              </div>
            </div>

            {/* Seção 3: Endereço */}
            <div>
              <h3 className="font-sora text-sm font-semibold text-main-black mb-4 border-b border-light-white pb-2">
                3. Endereço
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <FormLabel required>CEP</FormLabel>
                  <FormInput placeholder="00000-000" className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <FormLabel required>Logradouro</FormLabel>
                  <FormInput placeholder="Rua, Avenida, etc." className="mt-1" />
                </div>
                <div>
                  <FormLabel required>Número</FormLabel>
                  <FormInput placeholder="123" className="mt-1" />
                </div>
                <div>
                  <FormLabel>Complemento</FormLabel>
                  <FormInput placeholder="Apto, Bloco, etc." className="mt-1" />
                </div>
                <div>
                  <FormLabel required>Bairro</FormLabel>
                  <FormInput placeholder="Nome do bairro" className="mt-1" />
                </div>
                <div>
                  <FormLabel required>Cidade</FormLabel>
                  <FormInput placeholder="Nome da cidade" className="mt-1" />
                </div>
                <div>
                  <FormLabel required>Estado</FormLabel>
                  <FormSelect>
                    <FormSelectTrigger className="mt-1">
                      <FormSelectValue placeholder="UF" />
                    </FormSelectTrigger>
                    <FormSelectContent>
                      <FormSelectItem value="sp">São Paulo</FormSelectItem>
                      <FormSelectItem value="rj">Rio de Janeiro</FormSelectItem>
                      <FormSelectItem value="mg">Minas Gerais</FormSelectItem>
                    </FormSelectContent>
                  </FormSelect>
                </div>
              </div>
            </div>

            {/* Seção 4: Documentos */}
            <div>
              <h3 className="font-sora text-sm font-semibold text-main-black mb-4 border-b border-light-white pb-2">
                4. Upload de Documentos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-light-white rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-light-black" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm text-second-black/60">Documento de Identidade</p>
                  <p className="text-xs text-second-black/40 mt-1">PNG, JPG, PDF até 10MB</p>
                </div>
                
                <div className="border-2 border-dashed border-light-white rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-light-black" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm text-second-black/60">Comprovante de Residência</p>
                  <p className="text-xs text-second-black/40 mt-1">PNG, JPG, PDF até 10MB</p>
                </div>
              </div>
            </div>

            {/* Seção 5: Observações */}
            <div>
              <h3 className="font-sora text-sm font-semibold text-main-black mb-4 border-b border-light-white pb-2">
                5. Informações Adicionais
              </h3>
              <div className="space-y-4">
                <div>
                  <FormLabel>Observações gerais</FormLabel>
                  <FormTextarea
                    placeholder="Digite observações, comentários ou informações adicionais"
                    className="mt-1"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormLabel>Data de cadastro</FormLabel>
                    <FormDatePicker className="mt-1" />
                  </div>
                  <div>
                    <FormLabel>Responsável pelo cadastro</FormLabel>
                    <FormSelect>
                      <FormSelectTrigger className="mt-1">
                        <FormSelectValue placeholder="Selecione o responsável" />
                      </FormSelectTrigger>
                      <FormSelectContent>
                        <FormSelectItem value="admin">Administrador</FormSelectItem>
                        <FormSelectItem value="gestor">Gestor</FormSelectItem>
                        <FormSelectItem value="operador">Operador</FormSelectItem>
                      </FormSelectContent>
                    </FormSelect>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* Teste do DynamicTabs */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-main-primary mb-6 font-sora">Componente de Abas Dinâmicas</h2>
          
          <DynamicTabs 
            items={[
              {
                id: 'nf-e',
                label: 'NF-e',
                icon: Receipt,
                content: (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-main-primary mb-4">Nota Fiscal Eletrônica</h3>
                    <p className="text-second-dark">Aqui ficará o conteúdo da Nota Fiscal Eletrônica...</p>
                  </div>
                )
              },
              {
                id: 'entrada',
                label: 'Entrada',
                icon: FileText,
                content: (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-main-primary mb-4">Entrada no Almoxarifado</h3>
                    <p className="text-second-dark">Formulário de entrada no almoxarifado...</p>
                  </div>
                )
              },
              {
                id: 'patrimonios',
                label: 'Patrimônios',
                icon: Package,
                content: (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-main-primary mb-4">Lista de Patrimônios</h3>
                    <p className="text-second-dark">Tabela com todos os patrimônios cadastrados...</p>
                  </div>
                )
              },
              {
                id: 'tombamento',
                label: 'Tombamento / Etiquetas',
                icon: Tag,
                content: (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-main-primary mb-4">Tombamento e Etiquetas</h3>
                    <p className="text-second-dark">Controle de tombamento e impressão de etiquetas...</p>
                  </div>
                )
              },
              {
                id: 'anexos',
                label: 'Anexos',
                icon: Paperclip,
                content: (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-main-primary mb-4">Anexos de Entrada</h3>
                    <p className="text-second-dark">Documentos anexados à entrada...</p>
                  </div>
                )
              },
              {
                id: 'historico',
                label: 'Histórico',
                icon: History,
                content: (
                   <UserActionHistory actions={mockHistoryActions} />
                )
              }
            ]}
            defaultValue="nf-e"
            maxVisibleTabs={4}
          />
        </div>

        {/* Menu de Ações - Teste */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-main-primary font-sora">Menu de Ações - Demonstração</h2>
          </div>
          
          <div className="flex gap-6">
            {/* Abas Dinâmicas */}
            <div className="flex-1">
              <DynamicTabs
                items={[
                  {
                    id: 'detalhes',
                    label: 'Detalhes',
                    icon: FileText,
                    content: (
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-main-dark mb-4">Detalhes do Patrimônio</h3>
                        <p className="text-second-dark">Informações detalhadas sobre o item patrimonial...</p>
                      </div>
                    )
                  },
                  {
                    id: 'anexos',
                    label: 'Anexos',
                    icon: Paperclip,
                    content: (
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-main-dark mb-4">Documentos Anexados</h3>
                        <p className="text-second-dark">Lista de documentos relacionados ao patrimônio...</p>
                      </div>
                    )
                  }
                ]}
                defaultValue="detalhes"
              />
            </div>
            
            {/* Action Menu */}
            <ActionMenu
              collapsed={actionMenuCollapsed}
              actions={[
                {
                  ...defaultActions.save,
                  onClick: () => alert('Patrimônio salvo com sucesso!')
                },
                {
                  ...defaultActions.reject,
                  onClick: () => alert('Patrimônio reprovado')
                },
                {
                  ...defaultActions.discard,
                  onClick: () => alert('Patrimônio descartado')
                }
              ]}
              onBack={() => alert('Voltar para listagem')}
              onToggleCollapse={() => setActionMenuCollapsed(!actionMenuCollapsed)}
            />
          </div>
        </div>

        {/* TabbedModuleCards - Demonstração */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-main-primary mb-6 font-sora">Módulos do Sistema</h2>
          <TabbedModuleCards 
            tabs={tabbedModuleData}
            defaultActiveTab="gestao-bens"
          />
        </div>

        {/* Teste do novo ModuleCard */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-main-primary mb-6 font-sora">Cards sem Abas - Teste</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            <ModuleCard
              id="usuarios"
              title="Usuários"
              description="Gerencie as configurações relacionadas aos usuários do sistema de acordo com a necessidade."
              icon={
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M24 2.5C18.7533 2.5 14.5 6.75329 14.5 12C14.5 17.2467 18.7533 21.5 24 21.5C29.2467 21.5 33.5 17.2467 33.5 12C33.5 6.75329 29.2467 2.5 24 2.5ZM17.5 12C17.5 8.41015 20.4102 5.5 24 5.5C27.5899 5.5 30.5 8.41015 30.5 12C30.5 15.5899 27.5899 18.5 24 18.5C20.4102 18.5 17.5 15.5899 17.5 12Z" fill="#2A5D2A"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M24 24.5C19.3729 24.5 15.1099 25.5518 11.9509 27.3287C8.83899 29.0791 6.50002 31.7321 6.50002 35L6.49989 35.2039C6.49763 37.5276 6.4948 40.444 9.05285 42.5271C10.3118 43.5523 12.073 44.2813 14.4524 44.7629C16.8385 45.2459 19.9485 45.5 24 45.5C28.0516 45.5 31.1615 45.2459 33.5476 44.7629C35.9271 44.2813 37.6883 43.5523 38.9472 42.5271C41.5053 40.444 41.5024 37.5276 41.5002 35.2039L41.5 35C41.5 31.7321 39.1611 29.0791 36.0491 27.3287C32.8902 25.5518 28.6271 24.5 24 24.5ZM9.50002 35C9.50002 33.2973 10.7428 31.4503 13.4217 29.9434C16.0536 28.463 19.7906 27.5 24 27.5C28.2095 27.5 31.9464 28.463 34.5783 29.9434C37.2573 31.4503 38.5 33.2973 38.5 35C38.5 37.6156 38.4194 39.088 37.0528 40.2008C36.3118 40.8043 35.073 41.3933 32.9524 41.8225C30.8385 42.2504 27.9485 42.5 24 42.5C20.0516 42.5 17.1615 42.2504 15.0476 41.8225C12.9271 41.3933 11.6883 40.8043 10.9472 40.2008C9.58065 39.088 9.50002 37.6156 9.50002 35Z" fill="#2A5D2A"/>
                </svg>
              }
              href="/usuarios"
            />
            <ModuleCard
              id="area"
              title="Área"
              description="Configure e organize as áreas de operação do sistema. Defina quais seções ou departamentos têm acesso a dados específicos."
              icon={
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M18 12.5C14.9624 12.5 12.5 14.9624 12.5 18C12.5 21.0376 14.9624 23.5 18 23.5C21.0376 23.5 23.5 21.0376 23.5 18C23.5 14.9624 21.0376 12.5 18 12.5ZM15.5 18C15.5 16.6193 16.6193 15.5 18 15.5C19.3807 15.5 20.5 16.6193 20.5 18C20.5 19.3807 19.3807 20.5 18 20.5C16.6193 20.5 15.5 19.3807 15.5 18Z" fill="#2A5D2A"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M18 24.5C15.6085 24.5 13.3692 24.9815 11.6723 25.8299C10.0652 26.6335 8.5 28.0212 8.5 30L8.49975 30.1249C8.49668 31.1457 8.49151 32.8644 10.1205 34.0435C10.8764 34.5907 11.8738 34.9396 13.1094 35.162C14.3564 35.3863 15.9544 35.5 18 35.5C20.0456 35.5 21.6436 35.3863 22.8906 35.162C24.1262 34.9396 25.1236 34.5907 25.8795 34.0435C27.5085 32.8644 27.5033 31.1457 27.5003 30.1249L27.5 30C27.5 28.0212 25.9348 26.6335 24.3277 25.8299C22.6308 24.9815 20.3915 24.5 18 24.5ZM11.5 30C11.5 29.7697 11.7257 29.1573 13.014 28.5132C14.2125 27.9139 15.9732 27.5 18 27.5C20.0268 27.5 21.7875 27.9139 22.986 28.5132C24.2743 29.1573 24.5 29.7697 24.5 30C24.5 31.2089 24.423 31.3943 24.1205 31.6134C23.8764 31.79 23.3738 32.0269 22.3594 32.2094C21.3564 32.3898 19.9544 32.5 18 32.5C16.0456 32.5 14.6436 32.3898 13.6406 32.2094C12.6262 32.0269 12.1236 31.79 11.8795 31.6134C11.577 31.3943 11.5 31.2089 11.5 30Z" fill="#2A5D2A"/>
                  <path d="M38 25.5C38.8284 25.5 39.5 24.8284 39.5 24C39.5 23.1716 38.8284 22.5 38 22.5H30C29.1716 22.5 28.5 23.1716 28.5 24C28.5 24.8284 29.1716 25.5 30 25.5H38Z" fill="#2A5D2A"/>
                  <path d="M39.5 18C39.5 18.8284 38.8284 19.5 38 19.5H28C27.1716 19.5 26.5 18.8284 26.5 18C26.5 17.1716 27.1716 16.5 28 16.5H38C38.8284 16.5 39.5 17.1716 39.5 18Z" fill="#2A5D2A"/>
                  <path d="M38 31.5C38.8284 31.5 39.5 30.8284 39.5 30C39.5 29.1716 38.8284 28.5 38 28.5H32C31.1716 28.5 30.5 29.1716 30.5 30C30.5 30.8284 31.1716 31.5 32 31.5H38Z" fill="#2A5D2A"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M19.8872 6.5H28.1128C31.7883 6.49997 34.6996 6.49995 36.978 6.80627C39.3229 7.12153 41.2208 7.78576 42.7175 9.28249C44.2142 10.7792 44.8785 12.6771 45.1937 15.022C45.5001 17.3004 45.5 20.2116 45.5 23.8871V24.1128C45.5 27.7883 45.5001 30.6996 45.1937 32.978C44.8785 35.3229 44.2142 37.2208 42.7175 38.7175C41.2208 40.2142 39.3229 40.8785 36.978 41.1937C34.6996 41.5001 31.7884 41.5 28.1129 41.5H19.8872C16.2117 41.5 13.3004 41.5001 11.022 41.1937C8.67711 40.8785 6.77921 40.2142 5.28249 38.7175C3.78576 37.2208 3.12153 35.3229 2.80627 32.978C2.49995 30.6996 2.49997 27.7884 2.5 24.1129V23.8872C2.49997 20.2117 2.49995 17.3004 2.80627 15.022C3.12153 12.6771 3.78576 10.7792 5.28249 9.28249C6.77921 7.78576 8.67711 7.12153 11.022 6.80627C13.3004 6.49995 16.2117 6.49997 19.8872 6.5ZM11.4217 9.77952C9.40952 10.0501 8.25023 10.5574 7.40381 11.4038C6.55739 12.2502 6.05005 13.4095 5.77952 15.4217C5.50319 17.477 5.5 20.1864 5.5 24C5.5 27.8136 5.50319 30.523 5.77952 32.5783C6.05005 34.5905 6.55739 35.7498 7.40381 36.5962C8.25023 37.4426 9.40952 37.95 11.4217 38.2205C13.477 38.4968 16.1864 38.5 20 38.5H28C31.8136 38.5 34.523 38.4968 36.5783 38.2205C38.5905 37.95 39.7498 37.4426 40.5962 36.5962C41.4426 35.7498 41.95 34.5905 42.2205 32.5783C42.4968 30.523 42.5 27.8136 42.5 24C42.5 20.1864 42.4968 17.477 42.2205 15.4217C41.95 13.4095 41.4426 12.2502 40.5962 11.4038C39.7498 10.5574 38.5905 10.0501 36.5783 9.77952C34.523 9.50319 31.8136 9.5 28 9.5H20C16.1864 9.5 13.477 9.50319 11.4217 9.77952Z" fill="#2A5D2A"/>
                </svg>
              }
              href="/area"
            />
            <ModuleCard
              id="fornecedores"
              title="Fornecedores"
              description="Configure e gerencie informações sobre fornecedores."
              icon={
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M14.6141 2.50005C13.0122 2.49951 11.913 2.49914 10.936 2.76696C8.88478 3.32928 7.16877 4.73608 6.21509 6.63719C5.76087 7.54266 5.54565 8.6206 5.23202 10.1915L3.99281 16.3878C3.5296 18.7038 4.1643 20.9436 5.50002 22.6231L5.50002 28.1129C5.49999 31.7885 5.49996 34.6997 5.80629 36.9781C6.12155 39.323 6.78578 41.2209 8.28251 42.7176C9.77923 44.2143 11.6771 44.8786 14.022 45.1938C16.3004 45.5002 19.2117 45.5001 22.8872 45.5001H25.1128C28.7884 45.5001 31.6996 45.5002 33.9781 45.1938C36.3229 44.8786 38.2208 44.2143 39.7175 42.7176C41.2143 41.2209 41.8785 39.323 42.1938 36.9781C42.5001 34.6997 42.5001 31.7885 42.5 28.113V22.6231C43.8358 20.9437 44.4705 18.7039 44.0073 16.3878L42.7681 10.1915C42.4544 8.6206 42.2392 7.54266 41.785 6.63719C40.8313 4.73608 39.1153 3.32928 37.0641 2.76696C36.0871 2.49914 34.9879 2.49951 33.386 2.50005H14.6141ZM36.537 25.5001C37.5947 25.5001 38.5943 25.2872 39.5 24.9048V28.0001C39.5 31.8137 39.4968 34.5231 39.2205 36.5784C38.95 38.5906 38.4426 39.7499 37.5962 40.5963C36.7498 41.4427 35.5905 41.9501 33.5783 42.2206C32.6874 42.3404 31.6735 42.4088 30.5 42.4479V36.9356C30.5001 36.0561 30.5001 35.2974 30.4437 34.6748C30.384 34.0164 30.2519 33.3645 29.8971 32.7501C29.5022 32.066 28.9341 31.4979 28.25 31.103C27.6356 30.7482 26.9837 30.6161 26.3253 30.5565C25.7027 30.5 24.9441 30.5001 24.0645 30.5001H23.9356C23.056 30.5001 22.2973 30.5 21.6747 30.5565C21.0164 30.6161 20.3644 30.7482 19.75 31.103C19.0659 31.4979 18.4979 32.066 18.1029 32.7501C17.7482 33.3645 17.6161 34.0164 17.5564 34.6748C17.5 35.2974 17.5 36.0561 17.5 36.9356L17.5 42.4479C16.3266 42.4088 15.3127 42.3404 14.4217 42.2206C12.4095 41.9501 11.2502 41.4427 10.4038 40.5963C9.55741 39.7499 9.05007 38.5906 8.77954 36.5784C8.50321 34.5231 8.50002 31.8137 8.50002 28.0001V24.9048C9.40578 25.2872 10.4054 25.5001 11.4631 25.5001C14.011 25.5001 16.2889 24.2433 17.6762 22.2917C19.0952 24.228 21.3863 25.5001 23.9996 25.5001C26.6132 25.5001 28.9045 24.2278 30.3235 22.2911C31.7107 24.2431 33.9889 25.5001 36.537 25.5001ZM20.5 42.4961C21.2768 42.4999 22.1082 42.5001 23 42.5001H25C25.8918 42.5001 26.7232 42.4999 27.5 42.4961V37.0001C27.5 36.0379 27.4986 35.4165 27.4559 34.9456C27.4151 34.4953 27.3462 34.3318 27.2991 34.2501C27.1674 34.0221 26.9781 33.8327 26.75 33.7011C26.6683 33.6539 26.5048 33.585 26.0545 33.5442C25.5836 33.5015 24.9622 33.5001 24 33.5001C23.0378 33.5001 22.4164 33.5015 21.9455 33.5442C21.4952 33.585 21.3317 33.6539 21.25 33.7011C21.022 33.8327 20.8326 34.0221 20.701 34.2501C20.6538 34.3318 20.5849 34.4953 20.5441 34.9456C20.5015 35.4165 20.5 36.0379 20.5 37.0001V42.4961ZM17.3421 5.5001H14.8354C12.9265 5.5001 12.2654 5.51321 11.7292 5.66022C10.4984 5.99761 9.46881 6.84169 8.89661 7.98235C8.64729 8.47936 8.50477 9.12508 8.1304 10.9969L6.93456 16.9761C6.36301 19.8339 8.54879 22.5001 11.4631 22.5001C13.8358 22.5001 15.8224 20.7022 16.0584 18.3414L16.1956 16.9696L16.2036 16.8856L17.3421 5.5001ZM19.1825 17.2501L20.3575 5.5001H27.6421L28.8105 17.1841C29.0952 20.0303 26.8601 22.5001 23.9996 22.5001C21.1613 22.5001 18.9387 20.0684 19.1825 17.2501ZM36.2709 5.66022C35.7347 5.51321 35.0735 5.5001 33.1646 5.5001H30.6575L31.9416 18.3414C32.1777 20.7022 34.1643 22.5001 36.537 22.5001C39.4513 22.5001 41.6371 19.8339 41.0655 16.9761L39.8697 10.9969C39.4953 9.12508 39.3528 8.47936 39.1035 7.98235C38.5313 6.84169 37.5017 5.99761 36.2709 5.66022Z" fill="#2A5D2A"/>
                </svg>
              }
              href="/fornecedores"
            />
            <ModuleCard
              id="seguranca"
              title="Medidas de segurança"
              description="Configure e gerencie as medidas de segurança implementadas para a proteção dos dados."
              icon={<Shield size={48} />}
              href="/seguranca"
            />
          </div>
        </div>

        {/* Exemplo do AssetInfoCard */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-main-primary mb-6 font-sora">Exemplo do AssetInfoCard</h2>
          <AssetInfoCard
            type="nfe"
            documentNumber="121212121"
            entryDate="12/05/2025"
            statusOrDestination="Tombamento"
            almoxarifadoDestino="Almoxarifado Central"
            timelineSteps={[
              {
                label: "NF cadastrada",
                icon: <Receipt size={30} />,
                isCompleted: true
              },
              {
                label: "Recebido",
                icon: <CheckCircle size={30} />,
                isCompleted: true
              },
              {
                label: "Aguardando tombo",
                icon: <AlertTriangle size={30} />,
                isCompleted: false
              }
            ]}
          />
        </div>

        {/* Histórico de Ações dos Usuários */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-main-primary mb-6 font-sora">Histórico de Ações</h2>
          <UserActionHistory actions={mockHistoryActions} />
        </div>
        
    </>
  );
};
export default Index;
