import React from 'react';
import type { View } from '../App';
import { CompetitorIcon, ContentAnalyzerIcon, GitHubIcon, InstagramIcon, LinkedInIcon, SparklesIcon, TrashIcon, TwitterIcon, UserIcon } from '../components/Icons';
import { SavedStrategy } from '../types';
import CalendarView from '../components/CalendarView';
import TrendChart from '../components/TrendChart';

interface DashboardPageProps {
    setView: (view: View) => void;
    savedStrategies: SavedStrategy[];
    strategy: SavedStrategy | null;
    onLoad: (strategy: SavedStrategy, switchView?: boolean) => void;
    onDelete: (id: string) => void;
}

const EmptyState: React.FC<{onCreateNew: () => void}> = ({ onCreateNew }) => (
    <div className="text-center py-16 px-6 bg-surface-light rounded-lg border border-gray-200 dark:bg-surface-dark dark:border-gray-700/50 mt-6">
        <h3 className="text-2xl font-bold text-text-main-light dark:text-text-main-dark">Welcome to your Dashboard!</h3>
        <p className="text-text-muted-light dark:text-text-muted-dark mt-2 max-w-xl mx-auto">
            Load a saved strategy to see its dashboard, or create a new one to get started.
        </p>
        <button onClick={onCreateNew} className="mt-6 inline-flex items-center bg-primary text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition-opacity">
            <SparklesIcon className="w-5 h-5 mr-2" />
            Create New Strategy
        </button>
    </div>
);

