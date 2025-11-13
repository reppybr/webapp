import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useCityData } from '../../../hooks/useCityData';
import StudentTable from './dashboard/StudentTable';
import FilterBar from './dashboard/FilterBar';
import SaveFilterModal from './dashboard/SaveFilterModal';
import { calouroService } from '../../../services/calouroService';
import { filterService } from '../../../services/filterService';
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

const DashboardSection = ({ userData, navigationState }) => {
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  // Estado para filtros
  const [filters, setFilters] = useState({
    q: '',
    cursos: [],      
    universidades: [], 
    unidades: [],      
    chamadas: [],
    status: []
  });

  // Estados de UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedFilters, setSavedFilters] = useState([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [studentsMetadata, setStudentsMetadata] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs para controle de execução
  const hasLoadedNavigationFilter = useRef(false);
  const filtersRef = useRef(filters);
  const studentsMetadataRef = useRef(studentsMetadata);
  const studentsRef = useRef([]);

  // Atualizar refs quando estados mudarem
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    studentsMetadataRef.current = studentsMetadata;
  }, [studentsMetadata]);

  // Hook de dados da cidade
  const { 
    cityData,          
    pagination: apiPagination, 
    loading, 
    error, 
    userCity, 
    accessInfo, 
    refetch 
  } = useCityData(currentPage, itemsPerPage, filters);

  // 🔥 EFEITO CORRIGIDO: Carregar filtro da navegação UMA VEZ
  useEffect(() => {
    if (navigationState?.loadedFilter && !hasLoadedNavigationFilter.current) {
      const { loadedFilter, filterName } = navigationState;
      
      try {
        console.log('🟡 Carregando filtro da navegação:', filterName);
        
        if (loadedFilter.filters) {
          const filtersWithDefaults = {
            q: '',
            cursos: [],
            universidades: [],
            unidades: [],
            chamadas: [],
            status: [],
            ...loadedFilter.filters
          };
          
          setFilters(filtersWithDefaults);
          setCurrentPage(1);
          hasLoadedNavigationFilter.current = true;
          console.log('✅ Filtro carregado silenciosamente');
        }
      } catch (error) {
        console.error('🔴 Erro ao carregar filtro da navegação:', error);
      }
    }
  }, [navigationState]);

  // 🔥 FUNÇÃO OTIMIZADA: Carregar filtros salvos
  const loadSavedFilters = useCallback(async () => {
    try {
      setIsLoadingFilters(true);
      const userFilters = await filterService.getUserFilters();
      setSavedFilters(userFilters);
    } catch (error) {
      console.error('🔴 Erro ao carregar filtros:', error);
    } finally {
      setIsLoadingFilters(false);
    }
  }, []);

  // Carregar filtros quando o componente montar
  useEffect(() => {
    loadSavedFilters();
  }, [loadSavedFilters]);

  // 🔥 FUNÇÃO OTIMIZADA: Recarregar dados
  const refreshCalourosData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('🔴 Erro ao atualizar dados:', error);
      toast.error('Erro ao atualizar dados');
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  // 🔥 FUNÇÃO OTIMIZADA: Criar chave do estudante
  const createStudentKey = useCallback((name, course, university, campus) => {
    return `${normalizeString(name)}-${normalizeString(course)}-${normalizeString(university)}-${normalizeString(campus)}`;
  }, []);

  // 🔥 EFEITO OTIMIZADO: Carregar favoritos e status
  useEffect(() => {
    const loadFavoritesAndStatus = async () => {
      if (!cityData || cityData.length === 0) return;

      try {
        const calourosResponse = await calouroService.getSelectedCalouros();
        const calouros = calourosResponse.calouros || [];

        const statusDisplayMap = {
          'pending': 'Nenhum',
          'contacted': 'Chamado', 
          'approved': 'Sucesso',
          'rejected': 'Rejeitado'
        };

        const metadata = {};

        calouros.forEach(calouro => {
          const studentKey = createStudentKey(
            calouro.name,
            calouro.course,
            calouro.university,
            calouro.campus
          );
          
          metadata[studentKey] = {
            isFavorited: calouro.favourite || false,
            status: statusDisplayMap[calouro.status] || 'Nenhum',
            dbId: calouro.id
          };
        });

        setStudentsMetadata(metadata);
      } catch (err) {
        console.error('🔴 Erro ao carregar favoritos e status:', err);
      }
    };

    loadFavoritesAndStatus();
  }, [cityData, createStudentKey]);

  // 🔥 MEMO OTIMIZADO: Converter estudantes da API
  const students = useMemo(() => {
    if (!cityData) return [];

    const genderMap = { 
      'male': 'Masculino', 
      'female': 'Feminino', 
      'other': 'Outro' 
    };

    const convertedStudents = cityData.map((student, index) => {
      const studentName = student.name;
      const studentCourse = student.course;
      const studentUniversity = student.university;
      const studentCampus = student.unidade;

      const studentKey = createStudentKey(
        studentName,
        studentCourse,
        studentUniversity,
        studentCampus
      );
      
      const metadata = studentsMetadata[studentKey] || {};

      return {
        id: metadata.dbId || `temp-${index}`,
        nome: studentName,
        chamada: student.chamada,
        curso: studentCourse,
        universidade: studentUniversity,
        unidade: studentCampus,
        genero: genderMap[student.genero] || 'Outro',
        cidade: student.cidade,
        remanejado: student.remanejado || false,
        isFavorited: metadata.isFavorited || false,
        status: metadata.status || 'Nenhum',
        originalData: {
          name: studentName,
          course: studentCourse,
          university: studentUniversity,
          campus: studentCampus,
          gender: student.genero,
          entrance_year: new Date().getFullYear()
        },
        // 🔥 ADICIONADO: Chave para otimismo
        _key: studentKey
      };
    });

    // 🔥 ATUALIZAR REF DOS STUDENTS
    studentsRef.current = convertedStudents;
    
    return convertedStudents;
  }, [cityData, studentsMetadata, createStudentKey]);

  // 🔥 MEMO OTIMIZADO: Aplicar filtros de cliente
  const filteredStudents = useMemo(() => {
    if (!filters.status || filters.status.length === 0) {
      return students;
    }
    
    return students.filter(student => filters.status.includes(student.status));
  }, [students, filters.status]);

  // 🔥 MEMO OTIMIZADO: Extrair opções de filtro
  const filterOptions = useMemo(() => {
    if (!students || students.length === 0) {
      return { 
        cursos: [], 
        universidades: [], 
        unidades: [], 
        chamadas: [],
        status: ['Nenhum', 'Chamado', 'Sucesso', 'Rejeitado']
      };
    }
  
    const cursos = [...new Set(students.map(s => s.curso).filter(Boolean))].sort();
    const universidades = [...new Set(students.map(s => s.universidade).filter(Boolean))].sort();
    const unidades = [...new Set(students.map(s => s.unidade).filter(Boolean))].sort();
    const chamadas = [...new Set(students.map(s => s.chamada).filter(Boolean))].sort((a, b) => a - b);
    const statusOptions = ['Nenhum', 'Chamado', 'Sucesso', 'Rejeitado'];
  
    return { cursos, universidades, unidades, chamadas, status: statusOptions };
  }, [students]);

  // Resetar para página 1 quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, itemsPerPage]);

  // 🔥🔥🔥 HANDLERS SUPER OTIMISTAS: Favoritos e Status
  const handleToggleFavorite = useCallback(async (studentId, isFavorited) => {
    // 🔥 ENCONTRAR STUDENT USANDO REF (INSTANTÂNEO)
    const student = studentsRef.current.find(s => s.id === studentId);
    if (!student) return;

    const studentKey = student._key;

    // 🔥 ATUALIZAÇÃO OTIMISTA IMEDIATA
    setStudentsMetadata(prev => ({
      ...prev,
      [studentKey]: {
        ...prev[studentKey],
        isFavorited: isFavorited
      }
    }));

    // 🔥 AÇÃO ASSÍNCRONA EM SEGUNDO PLANO (SEM ATRASAR A UI)
    setTimeout(async () => {
      try {
        const studentExistsInDb = !String(studentId).startsWith('temp-');
        let actualStudentId = studentId;

        if (studentExistsInDb) {
          await calouroService.updateFavorite(actualStudentId, isFavorited);
        } else if (isFavorited) {
          const createResponse = await calouroService.createCalouro({
            ...student.originalData,
            favourite: true,
            status: 'pending'
          });
          actualStudentId = createResponse.calouro_id;

          // Atualizar o ID no metadata
          setStudentsMetadata(prev => ({
            ...prev,
            [studentKey]: {
              ...prev[studentKey],
              dbId: actualStudentId,
              isFavorited: true
            }
          }));
        }

        console.log(`✅ Favorito atualizado no backend: ${student.nome}`);
      } catch (err) {
        console.error('🔴 Erro ao atualizar favorito no backend:', err);
        // 🔥 REVERTER SE FALHAR (OPCIONAL - O USUÁRIO PODE TENTAR NOVAMENTE)
        toast.error(`Erro ao ${isFavorited ? 'favoritar' : 'desfavoritar'} estudante`);
        
        // Reverter a UI em caso de erro
        setStudentsMetadata(prev => ({
          ...prev,
          [studentKey]: {
            ...prev[studentKey],
            isFavorited: !isFavorited
          }
        }));
      }
    }, 0);

    // 🔥 FEEDBACK VISUAL IMEDIATO (SEM ATRASO)
    toast.success(`Estudante ${isFavorited ? 'favoritado' : 'desfavoritado'} com sucesso!`);
  }, []);

  const handleStatusChange = useCallback(async (studentId, newStatus) => {
    // 🔥 ENCONTRAR STUDENT USANDO REF (INSTANTÂNEO)
    const student = studentsRef.current.find(s => s.id === studentId);
    if (!student) return;

    const studentKey = student._key;

    // 🔥 ATUALIZAÇÃO OTIMISTA IMEDIATA
    setStudentsMetadata(prev => ({
      ...prev,
      [studentKey]: {
        ...prev[studentKey],
        status: newStatus
      }
    }));

    // 🔥 AÇÃO ASSÍNCRONA EM SEGUNDO PLANO (SEM ATRASAR A UI)
    setTimeout(async () => {
      try {
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
          await calouroService.updateStatus(actualStudentId, { status: statusBackend });
        } else if (newStatus !== 'Nenhum') {
          const createResponse = await calouroService.createCalouro({
            ...student.originalData,
            favourite: student.isFavorited || false,
            status: statusBackend
          });
          actualStudentId = createResponse.calouro_id;

          // Atualizar o ID no metadata
          setStudentsMetadata(prev => ({
            ...prev,
            [studentKey]: {
              ...prev[studentKey],
              dbId: actualStudentId,
              status: newStatus
            }
          }));
        }

        console.log(`✅ Status atualizado no backend: ${student.nome} -> ${newStatus}`);
      } catch (err) {
        console.error('🔴 Erro ao atualizar status no backend:', err);
        // 🔥 REVERTER SE FALHAR
        toast.error('Erro ao atualizar status do estudante');
        
        // Reverter a UI em caso de erro
        setStudentsMetadata(prev => ({
          ...prev,
          [studentKey]: {
            ...prev[studentKey],
            status: student.status // Status anterior
          }
        }));
      }
    }, 0);

    // 🔥 FEEDBACK VISUAL IMEDIATO (SEM ATRASO)
    toast.success(`Status atualizado para "${newStatus}"`);
  }, []);

  // 🔥 HANDLERS OTIMIZADOS: Exportar e gerenciar filtros
  const handleExportSheet = useCallback(() => {
    if (!filteredStudents.length) {
      toast.warning('Nenhum dado para exportar!');
      return;
    }
    
    try {
      const dataToExport = filteredStudents.map(student => ({
        Nome: student.nome,
        Chamada: student.chamada,
        Curso: student.curso,
        Universidade: student.universidade,
        Unidade: student.unidade,
        Gênero: student.genero,
        Cidade: student.cidade || 'N/A',
        Favorito: student.isFavorited ? 'Sim' : 'Não',
        Status: student.status
      }));

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Calouros');

      const fileName = `calouros-${userCity}-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success('Planilha exportada com sucesso!');
    } catch (err) {
      console.error('🔴 Erro ao exportar planilha:', err);
      toast.error('Erro ao exportar planilha');
    }
  }, [filteredStudents, userCity]);

  const handleSaveFilter = useCallback(async (filterName) => {
    try {
      const filterData = {
        name: filterName,
        filter_type: 'calouros',
        filters: filtersRef.current,
        is_shared: false
      };

      await filterService.saveFilter(filterData);
      await loadSavedFilters();
      toast.success('Filtro salvo com sucesso!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('🔴 Erro ao salvar filtro:', error);
      const errorMessage = error.message.includes('404') 
        ? 'Serviço de filtros temporariamente indisponível'
        : 'Erro ao salvar filtro';
      toast.error(errorMessage);
    }
  }, [loadSavedFilters]);

  const handleLoadFilter = useCallback(async (filterId) => {
    try {
      const filter = await filterService.loadFilter(filterId);
      
      if (filter?.filters) {
        const filtersWithDefaults = {
          q: '',
          cursos: [],
          universidades: [],
          unidades: [],
          chamadas: [],
          status: [],
          ...filter.filters
        };
        
        setFilters(filtersWithDefaults);
        setCurrentPage(1);
        console.log('✅ Filtro carregado silenciosamente:', filter.name);
      }
    } catch (error) {
      console.error('🔴 Erro ao carregar filtro:', error);
      const errorMessage = error.message.includes('404')
        ? 'Filtro não encontrado'
        : 'Erro ao carregar filtro';
      toast.error(errorMessage);
    }
  }, []);

  const handleDeleteFilter = useCallback(async (filterId, filterName) => {
    if (!window.confirm(`Tem certeza que deseja excluir o filtro "${filterName}"?`)) return;

    try {
      await filterService.deleteFilter(filterId);
      await loadSavedFilters();
      toast.success('Filtro excluído com sucesso!');
    } catch (error) {
      console.error('🔴 Erro ao excluir filtro:', error);
      const errorMessage = error.message.includes('404')
        ? 'Filtro não encontrado'
        : 'Erro ao excluir filtro';
      toast.error(errorMessage);
    }
  }, [loadSavedFilters]);

  const handleOpenSaveModal = useCallback(() => {
    const isFilterActive = (filtersRef.current.cursos?.length > 0) || 
                           (filtersRef.current.universidades?.length > 0) || 
                           (filtersRef.current.unidades?.length > 0) || 
                           (filtersRef.current.chamadas?.length > 0) ||
                           (filtersRef.current.status?.length > 0) ||
                           (filtersRef.current.q && filtersRef.current.q !== '');
    
    if (!isFilterActive) {
      toast.warning('Aplique alguns filtros antes de salvar!');
      return;
    }
    
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleRefreshData = useCallback(() => {
    refreshCalourosData();
  }, [refreshCalourosData]);

  // Estados de loading e error
  if (loading && !cityData) {
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
          <p className="text-sm text-gray-600 mt-2">
            Cidade: {userCity || 'Não configurada'} | 
            Plano: {accessInfo.planType || 'N/A'}
          </p>
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
          onRefresh={handleRefreshData}
          savedFilters={savedFilters}
          isLoadingFilters={isLoadingFilters}
          filterOptions={filterOptions}
          userData={userData}
          filteredStudents={filteredStudents}
          accessInfo={accessInfo}
          republicType={accessInfo.republica_tipo || 'mista'}
        />
        
        <StudentTable 
          students={filteredStudents}
          pagination={apiPagination ? {
            currentPage: apiPagination.current_page,
            totalPages: apiPagination.total_pages,
            totalItems: apiPagination.total_items,
            itemsPerPage: apiPagination.limit,
            hasPrevious: apiPagination.current_page > 1,
            hasNext: apiPagination.current_page < apiPagination.total_pages,
            onPageChange: setCurrentPage,
            onItemsPerPageChange: setItemsPerPage
          } : null}
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

export default React.memo(DashboardSection);