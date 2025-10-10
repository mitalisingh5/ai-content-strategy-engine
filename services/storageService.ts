import type { SavedStrategy } from '../types';

const STORAGE_KEY = 'ai_content_strategies';

export const getSavedStrategies = (): SavedStrategy[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error("Failed to parse saved strategies from localStorage", error);
        return [];
    }
};

export const saveStrategy = (strategy: SavedStrategy): void => {
    const strategies = getSavedStrategies();
    // Prevent duplicates if saving again
    const existingIndex = strategies.findIndex(s => s.id === strategy.id);
    if (existingIndex > -1) {
        strategies[existingIndex] = strategy;
    } else {
        strategies.unshift(strategy);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(strategies));
};

export const deleteStrategy = (strategyId: string): void => {
    let strategies = getSavedStrategies();
    strategies = strategies.filter(s => s.id !== strategyId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(strategies));
};
