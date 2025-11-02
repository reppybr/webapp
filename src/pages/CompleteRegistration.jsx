// src/pages/CompleteRegistration.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../hooks/useLocation';

const CompleteRegistration = () => {
  const [republicName, setRepublicName] = useState('');
  const [republicType, setRepublicType] = useState('mista');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { completeSocialRegistration, user } = useAuth();
  const { states, cities, loadingStates, loadingCities, fetchStates, fetchCities } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 🔥 CAPTURAR PARÂMETROS DA URL
  const planParam = searchParams.get('plan');
  const billingParam = searchParams.get('billing');
  const redirectParam = searchParams.get('redirect');

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  useEffect(() => {
    if (selectedState) {
      fetchCities(selectedState);
      setSelectedCity('');
    } else {
      setSelectedCity('');
    }
  }, [selectedState, fetchCities]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!republicName.trim()) {
      setError('Por favor, digite um nome para sua república');
      return;
    }

    if (!selectedState) {
      setError('Por favor, selecione um estado');
      return;
    }

    if (!selectedCity) {
      setError('Por favor, selecione uma cidade');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const stateObj = states.find(s => s.id.toString() === selectedState);
      const cityObj = cities.find(c => c.id.toString() === selectedCity);

      console.log('Completing registration for user:', user?.id);
      await completeSocialRegistration(
        republicName, 
        republicType,
        cityObj.nome,
        stateObj.sigla
      );
      
      console.log('Registration completed, checking for plan parameters');
      
      // 🔥 REDIRECIONAMENTO INTELIGENTE APÓS CADASTRO
      if (planParam) {
        // Se havia parâmetros de plano, redireciona para planos/checkout
        const params = new URLSearchParams({
          plan: planParam,
          billing: billingParam || 'monthly'
        }).toString();
        
        // Decide para onde redirecionar baseado no tipo de plano
        const redirectTo = planParam === 'free' ? '/planos' : '/checkout';
        navigate(`${redirectTo}?${params}`, { replace: true });
      } else if (redirectParam) {
        // Se tinha um redirect específico
        navigate(redirectParam, { replace: true });
      } else {
        // Fluxo normal - vai para planos
        navigate('/planos', { replace: true });
      }
      
    } catch (err) {
      console.error('Complete registration error:', err);
      setError(err.message || 'Erro ao criar república. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 NOVO: Indicador visual de que será redirecionado para seleção de plano
  const showPlanRedirectNotice = !!planParam;

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-gray-50 to-white font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-8 md:p-12 shadow-2xl">
        {/* Logo */}
        <div className="block text-center mb-8">
          <div className="inline-flex items-center gap-3 group">
            <img 
              src="/logo_preto.png" 
              alt="Reppy Logo" 
              className="h-10 w-auto mb-8 cursor-pointer mx-auto"
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/120x40/000000/FFFFFF?text=reppy&font=inter'; e.currentTarget.onerror = null; }}
            />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#1bff17] to-[#14cc11] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {showPlanRedirectNotice ? 'Primeiro, crie sua república' : 'Complete seu cadastro'}
          </h2>
          <p className="text-gray-600">
            {showPlanRedirectNotice 
              ? 'Precisamos conhecer sua república antes de ativar seu plano' 
              : 'Crie sua república e comece a gerenciar suas contas'}
          </p>
          
          {/* 🔥 NOVO: Indicador de progresso do plano */}
          {showPlanRedirectNotice && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3">
              <div className="flex items-center justify-center text-blue-700">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-medium">
                  Em seguida, você escolherá o plano <span className="capitalize">{planParam}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos do formulário permanecem iguais */}
          <div>
            <label htmlFor="republic_name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome da República *
            </label>
            <input
              type="text"
              id="republic_name"
              value={republicName}
              onChange={(e) => setRepublicName(e.target.value)}
              placeholder="ex: República Viracopos, Alpha House, etc."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1bff17] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <div className="relative">
                <select
                  id="state"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1bff17] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none"
                  required
                >
                  <option value="">Selecione um estado</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.nome} ({state.sigla})
                    </option>
                  ))}
                </select>
                {loadingStates && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-[#1bff17] rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Cidade *
              </label>
              <div className="relative">
                <select
                  id="city"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState || loadingCities}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1bff17] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">
                    {loadingCities ? 'Carregando cidades...' : selectedState ? 'Selecione uma cidade' : 'Selecione um estado primeiro'}
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.nome}
                    </option>
                  ))}
                </select>
                {loadingCities && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-[#1bff17] rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo da República *
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setRepublicType('feminina')}
                className={`p-3 border-2 rounded-xl text-center transition-all duration-200 ${
                  republicType === 'feminina'
                    ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm'
                    : 'border-gray-200 bg-white/50 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">Feminina</span>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setRepublicType('masculina')}
                className={`p-3 border-2 rounded-xl text-center transition-all duration-200 ${
                  republicType === 'masculina'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-gray-200 bg-white/50 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">Masculina</span>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setRepublicType('mista')}
                className={`p-3 border-2 rounded-xl text-center transition-all duration-200 ${
                  republicType === 'mista'
                    ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                    : 'border-gray-200 bg-white/50 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium">Mista</span>
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full relative group
              bg-gradient-to-r from-[#1bff17] to-[#14cc11]
              text-white font-bold py-4 px-6
              rounded-xl shadow-lg shadow-green-500/25
              transition-all duration-300
              hover:shadow-xl hover:shadow-green-500/30
              hover:scale-105
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                {showPlanRedirectNotice ? 'Criando república...' : 'Registrando república...'}
              </div>
            ) : (
              showPlanRedirectNotice ? 'Criar República e Escolher Plano' : 'Registrar Minha República'
            )}
          </button>
          
          {/* 🔥 NOVO: Link para pular criação de república (caso necessário) */}
          {!showPlanRedirectNotice && (
            <button
              type="button"
              onClick={() => navigate('/planos')}
              className="w-full text-center text-gray-500 hover:text-gray-700 text-sm font-medium py-2 transition-colors duration-200"
            >
              Pular por enquanto e escolher um plano depois
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompleteRegistration;