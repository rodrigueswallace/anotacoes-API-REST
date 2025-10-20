
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useScrollShadows } from '@/hooks/use-scroll-shadows';
import {
  Building2,
  Home,
  Scale,
  GraduationCap,
  HelpCircle,
  Package, // For mobile assets
  Building, // For real estate
  Sparkles, // For smart assistance
  FileText, // For receipt
} from 'lucide-react';
import { PatrimonioIcon } from '@/components/ui/patrimonio-icon';
import { InventarioIcon } from '@/components/ui/inventario-icon';
import { RelatoriosIcon } from '@/components/ui/relatorios-icon';
import { EcommerceIcon } from '@/components/ui/ecommerce-icon';
import { ConfiguracoesIcon } from '@/components/ui/configuracoes-icon';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Ícone personalizado para Recepção de NFe
const RecepcaoNFeIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 25 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      opacity="0.5" 
      d="M18.4665 6.55812L16.6369 4.72848L16.6369 4.72848C15.0913 3.18295 14.3186 2.41018 13.316 2.12264C12.3134 1.83509 11.2485 2.08083 9.11875 2.57231L7.89057 2.85574C6.0988 3.26922 5.20292 3.47597 4.58944 4.08944C3.97597 4.70292 3.76922 5.5988 3.35574 7.39057L3.35574 7.39057L3.07231 8.61875C2.58083 10.7485 2.33509 11.8134 2.62264 12.816C2.91018 13.8186 3.68295 14.5914 5.22848 16.1369L7.05812 17.9665L7.05813 17.9665C9.74711 20.6555 11.0916 22 12.7623 22C14.433 22 15.7775 20.6555 18.4665 17.9665L18.4665 17.9665L18.4665 17.9665C21.1555 15.2775 22.5 13.933 22.5 12.2623C22.5 10.5916 21.1555 9.24711 18.4665 6.55813L18.4665 6.55812Z" 
      fill="currentColor" 
      fillOpacity="0.75"
    />
    <path 
      d="M11.6469 14.3284C10.9739 13.6555 10.9796 12.6899 11.382 11.9247C11.1809 11.6325 11.2103 11.2295 11.4701 10.9697C11.7289 10.7108 12.13 10.6807 12.4219 10.8795C12.7617 10.6988 13.1351 10.6033 13.5073 10.6068C13.9215 10.6107 14.2541 10.9497 14.2502 11.3639C14.2462 11.7781 13.9073 12.1107 13.4931 12.1068C13.3162 12.1051 13.0837 12.1845 12.8843 12.3839C12.4968 12.7714 12.5987 13.1589 12.7075 13.2678C12.8164 13.3766 13.2039 13.4785 13.5914 13.091C14.3754 12.307 15.7291 12.0467 16.5966 12.9142C17.2696 13.5872 17.2639 14.5528 16.8614 15.318C17.0625 15.6102 17.0332 16.0132 16.7734 16.273C16.5145 16.5319 16.1133 16.5619 15.8214 16.3631C15.3645 16.6059 14.8448 16.6969 14.3492 16.595C13.9435 16.5117 13.6822 16.1152 13.7655 15.7094C13.8489 15.3037 14.2454 15.0424 14.6512 15.1257C14.8283 15.1622 15.1139 15.104 15.3592 14.8588C15.7467 14.4712 15.6448 14.0837 15.5359 13.9749C15.4271 13.866 15.0396 13.7641 14.6521 14.1517C13.868 14.9357 12.5143 15.1959 11.6469 14.3284Z" 
      fill="currentColor" 
      fillOpacity="0.75"
    />
    <path 
      d="M10.5211 10.2931C11.3022 9.51207 11.3022 8.24574 10.5211 7.46469C9.7401 6.68364 8.47377 6.68364 7.69272 7.46469C6.91167 8.24574 6.91167 9.51207 7.69272 10.2931C8.47377 11.0742 9.7401 11.0742 10.5211 10.2931Z" 
      fill="currentColor" 
      fillOpacity="0.75"
    />
  </svg>
);

