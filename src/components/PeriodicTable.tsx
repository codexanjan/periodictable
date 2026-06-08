import React, { useState, useMemo } from 'react';
import elementsData from '../data/elements.json';
import type { ChemicalElement, UIElementCategory } from '../types/element';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../types/element';
import { ElementCard } from './ElementCard';
import { getElementCategory, searchElements, getElementOfTheDay } from '../utils/elementHelpers';
import { Search, Filter, RefreshCw, Layers } from 'lucide-react';

interface PeriodicTableProps {
  onElementClick: (element: ChemicalElement) => void;
  compareMode: boolean;
  comparedElements: ChemicalElement[];
  onCompareToggle: (element: ChemicalElement) => void;
  showMass?: boolean;
  enableGlow?: boolean;
}

export const PeriodicTable: React.FC<PeriodicTableProps> = ({
  onElementClick,
  compareMode,
  comparedElements,
  onCompareToggle,
  showMass = true,
  enableGlow = true,
}) => {
  const elements = elementsData as ChemicalElement[];

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<UIElementCategory | null>(null);
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [radioactiveFilter, setRadioactiveFilter] = useState(false);
  const [syntheticFilter, setSyntheticFilter] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  // Hover state
  const [hoveredElement, setHoveredElement] = useState<ChemicalElement | null>(null);

  // Default Element of the Day
  const elementOfTheDay = useMemo(() => getElementOfTheDay(elements), [elements]);

  // Check if radioactive helper
  const isRadioactive = (e: ChemicalElement) => {
    return e.number >= 84 || e.number === 43 || e.number === 61;
  };

  // Check if synthetic helper
  const isSynthetic = (e: ChemicalElement) => {
    return e.phase === 'Synthetic' || e.number >= 95;
  };

  // Filter Logic
  const filteredElements = useMemo(() => {
    let result = searchElements(elements, searchQuery);

    if (activeCategory) {
      result = result.filter((e) => getElementCategory(e) === activeCategory);
    }
    if (activePhase) {
      result = result.filter((e) => e.phase === activePhase);
    }
    if (radioactiveFilter) {
      result = result.filter((e) => isRadioactive(e));
    }
    if (syntheticFilter) {
      result = result.filter((e) => isSynthetic(e));
    }
    if (selectedPeriod !== null) {
      result = result.filter((e) => e.period === selectedPeriod);
    }
    if (selectedGroup !== null) {
      result = result.filter((e) => e.group === selectedGroup);
    }

    return result;
  }, [
    elements,
    searchQuery,
    activeCategory,
    activePhase,
    radioactiveFilter,
    syntheticFilter,
    selectedPeriod,
    selectedGroup,
  ]);

  const filteredSet = useMemo(() => new Set(filteredElements.map((e) => e.number)), [filteredElements]);

  // Is any filter active?
  const isFilterActive = !!(
    searchQuery ||
    activeCategory ||
    activePhase ||
    radioactiveFilter ||
    syntheticFilter ||
    selectedPeriod !== null ||
    selectedGroup !== null
  );

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory(null);
    setActivePhase(null);
    setRadioactiveFilter(false);
    setSyntheticFilter(false);
    setSelectedPeriod(null);
    setSelectedGroup(null);
  };

  // Display Element in the center preview panel (hovered element OR element of the day)
  const displayElement = hoveredElement || elementOfTheDay;
  const displayElementCategory = getElementCategory(displayElement);
  const previewColorClass = CATEGORY_COLORS[displayElementCategory] || CATEGORY_COLORS.unknown;

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* 1. Filter and Control Bar */}
      <div className="glass-card rounded-2xl p-4 md:p-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Search Bar */}
          <div className="lg:col-span-4 relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, symbol, number (e.g. Oxygen, O, 8)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input pl-10 pr-4 py-2.5 w-full bg-slate-100/50 dark:bg-slate-950/20 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          {/* Quick Filters */}
          <div className="lg:col-span-8 flex flex-wrap gap-2 md:gap-3 items-center">
            {/* Phase State Filter */}
            <select
              value={activePhase || ''}
              onChange={(e) => setActivePhase(e.target.value || null)}
              className="glass-input py-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="">All States</option>
              <option value="Solid">Solid</option>
              <option value="Liquid">Liquid</option>
              <option value="Gas">Gas</option>
              <option value="Synthetic">Synthetic</option>
            </select>

            {/* Period Filter */}
            <select
              value={selectedPeriod === null ? '' : selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value ? parseInt(e.target.value) : null)}
              className="glass-input py-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="">All Periods</option>
              {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                <option key={p} value={p}>
                  Period {p}
                </option>
              ))}
            </select>

            {/* Group Filter */}
            <select
              value={selectedGroup === null ? '' : selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value ? parseInt(e.target.value) : null)}
              className="glass-input py-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="">All Groups</option>
              {Array.from({ length: 18 }, (_, i) => i + 1).map((g) => (
                <option key={g} value={g}>
                  Group {g}
                </option>
              ))}
            </select>

            {/* Radioactive Toggle */}
            <button
              onClick={() => setRadioactiveFilter(!radioactiveFilter)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 ${
                radioactiveFilter
                  ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-600 dark:text-yellow-400 shadow-sm'
                  : 'bg-slate-100/50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Radioactive
            </button>

            {/* Synthetic Toggle */}
            <button
              onClick={() => setSyntheticFilter(!syntheticFilter)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 ${
                syntheticFilter
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'bg-slate-100/50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Synthetic
            </button>

            {/* Reset Button */}
            {isFilterActive && (
              <button
                onClick={resetFilters}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-all duration-300 text-xs font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Categories Legend Filter */}
        <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Filter by Category (Click to select)
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CATEGORY_LABELS) as UIElementCategory[]).map((cat) => {
              const isActive = activeCategory === cat;
              const isAnyCatSelected = activeCategory !== null;
              const colClass = CATEGORY_COLORS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(isActive ? null : cat)}
                  className={`
                    px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all duration-300
                    ${colClass}
                    ${
                      isAnyCatSelected && !isActive
                        ? 'opacity-40 saturate-50'
                        : 'opacity-100 hover:scale-105 shadow-sm'
                    }
                  `}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Interactive Periodic Table Grid Container */}
      <div className="relative w-full overflow-x-auto pb-4 scrollbar-thin">
        <div className="periodic-table-grid min-w-[1000px] select-none p-1">
          {/* Main Elements */}
          {elements.map((elem) => {
            const isDimmed = isFilterActive && !filteredSet.has(elem.number);
            const isCompared = comparedElements.some((e) => e.number === elem.number);

            return (
              <ElementCard
                key={elem.number}
                element={elem}
                onClick={() => onElementClick(elem)}
                onMouseEnter={() => setHoveredElement(elem)}
                onMouseLeave={() => setHoveredElement(null)}
                isDimmed={isDimmed}
                isCompareMode={compareMode}
                isCompared={isCompared}
                onCompareToggle={(e) => {
                  e.stopPropagation();
                  onCompareToggle(elem);
                }}
                showMass={showMass}
                enableGlow={enableGlow}
              />
            );
          })}

          {/* Programmatic Placeholder: Lanthanides (57-71) in Row 6, Column 3 */}
          <div
            style={{ gridColumn: 3, gridRow: 6 }}
            onClick={() => setActiveCategory(activeCategory === 'lanthanide' ? null : 'lanthanide')}
            className={`
              flex flex-col justify-center items-center text-center p-1 border border-dashed rounded-md cursor-pointer transition-all duration-300 h-[56px] sm:h-[64px] md:h-[72px] lg:h-[76px] xl:h-[80px]
              border-pink-500/40 text-pink-500 hover:bg-pink-500/10 hover:border-pink-500/80
              ${activeCategory === 'lanthanide' ? 'bg-pink-500/20 border-solid scale-105' : 'bg-transparent'}
              ${isFilterActive && activeCategory !== 'lanthanide' ? 'opacity-30' : 'opacity-100'}
            `}
          >
            <span className="text-[10px] sm:text-xs font-extrabold leading-none">57-71</span>
            <span className="text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase tracking-wide leading-tight mt-0.5">
              La-Lu
            </span>
            <span className="hidden sm:inline text-[6px] md:text-[7px] opacity-70 leading-none">Lanthanides</span>
          </div>

          {/* Programmatic Placeholder: Actinides (89-103) in Row 7, Column 3 */}
          <div
            style={{ gridColumn: 3, gridRow: 7 }}
            onClick={() => setActiveCategory(activeCategory === 'actinide' ? null : 'actinide')}
            className={`
              flex flex-col justify-center items-center text-center p-1 border border-dashed rounded-md cursor-pointer transition-all duration-300 h-[56px] sm:h-[64px] md:h-[72px] lg:h-[76px] xl:h-[80px]
              border-purple-500/40 text-purple-500 hover:bg-purple-500/10 hover:border-purple-500/80
              ${activeCategory === 'actinide' ? 'bg-purple-500/20 border-solid scale-105' : 'bg-transparent'}
              ${isFilterActive && activeCategory !== 'actinide' ? 'opacity-30' : 'opacity-100'}
            `}
          >
            <span className="text-[10px] sm:text-xs font-extrabold leading-none">89-103</span>
            <span className="text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase tracking-wide leading-tight mt-0.5">
              Ac-Lr
            </span>
            <span className="hidden sm:inline text-[6px] md:text-[7px] opacity-70 leading-none">Actinides</span>
          </div>

          {/* 3. Center Dashboard Preview Panel (placed in rows 1-3, columns 3-12) */}
          <div
            style={{ gridColumn: '3 / span 10', gridRow: '1 / span 3' }}
            className={`
              hidden md:flex flex-row items-center justify-between p-4 rounded-xl border transition-all duration-500 border-indigo-500/15
              ${previewColorClass} bg-white/70 dark:bg-slate-900/65 backdrop-blur-md relative overflow-hidden group
            `}
          >
            {/* Neon Accent Blur */}
            <div className="absolute -top-12 -left-12 w-28 h-28 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full filter blur-xl transition-all duration-500" />
            
            {/* Top-Right Badge: Element of the Day vs Hover */}
            <div className="absolute top-3 right-3 flex items-center space-x-2">
              <span className="text-[9px] uppercase tracking-widest font-black bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
                {hoveredElement ? 'Quick Inspect' : 'Element of the Day'}
              </span>
            </div>

            {/* Left Box: Huge Symbol and Atomic Number */}
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center justify-center p-3 w-20 h-20 rounded-xl bg-slate-900/10 dark:bg-white/5 border border-white/10 flex-shrink-0">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 -mb-1">{displayElement.number}</span>
                <span className="text-3xl font-black tracking-tight">{displayElement.symbol}</span>
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold tracking-tight leading-none mb-1 text-slate-900 dark:text-white">
                  {displayElement.name}
                </h2>
                <span className="text-xs opacity-75 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {CATEGORY_LABELS[displayElementCategory] || CATEGORY_LABELS.unknown}
                </span>
                <div className="flex items-center space-x-3 mt-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  <span>Mass: <b>{displayElement.atomic_mass.toFixed(3)}</b></span>
                  <span>|</span>
                  <span>Phase: <b>{displayElement.phase}</b></span>
                </div>
              </div>
            </div>

            {/* Middle/Right Box: Element Summary and Discoverer */}
            <div className="flex-1 max-w-[50%] flex flex-col text-left pl-6 border-l border-slate-200/50 dark:border-slate-800/50 h-full justify-center">
              <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {displayElement.summary}
              </p>
              <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-slate-500 dark:text-slate-400">
                <span>Discovery: <b>{displayElement.discovered_by || 'Unknown'}</b></span>
                {displayElement.year_discovered && (
                  <>
                    <span>•</span>
                    <span>Year: <b>{displayElement.year_discovered}</b></span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
