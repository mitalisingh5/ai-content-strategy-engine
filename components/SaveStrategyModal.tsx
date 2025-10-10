import React, { useState } from 'react';

interface SaveStrategyModalProps {
  onSave: (name: string) => void;
  onClose: () => void;
}

const SaveStrategyModal: React.FC<SaveStrategyModalProps> = ({ onSave, onClose }) => {
  const [name, setName] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
      <p className="text-text-muted-light dark:text-text-muted-dark">Give your new strategy a name to save it for later.</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Q3 Skincare Campaign"
        className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-text-main-light placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 dark:bg-dark-bg dark:border-gray-600 dark:text-text-main-dark dark:placeholder-gray-500"
        autoFocus
        required
      />
      <div className="flex justify-end gap-4 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-text-muted-light hover:bg-gray-100 transition-colors dark:text-text-muted-dark dark:hover:bg-gray-700">
          Cancel
        </button>
        <button 
          type="submit"
          disabled={!name.trim()}
          className="px-6 py-2 rounded-md bg-primary text-white font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default SaveStrategyModal;