import React, { useState } from 'react';
import { 
  FiStar, 
  FiChevronDown, 
  FiCheckCircle, 
  FiXCircle, 
  FiPhone, 
  FiMinus 
} from 'react-icons/fi';

// --- COMPONENTES INTERNOS DA TABELA ---

/**
 * Opções de Status com seus estilos
 */
const statusOptions = {
  'Nenhum': { 
    label: 'Nenhum', 
    icon: FiMinus, 
    bg: 'bg-gray-100', 
    text: 'text-gray-700' 
  },
  'Chamado': { 
    label: 'Chamado', 
    icon: FiPhone, 
    bg: 'bg-blue-100', 
    text: 'text-blue-700' 
  },
  'Sucesso': { 
    label: 'Sucesso', 
    icon: FiCheckCircle, 
    bg: 'bg-green-100', 
    text: 'text-green-700' 
  },
  'Rejeitado': { 
    label: 'Rejeitado', 
    icon: FiXCircle, 
    bg: 'bg-red-100', 
    text: 'text-red-700' 
  },
};

/**
 * 1. Componente Dropdown de Status
 */
const StatusSelector = ({ currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeStyle = statusOptions[currentStatus];

  const handleSelect = (status) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Botão que mostra o status atual */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-32 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeStyle.bg} ${activeStyle.text}`}
      >
        <activeStyle.icon className="w-4 h-4" />
        <span className="ml-2 flex-1 text-left">{activeStyle.label}</span>
        <FiChevronDown className="w-4 h-4 opacity-70" />
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <div 
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200"
          onMouseLeave={() => setIsOpen(false)} // Fecha ao tirar o mouse
        >
          {Object.keys(statusOptions).map((statusKey) => {
            const { label, icon: Icon } = statusOptions[statusKey];
            return (
              <button
                key={statusKey}
                onClick={() => handleSelect(statusKey)}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Icon className="w-4 h-4 mr-2" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * 2. Componente de Linha da Tabela (com estado próprio)
i */
const StudentTableRow = ({ student }) => {
  // Cada linha agora gerencia seu próprio estado
  const [isFavorited, setIsFavorited] = useState(false);
  const [status, setStatus] = useState('Nenhum'); // Estado inicial

  return (
    <tr className="hover:bg-gray-50">
      {/* Coluna 1: Favorito (Ações) */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <button 
          onClick={() => setIsFavorited(!isFavorited)}
          className={`p-1 rounded-full hover:bg-gray-200 transition-colors ${isFavorited ? 'text-yellow-500' : 'text-gray-400'}`}
        >
          <FiStar className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </td>
      
      {/* Coluna 2: Nome */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{student.nome}</div>
      </td>

      {/* --- NOVA COLUNA: Chamada --- */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
        {student.chamada}
      </td>
      
      {/* Coluna 4: Curso */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {student.curso}
        </span>
      </td>
      
      {/* Coluna 5: Campus */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {student.campus}
      </td>
      
      {/* Coluna 6: Gênero */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {student.genero}
      </td>
      
      {/* Coluna 7: Status (Dropdown) */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        <StatusSelector 
          currentStatus={status}
          onStatusChange={setStatus} 
        />
      </td>
    </tr>
  );
};


/**
 * 3. Componente Principal da Tabela (Atualizado)
 */
const StudentTable = ({ students }) => {
  // O componente principal agora apenas renderiza o cabeçalho
  // e mapeia os dados para o `StudentTableRow`
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          
          <thead className="bg-gray-50">
            <tr>
              {/* Coluna de Ação (Favorito) */}
              <th scope="col" className="w-16 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Favoritos
              </th>
              
              {/* Coluna Nome */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>

              {/* --- NOVO HEADER: Chamada --- */}
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chamada
              </th>
              
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Curso
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campus
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
             Gênero
              </th>

              {/* Coluna de Status */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length > 0 ? (
              // Mapeia cada aluno para o componente de linha com estado
              students.map((student) => (
                <StudentTableRow key={student.id} student={student} />
              ))
            ) : (
              <tr>
                {/* O ColSpan foi atualizado para 7 (número de colunas) */}
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  Nenhum aluno encontrado com os filtros aplicados.
                </td>
              </tr>
         )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;