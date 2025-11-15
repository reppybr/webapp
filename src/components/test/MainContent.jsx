import React from 'react';

// Importando as seções
import Config from './sections/Config';
import DashboardSection from './sections/DashboardSection';
import FiltrosSection from './sections/FiltrosSection';
import CalourosSection from './sections/CalourosSection';
import AnalyticsSection from './sections/AnalyticsSection';
import AjudaSection from './sections/AjudaSection';

/**
 * Componente de Conteúdo Principal
 */
const MainContent = ({ activeSection, userData, navigationState }) => { // 🔥 RECEBE navigationState

  // Função para renderizar o componente da seção correta
  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardSection 
            userData={userData} 
            // 🔥 PASSA O STATE DA NAVEGAÇÃO PARA O DASHBOARD
            navigationState={navigationState}
          />
        );
      case 'filtros':
        return <FiltrosSection userData={userData} />;
      case 'calouros':
        return <CalourosSection userData={userData} />;
      case 'analytics':
        return <AnalyticsSection userData={userData} />;
      case 'config':
        return <Config userData={userData} />;
      case 'ajuda':
        return <AjudaSection userData={userData} />;
      default:
        // Renderiza o dashboard como padrão
        return (
          <DashboardSection 
            userData={userData} 
            navigationState={navigationState}
          />
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Renderiza a seção correta */}
      {renderSection()}
    </div>
  );
};

export default MainContent;