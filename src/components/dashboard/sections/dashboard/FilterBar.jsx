// 🔥 IMPORTS ATUALIZADOS: Adicionado useRef e useEffect
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FiChevronDown, FiFilter, FiSave, FiDownload, FiX, FiSearch, FiTrash2, FiLoader, FiRefreshCw } from 'react-icons/fi';

// =====================================================================
// 🔥 COMPONENTE ATUALIZADO: MultiSelectDropdown (com UX corrigido)
// =====================================================================
const MultiSelectDropdown = ({ title, options = [], selected = [], onChange, placeholder = "Selecionar..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 🔥 UX FIX 1: Ref para detectar cliques fora do dropdown
  const dropdownRef = useRef(null);

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

  // 🔥 UX FIX 1 (Continuação): Lógica para fechar o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm(''); // Limpa a busca ao fechar
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    // 🔥 UX FIX 1: Aplicado o ref
    <div className="relative" ref={dropdownRef}>
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
          // 🔥 UX FIX 1: Removido onMouseLeave
          // 🔥 UX REFACTOR: Adicionado 'flex flex-col' para estruturar o menu
          className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 flex flex-col"
        >
          {/* Search Input (Fica fixo no topo) */}
          <div className="p-2 border-b border-gray-100 flex-shrink-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()} // Impede que clicar na busca feche o menu
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

          {/* Options List (Esta área rola) */}
          {/* 🔥 UX REFACTOR: 'max-h-full' faz a lista preencher o espaço disponível */}
          <div className="max-h-full overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <label
                  key={option}
                  // 🔥 UX FIX 2: Trocado 'border-gray-50' por 'border-gray-100'
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
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

          {/* Selected Count (Fica fixo no rodapé) */}
          {selected.length > 0 && (
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100 flex-shrink-0">
              {selected.length} selecionado(s)
            </div>
          )}
        </div>
      )}
    </div>
  );
};
// =====================================================================
// (Fim do MultiSelectDropdown)
// =====================================================================


