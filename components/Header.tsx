import React from 'react';
import type { User } from '../types';
import type { View } from '../App';
import { UserIcon, LogoutIcon, SunIcon, MoonIcon } from './Icons';

interface HeaderProps {
    activeView: View;
    onNavigate: (view: View) => void;
    user: User | null;
    onLogout: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

const NavLink: React.FC<{label: string; isActive: boolean; onClick: () => void;}> = ({ label, isActive, onClick }) => {
    return (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-primary font-semibold' : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-main-light dark:hover:text-text-main-dark'}`}
        >
            {label}
        </a>
    );
};


const Header: React.FC<HeaderProps> = ({ activeView, onNavigate, user, onLogout, theme, onToggleTheme }) => {
    const navItems: { id: View; label: string; }[] = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'trendExplorer', label: 'Trend Explorer' },
        { id: 'contentAnalyzer', label: 'Content Analyzer' },
        { id: 'strategyGenerator', label: 'Strategy Generator' },
    ];

    return (
        <header className="bg-surface-light border-b border-gray-200 dark:bg-surface-dark dark:border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                           <span className="text-xl font-bold text-primary dark:text-primary">AI Strategy Engine</span>
                        </div>
                        <nav className="hidden md:flex items-center ml-10 space-x-4">
                            {navItems.map(item => (
                                <NavLink
                                    key={item.id}
                                    label={item.label}
                                    isActive={activeView === item.id}
                                    onClick={() => onNavigate(item.id)}
                                />
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                         <button 
                            onClick={onToggleTheme}
                            className="p-2 rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-white/10"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5 text-yellow-400" />}
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-text-muted-light dark:text-text-muted-dark" />
                            </div>
                            <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Hello, <span className="font-semibold text-text-main-light dark:text-text-main-dark">{user?.username}</span></span>
                        </div>
                         <button 
                            onClick={onLogout}
                            className="p-2 rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-white/10"
                            aria-label="Logout"
                        >
                            <LogoutIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;