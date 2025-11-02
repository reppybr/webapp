import React, { useState, useMemo } from 'react';
import { 
  FiStar, 
  FiChevronDown, 
  FiCheckCircle, 
  FiXCircle, 
  FiPhone, 
  FiMinus,
  FiHeart,
  FiFilter,
  FiUserCheck
} from 'react-icons/fi';
import { MOCK_STUDENTS, ALL_CURSOS, ALL_CAMPI } from './dashboard/mockData'; // Importando mocks

// --- DADOS MOCADOS PARA ESTA SEÇÃO ---
// Esta é a lista de *todos* os alunos que o usuário marcou (favorito ou status)
// Em um app real, isso viria de uma API (ex: /api/calouros/selecionados)
const MOCKED_CALOUROS_DATA = [
  { ...MOCK_STUDENTS[0], isFavorited: true, status: 'Chamado' }, // Ana
  { ...MOCK_STUDENTS[2], isFavorited: false, status: 'Sucesso' }, // Carla
  { ...MOCK_STUDENTS[3], isFavorited: true, status: 'Nenhum' }, // Daniel
  { ...MOCK_STUDENTS[4], isFavorited: true, status: 'Rejeitado' }, // Elisa
  { ...MOCK_STUDENTS[6], isFavorited: false, status: 'Chamado' }, // Gabriela
];
// ------------------------------------

const ALL_CHAMADAS = [1, 2, 3];

// --- COMPONENTES REUTILIZADOS E ADAPTADOS ---
// (Estes são copiados e adaptados para esta seção)

/**
 * Opções de Status com seus estilos
 */
const statusOptions = {
  'Nenhum': { label: 'Nenhum', icon: FiMinus, bg: 'bg-gray-100', text: 'text-gray-700' },
  'Chamado': { label: 'Chamado', icon: FiPhone, bg: 'bg-blue-100', text: 'text-blue-700' },
  'Sucesso': { label: 'Sucesso', icon: FiCheckCircle, bg: 'bg-green-100', text: 'text-green-700' },
  'Rejeitado': { label: 'Rejeitado', icon: FiXCircle, bg: 'bg-red-100', text: 'text-red-700' },
};

/**
 * Dropdown de Status (Copiado)
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
 * Linha da Tabela (Adaptada para "Lifted State")
 * Recebe handlers do componente pai
 */
const CalourosTableRow = ({ student, onToggleFavorite, onStatusChange }) => {
  const { isFavorited, status } = student;

  return (
    <tr className="hover:bg-gray-50">
      {/* Coluna 1: Favorito (Controlado pelo Pai) */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <button 
          onClick={() => onToggleFavorite(student.id)}
          className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${isFavorited ? 'text-yellow-500' : 'text-gray-400'}`}
        >
          <FiStar className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </td>
      
      {/* Coluna 2: Nome */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{student.nome}</div>
      </td>

      {/* Coluna 3: Chamada */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
        {student.chamada}ª
      </td>
      
      {/* Coluna 4: Curso */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {student.curso}
        </span>
      </td>
      
      {/* Coluna 5: Campus */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {student.campus}
      </td>
      
      {/* Coluna 6: Gênero */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {student.genero}
      </td>
      
      {/* Coluna 7: Status (Controlado pelo Pai) */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        <StatusSelector 
          currentStatus={status}
          onStatusChange={(newStatus) => onStatusChange(student.id, newStatus)} 
        />
      </td>
    </tr>
  );
};

/**
 * Tabela Principal (Adaptada para "Lifted State")
 */
const CalourosTable = ({ students, onToggleFavorite, onStatusChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="w-16 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Favoritos
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chamada
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Curso
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campus
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gênero
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length > 0 ? (
              students.map((student) => (
                <CalourosTableRow 
                  key={student.id} 
                  student={student}
                  onToggleFavorite={onToggleFavorite}
                  onStatusChange={onStatusChange}
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  Nenhum calouro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


/**
 * Dropdown Multi-Select (Copiado)
 * (Cores da paleta atualizadas)
 */
const MultiSelectDropdown = ({ title, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    const newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        <span>
          {title} {selected.length > 0 && `(${selected.length})`}
        </span>
        <FiChevronDown className={`w-5 h-5 ml-2 -mr-1 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="p-2">
            {options.map((option) => (
              <label key={option} className="flex items-center px-2 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  checked={selected.includes(option)}
                  onChange={() => handleSelect(option)}
                />
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

/**
 * Filtro de Gênero (Copiado)
 */
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

/**
 * Barra de Filtro (Adaptada)
 * (Botões de "Salvar" e "Carregar" removidos)
 */
const CalourosFilterBar = ({ filters, setFilters }) => {
  const { gender, cursos, campi, chamadas } = filters;

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
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

        {/* Filtro 4: Chamada */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chamada</label>
          <MultiSelectDropdown
            title="Selecionar Chamadas"
            options={ALL_CHAMADAS}
            selected={chamadas}
            onChange={(value) => setFilters(prev => ({ ...prev, chamadas: value }))}
          />
        </div>
      </div>
    </div>
  );
};


/**
 * --- COMPONENTE PRINCIPAL DA SEÇÃO ---
 */
const CalourosSection = () => {
  // 'funil' ou 'favoritos'
  const [activeTab, setActiveTab] = useState('funil');

  // A fonte de dados principal para esta página
  const [allStudents, setAllStudents] = useState(MOCKED_CALOUROS_DATA);

  // Estado dos filtros para o "Funil de Contato"
  const [filters, setFilters] = useState({
    gender: 'Todos',
    cursos: [],
    campi: [],
    chamadas: [],
  });

  // --- Handlers para atualizar o estado ---
  
  const handleToggleFavorite = (studentId) => {
    setAllStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? { ...student, isFavorited: !student.isFavorited }
          : student
      )
    );
  };

  const handleStatusChange = (studentId, newStatus) => {
    setAllStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? { ...student, status: newStatus }
          : student
      )
    );
  };

  // --- Listas Memoizadas ---

  // 1. A lista base do "Funil" (apenas alunos com status)
  const funilStudents = useMemo(() => {
    return allStudents.filter(student => student.status !== 'Nenhum');
  }, [allStudents]);
  
  // 2. A lista de "Favoritos"
  const favoritedStudents = useMemo(() => {
    return allStudents.filter(student => student.isFavorited);
  }, [allStudents]);

  // 3. A lista do "Funil" *depois* de aplicar os filtros
  const filteredFunilStudents = useMemo(() => {
    return funilStudents.filter(student => {
      if (filters.gender !== 'Todos' && student.genero !== filters.gender) {
        return false;
      }
      if (filters.cursos.length > 0 && !filters.cursos.includes(student.curso)) {
        return false;
      }
      if (filters.campi.length > 0 && !filters.campi.includes(student.campus)) {
        return false;
      }
      if (filters.chamadas.length > 0 && !filters.chamadas.includes(student.chamada)) {
        return false;
      }
      return true;
    });
  }, [funilStudents, filters]);

  // Determina qual lista mostrar na tabela
  const studentsToDisplay = activeTab === 'funil' ? filteredFunilStudents : favoritedStudents;

  return (
    <div className="bg-gray-50 min-h-full">
      {/* 1. Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Lista de Calouros</h2>
        <p className="mt-1 text-lg text-gray-600">
          Gerencie os calouros que você favoritou ou moveu para o funil.
        </p>
      </div>
      
      {/* 2. Abas de Navegação (Tabs) */}
      <div className="flex space-x-1 p-1 bg-gray-200 rounded-lg mb-6 max-w-md">
        <button
          onClick={() => setActiveTab('funil')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold transition-colors
            ${activeTab === 'funil' 
              ? 'bg-gray-900 text-white shadow' // Cor "Premium"
              : 'text-gray-600 hover:bg-gray-100'
            }
          `}
        >
          <FiUserCheck className="w-5 h-5 mr-2" />
          Funil de Contato
        </button>
        <button
          onClick={() => setActiveTab('favoritos')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold transition-colors
            ${activeTab === 'favoritos' 
              ? 'bg-gray-900 text-white shadow' // Cor "Premium"
              : 'text-gray-600 hover:bg-gray-100'
            }
          `}
        >
          <FiHeart className="w-5 h-5 mr-2" />
          Favoritos
        </button>
      </div>

      {/* 3. Filtros (Condicionais) */}
      {activeTab === 'funil' && (
        <CalourosFilterBar filters={filters} setFilters={setFilters} />
      )}

      {/* 4. Tabela de Calouros */}
      <CalourosTable 
        students={studentsToDisplay}
        onToggleFavorite={handleToggleFavorite}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default CalourosSection;
