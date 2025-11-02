import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const brightGreen = '#1bff17';
  const greenGradient = 'from-[#1bff17] to-[#14cc11]';

  // Dados para as seções
  const features = [
    {
      icon: '⚡',
      title: 'Filtros Rápidos',
      description: 'Filtre por curso, campus e gênero em segundos com nossa busca inteligente.'
    },
    {
      icon: '📊',
      title: 'Listas Completas',
      description: 'Tenha todas as chamadas organizadas e atualizadas automaticamente.'
    },
    {
      icon: '⏱️',
      title: 'Economia de Tempo',
      description: 'Pare de procurar manualmente — foque no que realmente importa para sua república.'
    },
  
  ];

  const steps = [
    {
      number: '01',
      title: 'Selecione a Cidade',
      description: 'Encontre os bixos da sua cidade em nossa base completa'
    },
 
    {
      number: '02',
      title: 'Ajuste os Filtros',
      description: 'Defina gênero, cursos e outras preferências'
    },
    {
      number: '03',
      title: 'Baixe a Lista',
      description: 'Exporte ou visualize os dados organizados'
    }
  ];

  const testimonials = [
    {
      name: 'República Alpha',
      role: 'Medicina USP',
      content: 'O Reppy economizou 3 horas de procura por chamada! Agora focamos em receber os bixos direito.',
      rating: 5
    },
    {
      name: 'República Beta',
      role: 'Engenharia Poli',
      content: 'Finalmente uma solução que entende as necessidades das repúblicas. Simplesmente essencial.',
      rating: 5
    },
    {
      name: 'República Gamma',
      role: 'Direito FGV',
      content: 'A filtragem por curso salvou nossa vida na hora de escolher os novos moradores.',
      rating: 4
    }
  ];

  return (
    <main className="font-sans antialiased overflow-hidden">
      
      {/* --- Seção Hero --- */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-gray-50 to-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, ${brightGreen} 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
         

          {/* Título Principal */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 leading-tight">
            Todos os{' '}
            <span className="relative">
              <span className="relative z-10" style={{ color: brightGreen }}>bixos</span>
              <div className="absolute bottom-2 left-0 w-full h-4 bg-[#1bff17]/20 -rotate-1 z-0"></div>
            </span>
            <br />
            em segundos.
          </h1>

          {/* Subtítulo */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            <span className="font-semibold text-gray-900">Listas organizadas</span> de qualquer faculdade, 
            filtráveis por <span className="font-semibold text-gray-900">curso</span>,{' '}
            <span className="font-semibold text-gray-900">campus</span>,{' '}
            <span className="font-semibold text-gray-900">cidade</span> e{' '}
            <span className="font-semibold text-gray-900">gênero</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/dashboard"
              className={`
                relative group bg-gradient-to-r ${greenGradient}
                text-white font-bold text-lg px-8 py-4
                rounded-2xl shadow-lg shadow-green-500/25
                transition-all duration-300
                hover:shadow-xl hover:shadow-green-500/30
                hover:scale-105
                active:scale-95
                min-w-[200px] text-center
              `}
            >
              Comece Agora
              <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
            </Link>
            
            <button className="
              group flex items-center gap-2
              text-gray-700 font-semibold text-lg px-6 py-4
              rounded-2xl border-2 border-gray-200
              transition-all duration-300
              hover:border-gray-300 hover:bg-gray-50
              hover:scale-105
              active:scale-95
              min-w-[200px] justify-center
            ">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ver Demonstração
            </button>
          </div>

       
        </div>

      
      </section>

      {/* --- Seção Features --- */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Por que escolher a <span style={{ color: brightGreen }}>Reppy</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas poderosas desenvolvidas especificamente para as necessidades das repúblicas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#1bff17]/20 transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Seção Como Funciona --- */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Como funciona?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Em apenas 3 passos simples, tenha acesso a todas as listas organizadas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
           
            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                <div className="
                  w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-[#1bff17] to-[#14cc11]
                  flex items-center justify-center text-white font-bold text-xl
                  transform group-hover:scale-110 transition-all duration-300
                  shadow-lg shadow-green-500/25
                ">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Seção Depoimentos --- */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              O que as repúblicas dizem
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Confiança e resultados comprovados por dezenas de repúblicas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-[#1bff17]/20 transition-all duration-300 hover:shadow-xl"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                
                <p className="text-gray-600 italic mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Seção CTA Final --- */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Pronto para revolucionar sua república?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Junte-se a dezenas de repúblicas que já economizam horas preciosas com o Reppy
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/planos"
                className={`
                  bg-gradient-to-r ${greenGradient}
                  text-white font-bold text-lg px-8 py-4
                  rounded-2xl shadow-lg shadow-green-500/25
                  transition-all duration-300
                  hover:shadow-xl hover:shadow-green-500/30
                  hover:scale-105
                  active:scale-95
                  min-w-[200px] text-center
                `}
              >
                Ver Planos
              </Link>
              
              <Link
                to="/test"
                className="
                  group flex items-center gap-2
                  text-gray-700 font-semibold text-lg px-6 py-4
                  rounded-2xl border-2 border-gray-200
                  transition-all duration-300
                  hover:border-gray-300 hover:bg-gray-50
                  hover:scale-105
                  active:scale-95
                  min-w-[200px] justify-center
                "
              >
                Testar Grátis
              </Link>
            </div>
            
         
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;