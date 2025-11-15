import React from 'react';
import { FiMenu, FiChevronDown, FiBell } from 'react-icons/fi';

/**
 * Componente do Header (versão corrigida)
 */
const Header = ({ activeSection, setSidebarOpen, navItems, userData }) => {
  
  const getTitle = (section) => {
    const activeItem = navItems.find(item => item.id === section);
    return activeItem ? activeItem.label : 'Painel';
  };

  // 🔥 FUNÇÃO CORRIGIDA: Acessando a estrutura correta
  const getUserName = () => {
    if (!userData) return 'Usuário';
    
    // 🔥 CORREÇÃO: userData agora tem a estrutura do user_profile
    // O nome pode estar em full_name (do user) ou na estrutura do user_profile
    return userData.full_name || 
           userData.userProfile?.full_name || 
           userData.email?.split('@')[0] || 
           'Usuário';
  };

  // 🔥 ADICIONE: Debug para verificar a estrutura
  console.log('🔍 Header - userData:', userData);
  console.log('🔍 Header - nome do usuário:', getUserName());

  return (
    <header className="flex items-center justify-between h-20 px-6 md:px-8 bg-white border-b border-gray-100 sticky top-0 z-30">
      
      {/* Lado Esquerdo: Botão Mobile e Título */}
      <div className="flex items-center">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 mr-3 text-gray-600 hover:bg-gray-100 rounded-full"
        >
          <FiMenu className="w-6 h-6" />
        </button>

        <h1 className="text-2xl font-bold text-gray-800">
          {getTitle(activeSection)}
        </h1>
      </div>

      {/* Lado Direito: Nome do Usuário */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 p-2">
          <span className="hidden md:block font-medium text-gray-700">
            {getUserName()}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;