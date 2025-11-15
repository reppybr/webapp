// components/analytics/FunnelChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FiFilter } from 'react-icons/fi';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl">
        <p className="font-bold">{label}</p>
        <p className="text-sm">
          {payload[0].value} calouros
        </p>
      </div>
    );
  }
  return null;
};

export const FunnelChart = ({ data, loading }) => {
  const funnelData = data?.por_status ? [

    { name: 'Contactados', value: data.por_status.contacted, color: '#3B82F6' },
    { name: 'Aprovados', value: data.por_status.approved, color: '#10B981' },
    { name: 'Rejeitados', value: data.por_status.rejected, color: '#EF4444' }
  ] : [];

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 h-80">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Funil de Captação</h3>
          <p className="text-sm text-gray-600">Progresso dos seus calouros</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FiFilter className="w-4 h-4" />
          <span>{data?.total_calouros_salvos || 0} totais</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={funnelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
            >
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-4">
        {funnelData.map((item, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-medium text-gray-900">{item.value}</span>
            </div>
            <p className="text-xs text-gray-500">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};