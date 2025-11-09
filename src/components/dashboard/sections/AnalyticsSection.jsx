import React, { useState, useEffect } from 'react';
import { 
  FiBarChart2, 
  FiStar, 
  FiFilter, 
  FiTarget, 
  FiTrendingUp, 
  FiCheckCircle, 
  FiUsers, 
  FiArrowUp, 
  FiArrowDown, 
  FiHelpCircle,
  FiZap,
  FiActivity
} from 'react-icons/fi';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';

// --- Paleta de Cores (Definida por você) ---
// Verde Reppy: #1bff17
// Fundo: bg-gray-50 (#F9FAFB)
// Cards: bg-white (#FFFFFF)
// Destaque Premium: bg-gray-900 (#111827)
// Texto Título: text-gray-900 (#111827)
// Texto Corpo: text-gray-600 (#4B5563)
// Bordas: border-gray-200 (#E5E7EB)

const REPPY_GREEN = "#1bff17";
const PIE_COLORS = ['#111827', '#4B5563', '#9CA3AF']; // Tons escuros/neutros
const PIE_COLORS_LEADS = ['#1bff17', '#F9FAFB', '#9CA3AF']; // Verde Reppy para "Quentes"

// --- 1. Hook de Mock Data (Simula a API) ---

/**
 * Hook de mock data para simular a busca de
 * dados de BI para o painel de analytics.
 */
