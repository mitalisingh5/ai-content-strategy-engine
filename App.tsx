import React, { useState, useEffect } from 'react';
import type { FullStrategy, SavedStrategy, UserInput, User } from './types';
import { getSavedStrategies, saveStrategy as saveStrategyToStorage, deleteStrategy as deleteStrategyFromStorage } from './services/storageService';
import { signIn, signUp } from './services/authService';
import Header from './components/Header';
import StrategyGeneratorPage from './pages/StrategyGeneratorPage';
import TrendExplorerPage from './pages/TrendDiscoveryPage';
import ContentAnalyzerPage from './pages/ContentAnalyzerPage';
import Chatbot from './components/Chatbot';
import Modal from './components/Modal';
import SavedStrategiesList from './components/SavedStrategiesList';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

export type View = 'dashboard' | 'trendExplorer' | 'contentAnalyzer' | 'strategyGenerator';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [strategy, setStrategy] = useState<Partial<FullStrategy>>({});
  const [dashboardStrategy, setDashboardStrategy] = useState<SavedStrategy | null>(null);
  const [savedStrategies, setSavedStrategies] = useState<SavedStrategy[]>([]);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedTheme = window.localStorage.getItem('theme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
            return storedTheme;
        }
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  useEffect(() => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('currentUser');
    }
    const strategies = getSavedStrategies();
    setSavedStrategies(strategies);
    // On initial load, set the first saved strategy as the default for the dashboard
    if (strategies.length > 0) {
        setDashboardStrategy(strategies[0]);
    }
  }, []);
  
  const handleDeleteStrategy = (id: string) => {
      deleteStrategyFromStorage(id);
      const updatedStrategies = getSavedStrategies();
      setSavedStrategies(updatedStrategies);
      // If the deleted strategy was the one on the dashboard, clear it or load the next one
      if (dashboardStrategy?.id === id) {
          setDashboardStrategy(updatedStrategies.length > 0 ? updatedStrategies[0] : null);
      }
  };

  const handleLoadStrategy = (saved: SavedStrategy, switchView: boolean = true) => {
      setStrategy(saved.strategy);
      setDashboardStrategy(saved);
      if (switchView) {
        setActiveView('strategyGenerator');
        alert(`Loaded '${saved.name}'. The Strategy Generator form has been pre-filled.`);
        setShowViewModal(false);
      }
  };
  
  const handleStrategyGenerated = (newStrategy: Partial<FullStrategy>, userInput: UserInput) => {
    setStrategy(newStrategy);
  };
  
  const handleSaveStrategy = (strategyToSave: SavedStrategy) => {
    saveStrategyToStorage(strategyToSave);
    const updatedStrategies = getSavedStrategies();
    setSavedStrategies(updatedStrategies);
    // If this is the first strategy being saved, also load it on the dashboard
    if (updatedStrategies.length === 1 && !dashboardStrategy) {
        setDashboardStrategy(updatedStrategies[0]);
    }
    alert(`Strategy '${strategyToSave.name}' saved successfully!`);
  };
  
  const handleSignUp = async (username: string, email: string, password: string, source: string): Promise<string | void> => {
    try {
      const newUser = await signUp(username, email, password, source);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setCurrentUser(newUser);
      setIsAuthenticated(true);
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return 'An unknown error occurred.';
    }
  };

  const handleSignIn = async (email: string, password: string): Promise<string | void> => {
    try {
      const user = await signIn(email, password);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (error) {
       if (error instanceof Error) {
        return error.message;
      }
      return 'An unknown error occurred.';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveView('dashboard');
  };

  if (!isAuthenticated) {
    return <LoginPage onSignIn={handleSignIn} onSignUp={handleSignUp} />;
  }
  
  const renderView = () => {
    switch(activeView) {
      case 'dashboard':
          return <DashboardPage 
                    setView={setActiveView} 
                    savedStrategies={savedStrategies}
                    strategy={dashboardStrategy}
                    onLoad={handleLoadStrategy}
                    onDelete={handleDeleteStrategy}
                  />;
      case 'strategyGenerator':
        return <StrategyGeneratorPage user={currentUser} onStrategyGenerated={handleStrategyGenerated} onSaveStrategy={handleSaveStrategy} />;
      case 'trendExplorer':
        return <TrendExplorerPage user={currentUser} trends={strategy.trendingTopics} />;
      case 'contentAnalyzer':
        return <ContentAnalyzerPage user={currentUser} />;
      default:
        return <DashboardPage 
                  setView={setActiveView} 
                  savedStrategies={savedStrategies}
                  strategy={dashboardStrategy}
                  onLoad={handleLoadStrategy}
                  onDelete={handleDeleteStrategy}
                />;
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg font-sans text-text-main-light dark:text-text-main-dark">
      <Header 
        activeView={activeView} 
        onNavigate={setActiveView} 
        user={currentUser}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main>
        {renderView()}
      </main>
      <Chatbot />
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Saved Strategies">
        <SavedStrategiesList strategies={savedStrategies} onLoad={handleLoadStrategy} onDelete={handleDeleteStrategy} />
      </Modal>
    </div>
  );
};

export default App;