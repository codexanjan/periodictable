import React, { useState, useMemo } from 'react';
import type { ChemicalElement } from '../types/element';
import { CATEGORY_LABELS } from '../types/element';
import { getElementCategory } from '../utils/elementHelpers';
import elementsData from '../data/elements.json';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, BookOpen, Atom, GitPullRequest, Activity } from 'lucide-react';

interface LearnProps {
  onElementClick: (element: ChemicalElement) => void;
}

type TrendType = 'electronegativity' | 'radius' | 'ionization' | 'affinity';

export const Learn: React.FC<LearnProps> = ({ onElementClick }) => {
  const elements = elementsData as ChemicalElement[];
  const [activeTrend, setActiveTrend] = useState<TrendType>('electronegativity');
  const [selectedArticle, setSelectedArticle] = useState<'trends' | 'structure' | 'bonding' | 'config'>('trends');

  // Map elements data to chart inputs
  const chartData = useMemo(() => {
    return elements.map((e) => ({
      number: e.number,
      symbol: e.symbol,
      name: e.name,
      category: getElementCategory(e),
      value:
        activeTrend === 'electronegativity'
          ? e.electronegativity_pauling || 0
          : activeTrend === 'radius'
            ? (8 - e.period) * 30 - (e.group * 3.5) + 80
            : activeTrend === 'ionization'
              ? e.ionization_energies && e.ionization_energies[0] ? e.ionization_energies[0] : 0
              : e.electron_affinity || 0,
      rawElement: e,
    })).filter(d => d.value > 0); // Only plot non-zero values for readability
  }, [elements, activeTrend]);

  // Set the labels and description for each graph
  const trendDetails = {
    electronegativity: {
      title: 'Electronegativity (Pauling Scale)',
      desc: "An atom's ability to attract shared electrons in a chemical bond. Electronegativity increases across a period (left to right) and decreases down a group (top to bottom). Fluorine is the most electronegative element (3.98).",
      yLabel: 'Pauling Value',
      color: '#6366f1', // Indigo
    },
    radius: {
      title: 'Atomic Radius (pm)',
      desc: 'The distance from the center of the nucleus to the outermost electron shell. Atomic radius decreases across a period (left to right) due to increasing nuclear charge pulling electrons closer, and increases down a group.',
      yLabel: 'Radius (pm)',
      color: '#10b981', // Emerald
    },
    ionization: {
      title: 'First Ionization Energy (kJ/mol)',
      desc: 'The energy required to remove the most loosely bound electron from a neutral gaseous atom. It increases across a period and decreases down a group, with noble gases having the highest values.',
      yLabel: 'Energy (kJ/mol)',
      color: '#fbbf24', // Amber
    },
    affinity: {
      title: 'Electron Affinity (kJ/mol)',
      desc: 'The amount of energy released when an electron is added to a neutral atom to form a negative ion. Halogens have very high electron affinities, while noble gases have virtually zero.',
      yLabel: 'Energy (kJ/mol)',
      color: '#f472b6', // Pink
    },
  };

  const currentTrend = trendDetails[activeTrend];

  const handleChartClick = (state: any) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      const clickedElement = state.activePayload[0].payload.rawElement;
      onElementClick(clickedElement);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-8 text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">
            Learning Hub & Periodic Trends
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Explore periodic charts, atomic trends, and interactive study modules.
          </p>
        </div>
      </div>

      {/* 1. Trends Graph Section */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-500 animate-pulse" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Interactive Trends Chart
            </h2>
          </div>
          {/* Trend Buttons */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(trendDetails) as TrendType[]).map((type) => (
              <button
                key={type}
                onClick={() => setActiveTrend(type)}
                className={`
                  px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 border
                  ${
                    activeTrend === type
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                      : 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }
                `}
              >
                {type === 'electronegativity' && 'Electronegativity'}
                {type === 'radius' && 'Atomic Radius'}
                {type === 'ionization' && 'Ionization Energy'}
                {type === 'affinity' && 'Electron Affinity'}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Description */}
        <p className="text-xs text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/25 border border-slate-100 dark:border-slate-900 p-4 rounded-xl mb-6 leading-relaxed">
          <strong>{currentTrend.title}: </strong> {currentTrend.desc}
        </p>

        {/* Chart Canvas */}
        <div className="w-full h-[320px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              onClick={handleChartClick}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              className="cursor-pointer"
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentTrend.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={currentTrend.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.12} />
              <XAxis
                dataKey="number"
                tickLine={false}
                axisLine={false}
                stroke="#64748b"
                fontSize={10}
                fontWeight="bold"
                label={{ value: 'Atomic Number (Z)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="#64748b"
                fontSize={10}
                fontWeight="bold"
                label={{ value: currentTrend.yLabel, angle: -90, position: 'insideLeft', offset: 10, fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass-card p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-xl space-y-1">
                        <div className="flex items-center space-x-1.5 font-extrabold text-slate-900 dark:text-white">
                          <span className="text-slate-400 dark:text-slate-500">{data.number}</span>
                          <span>{data.symbol}</span>
                          <span>•</span>
                          <span>{data.name}</span>
                        </div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          {CATEGORY_LABELS[data.category as keyof typeof CATEGORY_LABELS]}
                        </div>
                        <div className="font-bold text-indigo-500 dark:text-indigo-400 mt-1">
                          Value: {data.value.toFixed(2)}
                        </div>
                        <div className="text-[9px] text-slate-400 mt-1">Click dot to inspect element</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={currentTrend.color}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#trendGradient)"
              />
              {/* Reference Lines for Period breaks */}
              {[2, 10, 18, 36, 54, 86].map((num) => (
                <ReferenceLine
                  key={num}
                  x={num}
                  stroke="#94a3b8"
                  strokeDasharray="2 2"
                  opacity={0.3}
                  label={{ value: `P${elements.find(e => e.number === num)?.period || ''}`, position: 'top', fill: '#94a3b8', fontSize: 8 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Interactive Study Articles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="flex flex-col space-y-1.5 md:col-span-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-3">
            Lessons List
          </h3>
          {[
            { id: 'trends', title: 'Periodic Trends', icon: TrendingUp },
            { id: 'structure', title: 'Atomic Structure', icon: Atom },
            { id: 'bonding', title: 'Chemical Bonding', icon: GitPullRequest },
            { id: 'config', title: 'Electron Configuration', icon: Activity },
          ].map((art) => {
            const Icon = art.icon;
            const isSelected = selectedArticle === art.id;
            return (
              <button
                key={art.id}
                onClick={() => {
                  setSelectedArticle(art.id as any);
                  if (art.id === 'trends') setActiveTrend('electronegativity');
                }}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold text-left transition-all duration-300 border
                  ${
                    isSelected
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/20'
                  }
                `}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{art.title}</span>
              </button>
            );
          })}
        </div>

        {/* Article Content Viewer */}
        <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl md:col-span-3">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {selectedArticle === 'trends' && 'Understanding Periodic Trends'}
              {selectedArticle === 'structure' && 'Introduction to Atomic Structure'}
              {selectedArticle === 'bonding' && 'Fundamentals of Chemical Bonding'}
              {selectedArticle === 'config' && 'Mastering Electron Configuration'}
            </h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-4">
            {selectedArticle === 'trends' && (
              <>
                <p>
                  <strong>Periodic trends</strong> are specific patterns that occur in the chemical elements of the periodic table. These trends arise from the electronic structure of the atoms and help chemists predict the properties of elements and compounds.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900">
                    <h4 className="font-bold text-indigo-500 mb-1">Atomic Radius</h4>
                    <p className="text-xs">
                      Decreases from left to right because higher nuclear charge (more protons) pulls electrons closer. Increases top to bottom because each period adds a new electron shell.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900">
                    <h4 className="font-bold text-indigo-500 mb-1">Electronegativity</h4>
                    <p className="text-xs">
                      Increases from left to right because elements on the right (like Halogens) are close to filling their shell and strongly pull electrons. Decreases down because valence electrons are shielded.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  💡 <em>Try clicking the buttons at the top of the page to see how these trends look visually on the chart!</em>
                </p>
              </>
            )}

            {selectedArticle === 'structure' && (
              <>
                <p>
                  An <strong>atom</strong> is the basic building block of chemistry. It consists of a dense central core called the <strong>nucleus</strong>, surrounded by a cloud of negative electrons.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 text-center">
                  <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5">
                    <span className="font-extrabold text-red-500 text-xs">Proton (+)</span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Located in nucleus. Positive charge. Mass = 1 amu. Identifies element.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5">
                    <span className="font-extrabold text-blue-500 text-xs">Neutron (0)</span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Located in nucleus. Neutral charge. Mass = 1 amu. Stablizes nucleus.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                    <span className="font-extrabold text-yellow-600 dark:text-yellow-400 text-xs">Electron (-)</span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Orbits in shells. Negative charge. Negligible mass. Drives bonding.
                    </p>
                  </div>
                </div>
                <p>
                  Protons and neutrons cluster in the center, held together by the strong nuclear force. The negative electrons orbit in concentric shells due to electromagnetic attraction, which we simulate in the 3D Atomic Viewer on the periodic table screen.
                </p>
              </>
            )}

            {selectedArticle === 'bonding' && (
              <>
                <p>
                  <strong>Chemical bonding</strong> refers to the attraction between atoms that allows the formation of chemical substances containing two or more atoms. Atoms bond to achieve a stable octet (8 valence electrons).
                </p>
                <ul className="list-disc pl-5 space-y-2.5 my-4">
                  <li>
                    <strong>Ionic Bonding:</strong> Formed when one atom transfers electrons to another, creating oppositely charged ions (e.g., Sodium NaCl transfers to Chlorine). Usually happens between metals and nonmetals.
                  </li>
                  <li>
                    <strong>Covalent Bonding:</strong> Formed when atoms share one or more pairs of electrons (e.g., H₂O). Occurs between nonmetals.
                  </li>
                  <li>
                    <strong>Metallic Bonding:</strong> Occurs in metals, where valence electrons are free to drift in a shared "sea of electrons" that holds the metal cations together, explaining their electrical conductivity.
                  </li>
                </ul>
              </>
            )}

            {selectedArticle === 'config' && (
              <>
                <p>
                  <strong>Electron configuration</strong> is the distribution of electrons of an atom in atomic orbitals. Electrons fill orbitals following the <strong>Aufbau Principle</strong> (lowest energy first), <strong>Hund's Rule</strong> (maximize spin), and the <strong>Pauli Exclusion Principle</strong>.
                </p>
                <p className="bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900 font-mono p-4 rounded-xl text-xs leading-relaxed">
                  Filling Order:<br />
                  1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p → 6s ...
                </p>
                <p>
                  In the element details modal, you can see these configurations printed in two ways: the standard spectroscopic format (e.g., <code>1s2 2s2 2p6</code>) and the noble gas shorthand notation (e.g., <code>[Ne] 3s2</code>).
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
