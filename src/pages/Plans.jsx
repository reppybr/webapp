// src/pages/Planos.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Ícone de check (✓) para a lista de recursos
const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-[#1bff17]"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

// Ícone de X (para recursos desabilitados)
const XIcon = () => (
  <svg 
    className="w-5 h-5 text-gray-400" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth="2" 
    stroke="currentColor" 
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Planos = () => {
  const [billing, setBilling] = useState('anual');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const { isAuthenticated, hasActivePlan, choosePlan, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Verificar se há parâmetros de plano na URL (vindo do login)
  React.useEffect(() => {
    const planFromUrl = searchParams.get('plan');
    const billingFromUrl = searchParams.get('billing');
    
    if (planFromUrl && isAuthenticated() && !hasActivePlan()) {
      // Usuário veio do login e não tem plano ativo - processar plano
      handlePlanSelection(planFromUrl, billingFromUrl || 'monthly');
    }
  }, [searchParams, isAuthenticated, hasActivePlan]);

  const plans = [
    {
      name: 'Bixo',
      type: 'free',
      price: { semestral: 'Grátis', anual: 'Grátis' },
      description: 'Perfeito para conhecer a plataforma e garantir os primeiros bixos.',
      features: [
        { text: 'Acesso apenas à 1ª chamada do vestibular', included: true },
        { text: 'Filtros limitados (Curso e Cidade)', included: true },
        { text: 'Acesso a todas as chamadas (listas de espera)', included: false },
        { text: 'Todos os filtros habilitados (gênero, campus)', included: false },
        { text: 'Insights e customização', included: false },
      ],
    },
    {
      name: 'Veterano',
      type: 'basic',
      price: { semestral: 'R$ 80', anual: 'R$ 65' },
      description: 'A ferramenta completa para repúblicas que não perdem tempo.',
      popular: true,
      features: [
        { text: 'Acesso a TODAS as chamadas (listas de espera)', included: true },
        { text: 'Todos os filtros habilitados (gênero, campus)', included: true },
        { text: 'Exportação de dados (CSV)', included: true },
        { text: 'Suporte prioritário via chat', included: true },
        { text: 'Insights e customização', included: false },
      ],
    },
    {
      name: 'Veterano Mor',
      type: 'premium',
      price: { semestral: 'R$ 120', anual: 'R$ 95' },
      description: 'Insights e dados customizados para repúblicas de alta performance.',
      features: [
        { text: 'Tudo do plano Veterano', included: true },
        { text: 'Insights e tendências de cursos/cidades', included: true },
        { text: 'Dashboard de customização', included: true },
        { text: 'Múltiplos usuários por república', included: true },
        { text: 'Suporte dedicado 24/7', included: true },
      ],
    },
  ];

  // 🔥 FUNÇÃO INTELIGENTE: Determinar texto e estado do botão
  const getPlanButtonConfig = (planType) => {
    const currentPlanType = getCurrentPlanType();
    
    // Se não tem plano ativo (novo usuário)
    if (!currentPlanType) {
      return {
        text: 'Selecionar Plano',
        disabled: false,
        variant: planType === 'premium' ? 'premium' : planType === 'basic' ? 'primary' : 'secondary'
      };
    }

    // Se já é o plano atual
    if (currentPlanType === planType) {
      return {
        text: 'Plano Atual',
        disabled: true,
        variant: 'current'
      };
    }

    // 🔥 LÓGICA DE UPGRADE/DOWNGRADE INTELIGENTE
    const planHierarchy = { 'free': 0, 'basic': 1, 'premium': 2 };
    const currentLevel = planHierarchy[currentPlanType];
    const targetLevel = planHierarchy[planType];

    // Upgrade permitido (sempre pode subir de nível)
    if (targetLevel > currentLevel) {
      return {
        text: 'Atualizar Plano',
        disabled: false,
        variant: planType === 'premium' ? 'premium' : 'primary'
      };
    }

    // Downgrade (não permitido por enquanto)
    if (targetLevel < currentLevel) {
      return {
        text: 'Downgrade não disponível',
        disabled: true,
        variant: 'disabled'
      };
    }

    // Plano do mesmo nível (não deveria acontecer)
    return {
      text: 'Indisponível',
      disabled: true,
      variant: 'disabled'
    };
  };

  const handlePlanSelection = async (planType, billingCycle = 'monthly') => {
    setIsLoading(true);
    setSelectedPlan(planType);
  
    try {
      // Se usuário não está logado, redireciona para login
      if (!isAuthenticated()) {
        const params = new URLSearchParams({
          plan: planType,
          billing: billingCycle,
          redirect: '/checkout'
        }).toString();
        navigate(`/login?${params}`);
        return;
      }
  
      // Se usuário já tem plano ativo e está tentando selecionar o mesmo, redireciona
      const currentPlanType = getCurrentPlanType();
      if (currentPlanType === planType) {
        navigate('/dashboard', { replace: true });
        return;
      }
  
      console.log(`🟡 Processando seleção: ${planType}, billing: ${billingCycle}`);
      
      // 🔥 NOVA LÓGICA: Free vs Pagos
      if (planType === 'free') {
        // Plano free: ativação imediata
        const result = await choosePlan(planType, billingCycle, 'mock');
        console.log('✅ Plano free ativado:', result);
        navigate('/dashboard', { replace: true });
      } else {
        // Planos pagos: redireciona para checkout
        const params = new URLSearchParams({
          plan: planType,
          billing: billingCycle
        }).toString();
        navigate(`/checkout?${params}`, { replace: true });
      }
      
    } catch (error) {
      console.error('❌ Erro ao selecionar plano:', error);
      alert(`Erro ao selecionar plano: ${error.message}`);
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  // 🔥 FUNÇÃO ATUALIZADA: Estilo do botão
  const getButtonClass = (variant, isProcessing = false, isDisabled = false) => {
    let baseClass = "w-full py-3 px-6 rounded-lg font-bold text-center transition duration-200";
    
    if (isDisabled || isProcessing) {
      return `${baseClass} bg-gray-300 text-gray-600 cursor-not-allowed`;
    }
    
    switch (variant) {
      case 'primary':
        return `${baseClass} bg-[#1bff17] text-black hover:bg-opacity-80 hover:scale-105`;
      case 'premium':
        return `${baseClass} bg-white text-gray-900 hover:bg-gray-200 hover:scale-105`;
      case 'secondary':
        return `${baseClass} bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105`;
      case 'current':
        return `${baseClass} bg-blue-500 text-white cursor-not-allowed`;
      case 'disabled':
        return `${baseClass} bg-gray-300 text-gray-600 cursor-not-allowed`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105`;
    }
  };

  const getCurrentPlanType = () => {
    if (!user?.user_profile?.user_plan) return null;
    return user.user_profile.user_plan.plan_type;
  };

  const currentPlanType = getCurrentPlanType();

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans p-8 md:p-32">
      <div className="max-w-7xl mx-auto">
        
        {/* Título e Toggle */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Encontre os bixos antes de todo mundo
          </h1>
          
        
          
          {/* Toggle de Faturamento */}
          <div className="inline-flex bg-gray-200 rounded-full p-1 relative">
            {/* O "slider" de fundo */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out
                ${billing === 'anual' ? 'translate-x-[calc(100%+8px)]' : 'translate-x-1'}
              `}
            />
            {/* Botões */}
            <button
              onClick={() => setBilling('semestral')}
              className="px-6 py-2 rounded-full text-sm font-semibold z-10 relative"
            >
              Semestral
            </button>
            <button
              onClick={() => setBilling('anual')}
              className="px-6 py-2 rounded-full text-sm font-semibold z-10 relative"
            >
              Anual
            </button>
          </div>
        </div>

        {/* Grid de Planos */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {plans.map((plan) => {
            const isCurrentPlan = currentPlanType === plan.type;
            const isProcessing = isLoading && selectedPlan === plan.type;
            const billingCycle = billing === 'anual' ? 'yearly' : 'semester';
            
            // 🔥 CONFIGURAÇÃO INTELIGENTE DO BOTÃO
            const buttonConfig = getPlanButtonConfig(plan.type);
            const isButtonDisabled = buttonConfig.disabled || isProcessing;

            return (
              <div
                key={plan.name}
                className={`
                  rounded-2xl p-8 flex flex-col
                  ${plan.type === 'premium' ? 'bg-gray-900 text-white shadow-2xl' : 'bg-white shadow-lg'}
                  ${plan.popular ? 'border-2 border-[#1bff17]' : 'border border-gray-200'}
                  ${plan.popular ? 'relative' : ''}
                  ${isCurrentPlan ? 'ring-2 ring-[#1bff17]' : ''}
                `}
              >
                {/* Selo "Mais Popular" */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1bff17] text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Mais Popular
                  </div>
                )}

                {/* Selo "Plano Atual" */}
                {isCurrentPlan && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Seu Plano
                  </div>
                )}

                {/* Cabeçalho do Card */}
                <div className="flex-grow">
                  <h3 className={`text-2xl font-semibold ${plan.type === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`mt-2 ${plan.type === 'premium' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>

                  {/* Preço */}
                  <div className="mt-6">
                    <span className={`text-5xl font-bold ${plan.type === 'premium' ? 'text-white' : 'text-gray-900'}`}>
                      {billing === 'semestral' ? plan.price.semestral : plan.price.anual}
                    </span>
                    {plan.price.semestral !== 'Grátis' && (
                      <span className={`ml-2 text-lg ${plan.type === 'premium' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {billing === 'semestral' ? '/semestre' : '/semestre (cobrado anualmente)'}
                      </span>
                    )}
                  </div>

                  {/* Recursos */}
                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.text} className="flex items-start">
                        {feature.included ? <CheckIcon /> : <XIcon />}
                        <span 
                          className={`ml-3 ${feature.included ? (plan.type === 'premium' ? 'text-gray-300' : 'text-gray-700') : (plan.type === 'premium' ? 'text-gray-600 line-through' : 'text-gray-400 line-through')}`}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* 🔥 BOTÃO COM LÓGICA INTELIGENTE */}
                <div className="mt-10">
                  <button 
                    onClick={() => handlePlanSelection(plan.type, billingCycle)}
                    disabled={isButtonDisabled}
                    className={getButtonClass(buttonConfig.variant, isProcessing, isButtonDisabled)}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processando...
                      </div>
                    ) : (
                      buttonConfig.text
                    )}
                  </button>

                  {/* 🔥 MENSAGENS EXPLICATIVAS */}
                  {currentPlanType && !isCurrentPlan && (
                    <div className="mt-2 text-xs text-center">
                      {buttonConfig.variant === 'disabled' && (
                        <span className="text-gray-500">
                          {plan.type === 'free' && currentPlanType === 'premium' && 'Contate o suporte para downgrade'}
                          {plan.type === 'free' && currentPlanType === 'basic' && 'Downgrade não disponível'}
                          {plan.type === 'basic' && currentPlanType === 'premium' && 'Já possui plano superior'}
                        </span>
                      )}
                   
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

     
      </div>
    </div>
  );
};

export default Planos;