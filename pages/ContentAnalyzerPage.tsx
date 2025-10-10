import React, { useState } from 'react';
import type { StandaloneContentAnalysis, User } from '../types';
import { analyzeStandaloneContent } from '../services/geminiService';
import Loader from '../components/Loader';
import { SparklesIcon } from '../components/Icons';

const PerformanceScoreBar: React.FC<{ name: string; score: number }> = ({ name, score }) => {
    const width = `${score}%`;
    let bgColor = 'bg-green-500';
    if (score < 70) bgColor = 'bg-yellow-500';
    if (score < 40) bgColor = 'bg-red-500';

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-text-muted dark:text-gray-400">{name}</span>
                <span className="text-sm font-bold text-text-main dark:text-gray-200">{score}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className={`${bgColor} h-2.5 rounded-full`} style={{ width }}></div>
            </div>
        </div>
    );
};

const PlatformChart: React.FC<{ data: { platform: string, score: number }[] }> = ({ data }) => {
    const maxValue = 100;
    return (
        <div className="space-y-4">
            {data.map(({ platform, score }) => (
                <div key={platform} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-text-muted dark:text-gray-400 w-28 text-right">{platform}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                        <div 
                            className="bg-primary h-4 rounded-full text-white text-xs flex items-center justify-end pr-2" 
                            style={{ width: `${(score / maxValue) * 100}%` }}
                        >
                            {score}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

interface ContentAnalyzerPageProps {
    user: User | null;
}

const ContentAnalyzerPage: React.FC<ContentAnalyzerPageProps> = ({ user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<StandaloneContentAnalysis | null>(null);
    const [content, setContent] = useState('');
    const [url, setUrl] = useState('');

    const handleAnalyze = async () => {
        if (!content.trim() && !url.trim()) return;
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await analyzeStandaloneContent(content || url);
            setAnalysis(result);
        } catch (e) {
            setError("Failed to analyze content. The AI may be busy, or the content is unsupported.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setUrl('');
        setContent('');
        setAnalysis(null);
        setError(null);
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-main dark:text-gray-50">Content Analyzer</h1>
                <p className="text-text-muted dark:text-gray-400 mt-1">
                    Welcome, <span className="font-bold text-text-main dark:text-gray-100">{user?.username}</span>! Paste a URL or text to get instant performance analysis.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 dark:bg-surface-dark dark:border-gray-700/50">
                    <div>
                        <label htmlFor="url" className="text-sm font-medium text-text-muted dark:text-gray-400">Content URL (Optional)</label>
                        <input id="url" type="text" value={url} onChange={e => setUrl(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-text-main focus:ring-primary focus:border-primary dark:bg-dark-bg dark:border-gray-600 dark:text-white" placeholder="https://..." />
                    </div>
                    <div className="text-center text-sm text-gray-400">or</div>
                    <div>
                        <label htmlFor="text" className="text-sm font-medium text-text-muted dark:text-gray-400">Paste Content Text</label>
                        <textarea id="text" value={content} onChange={e => setContent(e.target.value)} rows={8} className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-text-main focus:ring-primary focus:border-primary dark:bg-dark-bg dark:border-gray-600 dark:text-white" placeholder="Your content here..."></textarea>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleClear} className="w-1/3 flex items-center justify-center bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-md hover:bg-gray-300 transition-all duration-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                            Clear
                        </button>
                        <button onClick={handleAnalyze} disabled={isLoading || (!content.trim() && !url.trim())} className="w-2/3 flex items-center justify-center bg-primary text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                            {isLoading ? 'Analyzing...' : <><SparklesIcon className="w-5 h-5 mr-2" /> Generate Analysis</>}
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {isLoading && <Loader />}
                    {error && <div className="p-4 bg-red-100 text-red-700 border border-red-200 rounded-md">{error}</div>}
                    {analysis && (
                        <>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fadeInUp dark:bg-surface-dark dark:border-gray-700/50">
                                <h3 className="font-bold text-lg mb-4 text-text-main dark:text-gray-50">Metadata</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {Object.entries(analysis.metadata).map(([key, value]) => (
                                        <div key={key}>
                                            <p className="capitalize text-text-muted dark:text-gray-400">{key.replace(/([A-Z])/g, ' $1')}</p>
                                            <p className="font-semibold text-text-main dark:text-gray-200">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fadeInUp dark:bg-surface-dark dark:border-gray-700/50" style={{animationDelay: '100ms'}}>
                                <h3 className="font-bold text-lg mb-4 text-text-main dark:text-gray-50">Performance Scores</h3>
                                <div className="space-y-4">
                                    {analysis.performanceScores.map(score => <PerformanceScoreBar key={score.name} {...score} />)}
                                </div>
                            </div>
                             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fadeInUp dark:bg-surface-dark dark:border-gray-700/50" style={{animationDelay: '200ms'}}>
                                <h3 className="font-bold text-lg mb-4 text-text-main dark:text-gray-50">Platform Suitability</h3>
                                <PlatformChart data={analysis.platformSuitability} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentAnalyzerPage;