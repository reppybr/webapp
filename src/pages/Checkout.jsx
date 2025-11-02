import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente de Checkout - Redireciona para Mercado Pago
 */
const Checkout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { createCheckout, isAuthenticated } = useAuth();

  // Obter parâmetros da URL
  const plan = searchParams.get('plan');
  const billing = searchParams.get('billing');

  useEffect(() => {
    const processCheckout = async () => {
      try {
        if (!isAuthenticated()) {
          navigate('/login', { 
            replace: true,
            state: { 
              redirect: `/checkout?plan=${plan}&billing=${billing}` 
            }
          });
          return;
        }

        if (!plan || !billing) {
          throw new Error('Parâmetros de plano inválidos');
        }

        // Apenas para planos pagos
        if (plan === 'free') {
          navigate('/planos', { replace: true });
          return;
        }

        console.log(`🟡 Criando checkout para: ${plan}, ${billing}`);
        
        // Criar checkout no Mercado Pago
        const result = await createCheckout(plan, billing);
        
        console.log('✅ Checkout criado, redirecionando...', result);
        
        // Redirecionar para Mercado Pago
        window.location.href = result.checkout_url;
        
      } catch (error) {
        console.error('❌ Erro no checkout:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    processCheckout();
  }, [plan, billing, isAuthenticated, navigate, createCheckout]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro no Checkout</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/planos')}
            className="w-full bg-[#1bff17] text-black font-semibold py-3 px-6 rounded-lg hover:bg-opacity-80 transition-colors"
          >
            Voltar para Planos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-4 border-green-200 border-t-[#1bff17] rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Preparando Checkout</h2>
        <p className="text-gray-600 mb-4">
          Redirecionando para o Mercado Pago...
        </p>
        <p className="text-sm text-gray-500">
          Plano: <span className="font-semibold capitalize">{plan}</span> • 
          Cobrança: <span className="font-semibold">{billing === 'yearly' ? 'Anual' : 'Mensal'}</span>
        </p>
      </div>
    </div>
  );
};

export default Checkout;