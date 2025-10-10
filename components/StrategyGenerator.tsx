import React from 'react';
import type { StrategyPlan } from '../types';
import Card from './Card';
import CalendarView from './CalendarView';
import { StrategyIcon, TagIcon } from './Icons';

interface StrategyGeneratorProps {
  plan: StrategyPlan;
}

const StrategyGenerator: React.FC<StrategyGeneratorProps> = ({ plan }) => {
  return (
    <Card title="Strategy Plan" icon={<StrategyIcon className="w-6 h-6 text-primary" />}>
      <div className="space-y-4">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 dark:bg-dark-bg dark:border-gray-700">
            <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Suggested Blog Title</p>
            <p className="font-semibold text-text-main-light dark:text-text-main-dark">{plan.blogTitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 dark:bg-dark-bg dark:border-gray-700">
                <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Post Frequency</p>
                <p className="font-semibold text-text-main-light dark:text-text-main-dark">{plan.postFrequency}</p>
            </div>
             <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 dark:bg-dark-bg dark:border-gray-700">
                <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-2">Suggested Formats</p>
                <div className="flex flex-wrap gap-2">
                    {plan.suggestedFormats.map((format, index) => (
                        <span key={index} className="flex items-center px-2 py-1 bg-accent/20 text-yellow-800 text-xs font-medium rounded-full transition-colors duration-200 hover:bg-accent hover:text-yellow-900 dark:bg-accent/20 dark:hover:bg-accent dark:hover:text-yellow-900">
                            <TagIcon className="w-3 h-3 mr-1"/>
                            {format}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        <div>
            <h4 className="text-lg font-bold text-text-main-light mt-6 mb-2 dark:text-text-main-dark">30-Day Content Calendar</h4>
            <CalendarView calendarData={plan.calendar} />
        </div>
      </div>
    </Card>
  );
};

export default StrategyGenerator;