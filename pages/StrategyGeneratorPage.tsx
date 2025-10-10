import React, { useState } from 'react';
import type { UserInput, FullStrategy, User, SavedStrategy } from '../types';
import { generateContentStrategyStream, generateStrategyImages } from '../services/geminiService';
import UserInputForm from '../components/UserInputForm';
import ContentAnalyzer from '../components/ContentAnalyzer';
import CompetitorTracker from '../components/CompetitorTracker';
import StrategyGenerator from '../components/StrategyGenerator';
import GeneratedImages from '../components/GeneratedImages';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import SaveStrategyModal from '../components/SaveStrategyModal';
import { SparklesIcon, TrendIcon, BookmarkIcon } from '../components/Icons';

interface StrategyGeneratorPageProps {
  user: User | null;
  onStrategyGenerated: (strategy: Partial<FullStrategy>, userInput: UserInput) => void;
  onSaveStrategy: (strategy: SavedStrategy) => void;
}

const StrategyGeneratorPage: React.FC<StrategyGeneratorPageProps> = ({ user, onStrategyGenerated, onSaveStrategy }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<Partial<FullStrategy>>({});
  const [hasResults, setHasResults] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  const handleFormSubmit = async (input: UserInput) => {
    setIsLoading(true);
    setIsGeneratingImages(false);
    setError(null);
    setStrategy({});
    setHasResults(false);
    setUserInput(input);
    
    let firstUpdate = true;
    let finalStrategy: Partial<FullStrategy> = {};

    try {
      for await (const update of generateContentStrategyStream(input)) {
        if (firstUpdate) {
            setHasResults(true);
            firstUpdate = false;
        }
        const newStrategy = { ...finalStrategy, [update.key]: update.data };
        setStrategy(newStrategy);
        finalStrategy = newStrategy;
      }
      onStrategyGenerated(finalStrategy, input);
      
      // After text generation is complete, generate images
      if (finalStrategy.strategyPlan?.blogTitle) {
        setIsGeneratingImages(true);
        const images = await generateStrategyImages(finalStrategy.strategyPlan.blogTitle);
        const strategyWithImages = { ...finalStrategy, generatedImages: images };
        setStrategy(strategyWithImages);
        finalStrategy = strategyWithImages;
        onStrategyGenerated(finalStrategy, input);
      }

    } catch (err) {
      setError('Failed to generate content strategy. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsGeneratingImages(false);
    }
  };

  const handleConfirmSave = (name: string) => {
    if (!userInput || !strategy.strategyPlan) { // Check for a complete strategy
      alert("Cannot save an incomplete strategy. Please wait for generation to finish.");
      return;
    }

    const newSavedStrategy: SavedStrategy = {
      id: `strat_${Date.now()}`,
      name,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      userInput,
      strategy: strategy as FullStrategy,
    };

    onSaveStrategy(newSavedStrategy);
    setShowSaveModal(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-main dark:text-gray-50 mb-2">
            Strategy Generator
          </h1>
          <p className="text-lg text-text-muted dark:text-gray-400">
             Welcome, <span className="font-bold text-text-main dark:text-gray-100">{user?.username}</span>! Transform your content planning with AI-driven insights.
          </p>
        </div>
        
        <UserInputForm onSubmit={handleFormSubmit} isLoading={isLoading} initialData={userInput} />

        {isLoading && !hasResults && <Loader />}
        
        {error && (
          <div className="mt-8 text-center p-4 bg-red-100 border border-red-200 rounded-lg animate-fadeInUp">
            <p className="font-semibold text-red-700">{error}</p>
          </div>
        )}

        {hasResults && (
          <div className="mt-12 space-y-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 animate-fadeInUp dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="flex items-center text-2xl font-bold text-text-main dark:text-gray-50 mb-3">
                            <SparklesIcon className="w-6 h-6 mr-2 text-accent" />
                            Your AI-Generated Content Strategy
                        </h2>
                        <p className="text-text-muted dark:text-gray-400">Here's a comprehensive plan based on your goals, audience, and topic.</p>
                    </div>
                    {strategy.strategyPlan && !isLoading && !isGeneratingImages && (
                       <button
                        onClick={() => setShowSaveModal(true)}
                        className="flex-shrink-0 flex items-center gap-2 bg-white text-text-main font-semibold py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
                      >
                        <BookmarkIcon className="w-5 h-5" />
                        Save Strategy
                      </button>
                    )}
                </div>
            </div>
            
            {strategy.trendingTopics && (
              <div className="animate-fadeInUp">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                        <TrendIcon className="w-6 h-6 text-accent"/>
                        <h3 className="ml-3 text-xl font-bold text-text-main dark:text-gray-50">Trending Topics</h3>
                    </div>
                    <ul className="space-y-2">
                        {strategy.trendingTopics.map((trend, i) => 
                            <li key={i} className="p-3 bg-gray-50 rounded-md text-sm dark:bg-gray-700/50">
                                <span className="font-semibold text-text-main dark:text-gray-100">{trend.topic}</span>
                                <span className="text-text-muted dark:text-gray-400"> ({trend.platform}) - </span>
                                <span className={`font-medium ${trend.sentiment === 'Positive' ? 'text-green-600' : 'text-yellow-600'}`}>{trend.sentiment}</span>
                            </li>
                        )}
                    </ul>
                </div>
              </div>
            )}
            {strategy.contentAnalysis && (
              <div className="animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                <ContentAnalyzer analysis={strategy.contentAnalysis} />
              </div>
            )}
            {strategy.competitorAnalysis && (
              <div className="animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                <CompetitorTracker competitors={strategy.competitorAnalysis} />
              </div>
            )}
            {strategy.strategyPlan && (
              <div className="animate-fadeInUp" style={{ animationDelay: '300ms' }}>
                <StrategyGenerator plan={strategy.strategyPlan} />
              </div>
            )}
            {(isGeneratingImages || strategy.generatedImages) && (
                 <div className="animate-fadeInUp" style={{ animationDelay: '400ms' }}>
                    <GeneratedImages images={strategy.generatedImages} isLoading={isGeneratingImages} />
                 </div>
            )}
             {isLoading && hasResults && <Loader />}
          </div>
        )}
      </div>
      <Modal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} title="Save Strategy">
        <SaveStrategyModal onSave={handleConfirmSave} onClose={() => setShowSaveModal(false)} />
      </Modal>
    </div>
  );
};

export default StrategyGeneratorPage;