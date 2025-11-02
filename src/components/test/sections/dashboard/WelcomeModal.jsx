import React, { useState } from 'react';
import { FiMapPin, FiCheck } from 'react-icons/fi';
import { useLocation } from '../../../../hooks/useLocation';
import GenderSelector from './GenderSelector';

/**
 * Modal de configuração inicial (onboarding) para
 * definir o tipo e localização da república.
 */
const WelcomeModal = ({ onSubmit }) => {
  const { states, cities, loadingStates, loadingCities, fetchCities } = useLocation();

  const [selectedGender, setSelectedGender] = useState('Mista'); // Padrão
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Handler para quando o estado muda
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    setSelectedCity(''); // Reseta a cidade (UX)
    fetchCities(stateId); // Busca as novas cidades
  };

  // Handler para o submit
  const handleSubmit = () => {
    // Poderia adicionar validação aqui
    if (!selectedState || !selectedCity) {
      alert("Por favor, selecione seu estado e cidade.");
      return;
    }

    onSubmit({
      gender: selectedGender,
      state: selectedState, // Idealmente aqui seria o nome do estado
      city: selectedCity,   // Idealmente aqui seria o nome da cidade
    });
  };

  // UX: Desativa o botão de confirmar se não tiver selecionado tudo
  const isSubmitDisabled = !selectedState || !selectedCity || loadingCities;

  return (
    // 1. O Overlay (fundo escuro)
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      
      {/* 2. O Card do Modal */}
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-fade-in-up">
        
        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <FiMapPin className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-900">Bem-vindo(a)!</h2>
          <p className="text-gray-600 mt-1">
            Vamos começar configurando sua república.
          </p>
        </div>

        {/* Formulário */}
        <div className="space-y-6">
          
          {/* Seletor de Gênero */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minha república é:
            </label>
            <GenderSelector selected={selectedGender} onChange={setSelectedGender} />
          </div>

          {/* Seletor de Estado */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              Estado (UF)
            </label>
            <select
              id="state"
              value={selectedState}
              onChange={handleStateChange}
              disabled={loadingStates}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>
                {loadingStates ? 'Carregando estados...' : 'Selecione seu estado'}
              </option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.nome} ({state.sigla})
                </option>
              ))}
            </select>
          </div>

          {/* Seletor de Cidade */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              Cidade
            </label>
            <select
              id="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              // UX: Desativa se nenhum estado foi selecionado ou se as cidades estão carregando
              disabled={!selectedState || loadingCities}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>
                {loadingCities 
                  ? 'Carregando cidades...' 
                  : (selectedState ? 'Selecione sua cidade' : 'Selecione um estado primeiro')}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Botão de Confirmação */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`
              w-full flex items-center justify-center px-4 py-3 border border-transparent 
              text-base font-medium rounded-lg text-white 
              transition-colors
              ${isSubmitDisabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }
            `}
          >
            <FiCheck className="w-5 h-5 mr-2" />
            Confirmar e Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;