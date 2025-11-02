// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// --- Ícones SVG (mantidos os mesmos) ---
const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 533.5 544.3"
    className="w-5 h-5 mr-3 flex-shrink-0"
    preserveAspectRatio="xMidYMid meet"
  >
    <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.5-34.4-4.5-50.8H272v95.9h146.9c-6.3 34-25.2 62.7-53.7 81.9l87 67.4c50.8-46.8 80.3-115.8 80.3-194.4z" />
    <path fill="#34A853" d="M272 544.3c72.6 0 133.7-24 178.2-65.5l-87-67.4c-24.1 16.2-54.9 25.8-91.2 25.8-70.1 0-129.5-47.3-150.8-110.9l-89.7 69.4C78.8 486.5 169.5 544.3 272 544.3z" />
    <path fill="#FBBC05" d="M121.2 326.3c-4.9-14.6-7.6-30.2-7.6-46.3s2.7-31.7 7.6-46.3l-89.7-69.4C11.2 200.8 0 234.1 0 280c0 45.9 11.2 79.2 31.5 115.7l89.7-69.4z" />
    <path fill="#EA4335" d="M272 107.2c39.6 0 75.1 13.6 103.1 40.3l77.4-77.4C405.8 25.8 344.6 0 272 0 169.5 0 78.8 57.8 31.5 164.3l89.7 69.4C142.5 154.5 201.9 107.2 272 107.2z" />
  </svg>
);

