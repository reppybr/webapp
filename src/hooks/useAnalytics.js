// hooks/useAnalytics.js
import { useState, useEffect } from 'react';
import { statsService } from '../services/statsService';
import { useAuth } from '../contexts/AuthContext'; // Continua igual

export const useAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    funnelStats: null,
    marketPulse: null,
    hotLeads: null,
    hiddenOpportunities: null,
    courseRadar: null,
    benchmark: null,
    activityHeatmap: null,
    genderCompetition: null,
    memberRanking: null
  });

  const { user } = useAuth(); // Continua igual
  
  // 👇 1. CRIE UMA VARIÁVEL ESTÁVEL
  // Esta variável booleana só mudará de 'false' para 'true' UMA VEZ.
  const isPremium = user?.user_profile?.user_plan?.plan_type === 'premium';

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      // 👇 2. ATUALIZE A CONDIÇÃO DE SAÍDA (GUARD CLAUSE)
      if (!isPremium) {
        console.log("🟡 [Analytics] Fetch pulado: usuário não é premium ou não está carregado.");
        setLoading(false); // Para o loading se o usuário não for premium
        return;
      }

      setLoading(true);
      setError(null);
      console.log("🚀 [Analytics] Buscando todos os 9 endpoints...");

      try {
        const [
          funnelStats,
          marketPulse,
          hotLeads,
          hiddenOpportunities,
          courseRadar,
          benchmark,
          activityHeatmap,
          genderCompetition,
          memberRanking
        ] = await Promise.all([
          statsService.getMyFunnelStats(),
          statsService.getMarketPulse(),
          statsService.getHotLeads(),
          statsService.getHiddenOpportunities(),
          statsService.getCourseRadar(),
          statsService.getBenchmark(),
          statsService.getActivityHeatmap(),
          statsService.getGenderCompetition(),
          statsService.getMemberRanking()
        ]);

        setData({
          funnelStats,
          marketPulse,
          hotLeads,
          hiddenOpportunities,
          courseRadar,
          benchmark,
          activityHeatmap,
          genderCompetition,
          memberRanking
        });
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
    
    // 👇 3. MUDE A DEPENDÊNCIA
    // Agora o 'useEffect' só roda quando o status 'isPremium' realmente mudar.
  }, [isPremium]); 

  return { loading, error, data };
};