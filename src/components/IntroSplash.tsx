import React, { useEffect, useState } from 'react';
import { Atom } from 'lucide-react';

interface IntroSplashProps {
  onComplete: () => void;
}

const LOADING_STEPS = [
  'Initializing atomic cores...',
  'Synthesizing electron shells...',
  'Aligning electronegative fields...',
  'Loading all 118 elements...',
  'Laboratory ready!',
];

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through loading step text
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    // Smoothly fill progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(stepInterval);
          // Allow short delay to appreciate the completed state
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white select-none overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-650/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-violet-650/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Floating chemistry elements in background */}
      <div className="absolute top-[15%] left-[20%] text-slate-800 font-extrabold text-7xl select-none opacity-20 animate-float-slow" style={{ animationDelay: '0s' }}>H</div>
      <div className="absolute bottom-[20%] right-[15%] text-slate-800 font-extrabold text-8xl select-none opacity-15 animate-float-slow" style={{ animationDelay: '2s' }}>Au</div>
      <div className="absolute top-[30%] right-[25%] text-slate-800 font-extrabold text-6xl select-none opacity-25 animate-float-slow" style={{ animationDelay: '1s' }}>O</div>
      <div className="absolute bottom-[30%] left-[10%] text-slate-800 font-extrabold text-7xl select-none opacity-10 animate-float-slow" style={{ animationDelay: '3.5s' }}>U</div>

      {/* Animated Bohr Model Atom */}
      <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
        {/* Pulsing nucleus */}
        <div className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/50 animate-pulse-glow z-10">
          <Atom className="w-4.5 h-4.5 text-white animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Orbit Ring 1 */}
        <div 
          className="absolute border border-indigo-500/25 rounded-full w-24 h-24 animate-spin-slow" 
          style={{ transform: 'rotateX(70deg) rotateY(15deg)' }}
        >
          {/* Electron */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-400 shadow-md shadow-indigo-400/80 animate-ping" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-400" />
        </div>

        {/* Orbit Ring 2 */}
        <div 
          className="absolute border border-violet-500/25 rounded-full w-32 h-32 animate-spin-medium" 
          style={{ transform: 'rotateX(15deg) rotateY(70deg)' }}
        >
          {/* Electron */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-violet-400 shadow-md shadow-violet-400/80" />
        </div>

        {/* Orbit Ring 3 */}
        <div 
          className="absolute border border-pink-500/25 rounded-full w-40 h-40 animate-spin-reverse-medium" 
          style={{ transform: 'rotateX(45deg) rotateY(-45deg)' }}
        >
          {/* Electron */}
          <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-pink-400 shadow-md shadow-pink-400/80" />
        </div>
      </div>

      {/* App Branding */}
      <div className="text-center z-10 px-4 space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]">
          PeriodicPortal
        </h1>
        <p className="text-[10px] uppercase font-black text-indigo-400 tracking-[0.25em] leading-none mb-6">
          Interactive Lab Experience
        </p>

        {/* Progress bar container */}
        <div className="w-56 h-1.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden mx-auto mb-3 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress step text */}
        <div className="h-4 flex items-center justify-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
            {LOADING_STEPS[currentStep]}
          </span>
        </div>
      </div>
    </div>
  );
};
