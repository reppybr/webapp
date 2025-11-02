import { apiService } from './apiService';

export const filterService = {
  // Salvar filtro
  async saveFilter(filterData) {
    return await apiService.post('/api/filtros/salvar', filterData);
  },

  // Listar filtros do usuário
  async getUserFilters() {
    const response = await apiService.get('/api/filtros/listar');
    return response.filtros || [];
  },

  // Carregar filtro específico
  async loadFilter(filterId) {
    return await apiService.get(`/api/filtros/carregar/${filterId}`);
  },

  // Excluir filtro
  async deleteFilter(filterId) {
    return await apiService.delete(`/api/filtros/excluir/${filterId}`);
  },

  // Editar filtro
  async updateFilter(filterId, updates) {
    return await apiService.put(`/api/filtros/editar/${filterId}`, updates);
  },

  // Carregar filtro compartilhado
  async loadSharedFilter(shareToken) {
    return await apiService.get(`/api/filtros/compartilhados/${shareToken}`);
  }
};