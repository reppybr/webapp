// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userProfile = await response.json();
      return userProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Erro ao carregar perfil do usuário');
      return {
        has_republic: false,
        has_active_plan: false,
        user_plan: null
      };
    }
  };

  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.access_token);
        setUser({
          ...session.user,
          user_profile: userProfile
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setError('Erro ao inicializar autenticação');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.access_token);
        setUser({
          ...session.user,
          user_profile: userProfile
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Login com Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Google login error:', error);
      setError('Erro ao fazer login com Google');
      throw error;
    }
  };

  // Login com Solana
const loginWithSolana = async () => {
    try {
      setError(null);

      // 1. Verifica se a carteira Solflare (ou outra) está presente
      // A Solflare se injeta como window.solana ou window.solflare
      const solanaProvider = window.solflare || window.solana;
      if (!solanaProvider) {
        throw new Error('Carteira Solflare não detectada. Instale a extensão.');
      }

      // 2. Usa a função correta: signInWithWeb3
      const { data, error } = await supabase.auth.signInWithWeb3({
        chain: 'solana',
        statement: 'Concordo em assinar para autenticar no Reppy.', // Mensagem obrigatória
        wallet: solanaProvider // Passa o provider explicitamente
      });

      if (error) throw error;

      // 3. Opcional: Força a atualização do perfil após o login Web3
      if (data.session) {
        await refreshUserProfile();
      }

      return data;
    } catch (error) {
      console.error('Solana login error:', error);
      // Exibe o erro real da carteira/Supabase se existir
      setError(error.message || 'Erro ao fazer login com Solana');
      throw error;
    }
  };
  const getUserCity = () => {
    return user?.user_profile?.user_city || null;
  };
  
  // Método para obter dados da API baseado no plano
  const fetchCityData = async (city) => {
    try {
      if (!session) throw new Error('No session found');
      
      const planType = getPlanType();
      let endpoint;
      
      // 🔥 DEFINE QUAL ENDPOINT USAR BASEADO NO PLANO
      if (planType === 'free') {
        endpoint = `${API_URL}/api/v1/cidade/${city}/chamada1`;
      } else {
        endpoint = `${API_URL}/api/v1/cidade/${city}/completo`;
      }
      
      console.log(`🟡 [API] Buscando dados para ${city} no endpoint: ${endpoint} (Plano: ${planType})`);
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching city data:', error);
      setError('Erro ao carregar dados da cidade');
      return null;
    }
  };
  // Método unificado para login social
  const socialLogin = async (provider) => {
    if (provider === 'google') return await loginWithGoogle();
    if (provider === 'solana') return await loginWithSolana();
    throw new Error(`Provider ${provider} not supported`);
  };

  const completeSocialRegistration = async (republicName, republicType = 'mista', city, state) => {
    try {
      if (!session) throw new Error('No session found');
  
      setError(null);
      const response = await fetch(`${API_URL}/auth/complete-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          republic_name: republicName,
          republic_type: republicType,
          city: city,
          state: state
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete registration');
      }
  
      const updatedProfile = await response.json();
  
      // Atualizar estado local
      setUser(prev => ({
        ...prev,
        user_profile: updatedProfile
      }));
      
      return updatedProfile;
    } catch (error) {
      console.error('Complete registration error:', error);
      setError(error.message);
      throw error;
    }
  };

  const choosePlan = async (planType, billingCycle = 'monthly', paymentMethod = 'mock') => {
    try {
      if (!session) throw new Error('No session found');
  
      setError(null);
      const response = await fetch(`${API_URL}/plans/choose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          plan_type: planType,
          billing_cycle: billingCycle,
          payment_method: paymentMethod
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        
        // 🔥 TRATAMENTO ESPECÍFICO PARA USUÁRIO SEM REPÚBLICA
        if (errorData.error_code === 'NO_REPUBLIC') {
          // Redireciona para complete-registration com os parâmetros do plano
          const params = new URLSearchParams({
            plan: planType,
            billing: billingCycle,
            redirect: '/planos'
          }).toString();
          
          window.location.href = `/complete-registration?${params}`;
          return; // Impede que o erro seja lançado
        }
        
        throw new Error(errorData.error || 'Failed to choose plan');
      }
  
      const result = await response.json();
      await refreshUserProfile();
      return result;
    } catch (error) {
      console.error('Choose plan error:', error);
      
      // 🔥 Só seta o erro se não for redirecionamento
      if (!error.message.includes('redirecionamento')) {
        setError(error.message);
      }
      
      throw error;
    }
  };
  const createCheckout = async (planType, billingCycle = 'monthly') => {
    try {
      if (!session) throw new Error('No session found');
  
      setError(null);
      const response = await fetch(`${API_URL}/pagamentos/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          plan_type: planType,
          billing_cycle: billingCycle
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Create checkout error:', error);
      setError(error.message);
      throw error;
    }
  };
  // 🔥 NOVO: Método para fazer upgrade de plano
  const upgradePlan = async (newPlanType, billingCycle = 'monthly') => {
    try {
      if (!session) throw new Error('No session found');

      setError(null);
      const response = await fetch(`${API_URL}/plans/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          new_plan_type: newPlanType,
          billing_cycle: billingCycle
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upgrade plan');
      }

      const result = await response.json();
      
      // Atualizar estado local com o novo plano
      await refreshUserProfile();
      
      return result;
    } catch (error) {
      console.error('Upgrade plan error:', error);
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
      setError('Erro ao fazer logout');
      throw error;
    }
  };

  const clearError = () => setError(null);

  // 🔥 MÉTODOS DE VERIFICAÇÃO DE AUTENTICAÇÃO
  const isAuthenticated = () => {
    return !!user && !!user.user_profile;
  };

  const hasRepublic = () => {
    const hasRep = !!user?.user_profile?.republica || !!user?.user_profile?.has_republic;
    console.log('🔍 [AUTH] hasRepublic check:', {
      hasRep,
      republica: user?.user_profile?.republica,
      has_republic: user?.user_profile?.has_republic
    });
    return hasRep;
  };

  // 🔥 MÉTODOS DE PLANO - ATUALIZADOS
  const hasActivePlan = () => {
    return !!user?.user_profile?.has_active_plan;
  };

  const getUserPlan = () => {
    return user?.user_profile?.user_plan;
  };

  const getPlanType = () => {
    const plan = getUserPlan();
    return plan?.plan_type || 'none';
  };

  const isPremium = () => {
    return getPlanType() === 'premium';
  };

  const isBasic = () => {
    return getPlanType() === 'basic';
  };
  const getUserRepublic = () => {
    return user?.user_profile?.republica || null;
  };
  
  const getUserFilters = () => {
    return user?.user_profile?.user_filters || [];
  };
  
  const getUserCalouros = () => {
    return user?.user_profile?.user_calouros || [];
  };
  
  const getRepublicMembers = () => {
    return user?.user_profile?.republic_members || [];
  };
  
  // 🔥 MÉTODO PARA OBTER INFORMAÇÕES DA REPÚBLICA
  const getRepublicInfo = () => {
    const republica = getUserRepublic();
    if (!republica) return null;
    
    return {
      name: republica.name,
      city: republica.city,
      state: republica.state,
      tipo: republica.tipo || 'mista',
      university: republica.university,
      campus: republica.campus,
      capacity: republica.capacity,
      current_residents: republica.current_residents,
      is_verified: republica.is_verified
    };
  };
  const isFree = () => {
    return getPlanType() === 'free';
  };

  const hasNoPlan = () => {
    return getPlanType() === 'none';
  };

  // 🔥 MÉTODOS DE VERIFICAÇÃO DE RECURSOS POR PLANO
  const canAccessFeature = (requiredPlan) => {
    const planHierarchy = {
      'free': 0,
      'basic': 1, 
      'premium': 2
    };
    
    const currentPlanLevel = planHierarchy[getPlanType()] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan] || 0;
    
    return currentPlanLevel >= requiredPlanLevel;
  };

  const getPlanLimits = () => {
    const plan = getUserPlan();
    
    const defaultLimits = {
      free: {
        max_members: 5,
        max_calouros: 10,
        max_filters: 3,
        advanced_analytics: false,
        custom_domain: false,
        priority_support: false,
        export_data: false
      },
      basic: {
        max_members: 20,
        max_calouros: 50,
        max_filters: 10,
        advanced_analytics: true,
        custom_domain: false,
        priority_support: true,
        export_data: true
      },
      premium: {
        max_members: 100,
        max_calouros: 500,
        max_filters: 50,
        advanced_analytics: true,
        custom_domain: true,
        priority_support: true,
        export_data: true
      }
    };

    const planType = getPlanType();
    return plan?.features || defaultLimits[planType] || defaultLimits.free;
  };

  const canAddMoreMembers = (currentCount) => {
    const limits = getPlanLimits();
    return currentCount < limits.max_members;
  };

  const canAddMoreCalouros = (currentCount) => {
    const limits = getPlanLimits();
    return currentCount < limits.max_calouros;
  };

  const canAddMoreFilters = (currentCount) => {
    const limits = getPlanLimits();
    return currentCount < limits.max_filters;
  };

  const refreshUserProfile = async () => {
    if (session) {
      try {
        console.log('🔄 [AUTH] Forçando atualização do perfil...');
        const userProfile = await fetchUserProfile(session.access_token);
        
        // 🔥 CORREÇÃO: Atualização mais robusta do estado
        setUser(prev => ({
          ...prev,
          user_profile: userProfile
        }));
        
        console.log('✅ [AUTH] Perfil atualizado com sucesso:', {
          hasRepublic: !!userProfile?.republica,
          hasActivePlan: userProfile?.has_active_plan
        });
        
        return userProfile;
      } catch (error) {
        console.error('🔴 [AUTH] Erro ao atualizar perfil:', error);
        throw error;
      }
    }
    return null;
  };

  const value = {
    // 🔥 ESTADO
    user,
    session,
    loading,
    error,
    getUserRepublic,
    getUserFilters,
    getUserCalouros,
    getRepublicMembers,
    getRepublicInfo,

    // 🔥 MÉTODOS DE AUTENTICAÇÃO
    socialLogin,
    loginWithGoogle,
    loginWithSolana,
    completeSocialRegistration,
    logout,
    clearError,
    getUserCity,
  fetchCityData,
    createCheckout,
    // 🔥 MÉTODOS DE PLANO
    choosePlan,
    upgradePlan,

    // 🔥 UTILITÁRIOS DE AUTENTICAÇÃO
    isAuthenticated,
    hasRepublic,

    // 🔥 MÉTODOS DE PLANO
    hasActivePlan,
    getUserPlan,
    getPlanType,
    isPremium,
    isBasic,
    isFree,
    hasNoPlan,

    // 🔥 VERIFICAÇÕES DE RECURSOS
    canAccessFeature,
    getPlanLimits,
    canAddMoreMembers,
    canAddMoreCalouros,
    canAddMoreFilters,

    // 🔥 MÉTODOS DE ATUALIZAÇÃO
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext;
