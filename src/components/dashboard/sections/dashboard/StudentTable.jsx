import React, { useState, useRef, useEffect } from 'react';
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
    text: 'text-gray-700' 
  },
  'Chamado': { 
    label: 'Chamado', 
    icon: FiPhone, 
    bg: 'bg-blue-100', 
    text: 'text-blue-700' 
  },
  'Sucesso': { 
    label: 'Sucesso', 
    icon: FiCheckCircle, 
    bg: 'bg-green-100', 
    text: 'text-green-700' 
  },
  'Rejeitado': { 
    label: 'Rejeitado', 
    icon: FiXCircle, 
    bg: 'bg-red-100', 
    text: 'text-red-700' 
  },
};

/**
 * 1. Componente Dropdown de Status
 */
const StatusSelector = ({ currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeStyle = statusOptions[currentStatus];

  const handleSelect = (status) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-32 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeStyle.bg} ${activeStyle.text}`}
      >
        <activeStyle.icon className="w-4 h-4" />
        <span className="ml-2 flex-1 text-left">{activeStyle.label}</span>
        <FiChevronDown className="w-4 h-4 opacity-70" />
      </button>

      {isOpen && (
        <div 
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200"
          onMouseLeave={() => setIsOpen(false)}
        >
          {Object.keys(statusOptions).map((statusKey) => {
            const { label, icon: Icon } = statusOptions[statusKey];
            return (
              <button
                key={statusKey}
                onClick={() => handleSelect(statusKey)}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Icon className="w-4 h-4 mr-2" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * 2. Componente de Linha da Tabela
 */
const StudentTableRow = ({ student, onToggleFavorite, onStatusChange }) => {
    // Use os valores do student em vez de estado local
    const isFavorited = student.isFavorited || false;
    const status = student.status || 'Nenhum';
  
    return (
      <tr className="hover:bg-gray-50 border-b border-gray-100">
        <td className="px-4 py-3 whitespace-nowrap text-center">
          <button 
            onClick={() => onToggleFavorite(student.id, !isFavorited)}
            className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${isFavorited ? 'text-yellow-500' : 'text-gray-400'}`}
          >
            <FiStar className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </td>
        
        <td className="px-4 py-3 whitespace-nowrap min-w-[180px]">
          <div className="text-sm font-medium text-gray-900 truncate" title={student.nome}>
            {student.nome}
          </div>
        </td>
  
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-center min-w-[80px]">
          {student.chamada}
        </td>
        
        <td className="px-4 py-3 whitespace-nowrap min-w-[200px]">
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 truncate max-w-[180px]" title={student.curso}>
            {student.curso}
          </span>
        </td>
        
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 min-w-[180px]">
          <div className="truncate max-w-[170px]" title={student.universidade}>
            {student.universidade}
          </div>
        </td>
        
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 min-w-[150px]">
          <div className="truncate max-w-[140px]" title={student.unidade}>
            {student.unidade}
          </div>
        </td>
        
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 min-w-[100px]">
          {student.genero}
        </td>
        
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 min-w-[140px]">
          <StatusSelector 
            currentStatus={status}
            onStatusChange={(newStatus) => onStatusChange(student.id, newStatus)} 
          />
        </td>
      </tr>
    );
  };

/**
 * 3. Componente de Paginação Profissional NO TOPO
 */
const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  startIndex, 
  endIndex,
  hasPrevious,
  hasNext,
  onPageChange,
  onItemsPerPageChange 
}) => {
  const pageOptions = [50, 100, 200, 500];
  
  // Gerar array de páginas para mostrar (máximo 5 páginas)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Informações e seleção de itens por página */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 mb-4 sm:mb-0 w-full sm:w-auto">
        {/* Seleção de itens por página */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 whitespace-nowrap">Itens por página:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
          Mostrando <span className="font-semibold">{startIndex}</span> - <span className="font-semibold">{endIndex}</span> de <span className="font-semibold">{totalItems.toLocaleString()}</span> resultados
        </div>
      </div>

      {/* Navegação de páginas */}
      <div className="flex items-center space-x-1 w-full sm:w-auto justify-center sm:justify-end">
        {/* Primeira página */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPrevious}
          className="p-2 rounded-md border border-gray-300 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-gray-600 transition-colors"
          title="Primeira página"
        >
          <FiChevronsLeft className="w-4 h-4" />
        </button>

        {/* Página anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
          className="p-2 rounded-md border border-gray-300 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-gray-600 transition-colors"
          title="Página anterior"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>

        {/* Números das páginas */}
        <div className="flex space-x-1 mx-2">
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[2.5rem] px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Próxima página */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="p-2 rounded-md border border-gray-300 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-gray-600 transition-colors"
          title="Próxima página"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>

        {/* Última página */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNext}
          className="p-2 rounded-md border border-gray-300 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-gray-600 transition-colors"
          title="Última página"
        >
          <FiChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/**
 * 4. Componente de Indicador de Rolagem Horizontal
 */
const ScrollIndicator = ({ tableRef }) => {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (tableRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = tableRef.current;
        setShowLeft(scrollLeft > 0);
        setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener('scroll', checkScroll);
      checkScroll(); // Verificar inicialmente

      // Verificar também quando a janela for redimensionada
      window.addEventListener('resize', checkScroll);
      
      return () => {
        tableElement.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [tableRef]);

  const scrollLeft = () => {
    if (tableRef.current) {
      tableRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tableRef.current) {
      tableRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Indicador esquerdo */}
      {showLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors z-10"
          title="Rolar para esquerda"
        >
          <FiChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
      )}
      
      {/* Indicador direito */}
      {showRight && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors z-10"
          title="Rolar para direita"
        >
          <FiChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      )}
    </>
  );
};

/**
 * 5. Componente Principal da Tabela (Atualizado)
 */
const StudentTable = ({ students, pagination, onToggleFavorite, onStatusChange }) => {
    const tableContainerRef = useRef(null);
  
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        
        {/* 🔥 PAGINAÇÃO NO TOPO - muito mais visível */}
        {pagination && pagination.totalItems > 0 && (
          <Pagination {...pagination} />
        )}
  
        {/* Container da tabela com rolagem horizontal melhorada */}
        <div className="relative">
          {/* Indicadores de rolagem */}
          <ScrollIndicator tableRef={tableContainerRef} />
          
          {/* Tabela com rolagem horizontal profissional */}
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
                  <th scope="col" className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky left-0 z-20 border-r border-gray-200">
                    <div className="flex items-center justify-center">
                      <FiStar className="w-4 h-4 text-gray-400" />
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
                      onToggleFavorite={onToggleFavorite}
                      onStatusChange={onStatusChange}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-lg font-medium text-gray-400 mb-2">
                          Nenhum aluno encontrado
                        </div>
                        <div className="text-sm text-gray-500">
                          Tente ajustar os filtros para ver mais resultados
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

export default StudentTable;