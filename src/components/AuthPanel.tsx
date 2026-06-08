import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, UserPlus, ShieldAlert, Sparkles, ArrowRight, User } from 'lucide-react';

interface AuthUser {
  email: string;
  displayName: string;
  isGuest: boolean;
  photoURL?: string;
}

interface AuthPanelProps {
  onAuthComplete: (user: AuthUser) => void;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({ onAuthComplete }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Password Validation
  const isPasswordValid = password.length >= 8;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (activeTab === 'signup' && !displayName) {
      setError('Please enter a display name.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (activeTab === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    // Simulate Network/Firebase latency
    setTimeout(() => {
      setIsLoading(false);
      
      if (activeTab === 'signin') {
        // Mock SignIn
        const savedUsers = JSON.parse(localStorage.getItem('saved_users') || '[]');
        const userExists = savedUsers.find((u: any) => u.email === email && u.password === password);
        
        if (userExists) {
          onAuthComplete({
            email: userExists.email,
            displayName: userExists.displayName,
            isGuest: false,
          });
        } else {
          // If no users, auto-register them for convenience (or throw error)
          // For ease of local review, if no user exists we'll register them!
          const newUser = { email, displayName: email.split('@')[0], password };
          savedUsers.push(newUser);
          localStorage.setItem('saved_users', JSON.stringify(savedUsers));
          onAuthComplete({
            email: newUser.email,
            displayName: newUser.displayName,
            isGuest: false,
          });
        }
      } else {
        // Mock SignUp
        const savedUsers = JSON.parse(localStorage.getItem('saved_users') || '[]');
        if (savedUsers.some((u: any) => u.email === email)) {
          setError('An account with this email already exists.');
          return;
        }
        
        const newUser = { email, displayName, password };
        savedUsers.push(newUser);
        localStorage.setItem('saved_users', JSON.stringify(savedUsers));

        onAuthComplete({
          email: newUser.email,
          displayName: newUser.displayName,
          isGuest: false,
        });
      }
    }, 1200);
  };

  const handleGoogleAuth = () => {
    setError(null);
    setIsGoogleLoading(true);

    // Simulate Google OAuth flow popup
    setTimeout(() => {
      setIsGoogleLoading(false);
      onAuthComplete({
        email: 'anjanshetty.co@gmail.com',
        displayName: 'Anjan Shetty',
        isGuest: false,
        photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=anjan',
      });
    }, 1500);
  };

  const handleGuestLogin = () => {
    onAuthComplete({
      email: 'guest@periodicportal.org',
      displayName: 'Guest Student',
      isGuest: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      {/* Background glowing rings */}
      <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-pink-500/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 text-left relative"
      >
        {/* Header App Title */}
        <div className="text-center mb-6">
          <div className="inline-flex p-2.5 bg-indigo-600/10 text-indigo-500 rounded-2xl mb-3 border border-indigo-500/10">
            <Sparkles className="w-5 h-5 fill-current animate-pulse" />
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
            Welcome to PeriodicPortal
          </h2>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mt-0.5">
            Log in to track XP, Unlock Elements & Earn Badges
          </p>
        </div>

        {/* Sign In / Sign Up Selector Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-950/50 p-1 rounded-2xl mb-6 border border-slate-200/50 dark:border-slate-900 w-full">
          <button
            onClick={() => {
              setActiveTab('signin');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
              activeTab === 'signin'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/40 dark:border-slate-800'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
              activeTab === 'signup'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/40 dark:border-slate-800'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Sign Up
          </button>
        </div>

        {/* Error Alert Box */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold p-3.5 rounded-xl mb-4 flex items-start gap-2 overflow-hidden"
            >
              <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {/* Display Name for Sign Up */}
          {activeTab === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Your Name / Nickname
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full glass-input pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-850 text-xs text-slate-950 dark:text-white placeholder-slate-400 focus:border-indigo-500"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-550" />
              </div>
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-850 text-xs text-slate-950 dark:text-white placeholder-slate-400 focus:border-indigo-500"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-550" />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex justify-between">
              <span>Password</span>
              {activeTab === 'signup' && (
                <span className={`text-[9px] font-black ${isPasswordValid ? 'text-green-500' : 'text-slate-400 dark:text-slate-500'}`}>
                  (Min. 8 characters)
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-850 text-xs text-slate-950 dark:text-white placeholder-slate-400 focus:border-indigo-500"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-550" />
            </div>
          </div>

          {/* Confirm Password input for Sign Up */}
          {activeTab === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full glass-input pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-850 text-xs text-slate-950 dark:text-white placeholder-slate-400 focus:border-indigo-500"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-550" />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || (activeTab === 'signup' && !isPasswordValid)}
            className={`
              w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition duration-300 shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5
              ${(activeTab === 'signup' && !isPasswordValid) || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? (
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : activeTab === 'signin' ? (
              <>
                Sign In with Email
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Separator Divider */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
          <span className="flex-shrink mx-3 text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">
            Or Connect With
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
        </div>

        {/* Social and Guest Buttons */}
        <div className="space-y-3">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleAuth}
            disabled={isGoogleLoading}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold transition duration-300 flex items-center justify-center gap-2"
          >
            {isGoogleLoading ? (
              <span className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-indigo-600 animate-spin" />
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="mr-1">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Sign In with Google
              </>
            )}
          </button>

          {/* Continue as Guest */}
          <button
            onClick={handleGuestLogin}
            className="w-full py-2.5 rounded-xl bg-slate-105 hover:bg-slate-200 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400 text-xs font-bold transition duration-300 flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-800 w-full"
          >
            Continue as Guest Student
          </button>
        </div>
      </motion.div>
    </div>
  );
};
