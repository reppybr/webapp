import React, { useState, useMemo } from 'react';
import { FiChevronDown, FiFilter, FiSave, FiDownload, FiX, FiSearch } from 'react-icons/fi';

// Componente reutilizável para o dropdown multi-select com search
const MultiSelectDropdown = ({ title, options = [], selected = [], onChange, placeholder = "Selecionar..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar opções baseado no search
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option => 
      option.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleSelect = (option) => {
    const newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span className="truncate">
          {selected.length > 0 
            ? `${title} (${selected.length})`
            : placeholder
          }
        </span>
        <div className="flex items-center">
          {selected.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              className="p-1 mr-1 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-3 h-3" />
            </button>
          )}
          <FiChevronDown className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div 
          className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden"
          onMouseLeave={() => {
            setIsOpen(false);
            setSearchTerm('');
          }}
        >
          {/* Search Input */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={selected.includes(option)}
                    onChange={() => handleSelect(option)}
                  />
                  <span className="ml-3 flex-1 truncate">
                    {typeof option === 'number' ? `${option}ª Chamada` : option}
                  </span>
                </label>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                Nenhuma opção encontrada
              </div>
            )}
          </div>

          {/* Selected Count */}
          {selected.length > 0 && (
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
              {selected.length} selecionado(s)
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Componente para mostrar chips dos filtros ativos
const ActiveFilters = ({ filters, onRemoveFilter, republicType }) => {
  const { cursos, universidades, unidades, chamadas } = filters;
  
  const activeFilters = [];
  
  // Filtro automático da república
  activeFilters.push({ 
    type: 'republicType', 
    label: `República ${republicType}`, 
    value: republicType,
    isAuto: true 
  });
  
  cursos.forEach(curso => {
    activeFilters.push({ type: 'curso', label: `Curso: ${curso}`, value: curso });
  });
  
  universidades.forEach(universidade => {
    activeFilters.push({ type: 'universidade', label: `Universidade: ${universidade}`, value: universidade });
  });
  
  unidades.forEach(unidade => {
    activeFilters.push({ type: 'unidade', label: `Unidade: ${unidade}`, value: unidade });
  });
  
  chamadas.forEach(chamada => {
    activeFilters.push({ type: 'chamada', label: `${chamada}ª Chamada`, value: chamada });
  });

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {activeFilters.map((filter, index) => (
        <span
          key={`${filter.type}-${filter.value}`}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            filter.isAuto 
              ? 'bg-purple-100 text-purple-800 border border-purple-200' 
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {filter.label}
          {!filter.isAuto && (
            <button
              onClick={() => onRemoveFilter(filter.type, filter.value)}
              className="ml-1.5 rounded-full hover:bg-blue-200 p-0.5"
            >
              <FiX className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}
      <button
        onClick={() => onRemoveFilter('all')}
        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        Limpar filtros
        <FiX className="w-3 h-3 ml-1" />
      </button>
    </div>
  );
};

const FilterBar = ({ 
  filters, 
  setFilters, 
  onSaveFilter, 
  onExportSheet, 
  onLoadFilter, // 👈 NOVA PROP
  onDeleteFilter, // 👈 NOVA PROP
  savedFilters = [], // 👈 NOVA PROP
  isLoadingFilters = false, // 👈 NOVA PROP
  filterOptions = {}, 
  userData = {}, 
  republicType = 'mista',
  filteredStudents = [] 
}) => {
  const { cursos, universidades, unidades, chamadas } = filters;
  
  // Garantir que filterOptions sempre tenha valores padrão
  const { 
    cursos: cursosOptions = [], 
    universidades: universidadesOptions = [], 
    unidades: unidadesOptions = [], 
    chamadas: chamadasOptions = [] 
  } = filterOptions;

  const [isLoadMenuOpen, setIsLoadMenuOpen] = useState(false);

  // Verificar se há filtros ativos (sem gênero)
  const isFilterActive = cursos.length > 0 || 
                         universidades.length > 0 || 
                         unidades.length > 0 || 
                         chamadas.length > 0;

  // Remover filtro individual
  const handleRemoveFilter = (type, value) => {
    if (type === 'all') {
      setFilters({
        cursos: [],
        universidades: [],
        unidades: [],
        chamadas: []
      });
      return;
    }

    switch (type) {
      case 'curso':
        setFilters(prev => ({ ...prev, cursos: prev.cursos.filter(c => c !== value) }));
        break;
      case 'universidade':
        setFilters(prev => ({ ...prev, universidades: prev.universidades.filter(c => c !== value) }));
        break;
      case 'unidade':
        setFilters(prev => ({ ...prev, unidades: prev.unidades.filter(c => c !== value) }));
        break;
      case 'chamada':
        setFilters(prev => ({ ...prev, chamadas: prev.chamadas.filter(c => c !== value) }));
        break;
      default:
        break;
    }
  };

  const handleLoadFilter = (filter) => {
    console.log('🟡 Carregando filtro:', filter);
    onLoadFilter(filter.id);
    setIsLoadMenuOpen(false);
  };

  const handleDeleteFilter = (e, filter) => {
    e.stopPropagation(); // Impede que o evento de carregar seja acionado
    onDeleteFilter(filter.id, filter.name);
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 relative z-40">
      {/* Cabeçalho informativo */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              userData?.isFree ? 'bg-gray-100 text-gray-700' :
              userData?.isBasic ? 'bg-blue-100 text-blue-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {userData?.planType?.toUpperCase() || 'FREE'}
            </span>
          </div>
        </div>
        
        {/* Filtros Ativos */}
        <ActiveFilters 
          filters={filters} 
          onRemoveFilter={handleRemoveFilter} 
          republicType={republicType} 
        />
      </div>

      {/* Grid de Filtros com 4 colunas (sem gênero) */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Filtro 1: Cursos */}
          <div>
            <label className="block z-25 text-sm font-medium text-gray-700 mb-2">Curso</label>
            <MultiSelectDropdown
              title="Cursos"
              options={cursosOptions}
              selected={cursos}
              onChange={(value) => setFilters(prev => ({ ...prev, cursos: value }))}
              placeholder="Todos os cursos"
            />
          </div>

          {/* Filtro 2: Universidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Universidade</label>
            <MultiSelectDropdown
              title="Universidades"
              options={universidadesOptions}
              selected={universidades}
              onChange={(value) => setFilters(prev => ({ ...prev, universidades: value }))}
              placeholder="Todas as universidades"
            />
          </div>

          {/* Filtro 3: Unidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unidade</label>
            <MultiSelectDropdown
              title="Unidades"
              options={unidadesOptions}
              selected={unidades}
              onChange={(value) => setFilters(prev => ({ ...prev, unidades: value }))}
              placeholder="Todas as unidades"
            />
          </div>

          {/* Filtro 4: Chamada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chamada</label>
            <MultiSelectDropdown
              title="Chamadas"
              options={chamadasOptions}
              selected={chamadas}
              onChange={(value) => setFilters(prev => ({ ...prev, chamadas: value }))}
              placeholder="Todas as chamadas"
            />
          </div>

        </div>
      </div>

      {/* Barra de Ações */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          {/* Contador de resultados */}
 <div className="text-sm text-gray-600">
    {isFilterActive ? 'Filtros ativos - ' : 'Todos os '} 
    {filteredStudents.length} estudantes  
  </div>

          {/* Botões de Ação */}
          <div className="flex items-center space-x-2">
            {/* Botão Salvar Planilha */}
            <button
              onClick={onExportSheet}
              disabled={!isFilterActive}
              className={`
                flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                ${isFilterActive
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
              `}
            >
              <FiDownload className="w-4 h-4 mr-2" />
              Exportar CSV
            </button>

            {/* Botão Meus Filtros */}
            <div className="relative z-25">
              <button
                onClick={() => setIsLoadMenuOpen(!isLoadMenuOpen)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiFilter className="w-4 h-4 mr-2" />
                Meus Filtros
                {isLoadingFilters ? (
                  <FiLoader className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <FiChevronDown className={`w-4 h-4 ml-2 transition-transform ${isLoadMenuOpen ? 'transform rotate-180' : ''}`} />
                )}
              </button>

              {isLoadMenuOpen && (
                <div 
                  className="absolute right-0 z-50 w-64 mt-2 bg-white border border-gray-200 rounded-md shadow-lg"
                  onMouseLeave={() => setIsLoadMenuOpen(false)}
                >
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {savedFilters.length > 0 ? (
                      savedFilters.map((filter) => (
                        <div
                          key={filter.id}
                          className="group relative flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 cursor-pointer"
                          onClick={() => handleLoadFilter(filter)}
                        >
                          <span className="flex-1 truncate">{filter.name}</span>
                          <button
                            onClick={(e) => handleDeleteFilter(e, filter)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-opacity"
                            title="Excluir filtro"
                          >
                            <FiTrash2 className="w-3 h-3" />
                          </button>
                          
                          {/* Badge de uso */}
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {filter.usage_count || 0}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        {isLoadingFilters ? 'Carregando...' : 'Nenhum filtro salvo'}
                      </div>
                    )}
                  </div>
                  
                  {/* Footer do menu */}
                  {savedFilters.length > 0 && (
                    <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
                      {savedFilters.length} filtro(s) salvo(s)
                    </div>
                  )}
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
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              `}
            >
              <FiSave className="w-4 h-4 mr-2" />
              Salvar Filtro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;


