import React from 'react';

const AboutUs = () => {
  const brightGreen = '#1bff17';
  const greenGradient = 'from-[#1bff17] to-[#14cc11]';

  return (
    <main className="font-sans antialiased bg-white">
      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center justify-center px-6 bg-gradient-to-br from-gray-50 to-white relative py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, ${brightGreen} 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Do caos à{' '}
            <span className="relative">
              <span className="relative z-10" style={{ color: brightGreen }}>conexão</span>
              <div className="absolute bottom-2 left-0 w-full h-4 bg-[#1bff17]/20 -rotate-1 z-0"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Conheça a história por trás da plataforma que está transformando 
            a forma como repúblicas encontram seus futuros membros
          </p>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-12">
            {/* Abertura Empática */}
            <div className="text-center">
              <div className="w-24 h-1 bg-gradient-to-r from-[#1bff17] to-[#14cc11] mx-auto mb-8 rounded-full"></div>
              <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed font-light">
                A lista sai. São centenas de nomes. PDFs, planilhas e caos. 
                O mesmo ritual a cada semestre, o mesmo desafio de transformar 
                dados desorganizados em conexões significativas.
              </p>
            </div>

            {/* A Origem */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Nós vivemos esse problema
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Como membros de república, experimentamos na pele a frustração 
                    de passar horas vasculhando listas desorganizadas. Sabíamos que 
                    por trás daqueles nomes havia pessoas reais - futuros amigos, 
                    colegas de casa, membros da nossa comunidade.
                  </p>
                  <p>
                    Foi naquele momento, entre PDFs abertos e planilhas confusas, 
                    que percebemos: a tecnologia poderia transformar essa experiência 
                    caótica em algo simples e significativo.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
                <div className="text-4xl mb-4" style={{ color: brightGreen }}>🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Feito por quem entende
                </h3>
                <p className="text-gray-600">
                  Desenvolvido por veteranos que viveram cada etapa do processo, 
                  do primeiro contato à integração dos novos membros.
                </p>
              </div>
            </div>

            {/* A Solução */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-white">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold mb-6">
                  Nasceu uma solução inteligente
                </h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    Criamos uma plataforma que automatiza o que antes era manual, 
                    organiza o que era caótico e transforma dados brutos em 
                    insights acionáveis.
                  </p>
                  <p>
                    PDFs se tornam painéis filtráveis. Planilhas viram CRMs 
                    inteligentes. Listas estáticas se transformam em oportunidades 
                    de conexão genuína.
                  </p>
                </div>
              </div>
            </div>

            {/* Propósito e Visão */}
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Nosso propósito
                </h3>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Acreditamos que a tecnologia deve servir para aproximar pessoas, 
                    não para criar barreiras. Cada filtro que criamos, cada dado que 
                    organizamos, tem um objetivo claro: facilitar encontros que 
                    transformam vidas universitárias.
                  </p>
                  <p>
                    Não se trata apenas de eficiência - trata-se de construir 
                    comunidades mais fortes e conexões mais significativas.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Visão de futuro
                </h3>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Imagina um mundo onde a tradição universitária e a inovação 
                    tecnológica caminham juntas. Onde o tempo economizado em 
                    burocracia é reinvestido em recepção calorosa e integração 
                    genuína.
                  </p>
                  <p>
                    Estamos construindo essa ponte entre o melhor da cultura 
                    universitária e as possibilidades infinitas da tecnologia.
                  </p>
                </div>
              </div>
            </div>

            {/* Fechamento com Força de Marca */}
            <div className="text-center py-12">
           
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Transformamos listas em conexões
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Essa não é só nossa missão - é a razão pela qual levantamos 
                todos os dias para construir um produto que faça a diferença 
                na vida das comunidades universitárias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Pronto para fazer parte dessa mudança?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Junte-se às dezenas de repúblicas que já descobriram uma forma 
              mais inteligente de conectar com seus futuros membros
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
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
                Experimentar Grátis
              </button>
              
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
        </div>
      </section>
    </main>
  );
};

export default AboutUs;