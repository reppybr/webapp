// services/statsService.js
import { apiService } from './apiService';

class StatsService {
  async getMyFunnelStats() {
    return apiService.get('/stats/my-funnel-stats');
  }

  async getMarketPulse() {
    return apiService.get('/stats/pulse');
  }

  async getHotLeads() {
    return apiService.get('/stats/hot-leads');
  }

  async getHiddenOpportunities() {
    return apiService.get('/stats/hidden-opportunities');
  }

  async getCourseRadar() {
    return apiService.get('/stats/course-radar');
  }

  async getBenchmark() {
    return apiService.get('/stats/benchmark');
  }

  async getActivityHeatmap() {
    return apiService.get('/stats/activity-heatmap');
  }

  async getGenderCompetition() {
    return apiService.get('/stats/gender-competition');
  }

  async getMemberRanking() {
    return apiService.get('/stats/member-ranking');
  }
}

export const statsService = new StatsService();