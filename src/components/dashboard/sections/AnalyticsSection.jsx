import React from 'react';
import { FiBarChart2, FiStar } from 'react-icons/fi';

/**
 * Seção de placeholder para a página de Analytics (Estatísticas).
 * Mostra um aviso "Em Breve" e "Plano Veterano Mor".
 */
const AnalyticsSection = () => {
  return (
    // Fundo da página
    <div className="bg-gray-50 min-h-full">
      
     

      {/* 2. Card de "Em Breve" (Estilo Premium) */}
      {/* Usamos 'bg-gray-900' (cor premium) para o card, com texto claro,
        conforme a paleta de cores.
      */}
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
          Estatísticas Avançadas
        </h3>
        
        {/* Descrição */}
        <p className="text-lg text-gray-300 mt-3 max-w-xl">
          Estamos preparando uma seção completa de analytics para você tomar as melhores decisões.
          Esta funcionalidade será um benefício exclusivo do plano Veterano Mor.
        </p>

        {/* Tag "Em Breve" */}
        <span className="mt-8 px-4 py-1.5 bg-gray-700 text-white rounded-full text-sm font-medium">
          Disponível em breve
        </span>
      </div>
    </div>
  );
};

export default AnalyticsSection;
