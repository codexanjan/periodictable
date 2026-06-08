import type { ChemicalElement, UIElementCategory } from '../types/element';

/**
 * Resolves the primary category mapping for visual presentation.
 */
export function getElementCategory(element: ChemicalElement): UIElementCategory {
  const cat = element.category.toLowerCase();
  
  if (cat === 'lanthanide') return 'lanthanide';
  if (cat === 'actinide') return 'actinide';
  if (element.group === 1 && element.period > 1) return 'alkali';
  if (element.group === 2) return 'alkaline';
  if (element.group === 18 || cat.includes('noble gas')) return 'noble';
  if (element.group === 17) return 'halogen';
  if (cat.includes('metalloid')) return 'metalloid';
  if (cat.includes('nonmetal')) return 'nonmetal';
  if (cat.includes('post-transition')) return 'postTransition';
  if (cat.includes('transition') || element.block === 'd') return 'transition';
  
  return 'unknown';
}

/**
 * Converts temperature from Kelvin to C or F, or formats K.
 */
export function formatTemperature(kelvin: number | null | undefined, unit: 'C' | 'F' | 'K'): string {
  if (kelvin === null || kelvin === undefined) return 'N/A';
  
  switch (unit) {
    case 'C': {
      const c = kelvin - 273.15;
      return `${c.toFixed(1)} °C`;
    }
    case 'F': {
      const f = (kelvin - 273.15) * 1.8 + 32;
      return `${f.toFixed(1)} °F`;
    }
    case 'K':
    default:
      return `${kelvin.toFixed(1)} K`;
  }
}

/**
 * Returns a stable pseudo-random element based on the current calendar day.
 */
export function getElementOfTheDay(elements: ChemicalElement[]): ChemicalElement {
  if (!elements || elements.length === 0) {
    throw new Error('Elements array is empty');
  }
  const today = new Date();
  // Get day of the year
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime() + (start.getTimezoneOffset() - today.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = dayOfYear % elements.length;
  return elements[index];
}

/**
 * Search elements list by name, symbol, or atomic number.
 */
export function searchElements(elements: ChemicalElement[], query: string): ChemicalElement[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return elements;
  
  return elements.filter(
    (e) =>
      e.name.toLowerCase().includes(trimmed) ||
      e.symbol.toLowerCase() === trimmed ||
      e.number.toString() === trimmed
  );
}
