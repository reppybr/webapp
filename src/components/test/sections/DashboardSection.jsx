// src/sections/DashboardSection.jsx

import React, { useState, useMemo } from 'react';
// Ajuste os caminhos se os componentes estiverem em subpastas
import StudentTable from './dashboard/StudentTable';
import FilterBar from './dashboard/FilterBar';
import SaveFilterModal from './dashboard/SaveFilterModal';
import { MOCK_STUDENTS } from './dashboard/mockData';

const DashboardSection = () => {
  // Lista mestre de alunos (vinda da API no futuro)
  const [students] = useState(MOCK_STUDENTS);

  // Estado unificado para todos os filtros
  const [filters, setFilters] = useState({
    gender: 'Todos',    
    cursos: [],       
    campi: [],       
    chamadas: [] // O estado está correto
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 'useMemo' recalcula a lista filtrada apenas quando os alunos ou os filtros mudam.
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // 1. Filtro de Gênero
      if (filters.gender !== 'Todos' && student.genero !== filters.gender) {
        return false;
      }
      
      // 2. Filtro de Cursos (Multi-select)
      if (filters.cursos.length > 0 && !filters.cursos.includes(student.curso)) {
        return false;
      }
      
      // 3. Filtro de Campus (Multi-select)
      if (filters.campi.length > 0 && !filters.campi.includes(student.campus)) {
        return false;
      }

      // --- CORREÇÃO AQUI ---
      // 4. Filtro de Chamadas (Multi-select)
      // Este bloco estava faltando!
      if (filters.chamadas.length > 0 && !filters.chamadas.includes(student.chamada)) {
        return false;
      }
      // --- FIM DA CORREÇÃO ---
      
      // Se passou por todos os filtros, inclui.
      return true;
    });
  }, [students, filters]); // 'filters' aqui já inclui 'chamadas', então está certo


  // --- O restante do seu componente (handlers do modal) ---

  const handleOpenSaveModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveFilter = (filterName) => {
    console.log('Salvando filtro:', {
      name: filterName,
      settings: filters 
    });
    handleCloseModal();
  };

  return (
    <>
      <div className="space-y-6">
        <FilterBar 
          filters={filters} 
          setFilters={setFilters} 
          onSaveFilter={handleOpenSaveModal} 
        />
        
        <StudentTable students={filteredStudents} />
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