// Ícone personalizado para Patrimônio móvel
const PatrimonioIconCustom = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 25 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M8.92229 20.6181C10.6779 21.5395 11.5557 22.0001 12.5 22.0001V12.0001L3.13802 7.07275C3.12423 7.09491 3.1107 7.11727 3.0974 7.13986C2.5 8.15436 2.5 9.41678 2.5 11.9416V12.0586C2.5 14.5834 2.5 15.8459 3.0974 16.8604C3.69479 17.8749 4.77063 18.4395 6.92229 19.5686L8.92229 20.6181Z" 
      fill="currentColor" 
      fillOpacity="0.75"
    />
    <path 
      opacity="0.7" 
      d="M18.0774 4.43152L16.0774 3.38197C14.3218 2.46066 13.444 2 12.4997 2C11.5554 2 10.6776 2.46066 8.92197 3.38197L6.92197 4.43152C4.81821 5.53552 3.74291 6.09982 3.1377 7.07264L12.4997 12L21.8617 7.07264C21.2564 6.09982 20.1811 5.53552 18.0774 4.43152Z" 
      fill="currentColor" 
      fillOpacity="0.75"
    />
    <path 
      opacity="0.5" 
      d="M21.9026 7.13986C21.8893 7.11727 21.8758 7.09491 21.862 7.07275L12.5 12.0001V22.0001C13.4443 22.0001 14.3221 21.5395 16.0777 20.6181L18.0777 19.5686C20.2294 18.4395 21.3052 17.8749 21.9026 16.8604C22.5 15.8459 22.5 14.5834 22.5 12.0586V11.9416C22.5 9.41678 22.5 8.15436 21.9026 7.13986Z" 
      fill="currentColor"
    />
    <path 
      d="M6.82334 4.48382C6.85617 4.46658 6.88926 4.44922 6.92261 4.43172L8.41614 3.64795L17.5169 8.65338L21.5406 6.64152C21.6783 6.79745 21.798 6.96175 21.9029 7.13994C22.0525 7.39396 22.1646 7.66352 22.2487 7.96455L18.2503 9.96373V13.0002C18.2503 13.4144 17.9145 13.7502 17.5003 13.7502C17.0861 13.7502 16.7503 13.4144 16.7503 13.0002V10.7137L13.2503 12.4637V21.9042C12.9934 21.9682 12.7492 22.0002 12.5003 22.0002C12.2515 22.0002 12.0072 21.9682 11.7503 21.9042V12.4637L2.75195 7.96455C2.83601 7.66352 2.94813 7.39396 3.09771 7.13994C3.20264 6.96175 3.32232 6.79745 3.46001 6.64152L12.5003 11.1617L15.8865 9.46857L6.82334 4.48382Z" 
      fill="currentColor"
    />
  </svg>
);

// Ícone personalizado para Inventário
const InventarioIconCustom = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 25 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      opacity="0.5" 
      d="M21.5 15.9983V9.99826C21.5 7.16983 21.5 5.75562 20.6213 4.87694C19.8529 4.10856 18.675 4.01211 16.5 4H8.5C6.32497 4.01211 5.14706 4.10856 4.37868 4.87694C3.5 5.75562 3.5 7.16983 3.5 9.99826V15.9983C3.5 18.8267 3.5 20.2409 4.37868 21.1196C5.25736 21.9983 6.67157 21.9983 9.5 21.9983H15.5C18.3284 21.9983 19.7426 21.9983 20.6213 21.1196C21.5 20.2409 21.5 18.8267 21.5 15.9983Z" 
      fill="currentColor" 
      fillOpacity="0.75"
    />
    <path 
      d="M8.5 3.5C8.5 2.67157 9.17157 2 10 2H15C15.8284 2 16.5 2.67157 16.5 3.5V4.5C16.5 5.32843 15.8284 6 15 6H10C9.17157 6 8.5 5.32843 8.5 4.5V3.5Z" 
      fill="currentColor" 
      fillOpacity="0.75"
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M6.75 10.5C6.75 10.0858 7.08579 9.75 7.5 9.75H8C8.41421 9.75 8.75 10.0858 8.75 10.5C8.75 10.9142 8.41421 11.25 8 11.25H7.5C7.08579 11.25 6.75 10.9142 6.75 10.5ZM10.25 10.5C10.25 10.0858 10.5858 9.75 11 9.75H17.5C17.9142 9.75 18.25 10.0858 18.25 10.5C18.25 10.9142 17.9142 11.25 17.5 11.25H11C10.5858 11.25 10.25 10.9142 10.25 10.5ZM6.75 14C6.75 13.5858 7.08579 13.25 7.5 13.25H8C8.41421 13.25 8.75 13.5858 8.75 14C8.75 14.4142 8.41421 14.75 8 14.75H7.5C7.08579 14.75 6.75 14.4142 6.75 14ZM10.25 14C10.25 13.5858 10.5858 13.25 11 13.25H17.5C17.9142 13.25 18.25 13.5858 18.25 14C18.25 14.4142 17.9142 14.75 17.5 14.75H11C10.5858 14.75 10.25 14.4142 10.25 14ZM6.75 17.5C6.75 17.0858 7.08579 16.75 7.5 16.75H8C8.41421 16.75 8.75 17.0858 8.75 17.5C8.75 17.9142 8.41421 18.25 8 18.25H7.5C7.08579 18.25 6.75 17.9142 6.75 17.5ZM10.25 17.5C10.25 17.0858 10.5858 16.75 11 16.75H17.5C17.9142 16.75 18.25 17.0858 18.25 17.5C18.25 17.9142 17.9142 18.25 17.5 18.25H11C10.5858 18.25 10.25 17.9142 10.25 17.5Z" 
      fill="currentColor"
    />
  </svg>
);

// Ícone personalizado para Dispositivos legais
const DispositivosLegaisIconCustom = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 25 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M14.723 5.5H19.1311C19.7407 5.5 20.2332 5.5945 20.2332 6.20406C20.2332 6.81362 19.7407 7 19.1311 7H14.723C14.5439 7.88851 14.4303 8.14873 13.621 8.5L13.5 20H19.0102C19.6198 20 20.2332 19.9209 20.2332 20.5305C20.2332 21.14 19.7407 21.5 19.1311 21.5H12.5H5.88785C5.27829 21.5 4.80472 21.14 4.80472 20.5305C4.80472 19.9209 5.29719 20 5.90675 20H11.4169V8.5C10.6076 8.14528 10.494 7.88507 10.3149 7H5.90675C5.29719 7 4.80472 6.81362 4.80472 6.20406C4.80472 5.5945 5.29719 5.5 5.90675 5.5H10.3149C10.8177 4.83189 11.6167 4 12.5189 4C13.4212 4 14.2202 4.83189 14.723 5.5Z" 
      fill="currentColor" 
      fillOpacity="0.75"
    />
    <path 
      opacity="0.5" 
      d="M16.6378 14.6122H21.6279L19.1311 10.3349L16.6378 14.6122ZM19.1311 17.9183C16.9649 17.9183 15.1638 16.7474 14.7919 15.2011C14.7023 14.8223 14.8263 14.4331 15.0226 14.0956L18.3012 8.47525C18.4734 8.17908 18.7902 8 19.1311 8C19.4721 8 19.7889 8.18252 19.9611 8.47525L23.2396 14.0956C23.4359 14.4331 23.5599 14.8223 23.4704 15.2011C23.0984 16.7474 21.2973 17.9183 19.1311 17.9183ZM5.86543 10.3349L3.37208 14.6122H8.36222L5.86543 10.3349ZM1.52962 15.2011C1.44008 14.8223 1.56406 14.4331 1.76036 14.0956L5.0389 8.47525C5.2111 8.17908 5.52793 8 5.86887 8C6.20981 8 6.52664 8.18252 6.69884 8.47525L9.97738 14.0956C10.1737 14.4331 10.2977 14.8223 10.2081 15.2011C9.83274 16.7474 8.03161 17.9183 5.86543 17.9183C3.69925 17.9183 1.90156 16.7474 1.52962 15.2011Z" 
      fill="currentColor" 
      fillOpacity="0.75"
    />
  </svg>
);

// Ícone personalizado para Treinamento
const TreinamentoIconCustom = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 25 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      opacity="0.5" 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M2.5 12C2.5 10.7632 2.5 9.68872 2.52644 8.75H22.4736C22.5 9.68872 22.5 10.7632 22.5 12C22.5 16.714 22.5 19.071 21.0355 20.5355C19.5711 22 17.214 22 12.5 22C7.78595 22 5.42893 22 3.96447 20.5355C2.5 19.071 2.5 16.714 2.5 12Z" 
      fill="currentColor" 
      fillOpacity="0.75"
    />
    <path 
      d="M15.5 14.5C15.5 13.8666 14.838 13.4395 13.514 12.5852C12.1719 11.7193 11.5008 11.2863 11.0004 11.6042C10.5 11.9221 10.5 12.7814 10.5 14.5C10.5 16.2186 10.5 17.0779 11.0004 17.3958C11.5008 17.7137 12.1719 17.2807 13.514 16.4148C14.838 15.5605 15.5 15.1334 15.5 14.5Z" 
      fill="currentColor" 
      fillOpacity="0.75"
    />
    <path 
      d="M12.4998 2C14.345 2 15.8291 2 17.0399 2.08783L13.5984 7.25002H8.90121L12.4012 2H12.4998Z" 
      fill="currentColor"
    />
    <path 
      d="M3.96429 3.46447C5.21666 2.2121 7.12176 2.03072 10.5955 2.00445L7.09844 7.25002H2.604C2.75125 5.48593 3.10663 4.32213 3.96429 3.46447Z" 
      fill="currentColor"
    />
    <path 
      d="M22.3956 7.25002C22.2484 5.48593 21.893 4.32213 21.0354 3.46447C20.438 2.86714 19.6922 2.51345 18.6985 2.30403L15.4012 7.25002H22.3956Z" 
      fill="currentColor"
    />
  </svg>
);

