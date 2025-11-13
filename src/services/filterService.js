// services/filterService.js
import { apiService } from './apiService';

export const filterService = {
  // Salvar filtro
  async saveFilter(filterData) {
    try {
      const response = await apiService.post('/filtros/salvar', filterData);
      return response;
    } catch (error) {
      console.error('🔴 Erro ao salvar filtro:', error);
      throw new Error(error.message || 'Erro ao salvar filtro');
    }
  },

  // Listar filtros do usuário
  async getUserFilters() {
    try {
      const response = await apiService.get('/filtros/listar');
      return response.filtros || [];
    } catch (error) {
      console.error('🔴 Erro ao carregar filtros:', error);
      throw new Error(error.message || 'Erro ao carregar filtros');
    }
  },

  async loadFilter(filterId) {
    try {
      console.log('🟡 [filterService] Fazendo request para:', `/filtros/carregar/${filterId}`);
      const response = await apiService.get(`/filtros/carregar/${filterId}`);
      console.log('🟡 [filterService] Resposta recebida:', response);
      return response;
    } catch (error) {
      console.error('🔴 [filterService] Erro detalhado:', {
        message: error.message,
        stack: error.stack,
        response: error.response // se existir
      });
      throw new Error(error.message || 'Erro ao carregar filtro');
    }
  },

  // Excluir filtro
  async deleteFilter(filterId) {
    try {
      const response = await apiService.delete(`/filtros/excluir/${filterId}`);
      return response;
    } catch (error) {
      console.error('🔴 Erro ao excluir filtro:', error);
      throw new Error(error.message || 'Erro ao excluir filtro');
    }
  },

  // Editar filtro
  async updateFilter(filterId, updates) {
    try {
      const response = await apiService.put(`/filtros/editar/${filterId}`, updates);
      return response;
    } catch (error) {
      console.error('🔴 Erro ao editar filtro:', error);
      throw new Error(error.message || 'Erro ao editar filtro');
    }
  },

  // Carregar filtro compartilhado
  async loadSharedFilter(shareToken) {
    try {
      const response = await apiService.get(`/filtros/compartilhados/${shareToken}`);
      return response;
    } catch (error) {
      console.error('🔴 Erro ao carregar filtro compartilhado:', error);
      throw new Error(error.message || 'Erro ao carregar filtro compartilhado');
    }
  }
};

