import React, { useState } from 'react';
import { 
  FiMail, 
  FiChevronDown, 
  FiStar,
  FiArrowRight,
  FiHelpCircle
} from 'react-icons/fi';

// --- DADOS PARA O FAQ ---
const faqs = [
  {
    q: "Como eu salvo um filtro?",
    a: (
      <p>
        Na seção <strong>'Painel'</strong>, após selecionar seus critérios (curso, campus, etc.), um botão <strong>'Salvar Filtro'</strong> aparecerá no canto direito da barra de filtros. Clique nele, dê um nome, e ele estará disponível na seção <strong>'Filtros Salvos'</strong>.
      </p>
    )
  },
  {
    q: "Qual a diferença entre 'Favoritos' e 'Funil de Contato'?",
    a: (
      <>
        <p>
          <strong>Favoritos (Estrela):</strong> É sua lista pessoal de "interesse". Use a estrela <FiStar className="w-4 h-4 inline-block -mt-1" /> para marcar calouros que você achou interessantes, mas ainda não decidiu contatar.
        </p>
        <p>
          <strong>Funil de Contato (Status):</strong> É para quem você já decidiu contatar. Ao mudar o status de um calouro (ex: para 'Chamado'), ele entra automaticamente no seu funil na seção <strong>'Lista de Calouros'</strong>.
        </p>
      </>
    )
  },
  {
    q: "Como funciona o plano 'Veterano Mor'?",
    a: (
      <p>
        O plano 'Veterano Mor' desbloqueia funcionalidades colaborativas, como a capacidade de <strong>adicionar outros moradores</strong> da sua república na seção 'Configurações'. Com ele, todos podem ver e gerenciar as listas de calouros juntos.
      </p>
    )
  },
  {
    q: "Como eu altero minha cidade ou estado?",
    a: (
      <p>
        Vá até a seção <strong>'Configurações'</strong>. No card 'Sua República', você encontrará os campos 'Cidade' e 'Estado' como menus dropdown. Você pode alterá-los e clicar em 'Salvar Alterações' a qualquer momento.
      </p>
    )
  }
];
// ------------------------

/**
 * Componente de Item do Acordeão (FAQ)
 */
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <FiChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600 space-y-3">
          {answer}
        </div>
      )}
    </div>
  );
};

/**
 * Componente Principal da Seção "Ajuda"
 */
const AjudaSection = () => {
  return (
    <div className="bg-gray-50 min-h-full">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Central de Ajuda</h2>
        <p className="mt-1 text-lg text-gray-600">
          Tem alguma dúvida? Estamos aqui para ajudar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Principal (FAQs) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Dúvidas Frequentes (FAQ)</h3>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <FaqItem key={index} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Lateral (Contato e Dicas) */}
        <div className="space-y-6">
          
          {/* Card de Contato */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Entre em Contato</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gray-900 text-white rounded-full">
                <FiMail className="w-6 h-6" /> 
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900">E-mail de Suporte</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Para dúvidas, sugestões ou problemas técnicos, envie um e-mail para nossa equipe.
            </p>
            {/* Link de Email (Botão Verde Reppy) */}
            <a 
              href="mailto:reppybr@gmail.com" 
              className="w-full text-center block px-4 py-2 bg-[#1bff17] text-gray-900 rounded-md text-sm font-bold hover:opacity-90 transition-opacity"
            >
              reppybr@gmail.com
            </a>
          </div>

          {/* Card de Dicas Rápidas (UX) */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Dicas Rápidas</h3>
            <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <FiArrowRight className="w-4 h-4 mr-2 text-gray-900 mt-1 flex-shrink-0" />
                  <span>Use <strong>'Painel'</strong> para descobrir calouros e <strong>'Lista de Calouros'</strong> para gerenciar seus contatos.</span>
                </li>
                <li className="flex items-start">
                  <FiArrowRight className="w-4 h-4 mr-2 text-gray-900 mt-1 flex-shrink-0" />
                  <span>Salve seus filtros mais usados para acessá-los rapidamente na seção <strong>'Filtros Salvos'</strong>.</span>
                </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AjudaSection;
