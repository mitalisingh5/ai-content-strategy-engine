import React from 'react';
import type { ContentAnalysis } from '../types';
import Card from './Card';
import { AnalyzeIcon, CheckCircleIcon } from './Icons';

interface ContentAnalyzerProps {
  analysis: ContentAnalysis;
}

const InfoItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700/50 dark:border-gray-700">
        <p className="text-sm font-medium text-text-muted dark:text-gray-400">{label}</p>
        <p className="font-semibold text-text-main dark:text-gray-100">{value}</p>
    </div>
);

const ContentAnalyzer: React.FC<ContentAnalyzerProps> = ({ analysis }) => {
  return (
    <Card title="High-Performer Breakdown" icon={<AnalyzeIcon className="w-6 h-6 text-accent" />}>
      <div className="grid grid-cols-2 gap-4">
        <InfoItem label="Top Format" value={analysis.format} />
        <InfoItem label="Best Time to Post" value={analysis.bestTime} />
        <InfoItem label="Hook Style" value={analysis.hookStyle} />
        <InfoItem label="Recommended Tone" value={analysis.tone} />
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-text-muted dark:text-gray-400 mb-2">Engagement Triggers</p>
        <ul className="space-y-2">
            {analysis.engagementTriggers.map((trigger, index) => (
                <li key={index} className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-text-main dark:text-gray-200">{trigger}</span>
                </li>
            ))}
        </ul>
      </div>
    </Card>
  );
};

export default ContentAnalyzer;