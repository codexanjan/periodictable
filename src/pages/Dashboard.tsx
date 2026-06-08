import React, { useMemo } from 'react';
import type { ChemicalElement } from '../types/element';
import { CATEGORY_COLORS } from '../types/element';
import { getElementCategory } from '../utils/elementHelpers';
import elementsData from '../data/elements.json';
import { Award, Heart, BookOpen, Clock, ShieldCheck, Flame } from 'lucide-react';

interface DashboardProps {
  xp: number;
  favorites: number[];
  unlockedElements: number[];
  recentlyViewed: number[];
  onElementClick: (element: ChemicalElement) => void;
}

interface Badge {
  id: string;
  name: string;
  desc: string;
  unlocked: boolean;
  color: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  xp,
  favorites,
  unlockedElements,
  recentlyViewed,
  onElementClick,
}) => {
  const elements = elementsData as ChemicalElement[];

  // Calculate Level based on XP: 150 XP per level
  const userLevel = Math.floor(xp / 150) + 1;
  const currentXPInLevel = xp % 150;
  const xpPercentage = (currentXPInLevel / 150) * 100;

  // Filter elements to get favorites objects
  const favoriteElementsList = useMemo(() => {
    return elements.filter((e) => favorites.includes(e.number));
  }, [elements, favorites]);

  // Filter elements to get recently viewed objects (limit to 5)
  const recentlyViewedList = useMemo(() => {
    return recentlyViewed
      .map((num) => elements.find((e) => e.number === num))
      .filter((e): e is ChemicalElement => e !== undefined)
      .slice(0, 5);
  }, [elements, recentlyViewed]);

  // Badge Unlock Rules
  const badges = useMemo((): Badge[] => {
    // 1. Alkali Architect: Unlock at least 3 alkali metals
    const alkalisUnlocked = unlockedElements.filter((num) => {
      const e = elements.find((x) => x.number === num);
      return e ? getElementCategory(e) === 'alkali' : false;
    }).length;

    // 2. Noble Navigator: Unlock at least 3 noble gases
    const noblesUnlocked = unlockedElements.filter((num) => {
      const e = elements.find((x) => x.number === num);
      return e ? getElementCategory(e) === 'noble' : false;
    }).length;

    // 3. Halogen Hero: Unlock at least 3 halogens
    const halogensUnlocked = unlockedElements.filter((num) => {
      const e = elements.find((x) => x.number === num);
      return e ? getElementCategory(e) === 'halogen' : false;
    }).length;

    // 4. Transition Titan: Unlock at least 5 transition metals
    const transitionUnlocked = unlockedElements.filter((num) => {
      const e = elements.find((x) => x.number === num);
      return e ? getElementCategory(e) === 'transition' : false;
    }).length;

    return [
      {
        id: 'newbie',
        name: 'Curious Catalyst',
        desc: 'Unlock your first chemical element.',
        unlocked: unlockedElements.length > 0,
        color: 'from-blue-500 to-cyan-400 border-blue-500/30 text-blue-500',
      },
      {
        id: 'explorer',
        name: 'Element Explorer',
        desc: 'Unlock 10 elements in the periodic game.',
        unlocked: unlockedElements.length >= 10,
        color: 'from-emerald-500 to-teal-400 border-emerald-500/30 text-emerald-500',
      },
      {
        id: 'alkali',
        name: 'Alkali Architect',
        desc: 'Unlock 3 Alkali Metals.',
        unlocked: alkalisUnlocked >= 3,
        color: 'from-red-500 to-orange-400 border-red-500/30 text-red-500',
      },
      {
        id: 'noble',
        name: 'Noble Navigator',
        desc: 'Unlock 3 Noble Gases.',
        unlocked: noblesUnlocked >= 3,
        color: 'from-indigo-500 to-violet-400 border-indigo-500/30 text-indigo-500',
      },
      {
        id: 'halogen',
        name: 'Halogen Hero',
        desc: 'Unlock 3 Halogens.',
        unlocked: halogensUnlocked >= 3,
        color: 'from-cyan-500 to-blue-400 border-cyan-500/30 text-cyan-500',
      },
      {
        id: 'transition',
        name: 'Transition Titan',
        desc: 'Unlock 5 Transition Metals.',
        unlocked: transitionUnlocked >= 5,
        color: 'from-yellow-500 to-amber-400 border-yellow-500/30 text-yellow-500',
      },
      {
        id: 'level3',
        name: 'Master Chemist',
        desc: 'Reach Student Level 3 (300+ XP).',
        unlocked: userLevel >= 3,
        color: 'from-purple-500 to-pink-400 border-purple-500/30 text-purple-500',
      },
    ];
  }, [elements, unlockedElements, userLevel]);

  return (
    <div className="w-full flex flex-col space-y-8 text-left">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">
          Student Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track your progress, view study achievements, and access favorite elements.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level and XP */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                Student Rank
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                Level {userLevel}
              </h2>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <Flame className="w-6 h-6 fill-current animate-pulse" />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              <span>XP: {currentXPInLevel} / 150</span>
              <span>Total: {xp} XP</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-medium mt-2 block">
              Earn {150 - currentXPInLevel} more XP to reach Level {userLevel + 1}!
            </span>
          </div>
        </div>

        {/* Unlock Progress */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                Database Progress
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {unlockedElements.length} / 118
              </h2>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              <span>Elements Unlocked</span>
              <span>{Math.round((unlockedElements.length / 118) * 100)}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                style={{ width: `${(unlockedElements.length / 118) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-medium mt-2 block">
              Unlock elements by playing the Quiz mode game!
            </span>
          </div>
        </div>

        {/* Favorite count */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                Study Lists
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {favorites.length} Saved
              </h2>
            </div>
            <div className="p-3 rounded-2xl bg-red-500/10 text-red-500">
              <Heart className="w-6 h-6 fill-current" />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              You have pinned {favorites.length} chemical elements as favorites. Open them quickly in the section below.
            </p>
          </div>
        </div>
      </div>

      {/* Chemists Badges Achievements */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <Award className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Chemist Badges ({badges.filter((b) => b.unlocked).length} / {badges.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`
                flex items-start p-4 border rounded-2xl transition-all duration-300
                ${
                  badge.unlocked
                    ? 'bg-slate-50 dark:bg-slate-950/25 border-indigo-500/20 shadow-md scale-100'
                    : 'bg-slate-100/40 dark:bg-slate-900/10 border-slate-200 dark:border-slate-800/40 opacity-40'
                }
              `}
            >
              <div
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-sm
                  ${
                    badge.unlocked
                      ? 'bg-gradient-to-tr text-white font-black'
                      : 'bg-slate-200 dark:bg-slate-900 text-slate-400'
                  }
                  ${badge.color}
                `}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {badge.name}
                </h4>
                <p className="text-[10px] text-slate-550 dark:text-slate-400 leading-normal mt-0.5">
                  {badge.desc}
                </p>
                {badge.unlocked ? (
                  <span className="text-[8px] font-black uppercase text-indigo-500 tracking-wider mt-1 block">
                    Unlocked
                  </span>
                ) : (
                  <span className="text-[8px] font-bold uppercase text-slate-400 tracking-wider mt-1 block">
                    Locked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Lists: Favorites & Recently Viewed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Favorites list */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            <Heart className="w-4.5 h-4.5 text-red-500 fill-current" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              My Favorite Elements
            </h3>
          </div>

          {favoriteElementsList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {favoriteElementsList.map((elem) => {
                const cat = getElementCategory(elem);
                const colClass = CATEGORY_COLORS[cat];
                return (
                  <div
                    key={elem.number}
                    onClick={() => onElementClick(elem)}
                    className={`
                      flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer hover:scale-105 transition duration-200
                      ${colClass}
                    `}
                  >
                    <span className="text-xs font-extrabold opacity-60">{elem.number}</span>
                    <span className="text-sm font-black">{elem.symbol}</span>
                    <span className="text-xs font-bold truncate">{elem.name}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-450 dark:text-slate-500">
              No favorite elements saved yet. Click the heart icon inside any element modal to save.
            </div>
          )}
        </div>

        {/* Recently viewed list */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            <Clock className="w-4.5 h-4.5 text-indigo-500" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Recently Viewed Elements
            </h3>
          </div>

          {recentlyViewedList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {recentlyViewedList.map((elem) => {
                const cat = getElementCategory(elem);
                const colClass = CATEGORY_COLORS[cat];
                return (
                  <div
                    key={elem.number}
                    onClick={() => onElementClick(elem)}
                    className={`
                      flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer hover:scale-105 transition duration-200
                      ${colClass}
                    `}
                  >
                    <span className="text-xs font-extrabold opacity-60">{elem.number}</span>
                    <span className="text-sm font-black">{elem.symbol}</span>
                    <span className="text-xs font-bold truncate">{elem.name}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-450 dark:text-slate-500">
              Your recently viewed elements will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