// Ícone personalizado para Suporte
const SuporteIconCustom = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 25 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      opacity="0.5" 
      d="M15.0562 15.5477L14.6007 16.0272C14.6007 16.0272 13.5181 17.167 10.5631 14.0559C7.60812 10.9448 8.6907 9.80507 8.6907 9.80507L8.97752 9.50311C9.68407 8.75924 9.75068 7.56497 9.13424 6.6931L7.87326 4.90961C7.11028 3.8305 5.63596 3.68795 4.76145 4.60864L3.19185 6.26114C2.75823 6.71766 2.46765 7.30945 2.50289 7.96594C2.59304 9.64546 3.31071 13.259 7.31536 17.4752C11.5621 21.9462 15.5468 22.1239 17.1763 21.9631C17.6917 21.9122 18.1399 21.6343 18.5011 21.254L19.9217 19.7584C20.8806 18.7489 20.6102 17.0182 19.3833 16.312L17.4728 15.2123C16.6672 14.7486 15.6858 14.8848 15.0562 15.5477Z" 
      fill="currentColor" 
      fillOpacity="0.75"
    />
    <path 
      d="M17.5 12C20.2614 12 22.5 9.76142 22.5 7C22.5 4.23858 20.2614 2 17.5 2C14.7386 2 12.5 4.23858 12.5 7C12.5 7.79984 12.6878 8.55582 13.0217 9.22624C13.1105 9.4044 13.14 9.60803 13.0886 9.80031L12.7908 10.9133C12.6615 11.3965 13.1035 11.8385 13.5867 11.7092L14.6997 11.4114C14.892 11.36 15.0956 11.3895 15.2738 11.4783C15.9442 11.8122 16.7002 12 17.5 12Z" 
      fill="currentColor" 
      fillOpacity="0.75"
    />
  </svg>
);

