import React, { useState, useEffect } from 'react';
import { 
  FiFilter, 
  FiMoreVertical, 

  FiEdit2, 
  FiTrash2,
  FiInbox,
  FiX,
  FiAlertTriangle,
  FiStar,
  FiLock,
  FiRefreshCw
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { filterService } from '../../../services/filterService';
import { toast } from 'react-toastify';

/**
 * Componente de Bloqueio para Planos Free
 */
const FreePlanBlock = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <FiLock className="w-8 h-8 text-yellow-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Funcionalidade Premium
        </h2>
        
        <p className="text-gray-600 mb-6">
          Os <strong>Filtros Salvos</strong> estão disponíveis apenas para planos 
          <span className="text-green-600 font-semibold"> Veterano</span> e <span className="text-purple-600 font-semibold"> Veterano Mor</span>.
          <br />
         
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">O que você ganha com os planos pagos:</h3>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li className="flex items-center">
              <FiStar className="w-4 h-4 mr-2 text-green-500" />
              Filtros personalizados ilimitados
            </li>
            <li className="flex items-center">
              <FiStar className="w-4 h-4 mr-2 text-green-500" />
              Exportar os dados em CSV
            </li>
            <li className="flex items-center">
              <FiStar className="w-4 h-4 mr-2 text-green-500" />
              Acesso a dados completos das chamadas
            </li>
            <li className="flex items-center">
              <FiStar className="w-4 h-4 mr-2 text-green-500" />
              Estatísticas avançadas
            </li>
          </ul>
        </div>
        
        <button
          onClick={() => navigate('/planos')}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Ver Planos e Fazer Upgrade
        </button>
      </div>
    </div>
  );
};

/**
 * 1. Componente de Card para cada Filtro Salvo
 */
