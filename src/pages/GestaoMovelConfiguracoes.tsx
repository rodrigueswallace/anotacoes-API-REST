
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleCard } from '@/components/ui/module-card';
import { Breadcrumb } from '@/components/ui/breadcrumb-navigation';
import { UsuariosIcon } from '@/components/ui/usuarios-icon';
import { AreasIcon } from '@/components/ui/areas-icon';
import { OrgaosIcon } from '@/components/ui/orgaos-icon';
import { UnidadesIcon } from '@/components/ui/unidades-icon';
import { SetoresIcon } from '@/components/ui/setores-icon';
import { SubgruposBemIcon } from '@/components/ui/subgrupos-bem-icon';
import { GruposBemIcon } from '@/components/ui/grupos-bem-icon';
import { CondicaoBemIcon } from '@/components/ui/condicao-bem-icon';
import { FornecedoresTerceirosIcon } from '@/components/ui/fornecedores-terceiros-icon';
import { LeisAplicaveisIcon } from '@/components/ui/leis-aplicaveis-icon';
import { TipoInventarioIcon } from '@/components/ui/tipo-inventario-icon';
import { MetodoAquisicaoIcon } from '@/components/ui/metodo-aquisicao-icon';
import { ConvenioIcon } from '@/components/ui/convenio-icon';
import { FonteRecursoIcon } from '@/components/ui/fonte-recurso-icon';
import { EntidadesCredenciadasIcon } from '@/components/ui/entidades-credenciadas-icon';
import {
  Building2, 
  Settings, 
  Database, 
  Package,
  HelpCircle,
  Wrench,
  Globe,
  CheckCircle
} from 'lucide-react';