// Componente para mostrar chips dos filtros ativos
const ActiveFilters = ({ filters, onRemoveFilter, republicType }) => {
  const { cursos, universidades, unidades, chamadas, status } = filters;
  
  const activeFilters = [];
  
  if (republicType && republicType !== 'mista') {
    activeFilters.push({ 
      type: 'republicType', 
      label: `República ${republicType === 'masculina' ? 'Masculina' : 'Feminina'}`, 
      value: republicType,
      isAuto: true 
    });
  }
  
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

  status.forEach(stat => {
    activeFilters.push({ type: 'status', label: `Status: ${stat}`, value: stat });
  });

  // Mostra "Limpar filtros" apenas se houver filtros manuais
  const hasManualFilters = activeFilters.some(f => !f.isAuto);

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {activeFilters.map((filter) => (
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
      {hasManualFilters && (
        <button
          onClick={() => onRemoveFilter('all')}
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Limpar filtros
          <FiX className="w-3 h-3 ml-1" />
        </button>
      )}
    </div>
  );
};

const FilterBar = ({ 
  filters, 
  setFilters, 
  onSaveFilter, 
  onExportSheet, 
  onLoadFilter,
  onDeleteFilter,
  onRefresh,
  savedFilters = [],
  isLoadingFilters = false,
  filterOptions = {}, 
  userData = {}, 
  republicType, 
  filteredStudents = [],
  accessInfo = {}
}) => {
  const { cursos, universidades, unidades, chamadas, status } = filters;
  
  const { 
    cursos: cursosOptions = [], 
    universidades: universidadesOptions = [], 
    unidades: unidadesOptions = [], 
    chamadas: chamadasOptions = [],
    status: statusOptions = [] 
  } = filterOptions;

  const [isLoadMenuOpen, setIsLoadMenuOpen] = useState(false);
  
  // 🔥 UX FIX: Ref para o menu de "Meus Filtros"
  const loadMenuRef = useRef(null);

  const isFilterActive = cursos.length > 0 || 
                         universidades.length > 0 || 
                         unidades.length > 0 || 
                         chamadas.length > 0 ||
                         status.length > 0;

  // 🔥 UX FIX: Lógica "clicar fora" para o menu "Meus Filtros"
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loadMenuRef.current && !loadMenuRef.current.contains(event.target)) {
        setIsLoadMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [loadMenuRef]);

  // Remover filtro individual
  const handleRemoveFilter = (type, value) => {
    if (type === 'all') {
      setFilters(prev => ({
        ...prev, // Mantém o 'q' (busca por nome) se existir
        cursos: [],
        universidades: [],
        unidades: [],
        chamadas: [],
        status: []
      }));
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
      case 'status':
        setFilters(prev => ({ ...prev, status: prev.status.filter(s => s !== value) }));
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
    e.stopPropagation();
    onDeleteFilter(filter.id, filter.name);
  };
  
  // 🔥 NOVO: Handler para a barra de busca principal
  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, q: e.target.value }));
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 relative z-10">
      {/* Cabeçalho informativo */}
      <div className="px-4 pt-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 md:mb-0">Filtros</h3>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              accessInfo?.planType === 'free' ? 'bg-gray-100 text-gray-700' :
              accessInfo?.planType === 'basic' ? 'bg-blue-100 text-blue-700' :
              'bg-purple-100 text-purple-700'
            }`}>
              {accessInfo?.planType?.toUpperCase() || 'FREE'}
            </span>
            <button
              onClick={onRefresh}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Atualizar dados"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Filtros Ativos */}
        <ActiveFilters 
          filters={filters} 
          onRemoveFilter={handleRemoveFilter} 
          republicType={republicType} 
        />
      </div>

      {/* Grid de Filtros */}
      <div className="px-4 pb-4">
        {/* 🔥 NOVO: Barra de Busca Principal */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Buscar por nome</label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Digite o nome do calouro..."
              value={filters.q || ''}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Grid de Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Filtro 1: Cursos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Curso</label>
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
              placeholder={accessInfo?.planType === 'free' ? 'Apenas 1ª Chamada' : 'Todas as chamadas'}
              // Desabilitar se for free
              // disabled={accessInfo?.planType === 'free'} 
            />
          </div>
          
          {/* 🔥 ATENÇÃO: Movi o filtro de Status para a barra de ações,
             pois ele é um filtro "do lado do cliente" e não "do lado do servidor"
             como os outros. Misturá-los pode confundir o usuário.
          */}
        </div>
      </div>

      {/* Barra de Ações */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          
          {/* 🔥 NOVO: Filtro de Status movido para cá */}
          <div className="w-full sm:w-auto">
             <MultiSelectDropdown
               title="Status"
               options={statusOptions}
               selected={status}
               onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
               placeholder="Filtrar por Status"
             />
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center space-x-2">
            {/* Botão Salvar Planilha */}
            <button
              onClick={onExportSheet}
              disabled={filteredStudents.length === 0 || accessInfo?.planType === 'free'}
              className={`
                flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                ${(filteredStudents.length > 0 && accessInfo?.planType !== 'free')
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
              `}
              title={accessInfo?.planType === 'free' ? "Disponível no plano Básico ou Premium" : "Exportar dados filtrados"}
            >
              <FiDownload className="w-4 h-4 mr-2" />
              Exportar
            </button>

            {/* Botão Meus Filtros */}
            {/* 🔥 UX FIX: Aplicado o ref */}
            <div className="relative" ref={loadMenuRef}>
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
                  // 🔥 UX FIX: Removido onMouseLeave
                  className="absolute right-0 z-50 w-64 mt-2 bg-white border border-gray-200 rounded-md shadow-lg"
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
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        {isLoadingFilters ? 'Carregando...' : 'Nenhum filtro salvo'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Botão Salvar Filtro */}
            <button
              onClick={onSaveFilter}
              disabled={!isFilterActive || accessInfo?.planType === 'free'} 
              className={`
                flex items-center px-4 py-2 text-sm font-medium rounded-md
                transition-colors
                ${(isFilterActive && accessInfo?.planType !== 'free')
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              `}
              title={accessInfo?.planType === 'free' ? "Disponível no plano Básico ou Premium" : "Salvar filtros atuais"}
            >
              <FiSave className="w-4 h-4 mr-2" />
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;