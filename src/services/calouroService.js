// services/calouroService.js
import { apiService } from './apiService';

export const calouroService = {
  // Criar novo calouro
  async createCalouro(calouroData) {
    console.log('🟡 [CalouroService] Criando calouro:', calouroData.name);
    return await apiService.post('/calouros', calouroData);
  },

  // Buscar calouros selecionados (favoritos + funil)
  async getSelectedCalouros() {
    console.log('🟡 [CalouroService] Buscando calouros selecionados');
    return await apiService.get('/calouros/selecionados');
  },

  // Listar todos os calouros com filtros
  async getCalouros(filters = {}) {
    console.log('🟡 [CalouroService] Buscando calouros com filtros:', filters);
    
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        params.append(key, filters[key]);
      }
    });
    
    const queryString = params.toString();
    const endpoint = queryString ? `/calouros?${queryString}` : '/calouros';
    
    return await apiService.get(endpoint);
  },

  // Atualizar status do calouro
  async updateStatus(calouroId, statusData) {
    console.log(`🟡 [CalouroService] Atualizando status do calouro ${calouroId}:`, statusData);
    return await apiService.put(`/calouros/${calouroId}/status`, statusData);
  },

  // Atualizar favorito - CORRIGIDO: enviar apenas o valor booleano
  async updateFavorite(calouroId, favourite) {
    console.log(`🟡 [CalouroService] Atualizando favorito do calouro ${calouroId}:`, favourite);
    
    // 🔥 GARANTIR QUE É BOOLEANO
    const favouriteBoolean = Boolean(favourite);
    
    return await apiService.put(`/calouros/${calouroId}/favorite`, {
      favourite: favouriteBoolean
    });
  },

  // Buscar estatísticas
  async getStatistics() {
    console.log('🟡 [CalouroService] Buscando estatísticas');
    return await apiService.get('/calouros/estatisticas');
  },

  // 🔥 MÉTODO EXTRA: Buscar calouro por ID
  async getCalouroById(calouroId) {
    console.log(`🟡 [CalouroService] Buscando calouro por ID: ${calouroId}`);
    return await apiService.get(`/calouros/${calouroId}`);
  },

  // 🔥 MÉTODO EXTRA: Deletar calouro
  async deleteCalouro(calouroId) {
    console.log(`🟡 [CalouroService] Deletando calouro: ${calouroId}`);
    return await apiService.delete(`/calouros/${calouroId}`);
  }
};

export default calouroService;
