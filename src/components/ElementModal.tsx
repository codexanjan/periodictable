import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChemicalElement } from '../types/element';
import { CATEGORY_LABELS, CATEGORY_TEXT_COLORS } from '../types/element';
import { getElementCategory, formatTemperature } from '../utils/elementHelpers';
import { AtomViewer } from './AtomViewer';
import { X, Heart, Plus, Check, Thermometer, Calendar, User, Lightbulb, CheckSquare } from 'lucide-react';

interface ElementModalProps {
  element: ChemicalElement | null;
  isOpen: boolean;
  onClose: () => void;
  favorites: number[];
  onToggleFavorite: (num: number) => void;
  comparedElements: ChemicalElement[];
  onCompareToggle: (element: ChemicalElement) => void;
}

export const ElementModal: React.FC<ElementModalProps> = ({
  element,
  isOpen,
  onClose,
  favorites,
  onToggleFavorite,
  comparedElements,
  onCompareToggle,
}) => {
  // Local state for temperature unit toggle: 'C' | 'F' | 'K'
  const [tempUnit, setTempUnit] = React.useState<'C' | 'F' | 'K'>('C');

  if (!element) return null;

  const category = getElementCategory(element);
  const textColClass = CATEGORY_TEXT_COLORS[category] || CATEGORY_TEXT_COLORS.unknown;
  
  const isFavorite = favorites.includes(element.number);
  const isCompared = comparedElements.some((e) => e.number === element.number);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 scrollbar-thin z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header: Name, Symbol, and Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <div className={`flex flex-col items-center justify-center p-3 w-16 h-16 rounded-2xl border bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white`}>
                  <span className="text-[10px] font-bold opacity-60 leading-none">{element.number}</span>
                  <span className="text-2xl font-black leading-none">{element.symbol}</span>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none m-0 mb-1">
                    {element.name}
                  </h1>
                  <span className={`text-xs uppercase font-extrabold tracking-widest ${textColClass}`}>
                    {CATEGORY_LABELS[category] || CATEGORY_LABELS.unknown}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {/* Favorite Toggle */}
                <button
                  onClick={() => onToggleFavorite(element.number)}
                  className={`
                    flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border
                    ${
                      isFavorite
                        ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
                        : 'bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }
                  `}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
                  {isFavorite ? 'Saved' : 'Favorite'}
                </button>

                {/* Compare Toggle */}
                <button
                  onClick={() => onCompareToggle(element)}
                  className={`
                    flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border
                    ${
                      isCompared
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500 hover:bg-indigo-500/20'
                        : 'bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }
                  `}
                >
                  {isCompared ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isCompared ? 'Compared' : 'Compare'}
                </button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Properties & Educational Content */}
              <div className="flex flex-col space-y-6 text-left">
                {/* Description */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-900">
                    {element.summary}
                  </p>
                </div>

                {/* Physical Properties Grid */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Physical Properties
                    </h3>
                    {/* Temp Unit Selector */}
                    <div className="flex rounded-lg bg-slate-100 dark:bg-slate-950/40 p-0.5 border border-slate-200 dark:border-slate-800">
                      {(['C', 'F', 'K'] as const).map((unit) => (
                        <button
                          key={unit}
                          onClick={() => setTempUnit(unit)}
                          className={`
                            px-2 py-0.5 text-[10px] font-black rounded-md transition-all duration-200
                            ${
                              tempUnit === unit
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }
                          `}
                        >
                          °{unit}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col p-3 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5" />
                        Melting Point
                      </span>
                      <span className="text-sm font-semibold mt-1">
                        {formatTemperature(element.melt, tempUnit)}
                      </span>
                    </div>

                    <div className="flex flex-col p-3 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5" />
                        Boiling Point
                      </span>
                      <span className="text-sm font-semibold mt-1">
                        {formatTemperature(element.boil, tempUnit)}
                      </span>
                    </div>

                    <div className="flex flex-col p-3 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        Density
                      </span>
                      <span className="text-sm font-semibold mt-1">
                        {element.density !== null ? `${element.density} g/cm³` : 'N/A'}
                      </span>
                    </div>

                    <div className="flex flex-col p-3 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        Electron Config
                      </span>
                      <span className="text-sm font-semibold mt-1 truncate" title={element.electron_configuration}>
                        {element.electron_configuration_semantic || element.electron_configuration}
                      </span>
                    </div>

                    <div className="flex flex-col p-3 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        Atomic Mass
                      </span>
                      <span className="text-sm font-semibold mt-1">
                        {element.atomic_mass.toFixed(4)} u
                      </span>
                    </div>

                    <div className="flex flex-col p-3 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                        Group / Period / Block
                      </span>
                      <span className="text-sm font-semibold mt-1">
                        G: {element.group || 'N/A'} / P: {element.period} / B: {element.block.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Discovery details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col p-3 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      Discoverer
                    </span>
                    <span className="text-sm font-semibold mt-1 truncate" title={element.discovered_by || 'Unknown'}>
                      {element.discovered_by || 'Unknown'}
                    </span>
                  </div>

                  <div className="flex flex-col p-3 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Year Discovered
                    </span>
                    <span className="text-sm font-semibold mt-1">
                      {element.year_discovered || 'Ancient'}
                    </span>
                  </div>
                </div>

                {/* Uses Section (Bowserinator doesn't have an uses array by default, we'll mock or build based on category and wiki source info, or display Wikipedia link) */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5" />
                    Common Applications
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {/* Since bowserinator data doesn't have a direct uses array in the raw schema but has appearance and wiki pages, we will provide standard representative uses for elements */}
                    {element.number === 1 && ['Rocket fuel', 'Ammonia synthesis', 'Hydrogenation of oils', 'Clean fuel cells'].map(u => (
                      <span key={u} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-lg">{u}</span>
                    ))}
                    {element.number === 2 && ['Balloons', 'Cryogenics', 'Shielding gas', 'Breathing mixtures'].map(u => (
                      <span key={u} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-lg">{u}</span>
                    ))}
                    {element.number === 6 && ['Steel alloy production', 'Organic compounds', 'Carbon fibers', 'Diamond jewelry'].map(u => (
                      <span key={u} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-lg">{u}</span>
                    ))}
                    {element.number === 8 && ['Respiration support', 'Steelmaking', 'Oxy-fuel welding', 'Rocket oxidizers'].map(u => (
                      <span key={u} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-lg">{u}</span>
                    ))}
                    {element.number !== 1 && element.number !== 2 && element.number !== 6 && element.number !== 8 && (
                      <span className="text-xs text-slate-500">
                        Used extensively in {category === 'noble' ? 'gas discharge lighting, lasers, cryogenics' : category === 'alkali' ? 'batteries, industrial alloys, medical salts' : category === 'transition' ? 'structural metals, catalysts, electronics' : 'various industrial applications'}. Read more on{' '}
                        <a href={element.source} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline inline-flex items-center gap-0.5">
                          Wikipedia
                        </a>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: 3D Visualization & Bohr Shells */}
              <div className="flex flex-col space-y-6 text-left">
                {/* 3D Visualizer */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1">
                    3D Atomic Orbitals (Bohr Model)
                  </h3>
                  <AtomViewer element={element} />
                </div>

                {/* Electron Shells Breakdown */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Electron Configurations by Energy Level
                  </h3>
                  <div className="flex items-center gap-2">
                    {element.shells.map((count, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center p-2.5 w-11 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      >
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">n={index + 1}</span>
                        <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    Total Electrons: <b className="text-slate-700 dark:text-slate-300">{element.number}</b> | Valence Electrons:{' '}
                    <b className="text-slate-700 dark:text-slate-300">{element.shells[element.shells.length - 1]}</b>
                  </div>
                </div>

                {/* Fun Facts */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
                    Did you know?
                  </h3>
                  <div className="bg-yellow-50/40 dark:bg-yellow-950/10 border border-yellow-500/20 rounded-2xl p-4 text-sm leading-relaxed text-slate-700 dark:text-yellow-100">
                    {element.number === 1 && "Hydrogen makes up about 75% of the baryonic mass of the entire universe!"}
                    {element.number === 2 && "Helium is the only element that cannot be solidified by cooling at normal atmospheric pressure."}
                    {element.number === 6 && "Carbon forms the chemical basis for all known organic life on Earth!"}
                    {element.number === 8 && "Oxygen gas (O2) is highly reactive, but liquid oxygen is actually magnetic!"}
                    {element.number !== 1 && element.number !== 2 && element.number !== 6 && element.number !== 8 && (
                      <span>
                        This element's category is <b>{CATEGORY_LABELS[category]}</b> and it belongs to Block <b>{element.block.toUpperCase()}</b> in the periodic table. Check its physical traits to discover its unique chemical signature!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