const navigationSections = [
  {
    title: 'GESTÃO DE BENS MÓVEIS',
    icon: Package,
    items: [
      { title: 'Recepção de nota fiscal', url: '/recepcao-nota-fiscal', icon: RecepcaoNFeIcon },
      { title: 'Patrimônio móvel', url: '/gestao-bens-moveis/patrimonio-movel', icon: PatrimonioIconCustom },
      { title: 'Inventário', url: '/gestao-bens-moveis/inventario', icon: InventarioIconCustom },
      { title: 'Relatórios', url: '/gestao-bens-moveis/relatorios', icon: RelatoriosIcon },
      { title: 'E-commerce', url: '/gestao-bens-moveis/e-commerce', icon: EcommerceIcon },
      { title: 'Configurações', url: '/gestao-bens-moveis/configuracoes', icon: ConfiguracoesIcon },
    ],
  },
  {
    title: 'GESTÃO DE IMÓVEIS',
    icon: Building,
    items: [
      { title: 'Patrimônio imóvel', url: '/imoveis/patrimonio-movel', icon: PatrimonioIconCustom },
      { title: 'Inventário', url: '/imoveis/inventario', icon: InventarioIconCustom },
      { title: 'Relatórios', url: '/imoveis/relatorios', icon: RelatoriosIcon },
      { title: 'Configurações', url: '/imoveis/configuracoes', icon: ConfiguracoesIcon },
    ],
  },
  {
    title: 'SMART ASSISTANCE ®',
    icon: Sparkles,
    items: [
      { title: 'Dispositivos legais', url: '/smart/dispositivos-legais', icon: DispositivosLegaisIconCustom },
      { title: 'Treinamento', url: '/smart/treinamento', icon: TreinamentoIconCustom },
      { title: 'Design System', url: '/index', icon: Building2 },
      { title: 'Suporte', url: '/smart/suporte', icon: SuporteIconCustom },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';
  const { scrollRef, showTopShadow, showBottomShadow } = useScrollShadows();

  const isActive = (path: string) => {
    // Para rota exata ou sub-rotas
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
      <Sidebar
        className={`
          fixed left-0 h-screen bg-white border-r border-border
          transition-all duration-300 ease-in-out z-30 pt-12
          ${collapsed ? 'w-16' : 'w-[240px]'}
        `}
        collapsible="icon"
      >
        <SidebarContent className="flex flex-col h-full relative">
          {/* Top shadow indicator */}
          <div 
            className={`
              absolute top-0 left-0 right-0 h-8 z-20 pointer-events-none
              transition-opacity duration-300 ease-in-out
              ${showTopShadow ? 'opacity-100' : 'opacity-0'}
            `}
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)'
            }}
          />
          
          {/* Bottom shadow indicator */}
          <div 
            className={`
              absolute bottom-[92px] left-0 right-0 h-8 z-20 pointer-events-none
              transition-opacity duration-300 ease-in-out
              ${showBottomShadow ? 'opacity-100' : 'opacity-0'}
            `}
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)'
            }}
          />
          
          <ScrollArea className="flex-1" viewportRef={scrollRef}>
            <div>
              {navigationSections.map((section, index) => (
                <SidebarGroup key={index}>
                  <SidebarGroupLabel className={`
                    px-4 py-2 text-xs font-bold uppercase tracking-wider
                    text-primary bg-light-black text-primary flex items-center justify-center
                    ${collapsed ? 'px-2 !opacity-100 !-mt-0' : 'justify-start'}
                  `}>
                    {collapsed ? (
                      <section.icon className="h-4 w-4 text-primary" />
                    ) : (
                      section.title
                    )}
                  </SidebarGroupLabel>
                  
                  <SidebarGroupContent className="mt-1">
                    <SidebarMenu className="space-y-1">
                      {section.items.map((item) => (
                        <SidebarMenuItem key={item.url}>
                          {collapsed ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  asChild
                                 className={`
                                    h-9 rounded-md transition-all duration-200
                                    hover:bg-light-black hover:text-primary
                                    data-[active=true]:bg-light-black data-[active=true]:text-primary
                                    data-[active=true]:font-medium
                                    group-data-[collapsible=icon]:!h-9
                                    px-0 justify-center
                                  `}
                                >
                                  <NavLink
                                    to={item.url}
                                    className={({ isActive }) => `
                                      flex items-center justify-center w-full h-full text-sm font-normal
                                      ${isActive 
                                        ? 'text-main-dark font-medium' 
                                        : 'text-main-black hover:text-main-dark'
                                      }
                                    `}
                                  >
                                     <item.icon 
                                       className={`
                                         !h-5 !w-5 flex-shrink-0 transition-colors duration-200
                                         ${isActive(item.url) ? 'text-main-primary' : 'text-second-dark hover:text-main-primary'}
                                       `}
                                     />
                                  </NavLink>
                                </SidebarMenuButton>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="ml-2">
                                <p>{item.title}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <SidebarMenuButton
                              asChild
                              className={`
                                h-9 px-4 py-1.5 rounded-md transition-all duration-200
                                hover:bg-light-black hover:text-primary
                                data-[active=true]:bg-light-black data-[active=true]:text-primary
                                data-[active=true]:font-medium
                                group-data-[collapsible=icon]:!h-9
                              `}
                            >
                              <NavLink
                                to={item.url}
                                className={({ isActive }) => `
                                  flex items-center gap-3 text-sm font-normal
                                  ${isActive 
                                    ? 'text-main-dark font-medium' 
                                    : 'text-main-black hover:text-main-dark'
                                  }
                                `}
                              >
                                 <item.icon 
                                   className={`
                                     !h-5 !w-5 flex-shrink-0 transition-colors duration-200
                                     ${isActive(item.url) ? 'text-main-primary' : 'text-second-dark hover:text-main-primary'}
                                   `}
                                 />
                                <span className="truncate">{item.title}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          )}
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </div>
          </ScrollArea>

          {/* Footer com logotipo */}
          <div className="h-[92px] bg-white border-t border-border px-1 flex items-center justify-center mt-auto">
            {!collapsed ? (
              <img 
                src="/lovable-uploads/b631da4a-90a2-4f8d-9d87-a48a3e0bc76e.png" 
                alt="Secretaria de Administração e Gestão" 
                className="h-16 w-auto object-contain"
              />
            ) : (
              <img 
                src="/lovable-uploads/e1c58feb-782a-41c5-ae24-a9e2bfd000e2.png" 
                alt="Brasão da Secretaria" 
                className="h-8 w-auto object-contain"
              />
            )}
          </div>
        </SidebarContent>
      </Sidebar>
  );
}