const GestaoMovelConfiguracoes = () => {
  const navigate = useNavigate();
  
  // Breadcrumb navigation
  const breadcrumbPath = [
    { label: "Home", href: "/", icon: "home" as const },
    { label: "Gestão de bens móveis", href: "/?tab=gestao-bens-moveis" },
    { label: "Configurações", current: true }
  ];

  // Função para voltar
  const handleBack = () => {
    navigate("/?tab=gestao-bens-moveis");
  };

  const moduleCards = [
    // Primeira linha: Usuários, Áreas, Órgãos
    {
      id: 'usuarios-permissoes',
      title: 'Usuários',
      description: 'Gerencie as configurações relacionadas aos usuários do sistema de acordo com a necessidade.',
      icon: <UsuariosIcon size={48} className="text-second-primary" />,
      href: '/gestao-bens-moveis/configuracoes/usuarios'
    },
    {
      id: 'areas',
      title: 'Áreas',
      description: 'Configure as áreas organizacionais vinculadas aos órgãos para estruturar a gestão patrimonial.',
      icon: <AreasIcon size={48} className="text-second-primary" />,
      href: '/gestao-bens-moveis/configuracoes/areas'
    },
    {
      id: 'orgaos',
      title: 'Órgãos',
      description: 'Configure os órgãos públicos responsáveis pelos bens e pela gestão patrimonial.',
      icon: <OrgaosIcon size={48} className="text-second-primary" />,
      href: '/gestao-bens-moveis/configuracoes/orgaos'
    },
    // Segunda linha: Unidades, Setor, Tipo de bem
    {
      id: 'unidades',
      title: 'Unidades',
      description: 'Defina as unidades administrativas que compõem a estrutura organizacional do órgão.',
      icon: <UnidadesIcon size={48} className="text-second-primary" />,
      href: '/gestao-bens-moveis/configuracoes/unidades'
    },
    {
      id: 'setores',
      title: 'Setores',
      description: 'Configure os setores internos das unidades responsáveis pela guarda ou uso dos bens móveis.',
      icon: <SetoresIcon size={48} className="text-second-primary" />,
      href: '/gestao-bens-moveis/configuracoes/setores'
    },
    {
      id: 'grupos-bem',
      title: 'Grupos de bem',
      description: 'Classifique os bens conforme sua natureza, como equipamentos, mobiliários ou veículos.',
      icon: <GruposBemIcon size={48} className="text-second-primary" />,
      href: '/gestao-bens-moveis/configuracoes/grupos-bem'
    },
    // Terceira linha: Categorias do bem, Estado de conservação, Tipo de veículo
    {
      id: 'subgrupos-bem',
      title: 'Subgrupos de bem',
      description: 'Organize os bens patrimoniais em subgrupos para facilitar sua classificação e controle.',
      icon: <SubgruposBemIcon size={48} className="text-second-primary" />,
      href: '/gestao-bens-moveis/configuracoes/subgrupos-bem'
    },
    {
      id: 'estado-conservacao',
      title: 'Estados de conservação',
      description: 'Defina os parâmetros de avaliação da condição física dos bens para fins de gestão e desfazimento.',
      icon: <CondicaoBemIcon size={48} className="text-second-primary" />,
      href: '/gestao-bens-moveis/configuracoes/estado-conservacao'
    },
    // Quinta linha: Fornecedores e terceiros, Leis aplicáveis, Método de aquisição
    {
      id: 'fornecedores-terceiros',
      title: 'Fornecedores e terceiros',
      description: 'Cadastre os fornecedores e terceiros vinculados a aquisições e prestação de serviços.',
      icon: <FornecedoresTerceirosIcon size={48} className="text-second-primary" />,
      href: '/gestao-bens-moveis/configuracoes/fornecedores-terceiros'
    },
    {
      id: 'leis-aplicaveis',
      title: 'Leis aplicáveis',
      description: 'Relacione as normas legais utilizadas como base para os procedimentos patrimoniais.',
      icon: <LeisAplicaveisIcon size={48} className="text-second-primary" />,
      href: '/gestao-bens-moveis/configuracoes/leis-aplicaveis'
    },
    {
      id: 'metodo-aquisicao',
      title: 'Métodos de aquisição',
      description: 'Defina e controle os métodos pelos quais os bens foram adquiridos, como compra ou doação.',
      icon: <MetodoAquisicaoIcon size={48} className="text-second-primary" />,
      href: '/gestao-bens-moveis/configuracoes/metodo-aquisicao'
    },
    // Sexta linha: Tipo de inventário, Localização física do bem, Convênio
    {
      id: 'tipo-inventario',
      title: 'Tipos de inventário',
      description: 'Configure os tipos de inventário físico possíveis: total, eventual, cíclico, parcial ou rotativo.',
      icon: <TipoInventarioIcon size={48} className="text-second-primary" />,
      href: '/gestao-bens-moveis/configuracoes/tipo-inventario'
    },
    {
      id: 'convenio',
      title: 'Convênios',
      description: 'Registre convênios firmados que envolvam bens patrimoniais sob guarda ou quaisquer métodos de aquisição.',
      icon: <ConvenioIcon size={48} className="text-second-primary" />,
      href: '/gestao-bens-moveis/configuracoes/convenio'
    },
    // Sétima linha: Fonte de recurso, Entidades credenciadas
    {
      id: 'fonte-recurso',
      title: 'Fontes de recurso',
      description: 'Relacione as origens dos recursos financeiros utilizados na aquisição dos bens.',
      icon: <FonteRecursoIcon size={48} className="text-second-primary" />,
      href: '/gestao-bens-moveis/configuracoes/fonte-recurso'
    },
    {
      id: 'entidades-credenciadas',
      title: 'Entidades credenciadas',
      description: 'Cadastre entidades autorizadas a receber doações.',
      icon: <EntidadesCredenciadasIcon size={48} className="text-second-primary" />,
      href: '/gestao-bens-moveis/configuracoes/entidades-credenciadas'
    }
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="py-2">
        <Breadcrumb path={breadcrumbPath} onBack={handleBack} />
      </div>

      {/* Module Cards Grid */}
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ columnGap: '2.14vw', rowGap: '1.31vh' }}>
        {moduleCards.map((card) => (
          <ModuleCard
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            icon={card.icon}
            href={card.href}
          />
        ))}
        </div>
      </div>
    </>
  );
};

export default GestaoMovelConfiguracoes;
