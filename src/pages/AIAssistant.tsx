import React, { useState, useRef, useEffect } from 'react';
import type { ChemicalElement } from '../types/element';
import { CATEGORY_LABELS } from '../types/element';
import { getElementCategory } from '../utils/elementHelpers';
import elementsData from '../data/elements.json';
import { Send, Sparkles, MessageSquare, Bot, User, CornerDownLeft } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIAssistant: React.FC = () => {
  const elements = elementsData as ChemicalElement[];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your AI Chemistry Assistant. Ask me anything about elements, atomic structures, chemical bonds, or periodic trends! (e.g., "Why is Fluorine so reactive?", "Tell me about Uranium", or "Compare Sodium and Potassium")',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Quick Chips
  const quickQuestions = [
    'Why is Fluorine so reactive?',
    'Tell me about Gold.',
    'Compare Sodium and Potassium.',
    'What are noble gases?',
  ];

  // Simple keyword chatbot engine
  const generateResponse = (query: string): string => {
    const q = query.toLowerCase().trim();

    // 1. Reactive Fluorine
    if (q.includes('fluorine') && (q.includes('reactive') || q.includes('why'))) {
      return `**Fluorine (F, Atomic Number 9)** is the most reactive of all chemical elements. Here is why:
1. **Extremely High Electronegativity (3.98):** Fluorine has the strongest tendency of any element to attract shared electrons.
2. **One Electron Short of an Octet:** Its valence shell has the configuration **2s² 2p⁵**. It needs exactly *one* electron to achieve the highly stable noble gas configuration (Neon).
3. **Small Atomic Radius:** Because it is a small atom, the positive nucleus is very close to the outer shell, pulling incoming electrons with immense electromagnetic force.
4. **Weak F-F Bond:** The diatomic fluorine molecule (F₂) has a surprisingly weak single bond due to the repulsion between non-bonding electrons in the small atoms, making it dissociate easily to react with other substances.`;
    }

    // 2. Noble Gases
    if (q.includes('noble gas') || q.includes('noble gases')) {
      return `**Noble Gases (Group 18)** include Helium (He), Neon (Ne), Argon (Ar), Krypton (Kr), Xenon (Xe), and Radon (Rn).
* **Chemical Inertness:** They are extremely unreactive because their outermost valence electron shells are completely filled (having 8 valence electrons, or 2 in the case of Helium).
* **Stable Octet:** Because their electron configurations are fully stable (e.g. Neon: **1s² 2s² 2p⁶**), they have virtually no tendency to gain, lose, or share electrons.
* **Physical Traits:** They are colorless, odorless, tasteless, and non-flammable gases at room temperature. They glow with distinct colors when electrical currents pass through them (used in neon signs!).`;
    }

    // 3. Trends
    if (q.includes('trend') || q.includes('trends') || q.includes('electronegativity') || q.includes('radius')) {
      return `**Periodic Trends** are repeating patterns found across rows (periods) and columns (groups) of the periodic table:
* **Atomic Radius:** Decreases across a period (left to right) due to increasing nuclear charge pulling electron shells closer. It increases down a group as new shells are added.
* **Electronegativity:** Increases across a period (left to right) and decreases down a group. Halogens are highly electronegative, while alkali metals have the lowest values.
* **Ionization Energy:** The energy required to remove an electron. It increases across a period (harder to pull electrons from stable shells) and decreases down a group (outer electrons are further from the nucleus).`;
    }

    // 4. Comparison (e.g., Sodium and Potassium)
    if (q.includes('compare') || (q.includes('difference between') && (q.includes('and') || q.includes('vs')))) {
      // Find matches in elements list
      const matched = elements.filter(e => q.includes(e.name.toLowerCase()) || q.includes(e.symbol.toLowerCase()));
      if (matched.length >= 2) {
        const el1 = matched[0];
        const el2 = matched[1];
        return `### Comparing **${el1.name}** and **${el2.name}**
* **Atomic Numbers:** ${el1.name} is Z=${el1.number} while ${el2.name} is Z=${el2.number}.
* **Mass:** ${el1.name} is ${el1.atomic_mass.toFixed(3)} u vs. ${el2.name} at ${el2.atomic_mass.toFixed(3)} u.
* **Phases:** Both exist as **${el1.phase}** at room temperature.
* **Chemical Group:** ${el1.name} belongs to **${el1.category}** and ${el2.name} is a **${el2.category}**.
* **Melting Points:** ${el1.name} melts at **${el1.melt ? `${(el1.melt - 273.15).toFixed(1)} °C` : 'N/A'}** compared to ${el2.name} at **${el2.melt ? `${(el2.melt - 273.15).toFixed(1)} °C` : 'N/A'}**.
* **Electronegativities:** ${el1.name} has a Pauling electronegativity of **${el1.electronegativity_pauling || 'N/A'}** vs ${el2.name} at **${el2.electronegativity_pauling || 'N/A'}**.`;
      }
      return `To compare two elements, make sure to name both in your query! (For example: "Compare Sodium and Potassium").`;
    }

    // 5. Individual Element Lookup
    const matchedElement = elements.find(
      (e) => q.includes(e.name.toLowerCase()) || q.includes(` ${e.symbol.toLowerCase()} `) || q.startsWith(`${e.symbol.toLowerCase()} `) || q.endsWith(` ${e.symbol.toLowerCase()}`) || q === e.symbol.toLowerCase()
    );

    if (matchedElement) {
      const cat = getElementCategory(matchedElement);
      return `### Element Profile: **${matchedElement.name} (${matchedElement.symbol})**
* **Atomic Number:** ${matchedElement.number} | **Atomic Mass:** ${matchedElement.atomic_mass.toFixed(4)} u
* **Category:** ${CATEGORY_LABELS[cat]}
* **Phase (at Room Temp):** ${matchedElement.phase}
* **Electron Configuration:** \`${matchedElement.electron_configuration_semantic || matchedElement.electron_configuration}\`
* **Discovery:** Credit goes to **${matchedElement.discovered_by || 'Unknown'}** ${matchedElement.year_discovered ? `in **${matchedElement.year_discovered}**` : ''}

**Summary:**
${matchedElement.summary}

**Did you know?**
* Melting Point: **${matchedElement.melt ? `${(matchedElement.melt - 273.15).toFixed(1)} °C` : 'N/A'}** | Boiling Point: **${matchedElement.boil ? `${(matchedElement.boil - 273.15).toFixed(1)} °C` : 'N/A'}**
* Density: **${matchedElement.density ? `${matchedElement.density} g/cm³` : 'N/A'}**`;
    }

    // 6. Helium Floating (extra fun check)
    if (q.includes('helium') && q.includes('float')) {
      return `**Helium (He, Atomic Number 2)** floats in air because it is **less dense** than the surrounding atmosphere. 
Air is primarily composed of Nitrogen (N₂, molecular mass ~28) and Oxygen (O₂, molecular mass ~32). Helium gas is monatomic (He, atomic mass ~4). Because a given volume of Helium weighs significantly less than the same volume of air, it experiences upward buoyancy, lifting balloons and airships.`;
    }

    // Fallback
    return `That is a fascinating chemistry question! 

As your simulated AI Chemistry Assistant, I can help you look up elements, compare properties, or explain trends. Try asking:
* "Tell me about Gold"
* "Why is Fluorine so reactive?"
* "Compare Oxygen and Nitrogen"
* "What is Electronegativity?"`;
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const aiResponse = generateResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-[75vh] glass-card rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden text-left">
      {/* Header */}
      <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-none mb-1">
              AI Element Assistant
            </h2>
            <span className="text-[10px] text-green-500 font-bold tracking-wider uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              Online • Chemistry Core Active
            </span>
          </div>
        </div>
        <MessageSquare className="w-5 h-5 text-slate-400" />
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-thin bg-slate-50/20 dark:bg-slate-950/5">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border shadow-sm
                  ${isAI ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'}
                `}
              >
                {isAI ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
              </div>

              {/* Message bubble */}
              <div className="flex flex-col">
                <div
                  className={`
                    px-4 py-3 rounded-2xl border text-sm leading-relaxed whitespace-pre-line shadow-sm
                    ${
                      isAI
                        ? 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none'
                        : 'bg-indigo-600 border-indigo-500 text-white rounded-tr-none'
                    }
                  `}
                >
                  {/* Basic markdown parsing (bold tags, list items) */}
                  {msg.text.split('\n').map((line, lIdx) => {
                    // Check headers
                    if (line.startsWith('### ')) {
                      return <h4 key={lIdx} className="font-extrabold text-sm mt-2 mb-1">{line.replace('### ', '')}</h4>;
                    }
                    // Check lists
                    if (line.startsWith('* ') || line.startsWith('- ')) {
                      return (
                        <div key={lIdx} className="pl-4 flex items-start gap-1">
                          <span>•</span>
                          <span>{line.substring(2)}</span>
                        </div>
                      );
                    }
                    // Simple replacement of **bold**
                    const parts = line.split(/\*\*(.*?)\*\*/g);
                    return (
                      <p key={lIdx} className={line === '' ? 'h-2' : ''}>
                        {parts.map((part, pIdx) => {
                          // Every odd index is bold text
                          return pIdx % 2 === 1 ? <strong key={pIdx} className={isAI ? 'text-slate-900 dark:text-white font-bold' : 'font-extrabold'}>{part}</strong> : part;
                        })}
                      </p>
                    );
                  })}
                </div>
                <span className={`text-[9px] text-slate-400 dark:text-slate-500 mt-1 ${isAI ? 'text-left' : 'text-right'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3 mr-auto">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 border border-indigo-500 shadow-sm">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-tl-none flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input / Control Bar */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
        {/* Quick Chips Selection */}
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="px-3 py-1 rounded-xl bg-white/70 dark:bg-slate-900/80 hover:bg-indigo-500/10 hover:border-indigo-500/40 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold transition shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your chemistry question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 glass-input py-3 px-4 bg-white/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-950 dark:text-white placeholder-slate-400 focus:border-indigo-500"
          />
          <button
            type="submit"
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-colors flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="hidden sm:flex items-center gap-1 text-[9px] text-slate-400">
          <CornerDownLeft className="w-3 h-3" />
          <span>Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};
