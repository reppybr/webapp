import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useCityData = () => {
  const { getUserCity, fetchCityData, getPlanType, isFree, isBasic, isPremium } = useAuth();
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userCity = getUserCity();
  const planType = getPlanType();

  const loadCityData = async () => {
    if (!userCity) {
      setError('Nenhuma cidade configurada para este usuário');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchCityData(userCity);
      
      if (data) {
        setCityData(data);
      } else {
        setError('Não foi possível carregar os dados da cidade');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userCity) {
      loadCityData();
    }
  }, [userCity, planType]); // Recarrega quando a cidade ou plano mudar

  // Método para forçar recarregamento
  const refetch = () => {
    loadCityData();
  };

  // Informações sobre o que o usuário pode acessar
  const accessInfo = {
    canSeeAllData: !isFree(),
    canSeeChamada1: true, // Todos podem ver chamada 1
    canSeeCompleteData: isBasic() || isPremium(),
    dataSource: isFree() ? 'chamada1' : 'completo',
    planType,
    userCity
  };

  return {
    cityData,
    loading,
    error,
    refetch,
    userCity,
    accessInfo
  };
};