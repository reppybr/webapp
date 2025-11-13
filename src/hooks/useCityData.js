// hooks/useCityData.js
// --- VERSÃO ATUALIZADA ---

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';

/**
 * Hook ATUALIZADO para paginação e filtros no SERVIDOR.
 *
 * @param {number} page - A página atual (ex: 1, 2, 3)
 * @param {number} itemsPerPage - O limite de itens (ex: 50, 100)
 * @param {object} filters - O objeto de filtros (ex: { cursos: [], q: "joao" })
 */
export const useCityData = (page, itemsPerPage, filters) => {
  const [cityData, setCityData] = useState(null);
  const [pagination, setPagination] = useState(null); // Estado de paginação
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getUserCity, getPlanType, isAuthenticated, session } = useAuth();

  const userCity = getUserCity();
  const planType = getPlanType();

  const fetchCityData = useCallback(async () => {
    if (!userCity || !isAuthenticated()) {
      setLoading(false);
      setError('Cidade não configurada ou usuário não autenticado');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`🟡 [useCityData] Buscando dados...`, {
        page,
        itemsPerPage,
        filters,
        userCity,
        planType
      });
      
      // --- CONSTRUÇÃO DE QUERY DINÂMICA CORRIGIDA ---
      const params = new URLSearchParams({
        cidade: userCity,
        limit: itemsPerPage,
        page: page
      });
  
      console.log('🟡 [useCityData] Filtros recebidos:', filters);
  
      // CORREÇÃO: Remover duplicação usando apenas o primeiro valor
      if (filters) {
        if (filters.q) params.append('q', filters.q);
        
        // CORREÇÃO: Usar apenas o primeiro item de cada array
        if (filters.cursos && filters.cursos.length > 0) {
          // LIMPAR qualquer parâmetro 'curso' existente antes de adicionar
          params.delete('curso');
          params.append('curso', filters.cursos[0]);
        }
        
        if (filters.universidades && filters.universidades.length > 0) {
          params.delete('universidade');
          params.append('universidade', filters.universidades[0]);
        }
        
        if (filters.unidades && filters.unidades.length > 0) {
          params.delete('unidade');
          params.append('unidade', filters.unidades[0]);
        }
        
        if (filters.chamadas && filters.chamadas.length > 0) {
          params.delete('chamada');
          params.append('chamada', filters.chamadas[0]);
        }
      }
  
      console.log(`🟡 [useCityData] Parâmetros finais:`, params.toString());
      
      let endpoint;
      if (planType === 'free') {
        endpoint = `/api/v1/calouros/chamada1?${params.toString()}`;
      } else {
        endpoint = `/api/v1/calouros/completo?${params.toString()}`;
      }
  
      console.log(`🟡 [useCityData] Endpoint: ${endpoint}`);
      
      const response = await apiService.get(endpoint);
      
      if (response.error) {
        throw new Error(response.error);
      }

      const data = response.data || [];
      const apiPagination = response.pagination || { total_items: data.length, total_pages: 1, current_page: 1, limit: itemsPerPage };
      
      console.log(`✅ [useCityData] ${data.length} calouros carregados (Total: ${apiPagination.total_items})`);
      
      // Define os dados e a paginação vindos da API
      setCityData(data);
      setPagination(apiPagination);

    } catch (err) {
      console.error('🔴 [useCityData] Erro ao buscar dados:', err);
      setError(err.message || 'Erro ao carregar dados da cidade');
      setCityData(null); 
      setPagination(null);
    } finally {
      setLoading(false);
    }
  // O hook agora re-executa se a página, o limite ou os filtros mudarem
  }, [userCity, planType, isAuthenticated, session, page, itemsPerPage, filters]);


  useEffect(() => {
    fetchCityData();
  }, [fetchCityData]);

  // Informações de acesso para debug
  const accessInfo = {
    userCity,
    planType,
    hasAccess: !!userCity && isAuthenticated()
  };

  return {
    cityData,   // Apenas os dados (ex: 50-200 itens)
    pagination, // As informações de paginação (ex: total_items: 3678)
    loading,
    error,
    userCity,
    accessInfo,
    refetch: fetchCityData
  };
};