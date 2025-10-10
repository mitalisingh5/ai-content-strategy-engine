import React from 'react';
import type { SavedStrategy } from '../types';
import { TrashIcon } from './Icons';

interface SavedStrategiesListProps {
  strategies: SavedStrategy[];
  onLoad: (strategy: SavedStrategy, switchView?: boolean) => void;
  onDelete: (id: string) => void;
}

const SavedStrategiesList: React.FC<SavedStrategiesListProps> = ({ strategies, onLoad, onDelete }) => {
  if (strategies.length === 0) {
    return <p className="text-text-muted dark:text-gray-400 text-center py-8">You haven't saved any strategies yet.</p>;
  }

  return (
    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 -mr-2">
      {strategies.map(s => (
        <div key={s.id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between transition-colors hover:bg-gray-100 border border-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700 dark:border-gray-700">
          <div>
            <p className="font-bold text-text-main dark:text-gray-100">{s.name}</p>
            <p className="text-sm text-text-muted dark:text-gray-400">Saved on {s.date}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onLoad(s, true)}
              className="px-4 py-2 text-sm rounded-md bg-white text-text-main font-semibold hover:bg-gray-200 border border-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 dark:border-gray-500"
            >
              Edit in Generator
            </button>
            <button
              onClick={() => onDelete(s.id)}
              aria-label={`Delete ${s.name}`}
              className="p-2 rounded-md text-red-400/70 hover:bg-red-500/20 hover:text-red-400 transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedStrategiesList;