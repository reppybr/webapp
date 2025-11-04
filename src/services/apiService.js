// services/apiService.js
import { supabase } from '../lib/supabase';

// 🔥 USE A MESMA URL DO AUTHCONTEXT - CORRIGIDO
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api-umbb.onrender.com';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('🟡 [API Service] Inicializado com URL:', this.baseURL);
  }

  // 🔥 MÉTODO GETTOKEN IDÊNTICO AO QUE FUNCIONA NO AUTHCONTEXT
  async getToken() {
    try {
      // 🔥 FORMA OFICIAL E CORRETA DE OBTER A SESSÃO
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.warn('🟡 [API Service] Nenhuma sessão ativa encontrada');
        return null;
      }
      
      console.log('🟢 [API Service] Token obtido com sucesso');
      return session.access_token;
    } catch (error) {
      console.error('🔴 [API Service] Erro ao obter token:', error);
      return null;
    }
  }

  async request(endpoint, options = {}) {
    // 🔥 OBTER TOKEN PARA CADA REQUISIÇÃO
    const token = await this.getToken();
    
    console.log(`🟡 [API Service] Fazendo requisição para: ${this.baseURL}${endpoint}`);
    console.log(`🟡 [API Service] Token presente: ${!!token}`);
    console.log(`🟡 [API Service] Método: ${options.method || 'GET'}`);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // 🔥 CORRIGIR: SEMPRE converter body para JSON se for objeto
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      console.log(`🟡 [API Service] Status da resposta: ${response.status}`);
      console.log(`🟡 [API Service] URL completa: ${this.baseURL}${endpoint}`);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          const errorText = await response.text();
          errorData = { error: errorText || `HTTP error! status: ${response.status}` };
        }
        
        console.error(`🔴 [API Service] Erro HTTP ${response.status}:`, errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🟢 [API Service] Resposta recebida com sucesso');
      return data;
    } catch (error) {
      console.error(`🔴 [API Service] Erro em ${endpoint}:`, error);
      
      // 🔥 TRATAMENTO ESPECÍFICO PARA ERROS DE REDE
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      }
      
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // 🔥 MÉTODO EXTRA: HEALTH CHECK DA API
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      if (!response.ok) throw new Error('Health check failed');
      return await response.json();
    } catch (error) {
      console.error('🔴 Health check failed:', error);
      throw new Error('API não está respondendo');
    }
  }

  // 🔥 MÉTODO EXTRA: TESTE DE AUTENTICAÇÃO
  async testAuth() {
    try {
      const response = await this.get('/auth/me');
      console.log('🟢 Teste de autenticação bem-sucedido:', response);
      return response;
    } catch (error) {
      console.error('🔴 Teste de autenticação falhou:', error);
      throw error;
    }
  }
}

// 🔥 INSTÂNCIA ÚNICA (SINGLETON)
export const apiService = new ApiService();

// 🔥 EXPORTAÇÃO PARA TESTES DIRETOS (OPCIONAL)
export default apiService;
