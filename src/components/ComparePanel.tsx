import React from 'react';
import type { ChemicalElement } from '../types/element';
import { CATEGORY_LABELS } from '../types/element';
import { getElementCategory, formatTemperature } from '../utils/elementHelpers';
import { X, Scale } from 'lucide-react';

interface ComparePanelProps {
  comparedElements: ChemicalElement[];
  onRemoveElement: (element: ChemicalElement) => void;
  onClearAll: () => void;
  onElementClick: (element: ChemicalElement) => void;
}

export const ComparePanel: React.FC<ComparePanelProps> = ({
  comparedElements,
  onRemoveElement,
  onClearAll,
  onElementClick,
}) => {
  if (comparedElements.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl w-full text-left">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Scale className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Element Comparison ({comparedElements.length} / 3)
          </h2>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline transition"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Helper Instructions Column */}
        <div className="md:col-span-3 text-xs text-slate-500 dark:text-slate-400 space-y-2 pr-4 border-r border-slate-200/50 dark:border-slate-800/50">
          <p className="font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Compare Guide
          </p>
          <p>
            Select 2 or 3 elements in the periodic table to compare their atomic weights, physical states, electronegativities, and discovery dates.
          </p>
          <p>
            Click on an element's card here to open its detailed 3D structure and full properties modal.
          </p>
        </div>

        {/* Elements Comparison Table Column */}
        <div className="md:col-span-9 overflow-x-auto w-full scrollbar-thin">
          <table className="w-full min-w-[500px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 w-[20%]">
                  Property
                </th>
                {comparedElements.map((elem) => (
                  <th key={elem.number} className="py-2 px-3 w-[26%]">
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900">
                      <div
                        onClick={() => onElementClick(elem)}
                        className="flex items-center space-x-2.5 cursor-pointer hover:opacity-80 transition"
                      >
                        <span className="text-xs font-black text-slate-400 dark:text-slate-500">
                          {elem.number}
                        </span>
                        <span className="text-sm font-black">{elem.symbol}</span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate max-w-[80px]">
                          {elem.name}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveElement(elem)}
                        className="p-1 rounded-full hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs font-semibold">
              {/* Atomic Mass */}
              <tr className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition">
                <td className="py-3 text-slate-500 dark:text-slate-400">Atomic Mass</td>
                {comparedElements.map((elem) => (
                  <td key={elem.number} className="py-3 px-3">
                    {elem.atomic_mass.toFixed(4)} u
                  </td>
                ))}
              </tr>

              {/* Category */}
              <tr className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition">
                <td className="py-3 text-slate-500 dark:text-slate-400">Category</td>
                {comparedElements.map((elem) => (
                  <td key={elem.number} className="py-3 px-3 truncate max-w-[120px]" title={elem.category}>
                    {CATEGORY_LABELS[getElementCategory(elem)]}
                  </td>
                ))}
              </tr>

              {/* Phase */}
              <tr className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition">
                <td className="py-3 text-slate-500 dark:text-slate-400">Phase (Room Temp)</td>
                {comparedElements.map((elem) => (
                  <td key={elem.number} className="py-3 px-3">
                    <span
                      className={`
                        inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold
                        ${
                          elem.phase === 'Gas'
                            ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                            : elem.phase === 'Liquid'
                              ? 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400'
                              : elem.phase === 'Solid'
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                : 'bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400'
                        }
                      `}
                    >
                      {elem.phase}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Melting Point */}
              <tr className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition">
                <td className="py-3 text-slate-500 dark:text-slate-400">Melting Point</td>
                {comparedElements.map((elem) => (
                  <td key={elem.number} className="py-3 px-3">
                    {formatTemperature(elem.melt, 'C')} ({elem.melt ? `${elem.melt} K` : 'N/A'})
                  </td>
                ))}
              </tr>

              {/* Boiling Point */}
              <tr className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition">
                <td className="py-3 text-slate-500 dark:text-slate-400">Boiling Point</td>
                {comparedElements.map((elem) => (
                  <td key={elem.number} className="py-3 px-3">
                    {formatTemperature(elem.boil, 'C')} ({elem.boil ? `${elem.boil} K` : 'N/A'})
                  </td>
                ))}
              </tr>

              {/* Density */}
              <tr className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition">
                <td className="py-3 text-slate-500 dark:text-slate-400">Density</td>
                {comparedElements.map((elem) => (
                  <td key={elem.number} className="py-3 px-3">
                    {elem.density !== null ? `${elem.density} g/cm³` : 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Electronegativity */}
              <tr className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition">
                <td className="py-3 text-slate-500 dark:text-slate-400">Electronegativity</td>
                {comparedElements.map((elem) => (
                  <td key={elem.number} className="py-3 px-3">
                    {elem.electronegativity_pauling !== null ? elem.electronegativity_pauling : 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Electron Configuration */}
              <tr className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition">
                <td className="py-3 text-slate-500 dark:text-slate-400">Electron Config</td>
                {comparedElements.map((elem) => (
                  <td key={elem.number} className="py-3 px-3 truncate max-w-[125px]" title={elem.electron_configuration}>
                    {elem.electron_configuration_semantic || elem.electron_configuration}
                  </td>
                ))}
              </tr>

              {/* Bohr Shells */}
              <tr className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition">
                <td className="py-3 text-slate-500 dark:text-slate-400">Electrons per Shell</td>
                {comparedElements.map((elem) => (
                  <td key={elem.number} className="py-3 px-3">
                    {elem.shells.join(', ')}
                  </td>
                ))}
              </tr>

              {/* Discovery Info */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition font-normal">
                <td className="py-3 text-slate-500 dark:text-slate-400 font-semibold">Discovery</td>
                {comparedElements.map((elem) => (
                  <td key={elem.number} className="py-3 px-3 text-[11px] leading-relaxed">
                    By <b>{elem.discovered_by || 'Unknown'}</b> in <b>{elem.year_discovered || 'Ancient'}</b>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
