import React from 'react';
import { 
    FiActivity , 
  FiSettings, 
  FiFilter, 
  FiLogOut, 
  FiX,
  FiUsers,
  FiBarChart2,
  FiBook,
  FiBell,
  FiHelpCircle
} from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Painel', 
      icon: FiActivity ,
      description: 'Visão geral das listas'
    },
    { 
      id: 'filtros', 
      label: 'Filtros Salvos', 
      icon: FiFilter,
      description: 'Seus filtros favoritos'
    },
    { 
      id: 'calouros', 
      label: 'Lista de Calouros', 
      icon: FiUsers,
      description: 'Calouros que você selecionou'
    },


  ];

  const secondaryItems = [

    { 
      id: 'config', 
      label: 'Configurações', 
      icon: FiSettings 
    },
    { 
      id: 'ajuda', 
      label: 'Ajuda', 
      icon: FiHelpCircle 
    },
  ];

  const handleItemClick = (sectionId) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Overlay para mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Container da Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 w-80 bg-white shadow-2xl border-r border-gray-100 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 flex flex-col transition-transform duration-300 ease-in-out z-50`}
      >
        
        {/* Header da Sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <Link to="/" className="block">
    <img 
      src="/logo_preto.png" 
      alt="Reppy Logo" 
   
      className="h-10 w-auto cursor-pointer"
      onError={(e) => { e.currentTarget.src = 'https://placehold.co/120x40/000000/FFFFFF?text=reppy&font=inter'; e.currentTarget.onerror = null; }}
    />
  </Link>
          
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

  

        {/* Navegação Principal */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-1">
        
            
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                description={item.description}
                icon={item.icon}
                isActive={activeSection === item.id}
                onClick={() => handleItemClick(item.id)}
              />
            ))}
          </nav>

          {/* Navegação Secundária */}
          <nav className="p-4 space-y-1 border-t border-gray-100">
            <div className="px-3 py-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Configurações
              </div>
            </div>
            
            {secondaryItems.map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                badge={item.badge}
                isActive={activeSection === item.id}
                onClick={() => handleItemClick(item.id)}
              />
            ))}
          </nav>
        </div>

        {/* Footer da Sidebar */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="space-y-3">
           

        

            {/* Versão */}
            <div className="text-xs text-gray-400 text-center pt-2">
              v0.1.0 • Reppy
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Sub-componente para os itens de navegação
const NavItem = ({ label, description, icon: Icon, isActive, badge, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative group w-full flex items-center gap-3 px-3 py-3 rounded-xl
        transition-all duration-200 text-left
        ${isActive 
          ? 'bg-gradient-to-r from-[#1bff17]/10 to-[#14cc11]/5 border border-[#1bff17]/20 text-gray-900 shadow-sm' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }
      `}
    >
      {/* Indicador de estado ativo */}
      {isActive && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#1bff17] to-[#14cc11] rounded-r-full" />
      )}
      
      {/* Ícone */}
      <div className={`
        flex-shrink-0 p-2 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-[#1bff17] to-[#14cc11] text-white shadow-lg shadow-green-500/25' 
          : 'bg-gray-100 text-gray-600 group-hover:bg-[#1bff17]/10 group-hover:text-[#1bff17]'
        }
      `}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Texto */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-sm ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
            {label}
          </span>
          {badge && (
            <span className="flex-shrink-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <div className={`text-xs mt-0.5 ${
            isActive ? 'text-gray-600' : 'text-gray-500'
          }`}>
            {description}
          </div>
        )}
      </div>

      {/* Efeito de hover */}
      <div className={`
        absolute inset-0 rounded-xl transition-all duration-200
        ${isActive 
          ? 'shadow-[inset_0_0_0_1px_rgba(27,255,23,0.1)]' 
          : 'group-hover:shadow-[inset_0_0_0_1px_rgba(156,163,175,0.1)]'
        }
      `} />
    </button>
  );
};

export default Sidebar;