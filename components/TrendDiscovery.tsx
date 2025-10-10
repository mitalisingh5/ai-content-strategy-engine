import React from 'react';
import type { Trend } from '../types';
import { TwitterIcon, YouTubeIcon, RedditIcon, GoogleTrendsIcon, TikTokIcon, InstagramIcon } from './Icons';
import { Platform, Sentiment } from '../types';
import TrendChart from './TrendChart';

interface TrendDiscoveryProps {
  trends: Trend[];
}

const platformDetails: { [key in Platform]?: { icon: React.FC<any>, color: string } } = {
    [Platform.Twitter]: { icon: TwitterIcon, color: 'text-sky-500' },
    [Platform.YouTube]: { icon: YouTubeIcon, color: 'text-red-600' },
    [Platform.Reddit]: { icon: RedditIcon, color: 'text-orange-500' },
    [Platform.GoogleTrends]: { icon: GoogleTrendsIcon, color: 'text-blue-500' },
    [Platform.TikTok]: { icon: TikTokIcon, color: 'text-text-main-light dark:text-text-main-dark' },
    [Platform.Instagram]: { icon: InstagramIcon, color: 'text-pink-500' },
}

const SentimentIndicator: React.FC<{ sentiment: Sentiment }> = ({ sentiment }) => {
    const sentimentClasses = {
        [Sentiment.Positive]: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
        [Sentiment.Neutral]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
        [Sentiment.Negative]: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
    };
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${sentimentClasses[sentiment]}`}>{sentiment}</span>
};

const TrendCard: React.FC<{ trend: Trend }> = ({ trend }) => {
    const PlatformIcon = platformDetails[trend.platform]?.icon;
    const platformColor = platformDetails[trend.platform]?.color || 'text-gray-500';
    const latestVolume = trend.historicalData[trend.historicalData.length - 1].volume;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div 
            onMouseMove={handleMouseMove}
            className="relative glow-card bg-surface-light p-4 rounded-lg border border-gray-200 shadow-sm dark:bg-surface-dark dark:border-gray-700/50 flex flex-col transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    {PlatformIcon && <PlatformIcon className={`w-5 h-5 ${platformColor}`} />}
                    <span className="font-semibold text-text-main-light dark:text-text-main-dark">{trend.platform}</span>
                </div>
                <SentimentIndicator sentiment={trend.sentiment} />
            </div>
            <h3 className="text-lg font-bold text-text-main-light mt-3 dark:text-text-main-dark">{trend.topic}</h3>
            <div className="text-sm text-text-muted-light mt-1 dark:text-text-muted-dark">
                Current Volume: <span className="font-semibold text-text-main-light dark:text-text-main-dark">{latestVolume.toLocaleString()}</span>
            </div>
            
            <div className="mt-4 flex-grow">
                <h4 className="text-xs font-semibold text-text-muted-light mb-2 dark:text-text-muted-dark uppercase tracking-wider">12-Month Trend</h4>
                <TrendChart data={trend.historicalData} />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-text-muted-light mb-2 dark:text-text-muted-dark">Related Keywords</h4>
                <div className="flex flex-wrap gap-2">
                    {trend.relatedKeywords.map(keyword => (
                        <span key={keyword} className="text-xs bg-accent/20 text-yellow-800 font-medium px-2 py-1 rounded-full transition-colors duration-200 hover:bg-accent hover:text-yellow-900 dark:bg-accent/20 dark:text-accent dark:hover:bg-accent dark:hover:text-yellow-900">{keyword}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};


const TrendDiscovery: React.FC<TrendDiscoveryProps> = ({ trends }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {trends.map((trend, index) => (
            <TrendCard key={index} trend={trend} />
        ))}
    </div>
  );
};

export default TrendDiscovery;