const FilterCard = ({ filter, onLoad, onEdit, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Função para formatar os critérios do filtro
  const formatCriteria = (criteria) => {
    if (!criteria) return ['Sem critérios específicos'];
    
    const tags = [];
    
    // Critérios do filtro real da API
    if (criteria.gender && criteria.gender !== 'Todos') {
      tags.push(`Gênero: ${criteria.gender}`);
    }
    
    if (criteria.cursos && criteria.cursos.length > 0) {
      tags.push(`Cursos (${criteria.cursos.length})`);
    }
    
    if (criteria.universidades && criteria.universidades.length > 0) {
      tags.push(`Universidades (${criteria.universidades.length})`);
    }
    
    if (criteria.unidades && criteria.unidades.length > 0) {
      tags.push(`Unidades (${criteria.unidades.length})`);
    }
    
    if (criteria.chamadas && criteria.chamadas.length > 0) {
      tags.push(`Chamadas (${criteria.chamadas.length})`);
    }
    
    if (tags.length === 0) return ['Sem critérios específicos'];
    return tags;
  };

  const criteriaTags = formatCriteria(filter.filters);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 bg-gray-900 text-white p-3 rounded-full">
              <FiFilter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 break-words">
                {filter.name}
              </h3>
              {filter.filter_type && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {filter.filter_type}
                </span>
              )}
            </div>
          </div>

          {/* Menu Kebab */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onBlur={() => setTimeout(() => setIsMenuOpen(false), 150)}
              className="p-1 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <FiMoreVertical className="w-5 h-5" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 z-10 w-48 mt-1 bg-white rounded-md shadow-xl border border-gray-200 py-1">
              
                <button
                  onClick={() => { onEdit(filter); setIsMenuOpen(false); }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiEdit2 className="w-4 h-4 mr-3" />
                  Editar
                </button>
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
            {criteriaTags.map((tag, index) => (
              <span 
                key={index} 
                className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Data de criação */}
        {filter.created_at && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Criado em: {new Date(filter.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 2. Componente de Estado Vazio (UX)
 */
const EmptyState = ({ onRefresh }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-lg shadow-sm border border-gray-200 border-dashed">
      <div className="bg-gray-100 p-4 rounded-full">
        <FiInbox className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">
        Nenhum filtro salvo
      </h3>
      <p className="mt-1 text-gray-600 mb-4">
        Você ainda não salvou nenhum filtro. Tente salvar uma
        combinação na tela 'Painel' para que ela apareça aqui.
      </p>
   
    </div>
  );
};

/**
 * 3. Modal de Edição
 */
const EditFilterModal = ({ isOpen, onClose, onConfirm, filter }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (filter) {
      setName(filter.name);
    }
  }, [filter]);

  if (!isOpen || !filter) return null;

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Digite um nome para o filtro');
      return;
    }
    onConfirm(filter.id, name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Editar Filtro</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
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
            placeholder="Digite o nome do filtro"
          />
        </div>
        
        <div className="flex items-center justify-end p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
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
 * 4. Modal de Confirmação de Exclusão
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
 */
const FiltrosSection = ({ userData }) => {
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({ type: null, filter: null });

  const { isFree, isBasic, isPremium } = useAuth();

  // Verificar se o usuário é free
  const userIsFree = isFree();
  const userPlan = userData?.planType || 'free';

  console.log(`🔍 [FiltrosSection] Plano do usuário: ${userPlan}, É free: ${userIsFree}`);

  // Carregar filtros do usuário
  const loadFilters = async () => {
    if (userIsFree) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🟡 Carregando filtros do usuário...');
      const userFilters = await filterService.getUserFilters();
      console.log(`✅ ${userFilters.length} filtros carregados da API`);
      setFilters(userFilters);
    } catch (error) {
      console.error('🔴 Erro ao carregar filtros:', error);
      toast.error('Erro ao carregar filtros salvos');
      setFilters([]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar filtros quando o componente montar
  useEffect(() => {
    loadFilters();
  }, [userIsFree]);

 
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

  const handleConfirmEdit = async (filterId, newName) => {
    try {
      console.log("🟡 Editando filtro:", filterId, "com novo nome:", newName);
      
      await filterService.updateFilter(filterId, { name: newName });
      
      // Atualizar a lista local
      setFilters(prevFilters =>
        prevFilters.map(f => (f.id === filterId ? { ...f, name: newName } : f))
      );
      
      toast.success('Filtro atualizado com sucesso!');
      handleCloseModal();
    } catch (error) {
      console.error('🔴 Erro ao editar filtro:', error);
      toast.error('Erro ao editar filtro');
    }
  };
  
  const handleConfirmDelete = async (filterId) => {
    try {
      console.log("🟡 Excluindo filtro:", filterId);
      
      await filterService.deleteFilter(filterId);
      
      // Atualizar a lista local
      setFilters(prevFilters => prevFilters.filter(f => f.id !== filterId));
      
      toast.success('Filtro excluído com sucesso!');
      handleCloseModal();
    } catch (error) {
      console.error('🔴 Erro ao excluir filtro:', error);
      toast.error('Erro ao excluir filtro');
    }
  };

  // Se o usuário for free, mostrar bloqueio
  if (userIsFree) {
    return <FreePlanBlock />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <FiRefreshCw className="w-6 h-6 text-gray-500 animate-spin mr-3" />
          <span className="text-gray-600">Carregando filtros...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header com contador */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Filtros Salvos</h1>
          <p className="text-gray-600">
            {filters.length} {filters.length === 1 ? 'filtro salvo' : 'filtros salvos'}
          </p>
        </div>
        <button
          onClick={loadFilters}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiRefreshCw className="w-4 h-4 mr-2" />
          Recarregar
        </button>
      </div>

      {/* Grid de Filtros ou Estado Vazio */}
      {filters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filters.map((filter) => (
            <FilterCard 
              key={filter.id}
              filter={filter}
           
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState onRefresh={loadFilters} />
      )}

      {/* Modais */}
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
