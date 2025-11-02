import React, { useState, useEffect } from 'react';
import { 
  FiMapPin, 
  FiUsers, 
  FiUser, 
  FiUserCheck, 
  FiUserPlus, 
  FiLock,
  FiBell,
  FiTrash2,
  FiStar,
  FiCheckCircle
} from 'react-icons/fi';
// 1. Importar o hook de localização
import { useLocation } from '../../../hooks/useLocation';

// --- DADOS MOCADOS ---
// Simula os dados salvos no localStorage pelo WelcomeModal
// (do nosso hook useLocation.js)
const MOCKED_REP_CONFIG = {
  gender: 'Mista',
  state: 'São Paulo', // O modal salvaria o NOME
  city: 'Campinas',    // O modal salvaria o NOME
  name: 'República Bixos 2025' // Um nome de exemplo
};

// Mock para o plano atual do usuário
const MOCKED_CURRENT_PLAN = 'Veterano'; // Opções: 'Bixo', 'Veterano', 'Veterano Mor'
// ---------------------

/**
 * Componente Seletor de Gênero (Reutilizado do WelcomeModal)
 */
const GenderSelector = ({ selected, onChange }) => {
  const options = [
    { label: 'Mista', value: 'Mista', icon: FiUsers },
    { label: 'Feminina', value: 'Feminina', icon: FiUser },
    { label: 'Masculina', value: 'Masculina', icon: FiUserCheck },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 bg-gray-100 rounded-lg p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={(e) => { e.preventDefault(); onChange(option.value); }}
          className={`flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all
            ${selected === option.value
              ? 'bg-white text-gray-900 shadow-md transform scale-105' // Destaque na cor premium
              : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }
          `}
        >
          <option.icon className="w-5 h-5 mb-1" />
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
};


/**
 * Componente da seção "Configurações"
 */
const Config = () => {
  // Estado para os campos do formulário (sem alteração)
  const [repName, setRepName] = useState(MOCKED_REP_CONFIG.name);
  const [repGender, setRepGender] = useState(MOCKED_REP_CONFIG.gender);
  const [repCity, setRepCity] = useState(MOCKED_REP_CONFIG.city);
  const [repState, setRepState] = useState(MOCKED_REP_CONFIG.state);
  
  const [notifications, setNotifications] = useState(true);

  // 2. Chamar o hook de localização
  const { states, cities, loadingStates, loadingCities, fetchCities } = useLocation();

  // 3. useEffect para carregar as cidades do estado inicial ("São Paulo")
  useEffect(() => {
    // A lista de 'states' do hook é instantânea (mockada)
    if (states.length > 0) {
      // Encontra o objeto do estado inicial (São Paulo)
      const initialState = states.find(s => s.nome === repState);
      if (initialState) {
        // Busca as cidades (Campinas, Limeira) com base no ID (35)
        fetchCities(initialState.id);
      }
    }
  }, [states, repState, fetchCities]); // Executa quando o hook estiver pronto

  // 4. Handler para quando o usuário MUDAR o estado
  const handleStateChange = (e) => {
    const newStateName = e.target.value;
    setRepState(newStateName);
    setRepCity(''); // Reseta a cidade quando o estado muda (UX)

    // Encontra o ID do novo estado para buscar as cidades
    const selectedStateObj = states.find(s => s.nome === newStateName);
    if (selectedStateObj) {
      fetchCities(selectedStateObj.id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Salvando configurações:", { 
      name: repName, 
      gender: repGender,
      city: repCity, // <-- Salva a cidade
      state: repState // <-- Salva o estado
    });
    // Lógica de salvar...
  };

  return (
    // Fundo da página (bg-gray-50)
    <div className="bg-gray-50 min-h-full">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Configurações</h2>
        <p className="mt-1 text-lg text-gray-600">
          Gerencie as informações da sua república e conta.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal (Configurações) */}
        <div className="lg:col-span-2 space-y-6">

          {/* === Card 1: Sua República === */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-5">Sua República</h3>
            
            <div className="space-y-5">
           

              {/* Tipo da República */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo da República</label>
                <GenderSelector selected={repGender} onChange={setRepGender} />
              </div>

              {/* === ALTERAÇÃO AQUI: Localização (Dropdowns) === */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="repState" className="block text-sm font-medium text-gray-700">Estado</label>
                  <select 
                    id="repState" 
                    value={repState}
                    onChange={handleStateChange}
                    disabled={loadingStates}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white" 
                  >
                    {loadingStates ? (
                      <option value="">Carregando...</option>
                    ) : (
                      states.map(s => (
                        // O value={s.nome} bate com o useState(MOCKED_REP_CONFIG.state)
                        <option key={s.id} value={s.nome}>{s.nome}</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor="repCity" className="block text-sm font-medium text-gray-700">Cidade</label>
                  <select 
                    id="repCity" 
                    value={repCity}
                    onChange={(e) => setRepCity(e.target.value)}
                    disabled={loadingCities || !repState}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white" 
                  >
                    {loadingCities && <option value="">Carregando cidades...</option>}
                    {!loadingCities && cities.length === 0 && <option value="">Selecione um estado</option>}
                    
                    {cities.map(c => (
                      // O value={c.nome} bate com o useState(MOCKED_REP_CONFIG.city)
                      <option key={c.id} value={c.nome}>{c.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* === FIM DA ALTERAÇÃO === */}

            </div>

            {/* Ação de Salvar (Botão Verde Reppy) */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-[#1bff17] text-gray-900 rounded-md text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Salvar Alterações
              </button>
            </div>
          </form>

      

        </div>

      </div>
    </div>
  );
};

export default Config;

