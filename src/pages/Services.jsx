import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  // Dados para os passos
  const steps = [
    {
      number: '01',
  
      title: 'Importamos as listas das universidades',
      description: 'Dados atualizados direto dos portais oficiais das instituições de ensino.'
    },
    {
      number: '02',
 
      title: 'Organizamos tudo automaticamente',
      description: 'Alunos, cursos, cidades, campus e gênero — tudo categorizado e pronto para filtrar.'
    },
    {
      number: '03',
     
      title: 'Você encontra quem procura em segundos',
      description: 'Filtre por cidade, curso ou tipo de república e veja todos os nomes instantaneamente.'
    }
  ];

  // Dados para os planos
  const plans = [
    {
      name: 'Bixo 🐣',
      price: 'Grátis',
      description: 'Perfeito para começar',
      features: [
        'Acesso à 1ª chamada',
        'Filtros básicos',
        '1 universidade',
        'Suporte por email'
      ],
      cta: 'Começar agora',
      popular: false
    },
    {
      name: 'República 🔑',
      price: 'R$ 29,90',
      period: '/mês',
      description: 'Ideal para repúblicas ativas',
      features: [
        'Todas as chamadas',
        'Filtros avançados',
        'Todas as universidades',
        'Histórico completo',
        'Exportação de dados',
        'Suporte prioritário',
        'Atualizações em tempo real'
      ],
      cta: 'Testar grátis',
      popular: true
    }
  ];

  // Dados para o FAQ
  const faqs = [
    {
      question: 'As listas são oficiais?',
      answer: 'Sim! Trabalhamos com dados oficiais das universidades, sempre atualizados e verificados.'
    },
    {
      question: 'Quantas chamadas estão disponíveis?',
      answer: 'No plano República, você tem acesso a todas as chamadas de todas as universidades cadastradas.'
    },
    {
      question: 'Como funciona o plano gratuito?',
      answer: 'O plano Bixo oferece acesso à primeira chamada de uma universidade com filtros básicos, perfeito para testar a plataforma.'
    },
    {
      question: 'Quais universidades estão disponíveis?',
      answer: 'Temos cobertura nas principais universidades do país e estamos constantemente expandindo nossa base.'
    },
    {
      question: 'Posso exportar os dados?',
      answer: 'No plano Veterano, você pode exportar as listas filtradas em formatos convenientes para sua república.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans overflow-x-hidden">
      
      {/* Seção Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Como funciona a <span className="text-[#1bff17]">Reppy</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                A Reppy organiza as listas de chamada das universidades pra você encontrar novos calouros de forma <span className="font-semibold text-gray-900">simples, rápida e filtrada</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/test"
                  className="bg-gradient-to-r from-[#1bff17] to-[#14cc11] text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 text-center"
                >
                  Testar grátis agora
                </Link>
                <Link
                  to="/planos"
                  className="border-2 border-gray-300 text-gray-700 font-semibold text-lg px-8 py-4 rounded-2xl hover:border-gray-400 hover:bg-gray-50 hover:scale-105 transition-all duration-300 text-center"
                >
                  Ver planos
                </Link>
              </div>
            </div>
            
            {/* Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#1bff17] to-[#14cc11] rounded-3xl p-8 shadow-2xl shadow-green-500/25">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="flex-1 text-center text-sm font-medium text-gray-500">lista_reppy.csv</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">Nome</div>
                      <div className="text-sm text-gray-500">Curso</div>
                      <div className="text-sm text-gray-500">Cidade</div>
                    </div>
                    
                    {[
                      { name: 'Ana Silva', course: 'Medicina', city: 'SP' },
                      { name: 'João Santos', course: 'Engenharia', city: 'RJ' },
                      { name: 'Maria Oliveira', course: 'Direito', city: 'BH' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-gray-600">{item.course}</div>
                        <div className="text-gray-600">{item.city}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1bff17] rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Lista organizada</span>
                </div>
              </div>
              
           
            </div>
          </div>
        </div>
      </section>

      {/* Seção Passo a Passo */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simples e <span className="text-[#1bff17]">eficiente</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Em três passos rápidos, você transforma listas caóticas em oportunidades organizadas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#1bff17]/20 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#1bff17] to-[#14cc11] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {step.number}
                  </div>
             
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#1bff17] to-[#14cc11] group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Demonstração do Painel */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Dashboard Preview */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Dashboard Header */}
                <div className="bg-gray-900 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-white text-sm font-medium">Dashboard Reppy</div>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-6">
                  {/* Filters */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {['Todos os cursos', 'São Paulo', 'Medicina', 'Feminino'].map((filter, index) => (
                      <div key={index} className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700">
                        {filter}
                      </div>
                    ))}
                  </div>
                  
                  {/* Results */}
                  <div className="space-y-3">
                    {[
                      { name: 'Ana Carolina Silva', course: 'Medicina USP', status: 'Disponível' },
                      { name: 'João Pedro Santos', course: 'Engenharia Poli', status: 'Contatado' },
                      { name: 'Maria Oliveira', course: 'Direito FGV', status: 'Disponível' },
                      { name: 'Pedro Henrique Lima', course: 'Administração', status: 'Em processo' }
                    ].map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-600">{student.course}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.status === 'Disponível' ? 'bg-green-100 text-green-800' :
                          student.status === 'Contatado' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {student.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Text Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Painel <span className="text-[#1bff17]">intuitivo</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                <span className="font-semibold text-white">Assim que você entra, a Reppy já mostra todos os calouros da sua cidade.</span> Selecione o curso, campus ou gênero e veja quem entrou — tudo em segundos.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  'Filtros em tempo real',
                  'Interface limpa e organizada',
                  'Dados sempre atualizados',
                  'Exportação facilitada'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-300">
                    <div className="w-6 h-6 bg-[#1bff17] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold text-lg px-6 py-3 rounded-xl hover:scale-105 transition-transform duration-300"
              >
                <span>Ver demonstração</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

   
      {/* Seção FAQ */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Perguntas <span className="text-[#1bff17]">Frequentes</span>
            </h2>
            <p className="text-xl text-gray-600">
              Tire suas dúvidas sobre a Reppy
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-[#1bff17]/20 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção CTA Final */}
      <section className="py-20 bg-gradient-to-r from-[#1bff17] to-[#14cc11] px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Organize agora as listas da sua cidade
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Encontre seus novos bixos de forma simples e eficiente
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/test"
              className="bg-white text-gray-900 font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Testar grátis agora
            </Link>
            <Link
              to="/planos"
              className="bg-transparent border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-2xl hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              Ver planos completos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;