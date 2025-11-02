import React from 'react';
import { FiMenu, FiChevronDown, FiBell } from 'react-icons/fi';

/**
 * Componente do Header
 */
const Header = ({ activeSection, setSidebarOpen, navItems }) => {
  
  // Encontra o item ativo para pegar o 'label'
  const getTitle = (section) => {
    const activeItem = navItems.find(item => item.id === section);
    return activeItem ? activeItem.label : 'Painel'; // 'Painel' como padrão
  };

  return (
    <header className="flex items-center justify-between h-20 px-6 md:px-8 bg-white border-b border-gray-100 sticky top-0 z-30">
      
      {/* Lado Esquerdo: Botão Mobile e Título */}
      <div className="flex items-center">
        {/* Botão Hamburger (só aparece no mobile) */}
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 mr-3 text-gray-600 hover:bg-gray-100 rounded-full"
        >
          <FiMenu className="w-6 h-6" />
        </button>

        {/* Título da Página */}
        <h1 className="text-2xl font-bold text-gray-800">
          {getTitle(activeSection)}
        </h1>
      </div>

      {/* Lado Direito: Ações do Usuário */}
      <div className="flex items-center space-x-4">
        {/* Você pode adicionar ícones de notificação, etc. aqui */}
        {/* <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
          <FiBell className="w-6 h-6" />
        </button> */}
        
        {/* Perfil do Usuário */}
        <div className="relative">
          <button className="flex items-center space-x-2 p-1 rounded-full ">
       
           
        
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;