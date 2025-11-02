import React, { useState } from 'react';
// 1. Importei o FiDownload
import { FiChevronDown, FiFilter, FiSave, FiDownload } from 'react-icons/fi'; 
import { ALL_CURSOS, ALL_CAMPI } from './mockData'; // Assumindo que o mockData tem os cursos e campi

// ... (Os componentes MultiSelectDropdown e GenderFilter permanecem os mesmos) ...

// Componente reutilizável para o dropdown multi-select
const MultiSelectDropdown = ({ title, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    const newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option) // Remove
      : [...selected, option]; // Adiciona
    onChange(newSelected);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        <span>
          {/* 1. Adapta o label para mostrar o número ou o texto "ª Chamada" */}
          {title} {selected.length > 0 && `(${selected.length})`}
        </span>
        <FiChevronDown className={`w-5 h-5 ml-2 -mr-1 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          onMouseLeave={() => setIsOpen(false)} // Fecha ao tirar o mouse
        >
          <div className="p-2">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center px-2 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  checked={selected.includes(option)}
                  onChange={() => handleSelect(option)}
                />
                {/* 2. Adapta o label para mostrar "ª" se for número */}
                <span className="ml-3">
                  {option}
                  {typeof option === 'number' ? 'ª Chamada' : ''}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente reutilizável para o filtro de gênero
const GenderFilter = ({ selected, onChange }) => {
  const options = ['Todos', 'Masculino', 'Feminino'];
  return (
    <div className="flex bg-gray-100 rounded-md p-0.5">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors
            ${selected === option
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
};


{/* --- DADOS MOCKADOS --- */}
const MOCKED_SAVED_FILTERS = [
  { id: 1, name: 'Engenharias - Campinas' },
  { id: 2, name: 'Saúde (Feminino) - Limeira' },
  { id: 3, name: 'FT e FCA (Todos)' },
];

// 3. Define as opções para o novo filtro de chamada
const ALL_CHAMADAS = [1, 2, 3];


// Componente principal da Barra de Filtros
// 2. Adicionei a prop onExportSheet
const FilterBar = ({ filters, setFilters, onSaveFilter, onExportSheet }) => {
  // 4. Desestrutura o novo filtro 'chamadas'
  const { gender, cursos, campi, chamadas } = filters;

  const [isLoadMenuOpen, setIsLoadMenuOpen] = useState(false);

  // 5. Atualiza o 'isFilterActive' para incluir 'chamadas'
  const isFilterActive = gender !== 'Todos' || 
                         cursos.length > 0 || 
                         campi.length > 0 || 
                         chamadas.length > 0;

  const handleLoadFilter = (filterName) => {
    console.log("Carregar filtro:", filterName);
    setIsLoadMenuOpen(false); 
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 6. Altera o grid para 4 colunas em telas médias */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Filtro 1: Gênero */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
          <GenderFilter
            selected={gender}
            onChange={(value) => setFilters(prev => ({ ...prev, gender: value }))}
          />
        </div>

        {/* Filtro 2: Cursos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
          <MultiSelectDropdown
            title="Selecionar Cursos"
            options={ALL_CURSOS}
            selected={cursos}
            onChange={(value) => setFilters(prev => ({ ...prev, cursos: value }))}
          />
        </div>

        {/* Filtro 3: Campus */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
          <MultiSelectDropdown
            title="Selecionar Campus"
            options={ALL_CAMPI}
            selected={campi}
            onChange={(value) => setFilters(prev => ({ ...prev, campi: value }))}
          />
        </div>

        {/* --- NOVO FILTRO 4: Chamada --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chamada</label>
          <MultiSelectDropdown
            title="Selecionar Chamadas"
            options={ALL_CHAMADAS}
            selected={chamadas}
            onChange={(value) => setFilters(prev => ({ ...prev, chamadas: value }))}
          />
        </div>
        {/* --- FIM DO NOVO FILTRO --- */}

      </div>

      {/* --- BLOCO DOS BOTÕES --- */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end items-center space-x-3">
        
        {/* 3. NOVO BOTÃO "SALVAR PLANILHA" */}
        <button
          onClick={onExportSheet}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          <FiDownload className="w-4 h-4 mr-2" />
          Salvar Planilha
        </button>

        {/* Dropdown "Usar Filtro" */}
        <div className="relative">
          <button
            onClick={() => setIsLoadMenuOpen(!isLoadMenuOpen)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            <FiFilter className="w-4 h-4 mr-2" />
            Usar Filtro
            <FiChevronDown className={`w-4 h-4 ml-2 transition-transform ${isLoadMenuOpen ? 'transform rotate-180' : ''}`} />
          </button>

          {isLoadMenuOpen && (
            <div 
              className="absolute right-0 z-10 w-56 mt-2 bg-white border border-gray-200 rounded-md shadow-lg"
              onMouseLeave={() => setIsLoadMenuOpen(false)}
            >
              <div className="py-1">
                {MOCKED_SAVED_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => handleLoadFilter(filter.name)}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botão Salvar Filtro */}
        <button
          onClick={onSaveFilter}
          disabled={!isFilterActive} 
          className={`
            flex items-center px-4 py-2 text-sm font-medium rounded-md
            transition-colors
            ${isFilterActive
              // Cor premium para o botão principal
              ? 'bg-gray-900 text-white hover:bg-gray-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
          `}
        >
          <FiSave className="w-4 h-4 mr-2" />
          Salvar Filtro
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
