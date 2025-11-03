import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/layout/Sidebar';
import Header from '../components/dashboard/layout/Header';
import MainContent from '../components/dashboard/MainContent';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente da PÁGINA do Dashboard
 * Orquestra o layout e o estado principal
 */
const Dashboard = () => {
  // Estado para controlar qual seção está ativa
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Estado para controlar a sidebar mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔥 IMPORTAR TODOS OS DADOS DO USUÁRIO
  const { 
    hasActivePlan, 
    hasNoPlan, 
    loading, 
    getPlanType,
    getUserPlan,
    isPremium,
    isBasic,
    isFree,
    getUserRepublic,
    getUserFilters,
    getUserCalouros,
    getRepublicMembers,
    getRepublicInfo,
    user
  } = useAuth();
  
  const navigate = useNavigate();

  // 🔥 REDIRECIONA PARA PLANOS SE NÃO TIVER PLANO ATIVO
  useEffect(() => {
    if (!loading && hasNoPlan()) {
      console.log('🟡 Usuário sem plano ativo, redirecionando para /planos');
      navigate('/planos', { replace: true });
    }
  }, [loading, hasNoPlan, navigate]);

  // Se ainda está carregando, mostra loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  // Se não tem plano ativo, não renderiza nada (já vai redirecionar)
  if (hasNoPlan()) {
    return null;
  }

  // 🔥 OBTER TODOS OS DADOS PARA PASSAR PARA AS SEÇÕES
  const userData = {
    planType: getPlanType(),
    userPlan: getUserPlan(),
    republic: getUserRepublic(),
    republicInfo: getRepublicInfo(),
    filters: getUserFilters(),
    calouros: getUserCalouros(),
    members: getRepublicMembers(),
    userProfile: user?.user_profile,
    isPremium: isPremium(),
    isBasic: isBasic(),
    isFree: isFree()
  };

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
    <div className="flex min-h-screen bg-gray-100 font-sans">
      
      {/* --- SIDEBAR --- */}
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userData={userData}
      />

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-80">
        
        {/* --- HEADER --- */}
        <Header 
          activeSection={activeSection}
          navItems={allNavItems}
          setSidebarOpen={setSidebarOpen}
          userData={userData}
        />

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 bg-gray-50 p-6 md:p-8">
          <MainContent 
            activeSection={activeSection} 
            userData={userData}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;