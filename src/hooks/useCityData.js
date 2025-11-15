// hooks/useCityData.js
// --- VERSÃO ATUALIZADA COM FILTRO DE GÊNERO ---

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';

/**
 * Hook ATUALIZADO para paginação e filtros no SERVIDOR com filtro automático de gênero.
 *
 * @param {number} page - A página atual (ex: 1, 2, 3)
 * @param {number} itemsPerPage - O limite de itens (ex: 50, 100)
 * @param {object} filters - O objeto de filtros (ex: { cursos: [], q: "joao" })
 * @param {object} userData - Dados do usuário para filtro automático de gênero
 */
export const useCityData = (page, itemsPerPage, filters, userData) => {
  const [cityData, setCityData] = useState(null);
  const [pagination, setPagination] = useState(null);
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
        planType,
        republicType: userData?.republica?.tipo || userData?.user_profile?.republica?.tipo
      });
      
      // --- CONSTRUÇÃO DE QUERY DINÂMICA COM FILTRO DE GÊNERO ---
      const params = new URLSearchParams({
        cidade: userCity,
        limit: itemsPerPage,
        page: page
      });
  
      console.log('🟡 [useCityData] Filtros recebidos:', filters);
  
      // 🔥 FILTRO AUTOMÁTICO: Gênero baseado no tipo da república
      const republicType = userData?.republica?.tipo || userData?.user_profile?.republica?.tipo;
      if (republicType === 'masculina') {
        params.append('genero', 'male');
        console.log('🔍 [useCityData] Aplicando filtro automático: apenas estudantes masculinos');
      } else if (republicType === 'feminina') {
        params.append('genero', 'female');
        console.log('🔍 [useCityData] Aplicando filtro automático: apenas estudantes femininos');
      } else {
        console.log('🔍 [useCityData] República mista - sem filtro automático de gênero');
      }
  
      // 🔥 CORREÇÃO: Agora envia TODOS os valores dos arrays
      if (filters) {
        if (filters.q) params.append('q', filters.q);
        
        // 🔥 ENVIA TODOS OS CURSOS SELECIONADOS
        if (filters.cursos && filters.cursos.length > 0) {
          filters.cursos.forEach(curso => {
            params.append('cursos', curso);
          });
        }
        
        // 🔥 ENVIA TODAS AS UNIVERSIDADES SELECIONADAS
        if (filters.universidades && filters.universidades.length > 0) {
          filters.universidades.forEach(universidade => {
            params.append('universidades', universidade);
          });
        }
        
        // 🔥 ENVIA TODAS AS UNIDADES SELECIONADAS
        if (filters.unidades && filters.unidades.length > 0) {
          filters.unidades.forEach(unidade => {
            params.append('unidades', unidade);
          });
        }
        
        // 🔥 ENVIA TODAS AS CHAMADAS SELECIONADAS
        if (filters.chamadas && filters.chamadas.length > 0) {
          filters.chamadas.forEach(chamada => {
            params.append('chamadas', chamada.toString());
          });
        }
  
        // 🔥 Filtro de status (aplicado no frontend)
        if (filters.status && filters.status.length > 0) {
          console.log('🔍 [useCityData] Filtro de status será aplicado no frontend:', filters.status);
        }
      }
  
      console.log(`🟡 [useCityData] Parâmetros finais:`, params.toString());
      
      let endpoint;
      if (planType === 'free') {
        endpoint = `/api/v1/calouros/chamada1?${params.toString()}`;
        console.log('🔍 [useCityData] Usando endpoint FREE (chamada1)');
      } else {
        endpoint = `/api/v1/calouros/completo?${params.toString()}`;
        console.log('🔍 [useCityData] Usando endpoint PAGO (completo)');
      }
  
      console.log(`🟡 [useCityData] Endpoint final: ${endpoint}`);
      
      const response = await apiService.get(endpoint);
      
      if (response.error) {
        throw new Error(response.error);
      }
  
      const data = response.data || [];
      const apiPagination = response.pagination || { 
        total_items: data.length, 
        total_pages: 1, 
        current_page: 1, 
        limit: itemsPerPage 
      };
  
      // 🔥 DEBUG: Informações sobre o filtro aplicado
      console.log(`✅ [useCityData] ${data.length} calouros carregados (Total: ${apiPagination.total_items})`, {
        republicType: republicType,
        filtroGenero: republicType === 'masculina' ? 'male' : republicType === 'feminina' ? 'female' : 'todos',
        cidade: userCity,
        cursosFiltrados: filters.cursos || [],
        universidadesFiltradas: filters.universidades || [],
        unidadesFiltradas: filters.unidades || [],
        chamadasFiltradas: filters.chamadas || []
      });
      
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
  }, [userCity, planType, isAuthenticated, session, page, itemsPerPage, filters, userData]);

  useEffect(() => {
    fetchCityData();
  }, [fetchCityData]);

  // Informações de acesso para debug
  const accessInfo = {
    userCity,
    planType,
    republicType: userData?.republica?.tipo || userData?.user_profile?.republica?.tipo,
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