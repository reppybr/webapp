import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Ícones (mantenha os mesmos)

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, isAuthenticated, hasRepublic, logout } = useAuth();
  
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  // Efeito de scroll para navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar menus ao mudar de página
  useEffect(() => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  // CORREÇÃO CRÍTICA: Bloqueio de scroll sem quebrar o layout
  useEffect(() => {
    if (isOpen) {
      // Salva a posição atual do scroll
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restaura a posição do scroll
      const scrollY = document.body.style.top;
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      setIsOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getDashboardPath = () => {
    if (hasRepublic()) {
      return '/dashboard';
    } else {
      return '/complete-registration';
    }
  };

  return (
    <nav className={`
      fixed top-0 w-full z-50 transition-all duration-500
      ${scrolled 
        ? 'bg-white/98 backdrop-blur-xl shadow-2xl border-b border-gray-100/80' 
        : 'bg-white/95 backdrop-blur-lg'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group flex-1 lg:flex-none"
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="relative">
              <img 
                className="h-12 w-auto transition-all duration-300 group-hover:scale-110 group-hover:rotate-2" 
                src="/logo_preto.png"
                alt="Reppy Logo" 
                onError={(e) => { 
                  e.currentTarget.src = 'https://placehold.co/160x48/1bff17/ffffff?text=Reppy&font=inter';
                  e.currentTarget.onerror = null;
                }}
              />
            </div>
          </Link>

          {/* Links Desktop */}
          <div className="hidden lg:flex lg:items-center lg:space-x-12 flex-1 justify-center">
            <Link 
              to="/servicos" 
              className={`
                relative px-6 py-3 text-lg font-semibold transition-all duration-300
                ${location.pathname === '/servicos' 
                  ? 'text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
                }
                group
              `}
            >
              Serviços
              <span className={`
                absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-[#1bff17] to-[#00ff88] transition-all duration-500 rounded-full
                ${location.pathname === '/servicos' ? 'w-4/5' : 'group-hover:w-4/5'}
              `}></span>
            </Link>
            
            <Link 
              to="/planos" 
              className={`
                relative px-6 py-3 text-lg font-semibold transition-all duration-300
                ${location.pathname === '/planos' 
                  ? 'text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
                }
                group
              `}
            >
              Planos
              <span className={`
                absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-[#1bff17] to-[#00ff88] transition-all duration-500 rounded-full
                ${location.pathname === '/planos' ? 'w-4/5' : 'group-hover:w-4/5'}
              `}></span>
            </Link>
          </div>

          {/* CTA Desktop */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6 flex-1 justify-end">
            {isAuthenticated() ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="
                    flex items-center space-x-4
                    bg-gradient-to-r from-gray-50 to-white
                    border border-gray-200/80
                    text-gray-800 font-semibold
                    px-6 py-3 
                    rounded-2xl
                    transition-all duration-300
                    hover:shadow-2xl hover:scale-105
                    hover:border-[#1bff17]/30
                    focus:outline-none focus:ring-4 focus:ring-[#1bff17]/20
                    shadow-lg
                  "
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-[#1bff17] to-[#00ff88] rounded-xl">
                      <UserIcon />
                    </div>
                    <span className="max-w-40 truncate text-base">
                      {user?.user_profile?.full_name || user?.email?.split('@')[0] || 'Usuário'}
                    </span>
                  </div>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/80 py-3 z-50 transform transition-all duration-300 origin-top">
                    {/* Header do usuário */}
                    <div className="px-5 py-4 border-b border-gray-100/80 bg-gradient-to-r from-gray-50 to-white/50 rounded-t-2xl">
                      <p className="font-bold text-gray-900 truncate text-lg">
                        {user?.user_profile?.full_name || 'Usuário'}
                      </p>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {user?.email}
                      </p>
                      {user?.user_profile?.republica && (
                        <p className="text-xs text-green-600 font-semibold mt-2 px-3 py-1 bg-green-50 rounded-full inline-block">
                          🏠 {user.user_profile.republica.name}
                        </p>
                      )}
                    </div>

                    {/* Links do menu */}
                    <Link
                      to={getDashboardPath()}
                      className="
                        flex items-center space-x-4
                        px-5 py-4
                        text-gray-700 hover:bg-gradient-to-r hover:from-[#1bff17]/5 hover:to-[#00ff88]/5
                        transition-all duration-300
                        hover:translate-x-2
                        group
                      "
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gradient-to-r group-hover:from-[#1bff17] group-hover:to-[#00ff88] transition-all duration-300">
                        <svg className="w-5 h-5 text-gray-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <span className="font-medium">{hasRepublic() ? 'Dashboard' : 'Completar Cadastro'}</span>
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="
                        flex items-center space-x-4
                        w-full text-left
                        px-5 py-4
                        text-red-600 hover:bg-red-50/80
                        transition-all duration-300
                        border-t border-gray-100/80
                        hover:translate-x-2
                        group
                      "
                    >
                      <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-600 transition-all duration-300">
                        <svg className="w-5 h-5 text-red-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <span className="font-medium">Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="
                  relative
                  bg-gradient-to-r from-[#1bff17] to-[#00ff88]
                  text-white font-bold text-lg px-10 py-4 
                  rounded-2xl shadow-2xl shadow-green-500/30
                  transition-all duration-500
                  hover:shadow-3xl hover:shadow-green-500/40
                  hover:scale-105
                  active:scale-95
                  overflow-hidden
                  group
                "
              >
                <span className="relative z-10">Entrar</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </Link>
            )}
          </div>

          {/* Menu Mobile Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="
                relative
                p-3 rounded-2xl
                bg-gradient-to-r from-gray-50 to-white
                border border-gray-200/80
                transition-all duration-500
                hover:shadow-2xl hover:scale-110
                hover:border-[#1bff17]/30
                focus:outline-none focus:ring-4 focus:ring-[#1bff17]/20
                shadow-lg
              "
              aria-label="Menu"
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Overlay - COM CORREÇÃO DO SCROLL */}
      <div className={`
        lg:hidden fixed inset-0 z-40 transition-all duration-500 ease-out
        ${isOpen 
          ? 'opacity-100 visible' 
          : 'opacity-0 invisible delay-300'
        }
      `}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-all duration-500"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu Content */}
        <div 
          ref={menuRef}
          className={`
            absolute top-0 right-0 w-full sm:w-96 h-full
            bg-gradient-to-br from-white to-gray-50/95 backdrop-blur-2xl
            shadow-3xl border-l border-gray-200/50
            transform transition-all duration-500 ease-out
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            overflow-y-auto
          `}
        >
          {/* Header do Menu Mobile */}
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
            <div className="flex items-center justify-between p-6">
              <Link 
                to="/" 
                className="flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <img 
                  className="h-10 w-auto" 
                  src="/logo_preto.png"
                  alt="Reppy"
                  onError={(e) => { 
                    e.currentTarget.src = 'https://placehold.co/120x40/1bff17/ffffff?text=Reppy&font=inter';
                    e.currentTarget.onerror = null;
                  }}
                />
              </Link>
              
              <button
                onClick={() => setIsOpen(false)}
                className="
                  p-3 rounded-2xl
                  bg-gradient-to-r from-gray-100 to-gray-200
                  transition-all duration-300
                  hover:scale-110 hover:shadow-lg
                  active:scale-95
                "
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Conteúdo do Menu Mobile */}
          <div className="flex flex-col h-full pt-8 pb-10 px-8">
            
            {/* Seção de Navegação Principal */}
            <div className="space-y-3 mb-12">
              <Link 
                to="/servicos" 
                className={`
                  flex items-center space-x-4
                  px-6 py-5 rounded-2xl text-xl font-semibold
                  transition-all duration-500
                  ${location.pathname === '/servicos'
                    ? 'bg-gradient-to-r from-[#1bff17]/20 to-[#00ff88]/20 text-gray-900 border-l-4 border-[#1bff17] shadow-lg'
                    : 'text-gray-700 hover:bg-white hover:shadow-2xl hover:scale-105 hover:border-l-4 hover:border-gray-300'
                  }
                  group
                `}
                onClick={() => setIsOpen(false)}
              >
                <div className={`p-3 rounded-xl transition-all duration-300 ${
                  location.pathname === '/servicos' 
                    ? 'bg-gradient-to-r from-[#1bff17] to-[#00ff88]' 
                    : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-[#1bff17] group-hover:to-[#00ff88]'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span>Serviços</span>
              </Link>
              
              <Link 
                to="/planos" 
                className={`
                  flex items-center space-x-4
                  px-6 py-5 rounded-2xl text-xl font-semibold
                  transition-all duration-500
                  ${location.pathname === '/planos'
                    ? 'bg-gradient-to-r from-[#1bff17]/20 to-[#00ff88]/20 text-gray-900 border-l-4 border-[#1bff17] shadow-lg'
                    : 'text-gray-700 hover:bg-white hover:shadow-2xl hover:scale-105 hover:border-l-4 hover:border-gray-300'
                  }
                  group
                `}
                onClick={() => setIsOpen(false)}
              >
                <div className={`p-3 rounded-xl transition-all duration-300 ${
                  location.pathname === '/planos' 
                    ? 'bg-gradient-to-r from-[#1bff17] to-[#00ff88]' 
                    : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-[#1bff17] group-hover:to-[#00ff88]'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span>Planos</span>
              </Link>
            </div>

            {/* Menu do usuário no mobile */}
            {isAuthenticated() && (
              <div className="mb-12">
                <div className="bg-gradient-to-r from-gray-50 to-white/80 rounded-2xl p-6 shadow-lg border border-gray-200/50 mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-[#1bff17] to-[#00ff88] rounded-xl">
                      <UserIcon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-lg truncate">
                        {user?.user_profile?.full_name || 'Usuário'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  {user?.user_profile?.republica && (
                    <div className="px-4 py-2 bg-green-50 rounded-xl border border-green-200/50">
                      <p className="text-sm text-green-700 font-semibold text-center">
                        🏠 {user.user_profile.republica.name}
                      </p>
                    </div>
                  )}
                </div>

                <Link 
                  to={getDashboardPath()}
                  className="
                    flex items-center space-x-4
                    w-full px-6 py-5 rounded-2xl text-xl font-semibold
                    bg-gradient-to-r from-[#1bff17]/10 to-[#00ff88]/10
                    text-gray-900 border-l-4 border-[#1bff17]
                    shadow-lg
                    transition-all duration-500
                    hover:shadow-2xl hover:scale-105
                    active:scale-95
                    mb-4
                  "
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-3 bg-gradient-to-r from-[#1bff17] to-[#00ff88] rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span>{hasRepublic() ? 'Dashboard' : 'Completar Cadastro'}</span>
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="
                    flex items-center space-x-4
                    w-full px-6 py-5 rounded-2xl text-xl font-semibold
                    text-red-600 bg-red-50/80 border-l-4 border-red-400
                    transition-all duration-500
                    hover:shadow-2xl hover:scale-105
                    active:scale-95
                  "
                >
                  <div className="p-3 bg-red-500 rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span>Sair</span>
                </button>
              </div>
            )}

            {/* CTA Mobile - Só mostra se não estiver logado */}
            {!isAuthenticated() && (
              <div className="mt-auto pt-8">
                <Link 
                  to="/login" 
                  className="
                    w-full block text-center
                    bg-gradient-to-r from-[#1bff17] to-[#00ff88]
                    text-white font-bold text-xl px-8 py-5
                    rounded-2xl shadow-2xl
                    transition-all duration-500
                    hover:shadow-3xl
                    hover:scale-105
                    active:scale-95
                    relative overflow-hidden
                    group
                  "
                  onClick={() => setIsOpen(false)}
                >
                  <span className="relative z-10">Entrar na Plataforma</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </Link>
                
                <p className="text-center text-gray-500 text-sm mt-4 px-4">
                  Junte-se a +100 repúblicas que já usam o Reppy
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
