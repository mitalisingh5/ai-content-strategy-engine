import React from 'react';
import type { Competitor } from '../types';
import Card from './Card';
import { CompetitorIcon, TwitterIcon, YouTubeIcon, RedditIcon } from './Icons';
import { Platform } from '../types';

interface CompetitorTrackerProps {
  competitors: Competitor[];
}

const PlatformIcon: React.FC<{ platform: Platform }> = ({ platform }) => {
  switch (platform) {
    case Platform.Twitter:
      return <TwitterIcon className="w-4 h-4 text-sky-400" />;
    case Platform.YouTube:
      return <YouTubeIcon className="w-4 h-4 text-red-500" />;
    case Platform.Reddit:
      return <RedditIcon className="w-4 h-4 text-orange-500" />;
    default:
      return null;
  }
};

const CompetitorTracker: React.FC<CompetitorTrackerProps> = ({ competitors }) => {
  return (
    <Card title="Competitor Tracker" icon={<CompetitorIcon className="w-6 h-6 text-accent" />}>
      <div className="space-y-4">
        {competitors.map((competitor, index) => (
          <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-700/50 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <PlatformIcon platform={competitor.platform} />
                <h4 className="font-bold text-text-main ml-2 dark:text-gray-100">{competitor.handle}</h4>
              </div>
              <span className="text-xs font-medium text-text-muted dark:text-gray-400">{competitor.postFrequency}</span>
            </div>
            <p className="text-sm mb-2 text-text-main dark:text-gray-200"><strong className="font-semibold">Topic Focus:</strong> {competitor.topicFocus.join(', ')}</p>
            <p className="text-sm bg-gray-100 p-2 rounded-md text-text-muted dark:bg-gray-700 dark:text-gray-400"><strong className="font-semibold text-text-main dark:text-gray-200">Performance:</strong> {competitor.performance}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CompetitorTracker;