import React from 'react';
import type { ChemicalElement } from '../types/element';
import { CATEGORY_COLORS } from '../types/element';
import { getElementCategory } from '../utils/elementHelpers';

interface ElementCardProps {
  element: ChemicalElement;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isDimmed: boolean;
  isCompareMode: boolean;
  isCompared: boolean;
  onCompareToggle: (e: React.MouseEvent) => void;
  showMass?: boolean;
  enableGlow?: boolean;
}

export const ElementCard: React.FC<ElementCardProps> = ({
  element,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isDimmed,
  isCompareMode,
  isCompared,
  onCompareToggle,
  showMass = true,
  enableGlow = true,
}) => {
  const category = getElementCategory(element);
  const colorClass = CATEGORY_COLORS[category] || CATEGORY_COLORS.unknown;
  const finalColorClass = enableGlow ? colorClass : colorClass.split(' ').filter(c => !c.startsWith('glow-')).join(' ');

  // Render elements in IUPAC coordinates using grid-column and grid-row
  const gridStyle = {
    gridColumn: element.xpos,
    gridRow: element.ypos,
  };

  return (
    <div
      style={gridStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        relative flex flex-col justify-between p-1 select-none cursor-pointer card-hover-transition
        border rounded-md h-[56px] sm:h-[64px] md:h-[72px] lg:h-[76px] xl:h-[80px] overflow-hidden
        ${finalColorClass}
        ${isDimmed ? 'opacity-20 scale-95 saturate-50' : 'opacity-100 hover:scale-105 hover:z-20 shadow-sm'}
        group
      `}
    >
      {/* Glowing background atom icon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-10 group-hover:opacity-30 transition-all duration-500 scale-90 group-hover:scale-110 z-0">
        <svg
          viewBox="0 0 100 100"
          className="w-10 h-10 md:w-12 md:h-12 animate-spin-slow stroke-current text-current"
          fill="none"
          strokeWidth="4"
        >
          {/* Inner orbit */}
          <circle cx="50" cy="50" r="22" className="stroke-current opacity-30" />
          <circle cx="50" cy="28" r="4.5" className="fill-current" />
          
          {/* Outer orbit */}
          <circle cx="50" cy="50" r="40" className="stroke-current opacity-20" />
          <circle cx="10" cy="50" r="4.5" className="fill-current" />
          <circle cx="90" cy="50" r="4.5" className="fill-current" />
          
          {/* Nucleus */}
          <circle cx="50" cy="50" r="6" className="fill-current opacity-85" />
        </svg>
      </div>

      {/* Top Bar: Atomic Number and Comparison Checkbox */}
      <div className="flex justify-between items-start w-full z-10">
        <span className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-semibold leading-none opacity-85">
          {element.number}
        </span>
        {isCompareMode && (
          <button
            onClick={onCompareToggle}
            className={`
              w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border flex items-center justify-center transition-all duration-200
              ${
                isCompared
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white/60 dark:bg-slate-900/60 border-slate-400 dark:border-slate-600 hover:border-indigo-500'
              }
            `}
          >
            {isCompared && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="w-2.5 h-2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Middle: Symbol */}
      <div className="text-center font-bold tracking-tight -mt-1 -mb-1 leading-none text-sm sm:text-base md:text-lg lg:text-xl z-10">
        {element.symbol}
      </div>

      {/* Bottom: Name & Mass */}
      <div className="flex flex-col items-center w-full leading-none overflow-hidden z-10">
        <span className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-medium tracking-tight truncate w-full text-center opacity-90">
          {element.name}
        </span>
        {showMass && (
          <span className="hidden md:inline text-[7px] lg:text-[8px] font-light tracking-tighter opacity-70 truncate max-w-full">
            {element.atomic_mass.toFixed(2)}
          </span>
        )}
      </div>

      {/* Mini state indicator (Phase dot) */}
      <div className="absolute bottom-1 right-1 flex space-x-0.5">
        <span
          title={`Phase: ${element.phase}`}
          className={`
            w-1.5 h-1.5 rounded-full
            ${
              element.phase === 'Gas'
                ? 'bg-blue-400'
                : element.phase === 'Liquid'
                  ? 'bg-yellow-400'
                  : element.phase === 'Solid'
                    ? 'bg-slate-400 dark:bg-slate-300'
                    : 'bg-purple-400'
            }
          `}
        />
      </div>
    </div>
  );
};
