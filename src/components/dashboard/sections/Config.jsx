// components/Config.jsx
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
  FiCheckCircle,
  FiSave,
  FiLoader,
  FiAlertCircle,
  FiCreditCard,
  FiZap,
  FiAward
} from 'react-icons/fi';
import { useLocation } from '../../../hooks/useLocation';
import { configService } from '../../../services/configService';
import { useAuth } from '../../../contexts/AuthContext';

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

// Componente para gerenciar moradores (apenas para premium)
const MembersManager = ({ republicId, currentMembers = [] }) => {
  const [members, setMembers] = useState(currentMembers);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const { canAddMoreMembers, getPlanLimits } = useAuth();
  
  const limits = getPlanLimits();
  const currentCount = members.length;

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) return;
    
    try {
      setAddingMember(true);
      // Aqui você implementaria a chamada API para adicionar membro
      console.log('Adicionando membro:', newMemberEmail);
      
      // Simulação - remover na implementação real
      const newMember = {
        id: Date.now(),
        email: newMemberEmail,
        role: 'member',
        joined_at: new Date().toISOString()
      };
      
      setMembers(prev => [...prev, newMember]);
      setNewMemberEmail('');
      
      // Em produção, chamar: await configService.addRepublicMember(republicId, newMemberEmail);
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      // Aqui você implementaria a chamada API para remover membro
      console.log('Removendo membro:', memberId);
      setMembers(prev => prev.filter(m => m.id !== memberId));
      
      // Em produção: await configService.removeRepublicMember(republicId, memberId);
    } catch (error) {
      console.error('Erro ao remover membro:', error);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-3">Gerenciar Moradores</h4>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-blue-700">
            {currentCount} de {limits.max_members} moradores
          </span>
          <div className="w-32 bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all" 
              style={{ width: `${(currentCount / limits.max_members) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Formulário para adicionar membro */}
      {canAddMoreMembers(currentCount) ? (
        <div className="flex gap-2 mb-4">
          <input
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            placeholder="Email do novo morador"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <button
            onClick={handleAddMember}
            disabled={addingMember || !newMemberEmail.trim()}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {addingMember ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-700">
            Limite de moradores atingido. Faça upgrade para adicionar mais.
          </p>
        </div>
      )}

      {/* Lista de membros */}
      <div className="space-y-2">
        {members.map(member => (
          <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div>
              <span className="font-medium text-gray-900">{member.email}</span>
              <span className="ml-2 text-sm text-gray-500 capitalize">{member.role}</span>
            </div>
            {member.role !== 'admin' && (
              <button
                onClick={() => handleRemoveMember(member.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        
        {members.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Nenhum morador adicionado ainda.
          </p>
        )}
      </div>
    </div>
  );
};

// Componente de card de plano
const PlanCard = ({ currentPlan, onUpgrade }) => {
  const { getPlanType, getPlanLimits, isFree, isBasic, isPremium } = useAuth();
  const currentPlanType = getPlanType();
  const limits = getPlanLimits();

  const plans = {
    free: {
      name: 'Bixo',
      price: 'Grátis',
      description: 'Perfeito para começar',
      color: 'gray',
      features: [
        `Tenha acesso a 1° chamada.`,
        `Acesso a lista de calouros`
        
      ],
      nextPlan: 'basic',
      upgradeText: 'Fazer Upgrade para Basic'
    },
    basic: {
      name: 'Veterano',

      description: 'Ideal para repúblicas',
      color: 'blue',
      features: [
        `Até ${limits.max_calouros} calouros`,
        `Até ${limits.max_members} moradores`,
        `Até ${limits.max_filters} filtros salvos`,
        'Dados completos da cidade',
        'Filtros avançados',
        'Exportação de dados'
      ],
      nextPlan: 'premium',
      upgradeText: 'Fazer Upgrade para Veterano Mor'
    },
    premium: {
      name: 'Veterano Mor',

      description: 'Para repúblicas profissionais',
      color: 'purple',
      features: [
        `Até ${limits.max_calouros} calouros`,
        `Até ${limits.max_members} moradores`,
        `Até ${limits.max_filters} filtros salvos`,
        'Todos os recursos básicos',
        'Gerenciamento de moradores',
        'Suporte prioritário',
        'Domínio personalizado'
      ],
      nextPlan: null,
      upgradeText: null
    }
  };

  const plan = plans[currentPlanType] || plans.free;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Seu Plano Atual</h3>
      
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-3 bg-${plan.color}-900 text-white rounded-full`}>
          {currentPlanType === 'premium' ? <FiAward className="w-6 h-6" /> : 
           currentPlanType === 'basic' ? <FiZap className="w-6 h-6" /> : 
           <FiStar className="w-6 h-6" />}
        </div>
        <div>
          <span className="text-2xl font-bold text-gray-900">{plan.name}</span>

        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4">
        {plan.description}
      </p>

      {/* Lista de Recursos */}
      <ul className="space-y-2 text-sm text-gray-700 mb-5">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <FiCheckCircle className="w-4 h-4 mr-2 text-green-500" />
            {feature}
          </li>
        ))}
      </ul>

      {/* Botão de Upgrade */}
      {plan.nextPlan && (
        <button 
          onClick={() => onUpgrade(plan.nextPlan)}
          className="w-full text-center px-4 py-2 bg-[#1bff17] text-gray-900 rounded-md text-sm font-bold hover:opacity-90 transition-opacity"
        >
          {plan.upgradeText}
        </button>
      )}
      
      {!plan.nextPlan && (
        <button 
          disabled
          className="w-full text-center px-4 py-2 bg-gray-300 text-gray-600 rounded-md text-sm font-bold cursor-not-allowed"
        >
          {plan.upgradeText}
        </button>
      )}
    </div>
  );
};

