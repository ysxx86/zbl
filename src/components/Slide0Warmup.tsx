import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Globe, Sparkles, Lightbulb, Star } from 'lucide-react';
import { useSoundContext } from '../App';

interface Destination {
  name: string;
  distance: number;
  time: number;
  emoji: string;
  color: string;
}

const destinations: Destination[] = [
  { name: '月球', distance: 38, time: 3.8, emoji: '🌙', color: 'from-slate-400 to-slate-600' },
  { name: '火星', distance: 5500, time: 550, emoji: '🔴', color: 'from-red-500 to-orange-600' },
  { name: '木星', distance: 63000, time: 6300, emoji: '🟠', color: 'from-orange-400 to-amber-600' },
];

interface Props {
  onNext: () => void;
}

export default function Slide0Warmup({ onNext }: Props) {
  const { play } = useSoundContext();
  const [step, setStep] = useState(0);
  const [revealedDestinations, setRevealedDestinations] = useState<number[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const speed = 10;

  const handleStart = () => {
    play('click');
    setStep(1);
  };

  const handleRevealDestination = (index: number) => {
    if (!revealedDestinations.includes(index)) {
      play('reveal');
      setRevealedDestinations(prev => [...prev, index]);
    }
  };

  const handleShowSummary = () => {
    play('click');
    setShowSummary(true);
  };

  const handleLaunch = () => {
    play('launch');
    setTimeout(() => {
      onNext();
    }, 500);
  };

  const stars = useMemo(() => {
    return Array.from({ length: 200 }).map(() => ({
      size: Math.random() * 2 + 0.5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 3 + 1.5,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#030014] text-white p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#030014] to-[#030014]"></div>
      
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full origin-top"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              backgroundColor: '#fff',
              boxShadow: `0 0 ${star.size * 2}px #fff`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mb-8"
              >
                <Rocket size={120} className="text-cyan-400 mx-auto drop-shadow-[0_0_30px_rgba(34,211,238,0.8)]" />
              </motion.div>
              
              <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(192,132,252,0.5)]">
                星际旅行计划
              </h1>
              
              <p className="text-3xl md:text-4xl text-indigo-200 mb-12 font-medium">
                课前互动 · 5分钟
              </p>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(34,211,238,0.6)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-16 py-8 rounded-full text-4xl font-bold shadow-[0_0_40px_rgba(34,211,238,0.4)] border-2 border-cyan-300/50"
              >
                开始探索 🚀
              </motion.button>
            </motion.div>
          )}

          {step === 1 && !showSummary && (
            <motion.div
              key="guessing"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-5xl md:text-6xl font-black text-cyan-400 mb-6">
                  🛸 速度大猜想
                </h2>
                <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 inline-block border border-cyan-500/30">
                  <p className="text-3xl text-slate-300 mb-4">我们的飞船速度：</p>
                  <p className="text-6xl font-black text-yellow-400">
                    10 万千米/小时
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {destinations.map((dest, index) => {
                  const isRevealed = revealedDestinations.includes(index);
                  
                  return (
                    <motion.div
                      key={dest.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      onClick={() => handleRevealDestination(index)}
                      className={`relative bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 border-2 cursor-pointer transition-all ${
                        isRevealed 
                          ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
                          : 'border-slate-600 hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-7xl mb-4">{dest.emoji}</div>
                        <h3 className="text-4xl font-bold text-white mb-4">{dest.name}</h3>
                        
                        <div className="bg-slate-700/50 rounded-2xl p-4 mb-4">
                          <p className="text-2xl text-slate-400 mb-2">距离</p>
                          <p className="text-4xl font-bold text-cyan-400">{dest.distance.toLocaleString()} 万km</p>
                        </div>

                        <AnimatePresence mode="wait">
                          {isRevealed ? (
                            <motion.div
                              key="revealed"
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="bg-emerald-900/50 rounded-2xl p-4 border border-emerald-500"
                            >
                              <p className="text-2xl text-emerald-300 mb-2">需要时间</p>
                              <p className="text-5xl font-black text-emerald-400">{dest.time.toLocaleString()} 小时</p>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="hidden"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="bg-slate-700/50 rounded-2xl p-6"
                            >
                              <p className="text-2xl text-slate-400">🤔 猜猜需要多少小时？</p>
                              <p className="text-lg text-cyan-400 mt-2">点击揭示答案</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {revealedDestinations.length === destinations.length && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <button
                    onClick={handleShowSummary}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-6 rounded-full text-3xl font-bold shadow-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all"
                  >
                    发现规律 ✨
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {showSummary && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h2 className="text-5xl md:text-6xl font-black text-purple-400 mb-8 flex items-center justify-center gap-4">
                <Lightbulb size={56} className="text-yellow-400" /> 发现规律！
              </h2>

              <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 mb-8 border border-purple-500/30">
                <table className="w-full text-center">
                  <thead>
                    <tr className="border-b-2 border-slate-600">
                      <th className="p-4 text-2xl text-cyan-400">目的地</th>
                      <th className="p-4 text-2xl text-cyan-400">距离 (万km)</th>
                      <th className="p-4 text-2xl text-cyan-400">时间 (小时)</th>
                      <th className="p-4 text-2xl text-emerald-400">距离 ÷ 时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {destinations.map((dest, i) => (
                      <motion.tr
                        key={dest.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="border-b border-slate-700"
                      >
                        <td className="p-4 text-2xl font-bold">{dest.emoji} {dest.name}</td>
                        <td className="p-4 text-2xl text-yellow-400">{dest.distance.toLocaleString()}</td>
                        <td className="p-4 text-2xl text-cyan-300">{dest.time.toLocaleString()}</td>
                        <td className="p-4 text-3xl font-black text-emerald-400">{speed}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-3xl p-8 mb-10 border border-emerald-500/50"
              >
                <p className="text-3xl text-emerald-100 font-medium leading-relaxed">
                  💡 无论去哪里，<strong className="text-4xl text-yellow-400 mx-2">距离 ÷ 时间 = 10</strong>
                  <br/>
                  <span className="text-2xl text-emerald-300">速度不变，距离越远，时间越长！</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <p className="text-2xl text-slate-300 mb-6">
                  距离和时间之间有神奇的关系，让我们深入探索！
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0_60px_rgba(34,211,238,0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLaunch}
                  className="flex items-center gap-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-16 py-8 rounded-full text-4xl font-bold shadow-[0_0_40px_rgba(34,211,238,0.4)] border-2 border-cyan-300/50"
                >
                  <Rocket size={48} /> 启动飞船，开始探索！
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
