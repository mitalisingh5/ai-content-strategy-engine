import React, { useState } from 'react';
import { GoogleIcon, GitHubIcon, EyeIcon, EyeSlashIcon, AiStrategyIcon } from '../components/Icons';

type AuthMode = 'signin' | 'signup';

interface LoginPageProps {
  onSignIn: (email: string, password: string) => Promise<string | void>;
  onSignUp: (username: string, email: string, password: string, source: string) => Promise<string | void>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSignIn, onSignUp }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [source, setSource] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    let authError: string | void;
    try {
      if (mode === 'signup') {
        authError = await onSignUp(username.trim(), email.trim(), password, source);
      } else {
        authError = await onSignIn(email.trim(), password);
      }
      if (authError) {
        setError(authError);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSocialLogin = (provider: string) => {
      alert(`${provider} login is not implemented in this demo.`);
  };

  const toggleMode = () => {
    setMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setError(null);
    setUsername('');
    setEmail('');
    setPassword('');
    setSource('');
  };
  
  const SocialButton: React.FC<{provider: 'Google' | 'GitHub', icon: React.ReactNode}> = ({ provider, icon }) => (
    <button
        type="button"
        onClick={() => handleSocialLogin(provider)}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
    >
        {icon}
        <span className="text-sm font-medium text-gray-700">Sign in with {provider}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-light-bg text-text-main-light flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 bg-dark-panel text-text-on-dark p-8 sm:p-12 flex flex-col justify-between min-h-[40vh] md:min-h-screen">
        <div className="flex items-center gap-3">
            <AiStrategyIcon className="w-10 h-10 text-text-on-dark"/>
            <span className="font-bold text-xl">AI Strategy Engine</span>
        </div>
        <div className="my-12">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                Power Your Content Strategy with AI
            </h1>
            <p className="mt-4 text-lg text-text-on-dark/80 max-w-md">
                Log in to discover trends, analyze content, track competitors, and generate complete content strategies from a unified dashboard.
            </p>
            <div className="mt-8 rounded-lg overflow-hidden shadow-2xl aspect-video">
                <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                    alt="Team working on laptops in a modern office"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
        <div className="text-sm text-text-on-dark/60">
            Your journey starts here.
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 bg-surface-light p-8 sm:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-text-main-light">
            {mode === 'signin' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="mt-2 text-text-muted-light">
            {mode === 'signin' 
              ? "Don't have an account? " 
              : 'Already have an account? '}
            <button onClick={toggleMode} className="font-semibold text-primary hover:text-primary-focus">
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {mode === 'signup' && (
              <div>
                <label htmlFor="username" className="text-sm font-medium text-text-muted-light">Username</label>
                <input
                  id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" required
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-text-muted-light">Email</label>
              <input
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" required
              />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-medium text-text-muted-light">Password</label>
                {mode === 'signin' && <a href="#" className="text-sm text-primary hover:text-primary-focus">Forgot password?</a>}
              </div>
              <div className="relative mt-1">
                <input
                  id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                </button>
              </div>
            </div>
            {mode === 'signup' && (
                <div>
                    <label htmlFor="source" className="text-sm font-medium text-text-muted-light">How did you hear about us?</label>
                    <select
                        id="source" value={source} onChange={(e) => setSource(e.target.value)}
                        className="mt-1 w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" required
                    >
                        <option value="" disabled>Select an option...</option>
                        <option value="social-media">Social Media</option>
                        <option value="friend">From a Friend</option>
                        <option value="search-engine">Search Engine</option>
                        <option value="advertisement">Advertisement</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            )}

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <div>
              <button
                type="submit" disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
              </button>
            </div>
          </form>

          <div className="mt-6 space-y-4">
            <SocialButton provider="Google" icon={<GoogleIcon className="w-5 h-5" />} />
            <SocialButton provider="GitHub" icon={<GitHubIcon className="w-5 h-5" />} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;