// components/Config.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiMapPin, 
  FiUsers, 
  FiUser, 
  FiUserCheck, 
  FiUserPlus, 
  FiBell,
  FiTrash2,
  FiStar,
  FiCheckCircle,
  FiSave,
  FiLoader,
  FiAlertCircle,
  FiZap,
  FiAward,
  FiHome
} from 'react-icons/fi';
import { useLocation } from '../../../hooks/useLocation';
import { configService } from '../../../services/configService';
import { useAuth } from '../../../contexts/AuthContext';

// 🔥 ADICIONAR: Definição da cor personalizada no CSS inline
const styles = `
  .bg-reppy-green { background-color: #1bff17; }
  .text-reppy-green { color: #1bff17; }
  .border-reppy-green { border-color: #1bff17; }
  .focus\\:ring-reppy-green:focus { --tw-ring-color: #1bff17; }
  .peer:checked ~ .peer-checked\\:bg-reppy-green { background-color: #1bff17; }
`;

const capitalizeName = (name) => {
  if (typeof name !== 'string' || !name) return '';
  
  const exceptions = ['de', 'da', 'do', 'das', 'dos'];

  return name
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (exceptions.includes(word) && index > 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

// Componente Seletor de Gênero
const GenderSelector = ({ selected, onChange }) => {
  const options = [
    { label: 'Mista', value: 'mista', icon: FiUsers },
    { label: 'Feminina', value: 'feminina', icon: FiUser },
    { label: 'Masculina', value: 'masculina', icon: FiUserCheck },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 bg-gray-100 rounded-lg p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex flex-col items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all
            ${selected === option.value
              ? 'bg-white text-gray-900 shadow-md transform scale-105'
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

// Gerenciar moradores
const MembersManager = ({ republicId, currentMembers = [] }) => {
  const [members, setMembers] = useState(currentMembers);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [error, setError] = useState('');
  
  const MAX_MEMBERS = 10;
  const currentCount = members.length;
  const canAddMore = currentCount < MAX_MEMBERS;

  useEffect(() => {
    setMembers(currentMembers);
  }, [currentMembers]);

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      setError('Digite o email do morador');
      return;
    }

    if (!canAddMore) {
      setError(`Limite máximo de ${MAX_MEMBERS} moradores atingido`);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMemberEmail)) {
      setError('Digite um email válido');
      return;
    }
    
    try {
      setAddingMember(true);
      setError('');

      if (members.some(member => member.email === newMemberEmail)) {
        setError('Este morador já está na república');
        return;
      }

      const newMember = {
        id: Date.now().toString(),
        email: newMemberEmail,
        role: 'morador',
        joined_at: new Date().toISOString(),
        is_active: true
      };
      
      setMembers(prev => [...prev, newMember]);
      setNewMemberEmail('');
      
    } catch (error) {
      console.error('🔴 Erro ao adicionar morador:', error);
      setError('Erro ao adicionar morador');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      setMembers(prev => prev.filter(m => m.id !== memberId));
      setError('');
    } catch (error) {
      console.error('🔴 Erro ao remover morador:', error);
      setError('Erro ao remover morador');
    }
  };

  const progressPercentage = (currentCount / MAX_MEMBERS) * 100;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mt-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-reppy-green bg-opacity-20 rounded-lg">
            <FiAward className="w-5 h-5 " />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">Gerenciar Moradores</h4>
            <p className="text-sm text-reppy-green font-medium">Recurso exclusivo Veterano Mor</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-reppy-green">
            {currentCount}
            <span className="text-sm font-normal text-gray-500">/{MAX_MEMBERS}</span>
          </div>
          <div className="text-xs text-gray-500">moradores</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Vagas utilizadas</span>
          <span>{currentCount} de {MAX_MEMBERS}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-reppy-green h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {canAddMore ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adicionar Novo Morador
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => {
                setNewMemberEmail(e.target.value);
                setError('');
              }}
              placeholder="email@exemplo.com"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-reppy-green focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
            />
            <button
              onClick={handleAddMember}
              disabled={addingMember || !newMemberEmail.trim()}
              className="px-6 py-3 bg-reppy-green text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {addingMember ? (
                <FiLoader className="w-4 h-4 animate-spin" />
              ) : (
                'Adicionar'
              )}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="w-4 h-4 mr-1" />
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <FiAlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Limite máximo atingido
              </p>
              <p className="text-sm text-yellow-700">
                Sua república já tem {MAX_MEMBERS} moradores.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Moradores da República ({currentCount})
        </h5>
        
        {members.length > 0 ? (
          members.map(member => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <FiUser className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-900 block">{member.email}</span>
                  <span className="text-xs text-gray-500 capitalize">
                    {member.role} • desde {new Date(member.joined_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              
              {member.role !== 'admin' && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remover morador"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3">
              <FiUserPlus className="w-6 h-6 text-gray-400 mx-auto" />
            </div>
            <p className="text-gray-500 text-sm">
              Nenhum morador adicionado ainda
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Use o campo acima para adicionar o primeiro morador
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Card de Plano
const PlanCard = ({ currentPlan, onUpgrade }) => {
  const { getPlanType } = useAuth();
  const currentPlanType = getPlanType();

  const plans = {
    free: {
      name: 'Bixo',
      price: 'Grátis',
      description: 'Perfeito para começar sua jornada',
      icon: FiStar,
      features: [
        'Acesso à 1ª chamada',
        'Lista básica de calouros',
        'Filtros simples',
        'Suporte comunitário'
      ],
      limitations: [
        'Apenas 1ª chamada',
        'Sem exportação de dados',
        'Sem gerenciar moradores'
      ],
      nextPlan: 'basic',
      upgradeText: 'Virar Veterano'
    },
    basic: {
      name: 'Veterano',
      description: 'Ideal para repúblicas estabelecidas',
      icon: FiZap,
      features: [
        'Todas as chamadas',
        'Exportação de dados',
        'Filtros avançados',
        'Suporte prioritário'
      ],
      limitations: [
        'Não pode gerenciar moradores'
      ],
      nextPlan: 'premium',
      upgradeText: 'Virar Veterano Mor'
    },
    premium: {
      name: 'Veterano Mor',
      description: 'Para repúblicas profissionais',
      icon: FiAward,
      features: [
        'Todos os recursos básicos',
        `Gerenciar até 10 moradores`,
        'Dashboard compartilhado',
        'Suporte 24/7',
      ],
      limitations: [],
      nextPlan: null,
      upgradeText: null
    }
  };

  const plan = plans[currentPlanType] || plans.free;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className={`bg-gradient-to-r ${
        currentPlanType === 'free' ? 'from-gray-600 to-gray-700' : 
        currentPlanType === 'basic' ? 'from-gray-900 to-gray-800' : 
        'from-gray-900 to-gray-800'
      } p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-xl">
              <plan.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-white opacity-90">{plan.description}</p>
            </div>
          </div>
          {plan.price && (
            <div className="text-right">
              <div className="text-2xl font-bold">{plan.price}</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <FiCheckCircle className="w-5 h-5 text-reppy-green mr-2" />
            Recursos Incluídos
          </h4>
          <ul className="space-y-2 text-sm">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <div className="w-1.5 h-1.5 bg-reppy-green rounded-full mr-3"></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {plan.limitations.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FiAlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
              Limitações
            </h4>
            <ul className="space-y-2 text-sm">
              {plan.limitations.map((limitation, index) => (
                <li key={index} className="flex items-center text-gray-500">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-3"></div>
                  {limitation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {plan.nextPlan ? (
          <button 
            onClick={() => onUpgrade(plan.nextPlan)}
            className={`w-full py-3 px-4 bg-gradient-to-r ${
              currentPlanType === 'free' 
                ? 'from-reppy-green to-green-600 text-white hover:from-green-600 hover:to-green-700' 
                : 'from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900'
            } rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl`}
          >
            {plan.upgradeText}
          </button>
        ) : (
          <button 
            disabled
            className="w-full py-3 px-4 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-lg font-bold cursor-not-allowed opacity-75"
          >
            Plano Máximo Ativado
          </button>
        )}
      </div>
    </div>
  );
};

const Config = ({ userData }) => {
  const [repName, setRepName] = useState('');
  const [repGender, setRepGender] = useState('mista');
  const [repCity, setRepCity] = useState('');
  const [repState, setRepState] = useState('');
  const [notifications, setNotifications] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { states, cities, loadingStates, loadingCities, fetchStates, fetchCities } = useLocation();
  const { getUserRepublic, getRepublicMembers, isPremium } = useAuth();

  const republic = getUserRepublic();
  const republicMembers = getRepublicMembers();

  const handleUpgrade = (planType) => {
    try {
      setError('');
      setMessage('');
      window.location.href = '/planos';
    } catch (err) {
      console.error('🔴 [CONFIG] Erro ao redirecionar:', err);
      setError('Erro ao tentar navegar para planos');
    }
  };

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  useEffect(() => {
    let mounted = true;

    const loadConfig = async () => {
      if (!mounted) return;

      try {
        setLoading(true);
        setError('');
        
        const [republicResponse, notificationsResponse] = await Promise.all([
          configService.getRepublicConfig().catch(err => {
            console.warn('⚠️ [CONFIG] Erro ao buscar república:', err);
            return { republica: null };
          }),
          configService.getUserNotifications().catch(err => {
            console.warn('⚠️ [CONFIG] Erro ao buscar notificações:', err);
            return { notifications: { email_notifications: true } };
          })
        ]);

        if (!mounted) return;

        if (republicResponse.republica) {
          const rep = republicResponse.republica;
          setRepName(rep.name || '');
          setRepGender(rep.tipo || 'mista');
          setRepCity(capitalizeName(rep.city || ''));
          setRepState(rep.state || '');
          
          if (rep.state && states.length > 0) {
            const stateObj = states.find(s => s.nome === rep.state);
            if (stateObj) {
              fetchCities(stateObj.id);
            }
          }
        }
        
        if (notificationsResponse.notifications) {
          setNotifications(notificationsResponse.notifications.email_notifications ?? true);
        }
        
      } catch (err) {
        if (!mounted) return;
        console.error('🔴 [CONFIG] Erro ao carregar configurações:', err);
        const errorMessage = err.response?.data?.error || 'Erro ao carregar configurações';
        setError(errorMessage);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (states.length > 0) {
      loadConfig();
    }

    return () => {
      mounted = false;
    };
  }, [states, fetchCities]);

  useEffect(() => {
    if (repState && states.length > 0) {
      const stateObj = states.find(s => s.nome === repState);
      if (stateObj) {
        fetchCities(stateObj.id);
      }
    }
  }, [repState, states, fetchCities]);

  const handleStateChange = (e) => {
    const newStateName = e.target.value;
    setRepState(newStateName);
    setRepCity('');

    const selectedStateObj = states.find(s => s.nome === newStateName);
    if (selectedStateObj) {
      fetchCities(selectedStateObj.id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      setMessage('');

      if (!repName.trim()) {
        setError('Nome da república é obrigatório');
        return;
      }
      
      if (!repState) {
        setError('Estado é obrigatório');
        return;
      }
      
      if (!repCity) {
        setError('Cidade é obrigatória');
        return;
      }

      await Promise.all([
        configService.updateRepublicConfig({
          name: repName.trim(),
          tipo: repGender,
          city: repCity,
          state: repState
        }),
        configService.updateUserNotifications({
          email_notifications: notifications
        })
      ]);

      setMessage('Configurações salvas com sucesso!');
      setTimeout(() => setMessage(''), 5000);

    } catch (err) {
      console.error('🔴 [CONFIG] Erro ao salvar configurações:', err);
      const errorMessage = err.response?.data?.error || 'Erro ao salvar configurações';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-full flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-reppy-green mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full py-8">
      <style jsx>{styles}</style>
      
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <div className="p-2 bg-reppy-green bg-opacity-10 rounded-xl">
            <FiHome className="w-6 h-6 " />
          </div>
          <h2 className="text-4xl font-bold text-gray-900">Configurações da República</h2>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Gerencie as informações da sua república e convide moradores
        </p>
      </div>

      {message && (
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl flex items-center">
          <FiCheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <span className="font-medium">{message}</span>
        </div>
      )}
      
      {error && (
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl flex items-center">
          <FiAlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <FiHome className="w-5 h-5 mr-2" />
                Informações da República
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="repName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da República *
                </label>
                <input 
                  type="text" 
                  id="repName" 
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-reppy-green focus:border-transparent transition-all" 
                  required
                  placeholder="Ex: República dos Artistas"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo da República
                </label>
                <GenderSelector selected={repGender} onChange={setRepGender} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="repState" className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select 
                    id="repState" 
                    value={repState}
                    onChange={handleStateChange}
                    disabled={loadingStates}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-reppy-green focus:border-transparent bg-white disabled:bg-gray-100" 
                    required
                  >
                    <option value="">{loadingStates ? 'Carregando estados...' : 'Selecione um estado'}</option>
                    {states.map(s => (
                      <option key={s.id} value={s.nome}>{s.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="repCity" className="block text-sm font-semibold text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <select 
                    id="repCity" 
                    value={repCity}
                    onChange={(e) => setRepCity(e.target.value)}
                    disabled={loadingCities || !repState}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-reppy-green focus:border-transparent bg-white disabled:bg-gray-100" 
                    required
                  >
                    <option value="">
                      {loadingCities ? 'Carregando cidades...' : !repState ? 'Selecione um estado primeiro' : 'Selecione uma cidade'}
                    </option>
                    {cities.map(c => (
                      <option key={c.id} value={c.nome}>{c.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              {isPremium() && republic && (
                <MembersManager 
                  republicId={republic.id} 
                  currentMembers={republicMembers}
                />
              )}

              {!isPremium() && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-reppy-green bg-opacity-10 rounded-xl">
                      <FiAward className="w-6 h-6 text-reppy-green" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">Gerenciar Moradores</h4>
                      <p className="text-gray-600 mt-1">
                        Torne-se <strong>Veterano Mor</strong> para adicionar até 10 moradores à sua república e compartilhar o acesso.
                      </p>
                      <button
                        onClick={() => handleUpgrade('premium')}
                        className="mt-3 px-6 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
                      >
                        Virar Veterano Mor
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-reppy-green to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 hover:scale-105"
              >
                {saving ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* 🔥 CORREÇÃO: Checkbox funcionando com a cor verde Reppy */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <FiBell className="w-5 h-5 mr-2" />
                Preferências de Notificação
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <span className="text-gray-900 font-medium block">Notificações por Email</span>
                  <span className="text-sm text-gray-600">Receba atualizações sobre novos calouros na sua região</span>
                </div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                    notifications ? 'bg-reppy-green' : 'bg-gray-200'
                  }`}>
                    <div className={`absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ${
                      notifications ? 'transform translate-x-6' : 'transform translate-x-0'
                    }`}></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <PlanCard 
            currentPlan={userData?.user_plan} 
            onUpgrade={handleUpgrade}
          />
        </div>
      </div>
    </div>
  );
};

export default Config;