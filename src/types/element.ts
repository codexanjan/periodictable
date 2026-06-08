export interface ElementImage {
  title: string;
  url: string;
  attribution: string;
}

export interface ChemicalElement {
  name: string;
  appearance: string | null;
  atomic_mass: number;
  boil: number | null;
  category: string;
  density: number | null;
  discovered_by: string | null;
  year_discovered: number | null;
  melt: number | null;
  molar_heat: number | null;
  named_by: string | null;
  number: number;
  period: number;
  group: number;
  phase: 'Gas' | 'Liquid' | 'Solid' | 'Synthetic' | string;
  source: string;
  bohr_model_image: string | null;
  bohr_model_3d: string | null;
  spectral_img: string | null;
  summary: string;
  symbol: string;
  xpos: number;
  ypos: number;
  wxpos: number;
  wypos: number;
  shells: number[];
  electron_configuration: string;
  electron_configuration_semantic: string;
  electron_affinity: number | null;
  electronegativity_pauling: number | null;
  ionization_energies: number[];
  'cpk-hex': string | null;
  image: ElementImage | null;
  block: string;
}

export type UIElementCategory =
  | 'alkali'
  | 'alkaline'
  | 'transition'
  | 'lanthanide'
  | 'actinide'
  | 'postTransition'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble'
  | 'unknown';

export const CATEGORY_LABELS: Record<UIElementCategory, string> = {
  alkali: 'Alkali Metals',
  alkaline: 'Alkaline Earth Metals',
  transition: 'Transition Metals',
  lanthanide: 'Lanthanides',
  actinide: 'Actinides',
  postTransition: 'Post-transition Metals',
  metalloid: 'Metalloids',
  nonmetal: 'Reactive Nonmetals',
  halogen: 'Halogens',
  noble: 'Noble Gases',
  unknown: 'Unknown / Predicted',
};

export const CATEGORY_COLORS: Record<UIElementCategory, string> = {
  alkali: 'bg-red-50 border-red-200/80 text-red-900 dark:bg-red-950/20 dark:border-red-500/40 dark:text-red-200 glow-alkali',
  alkaline: 'bg-orange-50 border-orange-200/80 text-orange-900 dark:bg-orange-950/20 dark:border-orange-500/40 dark:text-orange-200 glow-alkaline',
  transition: 'bg-amber-50 border-amber-200/80 text-amber-900 dark:bg-amber-950/20 dark:border-amber-500/40 dark:text-amber-200 glow-transition',
  lanthanide: 'bg-pink-50 border-pink-200/80 text-pink-900 dark:bg-pink-950/20 dark:border-pink-500/40 dark:text-pink-200 glow-lanthanide',
  actinide: 'bg-purple-50 border-purple-200/80 text-purple-900 dark:bg-purple-950/20 dark:border-purple-500/40 dark:text-purple-200 glow-actinide',
  postTransition: 'bg-emerald-50 border-emerald-200/80 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-500/40 dark:text-emerald-200 glow-postTransition',
  metalloid: 'bg-cyan-50 border-cyan-200/80 text-cyan-900 dark:bg-cyan-950/20 dark:border-cyan-500/40 dark:text-cyan-200 glow-metalloid',
  nonmetal: 'bg-lime-50 border-lime-200/80 text-lime-900 dark:bg-lime-950/20 dark:border-lime-500/40 dark:text-lime-200 glow-nonmetal',
  halogen: 'bg-blue-50 border-blue-200/80 text-blue-900 dark:bg-blue-950/20 dark:border-blue-500/40 dark:text-blue-200 glow-halogen',
  noble: 'bg-indigo-50 border-indigo-200/80 text-indigo-900 dark:bg-indigo-950/20 dark:border-indigo-500/40 dark:text-indigo-200 glow-noble',
  unknown: 'bg-slate-50 border-slate-200/80 text-slate-900 dark:bg-slate-900/20 dark:border-slate-700/40 dark:text-slate-200 glow-unknown',
};

export const CATEGORY_TEXT_COLORS: Record<UIElementCategory, string> = {
  alkali: 'text-red-500 dark:text-red-400',
  alkaline: 'text-orange-500 dark:text-orange-400',
  transition: 'text-amber-500 dark:text-amber-400',
  lanthanide: 'text-pink-500 dark:text-pink-400',
  actinide: 'text-purple-500 dark:text-purple-400',
  postTransition: 'text-emerald-500 dark:text-emerald-400',
  metalloid: 'text-cyan-500 dark:text-cyan-400',
  nonmetal: 'text-lime-500 dark:text-lime-400',
  halogen: 'text-blue-500 dark:text-blue-400',
  noble: 'text-indigo-500 dark:text-indigo-400',
  unknown: 'text-slate-500 dark:text-slate-400',
};
