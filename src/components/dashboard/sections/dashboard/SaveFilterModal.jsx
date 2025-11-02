import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';

/**
 * Componente do Modal para salvar um filtro.
 * Recebe 'isOpen' para controlar a visibilidade,
 * 'onClose' para fechar, e 'onSave' que retorna o nome do filtro.
 */
const SaveFilterModal = ({ isOpen, onClose, onSave }) => {
  const [filterName, setFilterName] = useState('');
  const [error, setError] = useState('');

  // Limpa o nome do filtro toda vez que o modal é aberto
  useEffect(() => {
    if (isOpen) {
      setFilterName('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (filterName.trim().length === 0) {
      setError('Por favor, dê um nome ao seu filtro.');
      return;
    }
    
    // Chama a função 'onSave' passada pelo pai, enviando o nome
    onSave(filterName);
    onClose(); // Fecha o modal após salvar
  };

  const handleOverlayClick = (e) => {
    // Fecha o modal se o clique for no overlay (fundo)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Overlay principal (fundo escuro)
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      {/* Container do Modal */}
      <div className="relative bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Salvar Filtro
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 space-y-4">
          <div>
            <label 
              htmlFor="filterName" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome do Filtro
            </label>
            <input
              type="text"
              id="filterName"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Ex: Calouros Eng. Campinas"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {error && (
              <p className="mt-1 text-xs text-red-600">{error}</p>
            )}
          </div>
        </div>

        {/* Rodapé do Modal (Botões) */}
        <div className="flex items-center justify-end p-4 bg-gray-50 border-t border-gray-200 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            <FiSave className="w-4 h-4 mr-2" />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveFilterModal;