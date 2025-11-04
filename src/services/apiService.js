 // services/apiService.js
import { supabase } from '../lib/supabase'; // 👈 1. IMPORTE O SUPABASE
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // 👇 2. SUBSTITUA ESTA FUNÇÃO
  async getToken() {
    try {
      // Esta é a forma correta e oficial de pegar a sessão
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        return session.access_token;
      }
      
      return null; // Nenhuma sessão ativa
    } catch (e) {
      console.error('Erro ao obter sessão do Supabase no ApiService:', e);
      return null;
    }
  }

  async request(endpoint, options = {}) {
    // O restante do arquivo continua igual...
    const token = await this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log(`🟡 [API] Fazendo requisição para: ${this.baseURL}${endpoint}`);
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Agora, puxe a mensagem de erro correta do backend
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`🔴 [API] Erro em ${endpoint}:`, error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
