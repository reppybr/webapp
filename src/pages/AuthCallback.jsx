// src/pages/AuthCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const { user, loading, isAuthenticated, hasRepublic, hasActivePlan } = useAuth();

  useEffect(() => {
    console.log('🔵 AuthCallback - Estado atual:', {
      loading,
      isAuthenticated: isAuthenticated(),
      hasRepublic: hasRepublic(),
      hasActivePlan: hasActivePlan(),
      user: user
    });

    if (loading) {
      console.log('🟡 AuthCallback - Ainda carregando...');
      return;
    }

    // Se não está autenticado, vai para login
    if (!isAuthenticated()) {
      console.log('🔴 AuthCallback - Não autenticado, redirecionando para login');
      navigate('/login', { replace: true });
      return;
    }

    // 🔥 CAPTURAR PARÂMETROS DE PLANO DA URL
    const planFromUrl = searchParams.get('plan');
    const billingFromUrl = searchParams.get('billing');
    const redirectFromUrl = searchParams.get('redirect');

    console.log('🔵 AuthCallback - Parâmetros da URL:', { 
      planFromUrl, 
      billingFromUrl, 
      redirectFromUrl
    });

    // 🔥 LÓGICA PRINCIPAL CORRIGIDA - VERIFICAÇÃO EM ORDEM
    if (planFromUrl) {
      console.log('🟡 AuthCallback - Plano detectado na URL:', planFromUrl);
      
      if (!hasRepublic()) {
        // Usuário não tem república - redireciona para completar cadastro COM OS PARÂMETROS
        console.log('🟡 AuthCallback - Usuário sem república, redirecionando para complete-registration com parâmetros');
        const params = new URLSearchParams({
          plan: planFromUrl,
          billing: billingFromUrl || 'monthly',
          redirect: redirectFromUrl || '/planos'
        }).toString();
        navigate(`/complete-registration?${params}`, { replace: true });
        return;
      } else if (!hasActivePlan()) {
        // Usuário tem república mas não tem plano - vai para planos com os parâmetros
        console.log('🟡 AuthCallback - Usuário com república mas sem plano, redirecionando para planos');
        const params = new URLSearchParams({
          plan: planFromUrl,
          billing: billingFromUrl || 'monthly'
        }).toString();
        navigate(`/planos?${params}`, { replace: true });
        return;
      }
    }

    // 🔥 LÓGICA PADRÃO DE REDIRECIONAMENTO
    if (hasActivePlan()) {
      console.log('✅ AuthCallback - Usuário tem plano ativo, redirecionando para dashboard');
      navigate('/dashboard', { replace: true });
    } else if (hasRepublic()) {
      console.log('🟡 AuthCallback - Usuário tem república mas não tem plano, redirecionando para planos');
      navigate('/planos', { replace: true });
    } else {
      console.log('🟡 AuthCallback - Usuário não tem república, redirecionando para complete-registration');
      navigate('/complete-registration', { replace: true });
    }
  }, [user, loading, isAuthenticated, hasRepublic, hasActivePlan, navigate, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-8 shadow-2xl">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro no Login</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-[#1bff17] to-[#14cc11] text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Voltar para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/logo_preto.png" 
            alt="Reppy Logo" 
            className="h-10 w-auto mx-auto mb-4"
            onError={(e) => { 
              e.currentTarget.src = 'https://placehold.co/120x40/000000/FFFFFF?text=reppy&font=inter'; 
              e.currentTarget.onerror = null; 
            }}
          />
        </div>

        {/* Loading Animation */}
        <div className="relative mb-6 w-24 h-24 mx-auto">
          {/* Círculo externo (base) */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          {/* Círculo interno (animado) */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1bff17] border-b-[#14cc11] animate-spin-slow"></div>
          {/* Círculo do meio (animado em direção oposta) */}
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-l-[#1bff17] border-r-[#14cc11] animate-spin-reverse-slow"></div>

          {/* Ícone central - simula conexão */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-gray-700 animate-pulse-fast" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.105A9.76 9.76 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">
            {loading ? 'Conectando à Reppy...' : 'Autenticação concluída!'}
          </h2>
          <p className="text-gray-600 text-lg">
            {loading ? 'Estamos configurando sua conta e preparando tudo.' : 'Redirecionando você para o seu destino.'}
          </p>
        </div>

        {/* Subtle Progress Indicator (mantido e aprimorado) */}
        <div className="mt-8 flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((dot) => (
            <div
              key={dot}
              className={`w-3 h-3 rounded-full bg-gray-300 transition-all duration-300 ${
                loading ? 'animate-bounce-delay' : 'bg-[#1bff17]'
              }`}
              style={{
                animationDelay: `${dot * 0.15}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