const Config = ({ userData }) => {
  // Estado para os campos do formulário
  const [repName, setRepName] = useState('');
  const [repGender, setRepGender] = useState('mista');
  const [repCity, setRepCity] = useState('');
  const [repState, setRepState] = useState('');
  const [notifications, setNotifications] = useState(true);
  
  // Estados de loading e feedback
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Hook de localização
  const { states, cities, loadingStates, loadingCities, fetchStates, fetchCities } = useLocation();
  
  // Contexto de autenticação
  const { 
    getUserRepublic, 
    getRepublicMembers, 
    isPremium, 
    upgradePlan,
    createCheckout 
  } = useAuth();

  const republic = getUserRepublic();
  const republicMembers = getRepublicMembers();

 
   const handleUpgrade = (planType) => { // Não precisa ser 'async'
      try {
        setError('');
        setMessage('');
  
        console.log(`🟡 [CONFIG] Usuário clicou em upgrade. Redirecionando para /plans...`);
        
        // 🔥 MUDANÇA: Redireciona o usuário para a página de planos
        window.location.href = '/planos';
  
      } catch (err) {
        console.error('🔴 [CONFIG] Erro ao redirecionar:', err);
        setError(err.message || 'Erro ao tentar navegar para planos');
      }
    };

  // Carregar estados quando o componente montar
  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  // Carregar configurações iniciais
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('🟡 [CONFIG] Carregando configurações...');
        
        // Carregar configurações da república
        const republicResponse = await configService.getRepublicConfig();
        console.log('🟡 [CONFIG] Resposta da república:', republicResponse);
        
        if (republicResponse.republica) {
          const rep = republicResponse.republica;
          setRepName(rep.name || '');
          setRepGender(rep.tipo || 'mista');
          setRepCity(rep.city || '');
          setRepState(rep.state || '');
          
          console.log(`✅ [CONFIG] República carregada: ${rep.name} em ${rep.city}/${rep.state}`);
          
          // Se temos estado, carregar as cidades correspondentes
          if (rep.state && states.length > 0) {
            const stateObj = states.find(s => s.nome === rep.state);
            if (stateObj) {
              console.log(`🟡 [CONFIG] Buscando cidades para estado: ${rep.state} (ID: ${stateObj.id})`);
              fetchCities(stateObj.id);
            }
          }
        } else {
          console.log('🟡 [CONFIG] Usuário não tem república configurada');
        }
        
        // Carregar configurações de notificação (com fallback)
        try {
          const notificationsResponse = await configService.getUserNotifications();
          console.log('🟡 [CONFIG] Resposta das notificações:', notificationsResponse);
          
          if (notificationsResponse.notifications) {
            setNotifications(notificationsResponse.notifications.email_notifications ?? true);
          }
        } catch (notificationsError) {
          console.warn('⚠️ [CONFIG] Erro ao carregar notificações, usando padrão:', notificationsError);
          setNotifications(true); // Valor padrão
        }
        
      } catch (err) {
        console.error('🔴 [CONFIG] Erro ao carregar configurações:', err);
        const errorMessage = err.response?.data?.error || 'Erro ao carregar configurações';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (states.length > 0) {
      loadConfig();
    }
  }, [states, fetchCities]);

  // Handler para mudança de estado
  const handleStateChange = (e) => {
    const newStateName = e.target.value;
    setRepState(newStateName);
    setRepCity(''); // Reseta a cidade quando o estado muda

    const selectedStateObj = states.find(s => s.nome === newStateName);
    if (selectedStateObj) {
      console.log(`🟡 [CONFIG] Estado alterado para: ${newStateName}, buscando cidades...`);
      fetchCities(selectedStateObj.id);
    }
  };

  // Handler para salvar configurações
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      setMessage('');

      // Validar campos obrigatórios
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

      console.log('🟡 [CONFIG] Salvando configurações...', {
        name: repName,
        tipo: repGender,
        city: repCity,
        state: repState
      });

      // Atualizar configurações da república
      const republicData = {
        name: repName.trim(),
        tipo: repGender,
        city: repCity,
        state: repState
      };

      await configService.updateRepublicConfig(republicData);

      // Atualizar configurações de notificação
      const notificationsData = {
        email_notifications: notifications
      };

      await configService.updateUserNotifications(notificationsData);

      setMessage('Configurações salvas com sucesso!');
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setMessage(''), 3000);

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
      <div className="bg-gray-50 min-h-full flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-8 h-8 animate-spin mx-auto text-gray-900" />
          <p className="mt-2 text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Configurações</h2>
        <p className="mt-1 text-lg text-gray-600">
          Gerencie as informações da sua república e conta.
        </p>
      </div>

      {/* Mensagens de feedback */}
      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center">
          <FiCheckCircle className="w-5 h-5 mr-2" />
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
          <FiAlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal (Configurações) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Sua República */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-5">Sua República</h3>
            
            <div className="space-y-5">
              {/* Nome da República */}
              <div>
                <label htmlFor="repName" className="block text-sm font-medium text-gray-700">
                  Nome da República *
                </label>
                <input 
                  type="text" 
                  id="repName" 
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900" 
                  required
                  placeholder="Digite o nome da sua república"
                />
              </div>

              {/* Tipo da República */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo da República
                </label>
                <GenderSelector selected={repGender} onChange={setRepGender} />
              </div>

              {/* Localização */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="repState" className="block text-sm font-medium text-gray-700">
                    Estado *
                  </label>
                  <select 
                    id="repState" 
                    value={repState}
                    onChange={handleStateChange}
                    disabled={loadingStates}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white" 
                    required
                  >
                    <option value="">{loadingStates ? 'Carregando estados...' : 'Selecione um estado'}</option>
                    {states.map(s => (
                      <option key={s.id} value={s.nome}>{s.nome}</option>
                    ))}
                  </select>
                  {loadingStates && (
                    <p className="mt-1 text-sm text-gray-500">Carregando estados...</p>
                  )}
                </div>
                <div>
                  <label htmlFor="repCity" className="block text-sm font-medium text-gray-700">
                    Cidade *
                  </label>
                  <select 
                    id="repCity" 
                    value={repCity}
                    onChange={(e) => setRepCity(e.target.value)}
                    disabled={loadingCities || !repState}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white" 
                    required
                  >
                    <option value="">
                      {loadingCities ? 'Carregando cidades...' : !repState ? 'Selecione um estado primeiro' : 'Selecione uma cidade'}
                    </option>
                    {cities.map(c => (
                      <option key={c.id} value={c.nome}>{c.nome}</option>
                    ))}
                  </select>
                  {loadingCities && (
                    <p className="mt-1 text-sm text-gray-500">Carregando cidades...</p>
                  )}
                </div>
              </div>

              {/* Gerenciar Moradores (apenas para premium) */}
              {isPremium() && republic && (
                <MembersManager 
                  republicId={republic.id} 
                  currentMembers={republicMembers}
                />
              )}
            </div>

            {/* Ação de Salvar */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="flex items-center px-6 py-2.5 bg-[#1bff17] text-gray-900 rounded-md text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Card: Notificações */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Notificações</h3>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 block">Receber emails sobre novos calouros</span>
                <span className="text-sm text-gray-500">Notificações por email sobre novos calouros na sua região</span>
              </div>
              <label htmlFor="notifications" className="inline-flex relative items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="notifications" 
                  className="sr-only peer" 
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Coluna Lateral (Planos) */}
        <div className="space-y-6">
          {/* Card: Seu Plano */}
          <PlanCard 
            currentPlan={userData?.user_plan} 
            onUpgrade={handleUpgrade}
          />

          {/* Card: Método de Pagamento (apenas para planos pagos) */}
          {(isPremium() || userData?.user_plan?.plan_type === 'basic') && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Método de Pagamento</h3>
              <div className="flex items-center space-x-3 mb-4">
                <FiCreditCard className="w-6 h-6 text-gray-600" />
                <div>
                  <span className="text-gray-700 block">Cartão de Crédito</span>
                  <span className="text-sm text-gray-500">**** **** **** 4242</span>
                </div>
              </div>
              <button className="w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                Alterar Método de Pagamento
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Config;