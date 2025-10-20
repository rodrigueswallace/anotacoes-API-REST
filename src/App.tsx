
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastContainer } from 'react-toastify';
import { SuccessToastIcon } from "@/components/ui/success-toast-icon";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrimeiroAcesso from "./pages/PrimeiroAcesso";
import EsqueceuSenha from "./pages/EsqueceuSenha";
import RecepcaoNotaFiscal from "./pages/RecepcaoNotaFiscal";
import ViewRecepcaoItem from "./pages/ViewRecepcaoItem";
import GestaoMovelConfiguracoes from "./pages/GestaoMovelConfiguracoes";
import UsuariosPermissoes from "./pages/UsuariosPermissoes";
import ConfiguracaoOrgaos from "./pages/ConfiguracaoOrgaos";
import ConfiguracaoAreas from "./pages/ConfiguracaoAreas";
import ConfiguracaoSetores from "./pages/ConfiguracaoSetores";
import ConfiguracaoGrupoBem from "./pages/ConfiguracaoGrupoBem";
import ConfiguracaoSubgruposBem from "./pages/ConfiguracaoSubgruposBem";
import ConfiguracaoEstadoConservacao from "./pages/ConfiguracaoEstadoConservacao";
import ConfiguracaoFornecedoresTerceiros from "./pages/ConfiguracaoFornecedoresTerceiros";
import ConfiguracaoLeisAplicaveis from "./pages/ConfiguracaoLeisAplicaveis";
import ConfiguracaoMetodoAquisicao from "./pages/ConfiguracaoMetodoAquisicao";
import ConfiguracaoTipoInventario from "./pages/ConfiguracaoTipoInventario";

import ConfiguracaoConvenio from "./pages/ConfiguracaoConvenio";
import ConfiguracaoFonteRecurso from "./pages/ConfiguracaoFonteRecurso";
import ConfiguracaoEntidadesCredenciadas from "./pages/ConfiguracaoEntidadesCredenciadas";
import ConfiguracaoUnidades from "./pages/ConfiguracaoUnidades";
import NotFound from "./pages/NotFound";
import EmDesenvolvimento from "./pages/EmDesenvolvimento";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider delayDuration={400}>
      <Toaster />
      <Sonner />
      <ToastContainer 
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="!bg-card !text-card-foreground !border !border-border"
        progressClassName="!bg-primary"
        icon={({ type }) => type === 'success' ? <SuccessToastIcon /> : undefined}
        style={{
          zIndex: 10000,
          top: '60px'
        }}
      />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/primeiro-acesso" element={<PrimeiroAcesso />} />
            <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
            <Route path="/" element={<Home />} />
            <Route path="/index" element={<Index />} />
            <Route path="/recepcao-nota-fiscal" element={<RecepcaoNotaFiscal />} />
            <Route path="/recepcao-nota-fiscal/:id" element={<ViewRecepcaoItem />} />
            <Route path="/gestao-bens-moveis/configuracoes" element={<GestaoMovelConfiguracoes />} />
            <Route path="/gestao-bens-moveis/configuracoes/usuarios" element={<UsuariosPermissoes />} />
            <Route path="/gestao-bens-moveis/configuracoes/orgaos" element={<ConfiguracaoOrgaos />} />
            <Route path="/gestao-bens-moveis/configuracoes/areas" element={<ConfiguracaoAreas />} />
            <Route path="/gestao-bens-moveis/configuracoes/unidades" element={<ConfiguracaoUnidades />} />
            <Route path="/gestao-bens-moveis/configuracoes/setores" element={<ConfiguracaoSetores />} />
            <Route path="/gestao-bens-moveis/configuracoes/grupos-bem" element={<ConfiguracaoGrupoBem />} />
            <Route path="/gestao-bens-moveis/configuracoes/subgrupos-bem" element={<ConfiguracaoSubgruposBem />} />
            <Route path="/gestao-bens-moveis/configuracoes/estado-conservacao" element={<ConfiguracaoEstadoConservacao />} />
            <Route path="/gestao-bens-moveis/configuracoes/fornecedores-terceiros" element={<ConfiguracaoFornecedoresTerceiros />} />
            <Route path="/gestao-bens-moveis/configuracoes/leis-aplicaveis" element={<ConfiguracaoLeisAplicaveis />} />
            <Route path="/gestao-bens-moveis/configuracoes/metodo-aquisicao" element={<ConfiguracaoMetodoAquisicao />} />
            <Route path="/gestao-bens-moveis/configuracoes/tipo-inventario" element={<ConfiguracaoTipoInventario />} />
            
            <Route path="/gestao-bens-moveis/configuracoes/convenio" element={<ConfiguracaoConvenio />} />
            <Route path="/gestao-bens-moveis/configuracoes/fonte-recurso" element={<ConfiguracaoFonteRecurso />} />
            <Route path="/gestao-bens-moveis/configuracoes/entidades-credenciadas" element={<ConfiguracaoEntidadesCredenciadas />} />
            <Route path="/gestao-bens-moveis/patrimonio-movel" element={<EmDesenvolvimento />} />
            <Route path="/gestao-bens-moveis/inventario" element={<EmDesenvolvimento />} />
            <Route path="/gestao-bens-moveis/relatorios" element={<EmDesenvolvimento />} />
            <Route path="/gestao-bens-moveis/e-commerce" element={<EmDesenvolvimento />} />
            <Route path="/em-desenvolvimento" element={<EmDesenvolvimento />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
