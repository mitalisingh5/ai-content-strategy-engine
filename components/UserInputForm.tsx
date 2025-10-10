import React, { useState, useEffect } from 'react';
import type { UserInput } from '../types';
import { SparklesIcon } from './Icons';

interface UserInputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
  initialData?: UserInput | null;
}

const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit, isLoading, initialData }) => {
  const [targetAudience, setTargetAudience] = useState('Gen Z for skincare content');
  const [topic, setTopic] = useState('skincare');
  const [goals, setGoals] = useState('engagement and UGC');

  useEffect(() => {
    if (initialData) {
      setTargetAudience(initialData.targetAudience);
      setTopic(initialData.topic);
      setGoals(initialData.goals);
    } else {
      // Reset to defaults if initialData is cleared
      setTargetAudience('Gen Z for skincare content');
      setTopic('skincare');
      setGoals('engagement and UGC');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ targetAudience, topic, goals });
  };

  return (
    <div className="bg-surface-light p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm dark:bg-surface-dark dark:border-gray-700/50">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">
            Target Audience
          </label>
          <input
            id="targetAudience"
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="e.g., Gen Z gamers, busy professionals"
            className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-text-main-light placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 dark:bg-dark-bg dark:border-gray-600 dark:text-text-main-dark dark:placeholder-gray-500"
            required
          />
        </div>
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">
            Topic / Industry
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Sustainable fashion, AI productivity tools"
            className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-text-main-light placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 dark:bg-dark-bg dark:border-gray-600 dark:text-text-main-dark dark:placeholder-gray-500"
            required
          />
        </div>
        <div>
          <label htmlFor="goals" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">
            Primary Goals
          </label>
          <input
            id="goals"
            type="text"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="e.g., Increase brand awareness, drive traffic"
            className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-text-main-light placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 dark:bg-dark-bg dark:border-gray-600 dark:text-text-main-dark dark:placeholder-gray-500"
            required
          />
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-primary text-white font-bold py-3 px-4 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isLoading ? (
              'Generating Strategy...'
            ) : (
              <>
                <SparklesIcon className="w-5 h-5 mr-2" />
                Generate Strategy
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInputForm;