// hooks/useLocation.js
import { useState, useCallback } from 'react';

export const useLocation = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState(null);

  const fetchStates = useCallback(async () => {
    setLoadingStates(true);
    setError(null);
    
    try {
      const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar estados');
      }
      
      const data = await response.json();
      
      const formattedStates = data.map(state => ({
        id: state.id,
        nome: state.nome,
        sigla: state.sigla
      }));
      
      setStates(formattedStates);
      console.log(`✅ [LOCATION] ${formattedStates.length} estados carregados`);
      
    } catch (err) {
      console.error('🔴 [LOCATION] Erro ao buscar estados:', err);
      setError(err.message);
      
      // Fallback para dados mockados em caso de erro
      const MOCKED_STATES = [
        { id: 35, nome: 'São Paulo', sigla: 'SP' },
        { id: 33, nome: 'Rio de Janeiro', sigla: 'RJ' },
        { id: 31, nome: 'Minas Gerais', sigla: 'MG' }
      ];
      setStates(MOCKED_STATES);
      
    } finally {
      setLoadingStates(false);
    }
  }, []);

  const fetchCities = useCallback(async (stateId) => {
    if (!stateId) {
      setCities([]);
      return;
    }

    setLoadingCities(true);
    setError(null);
    setCities([]);

    try {
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar cidades');
      }
      
      const data = await response.json();
      
      const formattedCities = data.map(city => ({
        id: city.id,
        nome: city.nome
      }));
      
      setCities(formattedCities);
      console.log(`✅ [LOCATION] ${formattedCities.length} cidades carregadas para estado ${stateId}`);
      
    } catch (err) {
      console.error('🔴 [LOCATION] Erro ao buscar cidades:', err);
      setError(err.message);
      
      // Fallback para dados mockados em caso de erro
      const MOCKED_CITIES = {
        35: [ // SP
          { id: 3509502, nome: 'Campinas' },
          { id: 3526902, nome: 'Limeira' },
          { id: 3550308, nome: 'São Paulo' }
        ],
        33: [ // RJ
          { id: 3304557, nome: 'Rio de Janeiro' },
          { id: 3305109, nome: 'São Gonçalo' }
        ],
        31: [ // MG
          { id: 3106200, nome: 'Belo Horizonte' },
          { id: 3170206, nome: 'Uberlândia' }
        ]
      };
      
      const fallbackCities = MOCKED_CITIES[stateId] || [];
      setCities(fallbackCities);
      
    } finally {
      setLoadingCities(false);
    }
  }, []);

  return {
    states,
    cities,
    loadingStates,
    loadingCities,
    error,
    fetchStates,
    fetchCities,
  };
};