import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Ícones otimizados (mantenha os mesmos)
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, isAuthenticated, hasRepublic, logout } = useAuth();
  
  // Ref para detectar cliques fora do menu
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

  // Trava o scroll do body quando o menu está aberto - CORRIGIDO
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    };
  }, [isOpen]);

  // Fechar menu ao clicar fora - NOVO
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
      fixed top-0 w-full z-50 transition-all duration-300
      ${scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-white/90 backdrop-blur-sm'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="relative">
              <img 
                className="h-10 w-auto transition-transform group-hover:scale-110" 
                src="/logo_preto.png"
                alt="Reppy Logo" 
                onError={(e) => { 
                  e.currentTarget.src = 'https://placehold.co/160x40/1bff17/ffffff?text=Reppy&font=inter';
                  e.currentTarget.onerror = null;
                }}
              />
            </div>
          </Link>

          {/* Links Desktop */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link 
              to="/servicos" 
              className={`
                relative px-4 py-2 text-base font-medium transition-all duration-200
                ${location.pathname === '/servicos' 
                  ? 'text-gray-900 font-semibold' 
                  : 'text-gray-600 hover:text-gray-900'
                }
                group
              `}
            >
              Serviços
              <span className={`
                absolute bottom-0 left-0 w-0 h-0.5 bg-[#1bff17] transition-all duration-300
                ${location.pathname === '/servicos' ? 'w-full' : 'group-hover:w-full'}
              `}></span>
            </Link>
            
            <Link 
              to="/planos" 
              className={`
                relative px-4 py-2 text-base font-medium transition-all duration-200
                ${location.pathname === '/planos' 
                  ? 'text-gray-900 font-semibold' 
                  : 'text-gray-600 hover:text-gray-900'
                }
                group
              `}
            >
              Planos
              <span className={`
                absolute bottom-0 left-0 w-0 h-0.5 bg-[#1bff17] transition-all duration-300
                ${location.pathname === '/planos' ? 'w-full' : 'group-hover:w-full'}
              `}></span>
            </Link>
          </div>

          {/* CTA Desktop */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {isAuthenticated() ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="
                    flex items-center space-x-3
                    bg-gray-50 hover:bg-gray-100
                    border border-gray-200
                    text-gray-700 font-medium
                    px-4 py-2.5 
                    rounded-xl
                    transition-all duration-200
                    hover:shadow-md
                    focus:outline-none focus:ring-2 focus:ring-[#1bff17] focus:ring-opacity-50
                  "
                >
                  <div className="flex items-center space-x-2">
                    <UserIcon />
                    <span className="max-w-32 truncate">
                      {user?.user_profile?.full_name || user?.email?.split('@')[0] || 'Usuário'}
                    </span>
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                    {/* Header do usuário */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 truncate">
                        {user?.user_profile?.full_name || 'Usuário'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email}
                      </p>
                      {user?.user_profile?.republica && (
                        <p className="text-xs text-green-600 font-medium mt-1">
                          {user.user_profile.republica.name}
                        </p>
                      )}
                    </div>

                    {/* Links do menu */}
                    <Link
                      to={getDashboardPath()}
                      className="
                        flex items-center space-x-3
                        px-4 py-3
                        text-gray-700 hover:bg-gray-50
                        transition-all duration-200
                      "
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>{hasRepublic() ? 'Dashboard' : 'Completar Cadastro'}</span>
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="
                        flex items-center space-x-3
                        w-full text-left
                        px-4 py-3
                        text-red-600 hover:bg-red-50
                        transition-all duration-200
                        border-t border-gray-100
                      "
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="
                  bg-gradient-to-r from-[#1bff17] to-[#1bff17] 
                  text-white font-semibold px-9 py-3 
                  rounded-xl shadow-lg shadow-green-500/25
                  transition-all duration-300
                  hover:shadow-xl hover:shadow-green-500/30
                  hover:scale-105
                  active:scale-95
                "
              >
                Entrar
              </Link>
            )}
          </div>

          {/* Menu Mobile Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="
                p-2 rounded-xl
                bg-gray-50 hover:bg-gray-100
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#1bff17] focus:ring-opacity-50
              "
              aria-label="Menu"
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Overlay - CORRIGIDO */}
      <div className={`
        lg:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out
        ${isOpen 
          ? 'opacity-100 visible' 
          : 'opacity-0 invisible'
        }
      `}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu Content */}
        <div 
          ref={menuRef}
          className={`
            absolute top-0 right-0 w-80 max-w-full h-full
            bg-white shadow-2xl 
            transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            overflow-y-auto
          `}
        >
          <div className="flex flex-col h-full pt-24 pb-8 px-6">
            
            {/* Logo Mobile */}
            <div className="mb-12 px-2">
              <img 
                className="h-8 w-auto" 
                src="/logo_preto.png"
                alt="Reppy"
                onError={(e) => { 
                  e.currentTarget.src = 'https://placehold.co/120x32/1bff17/ffffff?text=Reppy&font=inter';
                  e.currentTarget.onerror = null;
                }}
              />
            </div>

            {/* Links Mobile */}
            <div className="space-y-4">
              <Link 
                to="/servicos" 
                className={`
                  block px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200
                  ${location.pathname === '/servicos'
                    ? 'bg-[#1bff17]/10 text-gray-900 border-l-4 border-[#1bff17]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                onClick={() => setIsOpen(false)}
              >
                Serviços
              </Link>
              
              <Link 
                to="/planos" 
                className={`
                  block px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200
                  ${location.pathname === '/planos'
                    ? 'bg-[#1bff17]/10 text-gray-900 border-l-4 border-[#1bff17]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                onClick={() => setIsOpen(false)}
              >
                Planos
              </Link>

              {/* Menu do usuário no mobile */}
              {isAuthenticated() && (
                <>
                  <div className="border-t border-gray-200 my-4 pt-4">
                    <div className="px-4 py-2">
                      <p className="font-semibold text-gray-900 text-sm">
                        {user?.user_profile?.full_name || 'Usuário'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <Link 
                    to={getDashboardPath()}
                    className="
                      block px-4 py-3 rounded-xl text-lg font-medium
                      bg-[#1bff17]/10 text-gray-900 border-l-4 border-[#1bff17]
                      transition-all duration-200
                    "
                    onClick={() => setIsOpen(false)}
                  >
                    {hasRepublic() ? 'Dashboard' : 'Completar Cadastro'}
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="
                      w-full text-left
                      block px-4 py-3 rounded-xl text-lg font-medium
                      text-red-600 hover:bg-red-50
                      transition-all duration-200
                    "
                  >
                    Sair
                  </button>
                </>
              )}
            </div>

            {/* CTA Mobile - Só mostra se não estiver logado */}
            {!isAuthenticated() && (
              <div className="mt-auto pt-8">
                <Link 
                  to="/login" 
                  className="
                    w-full block text-center
                    bg-gradient-to-r from-[#1bff17] to-[#14cc11]
                    text-white font-semibold px-6 py-4
                    rounded-xl shadow-lg
                    transition-all duration-300
                    hover:shadow-xl
                    active:scale-95
                  "
                  onClick={() => setIsOpen(false)}
                >
                  Entrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

