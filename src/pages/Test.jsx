// src/pages/Dashboard.jsx (ou onde quer que ele esteja)

import React, { useState } from 'react';
import Sidebar from '../components/test/layout/Sidebar';
import Header from '../components/test/layout/Header';
import MainContent from '../components/test/MainContent';
// 1. Importar o modal de boas-vindas
import WelcomeModal from '../components/test/sections/dashboard/WelcomeModal'; 

/**
 * Componente da PÁGINA do Dashboard
 * Orquestra o layout e o estado principal
 */
const Test = () => {
  // Estado para controlar qual seção está ativa
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Estado para controlar a sidebar mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- LÓGICA DO MODAL DE BOAS-VINDAS ---

  // 2. Busca a config do localStorage ao carregar.
  //    Se não existir, 'republicConfig' será 'null'.
  const [republicConfig, setRepublicConfig] = useState(() => {
    try {
      // Tenta ler a configuração salva
      const savedConfig = localStorage.getItem('republicConfig');
      return savedConfig ? JSON.parse(savedConfig) : null;
    } catch (e) {
      console.error("Erro ao ler config do localStorage", e);
      return null;
    }
  });

  // 3. O modal abre APENAS se a configuração (republicConfig) for 'null'
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(!republicConfig);

  // 4. Função para fechar o modal e salvar os dados
  const handleWelcomeModalSubmit = (config) => {
    try {
      // Salva no localStorage para não perguntar de novo
      localStorage.setItem('republicConfig', JSON.stringify(config));
      
      setRepublicConfig(config); // Salva no estado
      setIsWelcomeModalOpen(false); // Fecha o modal
      
      console.log("Configuração da República salva:", config);
    } catch (e) {
      console.error("Erro ao salvar config no localStorage", e);
      // Mesmo com erro, fecha o modal para o usuário não ficar preso
      setIsWelcomeModalOpen(false); 
    }
  };
  // --- FIM DA LÓGICA DO MODAL ---


  // Lista de seções para passar ao Header (para os títulos)
  const allNavItems = [
    { id: 'dashboard', label: 'Painel' },
    { id: 'filtros', label: 'Filtros Salvos' },
    { id: 'calouros', label: 'Lista de Calouros' },
    { id: 'analytics', label: 'Estatísticas' },
    { id: 'config', label: 'Configurações' },
    { id: 'ajuda', label: 'Ajuda' },
  ];

  return (
    // O div principal precisa ser 'relative' para o modal
    <div className="relative min-h-screen bg-gray-100 font-sans">
      
      {/* --- SIDEBAR --- */}
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* --- CONTEÚDO PRINCIPAL (Header + Main) --- */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-80">
        
        {/* --- HEADER --- */}
        <Header 
          activeSection={activeSection}
          navItems={allNavItems}
          setSidebarOpen={setSidebarOpen}
        />

        {/* --- MAIN CONTENT (com scroll) --- */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 bg-gray-50">
          <MainContent activeSection={activeSection} />
        </main>
      </div>

      {/* 5. RENDERIZAÇÃO DO MODAL DE BOAS-VINDAS */}
      {/* Ele fica aqui no final. Como o modal tem 'position: fixed',
        ele vai aparecer por cima de todo o conteúdo da página
        enquanto 'isWelcomeModalOpen' for true.
      */}
      {isWelcomeModalOpen && <WelcomeModal onSubmit={handleWelcomeModalSubmit} />}

    </div>
  );
};

export default Test;