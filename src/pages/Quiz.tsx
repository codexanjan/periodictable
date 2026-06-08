import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { ChemicalElement } from '../types/element';
import { CATEGORY_LABELS } from '../types/element';
import { getElementCategory } from '../utils/elementHelpers';
import elementsData from '../data/elements.json';
import { HelpCircle, Award, Zap, Compass, RotateCcw, Clock, ArrowRight, Play } from 'lucide-react';

interface QuizProps {
  onAddXP: (xp: number) => void;
  unlockedElements: number[];
  onUnlockElement: (num: number) => void;
}

type Mode = 'menu' | 'mcq' | 'flashcard' | 'game';
type QuizType = 'name' | 'symbol' | 'number';

export const Quiz: React.FC<QuizProps> = ({ onAddXP, unlockedElements, onUnlockElement }) => {
  const elements = elementsData as ChemicalElement[];
  const [activeMode, setActiveMode] = useState<Mode>('menu');

  // --- MCQ QUIZ STATE ---
  const [quizType, setQuizType] = useState<QuizType>('name');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timer, setTimer] = useState(15);
  const [quizComplete, setQuizComplete] = useState(false);
  const timerRef = useRef<any>(null);

  // Generate 10 questions for a quiz run
  const quizQuestions = useMemo(() => {
    if (activeMode !== 'mcq') return [];
    
    // Pick 10 random elements
    const shuffled = [...elements].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    return selected.map((target) => {
      // Pick 3 random wrong options
      const wrongOptions = elements
        .filter((e) => e.number !== target.number)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const options = [target, ...wrongOptions].sort(() => 0.5 - Math.random());

      let questionText = '';
      let correctAnswer = '';
      let choices: string[] = [];

      if (quizType === 'name') {
        questionText = `Which element has the symbol "${target.symbol}"?`;
        correctAnswer = target.name;
        choices = options.map((o) => o.name);
      } else if (quizType === 'symbol') {
        questionText = `What is the chemical symbol for "${target.name}"?`;
        correctAnswer = target.symbol;
        choices = options.map((o) => o.symbol);
      } else {
        questionText = `What is the atomic number of "${target.name}" (${target.symbol})?`;
        correctAnswer = target.number.toString();
        choices = options.map((o) => o.number.toString());
      }

      return {
        target,
        questionText,
        correctAnswer,
        choices,
      };
    });
  }, [activeMode, quizType, elements]);

  // MCQ Timer Effect
  useEffect(() => {
    if (activeMode !== 'mcq' || quizComplete || isAnswered) return;

    setTimer(15);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleAnswerSelect(''); // Time out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeMode, currentQuestionIdx, isAnswered, quizComplete]);

  const startMCQ = (type: QuizType) => {
    setQuizType(type);
    setCurrentQuestionIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuizComplete(false);
    setActiveMode('mcq');
  };

  const handleAnswerSelect = (ans: string) => {
    if (isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedAnswer(ans);
    setIsAnswered(true);

    const correct = ans === quizQuestions[currentQuestionIdx].correctAnswer;
    if (correct) {
      setScore((prev) => prev + 1);
      onAddXP(10); // +10 XP per correct answer
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < 9) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizComplete(true);
      onAddXP(score * 15); // Bonus XP for finishing
      
      // Save High Score in LocalStorage
      const currentHigh = parseInt(localStorage.getItem(`highscore_${quizType}`) || '0');
      if (score > currentHigh) {
        localStorage.setItem(`highscore_${quizType}`, score.toString());
      }
    }
  };

  // --- FLASHCARDS STATE ---
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const shuffleFlashcards = () => {
    setFlashcardIdx(Math.floor(Math.random() * elements.length));
    setIsFlipped(false);
  };

  const currentFlashcard = elements[flashcardIdx];

  // --- UNLOCKING GAME STATE ---
  const [gameIndex, setGameIndex] = useState(0);
  const [gameOptions, setGameOptions] = useState<ChemicalElement[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameAnswered, setGameAnswered] = useState(false);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);

  // Find elements that are currently locked
  const lockedElements = useMemo(() => {
    return elements.filter((e) => !unlockedElements.includes(e.number));
  }, [elements, unlockedElements]);

  const initGameQuestion = () => {
    if (lockedElements.length === 0) {
      setGameCompleted(true);
      return;
    }
    setGameAnswered(false);
    setGameFeedback(null);
    
    // Choose a random locked element
    const target = lockedElements[Math.floor(Math.random() * lockedElements.length)];
    
    // Generate options
    const wrong = elements
      .filter((e) => e.number !== target.number)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const opts = [target, ...wrong].sort(() => 0.5 - Math.random());
    
    setGameIndex(target.number);
    setGameOptions(opts);
  };

  useEffect(() => {
    if (activeMode === 'game') {
      initGameQuestion();
    }
  }, [activeMode, lockedElements.length]);

  const handleGameSelect = (elem: ChemicalElement) => {
    if (gameAnswered) return;
    setGameAnswered(true);

    if (elem.number === gameIndex) {
      setGameFeedback('Correct! Element Unlocked!');
      onUnlockElement(gameIndex);
      onAddXP(30); // Higher reward for unlocking elements!
    } else {
      setGameFeedback(`Incorrect. The correct answer was ${elements.find(e => e.number === gameIndex)?.name}.`);
    }
  };

  const targetGameElement = elements.find((e) => e.number === gameIndex);

  return (
    <div className="w-full flex flex-col space-y-6 text-left">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">
          Quizzes & Gamified Learning
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Challenge yourself, study flashcards, and answer questions to unlock elements!
        </p>
      </div>

      {/* --- MENU MODE --- */}
      {activeMode === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* MCQ card */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="p-3 w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 mb-4 flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
                Multiple Choice Quizzes
              </h2>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mb-6">
                Test your chemistry knowledge with 10 timed questions. Choose from Guess the Name, Guess the Symbol, or Atomic Number Challenge!
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => startMCQ('name')}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Guess the Element
              </button>
              <button
                onClick={() => startMCQ('symbol')}
                className="w-full py-2.5 rounded-xl border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 font-bold text-xs transition-colors"
              >
                Guess the Symbol
              </button>
              <button
                onClick={() => startMCQ('number')}
                className="w-full py-2.5 rounded-xl border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 font-bold text-xs transition-colors"
              >
                Atomic Number Challenge
              </button>
            </div>
          </div>

          {/* Flashcards card */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="p-3 w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
                Active Study Flashcards
              </h2>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mb-6">
                Revise chemical symbols and properties at your own pace. Flip cards to reveal the name, atomic weight, group, and standard applications.
              </p>
            </div>
            <button
              onClick={() => {
                setFlashcardIdx(0);
                setIsFlipped(false);
                setActiveMode('flashcard');
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Study Cards
            </button>
          </div>

          {/* Gamified Unlocker */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="p-3 w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mb-4 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
                Unlock the Periodic Table!
              </h2>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mb-6">
                Answer questions correctly to "unlock" elements and populate your student dashboard. Gain XP, climb levels, and earn prestigious badges!
              </p>
              <div className="text-[11px] font-bold text-slate-400 mb-4">
                Unlocked Elements: <span className="text-indigo-500">{unlockedElements.length} / 118</span>
              </div>
            </div>
            <button
              onClick={() => setActiveMode('game')}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Play Unlocking Game
            </button>
          </div>
        </div>
      )}

      {/* --- MCQ QUIZ MODE --- */}
      {activeMode === 'mcq' && quizQuestions.length > 0 && (
        <div className="max-w-2xl mx-auto w-full glass-card rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
          {!quizComplete ? (
            <>
              {/* Quiz Header: Current Question & Timer */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-black bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-lg">
                  Question {currentQuestionIdx + 1} of 10
                </span>
                <span className={`text-xs font-extrabold flex items-center gap-1 ${timer < 5 ? 'text-red-500 animate-bounce' : 'text-slate-500 dark:text-slate-400'}`}>
                  <Clock className="w-3.5 h-3.5" />
                  {timer}s left
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${(currentQuestionIdx / 10) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-6">
                {quizQuestions[currentQuestionIdx].questionText}
              </h2>

              {/* Answers Grid */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                {quizQuestions[currentQuestionIdx].choices.map((choice) => {
                  const isChoiceSelected = selectedAnswer === choice;
                  const isCorrectAnswer = choice === quizQuestions[currentQuestionIdx].correctAnswer;
                  
                  let btnStyle = 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700';
                  
                  if (isAnswered) {
                    if (isCorrectAnswer) {
                      btnStyle = 'bg-green-500/10 border-green-500 text-green-600 dark:text-green-400';
                    } else if (isChoiceSelected) {
                      btnStyle = 'bg-red-500/10 border-red-500 text-red-600 dark:text-red-400';
                    } else {
                      btnStyle = 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={choice}
                      disabled={isAnswered}
                      onClick={() => handleAnswerSelect(choice)}
                      className={`w-full py-3 px-4 rounded-2xl border text-sm text-left transition-all duration-200 ${btnStyle}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              {/* Actions Footer */}
              {isAnswered && (
                <div className="flex justify-between items-center">
                  <div className="text-xs font-semibold">
                    {selectedAnswer === quizQuestions[currentQuestionIdx].correctAnswer ? (
                      <span className="text-green-600 dark:text-green-400">Correct! (+10 XP)</span>
                    ) : (
                      <span className="text-red-550 dark:text-red-400">
                        Incorrect! Correct: <b>{quizQuestions[currentQuestionIdx].correctAnswer}</b>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={nextQuestion}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1"
                  >
                    Next Question
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Quiz Complete screen */
            <div className="text-center py-6">
              <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Quiz Complete!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                You scored <b>{score} / 10</b> correctly.
              </p>
              
              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-8">
                <div className="p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">XP Gained</span>
                  <span className="block text-xl font-extrabold text-indigo-500 mt-1">+{score * 10 + score * 15} XP</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900 rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">High Score</span>
                  <span className="block text-xl font-extrabold text-slate-700 dark:text-slate-300 mt-1">
                    {localStorage.getItem(`highscore_${quizType}`) || score} / 10
                  </span>
                </div>
              </div>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => startMCQ(quizType)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  Play Again
                </button>
                <button
                  onClick={() => setActiveMode('menu')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- FLASHCARDS MODE --- */}
      {activeMode === 'flashcard' && (
        <div className="max-w-md mx-auto w-full flex flex-col space-y-6">
          {/* Deck Navigator Header */}
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-bold text-slate-400">
              Card {flashcardIdx + 1} of {elements.length}
            </span>
            <button
              onClick={shuffleFlashcards}
              className="text-xs font-bold text-indigo-500 hover:underline inline-flex items-center gap-1"
            >
              Shuffle Card
            </button>
          </div>

          {/* Flashcard Component */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-[260px] md:h-[300px] cursor-pointer perspective-1000 select-none"
          >
            <div
              className={`relative w-full h-full duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT: Chemical Symbol */}
              <div className="absolute inset-0 w-full h-full rounded-3xl glass-card flex flex-col items-center justify-center border-slate-200 dark:border-slate-800 p-6 backface-hidden shadow-xl">
                <div className="text-[10px] font-black text-slate-400 absolute top-4 left-4">
                  Z = {currentFlashcard.number}
                </div>
                <div className="text-6xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400">
                  {currentFlashcard.symbol}
                </div>
                <div className="text-xs font-medium text-slate-400 mt-4 uppercase tracking-widest">
                  Click to Flip
                </div>
              </div>

              {/* BACK: Element Details */}
              <div className="absolute inset-0 w-full h-full rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-between text-white rotate-y-180 backface-hidden shadow-xl text-center">
                <div className="flex justify-between w-full border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {CATEGORY_LABELS[getElementCategory(currentFlashcard)]}
                  </span>
                  <span className="text-[10px] font-extrabold text-indigo-400">
                    No. {currentFlashcard.number}
                  </span>
                </div>

                <div className="my-auto">
                  <h3 className="text-2xl font-black tracking-tight">{currentFlashcard.name}</h3>
                  <span className="text-xs text-slate-400 font-medium">Mass: {currentFlashcard.atomic_mass.toFixed(3)}</span>
                  
                  {/* Mock use since Bowserinator doesn't provide direct list */}
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs mt-3">
                    Used widely in standard industrial, chemical, or biological compositions.
                  </p>
                </div>

                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                  Click to Flip Back
                </div>
              </div>
            </div>
          </div>

          {/* Flashcard Actions */}
          <div className="flex justify-between items-center px-1">
            <button
              onClick={() => {
                setFlashcardIdx((prev) => (prev > 0 ? prev - 1 : elements.length - 1));
                setIsFlipped(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
            >
              Previous
            </button>
            <button
              onClick={() => setActiveMode('menu')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              Exit Flashcards
            </button>
            <button
              onClick={() => {
                setFlashcardIdx((prev) => (prev < elements.length - 1 ? prev + 1 : 0));
                setIsFlipped(false);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* --- UNLOCKING GAME MODE --- */}
      {activeMode === 'game' && (
        <div className="max-w-2xl mx-auto w-full glass-card rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
          {!gameCompleted && targetGameElement ? (
            <>
              {/* Game Score Header */}
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-550 dark:text-slate-400">
                  <Award className="w-4.5 h-4.5 text-amber-500" />
                  <span>Progression Level: {Math.floor(unlockedElements.length / 5) + 1}</span>
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded">
                  Locked remaining: {lockedElements.length}
                </span>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 mb-1 block">
                  Identify the element:
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  "I have an atomic mass of approximately <b>{targetGameElement.atomic_mass.toFixed(2)} u</b>, belong to Period <b>{targetGameElement.period}</b>, and my discovery is credited to <b>{targetGameElement.discovered_by || 'ancient scientists'}</b>. Who am I?"
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {gameOptions.map((opt) => {
                  let optStyle = 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700';
                  
                  if (gameAnswered) {
                    if (opt.number === gameIndex) {
                      optStyle = 'bg-green-500/10 border-green-500 text-green-600 dark:text-green-400';
                    } else {
                      optStyle = 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 opacity-45';
                    }
                  }

                  return (
                    <button
                      key={opt.number}
                      disabled={gameAnswered}
                      onClick={() => handleGameSelect(opt)}
                      className={`w-full py-3 rounded-2xl border text-sm font-bold transition duration-200 ${optStyle}`}
                    >
                      {opt.name} ({opt.symbol})
                    </button>
                  );
                })}
              </div>

              {/* Feedback Drawer */}
              {gameAnswered && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-150 dark:border-slate-800 pt-4 mt-4">
                  <div className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
                    {gameFeedback}
                  </div>
                  <button
                    onClick={initGameQuestion}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center gap-1"
                  >
                    Next Challenge
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Game Complete */
            <div className="text-center py-6">
              <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Incredible Job!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                You have successfully unlocked all 118 elements of the periodic table! You are a master chemist.
              </p>
              <button
                onClick={() => setActiveMode('menu')}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
              >
                Back to Menu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
