import React from 'react';
import { 
  FiBarChart2, 
  FiStar, 
  FiActivity,
  FiRefreshCw
} from 'react-icons/fi';
// 🔥 1. Importar o useNavigate
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { RealTimeMetrics } from './analytics/RealTimeMetrics';
import { FunnelChart } from './analytics/FunnelChart';
import { HotLeadsTable } from './analytics/HotLeadsTable';
import { CourseRadar } from './analytics/CourseRadar';
import { HiddenOpportunities } from './analytics/HiddenOpportunities';

const PremiumDashboard = () => {
  const { loading, error, data } = useAnalytics();
  const { user, refreshUserProfile } = useAuth();

  const handleRefresh = async () => {
    await refreshUserProfile();
    window.location.reload();
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 font-semibold mb-2">Erro ao carregar analytics</div>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel de Inteligência
          </h1>
          <p className="text-gray-600">
            Dados em tempo real e insights para otimizar sua captação
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
          
          <div className="px-3 py-1 bg-[#1bff17] text-gray-900 rounded-full text-sm font-bold">
            PREMIUM
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <RealTimeMetrics 
        data={data.marketPulse} 
        loading={loading}
      />

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8 mt-8">
        {/* Coluna Principal (Ações) - 60% */}
        <div className="lg:col-span-3 space-y-8">
          <HotLeadsTable 
            data={data.hotLeads} 
            loading={loading}
          />
          <CourseRadar 
            data={data.courseRadar} 
            loading={loading}
          />
        </div>

        {/* Coluna Secundária (Insights) - 40% */}
        <div className="lg:col-span-2 space-y-8">
          <HiddenOpportunities 
            data={data.hiddenOpportunities} 
            loading={loading}
          />
          <FunnelChart 
            data={data.funnelStats} 
            loading={loading}
          />
        </div>
      </div>

      {/* Additional Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Benchmark Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Benchmark de Conversão</h4>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {data.benchmark?.market_conversion_rate || 0}%
            </span>
            <span className="text-sm text-gray-500 mb-1">média do mercado</span>
          </div>
        </div>

        {/* Gender Competition */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Competição por Gênero</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Feminino</span>
              <span className="font-medium text-gray-900">
                {data.genderCompetition?.competition_female_leads || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Masculino</span>
              <span className="font-medium text-gray-900">
                {data.genderCompetition?.competition_male_leads || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Member Ranking Preview */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Top Membros</h4>
          <div className="space-y-2">
            {data.memberRanking?.slice(0, 2).map((member, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 truncate mr-2">
                  {member.member_name}
                </span>
                <span className="font-medium text-gray-900">
                  {member.calouros_saved}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Level */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Atividade da Semana</h4>
          <div className="text-2xl font-bold text-gray-900">
            {data.activityHeatmap?.reduce((sum, day) => sum + (day.count || 0), 0) || 0}
          </div>
          <p className="text-sm text-gray-500">ações realizadas</p>
        </div>
      </div>
    </div>
  );
};


// =====================================================================
// == 🔥 2. COMPONENTE ATUALIZADO
// =====================================================================

const UpgradePrompt = () => {
  // const { choosePlan } = useAuth(); // <-- Removido
  const navigate = useNavigate(); // <-- Adicionado

  const handleUpgrade = () => {
    // choosePlan('premium', 'monthly'); // <-- Lógica antiga removida
    navigate('/planos'); // <-- Nova lógica de navegação
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="relative rounded-2xl bg-gray-900 p-8 md:p-12 text-center text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          
          {/* Badge */}
          <span className="inline-block px-4 py-2 bg-[#1bff17] text-gray-900 rounded-full text-sm font-bold mb-4">
            PLANO VETERANO MOR
          </span>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Inteligência de Mercado
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
            Acesse dados exclusivos de concorrência, leads quentes, radar de cursos 
            e analytics avançados para dominar a captação de calouros.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left max-w-md mx-auto">
            {[
              'Pulso de mercado em tempo real',
              'Leads quentes com multi-interesse',
              'Radar de competição por curso',
              'Oportunidades ocultas',
              'Benchmark contra o mercado',
              'Ranking de performance interna'
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <FiStar className="w-5 h-5 text-[#1bff17] flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleUpgrade}
            className="px-8 py-4 bg-[#1bff17] text-gray-900 rounded-xl text-lg font-bold shadow-lg hover:scale-105 transform transition-all duration-200"
          >
            DESBLOQUEAR INTELIGÊNCIA
          </button>

          {/* Footer Note */}
          <p className="text-sm text-gray-400 mt-6">
            • Upgrade instantâneo
          </p>
        </div>
      </div>
    </div>
  );
};

const AnalyticsSection = () => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FiActivity className="animate-spin w-8 h-8 text-gray-400" />
      </div>
    );
  }

  // Verifica se usuário tem plano premium
  const isPremium = user?.user_profile?.user_plan?.plan_type === 'premium';

  return isPremium ? <PremiumDashboard /> : <UpgradePrompt />;
};

export default AnalyticsSection;