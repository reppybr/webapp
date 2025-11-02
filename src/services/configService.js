// services/configService.js
import { apiService } from './apiService';

export const configService = {
  // Atualizar configurações da república
  async updateRepublicConfig(configData) {
    return await apiService.put('/config/republic', configData);
  },

  // Buscar configurações atuais da república
  async getRepublicConfig() {
    return await apiService.get('/config/republic');
  },

  // Atualizar configurações de notificação do usuário
  async updateUserNotifications(notificationsData) {
    return await apiService.put('/config/notifications', notificationsData);
  },

  // Buscar configurações de notificação do usuário
  async getUserNotifications() {
    return await apiService.get('/config/notifications');
  },

  // Atualizar plano do usuário
  async updateUserPlan(planData) {
    return await apiService.put('/config/plan', planData);
  },

  // Buscar informações do plano atual
  async getUserPlan() {
    return await apiService.get('/config/plan');
  }
};