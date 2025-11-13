// components/analytics/CourseRadar.jsx
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export const CourseRadar = ({ data, loading }) => {
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

  // Transformar dados para o formato do radar chart
  const radarData = data?.map(item => ({
    subject: item.course_name,
    competicao: item.competition_level,
    oportunidade: item.opportunity_score,
    fullMark: 100
  })) || [];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Radar de Cursos</h3>
        <p className="text-sm text-gray-600">Competição vs Oportunidade por curso</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fontSize: 11 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Competição"
              dataKey="competicao"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.3}
            />
            <Radar
              name="Oportunidade"
              dataKey="oportunidade"
              stroke="#1bff17"
              fill="#1bff17"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center space-x-6 mt-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
          <span className="text-gray-600">Competição</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#1bff17] rounded mr-2"></div>
          <span className="text-gray-600">Oportunidade</span>
        </div>
      </div>
    </div>
  );
};