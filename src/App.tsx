import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize, Minimize, ChevronLeft, ChevronRight } from 'lucide-react';

import Slide1Intro from './components/Slide1Intro';
import Slide2Scenario from './components/Slide2Scenario';
import Slide3Table from './components/Slide3Table';
import Slide4Concept from './components/Slide4Concept';
import Slide5Square from './components/Slide5Square';
import Slide6SquareArea from './components/Slide6SquareArea';
import Slide7Graph from './components/Slide7Graph';
import Slide8Quiz from './components/Slide8Quiz';
import Slide9Summary from './components/Slide9Summary';

const TOTAL_SLIDES = 9;

interface Record {
  x: number;
  y: number;
}

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Shared state between modules
  const [records, setRecords] = useState<Record[]>([]);
  const [hours, setHours] = useState(1);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
      } catch (err) {
        console.error("Error attempting to enable full-screen mode:", err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide(s => Math.min(s + 1, TOTAL_SLIDES - 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(s => Math.max(s - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      if (e.target instanceof HTMLInputElement) return;
      
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const renderSlide = () => {
    switch (currentSlide) {
      case 0: return <Slide1Intro onNext={nextSlide} />;
      case 1: return <Slide2Scenario records={records} setRecords={setRecords} hours={hours} setHours={setHours} />;
      case 2: return <Slide3Table records={records} />;
      case 3: return <Slide4Concept />;
      case 4: return <Slide5Square />;
      case 5: return <Slide6SquareArea />;
      case 6: return <Slide7Graph records={records} />;
      case 7: return <Slide8Quiz />;
      case 8: return <Slide9Summary />;
      default: return <Slide1Intro onNext={nextSlide} />;
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-screen bg-slate-950 flex flex-col overflow-hidden font-sans"
    >
      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6 md:px-10 shadow-[0_-4px_15px_rgba(0,0,0,0.5)] z-20">
        <div className="flex items-center gap-4 w-1/3">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-3 rounded-full hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-300"
            aria-label="上一页"
          >
            <ChevronLeft size={32} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 w-1/3">
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-4 rounded-full transition-all duration-300 ${
                currentSlide === i 
                  ? 'bg-cyan-500 w-12 shadow-[0_0_10px_rgba(34,211,238,0.8)]' 
                  : 'bg-slate-700 w-4 hover:bg-slate-600'
              }`}
              aria-label={`跳转到第 ${i + 1} 页`}
            />
          ))}
        </div>

        <div className="flex items-center justify-end gap-6 w-1/3">
          <button
            onClick={nextSlide}
            disabled={currentSlide === TOTAL_SLIDES - 1}
            className="p-3 rounded-full hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-300"
            aria-label="下一页"
          >
            <ChevronRight size={32} />
          </button>
          
          <div className="w-px h-10 bg-slate-700 mx-2 hidden md:block"></div>

          <button
            onClick={toggleFullscreen}
            className="p-3 rounded-full hover:bg-slate-800 transition-colors text-slate-300 hidden md:block"
            title={isFullscreen ? "退出全屏" : "全屏模式"}
          >
            {isFullscreen ? <Minimize size={28} /> : <Maximize size={28} />}
          </button>
        </div>
      </div>
    </div>
  );
}
