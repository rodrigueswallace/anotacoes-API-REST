import React, { useEffect, useState } from 'react';
import { TabbedModuleCards } from '@/components/ui/tabbed-module-cards';
import { Building2, Home as HomeIcon, Brain, FileText, Package, BarChart3, ShoppingCart, Settings } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Home = () => {
  const tabbedModuleData = [
    {
      id: 'gestao-bens-moveis',
      label: 'Gestão de bens móveis',
      icon: <Building2 size={20} />,
      cards: [
        {
          id: 'recepcao-nf',
          title: 'Recepção da nota fiscal',
          icon: <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M22.4766 5.59776C21.2485 5.76006 19.732 6.10839 17.5748 6.60622L15.1184 7.17307C13.2964 7.59354 12.0416 7.88503 11.0832 8.21396C10.158 8.53151 9.63454 8.84457 9.23955 9.23955C8.84457 9.63454 8.53151 10.158 8.21396 11.0832C7.88503 12.0416 7.59354 13.2964 7.17307 15.1184L6.60622 17.5748C6.10839 19.732 5.76006 21.2485 5.59776 22.4766C5.43965 23.673 5.4761 24.4825 5.68716 25.2184C5.89821 25.9543 6.29633 26.6601 7.06451 27.5909C7.85303 28.5463 8.95214 29.6476 10.5176 31.2131L14.1769 34.8724C16.8959 37.5914 18.8307 39.5216 20.494 40.7907C22.1228 42.0334 23.3138 42.5 24.5246 42.5C25.7355 42.5 26.9265 42.0334 28.5553 40.7907C30.2186 39.5216 32.1534 37.5914 34.8724 34.8724C37.5914 32.1534 39.5216 30.2186 40.7907 28.5553C42.0334 26.9265 42.5 25.7355 42.5 24.5246C42.5 23.3138 42.0334 22.1228 40.7907 20.494C39.5216 18.8307 37.5914 16.8959 34.8724 14.1769L31.2131 10.5176C29.6476 8.95214 28.5463 7.85303 27.5909 7.06451C26.6601 6.29633 25.9543 5.89821 25.2184 5.68716C24.4825 5.4761 23.673 5.43965 22.4766 5.59776ZM22.0836 2.62362C23.5182 2.43403 24.7762 2.43938 26.0455 2.80341C27.3148 3.16744 28.3844 3.82963 29.5005 4.75076C30.5794 5.6412 31.7809 6.84277 33.282 8.34386L37.0736 12.1355C39.6949 14.7567 41.7702 16.832 43.1758 18.6743C44.6221 20.5699 45.5 22.3941 45.5 24.5246C45.5 26.6552 44.6221 28.4794 43.1758 30.375C41.7702 32.2173 39.6948 34.2926 37.0736 36.9138L36.9138 37.0736C34.2926 39.6948 32.2173 41.7702 30.375 43.1758C28.4794 44.6221 26.6552 45.5 24.5246 45.5C22.3941 45.5 20.5699 44.6221 18.6743 43.1758C16.832 41.7701 14.7567 39.6948 12.1354 37.0735L8.34391 33.282C6.84279 31.7809 5.64121 30.5794 4.75076 29.5005C3.82963 28.3844 3.16744 27.3148 2.80341 26.0455C2.43938 24.7762 2.43403 23.5182 2.62362 22.0836C2.8069 20.6967 3.18901 19.0409 3.66638 16.9724L4.26771 14.3667C4.66604 12.6405 4.99086 11.2328 5.37643 10.1094C5.7791 8.93612 6.28626 7.9502 7.11823 7.11823C7.9502 6.28627 8.93612 5.7791 10.1094 5.37643C11.2328 4.99086 12.6405 4.66604 14.3667 4.2677L16.9724 3.66638C19.0409 3.18901 20.6967 2.8069 22.0836 2.62362ZM18.9818 15.9904C18.0055 15.0141 16.4226 15.0141 15.4463 15.9904C14.47 16.9667 14.47 18.5497 15.4463 19.526C16.4226 20.5023 18.0055 20.5023 18.9818 19.526C19.9581 18.5497 19.9581 16.9667 18.9818 15.9904ZM13.325 13.8691C15.4729 11.7212 18.9553 11.7212 21.1032 13.8691C23.251 16.017 23.251 19.4994 21.1032 21.6473C18.9553 23.7952 15.4729 23.7952 13.325 21.6473C11.1771 19.4994 11.1771 16.017 13.325 13.8691ZM25.9858 24.2139C25.632 24.2106 25.167 24.3694 24.7682 24.7682C23.9931 25.5432 24.1969 26.3183 24.4146 26.5359C24.6323 26.7536 25.4073 26.9574 26.1824 26.1824C27.7504 24.6143 30.4578 24.0939 32.1928 25.8288C33.5387 27.1748 33.5273 29.1059 32.7224 30.6364C33.1246 31.2207 33.066 32.0267 32.5463 32.5463C32.0285 33.0642 31.2262 33.1242 30.6424 32.7265C29.7286 33.2121 28.6891 33.3941 27.698 33.1905C26.8865 33.0237 26.3639 32.2307 26.5306 31.4192C26.6974 30.6078 27.4904 30.0851 28.3019 30.2519C28.6562 30.3247 29.2274 30.2084 29.7179 29.7179C30.493 28.9428 30.2891 28.1678 30.0715 27.9501C29.8538 27.7325 29.0788 27.5286 28.3037 28.3037C26.7356 29.8718 24.0282 30.3922 22.2933 28.6572C20.9474 27.3113 20.9588 25.3802 21.7637 23.8497C21.3614 23.2654 21.4201 22.4594 21.9397 21.9397C22.4575 21.422 23.2595 21.3619 23.8433 21.7593C24.523 21.3981 25.2699 21.207 26.0141 21.214C26.8425 21.2219 27.5077 21.8997 27.4999 22.7281C27.4921 23.5565 26.8142 24.2217 25.9858 24.2139Z" fill="white"/></svg>,
          href: '/recepcao-nota-fiscal'
        },
        {
          id: 'patrimonio-movel',
          title: 'Patrimônio móvel',
          icon: <Package size={48} className="text-white" />,
          href: '/gestao-bens-moveis/patrimonio-movel'
        },
        {
          id: 'inventario',
          title: 'Inventário',
          icon: <FileText size={48} className="text-white" />,
          href: '/gestao-bens-moveis/inventario'
        },
        {
          id: 'relatorios',
          title: 'Relatórios',
          icon: <BarChart3 size={48} className="text-white" />,
          href: '/gestao-bens-moveis/relatorios'
        },
        {
          id: 'ecommerce',
          title: 'E-commerce',
          icon: <ShoppingCart size={48} className="text-white" />,
          href: '/gestao-bens-moveis/e-commerce'
        },
        {
          id: 'configuracoes',
          title: 'Configurações',
          icon: <Settings size={48} className="text-white" />,
          href: '/gestao-bens-moveis/configuracoes'
        }
      ]
    },
    {
      id: 'gestao-imoveis',
      label: 'Gestão de imóveis',
      icon: <HomeIcon size={20} />,
      cards: [
        {
          id: 'patrimonio-imovel',
          title: 'Patrimônio imóvel',
          icon: <HomeIcon size={48} className="text-white" />,
          href: '/gestao-imoveis/patrimonio-imovel'
        },
        {
          id: 'inventario-imoveis',
          title: 'Inventário',
          icon: <FileText size={48} className="text-white" />,
          href: '/gestao-imoveis/inventario'
        },
        {
          id: 'relatorios-imoveis',
          title: 'Relatórios',
          icon: <BarChart3 size={48} className="text-white" />,
          href: '/gestao-imoveis/relatorios'
        },
        {
          id: 'configuracoes-imoveis',
          title: 'Configurações',
          icon: <Settings size={48} className="text-white" />,
          href: '/gestao-imoveis/configuracoes'
        }
      ]
    },
    {
      id: 'smart-assistance',
      label: 'Smart Assistance',
      icon: <Brain size={20} />,
      cards: [
        {
          id: 'dispositivos-legais',
          title: 'Dispositivos legais',
          icon: <FileText size={48} className="text-white" />,
          href: '/smart/dispositivos-legais'
        },
        {
          id: 'treinamento',
          title: 'Treinamento',
          icon: <Brain size={48} className="text-white" />,
          href: '/smart/treinamento'
        },
        {
          id: 'design-system',
          title: 'Design System',
          icon: <Settings size={48} className="text-white" />,
          href: '/index'
        },
        {
          id: 'suporte',
          title: 'Suporte',
          icon: <Settings size={48} className="text-white" />,
          href: '/smart/suporte'
        }
      ]
    }
  ];

  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('gestao-bens-moveis');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'smart-assistance') {
      setActiveTab('smart-assistance');
    } else {
      setActiveTab('gestao-bens-moveis');
    }
  }, [searchParams]);

  return (
    <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-6 pb-6">
      <div className="w-full space-y-8 lg:space-y-12">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 lg:gap-8">
          <div className="flex-1 text-center lg:text-left">
            <h1 
              className="text-main-primary mb-3 lg:mb-4"
              style={{ 
                fontFamily: 'var(--font-sora)', 
                fontSize: 'clamp(28px, 4vw, 38px)', 
                fontWeight: '600' 
              }}
            >
              Bem vindo ao Heridium!
            </h1>
            <p 
              className="text-second-dark"
              style={{ 
                fontFamily: 'var(--font-sora)', 
                fontSize: 'clamp(16px, 2.5vw, 20px)', 
                fontWeight: '400' 
              }}
            >
              O seu gestor de patrimônio público.
            </p>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <img 
              src="/lovable-uploads/8bf7e0cd-b784-4347-899e-35f4f91e59aa.png" 
              alt="Governo do Estado do Amazonas" 
              className="h-20 sm:h-24 w-auto"
            />
          </div>
        </div>

        <div className="w-full">
          <TabbedModuleCards 
            tabs={tabbedModuleData}
            defaultActiveTab={activeTab}
            key={activeTab}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
