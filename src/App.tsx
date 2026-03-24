import { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize, Minimize, ChevronLeft, ChevronRight, Volume2, VolumeX, PanelBottomClose, PanelBottomOpen } from 'lucide-react';

import Slide0Warmup from './components/Slide0Warmup';
import Slide1Intro from './components/Slide1Intro';
import Slide2Scenario from './components/Slide2Scenario';
import Slide3Table from './components/Slide3Table';
import Slide4Concept from './components/Slide4Concept';
import Slide5Square from './components/Slide5Square';
import Slide6SquareArea from './components/Slide6SquareArea';
import Slide7Quiz from './components/Slide7Quiz';
import Slide8Summary from './components/Slide8Summary';
import { useSound, SoundType } from './hooks/useSound';

const TOTAL_SLIDES = 9;

const slideTitles = [
  '课前互动',
  '引入',
  '情境探索',
  '数据分析',
  '概念学习',
  '周长正例',
  '面积反例',
  '综合练习',
  '总结升华',
];

interface Record {
  x: number;
  y: number;
}

interface SoundContextType {
  play: (sound: SoundType) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const SoundContext = createContext<SoundContextType>({
  play: () => {},
  soundEnabled: true,
  toggleSound: () => {},
});

export const useSoundContext = () => useContext(SoundContext);

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { play, enabled: soundEnabled, toggle: toggleSound } = useSound();

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
    play('click');
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
    play('click');
    setCurrentSlide(s => Math.min(s + 1, TOTAL_SLIDES - 1));
  }, [play]);

  const prevSlide = useCallback(() => {
    play('click');
    setCurrentSlide(s => Math.max(s - 1, 0));
  }, [play]);

  const goToSlide = useCallback((index: number) => {
    play('click');
    setCurrentSlide(index);
  }, [play]);

  const toggleNavbar = useCallback(() => {
    play('click');
    setIsNavbarCollapsed(prev => !prev);
  }, [play]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      case 0: return <Slide0Warmup onNext={nextSlide} />;
      case 1: return <Slide1Intro onNext={nextSlide} />;
      case 2: return <Slide2Scenario records={records} setRecords={setRecords} hours={hours} setHours={setHours} />;
      case 3: return <Slide3Table records={records} />;
      case 4: return <Slide4Concept />;
      case 5: return <Slide5Square />;
      case 6: return <Slide6SquareArea />;
      case 7: return <Slide7Quiz />;
      case 8: return <Slide8Summary />;
      default: return <Slide0Warmup onNext={nextSlide} />;
    }
  };

  return (
    <SoundContext.Provider value={{ play, soundEnabled, toggleSound }}>
      <div 
        ref={containerRef} 
        className="w-full h-screen bg-slate-950 flex flex-col overflow-hidden font-sans"
      >
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

        <motion.div 
          className="bg-slate-900 border-t border-slate-800 shadow-[0_-4px_15px_rgba(0,0,0,0.5)] z-20 overflow-hidden"
          animate={{ 
            height: isNavbarCollapsed ? 0 : 'auto',
            opacity: isNavbarCollapsed ? 0 : 1
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="h-24 flex items-center justify-between px-8">
            <div className="flex items-center gap-4 w-1/4">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="p-4 rounded-full hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-300"
                aria-label="上一页"
              >
                <ChevronLeft size={36} />
              </button>
              <span className="text-slate-400 text-xl hidden lg:block">← → 切换页面</span>
            </div>

            <div className="flex items-center justify-center gap-4 w-1/2">
              {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`h-5 rounded-full transition-all duration-300 ${
                    currentSlide === i 
                      ? 'bg-cyan-500 w-16 shadow-[0_0_15px_rgba(34,211,238,0.8)]' 
                      : 'bg-slate-700 w-5 hover:bg-slate-600'
                  }`}
                  aria-label={`跳转到第 ${i + 1} 页`}
                />
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 w-1/4">
              <div className="text-right mr-4 hidden lg:block">
                <p className="text-cyan-400 font-bold text-xl">{slideTitles[currentSlide]}</p>
                <p className="text-slate-500 text-lg">{currentSlide + 1} / {TOTAL_SLIDES}</p>
              </div>

              <button
                onClick={toggleSound}
                className="p-3 rounded-full hover:bg-slate-800 transition-colors text-slate-300"
                title={soundEnabled ? "关闭音效" : "开启音效"}
              >
                {soundEnabled ? <Volume2 size={28} /> : <VolumeX size={28} />}
              </button>
              
              <div className="w-px h-10 bg-slate-700"></div>

              <button
                onClick={nextSlide}
                disabled={currentSlide === TOTAL_SLIDES - 1}
                className="p-3 rounded-full hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-300"
                aria-label="下一页"
              >
                <ChevronRight size={32} />
              </button>

              <div className="w-px h-10 bg-slate-700"></div>

              <button
                onClick={toggleFullscreen}
                className="p-3 rounded-full hover:bg-slate-800 transition-colors text-slate-300"
                title={isFullscreen ? "退出全屏" : "全屏模式"}
              >
                {isFullscreen ? <Minimize size={28} /> : <Maximize size={28} />}
              </button>

              <div className="w-px h-10 bg-slate-700"></div>

              <button
                onClick={toggleNavbar}
                className="p-3 rounded-full hover:bg-slate-800 transition-colors text-cyan-400"
                title={isNavbarCollapsed ? "展开导航栏" : "收起导航栏"}
              >
                {isNavbarCollapsed ? <PanelBottomOpen size={28} /> : <PanelBottomClose size={28} />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </SoundContext.Provider>
  );
}
