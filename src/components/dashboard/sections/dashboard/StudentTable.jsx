import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  FiStar, 
  FiChevronDown, 
  FiCheckCircle, 
  FiXCircle, 
  FiPhone, 
  FiMinus,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight
} from 'react-icons/fi';

// --- COMPONENTES INTERNOS DA TABELA ---

/**
 * Opções de Status com seus estilos
 */
const statusOptions = {
  'Nenhum': { 
    label: 'Nenhum', 
    icon: FiMinus, 
    bg: 'bg-gray-100', 
    text: 'text-gray-700',
    border: 'border-gray-300'
  },
  'Chamado': { 
    label: 'Chamado', 
    icon: FiPhone, 
    bg: 'bg-blue-100', 
    text: 'text-blue-700',
    border: 'border-blue-300'
  },
  'Sucesso': { 
    label: 'Sucesso', 
    icon: FiCheckCircle, 
    bg: 'bg-green-100', 
    text: 'text-green-700',
    border: 'border-green-300'
  },
  'Rejeitado': { 
    label: 'Rejeitado', 
    icon: FiXCircle, 
    bg: 'bg-red-100', 
    text: 'text-red-700',
    border: 'border-red-300'
  },
};

/**
 * 1. Componente Dropdown de Status CORRIGIDO
 */
