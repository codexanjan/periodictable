import { useState } from 'react';
import { PeriodicTable } from './components/PeriodicTable';
import { ComparePanel } from './components/ComparePanel';
import { ElementModal } from './components/ElementModal';
import { Learn } from './pages/Learn';
import { Quiz } from './pages/Quiz';
import { Dashboard } from './pages/Dashboard';
import { AIAssistant } from './pages/AIAssistant';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { IntroSplash } from './components/IntroSplash';
import { AuthPanel } from './components/AuthPanel';
import type { ChemicalElement } from './types/element';
import {
  Atom,
  Grid,
  BookOpen,
  HelpCircle,
  User,
  Sparkles,
  Sun,
  Moon,
  Scale,
  Award,
  Settings,
  LogOut,
} from 'lucide-react';

type Tab = 'table' | 'learn' | 'quiz' | 'dashboard' | 'assistant';

function MainApp() {
  const { theme, toggleTheme, user, login, logout } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('table');
  const [showSplash, setShowSplash] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showMass, setShowMass] = useState(true);
  const [enableGlow, setEnableGlow] = useState(true);

  // --- GLOBAL PERSISTED USER STATS ---
  const [xp, setXP] = useState<number>(() => {
    return parseInt(localStorage.getItem('student_xp') || '0');
  });

  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('student_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [unlockedElements, setUnlockedElements] = useState<number[]>(() => {
    const saved = localStorage.getItem('student_unlocked');
    // Onboarding seed: unlock Hydrogen (1) and Helium (2) by default
    return saved ? JSON.parse(saved) : [1, 2];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<number[]>(() => {
    const saved = localStorage.getItem('student_recent');
    return saved ? JSON.parse(saved) : [];
  });

  // --- CORE INTERACTION STATE ---
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Element Comparison
  const [compareMode, setCompareMode] = useState(false);
  const [comparedElements, setComparedElements] = useState<ChemicalElement[]>([]);

  // Sync state changes to LocalStorage
  const handleAddXP = (amount: number) => {
    setXP((prev) => {
      const updated = prev + amount;
      localStorage.setItem('student_xp', updated.toString());
      return updated;
    });
  };

  const handleUnlockElement = (num: number) => {
    setUnlockedElements((prev) => {
      if (prev.includes(num)) return prev;
      const updated = [...prev, num];
      localStorage.setItem('student_unlocked', JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleFavorite = (num: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num];
      localStorage.setItem('student_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const handleElementClick = (element: ChemicalElement) => {
    setSelectedElement(element);
    setIsModalOpen(true);

    // Track recently viewed
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((n) => n !== element.number);
      const updated = [element.number, ...filtered].slice(0, 5);
      localStorage.setItem('student_recent', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCompareToggle = (element: ChemicalElement) => {
    setComparedElements((prev) => {
      const exists = prev.some((e) => e.number === element.number);
      if (exists) {
        return prev.filter((e) => e.number !== element.number);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 elements at a time.');
        return prev;
      }
      return [...prev, element];
    });
  };

  const clearCompared = () => {
    setComparedElements([]);
  };

  // Level computation: 150 XP per level
  const userLevel = Math.floor(xp / 150) + 1;

  if (showSplash) {
    return <IntroSplash onComplete={() => setShowSplash(false)} />;
  }

  if (!user) {
    return <AuthPanel onAuthComplete={(newUser) => login(newUser)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans antialiased">
      {/* Navbar Header */}
      <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-3 md:px-8 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('table')}>
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/30">
            <Atom className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-500 bg-clip-text text-transparent">
              PeriodicPortal
            </span>
            <span className="hidden sm:inline text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 block leading-none tracking-widest mt-0.5">
              Interactive Lab
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1.5">
          {[
            { id: 'table', label: 'Periodic Table', icon: Grid },
            { id: 'learn', label: 'Learn & Trends', icon: BookOpen },
            { id: 'quiz', label: 'Quizzes & Games', icon: HelpCircle },
            { id: 'dashboard', label: 'Dashboard', icon: User },
            { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300
                  ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Global Controls: Level, Compare Mode, Theme Toggle */}
        <div className="flex items-center space-x-3">
          {/* Student Rank Badge */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer hover:scale-105 transition"
            title="Your Level progress. Click to view Dashboard."
          >
            <Award className="w-3.5 h-3.5" />
            <span>Lvl {userLevel}</span>
          </div>

          {/* Toggle Compare Mode */}
          {activeTab === 'table' && (
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                if (compareMode) clearCompared();
              }}
              className={`
                px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5
                ${
                  compareMode
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-500 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }
              `}
            >
              <Scale className="w-3.5 h-3.5" />
              Compare Mode
            </button>
          )}

          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80 shadow-sm transition"
            title={theme === 'dark' ? 'Switch to Educational Light Mode' : 'Switch to Neon Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800/80 shadow-sm transition"
            title="App Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile / Logout Button */}
          {user && (
            <div className="flex items-center space-x-2 border-l border-slate-200/50 dark:border-slate-800/50 pl-3">
              <div className="flex flex-col text-right hidden lg:block">
                <span className="text-[10px] font-black leading-none text-slate-700 dark:text-slate-300">
                  {user.displayName}
                </span>
                <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 leading-none">
                  {user.isGuest ? 'Guest Student' : 'Verified'}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 shadow-sm transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Header navigation dropdown */}
      <div className="md:hidden flex items-center justify-around bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50 py-2.5 px-2">
        {[
          { id: 'table', icon: Grid, label: 'Table' },
          { id: 'learn', icon: BookOpen, label: 'Learn' },
          { id: 'quiz', icon: HelpCircle, label: 'Quiz' },
          { id: 'dashboard', icon: User, label: 'Stats' },
          { id: 'assistant', icon: Sparkles, label: 'AI' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`
                flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors
                ${isSelected ? 'text-indigo-500' : 'text-slate-400'}
              `}
            >
              <Icon className="w-4.5 h-4.5" />
              <span className="text-[9px] font-bold tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:px-8 space-y-6">
        {/* Render Active Tab */}
        {activeTab === 'table' && (
          <div className="flex flex-col space-y-6 animate-fade-in">
            {/* Compare Drawer (shows up if compare elements selected) */}
            {comparedElements.length > 0 && (
              <ComparePanel
                comparedElements={comparedElements}
                onRemoveElement={handleCompareToggle}
                onClearAll={clearCompared}
                onElementClick={handleElementClick}
              />
            )}
            <PeriodicTable
              onElementClick={handleElementClick}
              compareMode={compareMode}
              comparedElements={comparedElements}
              onCompareToggle={handleCompareToggle}
              showMass={showMass}
              enableGlow={enableGlow}
            />
          </div>
        )}

        {activeTab === 'learn' && <Learn onElementClick={handleElementClick} />}

        {activeTab === 'quiz' && (
          <Quiz
            onAddXP={handleAddXP}
            unlockedElements={unlockedElements}
            onUnlockElement={handleUnlockElement}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            xp={xp}
            favorites={favorites}
            unlockedElements={unlockedElements}
            recentlyViewed={recentlyViewed}
            onElementClick={handleElementClick}
          />
        )}

        {activeTab === 'assistant' && <AIAssistant />}
      </main>

      {/* Detail Modal */}
      {selectedElement && (
        <ElementModal
          element={selectedElement}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          comparedElements={comparedElements}
          onCompareToggle={handleCompareToggle}
        />
      )}

      {/* Footer */}
      <footer className="w-full py-6 mt-12 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 text-center text-xs text-slate-400 dark:text-slate-500 font-bold">
        <span>© {new Date().getFullYear()} PeriodicPortal. Developed for science students and educators.</span>
      </footer>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-left">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">
              Lab Settings
            </h3>
            
            <div className="space-y-4 mb-6">
              {/* Theme Toggle */}
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/40">
                <div>
                  <span className="text-xs font-bold block">Theme Mode</span>
                  <span className="text-[10px] text-slate-400">Toggle between Dark Mode and Light Mode</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5"
                >
                  {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-indigo-500" /> : <Sun className="w-3.5 h-3.5 text-yellow-500" />}
                  <span className="capitalize">{theme} Theme</span>
                </button>
              </div>

              {/* Show Atomic Mass */}
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/40">
                <div>
                  <span className="text-xs font-bold block">Display Atomic Mass</span>
                  <span className="text-[10px] text-slate-400">Show or hide atomic weight values on element cards</span>
                </div>
                <button
                  onClick={() => setShowMass(!showMass)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                    showMass ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500' : 'bg-slate-50 dark:bg-slate-950 border-slate-250 dark:border-slate-850 text-slate-400'
                  }`}
                >
                  {showMass ? 'Visible' : 'Hidden'}
                </button>
              </div>

              {/* Enable Card Glows */}
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/40">
                <div>
                  <span className="text-xs font-bold block">Neon Card Glows</span>
                  <span className="text-[10px] text-slate-400">Enable glowing box-shadows on element cells (Dark Mode only)</span>
                </div>
                <button
                  onClick={() => setEnableGlow(!enableGlow)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                    enableGlow ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500' : 'bg-slate-50 dark:bg-slate-950 border-slate-250 dark:border-slate-850 text-slate-400'
                  }`}
                >
                  {enableGlow ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Reset Data Button */}
              <div className="flex justify-between items-center py-2.5">
                <div>
                  <span className="text-xs font-bold text-red-500 block">Reset Laboratory Progress</span>
                  <span className="text-[10px] text-slate-400">Clear all XP, badges, favorites, and unlocked elements</span>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/35 text-red-500 text-xs font-bold hover:bg-red-500/20"
                >
                  Reset All
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-black"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
