import React from 'react';
import { FiUsers, FiUser, FiUserCheck } from 'react-icons/fi'; // Ícones para UX

const options = [
  { label: 'Mista', value: 'Mista', icon: FiUsers },
  { label: 'Feminina', value: 'Feminina', icon: FiUser },
  { label: 'Masculina', value: 'Masculina', icon: FiUser },
];

/**
 * Componente de seleção de gênero (Masculina, Feminina, Mista)
 * com estilo de botões segmentados.
 */
const GenderSelector = ({ selected, onChange }) => {
  return (
    <div className="grid grid-cols-3 gap-2 bg-gray-100 rounded-lg p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all
            ${selected === option.value
              ? 'bg-white text-indigo-700 shadow-md transform scale-105' // Destaque (UX)
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }
          `}
        >
          <option.icon className="w-5 h-5 mb-1" />
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default GenderSelector;