const useAnalyticsData = (city) => {
  const [loading, setLoading] = useState(true);
  
  // KPIs Principais
  const [kpis, setKpis] = useState({
    totalLeadsQualificados: 720,
    novosLeadsHoje: 45,
    taxaInteresseMedia: 62,
    variacaoInteresse: -3, // Negativo
    taxaConversaoPlataforma: 18,
    leadScoreMedio: 75,
  });

  // Radar de Cursos (Volume vs. Interesse)
  const [courseRadar, setCourseRadar] = useState([
    { name: 'Eng. Comp (UNICAMP)', volume: 120, interesse: 65 },
    { name: 'Medicina (UNICAMP)', volume: 110, interesse: 15 },
    { name: 'Direito (PUCCAMP)', volume: 100, interesse: 40 },
    { name: 'Sistemas (Limeira)', volume: 80, interesse: 85 },
    { name: 'Eng. Prod (UFSCar)', volume: 75, interesse: 70 },
  ]);

  // Funil de Chamadas (Oportunidade Tardia)
  const [callFunnel, setCallFunnel] = useState([
    { name: 'Chamada 1', taxaInteresse: 42 },
    { name: 'Chamada 2', taxaInteresse: 61 },
    { name: 'Chamada 3', taxaInteresse: 78 },
    { name: 'Chamada 4+', taxaInteresse: 85 },
  ]);

  // Perfil de Leads (Sua hipótese de Cotas)
  const [leadProfile, setLeadProfile] = useState([
    { name: 'Ampla Concorrência', value: 450 },
    { name: 'Cotistas/PAAIS', value: 270 },
  ]);

  // Análise de Saturação (Leads Quentes/Frios)
  const [leadSaturation, setLeadSaturation] = useState([
    { name: 'Leads Quentes (Prioridade)', value: 120 },
    { name: 'Leads Frios (Ignorar)', value: 95 },
    { name: 'Não contatados', value: 505 },
  ]);

  // Simula o fetch da API
  useEffect(() => {
    setLoading(true);
    // Simula uma chamada de API que depende da cidade
    const timer = setTimeout(() => {
      // Aqui você poderia mudar os dados com base no 'city'
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [city]);

  return { loading, kpis, courseRadar, callFunnel, leadProfile, leadSaturation };
};


// --- 2. Componentes de Widget Modulares ---

/**
 * Tooltip customizado para os gráficos
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl border border-gray-700">
        <p className="font-bold text-sm">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-xs">
            {`${entry.name}: ${entry.value}${entry.unit || ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * Widget: Card de KPI (Indicador Chave)
 * Exibe um único dado de BI de forma clara.
 */
const KpiCard = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  tooltip 
}) => {
  
  const isPositive = changeType === 'positive';
  // Usamos o verde Reppy para mudança positiva
  const changeColor = isPositive ? 'text-[#1bff17]' : 'text-red-500'; 
  const ChangeIcon = isPositive ? FiArrowUp : FiArrowDown;

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between group">
      <div className="flex justify-between items-center mb-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div className="relative">
          <FiHelpCircle className="w-4 h-4 text-gray-400 cursor-help" title={tooltip} />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <span className={`flex items-center text-sm font-semibold ${changeColor}`}>
              <ChangeIcon className="w-4 h-4 mr-0.5" />
              {change}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Widget: Radar de Oportunidade (Curso vs. Interesse)
 * Valor: Mostra onde focar (Alto Volume + Alto Interesse).
 */
const CourseRadarWidget = ({ data }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-full">
    <h3 className="text-xl font-semibold text-gray-900 mb-1">Radar de Oportunidade</h3>
    <p className="text-sm text-gray-600 mb-4">
      Foque nos cursos com alto volume E alta taxa de interesse.
    </p>
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 100 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false}
            fontSize={12}
            width={150}
            className="text-gray-600"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
          <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
          <Bar dataKey="volume" name="Volume de Aprovados" fill="#111827" radius={[0, 4, 4, 0]} unit=" alunos" />
          {/* O Verde Reppy é usado aqui como destaque */}
          <Bar dataKey="interesse" name="Taxa de Interesse" fill={REPPY_GREEN} radius={[0, 4, 4, 0]} unit="%" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

/**
 * Widget: Funil de Chamadas (Oportunidade Tardia)
 * Valor: Prova que o esforço deve continuar nas chamadas seguintes.
 */
const CallFunnelWidget = ({ data }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
    <h3 className="text-xl font-semibold text-gray-900 mb-1">Oportunidade Tardia</h3>
    <p className="text-sm text-gray-600 mb-4">
      A taxa de interesse (leads quentes) aumenta nas chamadas seguintes.
    </p>
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" fontSize={12} className="text-gray-600" />
          <YAxis unit="%" fontSize={12} className="text-gray-600" />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Line 
            type="monotone" 
            dataKey="taxaInteresse" 
            name="Taxa de Interesse" 
            stroke="#111827" 
            strokeWidth={3}
            dot={{ r: 4, fill: REPPY_GREEN, stroke: '#111827' }}
            activeDot={{ r: 6, fill: REPPY_GREEN, stroke: '#111827' }}
            unit="%" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

/**
 * Widget: Perfil de Leads (Sua Hipótese de Cotas)
 * Valor: Ajuda a testar a hipótese de conversão do plano.
 */
const LeadProfileWidget = ({ data }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
    <h3 className="text-xl font-semibold text-gray-900 mb-1">Perfil de Leads (Cotas)</h3>
    <p className="text-sm text-gray-600 mb-4">
      Distribuição de leads (teste de hipótese de conversão).
    </p>
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            className="focus:outline-none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} alunos`} />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

/**
 * Widget: Saturação de Mercado (Lead Scoring)
 * Valor: O filtro de ouro. Mostra onde focar.
 */
const LeadSaturationWidget = ({ data }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
    <h3 className="text-xl font-semibold text-gray-900 mb-1">Qualificação de Leads</h3>
    <p className="text-sm text-gray-600 mb-4">
      Priorização de leads (Inteligência Coletiva Reppy).
    </p>
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60} // Transforma em "Donut"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={3}
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            className="focus:outline-none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS_LEADS[index % PIE_COLORS_LEADS.length]} stroke={PIE_COLORS_LEADS[index % PIE_COLORS_LEADS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} alunos`} />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// --- 3. Componente "Pai" do Dashboard Premium ---

/**
 * O Dashboard de Analytics completo, exibido para usuários
 * com o plano "Veterano Mor".
 */
const AnalyticsDashboard = () => {
  const [selectedCity, setSelectedCity] = useState('campinas');
  const { loading, kpis, courseRadar, callFunnel, leadProfile, leadSaturation } = useAnalyticsData(selectedCity);

  // Layout de "Loading" para os widgets
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600 min-h-full">
        <FiActivity className="animate-spin w-12 h-12 mx-auto mb-4 text-gray-400" />
        Carregando painel de inteligência...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      
      {/* 1. Cabeçalho e Filtros Globais */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Painel de Inteligência</h1>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <FiFilter className="text-gray-500" />
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="campinas">Campinas (UNICAMP + PUCCAMP)</option>
            <option value="sao-carlos">São Carlos (USP + UFSCar)</option>
          </select>
        </div>
      </div>

      {/* 2. KPIs Principais (Visão Geral) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KpiCard 
          icon={FiTarget}
          title="Leads Qualificados (de Fora)"
          value={kpis.totalLeadsQualificados.toString()}
          change={`+${kpis.novosLeadsHoje} hoje`}
          changeType="positive"
          tooltip="Calouros com alta probabilidade de precisarem de moradia."
        />
        <KpiCard 
          icon={FiTrendingUp}
          title="Taxa de Interesse (Média)"
          value={`${kpis.taxaInteresseMedia}%`}
          change={`${kpis.variacaoInteresse}% vs semana passada`}
          changeType={kpis.variacaoInteresse > 0 ? "positive" : "negative"}
          tooltip="Média de calouros que marcaram 'Interessado' após o primeiro contato."
        />
        <KpiCard 
          icon={FiCheckCircle}
          title="Conversão Média (Plataforma)"
          value={`${kpis.taxaConversaoPlataforma}%`}
          tooltip="Média de calouros marcados como 'Fechou' por todas as reps."
        />
        <KpiCard 
          icon={FiZap}
          title="Lead Score Médio"
          value={kpis.leadScoreMedio.toString()}
          tooltip="Pontuação média de 0-100 da probabilidade de conversão do lead."
        />
      </div>

      {/* 3. Grid de Widgets de BI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna 1 e 2: Radar de Cursos (Principal) */}
        <div className="lg:col-span-2">
          <CourseRadarWidget data={courseRadar} />
        </div>

        {/* Coluna 3: Widgets menores empilhados */}
        <div className="flex flex-col space-y-6">
          <CallFunnelWidget data={callFunnel} />
        </div>

        {/* Nova Linha para Qualificação e Perfil */}
        <div className="lg:col-span-1">
           <LeadSaturationWidget data={leadSaturation} />
        </div>
        <div className="lg:col-span-2">
          <LeadProfileWidget data={leadProfile} />
        </div>

      </div>
    </div>
  );
};


// --- 4. Componente Principal (O "Controlador") ---

/**
 * Seção de placeholder para a página de Analytics (Estatísticas).
 * Mostra um aviso "Em Breve" e "Plano Veterano Mor".
 * * AGORA CONTÉM A LÓGICA PARA EXIBIR O DASHBOARD PREMIUM.
 */
const AnalyticsSection = () => {
  // Mockup do plano do usuário.
  // Mude para 'NONE' ou 'LOADING' para testar os outros estados.
  const [plan, setPlan] = useState('VETERANO_MOR');
  
  // Simula a verificação do plano do usuário ao carregar
  useEffect(() => {
    setPlan('LOADING');
    const timer = setTimeout(() => {
      // ** AQUI VOCÊ VERIFICA O PLANO DELE (do Supabase, etc.) **
      // Para testar, mude o valor final:
      setPlan('VETERANO_MOR'); 
      // setPlan('NONE'); // Para testar o placeholder
    }, 1000);
    return () => clearTimeout(timer);
  }, []);


  return (
    // Fundo da página (usando a paleta de cores definida)
    <div className="bg-gray-50 min-h-full">

      {/* Aviso importante (mantido conforme solicitado):
        Este 'switch' controla o que é exibido. No futuro, a variável 'plan'
        será definida pelo status de pagamento (Auth/Stripe) do usuário.
       */}

      {(() => {
        switch (plan) {
          
          // --- ESTADO DE CARREGAMENTO ---
          case 'LOADING':
            return (
              <div className="flex justify-center items-center min-h-[600px]">
                <FiActivity className="animate-spin w-12 h-12 text-gray-400" />
              </div>
            );

          // --- ESTADO PREMIUM: O DASHBOARD COMPLETO ---
          case 'VETERANO_MOR':
            return <AnalyticsDashboard />;

          // --- ESTADO BÁSICO/SEM PLANO: O PLACEHOLDER (Seu código original) ---
          case 'NONE':
          default:
            return (
              <div className="p-4 md:p-8">
                {/* Card de "Em Breve" (Estilo Premium) */}
                <div className="relative rounded-xl bg-gray-900 p-8 md:p-16 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden min-h-[400px]">
                  
                  {/* Ícone de gráfico (decorativo, no fundo) */}
                  <FiBarChart2 className="absolute -bottom-16 -right-10 w-56 h-56 text-white opacity-5 transform rotate-12" />

                  {/* Ícone principal (Estrela = Premium) */}
                  <div className="flex-shrink-0 bg-white text-gray-900 p-4 rounded-full mb-6 shadow-lg">
                    <FiStar className="w-10 h-10" />
                  </div>
                  
                  {/* Tag do Plano */}
                  <span className="mb-2 px-3 py-1 bg-white text-gray-900 rounded-full text-xs font-bold uppercase tracking-wider">
                    Plano Veterano Mor
                  </span>

                  {/* Título */}
                  <h3 className="text-3xl font-bold text-white mt-2">
                    Inteligência de Captação
                  </h3>
                  
                  {/* Descrição */}
                  <p className="text-lg text-gray-300 mt-3 max-w-xl">
                    Atualize seu plano para ter acesso ao Painel de Inteligência,
                    com lead scoring, análise de concorrência e radar de oportunidades.
                  </p>

                  {/* Botão de Upgrade (Mais forte que "Em Breve") */}
                  <button className="mt-8 px-6 py-3 bg-[#1bff17] text-gray-900 rounded-lg text-sm font-bold shadow-lg transform hover:scale-105 transition-transform">
                    FAZER UPGRADE AGORA
                  </button>
                </div>
              </div>
            );
        }
      })()}
    </div>
  );
};

export default AnalyticsSection;
