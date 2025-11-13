// components/analytics/HiddenOpportunities.jsx
import React from 'react';
import { FiEye, FiPlus } from 'react-icons/fi';

export const HiddenOpportunities = ({ data, loading }) => {
  const handleAddLead = (opportunity) => {
    // Implementar adição do lead à república
    console.log('Adicionar lead:', opportunity);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded mb-3"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Oportunidades Ocultas</h3>
          <p className="text-sm text-gray-600">Calouros de cursos bons que ninguém salvou</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FiEye className="w-4 h-4" />
          <span>{data?.length || 0} oportunidades</span>
        </div>
      </div>

      <div className="space-y-3">
        {data?.slice(0, 6).map((opportunity, index) => (
          <div
            key={opportunity.id}
            className="flex items-center justify-between p-4 border border-green-100 rounded-lg bg-green-50"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {opportunity.name?.charAt(0) || 'C'}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{opportunity.name}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{opportunity.course}</span>
                  <span>•</span>
                  <span>{opportunity.unidade}</span>
                  <span>•</span>
                  <span className="font-medium text-green-600">Chamada {opportunity.chamada}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleAddLead(opportunity)}
              className="flex items-center space-x-2 px-3 py-2 bg-[#1bff17] text-gray-900 rounded-lg text-sm font-medium hover:bg-green-400 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          </div>
        ))}

        {(!data || data.length === 0) && (
          <div className="text-center py-8">
            <FiEye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nenhuma oportunidade oculta encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};