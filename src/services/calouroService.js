// services/calouroService.js
import { apiService } from './apiService';

export const calouroService = {
  // Criar novo calouro
  async createCalouro(calouroData) {
    return await apiService.post('/calouros/', calouroData); // Remove o /calouros duplicado
  },

  // Buscar calouros selecionados (favoritos + funil)
  async getSelectedCalouros() {
    return await apiService.get('/calouros/selecionados');
  },

  // Listar todos os calouros com filtros
  async getCalouros(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        params.append(key, filters[key]);
      }
    });
    return await apiService.get(`/calouros?${params.toString()}`);
  },

  // Atualizar status do calouro
  async updateStatus(calouroId, statusData) {
    return await apiService.put(`/calouros/${calouroId}/status`, statusData);
  },

  // Atualizar favorito - CORRIGIDO: enviar apenas o valor booleano
  async updateFavorite(calouroId, favourite) {
    return await apiService.put(`/calouros/${calouroId}/favorite`, {
      favourite: favourite
    });
  },

  // Buscar estatísticas
  async getStatistics() {
    return await apiService.get('/calouros/estatisticas');
  }
};


