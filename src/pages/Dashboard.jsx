import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/dashboard/layout/Sidebar';
import Header from '../components/dashboard/layout/Header';
import MainContent from '../components/dashboard/MainContent';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { 
    user, // 🔥 PEGAR O USER COMPLETO DO AUTHCONTEXT
    loading, 
    getPlanType,
    isPremium,
    isBasic,
    isFree
  } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 CONSTRUIR userData COM ESTRUTURA CORRETA
  const userData = user?.user_profile ? {
    // 🔥 ESTRUTURA IDÊNTICA AO BACKEND
    ...user.user_profile,
    // Métodos de conveniência
    isPremium: isPremium(),
    isBasic: isBasic(),
    isFree: isFree(),
    planType: getPlanType()
  } : null;

  // 🔥 DEBUG: Verificar a estrutura
  useEffect(() => {
    if (userData) {
      console.log('🔍 Dashboard - userData:', userData);
      console.log('🔍 Dashboard - republica:', userData.republica);
      console.log('🔍 Dashboard - tipo:', userData.republica?.tipo);
    }
  }, [userData]);

  // 🔥 DETECTAR NAVEGAÇÃO COM FILTRO
  useEffect(() => {
    if (location.state?.loadedFilter) {
      console.log('🟡 [Dashboard] Navegação com filtro detectada:', location.state.filterName);
      setActiveSection('dashboard');
      setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location]);

  // 🔥 REDIRECIONA PARA PLANOS SE NÃO TIVER PLANO ATIVO
  useEffect(() => {
    if (!loading && userData && !userData.has_active_plan) {
      console.log('🟡 Usuário sem plano ativo, redirecionando para /planos');
      navigate('/planos', { replace: true });
    }
  }, [loading, userData, navigate]);

  // Loading
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

  // Se não tem userData, mostra erro
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg">Erro ao carregar dados do usuário</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  // Se não tem plano ativo, não renderiza nada (já vai redirecionar)
  if (!userData.has_active_plan) {
    return null;
  }

  // Lista de seções para passar ao Header
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
            navigationState={location.state}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;