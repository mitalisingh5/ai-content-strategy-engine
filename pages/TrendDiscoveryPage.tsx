import React from 'react';
import type { Trend, User } from '../types';
import TrendDiscovery from '../components/TrendDiscovery';
import { SearchIcon } from '../components/Icons';

interface TrendExplorerPageProps {
  trends: Trend[] | undefined;
  user: User | null;
}

const TrendExplorerPage: React.FC<TrendExplorerPageProps> = ({ trends, user }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-text-main dark:text-gray-50">Trend Explorer</h1>
        <p className="text-text-muted dark:text-gray-400 mt-1">
          Welcome, <span className="font-bold text-text-main dark:text-gray-100">{user?.username}</span>! Discover what's trending across platforms in real-time.
        </p>
      </header>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-8 max-w-7xl mx-auto dark:bg-surface-dark dark:border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search trends..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-gray-50 dark:bg-surface-dark dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <select className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-gray-50 dark:bg-surface-dark dark:border-gray-600 dark:text-white">
            <option>All Industries</option>
            <option>Technology</option>
            <option>Fashion</option>
            <option>Fitness</option>
            <option>Beauty</option>
            <option>Others</option>
          </select>
          <select className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-gray-50 dark:bg-surface-dark dark:border-gray-600 dark:text-white">
            <option>All Platforms</option>
            <option>Twitter</option>
            <option>Instagram</option>
            <option>TikTok</option>
            <option>YouTube</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {trends && trends.length > 0 ? (
          <TrendDiscovery trends={trends} />
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-lg border border-gray-200 dark:bg-surface-dark dark:border-gray-700/50">
              <h3 className="text-xl font-semibold text-text-main dark:text-gray-100">No trends to display</h3>
              <p className="text-text-muted dark:text-gray-400 mt-2">Generate a new strategy in the 'Strategy Generator' tab to see the latest trends here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendExplorerPage;