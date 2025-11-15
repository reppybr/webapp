import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useCityData } from '../../../hooks/useCityData';
import StudentTable from './dashboard/StudentTable';
import FilterBar from './dashboard/FilterBar';
import SaveFilterModal from './dashboard/SaveFilterModal';
import { calouroService } from '../../../services/calouroService';
import { filterService } from '../../../services/filterService';
import { apiService } from '../../../services/apiService'; // Import já existente
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

  // Estado para opções de filtro
  const [filterOptions, setFilterOptions] = useState({
    cursos: [],
    universidades: [],
    unidades: [],
    chamadas: [], // Começa vazio, será preenchido pela API
    status: ['Nenhum', 'Chamado', 'Interessado', 'Sucesso', 'Rejeitado']
  });

  // Estado para controle de carregamento
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Refs para controle de execução
  const hasLoadedNavigationFilter = useRef(false);
  const hasLoadedFilterOptions = useRef(false);
  const filtersRef = useRef(filters);
  const studentsMetadataRef = useRef(studentsMetadata);
  const studentsRef = useRef([]);
  const abortControllerRef = useRef(null);

  // Atualizar refs
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
  } = useCityData(currentPage, itemsPerPage, filters, userData);

  // Carregar filtro da navegação
  useEffect(() => {
    if (navigationState?.loadedFilter && !hasLoadedNavigationFilter.current) {
      const { loadedFilter, filterName } = navigationState;
      try {
        console.log('🟡 Carregando filtro da navegação:', filterName);
        if (loadedFilter.filters) {
          const filtersWithDefaults = {
            q: '', cursos: [], universidades: [], unidades: [], chamadas: [], status: [],
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

  // Carregar filtros salvos
  const loadSavedFilters = useCallback(async () => {
    if (savedFilters.length > 0) return;
    try {
      setIsLoadingFilters(true);
      const userFilters = await filterService.getUserFilters();
      setSavedFilters(userFilters);
    } catch (error) {
      console.error('🔴 Erro ao carregar filtros:', error);
    } finally {
      setIsLoadingFilters(false);
    }
  }, [savedFilters.length]);

  useEffect(() => {
    if (initialLoadComplete) {
      loadSavedFilters();
    }
  }, [initialLoadComplete, loadSavedFilters]);

  // ===================================================================
  // 🔥 CORREÇÃO PRINCIPAL AQUI (useCallback de loadFilterOptions)
  // ===================================================================
  const loadFilterOptions = useCallback(async () => {
    if (!userCity || hasLoadedFilterOptions.current) return;

    try {
      console.log('🟡 Carregando opções de filtro para cidade:', userCity);
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      
      // 🔥 1. Adicionada a API de 'chamadas' ao Promise.all
      const [cursosRes, uniRes, unidadesRes, chamadasRes] = await Promise.all([
        apiService.get(`/api/v1/filtros/cursos?cidade=${userCity}`, {
          signal: abortControllerRef.current.signal
        }),
        apiService.get(`/api/v1/filtros/universidades?cidade=${userCity}`, {
          signal: abortControllerRef.current.signal
        }),
        apiService.get(`/api/v1/filtros/unidades?cidade=${userCity}`, {
          signal: abortControllerRef.current.signal
        }),
        // 🔥 A chamada que faltava:
        apiService.get(`/api/v1/filtros/chamadas?cidade=${userCity}`, {
          signal: abortControllerRef.current.signal
        })
      ]);

      // 🔥 2. Usar o resultado da API de 'chamadas', com um fallback robusto
      const chamadasOptions = chamadasRes.chamadas && chamadasRes.chamadas.length > 0
        ? chamadasRes.chamadas.sort((a, b) => a - b)
        : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Fallback estático

      setFilterOptions({
        cursos: cursosRes.cursos || [],
        universidades: uniRes.universidades || [],
        unidades: unidadesRes.unidades || [],
        chamadas: chamadasOptions, // <-- Correto
        status: ['Nenhum', 'Chamado', 'Interessado', 'Sucesso', 'Rejeitado']
      });

      hasLoadedFilterOptions.current = true;
      console.log('✅ Opções de filtro carregadas.');
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('🟡 Requisição de filtros cancelada');
        return;
      }
      
      console.error("🔴 Erro ao carregar opções de filtro:", error);
      
      // 🔥 3. Fallback em caso de erro (usa lista estática, não o cityData)
      setFilterOptions(prev => ({
        ...prev,
        cursos: [],
        universidades: [],
        unidades: [],
        chamadas: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Fallback estático
        status: ['Nenhum', 'Chamado', 'Interessado', 'Sucesso', 'Rejeitado']
      }));
      hasLoadedFilterOptions.current = true; // Marca como carregado mesmo com erro
    }
  // 🔥 4. Removida a dependência 'cityData' para evitar o bug
  }, [userCity]);
  // ===================================================================
  // FIM DA CORREÇÃO
  // ===================================================================

  // Carregar opções de filtro
  useEffect(() => {
    if (userCity && !hasLoadedFilterOptions.current) {
      loadFilterOptions();
    }
  }, [userCity, loadFilterOptions]);

  // Marcar carregamento inicial
  useEffect(() => {
    if (userCity && !initialLoadComplete) {
      setInitialLoadComplete(true);
    }
  }, [userCity, initialLoadComplete]);

  // Recarregar dados
  const refreshCalourosData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      // 🔥 NOVO: Forçar o recarregamento das opções de filtro
      hasLoadedFilterOptions.current = false;
      await loadFilterOptions();
      toast.success('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('🔴 Erro ao atualizar dados:', error);
      toast.error('Erro ao atualizar dados');
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, loadFilterOptions]); // Adicionado loadFilterOptions

  // Criar chave do estudante
  const createStudentKey = useCallback((name, course, university, campus) => {
    return `${normalizeString(name)}-${normalizeString(course)}-${normalizeString(university)}-${normalizeString(campus)}`;
  }, []);

  // Carregar favoritos e status
  const loadFavoritesAndStatus = useCallback(async () => {
    if (!cityData || cityData.length === 0) return;
    try {
      const calourosResponse = await calouroService.getSelectedCalouros();
      const calouros = calourosResponse.calouros || [];
      const statusDisplayMap = {
        'pending': 'Nenhum',
        'contacted': 'Chamado', 
        'interested': 'Interessado',
        'approved': 'Sucesso',
        'rejected': 'Rejeitado'
      };
      const metadata = {};
      calouros.forEach(calouro => {
        const studentKey = createStudentKey(calouro.name, calouro.course, calouro.university, calouro.campus);
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
  }, [cityData, createStudentKey]);

  useEffect(() => {
    if (cityData && cityData.length > 0) {
      loadFavoritesAndStatus();
    }
  }, [cityData, loadFavoritesAndStatus]);

  // Converter estudantes da API
  const students = useMemo(() => {
    if (!cityData) return [];
    const genderMap = { 'male': 'Masculino', 'female': 'Feminino', 'other': 'Outro' };
    const republicType = userData?.republica?.tipo || userData?.user_profile?.republica?.tipo;
    
    const filteredByGender = cityData.filter(student => {
      if (republicType === 'masculina') return student.genero === 'male';
      if (republicType === 'feminina') return student.genero === 'female';
      return true;
    });

    const convertedStudents = filteredByGender.map((student, index) => {
      const studentName = student.name;
      const studentCourse = student.course;
      const studentUniversity = student.university;
      const studentCampus = student.unidade;
      const studentKey = createStudentKey(studentName, studentCourse, studentUniversity, studentCampus);
      const metadata = studentsMetadata[studentKey] || {};

      return {
        id: metadata.dbId || `temp-${student.chamada}-${index}`,
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
          name: studentName, course: studentCourse, university: studentUniversity,
          campus: studentCampus, gender: student.genero, entrance_year: new Date().getFullYear()
        },
        _key: studentKey + `-${student.chamada}-${index}`
      };
    });
    studentsRef.current = convertedStudents;
    return convertedStudents;
  }, [cityData, studentsMetadata, createStudentKey, userData]);

  // Aplicar filtros de cliente
  const filteredStudents = useMemo(() => {
    if (!filters.status || filters.status.length === 0) {
      return students;
    }
    return students.filter(student => filters.status.includes(student.status));
  }, [students, filters.status]);

  // Resetar página
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.cursos, filters.universidades, filters.unidades, filters.chamadas, filters.q, itemsPerPage]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Handlers (Todos sem alteração)
  const handleToggleFavorite = useCallback(async (studentId, isFavorited) => {
    const student = studentsRef.current.find(s => s.id === studentId);
    if (!student) return;
    const studentKey = student._key;
    setStudentsMetadata(prev => ({ ...prev, [studentKey]: { ...prev[studentKey], isFavorited } }));
    setTimeout(async () => {
      try {
        const studentExistsInDb = !String(studentId).startsWith('temp-');
        let actualStudentId = studentId;
        if (studentExistsInDb) {
          await calouroService.updateFavorite(actualStudentId, isFavorited);
        } else if (isFavorited) {
          const createResponse = await calouroService.createCalouro({ ...student.originalData, favourite: true, status: 'pending' });
          actualStudentId = createResponse.calouro_id;
          setStudentsMetadata(prev => ({ ...prev, [studentKey]: { ...prev[studentKey], dbId: actualStudentId, isFavorited: true } }));
        }
        console.log(`✅ Favorito atualizado no backend: ${student.nome}`);
      } catch (err) {
        console.error('🔴 Erro ao atualizar favorito no backend:', err);
        toast.error(`Erro ao ${isFavorited ? 'favoritar' : 'desfavoritar'} estudante`);
        setStudentsMetadata(prev => ({ ...prev, [studentKey]: { ...prev[studentKey], isFavorited: !isFavorited } }));
      }
    }, 0);
    toast.success(`Estudante ${isFavorited ? 'favoritado' : 'desfavoritado'} com sucesso!`);
  }, []);

  const handleStatusChange = useCallback(async (studentId, newStatus) => {
    const student = studentsRef.current.find(s => s.id === studentId);
    if (!student) return;
    const studentKey = student._key;
    setStudentsMetadata(prev => ({ ...prev, [studentKey]: { ...prev[studentKey], status: newStatus } }));
    setTimeout(async () => {
      try {
        const statusMapping = {
          'Nenhum': 'pending', 'Chamado': 'contacted', 'Interessado': 'interested',
          'Sucesso': 'approved', 'Rejeitado': 'rejected'
        };
        const statusBackend = statusMapping[newStatus] || 'pending';
        const studentExistsInDb = !String(studentId).startsWith('temp-');
        let actualStudentId = studentId;
        if (studentExistsInDb) {
          await calouroService.updateStatus(actualStudentId, { status: statusBackend });
        } else if (newStatus !== 'Nenhum') {
          const createResponse = await calouroService.createCalouro({ ...student.originalData, favourite: student.isFavorited || false, status: statusBackend });
          actualStudentId = createResponse.calouro_id;
          setStudentsMetadata(prev => ({ ...prev, [studentKey]: { ...prev[studentKey], dbId: actualStudentId, status: newStatus } }));
        }
        console.log(`✅ Status atualizado no backend: ${student.nome} -> ${newStatus}`);
      } catch (err) {
        console.error('🔴 Erro ao atualizar status no backend:', err);
        toast.error('Erro ao atualizar status do estudante');
        setStudentsMetadata(prev => ({ ...prev, [studentKey]: { ...prev[studentKey], status: student.status } }));
      }
    }, 0);
    toast.success(`Status atualizado para "${newStatus}"`);
  }, []);

  const handleExportSheet = useCallback(() => {
    if (!filteredStudents.length) {
      toast.warning('Nenhum dado para exportar!');
      return;
    }
    try {
      const dataToExport = filteredStudents.map(student => ({
        Nome: student.nome, Chamada: student.chamada, Curso: student.curso,
        Universidade: student.universidade, Unidade: student.unidade, Gênero: student.genero,
        Cidade: student.cidade || 'N/A', Favorito: student.isFavorited ? 'Sim' : 'Não', Status: student.status
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
      const filterData = { name: filterName, filter_type: 'calouros', filters: filtersRef.current, is_shared: false };
      await filterService.saveFilter(filterData);
      await loadSavedFilters();
      toast.success('Filtro salvo com sucesso!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('🔴 Erro ao salvar filtro:', error);
      toast.error('Erro ao salvar filtro');
    }
  }, [loadSavedFilters]);

  const handleLoadFilter = useCallback(async (filterId) => {
    try {
      const filter = await filterService.loadFilter(filterId);
      if (filter?.filters) {
        const filtersWithDefaults = { q: '', cursos: [], universidades: [], unidades: [], chamadas: [], status: [], ...filter.filters };
        setFilters(filtersWithDefaults);
        setCurrentPage(1);
        console.log('✅ Filtro carregado silenciosamente:', filter.name);
      }
    } catch (error) {
      console.error('🔴 Erro ao carregar filtro:', error);
      toast.error('Erro ao carregar filtro');
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
      toast.error('Erro ao excluir filtro');
    }
  }, [loadSavedFilters]);

  const handleOpenSaveModal = useCallback(() => {
    const isFilterActive = (filtersRef.current.cursos?.length > 0) || (filtersRef.current.universidades?.length > 0) || (filtersRef.current.unidades?.length > 0) || (filtersRef.current.chamadas?.length > 0) || (filtersRef.current.status?.length > 0) || (filtersRef.current.q && filtersRef.current.q !== '');
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

  if (error && !cityData) { // Mostra erro fatal apenas se não houver dados antigos
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
          republicType={userData?.republica?.tipo || userData?.user_profile?.republica?.tipo}
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
          hasError={!!error} // Passa se houve um erro (mesmo que não fatal)
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