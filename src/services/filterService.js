// services/filterService.js
import { apiService } from './apiService';

export const filterService = {
  // Salvar filtro
  async saveFilter(filterData) {
    try {
      const response = await apiService.post('/api/filtros/salvar', filterData);
      return response;
    } catch (error) {
      console.error('🔴 Erro ao salvar filtro:', error);
      throw new Error(error.message || 'Erro ao salvar filtro');
    }
  },

  // Listar filtros do usuário
  async getUserFilters() {
    try {
      const response = await apiService.get('/api/filtros/listar');
      return response.filtros || [];
    } catch (error) {
      console.error('🔴 Erro ao carregar filtros:', error);
      throw new Error(error.message || 'Erro ao carregar filtros');
    }
  },

  // Carregar filtro específico
  async loadFilter(filterId) {
    try {
      const response = await apiService.get(`/api/filtros/carregar/${filterId}`);
      return response;
    } catch (error) {
      console.error('🔴 Erro ao carregar filtro:', error);
      throw new Error(error.message || 'Erro ao carregar filtro');
    }
  },

  // Excluir filtro
  async deleteFilter(filterId) {
    try {
      const response = await apiService.delete(`/api/filtros/excluir/${filterId}`);
      return response;
    } catch (error) {
      console.error('🔴 Erro ao excluir filtro:', error);
      throw new Error(error.message || 'Erro ao excluir filtro');
    }
  },

  // Editar filtro
  async updateFilter(filterId, updates) {
    try {
      const response = await apiService.put(`/api/filtros/editar/${filterId}`, updates);
      return response;
    } catch (error) {
      console.error('🔴 Erro ao editar filtro:', error);
      throw new Error(error.message || 'Erro ao editar filtro');
    }
  },

  // Carregar filtro compartilhado
  async loadSharedFilter(shareToken) {
    try {
      const response = await apiService.get(`/api/filtros/compartilhados/${shareToken}`);
      return response;
    } catch (error) {
      console.error('🔴 Erro ao carregar filtro compartilhado:', error);
      throw new Error(error.message || 'Erro ao carregar filtro compartilhado');
    }
  }
};
