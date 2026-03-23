import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, PlayCircle, Sparkles } from 'lucide-react';
import { useSoundContext } from '../App';

interface Props {
  onNext: () => void;
}

export default function Slide1Intro({ onNext }: Props) {
  const { play } = useSoundContext();
  const [isLaunching, setIsLaunching] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const [shootingStars, setShootingStars] = useState<any[]>([]);

  // Shooting Stars Spawner
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const spawn = () => {
      // Randomize quantity: sometimes many (4-10), sometimes 1-2
      const isBurst = Math.random() > 0.6;
      const count = isBurst ? Math.floor(Math.random() * 7) + 4 : Math.floor(Math.random() * 2) + 1;
      
      const newStars = Array.from({ length: count }).map(() => ({
        id: Date.now() + Math.random(),
        top: Math.random() * 120 - 20, // Entire screen
        left: Math.random() * 120 - 20, // Entire screen
        duration: Math.random() * 2 + 3, // 3 to 5 seconds
        delay: Math.random() * 0.5 // Slight stagger within the burst
      }));
      
      setShootingStars(prev => {
        const now = Date.now();
        // Keep stars that are less than 8 seconds old to prevent DOM bloat
        const active = prev.filter(s => now - s.id < 8000);
        return [...active, ...newStars];
      });
      
      // Schedule next spawn: random interval between 2s and 6s
      timeout = setTimeout(spawn, Math.random() * 4000 + 2000);
    };
    
    spawn();
    return () => clearTimeout(timeout);
  }, []);

  // Generate a dense starfield with a Milky Way band
  const stars = useMemo(() => {
    return Array.from({ length: 400 }).map(() => {
      // 60% of stars form the diagonal Milky Way band
      const isMilkyWay = Math.random() > 0.4;
      let top, left;
      
      if (isMilkyWay) {
        // Diagonal from top-left to bottom-right
        const progress = Math.random(); 
        const baseX = progress * 120 - 10;
        const baseY = progress * 120 - 10;
        // Perpendicular spread (tighter in the middle)
        const spread = (Math.random() - 0.5) * (Math.random() * 40 + 10);
        top = baseY + spread;
        left = baseX - spread;
      } else {
        top = Math.random() * 100;
        left = Math.random() * 100;
      }

      return {
        size: Math.random() * 2.5 + 0.5,
        top,
        left,
        duration: Math.random() * 3 + 1.5,
        delay: Math.random() * 2,
        color: ['#ffffff', '#c7d2fe', '#e0e7ff', '#bae6fd', '#fef08a', '#fbcfe8'][Math.floor(Math.random() * 6)]
      };
    });
  }, []);

  // Planets
  const planets = useMemo(() => {
    const types = ['saturn', 'gas-giant', 'rocky', 'ice', 'mars'];
    const count = Math.floor(Math.random() * 4) + 3; // 3 to 6 planets
    return Array.from({ length: count }).map((_, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const size = Math.random() * 80 + 30; // 30px to 110px
      const top = Math.random() * 80 + 10; // 10% to 90%
      const left = Math.random() * 80 + 10; // 10% to 90%
      const animationDuration = Math.random() * 10 + 10;
      const yOffset = Math.random() * 20 + 10;
      
      let colors = '';
      let shadow = '';
      if (type === 'saturn' || type === 'gas-giant') {
        colors = 'from-orange-300 to-amber-800';
        shadow = 'shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.6),0_0_20px_rgba(251,191,36,0.2)]';
      } else if (type === 'ice') {
        colors = 'from-cyan-200 to-blue-800';
        shadow = 'shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.6),0_0_20px_rgba(34,211,238,0.2)]';
      } else if (type === 'mars') {
        colors = 'from-red-400 to-red-900';
        shadow = 'shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.6),0_0_20px_rgba(248,113,113,0.2)]';
      } else {
        colors = 'from-stone-400 to-stone-800';
        shadow = 'shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.6),0_0_20px_rgba(168,162,158,0.2)]';
      }

      return { id: i, type, size, top, left, animationDuration, yOffset, colors, shadow };
    });
  }, []);

  const handleLaunch = () => {
    play('launch');
    setIsLaunching(true);
    setTimeout(() => {
      setIsWarping(true);
    }, 1000);
    setTimeout(() => {
      onNext();
    }, 3000); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#030014] text-white p-10 relative overflow-hidden perspective-1000">
      {/* Deep Space Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#030014] to-[#030014]"></div>
      
      {/* The Milky Way Core & Nebula */}
      <motion.div 
        animate={isWarping ? { scale: 2, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeIn" }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
      >
        {/* Deep Nebula Clouds */}
        <div className="absolute w-[150vw] h-[150vh] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#030014]/10 to-transparent blur-[100px] mix-blend-screen"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vh] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-fuchsia-600/20 via-transparent to-transparent blur-[80px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vh] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent blur-[90px] mix-blend-screen"></div>

        {/* Milky Way Band */}
        <div className="absolute w-[180vw] h-[40vh] bg-gradient-to-r from-transparent via-purple-800/30 to-transparent rotate-[35deg] blur-[80px] mix-blend-screen"></div>
        <div className="absolute w-[150vw] h-[20vh] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent rotate-[35deg] blur-[50px] mix-blend-screen"></div>
        <div className="absolute w-[100vw] h-[10vh] bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent rotate-[35deg] blur-[30px] mix-blend-screen"></div>
        
        {/* Dark rift (dust lane) */}
        <div className="absolute w-[120vw] h-[15vh] bg-gradient-to-r from-transparent via-black/90 to-transparent rotate-[35deg] blur-[40px] mix-blend-multiply translate-x-12 translate-y-12"></div>
      </motion.div>

      {/* Planets */}
      <motion.div
        animate={isWarping ? { y: '150vh', scale: 3, opacity: 0 } : { y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeIn" }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Random Planets */}
        {planets.map(planet => (
          <motion.div
            key={`planet-${planet.id}`}
            animate={isLaunching && !isWarping ? {} : { y: [-planet.yOffset, planet.yOffset, -planet.yOffset], rotate: [0, 10, 0] }}
            transition={{ duration: planet.animationDuration, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute rounded-full bg-gradient-to-br ${planet.colors} ${planet.shadow}`}
            style={{
              top: `${planet.top}%`,
              left: `${planet.left}%`,
              width: `${planet.size}px`,
              height: `${planet.size}px`,
            }}
          >
            {planet.type === 'saturn' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260%] h-[20%] border-[4px] border-amber-200/30 rounded-[50%] rotate-[-25deg] shadow-[0_0_10px_rgba(251,191,36,0.5)] backdrop-blur-sm"></div>
            )}
          </motion.div>
        ))}

        {/* Earth Horizon */}
        <motion.div
           animate={isWarping ? { y: '50vh', opacity: 0 } : { y: 0, opacity: 1 }}
           transition={{ duration: 1.2, ease: "easeIn" }}
           className="absolute bottom-0 left-0 right-0 h-[35vh] pointer-events-none overflow-hidden z-0"
        >
           {/* The Earth Curve */}
           <motion.div 
              animate={{ 
                boxShadow: [
                  'inset 0 20px 100px rgba(56,189,248,0.15), 0 -5px 20px rgba(56,189,248,0.2)', 
                  'inset 0 20px 100px rgba(56,189,248,0.3), 0 -15px 50px rgba(56,189,248,0.6)', 
                  'inset 0 20px 100px rgba(56,189,248,0.15), 0 -5px 20px rgba(56,189,248,0.2)'
                ] 
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[250vw] md:w-[150vw] h-[250vw] md:h-[150vw] rounded-[50%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-slate-950 to-black border-t border-cyan-500/40"
           >
              
              {/* Atmosphere Glow / Sunrise */}
              <motion.div 
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[25vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400/50 via-blue-600/20 to-transparent blur-[40px] -mt-[12vh]"
              ></motion.div>
              
              {/* Sunburst center */}
              <motion.div 
                animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[15vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-cyan-200/80 to-transparent blur-[30px] -mt-[7vh]"
              ></motion.div>
              
              {/* Surface details (subtle noise/clouds) */}
              <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[100vw] h-[30vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent blur-xl rounded-[50%] rotate-6"></div>
              <div className="absolute top-[10%] left-1/3 -translate-x-1/2 w-[80vw] h-[20vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-200/5 via-transparent to-transparent blur-2xl rounded-[50%] -rotate-12"></div>
           </motion.div>
        </motion.div>
      </motion.div>

      {/* Stars & Warp Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full origin-top"
            initial={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              backgroundColor: star.color,
              boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
            }}
            animate={isWarping ? {
              y: ['0vh', '200vh'],
              height: [`${star.size}px`, '150px', '300px'],
              opacity: [1, 0.8, 0],
            } : {
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={isWarping ? {
              duration: Math.random() * 0.4 + 0.2, // Super fast warp streaks
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 0.5 // Staggered warp start
            } : {
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Shooting Stars (Original Style, Random Bursts) */}
      <motion.div
        animate={isLaunching ? { opacity: 0 } : { opacity: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        {shootingStars.map((ss) => (
          <div
            key={ss.id}
            className="absolute w-64 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{
              top: `${ss.top}%`,
              left: `${ss.left}%`,
              transform: 'rotate(-45deg)',
              animation: `shooting-star ${ss.duration}s forwards ${ss.delay}s linear`
            }}
          />
        ))}
      </motion.div>

      {/* Warp Flash */}
      <AnimatePresence>
        {isWarping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cyan-100 mix-blend-overlay z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Rocket & Shockwave */}
      <motion.div
        className="mb-8 relative z-30"
      >
        {/* Shockwave */}
        <AnimatePresence>
          {isWarping && (
            <motion.div
              initial={{ scale: 0.5, opacity: 1, borderWidth: '30px' }}
              animate={{ scale: 40, opacity: 0, borderWidth: '0px' }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-cyan-300 shadow-[0_0_100px_rgba(34,211,238,1)] z-0"
              style={{ width: '100px', height: '100px' }}
            />
          )}
        </AnimatePresence>

        <motion.div
          animate={
            isWarping ? { y: -1500, scale: 0.4 } :
            isLaunching ? { 
              x: [-4, 4, -4, 4, -4, 4, 0], 
              y: [2, -2, 2, -2, 2, -2, 0],
              scale: 1.05
            } : 
            { y: [-15, 15, -15] }
          }
          transition={
            isWarping ? { duration: 0.8, ease: "easeIn" } :
            isLaunching ? { duration: 1, ease: "linear" } :
            { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }
          className="text-cyan-300 drop-shadow-[0_0_50px_rgba(34,211,238,0.8)] relative z-10"
        >
          <Rocket size={160} className="relative z-10" />
          
          {/* Realistic Plasma Engine Flame */}
          <AnimatePresence>
            {(isLaunching || isWarping) && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={isWarping ? { opacity: 1, scaleY: 5, scaleX: 1.5 } : { opacity: 1, scaleY: 1.5, scaleX: 1 }}
                transition={{ duration: isWarping ? 0.2 : 0.8 }}
                className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-12 h-48 bg-gradient-to-b from-white via-cyan-300 to-blue-700 blur-xl origin-top rounded-full z-0"
              />
            )}
          </AnimatePresence>
          
          {/* Engine Core Glow */}
          <AnimatePresence>
            {(isLaunching || isWarping) && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: isWarping ? 2 : 1 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full blur-md z-10"
              />
            )}
          </AnimatePresence>

          {/* Magic Sparkles (fade out on launch) */}
          <motion.div 
            animate={isLaunching ? { opacity: 0, scale: 0 } : { scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4], rotate: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-6 -left-6 text-fuchsia-300 blur-[1px] z-20"
          >
            <Sparkles size={56} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* UI Content */}
      <motion.div
        animate={isLaunching ? { opacity: 0, y: 50, scale: 0.9 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="flex flex-col items-center relative z-40"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-6xl md:text-8xl font-black mb-8 text-center tracking-tight bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(192,132,252,0.5)]"
        >
          宇宙探索：正比例的奥秘
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-2xl md:text-3xl text-indigo-100 mb-16 text-center max-w-4xl leading-relaxed font-medium drop-shadow-md"
        >
          准备好踏上这场浪漫的星际之旅了吗？<br/>
          今天，我们将驾驶宇宙飞船，穿越<strong className="text-fuchsia-300 mx-2">银河系</strong>，<br/>
          揭开数学中“变与不变”的终极秘密！
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(192,132,252,0.6)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLaunch}
          disabled={isLaunching}
          className="flex items-center gap-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-12 py-6 rounded-full text-3xl font-bold shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all border border-purple-300/50 disabled:opacity-80 disabled:cursor-not-allowed group"
        >
          <PlayCircle size={40} className="group-hover:animate-pulse" /> 启动飞船，驶向星辰！
        </motion.button>
      </motion.div>

      <style>{`
        @keyframes shooting-star {
          0% { transform: translateX(0) translateY(0) rotate(-45deg) scale(1); opacity: 1; }
          10% { transform: translateX(-400px) translateY(400px) rotate(-45deg) scale(1); opacity: 1; }
          100% { transform: translateX(-3000px) translateY(3000px) rotate(-45deg) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
