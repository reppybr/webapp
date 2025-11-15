// components/analytics/RealTimeMetrics.jsx
import React from 'react';
import { FiTrendingUp, FiUsers, FiTarget, FiZap } from 'react-icons/fi';

const MetricCard = ({ icon: Icon, title, value, change, changeType, loading }) => {
  const isPositive = changeType === 'positive';
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        {loading ? (
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
};

export const RealTimeMetrics = ({ data, loading }) => {
  const metrics = [
    {
      icon: FiUsers,
      title: 'Repúblicas Ativas',
      value: data?.active_republics || '0',
      change: '+12%',
      changeType: 'positive'
    },
    {
      icon: FiTarget,
      title: 'Novos Calouros Salvos',
      value: data?.new_calouros_saved || '0',
      change: '+8%',
      changeType: 'positive'
    },
    {
      icon: FiTrendingUp,
      title: 'Curso Mais Disputado',
      value: data?.most_disputed_course || 'N/A',
      change: null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} loading={loading} />
      ))}
    </div>
  );
};