const SolanaIcon = () => (
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 508.07 398.17"
    className="w-5 h-5 mr-3 flex-shrink-0"
  >
    <defs>
      <style>
        {`
          .cls-1{fill:url(#linear-gradient);}
          .cls-2{fill:url(#linear-gradient-2);}
          .cls-3{fill:url(#linear-gradient-3);}
        `}
      </style>
      <linearGradient
        id="linear-gradient"
        x1="463"
        y1="205.16"
        x2="182.39"
        y2="742.62"
        gradientTransform="translate(0 -198)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#00ffa3" />
        <stop offset="1" stopColor="#dc1fff" />
      </linearGradient>
      <linearGradient
        id="linear-gradient-2"
        x1="340.31"
        y1="141.1"
        x2="59.71"
        y2="678.57"
        xlinkHref="#linear-gradient"
      />
      <linearGradient
        id="linear-gradient-3"
        x1="401.26"
        y1="172.92"
        x2="120.66"
        y2="710.39"
        xlinkHref="#linear-gradient"
      />
    </defs>
    <path
      className="cls-1"
      d="M84.53,358.89A16.63,16.63,0,0,1,96.28,354H501.73a8.3,8.3,0,0,1,5.87,14.18l-80.09,80.09a16.61,16.61,0,0,1-11.75,4.86H10.31A8.31,8.31,0,0,1,4.43,439Z"
      transform="translate(-1.98 -55)"
    />
    <path
      className="cls-2"
      d="M84.53,59.85A17.08,17.08,0,0,1,96.28,55H501.73a8.3,8.3,0,0,1,5.87,14.18l-80.09,80.09a16.61,16.61,0,0,1-11.75,4.86H10.31A8.31,8.31,0,0,1,4.43,140Z"
      transform="translate(-1.98 -55)"
    />
    <path
      className="cls-3"
      d="M427.51,208.42a16.61,16.61,0,0,0-11.75-4.86H10.31a8.31,8.31,0,0,0-5.88,14.18l80.1,80.09a16.6,16.6,0,0,0,11.75,4.86H501.73a8.3,8.3,0,0,0,5.87-14.18Z"
      transform="translate(-1.98 -55)"
    />
  </svg>
);

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [searchParams] = useSearchParams();

  const { isAuthenticated } = useAuth();

  // Obter parâmetros da URL
  const plan = searchParams.get('plan');
  const billing = searchParams.get('billing');
  const redirect = searchParams.get('redirect');

  // Se o usuário já está autenticado, redireciona diretamente
  useEffect(() => {
    if (isAuthenticated()) {
      const params = new URLSearchParams();
      if (plan) params.append('plan', plan);
      if (billing) params.append('billing', billing);
      
      if (params.toString()) {
        window.location.href = `/auth/callback?${params.toString()}`;
      } else {
        window.location.href = '/auth/callback';
      }
      return;
    }
  }, [isAuthenticated, plan, billing]);

  // Dados para a seção lateral
  const testimonials = [
    {
      text: "O Reppy transformou como nossa república encontra bixos. Economizamos horas preciosas a cada chamada!",
      name: "República Alpha",
      role: "Medicina USP",
      avatar: "https://placehold.co/48x48/1bff17/ffffff?text=A"
    },
    {
      text: "A filtragem por curso e campus nos ajuda a encontrar exatamente os perfis que buscamos. Essencial!",
      name: "República Beta",
      role: "Engenharia Poli",
      avatar: "https://placehold.co/48x48/1bff17/ffffff?text=B"
    }
  ];

  // 🔥 NOVA FUNÇÃO: Login com redirecionamento personalizado
  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setError('');
    setSelectedProvider(provider);

    try {
      // Construir URL de redirecionamento com parâmetros
      const baseRedirect = `${window.location.origin}/auth/callback`;
      
      let redirectUrl = baseRedirect;
      
      // Se há parâmetros de plano, adicionar à URL de redirecionamento
      if (plan || billing) {
        const params = new URLSearchParams();
        if (plan) params.append('plan', plan);
        if (billing) params.append('billing', billing);
        if (redirect) params.append('redirect', redirect);
        
        redirectUrl = `${baseRedirect}?${params.toString()}`;
      }

      console.log('🔵 Login - Provider:', provider);
      console.log('🔵 Login - Redirect URL:', redirectUrl);
      console.log('🔵 Login - Parâmetros:', { plan, billing, redirect });

      // Fazer login diretamente com Supabase para controlar o redirect
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          queryParams: provider === 'google' ? {
            access_type: 'offline',
            prompt: 'consent',
          } : {},
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('🔴 Supabase OAuth error:', error);
        throw error;
      }

      console.log('✅ Login iniciado com sucesso');

    } catch (err) {
      console.error('🔴 Login error:', err);
      setError(err.message || `Erro ao fazer login com ${provider}. Tente novamente.`);
      setIsLoading(false);
      setSelectedProvider('');
    }
  };

  // 🔥 NOVO: Obter texto informativo baseado no plano selecionado
  const getPlanInfoText = () => {
    if (!plan) return null;

    const planNames = {
      'free': 'Bixo (Grátis)',
      'basic': 'Veterano',
      'premium': 'Veterano Mor'
    };

    const billingText = billing === 'yearly' ? 'anual' : 'mensal';
    const planName = planNames[plan] || plan;

    return `Você está selecionando o plano ${planName} (${billingText})`;
  };

  const planInfoText = getPlanInfoText();

  return (
    <div className="fixed inset-0 w-full h-full bg-white font-sans md:grid md:grid-cols-2 overflow-hidden">
      {/* Coluna Esquerda - Formulário */}
      <div className="flex flex-col justify-center p-6 md:p-12 lg:p-20 bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <Link to="/" className="block mb-12">
            <img 
              src="/logo_preto.png" 
              alt="Reppy Logo" 
              className="h-10 w-auto mb-8 cursor-pointer"
              onError={(e) => { 
                e.currentTarget.src = 'https://placehold.co/120x40/000000/FFFFFF?text=reppy&font=inter'; 
                e.currentTarget.onerror = null; 
              }}
            />
          </Link>

          {/* Cabeçalho */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Entre na sua conta
            </h2>
            <p className="text-gray-600 text-lg">
              {planInfoText || 'Use sua conta social para acessar o Reppy'}
            </p>

            {/* 🔥 NOVO: Informação do plano selecionado */}
            {planInfoText && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-blue-700 text-sm font-medium">
                    {planInfoText}
                  </p>
                </div>
                <p className="text-blue-600 text-xs mt-2">
                  Após o login, você será redirecionado para finalizar a seleção do plano.
                </p>
              </div>
            )}
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Botões Sociais */}
          <div className="space-y-4">
            <button 
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="
                w-full flex items-center justify-center px-6 py-4
                border border-gray-200 rounded-xl
                text-gray-700 font-semibold
                bg-white/80 backdrop-blur-sm
                transition-all duration-200
                hover:border-gray-300 hover:bg-white
                hover:shadow-lg hover:scale-105
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                group
              "
            >
              <GoogleIcon />
              {isLoading && selectedProvider === 'google' ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                  {plan ? 'Processando...' : 'Entrando...'}
                </div>
              ) : (
                `Continuar com Google${plan ? ' e escolher plano' : ''}`
              )}
            </button>

            <button 
              onClick={() => handleSocialLogin('solana')}
              disabled={isLoading}
              className="
                w-full flex items-center justify-center px-6 py-4
                border border-gray-200 rounded-xl
                text-gray-700 font-semibold
                bg-white/80 backdrop-blur-sm
                transition-all duration-200
                hover:border-gray-300 hover:bg-white
                hover:shadow-lg hover:scale-105
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                group
              "
            >
              <SolanaIcon />
              {isLoading && selectedProvider === 'solana' ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                  {plan ? 'Processando...' : 'Entrando...'}
                </div>
              ) : (
                `Continuar com Solana${plan ? ' e escolher plano' : ''}`
              )}
            </button>
          </div>

          {/* 🔥 NOVO: Informações adicionais para seleção de plano */}
          {plan && (
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                📋 O que acontece depois do login?
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Você será redirecionado para finalizar a seleção do plano</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Se for seu primeiro acesso, criaremos sua república</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Plano ativado automaticamente após confirmação</span>
                </li>
              </ul>
            </div>
          )}

          {/* Link para planos se não veio de lá */}
          {!plan && (
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Ainda não escolheu um plano?{' '}
                <Link 
                  to="/planos" 
                  className="text-[#1bff17] font-semibold hover:underline transition-colors"
                >
                  Ver planos disponíveis
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Coluna Direita - Testemunhos */}
      <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-12 lg:p-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, #1bff17 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="w-full max-w-md mx-auto relative z-10">
          <div className="space-y-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <div className="text-xl text-gray-200 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </div>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action na lateral */}
          <div className="mt-12 p-6 bg-green-500/10 rounded-xl border border-green-500/20">
            <h3 className="font-bold text-white mb-2">
              {plan ? '✨ Plano Selecionado!' : 'Junte-se a centenas de repúblicas'}
            </h3>
            <p className="text-green-200 text-sm">
              {plan 
                ? 'Quase lá! Faça login para ativar seu plano e começar a encontrar bixos.'
                : 'Simplifique o processo de encontrar calouros e gerencie sua república de forma inteligente.'
              }
            </p>
          </div>

          {/* 🔥 NOVO: Informação adicional sobre planos */}
          {plan && (
            <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <h4 className="font-bold text-white mb-2 text-sm">💡 Todos os planos incluem:</h4>
              <ul className="text-blue-200 text-xs space-y-1">
                <li>• Cadastro completo da sua república</li>
                <li>• Gestão de membros e calouros</li>
                <li>• Filtros inteligentes por curso e campus</li>
                <li>• Suporte dedicado</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 NOVO: Loading overlay para estado de carregamento */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 border-4 border-green-200 border-t-[#1bff17] rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              {plan ? 'Preparando seu plano...' : 'Conectando...'}
            </h3>
            <p className="text-gray-600 text-center text-sm">
              {plan 
                ? 'Redirecionando para o provedor de autenticação'
                : 'Aguarde um momento'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;