import React, { useState } from 'react';

const News = () => {
  const brightGreen = '#1bff17';
  const greenGradient = 'from-[#1bff17] to-[#14cc11]';

  // Estado para filtros
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Dados de exemplo - no futuro você substituirá por dados reais
  const [updates, setUpdates] = useState([
    {
      id: 1,
      version: 'v2.1.0',
      date: '2024-11-15',
      title: 'Filtros Avançados por Perfil',
      description: 'Nova funcionalidade permite filtrar bixos por interesses específicos e habilidades.',
      type: 'feature',
      category: 'filtros',
      status: 'released',
      readMore: '/updates/filtros-avancados',
      highlights: [
        'Filtro por hobbies e interesses',
        'Busca por habilidades específicas',
        'Compatibilidade com tags personalizadas'
      ]
    },
    {
      id: 2,
      version: 'v2.0.3',
      date: '2024-11-10',
      title: 'Otimização de Performance',
      description: 'Melhorias significativas no tempo de carregamento e resposta dos filtros.',
      type: 'improvement',
      category: 'performance',
      status: 'released',
      readMore: '/updates/otimizacao-performance',
      highlights: [
        'Carregamento 40% mais rápido',
        'Cache inteligente de buscas',
        'Otimização de banco de dados'
      ]
    },
    {
      id: 3,
      version: 'v2.0.2',
      date: '2024-11-05',
      title: 'Integração com WhatsApp Business',
      description: 'Agora é possível enviar mensagens diretamente para os bixos via WhatsApp.',
      type: 'feature',
      category: 'integracao',
      status: 'released',
      readMore: '/updates/integracao-whatsapp',
      highlights: [
        'Envios em lote',
        'Modelos de mensagem',
        'Rastreamento de entregas'
      ]
    },
    {
      id: 4,
      version: 'v2.0.1',
      date: '2024-10-28',
      title: 'Correção de Importação de PDF',
      description: 'Resolvidos problemas na leitura de PDFs com layout complexo.',
      type: 'fix',
      category: 'importacao',
      status: 'released',
      readMore: '/updates/correcao-pdf'
    },
    {
      id: 5,
      version: 'v2.1.1',
      date: '2024-12-01',
      title: 'Dashboard de Analytics',
      description: 'Novo painel com métricas de engajamento e conversão.',
      type: 'feature',
      category: 'analytics',
      status: 'beta',
      readMore: '/updates/dashboard-analytics',
      highlights: [
        'Taxas de conversão',
        'Métricas de engajamento',
        'Relatórios personalizáveis'
      ]
    },
    {
      id: 6,
      version: 'v2.2.0',
      date: '2024-12-15',
      title: 'API Pública para Desenvolvedores',
      description: 'Disponibilizamos API pública para integrações personalizadas.',
      type: 'feature',
      category: 'api',
      status: 'planned',
      readMore: '/updates/api-publica'
    }
  ]);

  // Filtros disponíveis
  const filters = [
    { id: 'all', label: 'Todas as atualizações', count: updates.length },
    { id: 'feature', label: 'Novas funcionalidades', count: updates.filter(u => u.type === 'feature').length },
    { id: 'improvement', label: 'Melhorias', count: updates.filter(u => u.type === 'improvement').length },
    { id: 'fix', label: 'Correções', count: updates.filter(u => u.type === 'fix').length }
  ];

  // Status colors
  const statusColors = {
    released: 'bg-green-100 text-green-800 border-green-200',
    beta: 'bg-blue-100 text-blue-800 border-blue-200',
    planned: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  const typeColors = {
    feature: 'bg-gradient-to-r from-[#1bff17] to-[#14cc11]',
    improvement: 'bg-gradient-to-r from-blue-500 to-blue-600',
    fix: 'bg-gradient-to-r from-orange-500 to-orange-600'
  };

  const typeIcons = {
    feature: '🚀',
    improvement: '⚡',
    fix: '🔧'
  };

  // Filtrar updates
  const filteredUpdates = updates.filter(update => {
    const matchesFilter = activeFilter === 'all' || update.type === activeFilter;
    const matchesSearch = update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Formatar data
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <main className="font-sans antialiased bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, ${brightGreen} 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            O que há de{' '}
            <span className="relative">
              <span className="relative z-10" style={{ color: brightGreen }}>novo</span>
              <div className="absolute bottom-2 left-0 w-full h-4 bg-[#1bff17]/20 -rotate-1 z-0"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Acompanhe as últimas atualizações, novas funcionalidades e melhorias 
            contínuas da plataforma Reppy.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2" style={{ color: brightGreen }}>
                {updates.filter(u => u.status === 'released').length}
              </div>
              <p className="text-gray-600">Lançamentos</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2" style={{ color: brightGreen }}>
                {updates.filter(u => u.type === 'feature').length}
              </div>
              <p className="text-gray-600">Novas features</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2" style={{ color: brightGreen }}>
                2024
              </div>
              <p className="text-gray-600">Atualizações</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros e Busca */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    activeFilter === filter.id
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                  <span className="ml-2 text-xs opacity-75">({filter.count})</span>
                </button>
              ))}
            </div>

            {/* Busca */}
            <div className="relative w-full lg:w-64">
              <input
                type="text"
                placeholder="Buscar atualizações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-2xl border border-gray-200 focus:border-[#1bff17] focus:ring-2 focus:ring-[#1bff17]/20 transition-all duration-300 outline-none"
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Updates */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          {filteredUpdates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma atualização encontrada</h3>
              <p className="text-gray-600">Tente ajustar os filtros ou termos de busca.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredUpdates.map((update, index) => (
                <div 
                  key={update.id}
                  className="group relative"
                >
                  {/* Timeline connector */}
                  {index !== filteredUpdates.length - 1 && (
                    <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-gray-200 transform -translate-y-12"></div>
                  )}

                  <div className="flex gap-6">
                    {/* Date Badge */}
                    <div className="flex-shrink-0 w-32 text-right">
                      <div className="text-sm text-gray-500 font-medium">
                        {formatDate(update.date)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {update.version}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="flex-shrink-0 relative">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg ${
                        typeColors[update.type]
                      }`}>
                        {typeIcons[update.type]}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 group-hover:border-[#1bff17]/20 group-hover:shadow-xl transition-all duration-300">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {update.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {update.description}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[update.status]}`}>
                            {update.status === 'released' ? 'Lançado' : 
                             update.status === 'beta' ? 'Em Beta' : 'Planejado'}
                          </span>
                        </div>
                      </div>

                      {/* Highlights */}
                      {update.highlights && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Destaques:</h4>
                          <ul className="space-y-2">
                            {update.highlights.map((highlight, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-600">
                                <span className="text-[#1bff17] mt-1">•</span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500 capitalize">
                          {update.type === 'feature' ? 'Nova Funcionalidade' : 
                           update.type === 'improvement' ? 'Melhoria' : 'Correção'} • {update.category}
                        </span>
                        <button className="text-[#1bff17] font-semibold text-sm hover:text-[#14cc11] transition-colors duration-300 flex items-center gap-1">
                          Ler mais
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Fique por dentro de tudo
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Cadastre-se para receber notificações sobre novas atualizações e funcionalidades.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="seu@email.com"
                className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#1bff17] focus:ring-2 focus:ring-[#1bff17]/20 transition-all duration-300 outline-none"
              />
              <button className={`
                bg-gradient-to-r ${greenGradient}
                text-white font-bold text-lg px-8 py-3
                rounded-2xl shadow-lg shadow-green-500/25
                transition-all duration-300
                hover:shadow-xl hover:shadow-green-500/30
                hover:scale-105
                active:scale-95
                min-w-[160px] text-center
              `}>
                Assinar
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Sem spam. Você pode cancelar a qualquer momento.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
};

export default News;