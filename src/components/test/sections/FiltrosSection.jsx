import React, { useState, useEffect } from 'react';
import { 
  FiFilter, 
  FiMoreVertical, 
  FiPlay,
  FiEdit2, 
  FiTrash2,
  FiInbox,
  FiX, // Ícone para fechar modais
  FiAlertTriangle // Ícone para o modal de exclusão
} from 'react-icons/fi';
// 1. Importar o useNavigate para o redirecionamento
import { useNavigate } from 'react-router-dom';

// --- DADOS MOCADOS ---
const MOCKED_FILTERS = [
  { 
    id: 1, 
    name: 'Engenharias - Campinas (1ª Chamada)', 
    criteria: { 
      gender: 'Todos', 
      cursos: ['Engenharia de Software', 'Engenharia Elétrica'], 
      campi: ['Campinas'], 
      chamadas: [1] 
    } 
  },
  { 
    id: 2, 
    name: 'Saúde (Feminino)', 
    criteria: { 
      gender: 'Feminino', 
      cursos: ['Medicina', 'Enfermagem'], 
      campi: [], 
      chamadas: [] 
    } 
  },
  { 
    id: 3, 
    name: 'Veteranos Limeira', 
    criteria: { 
      gender: 'Todos', 
      cursos: [], 
      campi: ['Limeira'], 
      chamadas: [2, 3] 
    } 
  },
];
// ---------------------


/**
 * 1. Componente de Card para cada Filtro Salvo
 * (Cores atualizadas e handlers de clique)
 */
const FilterCard = ({ filter, onLoad, onEdit, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatCriteria = (criteria) => {
    const tags = [];
    if (criteria.gender !== 'Todos') tags.push(`Gênero: ${criteria.gender}`);
    if (criteria.cursos.length > 0) tags.push(`Cursos (${criteria.cursos.length})`);
    if (criteria.campi.length > 0) tags.push(`Campus (${criteria.campi.length})`);
    if (criteria.chamadas.length > 0) tags.push(`Chamadas (${criteria.chamadas.length})`);
    if (tags.length === 0) return ['Sem critérios específicos'];
    return tags;
  };

  const criteriaTags = formatCriteria(filter.criteria);

  return (
    // Card com cores da paleta (fundo, borda)
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Ícone com a cor "Premium" (bg-gray-900) */}
            <div className="flex-shrink-0 bg-gray-900 text-white p-3 rounded-full">
              <FiFilter className="w-5 h-5" />
            </div>
            {/* Título com a cor "text-gray-900" */}
            <h3 className="text-lg font-semibold text-gray-900 break-words">
              {filter.name}
            </h3>
          </div>

          {/* Menu Kebab (UX) */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onBlur={() => setTimeout(() => setIsMenuOpen(false), 150)} // Delay para permitir o clique no dropdown
              className="p-1 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <FiMoreVertical className="w-5 h-5" />
            </button>

            {isMenuOpen && (
              <div 
                className="absolute right-0 z-10 w-48 mt-1 bg-white rounded-md shadow-xl border border-gray-200 py-1"
              >
                {/* 1. Botão CARREGAR (chama o handler 'onLoad') */}
                <button
                  onClick={() => { onLoad(filter); setIsMenuOpen(false); }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                >
                  <FiPlay className="w-4 h-4 mr-3" />
                  Carregar
                </button>
                {/* 2. Botão EDITAR (chama o handler 'onEdit') */}
                <button
                  onClick={() => { onEdit(filter); setIsMenuOpen(false); }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiEdit2 className="w-4 h-4 mr-3" />
                  Editar
                </button>
                {/* 3. Botão EXCLUIR (chama o handler 'onDelete') */}
                <button
                  onClick={() => { onDelete(filter); setIsMenuOpen(false); }}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <FiTrash2 className="w-4 h-4 mr-3" />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Detalhes do Filtro (Tags) */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Critérios Ativos
          </h4>
          <div className="flex flex-wrap gap-2">
            {criteriaTags.map(tag => (
              <span 
                key={tag} 
                className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Componente de Estado Vazio (UX)
 * (Cores atualizadas)
 */
const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-lg shadow-sm border border-gray-200 border-dashed">
      <div className="bg-gray-100 p-4 rounded-full">
        <FiInbox className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">
        Nenhum filtro salvo
      </h3>
      <p className="mt-1 text-gray-600">
        Você ainda não salvou nenhum filtro. Tente salvar uma
        combinação na tela 'Painel' para que ela apareça aqui.
      </p>
    </div>
  );
};


/**
 * 3. NOVO: Modal de Edição
 */
const EditFilterModal = ({ isOpen, onClose, onConfirm, filter }) => {
  const [name, setName] = useState('');

  // Preenche o input com o nome atual do filtro quando o modal abre
  useEffect(() => {
    if (filter) {
      setName(filter.name);
    }
  }, [filter]);

  if (!isOpen || !filter) return null;

  const handleSave = () => {
    onConfirm(filter.id, name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in-up">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Editar Filtro</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        {/* Corpo do Modal */}
        <div className="p-6 space-y-2">
          <label htmlFor="filterName" className="block text-sm font-medium text-gray-700">
            Nome do Filtro
          </label>
          <input
            type="text"
            id="filterName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        
        {/* Rodapé do Modal */}
        <div className="flex items-center justify-end p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            // AQUI A COR: Botão CTA Principal com o VERDE REPPY
            className="px-4 py-2 bg-[#1bff17] text-gray-900 rounded-md text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 4. NOVO: Modal de Confirmação de Exclusão
 */
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, filter }) => {
  if (!isOpen || !filter) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full animate-fade-in-up">
        <div className="p-6 text-center">
          <FiAlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">Excluir Filtro?</h3>
          <p className="text-gray-600 mt-2">
            Você tem certeza que deseja excluir o filtro <br/>
            <strong className="text-gray-800">"{filter.name}"</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Esta ação não pode ser desfeita.
          </p>
        </div>
        <div className="flex items-center justify-center p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(filter.id)}
            // UX: Botão de destruição deve ser VERMELHO
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
          >
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>
  );
};


/**
 * 5. Componente Principal da Seção
 * (Agora com gerenciamento de estado dos modais)
 */
const FiltrosSection = () => {
  const [filters, setFilters] = useState(MOCKED_FILTERS);
  
  // Estado para controlar os modais: { type: 'edit' | 'delete' | null, filter: objeto_do_filtro }
  const [modalState, setModalState] = useState({ type: null, filter: null });
  
  const navigate = useNavigate();

  // --- Handlers para Ações ---

  const handleLoad = (filter) => {
    console.log("Carregar filtro:", filter.name);
    // Lógica futura: passar o ID do filtro ou os critérios pela URL/estado
    // Ex: navigate('/dashboard', { state: { loadFilter: filter.criteria } });
    navigate('/dashboard'); // Redireciona como pedido
  };
  
  const handleEdit = (filter) => {
    console.log("Abrir modal de edição para:", filter.name);
    setModalState({ type: 'edit', filter: filter });
  };
  
  const handleDelete = (filter) => {
    console.log("Abrir modal de exclusão para:", filter.name);
    setModalState({ type: 'delete', filter: filter });
  };

  const handleCloseModal = () => {
    setModalState({ type: null, filter: null });
  };

  // --- Handlers de Confirmação dos Modais ---

  const handleConfirmEdit = (filterId, newName) => {
    console.log("Salvando:", filterId, "com novo nome:", newName);
    // Simulação da edição:
    setFilters(prevFilters =>
      prevFilters.map(f => (f.id === filterId ? { ...f, name: newName } : f))
    );
    handleCloseModal();
  };
  
  const handleConfirmDelete = (filterId) => {
    console.log("Excluindo:", filterId);
    // Simulação da exclusão:
    setFilters(prevFilters => prevFilters.filter(f => f.id !== filterId));
    handleCloseModal();
  };

  return (
    // Fundo da página da paleta (bg-gray-50)
    <div className="bg-gray-50 min-h-full">
      {/* 1. Cabeçalho (Cores atualizadas) */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Filtros Salvos</h2>
        <p className="mt-1 text-lg text-gray-600">
          Gerencie e carregue seus filtros personalizados.
        </p>
      </div>
      
      {/* 2. Grid de Filtros ou Estado Vazio */}
      {filters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filters.map((filter) => (
            <FilterCard 
              key={filter.id}
              filter={filter}
              onLoad={handleLoad}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* 3. Renderização dos Modais (eles ficam invisíveis até serem ativados) */}
      <EditFilterModal
        isOpen={modalState.type === 'edit'}
        onClose={handleCloseModal}
        onConfirm={handleConfirmEdit}
        filter={modalState.filter}
      />
      
      <DeleteConfirmationModal
        isOpen={modalState.type === 'delete'}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        filter={modalState.filter}
      />
    </div>
  );
};

export default FiltrosSection;
