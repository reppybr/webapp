// components/analytics/HotLeadsTable.jsx
import React, { useState } from 'react';
import { FiStar, FiUsers, FiMessageSquare } from 'react-icons/fi';

export const HotLeadsTable = ({ data, loading }) => {
  const [selectedLead, setSelectedLead] = useState(null);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Leads Quentes</h3>
          <p className="text-sm text-gray-600">Calouros com interesse de múltiplas repúblicas</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FiUsers className="w-4 h-4" />
          <span>{data?.length || 0} leads</span>
        </div>
      </div>

      <div className="space-y-3">
        {data?.slice(0, 8).map((lead, index) => (
          <div
            key={lead.id}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setSelectedLead(lead)}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {lead.name?.charAt(0) || 'C'}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{lead.name || 'Calouro'}</h4>
                <p className="text-sm text-gray-600">{lead.course}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <FiUsers className="w-4 h-4" />
                  <span>{lead.republic_count || 0} reps</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <FiMessageSquare className="w-3 h-3" />
                  <span>{lead.contact_count || 0} contatos</span>
                </div>
              </div>
              <div className="flex items-center">
                <FiStar className="w-5 h-5 text-yellow-400" />
                <span className="ml-1 text-sm font-medium text-gray-900">
                  {lead.heat_score || 85}
                </span>
              </div>
            </div>
          </div>
        ))}

        {(!data || data.length === 0) && (
          <div className="text-center py-8">
            <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum lead quente encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};