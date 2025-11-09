// sections/DashboardSection.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom'; // Importar useLocation
import { toast } from 'react-toastify'; // Import do toast
import { useCityData } from '../../../hooks/useCityData';
import StudentTable from './dashboard/StudentTable';
import FilterBar from './dashboard/FilterBar';
import SaveFilterModal from './dashboard/SaveFilterModal';
import { calouroService } from '../../../services/calouroService';
import { filterService } from '../../../services/filterService';
import { apiService } from '../../../services/apiService';
import * as XLSX from 'xlsx';

const normalizeString = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
};

const DashboardSection = ({ userData }) => {
    const { cityData, loading, error, userCity, accessInfo, refetch } = useCityData();
    const location = useLocation(); // Hook para acessar o location
  
    // Estados para paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100);
  
    const [filters, setFilters] = useState({
      cursos: [],       
      universidades: [], 
      unidades: [],     
      chamadas: []
    });
  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedFilters, setSavedFilters] = useState([]);
    const [isLoadingFilters, setIsLoadingFilters] = useState(false);

    // Estado para gerenciar favoritos e status dos estudantes
    const [studentsMetadata, setStudentsMetadata] = useState({});
    
    // Estado para forçar atualização
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    // Estado para indicador de atualização
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 🔥 NOVO: Efeito para carregar filtro da navegação
    useEffect(() => {
      const loadFilterFromNavigation = async () => {
        if (location.state?.loadedFilter) {
          const { loadedFilter, filterName } = location.state;
          
          try {
            console.log('🟡 Carregando filtro da navegação:', filterName);
            
            // Aplicar os filtros
            if (loadedFilter.filters) {
              setFilters(loadedFilter.filters);
              toast.success(`Filtro "${filterName}" carregado com sucesso!`);
            }
            
            // Limpar o state para não recarregar o mesmo filtro novamente
            window.history.replaceState({}, document.title);
            
          } catch (error) {
            console.error('🔴 Erro ao carregar filtro da navegação:', error);
            toast.error('Erro ao carregar filtro');
          }
        }
      };

      loadFilterFromNavigation();
    }, [location]);

    // Função para carregar filtros salvos
    const loadSavedFilters = useCallback(async () => {
      try {
        setIsLoadingFilters(true);
        console.log('🟡 Carregando filtros salvos...');
        const userFilters = await filterService.getUserFilters();
        console.log(`✅ ${userFilters.length} filtros carregados`);
        setSavedFilters(userFilters);
      } catch (error) {
        console.error('🔴 Erro ao carregar filtros:', error);
        toast.error('Erro ao carregar filtros salvos');
      } finally {
        setIsLoadingFilters(false);
      }
    }, []);

    // Carregar filtros quando o componente montar
    useEffect(() => {
      loadSavedFilters();
    }, [loadSavedFilters]);

    // 🔥 CORREÇÃO: Remover o health check problemático
    // useEffect(() => {
    //   const testBackendConnection = async () => {
    //     try {
    //       const response = await apiService.get('/api/filtros/health');
    //       console.log('✅ Backend de filtros está funcionando:', response);
    //     } catch (error) {
    //       console.error('🔴 Backend de filtros não está respondendo:', error);
    //     }
    //   };
      
    //   testBackendConnection();
    // }, []);
  
    // Função para recarregar os dados
    const refreshCalourosData = useCallback(async () => {
      console.log('🔄 Forçando atualização dos calouros...');
      setIsRefreshing(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setRefreshTrigger(prev => prev + 1);
      } finally {
        setIsRefreshing(false);
      }
    }, []);
  
    // Função para criar chave consistente para os estudantes
    const createStudentKey = useCallback((name, course, university, campus) => {
      return `${normalizeString(name)}-${normalizeString(course)}-${normalizeString(university)}-${normalizeString(campus)}`;
    }, []);
  
    // Carregar favoritos e status quando os dados da cidade forem carregados
    useEffect(() => {
      const loadFavoritesAndStatus = async () => {
        try {
          console.log('🟡 Carregando favoritos e status...');
          
          // Carregar TODOS os calouros do usuário
          const calourosResponse = await calouroService.getSelectedCalouros();
          const calouros = calourosResponse.calouros || [];
  
          console.log(`✅ ${calouros.length} calouros carregados do banco`);
  
          // Mapear status do backend para frontend
          const statusDisplayMap = {
            'pending': 'Nenhum',
            'contacted': 'Chamado', 
            'approved': 'Sucesso',
            'rejected': 'Rejeitado'
          };
  
          // Mapear gênero do banco para exibição
          const genderDisplayMap = {
            'male': 'Masculino',
            'female': 'Feminino',
            'other': 'Outro'
          };
  
          // Criar um mapa de metadados
          const metadata = {};
  
          // Processar calouros do banco
          calouros.forEach(calouro => {
            // Criar chave normalizada para o estudante
            const studentKey = createStudentKey(
              calouro.name,
              calouro.course,
              calouro.university,
              calouro.campus
            );
            
            metadata[studentKey] = {
              isFavorited: calouro.favourite || false,
              status: statusDisplayMap[calouro.status] || 'Nenhum',
              dbId: calouro.id,
              genderDisplay: genderDisplayMap[calouro.gender] || 'Outro',
              originalStatus: calouro.status
            };
          });
  
          console.log(`📊 Metadados carregados: ${Object.keys(metadata).length} estudantes`);
          setStudentsMetadata(metadata);
  
        } catch (err) {
          console.error('🔴 Erro ao carregar favoritos e status:', err);
        }
      };
  
      if (cityData && Object.keys(cityData).length > 0) {
        console.log('🏙️ Dados da cidade carregados, buscando favoritos...');
        loadFavoritesAndStatus();
      }
    }, [cityData, refreshTrigger, createStudentKey]);
  
    const students = useMemo(() => {
        if (!cityData) return [];
      
        const data = cityData.dados || cityData.candidatos || [];
        
        console.log(`📝 Convertendo ${data.length} estudantes da API...`);
      
        const convertedStudents = data.map((student, index) => {
          const genderMap = {
            'M': 'male',
            'F': 'female'
          };
          
          const genderBackend = genderMap[student.genero] || 'other';
      
          // Criar chave única NORMALIZADA para buscar metadados
          const studentKey = createStudentKey(
            student.nome,
            student.curso_limpo || student.curso,
            student.universidade,
            student.unidade
          );
          
          const metadata = studentsMetadata[studentKey] || {};
      
          return {
            id: metadata.dbId || `temp-${index}`,
            nome: student.nome,
            chamada: student.chamada,
            curso: student.curso_limpo || student.curso,
            universidade: student.universidade,
            unidade: student.unidade,
            genero: student.genero === 'M' ? 'Masculino' : 'Feminino',
            cidade: student.cidade,
            remanejado: student.remanejado,
            // Metadados
            isFavorited: metadata.isFavorited || false,
            status: metadata.status || 'Nenhum',
            // Dados originais para criar no banco se necessário
            originalData: {
              name: student.nome,
              course: student.curso_limpo || student.curso,
              university: student.universidade,
              campus: student.unidade,
              gender: genderBackend,
              entrance_year: new Date().getFullYear()
            }
          };
        });
      
        return convertedStudents;
      }, [cityData, studentsMetadata, createStudentKey]);

  // Obter o tipo da república do usuário
  const republicType = userData?.republic?.tipo || 'mista';
  
  // Filtrar automaticamente por gênero baseado no tipo da república
  const autoFilteredStudents = useMemo(() => {
    if (!students.length) return [];
    
    switch (republicType) {
      case 'feminina':
        return students.filter(student => student.genero === 'Feminino');
      case 'masculina':
        return students.filter(student => student.genero === 'Masculino');
      case 'mista':
      default:
        return students;
    }
  }, [students, republicType]);

  // Extrair opções únicas para os filtros
  const filterOptions = useMemo(() => {
    if (!autoFilteredStudents || !autoFilteredStudents.length) {
      return { 
        cursos: [], 
        universidades: [], 
        unidades: [], 
        chamadas: [] 
      };
    }
  
    const cursos = [...new Set(autoFilteredStudents.map(s => s.curso))].sort();
    const universidades = [...new Set(autoFilteredStudents.map(s => s.universidade))].sort();
    const unidades = [...new Set(autoFilteredStudents.map(s => s.unidade))].sort();
    const chamadas = [...new Set(autoFilteredStudents.map(s => s.chamada))].sort((a, b) => a - b);
  
    return { cursos, universidades, unidades, chamadas };
  }, [autoFilteredStudents]);

  // Aplicar filtros manuais
  const filteredStudents = useMemo(() => {
    if (!autoFilteredStudents.length) return [];
    
    return autoFilteredStudents.filter(student => {
      if (filters.cursos.length > 0 && !filters.cursos.includes(student.curso)) return false;
      if (filters.universidades.length > 0 && !filters.universidades.includes(student.universidade)) return false;
      if (filters.unidades.length > 0 && !filters.unidades.includes(student.unidade)) return false;
      if (filters.chamadas.length > 0 && !filters.chamadas.includes(student.chamada)) return false;
      
      return true;
    });
  }, [autoFilteredStudents, filters]);

  // Calcular dados de paginação
  const paginationData = useMemo(() => {
    const totalItems = filteredStudents.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Garantir que a página atual seja válida
    const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);
    
    // Calcular itens da página atual
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = filteredStudents.slice(startIndex, endIndex);

    return {
      currentItems,
      totalItems,
      totalPages: totalPages || 1,
      currentPage: validCurrentPage,
      startIndex: startIndex + 1,
      endIndex,
      hasPrevious: validCurrentPage > 1,
      hasNext: validCurrentPage < totalPages
    };
  }, [filteredStudents, currentPage, itemsPerPage]);

  // Resetar para página 1 quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, itemsPerPage]);

  // Handlers para favoritos e status
  const handleToggleFavorite = async (studentId, isFavorited) => {
    const student = filteredStudents.find(s => s.id === studentId);
    if (!student) return;

    const studentKey = createStudentKey(
      student.nome,
      student.curso,
      student.universidade,
      student.unidade
    );

    // 1. ATUALIZAÇÃO OTIMISTA
    const previousMetadata = { ...studentsMetadata };
    
    setStudentsMetadata(prev => ({
      ...prev,
      [studentKey]: {
        ...prev[studentKey],
        isFavorited: isFavorited
      }
    }));

    // 2. AÇÃO ASSÍNCRONA
    try {
      console.log(`🟡 Ação de favorito iniciada: ${student.nome} -> ${isFavorited}`);

      const studentExistsInDb = !String(studentId).startsWith('temp-');
      let actualStudentId = studentId;

      if (studentExistsInDb) {
        console.log(`✅ Estudante existe no banco. ID: ${actualStudentId}. Atualizando...`);
        await calouroService.updateFavorite(actualStudentId, isFavorited);
      
      } else {
        if (isFavorited) {
          console.log(`🟡 Criando calouro no banco para favoritar: ${student.nome}`);
          const createResponse = await calouroService.createCalouro({
            ...student.originalData,
            favourite: true,
            status: 'pending'
          });
          actualStudentId = createResponse.calouro_id;

          setStudentsMetadata(prev => ({
            ...prev,
            [studentKey]: {
              ...prev[studentKey],
              dbId: actualStudentId,
              isFavorited: true
            }
          }));
        } else {
          console.log(`🟡 Ignorando: tentativa de desfavoritar estudante que não existe no banco`);
        }
      }
      console.log(`✅ Ação de favorito concluída: ${student.nome}`);
      toast.success(`Estudante ${isFavorited ? 'favoritado' : 'desfavoritado'} com sucesso!`);

    } catch (err) {
      console.error('🔴 Erro ao atualizar favorito, revertendo UI:', err);
      toast.error(`Erro ao ${isFavorited ? 'favoritar' : 'desfavoritar'} estudante`);
      
      setStudentsMetadata(previousMetadata);
    }
  };

  const handleStatusChange = async (studentId, newStatus) => {
    const student = filteredStudents.find(s => s.id === studentId);
    if (!student) return;

    const studentKey = createStudentKey(
      student.nome,
      student.curso,
      student.universidade,
      student.unidade
    );

    // 1. ATUALIZAÇÃO OTIMISTA
    const previousMetadata = { ...studentsMetadata };

    setStudentsMetadata(prev => ({
      ...prev,
      [studentKey]: {
        ...prev[studentKey],
        status: newStatus
      }
    }));

    // 2. AÇÃO ASSÍNCRONA
    try {
      console.log(`🟡 Ação de status iniciada: ${student.nome} -> ${newStatus}`);

      const statusMapping = {
        'Nenhum': 'pending',
        'Chamado': 'contacted',
        'Sucesso': 'approved',
        'Rejeitado': 'rejected'
      };
      const statusBackend = statusMapping[newStatus] || 'pending';

      const studentExistsInDb = !String(studentId).startsWith('temp-');
      let actualStudentId = studentId;

      if (studentExistsInDb) {
        console.log(`✅ Estudante existe no banco. ID: ${actualStudentId}. Atualizando status...`);
        await calouroService.updateStatus(actualStudentId, { status: statusBackend });
      
      } else {
        if (newStatus !== 'Nenhum') {
          console.log(`🟡 Criando calouro no banco com status: ${student.nome} -> ${statusBackend}`);
          const createResponse = await calouroService.createCalouro({
            ...student.originalData,
            favourite: student.isFavorited || false,
            status: statusBackend
          });
          actualStudentId = createResponse.calouro_id;

          setStudentsMetadata(prev => ({
            ...prev,
            [studentKey]: {
              ...prev[studentKey],
              dbId: actualStudentId,
              status: newStatus
            }
          }));
        } else {
          console.log(`🟡 Ignorando: tentativa de definir status "Nenhum" para estudante que não existe no banco`);
        }
      }
      console.log(`✅ Ação de status concluída: ${student.nome}`);
      
      toast.success(`Status atualizado para "${newStatus}"`);
    } catch (err) {
      console.error('🔴 Erro ao atualizar status, revertendo UI:', err);
      toast.error('Erro ao atualizar status do estudante');
      
      setStudentsMetadata(previousMetadata);
    }
  };

  const handleExportSheet = () => {
    if (!filteredStudents.length) return;
    
    const dataToExport = filteredStudents.map(student => ({
      Nome: student.nome,
      Chamada: student.chamada,
      Curso: student.curso,
      Universidade: student.universidade,
      Unidade: student.unidade,
      Gênero: student.genero,
      Cidade: userCity || 'N/A',
      Favorito: student.isFavorited ? 'Sim' : 'Não',
      Status: student.status
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);

    const columnWidths = [
      { wch: 35 },
      { wch: 10 },
      { wch: 45 },
      { wch: 30 },
      { wch: 30 },
      { wch: 12 },
      { wch: 20 },
      { wch: 10 },
      { wch: 12 }
    ];
    ws['!cols'] = columnWidths;

    const headerStyle = {
      font: { bold: true, sz: 12 },
      fill: { fgColor: { rgb: "FFF0F0F0" } }
    };
    
    const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1'];
    headerCells.forEach(cellRef => {
      if (ws[cellRef]) {
        ws[cellRef].s = headerStyle;
      }
    });
    
    const dataRange = ws['!ref'];
    ws['!autofilter'] = { ref: dataRange };
    
    ws['!views'] = [{ state: 'frozen', ySplit: 1 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Calouros');

    const fileName = `calouros-${userCity}-${new Date().toISOString().split('T')[0]}.xlsx`;
    
    XLSX.writeFile(wb, fileName);
  };

  // Função para salvar filtro
  const handleSaveFilter = async (filterName) => {
    try {
      console.log('💾 Salvando filtro:', filterName);
      
      const filterData = {
        name: filterName,
        filter_type: 'calouros',
        filters: filters,
        is_shared: false
      };

      console.log('📤 Enviando dados do filtro:', filterData);
      const response = await filterService.saveFilter(filterData);
      console.log('✅ Filtro salvo com sucesso:', response);
      
      await loadSavedFilters();
      
      toast.success('Filtro salvo com sucesso!');
      handleCloseModal();
    } catch (error) {
      console.error('🔴 Erro ao salvar filtro:', error);
      const errorMessage = error.message.includes('404') 
        ? 'Serviço de filtros temporariamente indisponível'
        : 'Erro ao salvar filtro';
      toast.error(errorMessage);
    }
  };

  // Função para carregar filtro
  const handleLoadFilter = async (filterId) => {
    try {
      console.log('🟡 Carregando filtro:', filterId);
      const filter = await filterService.loadFilter(filterId);
      
      if (filter && filter.filters) {
        setFilters(filter.filters);
        console.log('✅ Filtro aplicado com sucesso:', filter.name);
        toast.success(`Filtro "${filter.name}" carregado!`);
      }
    } catch (error) {
      console.error('🔴 Erro ao carregar filtro:', error);
      const errorMessage = error.message.includes('404')
        ? 'Filtro não encontrado'
        : 'Erro ao carregar filtro';
      toast.error(errorMessage);
    }
  };

  // Função para excluir filtro
  const handleDeleteFilter = async (filterId, filterName) => {
    if (!window.confirm(`Tem certeza que deseja excluir o filtro "${filterName}"?`)) return;

    try {
      await filterService.deleteFilter(filterId);
      console.log('✅ Filtro excluído com sucesso');
      
      await loadSavedFilters();
      
      toast.success('Filtro excluído com sucesso!');
    } catch (error) {
      console.error('🔴 Erro ao excluir filtro:', error);
      const errorMessage = error.message.includes('404')
        ? 'Filtro não encontrado'
        : 'Erro ao excluir filtro';
      toast.error(errorMessage);
    }
  };

  const handleOpenSaveModal = () => {
    const isFilterActive = filters.cursos.length > 0 || 
                          filters.universidades.length > 0 || 
                          filters.unidades.length > 0 || 
                          filters.chamadas.length > 0;
    
    if (!isFilterActive) {
      toast.warning('Aplique alguns filtros antes de salvar!');
      return;
    }
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Estados de loading e error
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600 mb-4">
          <h3 className="text-lg font-semibold">Erro ao carregar dados</h3>
          <p>{error}</p>
        </div>
        <button 
          onClick={refetch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!userCity) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-yellow-600 mb-4">
          <h3 className="text-lg font-semibold">Configuração necessária</h3>
          <p>Você precisa configurar uma cidade para sua república para visualizar os dados.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/config'}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Configurar República
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Indicador de atualização */}
      {isRefreshing && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Atualizando dados...
          </div>
        </div>
      )}

      {/* Filtros e Tabela */}
      <div className="space-y-6">
        <FilterBar 
          filters={filters}
          setFilters={setFilters}
          onSaveFilter={handleOpenSaveModal}
          onExportSheet={handleExportSheet}
          onLoadFilter={handleLoadFilter}
          onDeleteFilter={handleDeleteFilter}
          savedFilters={savedFilters}
          isLoadingFilters={isLoadingFilters}
          filterOptions={filterOptions}
          userData={userData}
          republicType={republicType}
          filteredStudents={filteredStudents}
        />
        
        <StudentTable 
          students={paginationData.currentItems}
          pagination={{
            currentPage: paginationData.currentPage,
            totalPages: paginationData.totalPages,
            totalItems: paginationData.totalItems,
            itemsPerPage,
            startIndex: paginationData.startIndex,
            endIndex: paginationData.endIndex,
            hasPrevious: paginationData.hasPrevious,
            hasNext: paginationData.hasNext,
            onPageChange: setCurrentPage,
            onItemsPerPageChange: setItemsPerPage
          }}
          onToggleFavorite={handleToggleFavorite}
          onStatusChange={handleStatusChange}
        />
      </div>

      <SaveFilterModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveFilter}
      />
    </>
  );
};

