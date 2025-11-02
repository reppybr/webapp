import React from 'react';

// Importando as seções
import Config from './sections/Config';
import DashboardSection from './sections/DashboardSection';
import FiltrosSection from './sections/FiltrosSection';
import CalourosSection from './sections/CalourosSection';


import AjudaSection from './sections/AjudaSection';







/**
 * Componente de Conteúdo Principal
 */
const MainContent = ({ activeSection }) => {

  // Função para renderizar o componente da seção correta
  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'filtros':
        return <FiltrosSection />;
      case 'calouros':
        return <CalourosSection />;
    
      case 'config':
        return <Config />;
      case 'ajuda':
        return <AjudaSection />;
      default:
        // Renderiza o dashboard como padrão
        return <DashboardSection />;
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