const StatusSelector = React.memo(({ currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const activeStyle = statusOptions[currentStatus] || statusOptions['Nenhum'];

  const handleSelect = useCallback((status) => {
    onStatusChange(status);
    setIsOpen(false);
  }, [onStatusChange]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-32 px-3 py-1.5 text-sm font-medium rounded-md border transition-all duration-200 ${activeStyle.bg} ${activeStyle.text} ${activeStyle.border} hover:opacity-90`}
      >
        <div className="flex items-center">
          <activeStyle.icon className="w-4 h-4 mr-2" />
          <span className="flex-1 text-left">{activeStyle.label}</span>
        </div>
        <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1">
          {Object.entries(statusOptions).map(([statusKey, { label, icon: Icon }]) => (
            <button
              key={statusKey}
              onClick={() => handleSelect(statusKey)}
              className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                currentStatus === statusKey ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4 mr-3" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

StatusSelector.displayName = 'StatusSelector';

/**
 * 2. Componente de Linha da Tabela CORRIGIDO
 */
const StudentTableRow = React.memo(({ student, onToggleFavorite, onStatusChange }) => {
  const isFavorited = student.isFavorited || false;
  const status = student.status || 'Nenhum';

  const handleFavoriteClick = useCallback(() => {
    onToggleFavorite(student.id, !isFavorited);
  }, [student.id, isFavorited, onToggleFavorite]);

  const handleStatusChange = useCallback((newStatus) => {
    onStatusChange(student.id, newStatus);
  }, [student.id, onStatusChange]);

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-100 transition-colors duration-150">
      {/* Coluna Favorito */}
      <td className="px-4 py-3 whitespace-nowrap text-center sticky left-0 bg-white z-10 border-r border-gray-200">
        <button 
          onClick={handleFavoriteClick}
          className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
            isFavorited 
              ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' 
              : 'text-gray-400 bg-gray-50 hover:bg-gray-200'
          }`}
          title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <FiStar className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </td>
      
      {/* Coluna Nome */}
      <td className="px-4 py-3 whitespace-nowrap min-w-[180px] sticky left-16 bg-white z-10 border-r border-gray-200">
        <div className="text-sm font-medium text-gray-900 truncate" title={student.nome}>
          {student.nome}
        </div>
      </td>

      {/* Coluna Chamada */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-center min-w-[80px]">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
          {student.chamada}
        </span>
      </td>
      
      {/* Coluna Curso */}
      <td className="px-4 py-3 whitespace-nowrap min-w-[200px]">
        <span 
          className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 truncate max-w-full hover:max-w-none transition-all duration-200" 
          title={student.curso}
        >
          {student.curso}
        </span>
      </td>
      
      {/* Coluna Universidade */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 min-w-[180px]">
        <div 
          className="truncate max-w-[170px] hover:max-w-none transition-all duration-200 hover:bg-gray-50 hover:px-2 hover:py-1 hover:rounded" 
          title={student.universidade}
        >
          {student.universidade}
        </div>
      </td>
      
      {/* Coluna Unidade */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 min-w-[150px]">
        <div 
          className="truncate max-w-[140px] hover:max-w-none transition-all duration-200 hover:bg-gray-50 hover:px-2 hover:py-1 hover:rounded" 
          title={student.unidade}
        >
          {student.unidade}
        </div>
      </td>
      
      {/* Coluna Gênero */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 min-w-[100px]">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          student.genero === 'Masculino' 
            ? 'bg-blue-100 text-blue-800'
            : student.genero === 'Feminino'
            ? 'bg-pink-100 text-pink-800'
            : 'bg-purple-100 text-purple-800'
        }`}>
          {student.genero}
        </span>
      </td>
      
      {/* Coluna Status */}
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 min-w-[140px]">
        <StatusSelector 
          currentStatus={status}
          onStatusChange={handleStatusChange} 
        />
      </td>
    </tr>
  );
});

StudentTableRow.displayName = 'StudentTableRow';

/**
 * 3. Componente de Paginação Profissional
 */
const Pagination = React.memo(({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  hasPrevious,
  hasNext,
  onPageChange,
  onItemsPerPageChange 
}) => {
  const pageOptions = [50, 100, 200];
  
  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  const calculatedStartIndex = (currentPage - 1) * itemsPerPage + 1;
  const calculatedEndIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = useCallback((page) => {
    onPageChange(page);
  }, [onPageChange]);

  const handleItemsPerPageChange = useCallback((e) => {
    onItemsPerPageChange(Number(e.target.value));
  }, [onItemsPerPageChange]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Informações e seleção de itens por página */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 mb-4 sm:mb-0 w-full sm:w-auto">
        {/* Seleção de itens por página */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 whitespace-nowrap">Itens por página:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
          >
            {pageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        {/* Contador de itens */}
        <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
          Mostrando <span className="font-semibold text-gray-900">{calculatedStartIndex.toLocaleString()}</span> - <span className="font-semibold text-gray-900">{calculatedEndIndex.toLocaleString()}</span> de <span className="font-semibold text-gray-900">{totalItems.toLocaleString()}</span> resultados
        </div>
      </div>

      {/* Navegação de páginas */}
      <div className="flex items-center space-x-1 w-full sm:w-auto justify-center sm:justify-end">
        {/* Primeira página */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={!hasPrevious || currentPage === 1}
          className="p-2 rounded-md border border-gray-300 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-gray-600 transition-all duration-200"
          title="Primeira página"
        >
          <FiChevronsLeft className="w-4 h-4" />
        </button>

        {/* Página anterior */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPrevious}
          className="p-2 rounded-md border border-gray-300 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-gray-600 transition-all duration-200"
          title="Página anterior"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>

        {/* Números das páginas */}
        <div className="flex space-x-1 mx-2">
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`min-w-[2.5rem] px-3 py-2 text-sm font-medium rounded-md border transition-all duration-200 ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm transform scale-105'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Próxima página */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNext}
          className="p-2 rounded-md border border-gray-300 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-gray-600 transition-all duration-200"
          title="Próxima página"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>

        {/* Última página */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={!hasNext || currentPage === totalPages}
          className="p-2 rounded-md border border-gray-300 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-gray-600 transition-all duration-200"
          title="Última página"
        >
          <FiChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

Pagination.displayName = 'Pagination';

/**
 * 4. Componente de Indicador de Rolagem Horizontal
 */
const ScrollIndicator = React.memo(({ tableRef }) => {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (tableRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = tableRef.current;
        setShowLeft(scrollLeft > 10);
        setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener('scroll', checkScroll);
      checkScroll();

      window.addEventListener('resize', checkScroll);
      
      return () => {
        tableElement.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [tableRef]);

  const scrollLeft = useCallback(() => {
    if (tableRef.current) {
      tableRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }, [tableRef]);

  const scrollRight = useCallback(() => {
    if (tableRef.current) {
      tableRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }, [tableRef]);

  return (
    <>
      {/* Indicador esquerdo */}
      {showLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-3 shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200 z-20"
          title="Rolar para esquerda"
        >
          <FiChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
      )}
      
      {/* Indicador direito */}
      {showRight && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-3 shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200 z-20"
          title="Rolar para direita"
        >
          <FiChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      )}
    </>
  );
});

ScrollIndicator.displayName = 'ScrollIndicator';

/**
 * 5. Componente Principal da Tabela CORRIGIDO
 */
const StudentTable = ({ students, pagination, onToggleFavorite, onStatusChange }) => {
  const tableContainerRef = useRef(null);

  const handleToggleFavorite = useCallback((studentId, isFavorited) => {
    onToggleFavorite(studentId, isFavorited);
  }, [onToggleFavorite]);

  const handleStatusChange = useCallback((studentId, newStatus) => {
    onStatusChange(studentId, newStatus);
  }, [onStatusChange]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      
      {/* PAGINAÇÃO NO TOPO */}
      {pagination && pagination.totalItems > 0 && (
        <Pagination {...pagination} />
      )}

      {/* Container da tabela com rolagem horizontal */}
      <div className="relative">
        {/* Indicadores de rolagem */}
        <ScrollIndicator tableRef={tableContainerRef} />
        
        {/* Tabela com rolagem horizontal */}
        <div 
          ref={tableContainerRef}
          className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-h-[calc(100vh-300px)] min-h-[400px]"
          style={{ 
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <table className="w-full min-w-[1200px] divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="w-16 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky left-0 z-20 border-r border-gray-200">
                  <div className="flex items-center justify-center">
                    <FiStar className="w-4 h-4" />
                  </div>
                </th>
                
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 min-w-[180px] sticky left-16 z-20 border-r border-gray-200">
                  Nome
                </th>

                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 min-w-[80px]">
                  Chamada
                </th>
                
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 min-w-[200px]">
                  Curso
                </th>

                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 min-w-[180px]">
                  Universidade
                </th>

                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 min-w-[150px]">
                  Unidade
                </th>

                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 min-w-[100px]">
                  Gênero
                </th>

                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 min-w-[140px]">
                  Status
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {students.length > 0 ? (
                students.map((student) => (
                  <StudentTableRow 
                    key={student.id} 
                    student={student}
                    onToggleFavorite={handleToggleFavorite}
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-lg font-medium text-gray-400 mb-2">
                        Nenhum aluno encontrado
                      </div>
                      <div className="text-sm text-gray-500 max-w-md">
                        Tente ajustar os filtros ou verificar se há dados disponíveis para os critérios selecionados
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StudentTable);