export default DashboardSection;// sections/DashboardSection.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom'; // Importar useLocation
import { toast } from 'react-toastify'; // Import do toast
import { useCityData } from '../../../hooks/useCityData';
import StudentTable from './dashboard/StudentTable';
import FilterBar from './dashboard/FilterBar';
import SaveFilterModal from './dashboard/SaveFilterModal';
import { calouroService } from '../../../services/calouroService';
import { filterService } from '../../../services/filterService';
import { apiService } from '../../../services/apiService';
import * as XLSX from 'xlsx';

const normalizeString = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
};

const DashboardSection = ({ userData }) => {
    const { cityData, loading, error, userCity, accessInfo, refetch } = useCityData();
    const location = useLocation(); // Hook para acessar o location
  
    // Estados para paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100);
  
    const [filters, setFilters] = useState({
      cursos: [],       
      universidades: [], 
      unidades: [],     
      chamadas: []
    });
  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedFilters, setSavedFilters] = useState([]);
    const [isLoadingFilters, setIsLoadingFilters] = useState(false);

    // Estado para gerenciar favoritos e status dos estudantes
    const [studentsMetadata, setStudentsMetadata] = useState({});
    
    // Estado para forçar atualização
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    // Estado para indicador de atualização
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 🔥 NOVO: Efeito para carregar filtro da navegação
    useEffect(() => {
      const loadFilterFromNavigation = async () => {
        if (location.state?.loadedFilter) {
          const { loadedFilter, filterName } = location.state;
          
          try {
            console.log('🟡 Carregando filtro da navegação:', filterName);
            
            // Aplicar os filtros
            if (loadedFilter.filters) {
              setFilters(loadedFilter.filters);
              toast.success(`Filtro "${filterName}" carregado com sucesso!`);
            }
            
            // Limpar o state para não recarregar o mesmo filtro novamente
            window.history.replaceState({}, document.title);
            
          } catch (error) {
            console.error('🔴 Erro ao carregar filtro da navegação:', error);
            toast.error('Erro ao carregar filtro');
          }
        }
      };

      loadFilterFromNavigation();
    }, [location]);

    // Função para carregar filtros salvos
    const loadSavedFilters = useCallback(async () => {
      try {
        setIsLoadingFilters(true);
        console.log('🟡 Carregando filtros salvos...');
        const userFilters = await filterService.getUserFilters();
        console.log(`✅ ${userFilters.length} filtros carregados`);
        setSavedFilters(userFilters);
      } catch (error) {
        console.error('🔴 Erro ao carregar filtros:', error);
        toast.error('Erro ao carregar filtros salvos');
      } finally {
        setIsLoadingFilters(false);
      }
    }, []);

    // Carregar filtros quando o componente montar
    useEffect(() => {
      loadSavedFilters();
    }, [loadSavedFilters]);

    // 🔥 CORREÇÃO: Remover o health check problemático
    // useEffect(() => {
    //   const testBackendConnection = async () => {
    //     try {
    //       const response = await apiService.get('/api/filtros/health');
    //       console.log('✅ Backend de filtros está funcionando:', response);
    //     } catch (error) {
    //       console.error('🔴 Backend de filtros não está respondendo:', error);
    //     }
    //   };
      
    //   testBackendConnection();
    // }, []);
  
    // Função para recarregar os dados
    const refreshCalourosData = useCallback(async () => {
      console.log('🔄 Forçando atualização dos calouros...');
      setIsRefreshing(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setRefreshTrigger(prev => prev + 1);
      } finally {
        setIsRefreshing(false);
      }
    }, []);
  
    // Função para criar chave consistente para os estudantes
    const createStudentKey = useCallback((name, course, university, campus) => {
      return `${normalizeString(name)}-${normalizeString(course)}-${normalizeString(university)}-${normalizeString(campus)}`;
    }, []);
  
    // Carregar favoritos e status quando os dados da cidade forem carregados
    useEffect(() => {
      const loadFavoritesAndStatus = async () => {
        try {
          console.log('🟡 Carregando favoritos e status...');
          
          // Carregar TODOS os calouros do usuário
          const calourosResponse = await calouroService.getSelectedCalouros();
          const calouros = calourosResponse.calouros || [];
  
          console.log(`✅ ${calouros.length} calouros carregados do banco`);
  
          // Mapear status do backend para frontend
          const statusDisplayMap = {
            'pending': 'Nenhum',
            'contacted': 'Chamado', 
            'approved': 'Sucesso',
            'rejected': 'Rejeitado'
          };
  
          // Mapear gênero do banco para exibição
          const genderDisplayMap = {
            'male': 'Masculino',
            'female': 'Feminino',
            'other': 'Outro'
          };
  
          // Criar um mapa de metadados
          const metadata = {};
  
          // Processar calouros do banco
          calouros.forEach(calouro => {
            // Criar chave normalizada para o estudante
            const studentKey = createStudentKey(
              calouro.name,
              calouro.course,
              calouro.university,
              calouro.campus
            );
            
            metadata[studentKey] = {
              isFavorited: calouro.favourite || false,
              status: statusDisplayMap[calouro.status] || 'Nenhum',
              dbId: calouro.id,
              genderDisplay: genderDisplayMap[calouro.gender] || 'Outro',
              originalStatus: calouro.status
            };
          });
  
          console.log(`📊 Metadados carregados: ${Object.keys(metadata).length} estudantes`);
          setStudentsMetadata(metadata);
  
        } catch (err) {
          console.error('🔴 Erro ao carregar favoritos e status:', err);
        }
      };
  
      if (cityData && Object.keys(cityData).length > 0) {
        console.log('🏙️ Dados da cidade carregados, buscando favoritos...');
        loadFavoritesAndStatus();
      }
    }, [cityData, refreshTrigger, createStudentKey]);
  
    const students = useMemo(() => {
        if (!cityData) return [];
      
        const data = cityData.dados || cityData.candidatos || [];
        
        console.log(`📝 Convertendo ${data.length} estudantes da API...`);
      
        const convertedStudents = data.map((student, index) => {
          const genderMap = {
            'M': 'male',
            'F': 'female'
          };
          
          const genderBackend = genderMap[student.genero] || 'other';
      
          // Criar chave única NORMALIZADA para buscar metadados
          const studentKey = createStudentKey(
            student.nome,
            student.curso_limpo || student.curso,
            student.universidade,
            student.unidade
          );
          
          const metadata = studentsMetadata[studentKey] || {};
      
          return {
            id: metadata.dbId || `temp-${index}`,
            nome: student.nome,
            chamada: student.chamada,
            curso: student.curso_limpo || student.curso,
            universidade: student.universidade,
            unidade: student.unidade,
            genero: student.genero === 'M' ? 'Masculino' : 'Feminino',
            cidade: student.cidade,
            remanejado: student.remanejado,
            // Metadados
            isFavorited: metadata.isFavorited || false,
            status: metadata.status || 'Nenhum',
            // Dados originais para criar no banco se necessário
            originalData: {
              name: student.nome,
              course: student.curso_limpo || student.curso,
              university: student.universidade,
              campus: student.unidade,
              gender: genderBackend,
              entrance_year: new Date().getFullYear()
            }
          };
        });
      
        return convertedStudents;
      }, [cityData, studentsMetadata, createStudentKey]);

  // Obter o tipo da república do usuário
  const republicType = userData?.republic?.tipo || 'mista';
  
  // Filtrar automaticamente por gênero baseado no tipo da república
  const autoFilteredStudents = useMemo(() => {
    if (!students.length) return [];
    
    switch (republicType) {
      case 'feminina':
        return students.filter(student => student.genero === 'Feminino');
      case 'masculina':
        return students.filter(student => student.genero === 'Masculino');
      case 'mista':
      default:
        return students;
    }
  }, [students, republicType]);

  // Extrair opções únicas para os filtros
  const filterOptions = useMemo(() => {
    if (!autoFilteredStudents || !autoFilteredStudents.length) {
      return { 
        cursos: [], 
        universidades: [], 
        unidades: [], 
        chamadas: [] 
      };
    }
  
    const cursos = [...new Set(autoFilteredStudents.map(s => s.curso))].sort();
    const universidades = [...new Set(autoFilteredStudents.map(s => s.universidade))].sort();
    const unidades = [...new Set(autoFilteredStudents.map(s => s.unidade))].sort();
    const chamadas = [...new Set(autoFilteredStudents.map(s => s.chamada))].sort((a, b) => a - b);
  
    return { cursos, universidades, unidades, chamadas };
  }, [autoFilteredStudents]);

  // Aplicar filtros manuais
  const filteredStudents = useMemo(() => {
    if (!autoFilteredStudents.length) return [];
    
    return autoFilteredStudents.filter(student => {
      if (filters.cursos.length > 0 && !filters.cursos.includes(student.curso)) return false;
      if (filters.universidades.length > 0 && !filters.universidades.includes(student.universidade)) return false;
      if (filters.unidades.length > 0 && !filters.unidades.includes(student.unidade)) return false;
      if (filters.chamadas.length > 0 && !filters.chamadas.includes(student.chamada)) return false;
      
      return true;
    });
  }, [autoFilteredStudents, filters]);

  // Calcular dados de paginação
  const paginationData = useMemo(() => {
    const totalItems = filteredStudents.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Garantir que a página atual seja válida
    const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);
    
    // Calcular itens da página atual
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = filteredStudents.slice(startIndex, endIndex);

    return {
      currentItems,
      totalItems,
      totalPages: totalPages || 1,
      currentPage: validCurrentPage,
      startIndex: startIndex + 1,
      endIndex,
      hasPrevious: validCurrentPage > 1,
      hasNext: validCurrentPage < totalPages
    };
  }, [filteredStudents, currentPage, itemsPerPage]);

  // Resetar para página 1 quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, itemsPerPage]);

  // Handlers para favoritos e status
  const handleToggleFavorite = async (studentId, isFavorited) => {
    const student = filteredStudents.find(s => s.id === studentId);
    if (!student) return;

    const studentKey = createStudentKey(
      student.nome,
      student.curso,
      student.universidade,
      student.unidade
    );

    // 1. ATUALIZAÇÃO OTIMISTA
    const previousMetadata = { ...studentsMetadata };
    
    setStudentsMetadata(prev => ({
      ...prev,
      [studentKey]: {
        ...prev[studentKey],
        isFavorited: isFavorited
      }
    }));

    // 2. AÇÃO ASSÍNCRONA
    try {
      console.log(`🟡 Ação de favorito iniciada: ${student.nome} -> ${isFavorited}`);

      const studentExistsInDb = !String(studentId).startsWith('temp-');
      let actualStudentId = studentId;

      if (studentExistsInDb) {
        console.log(`✅ Estudante existe no banco. ID: ${actualStudentId}. Atualizando...`);
        await calouroService.updateFavorite(actualStudentId, isFavorited);
      
      } else {
        if (isFavorited) {
          console.log(`🟡 Criando calouro no banco para favoritar: ${student.nome}`);
          const createResponse = await calouroService.createCalouro({
            ...student.originalData,
            favourite: true,
            status: 'pending'
          });
          actualStudentId = createResponse.calouro_id;

          setStudentsMetadata(prev => ({
            ...prev,
            [studentKey]: {
              ...prev[studentKey],
              dbId: actualStudentId,
              isFavorited: true
            }
          }));
        } else {
          console.log(`🟡 Ignorando: tentativa de desfavoritar estudante que não existe no banco`);
        }
      }
      console.log(`✅ Ação de favorito concluída: ${student.nome}`);
      toast.success(`Estudante ${isFavorited ? 'favoritado' : 'desfavoritado'} com sucesso!`);

    } catch (err) {
      console.error('🔴 Erro ao atualizar favorito, revertendo UI:', err);
      toast.error(`Erro ao ${isFavorited ? 'favoritar' : 'desfavoritar'} estudante`);
      
      setStudentsMetadata(previousMetadata);
    }
  };

  const handleStatusChange = async (studentId, newStatus) => {
    const student = filteredStudents.find(s => s.id === studentId);
    if (!student) return;

    const studentKey = createStudentKey(
      student.nome,
      student.curso,
      student.universidade,
      student.unidade
    );

    // 1. ATUALIZAÇÃO OTIMISTA
    const previousMetadata = { ...studentsMetadata };

    setStudentsMetadata(prev => ({
      ...prev,
      [studentKey]: {
        ...prev[studentKey],
        status: newStatus
      }
    }));

    // 2. AÇÃO ASSÍNCRONA
    try {
      console.log(`🟡 Ação de status iniciada: ${student.nome} -> ${newStatus}`);

      const statusMapping = {
        'Nenhum': 'pending',
        'Chamado': 'contacted',
        'Sucesso': 'approved',
        'Rejeitado': 'rejected'
      };
      const statusBackend = statusMapping[newStatus] || 'pending';

      const studentExistsInDb = !String(studentId).startsWith('temp-');
      let actualStudentId = studentId;

      if (studentExistsInDb) {
        console.log(`✅ Estudante existe no banco. ID: ${actualStudentId}. Atualizando status...`);
        await calouroService.updateStatus(actualStudentId, { status: statusBackend });
      
      } else {
        if (newStatus !== 'Nenhum') {
          console.log(`🟡 Criando calouro no banco com status: ${student.nome} -> ${statusBackend}`);
          const createResponse = await calouroService.createCalouro({
            ...student.originalData,
            favourite: student.isFavorited || false,
            status: statusBackend
          });
          actualStudentId = createResponse.calouro_id;

          setStudentsMetadata(prev => ({
            ...prev,
            [studentKey]: {
              ...prev[studentKey],
              dbId: actualStudentId,
              status: newStatus
            }
          }));
        } else {
          console.log(`🟡 Ignorando: tentativa de definir status "Nenhum" para estudante que não existe no banco`);
        }
      }
      console.log(`✅ Ação de status concluída: ${student.nome}`);
      
      toast.success(`Status atualizado para "${newStatus}"`);
    } catch (err) {
      console.error('🔴 Erro ao atualizar status, revertendo UI:', err);
      toast.error('Erro ao atualizar status do estudante');
      
      setStudentsMetadata(previousMetadata);
    }
  };

  const handleExportSheet = () => {
    if (!filteredStudents.length) return;
    
    const dataToExport = filteredStudents.map(student => ({
      Nome: student.nome,
      Chamada: student.chamada,
      Curso: student.curso,
      Universidade: student.universidade,
      Unidade: student.unidade,
      Gênero: student.genero,
      Cidade: userCity || 'N/A',
      Favorito: student.isFavorited ? 'Sim' : 'Não',
      Status: student.status
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);

    const columnWidths = [
      { wch: 35 },
      { wch: 10 },
      { wch: 45 },
      { wch: 30 },
      { wch: 30 },
      { wch: 12 },
      { wch: 20 },
      { wch: 10 },
      { wch: 12 }
    ];
    ws['!cols'] = columnWidths;

    const headerStyle = {
      font: { bold: true, sz: 12 },
      fill: { fgColor: { rgb: "FFF0F0F0" } }
    };
    
    const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1'];
    headerCells.forEach(cellRef => {
      if (ws[cellRef]) {
        ws[cellRef].s = headerStyle;
      }
    });
    
    const dataRange = ws['!ref'];
    ws['!autofilter'] = { ref: dataRange };
    
    ws['!views'] = [{ state: 'frozen', ySplit: 1 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Calouros');

    const fileName = `calouros-${userCity}-${new Date().toISOString().split('T')[0]}.xlsx`;
    
    XLSX.writeFile(wb, fileName);
  };

  // Função para salvar filtro
  const handleSaveFilter = async (filterName) => {
    try {
      console.log('💾 Salvando filtro:', filterName);
      
      const filterData = {
        name: filterName,
        filter_type: 'calouros',
        filters: filters,
        is_shared: false
      };

      console.log('📤 Enviando dados do filtro:', filterData);
      const response = await filterService.saveFilter(filterData);
      console.log('✅ Filtro salvo com sucesso:', response);
      
      await loadSavedFilters();
      
      toast.success('Filtro salvo com sucesso!');
      handleCloseModal();
    } catch (error) {
      console.error('🔴 Erro ao salvar filtro:', error);
      const errorMessage = error.message.includes('404') 
        ? 'Serviço de filtros temporariamente indisponível'
        : 'Erro ao salvar filtro';
      toast.error(errorMessage);
    }
  };

  // Função para carregar filtro
  const handleLoadFilter = async (filterId) => {
    try {
      console.log('🟡 Carregando filtro:', filterId);
      const filter = await filterService.loadFilter(filterId);
      
      if (filter && filter.filters) {
        setFilters(filter.filters);
        console.log('✅ Filtro aplicado com sucesso:', filter.name);
        toast.success(`Filtro "${filter.name}" carregado!`);
      }
    } catch (error) {
      console.error('🔴 Erro ao carregar filtro:', error);
      const errorMessage = error.message.includes('404')
        ? 'Filtro não encontrado'
        : 'Erro ao carregar filtro';
      toast.error(errorMessage);
    }
  };

  // Função para excluir filtro
  const handleDeleteFilter = async (filterId, filterName) => {
    if (!window.confirm(`Tem certeza que deseja excluir o filtro "${filterName}"?`)) return;

    try {
      await filterService.deleteFilter(filterId);
      console.log('✅ Filtro excluído com sucesso');
      
      await loadSavedFilters();
      
      toast.success('Filtro excluído com sucesso!');
    } catch (error) {
      console.error('🔴 Erro ao excluir filtro:', error);
      const errorMessage = error.message.includes('404')
        ? 'Filtro não encontrado'
        : 'Erro ao excluir filtro';
      toast.error(errorMessage);
    }
  };

  const handleOpenSaveModal = () => {
    const isFilterActive = filters.cursos.length > 0 || 
                          filters.universidades.length > 0 || 
                          filters.unidades.length > 0 || 
                          filters.chamadas.length > 0;
    
    if (!isFilterActive) {
      toast.warning('Aplique alguns filtros antes de salvar!');
      return;
    }
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Estados de loading e error
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600 mb-4">
          <h3 className="text-lg font-semibold">Erro ao carregar dados</h3>
          <p>{error}</p>
        </div>
        <button 
          onClick={refetch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!userCity) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-yellow-600 mb-4">
          <h3 className="text-lg font-semibold">Configuração necessária</h3>
          <p>Você precisa configurar uma cidade para sua república para visualizar os dados.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/config'}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Configurar República
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Indicador de atualização */}
      {isRefreshing && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Atualizando dados...
          </div>
        </div>
      )}

      {/* Filtros e Tabela */}
      <div className="space-y-6">
        <FilterBar 
          filters={filters}
          setFilters={setFilters}
          onSaveFilter={handleOpenSaveModal}
          onExportSheet={handleExportSheet}
          onLoadFilter={handleLoadFilter}
          onDeleteFilter={handleDeleteFilter}
          savedFilters={savedFilters}
          isLoadingFilters={isLoadingFilters}
          filterOptions={filterOptions}
          userData={userData}
          republicType={republicType}
          filteredStudents={filteredStudents}
        />
        
        <StudentTable 
          students={paginationData.currentItems}
          pagination={{
            currentPage: paginationData.currentPage,
            totalPages: paginationData.totalPages,
            totalItems: paginationData.totalItems,
            itemsPerPage,
            startIndex: paginationData.startIndex,
            endIndex: paginationData.endIndex,
            hasPrevious: paginationData.hasPrevious,
            hasNext: paginationData.hasNext,
            onPageChange: setCurrentPage,
            onItemsPerPageChange: setItemsPerPage
          }}
          onToggleFavorite={handleToggleFavorite}
          onStatusChange={handleStatusChange}
        />
      </div>

      <SaveFilterModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveFilter}
      />
    </>
  );
};

export default DashboardSection;
