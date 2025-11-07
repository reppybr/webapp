import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  FiStar, 
  FiChevronDown, 
  FiCheckCircle, 
  FiXCircle, 
  FiPhone, 
  FiMinus,
  FiHeart,
  FiUserCheck,
  FiRefreshCw,
  FiAlertCircle
} from 'react-icons/fi';
import { calouroService } from '../../../services/calouroService';

// Função para normalizar strings
const normalizeString = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
};

// --- COMPONENTES REUTILIZADOS ---

const statusOptions = {
  'Nenhum': { label: 'Nenhum', icon: FiMinus, bg: 'bg-gray-100', text: 'text-gray-700' },
  'Chamado': { label: 'Chamado', icon: FiPhone, bg: 'bg-blue-100', text: 'text-blue-700' },
  'Sucesso': { label: 'Sucesso', icon: FiCheckCircle, bg: 'bg-green-100', text: 'text-green-700' },
  'Rejeitado': { label: 'Rejeitado', icon: FiXCircle, bg: 'bg-red-100', text: 'text-red-700' },
};

const StatusSelector = ({ currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeStyle = statusOptions[currentStatus] || statusOptions['Nenhum'];

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

// Dropdown Multi-Select
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
                <span className="ml-3">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};




const CalourosFilterBar = ({ filters, setFilters, ALL_CURSOS, ALL_CAMPI, ALL_UNIVERSIDADES }) => {
  // 1. REMOVA 'gender' dos filtros recebidos
  const { cursos, campi, universidades } = filters;

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 2. AJUSTE O GRID de 4 para 3 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> 
        
        {/* 3. REMOVA O FILTRO DE GÊNERO (que estava aqui) */}

        {/* Filtro 1: Cursos (agora é o primeiro) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
          <MultiSelectDropdown
            title="Selecionar Cursos"
            options={ALL_CURSOS}
            selected={cursos}
            onChange={(value) => setFilters(prev => ({ ...prev, cursos: value }))}
          />
        </div>

        {/* Filtro 2: Campus */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
          <MultiSelectDropdown
            title="Selecionar Campus"
            options={ALL_CAMPI}
            selected={campi}
            onChange={(value) => setFilters(prev => ({ ...prev, campi: value }))}
          />
        </div>

        {/* Filtro 3: Universidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Universidade</label>
          <MultiSelectDropdown
            title="Selecionar Universidades"
            options={ALL_UNIVERSIDADES}
            selected={universidades}
            onChange={(value) => setFilters(prev => ({ ...prev, universidades: value }))}
          />
        </div>
      </div>
    </div>
  );
};

const CalourosTableRow = ({ student, onToggleFavorite, onStatusChange }) => {
  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <button 
          onClick={() => onToggleFavorite(student.id, !student.isFavorited)}
          className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${student.isFavorited ? 'text-yellow-500' : 'text-gray-400'}`}
        >
          <FiStar className={`w-5 h-5 ${student.isFavorited ? 'fill-current' : ''}`} />
        </button>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{student.nome}</div>
        {student.email && (
          <div className="text-sm text-gray-500">{student.email}</div>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {student.curso}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {student.universidade}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {student.campus}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {student.genero === 'Masculino' ? 'M' : student.genero === 'Feminino' ? 'F' : student.genero}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusSelector 
          currentStatus={student.status}
          onStatusChange={(newStatus) => onStatusChange(student.id, newStatus)} 
        />
      </td>
    </tr>
  );
};

const CalourosTable = ({ students, onToggleFavorite, onStatusChange, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FiRefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Carregando calouros...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-16 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Favorito
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Curso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Universidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campus
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gênero
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  <FiUserCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Nenhum calouro encontrado</p>
                  <p className="text-gray-600">
                    {students.length === 0 ? 
                      "Você ainda não tem calouros favoritos ou com status definido." :
                      "Nenhum calouro corresponde aos filtros aplicados."
                    }
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const CalourosSection = ({ userData }) => {
  const [activeTab, setActiveTab] = useState('funil');
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Estado dos filtros para ambas as abas
  const [filters, setFilters] = useState({
    cursos: [],
    campi: [],
    universidades: [],
  });
  const republicType = userData?.republic?.tipo || 'mista';
  // Criar chave consistente para estudantes
  const createStudentKey = useCallback((name, course, university, campus) => {
    return `${normalizeString(name)}-${normalizeString(course)}-${normalizeString(university)}-${normalizeString(campus)}`;
  }, []);

  // Buscar calouro no banco
  const findCalouroInDatabase = useCallback(async (studentData) => {
    try {
      console.log('🟡 Buscando calouro no banco:', studentData.name);
      
      const response = await calouroService.getSelectedCalouros();
      const calouros = response.calouros || [];
      
      const studentKey = createStudentKey(
        studentData.name,
        studentData.course,
        studentData.university,
        studentData.campus
      );
      
      const calouroEncontrado = calouros.find(calouro => {
        const calouroKey = createStudentKey(
          calouro.name,
          calouro.course,
          calouro.university,
          calouro.campus
        );
        return calouroKey === studentKey;
      });
      
      if (calouroEncontrado) {
        console.log(`✅ Calouro encontrado no banco: ${calouroEncontrado.name} (ID: ${calouroEncontrado.id}, Status: ${calouroEncontrado.status}, Favorito: ${calouroEncontrado.favourite})`);
        return calouroEncontrado;
      } else {
        console.log(`❌ Calouro NÃO encontrado no banco: ${studentData.name}`);
        return null;
      }
    } catch (error) {
      console.error('🔴 Erro ao buscar calouro no banco:', error);
      return null;
    }
  }, [createStudentKey]);

  const fetchCalouros = async () => {
    try {
      setLoading(true);
      const response = await calouroService.getSelectedCalouros();
      
      console.log('📊 Dados recebidos da API:', response);
      
      if (!response.calouros) {
        setAllStudents([]);
        return;
      }
  
      // Mapear status do backend para frontend
      const statusDisplayMap = {
        'pending': 'Nenhum',
        'contacted': 'Chamado', 
        'approved': 'Sucesso',
        'rejected': 'Rejeitado'
      };
  
      // 🔥 CORREÇÃO: Mapear gênero do banco (inglês) para português
      const genderDisplayMap = {
        'male': 'Masculino',
        'female': 'Feminino',

      };
  
      // Mapear os dados da API para o formato esperado pelo componente
      const mappedStudents = response.calouros.map(calouro => {
        // Converter gênero do inglês para português
        const generoDisplay = genderDisplayMap[calouro.gender] || 'Outro';
        
        return {
          id: calouro.id,
          nome: calouro.name,
          email: calouro.email,
          curso: calouro.course,
          universidade: calouro.university,
          campus: calouro.campus,
          genero: generoDisplay, // ✅ AGORA EM PORTUGUÊS
          status: statusDisplayMap[calouro.status] || 'Nenhum',
          isFavorited: calouro.favourite || false,
          ano_entrada: calouro.entrance_year,
          // Dados originais para criar/atualizar no banco
          originalData: {
            name: calouro.name,
            course: calouro.course,
            university: calouro.university,
            campus: calouro.campus,
            gender: calouro.gender, // Manter o original em inglês para o banco
            entrance_year: calouro.entrance_year
          }
        };
      });
  
      console.log(`✅ ${mappedStudents.length} calouros mapeados`);
      console.log('📋 Exemplo de calouro:', mappedStudents[0]);
      
      setAllStudents(mappedStudents);
      setError(null);
    } catch (err) {
      console.error('🔴 Erro ao buscar calouros:', err);
      setError('Erro ao carregar dados dos calouros');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const autoFilteredAllStudents = useMemo(() => {
    if (!allStudents.length) return [];
    
    switch (republicType) {
      case 'feminina':
        return allStudents.filter(student => student.genero === 'Feminino');
      case 'masculina':
        return allStudents.filter(student => student.genero === 'Masculino');
      case 'mista':
      default:
        return allStudents;
    }
  }, [allStudents, republicType]);
  useEffect(() => {
    fetchCalouros();
  }, []);

  const handleToggleFavorite = async (studentId, isFavorited) => {
    // 1. Encontre o estudante na lista principal
    const student = allStudents.find(s => s.id === studentId);
    if (!student) return;

    console.log(`🟡 Tentando ${isFavorited ? 'favoritar' : 'desfavoritar'}: ${student.nome} (ID: ${studentId})`);

    try {
      // 2. Chame a API (o student.id já é o ID real do banco)
      await calouroService.updateFavorite(student.id, isFavorited);

      // 3. Atualize o estado local
      setAllStudents(prevStudents =>
        prevStudents.map(s =>
          s.id === studentId
            ? { ...s, isFavorited: isFavorited } // Atualiza o favorito
            : s
        )
      );
      console.log(`✅ Favorito atualizado: ${student.nome} -> ${isFavorited}`);

    } catch (err) {
      console.error('🔴 Erro ao atualizar favorito:', err);
      alert('Erro ao atualizar favorito. Tente novamente.');
    }
  };

  const handleStatusChange = async (studentId, newStatus) => {
    // 1. Encontre o estudante na lista principal
    const student = allStudents.find(s => s.id === studentId);
    if (!student) return;

    console.log(`🟡 Tentando alterar status: ${student.nome} -> ${newStatus} (ID: ${studentId})`);

    // 2. Mapear status do frontend para backend
    const statusMapping = {
      'Nenhum': 'pending',
      'Chamado': 'contacted',
      'Sucesso': 'approved',
      'Rejeitado': 'rejected'
    };
    const statusBackend = statusMapping[newStatus] || 'pending';

    try {
      // 3. Chame a API (o student.id já é o ID real do banco)
      await calouroService.updateStatus(student.id, { status: statusBackend });

      // 4. Atualize o estado local
      setAllStudents(prevStudents =>
        prevStudents.map(s =>
          s.id === studentId
            ? { ...s, status: newStatus } // Atualiza o status
            : s
        )
      );
      console.log(`✅ Status atualizado: ${student.nome} -> ${newStatus}`);

    } catch (err) {
      console.error('🔴 Erro ao atualizar status:', err);
      alert('Erro ao atualizar status. Tente novamente.');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCalouros();
  };

  // --- Listas Memoizadas ---

// ✅ DEPOIS
const { ALL_CURSOS, ALL_CAMPI, ALL_UNIVERSIDADES } = useMemo(() => {
  // 👇 Use a lista pré-filtrada
  const cursos = [...new Set(autoFilteredAllStudents.map(student => student.curso).filter(Boolean))].sort();
  const campi = [...new Set(autoFilteredAllStudents.map(student => student.campus).filter(Boolean))].sort();
  const universidades = [...new Set(autoFilteredAllStudents.map(student => student.universidade).filter(Boolean))].sort();
  
  return { 
    ALL_CURSOS: cursos.length > 0 ? cursos : [], // Ajustado para retornar array vazio
    ALL_CAMPI: campi.length > 0 ? campi : [],
    ALL_UNIVERSIDADES: universidades.length > 0 ? universidades : []
  };
}, [autoFilteredAllStudents]); // 👈 Dependência atualizada

  // 1. A lista base do "Funil" (apenas alunos com status diferente de 'Nenhum')
  const funilStudents = useMemo(() => {
        return autoFilteredAllStudents.filter(student => student.status !== 'Nenhum');
      }, [autoFilteredAllStudents]);
  
  // 2. A lista de "Favoritos"
  const favoritedStudents = useMemo(() => {
        return autoFilteredAllStudents.filter(student => student.isFavorited);
      }, [autoFilteredAllStudents]);

  // 3. A lista do "Funil" *depois* de aplicar os filtros
  const filteredFunilStudents = useMemo(() => {
    return funilStudents.filter(student => {
    
      if (filters.cursos.length > 0 && !filters.cursos.includes(student.curso)) {
        return false;
      }
      if (filters.campi.length > 0 && !filters.campi.includes(student.campus)) {
        return false;
      }
      if (filters.universidades.length > 0 && !filters.universidades.includes(student.universidade)) {
        return false;
      }
      return true;
    });
  }, [funilStudents, filters]);

  // 4. A lista de "Favoritos" *depois* de aplicar os filtros
  const filteredFavoritedStudents = useMemo(() => {
    return favoritedStudents.filter(student => {
      
      if (filters.cursos.length > 0 && !filters.cursos.includes(student.curso)) {
        return false;
      }
      if (filters.campi.length > 0 && !filters.campi.includes(student.campus)) {
        return false;
      }
      if (filters.universidades.length > 0 && !filters.universidades.includes(student.universidade)) {
        return false;
      }
      return true;
    });
  }, [favoritedStudents, filters]);

  // Determina qual lista mostrar na tabela
  const studentsToDisplay = activeTab === 'funil' ? filteredFunilStudents : filteredFavoritedStudents;

  if (error && allStudents.length === 0) {
    return (
      <div className="bg-gray-50 min-h-full flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar dados</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 flex items-center mx-auto"
          >
            <FiRefreshCw className="mr-2" />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full p-6">
     
      
      <div className="flex space-x-1 p-1 bg-gray-200 rounded-lg mb-6 max-w-md">
        <button
          onClick={() => setActiveTab('funil')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold transition-colors
            ${activeTab === 'funil' 
              ? 'bg-gray-900 text-white shadow'
              : 'text-gray-600 hover:bg-gray-100'
            }
          `}
        >
          <FiUserCheck className="w-5 h-5 mr-2" />
          Funil de Contato ({funilStudents.length})
        </button>
        <button
          onClick={() => setActiveTab('favoritos')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold transition-colors
            ${activeTab === 'favoritos' 
              ? 'bg-gray-900 text-white shadow'
              : 'text-gray-600 hover:bg-gray-100'
            }
          `}
        >
          <FiHeart className="w-5 h-5 mr-2" />
          Favoritos ({favoritedStudents.length})
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Filtros (para ambas as abas) */}
      {(activeTab === 'funil' && funilStudents.length > 0) || (activeTab === 'favoritos' && favoritedStudents.length > 0) ? (
        <CalourosFilterBar 
          filters={filters} 
          setFilters={setFilters}
          ALL_CURSOS={ALL_CURSOS}
          ALL_CAMPI={ALL_CAMPI}
          ALL_UNIVERSIDADES={ALL_UNIVERSIDADES}
        />
      ) : null}

      <CalourosTable 
        students={studentsToDisplay}
        onToggleFavorite={handleToggleFavorite}
        onStatusChange={handleStatusChange}
        loading={loading && allStudents.length === 0}
      />
    </div>
  );
};

export default CalourosSection;