const DashboardPage: React.FC<DashboardPageProps> = ({ setView, savedStrategies, strategy, onLoad, onDelete }) => {
    const topTrend = strategy?.strategy.trendingTopics?.[0];
    const analysis = strategy?.strategy.contentAnalysis;
    const plan = strategy?.strategy.strategyPlan;
    const competitors = strategy?.strategy.competitorAnalysis;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h1 className="text-4xl font-extrabold text-text-main-light dark:text-text-main-dark">Dashboard</h1>
                <button onClick={() => setView('strategyGenerator')} className="mt-4 md:mt-0 inline-flex items-center bg-primary text-white font-bold py-2 px-5 rounded-md hover:opacity-90 transition-opacity">
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Create New Strategy
                </button>
            </div>
            
            {!strategy ? (
                <EmptyState onCreateNew={() => setView('strategyGenerator')} />
            ) : (
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Left Column (Main Content) */}
                    <div className="lg:col-span-3 space-y-6">
                        {topTrend && (
                             <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-700/50">
                                <h2 className="text-2xl font-bold">{topTrend.topic}</h2>
                                <p className="mt-2 text-text-muted-light dark:text-text-muted-dark text-sm max-w-sm">
                                    This is the top trending topic from your generated strategy.
                                </p>
                                <p className="mt-2 text-xs text-text-muted-light dark:text-text-muted-dark">Source: {topTrend.platform}</p>
                                
                                <div className="mt-4">
                                     <h3 className="text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">12-Month Trend</h3>
                                    <div className="h-40">
                                         <TrendChart data={topTrend.historicalData} />
                                    </div>
                                </div>
                                <button onClick={() => setView('trendExplorer')} className="mt-6 w-full bg-primary/20 hover:bg-primary/30 transition-colors text-primary font-bold py-2 px-4 rounded-md">
                                    Explore All Trends
                                </button>
                            </div>
                        )}
                        {plan && (
                            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-700/50">
                                <h3 className="text-xl font-bold text-text-main-light dark:text-text-main-dark mb-4">{plan.blogTitle}</h3>
                                <CalendarView calendarData={plan.calendar} />
                            </div>
                        )}
                    </div>
                    
                    {/* Right Column (Sidebar) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-700/50">
                            <h3 className="text-xl font-bold text-text-main-light dark:text-text-main-dark">Saved Strategies</h3>
                            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                                {savedStrategies.map(s => (
                                    <div key={s.id} className={`p-3 rounded-md flex items-center justify-between transition-colors border ${s.id === strategy.id ? 'bg-primary/20 border-primary' : 'bg-gray-50 border-gray-200 dark:bg-dark-bg dark:border-gray-700'}`}>
                                        <div>
                                            <p className="font-semibold text-text-main-light dark:text-text-main-dark">{s.name}</p>
                                            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{s.date}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => onLoad(s, false)} 
                                                className="px-3 py-1 w-20 text-center text-sm rounded-md bg-surface-light text-text-main-light font-semibold hover:bg-gray-200 border border-gray-300 transition-colors dark:bg-gray-700 dark:text-text-main-dark dark:hover:bg-gray-600 dark:border-gray-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-400" 
                                                disabled={s.id === strategy.id}
                                            >
                                                {strategy && s.id === strategy.id ? 'Loaded' : 'Load'}
                                            </button>
                                            <button onClick={() => onDelete(s.id)} className="p-2 rounded-md text-red-400/70 hover:bg-red-500/20 hover:text-red-400 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {analysis && (
                            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-700/50">
                                <h3 className="text-xl font-bold text-text-main-light dark:text-text-main-dark flex items-center gap-2"><ContentAnalyzerIcon className="w-5 h-5 text-primary" />Content Analysis</h3>
                                <div className="mt-4 text-sm space-y-3">
                                    <div><span className="font-semibold text-text-muted-light dark:text-text-muted-dark">Top Format:</span> <span className="text-text-main-light dark:text-text-main-dark">{analysis.format}</span></div>
                                    <div><span className="font-semibold text-text-muted-light dark:text-text-muted-dark">Best Time:</span> <span className="text-text-main-light dark:text-text-main-dark">{analysis.bestTime}</span></div>
                                    <div><span className="font-semibold text-text-muted-light dark:text-text-muted-dark">Tone:</span> <span className="text-text-main-light dark:text-text-main-dark">{analysis.tone}</span></div>
                                </div>
                                <button onClick={() => setView('contentAnalyzer')} className="mt-6 w-full bg-primary/20 hover:bg-primary/30 transition-colors text-primary font-bold py-2 px-4 rounded-md">
                                    Full Analysis
                                </button>
                            </div>
                        )}

                        {competitors && (
                            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg border border-gray-200 dark:border-gray-700/50">
                                <h3 className="text-xl font-bold text-text-main-light dark:text-text-main-dark flex items-center gap-2"><CompetitorIcon className="w-5 h-5 text-primary" />Competitor Insights</h3>
                                <div className="mt-4 space-y-3">
                                    {competitors.map(c => (
                                        <div key={c.handle} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-dark-bg rounded-md">
                                            <div className="flex items-center gap-2">
                                                <UserIcon className="w-6 h-6 p-1 bg-gray-200 dark:bg-gray-700 rounded-full text-text-muted-light dark:text-text-muted-dark" />
                                                <span className="font-medium text-text-main-light dark:text-text-main-dark">{c.handle}</span>
                                            </div>
                                            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">{c.platform}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
             <footer className="mt-12 py-8 px-4 rounded-lg bg-surface-dark text-center">
                <div className="flex justify-center items-center gap-8 mb-6">
                    <a onClick={() => setView('dashboard')} className="text-sm text-text-muted-dark hover:text-white transition-colors cursor-pointer">Home</a>
                    <a onClick={() => setView('strategyGenerator')} className="text-sm text-text-muted-dark hover:text-white transition-colors cursor-pointer">Strategy</a>
                    <a href="#" className="text-sm text-text-muted-dark hover:text-white transition-colors">Donation</a>
                    <a href="#" className="text-sm text-text-muted-dark hover:text-white transition-colors">Contact</a>
                </div>
                <div className="flex justify-center items-center gap-6 mb-6 text-text-muted-dark">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                        <InstagramIcon className="w-5 h-5" />
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                        <GitHubIcon className="w-5 h-5" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                        <LinkedInIcon className="w-5 h-5" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                        <TwitterIcon className="w-5 h-5" />
                    </a>
                </div>
                <p className="text-xs text-gray-500">© 2025 visionary coder's, All rights reserved.</p>
            </footer>
        </div>
    );
}

export default DashboardPage;