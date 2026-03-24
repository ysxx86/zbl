import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Table, Hand, Lightbulb } from 'lucide-react';
import { useSoundContext } from '../App';

interface Record {
  x: number;
  y: number;
}

interface Props {
  records: Record[];
}

export default function Slide3Table({ records }: Props) {
  const { play } = useSoundContext();
  const data = records.length > 0 ? records : [
    { x: 1, y: 2 },
    { x: 2, y: 4 },
    { x: 3, y: 6 },
    { x: 4, y: 8 },
    { x: 5, y: 10 },
  ];

  const [revealed, setRevealed] = useState<number[]>([]);

  const handleReveal = (index: number) => {
    if (!revealed.includes(index)) {
      play('reveal');
      setRevealed(prev => [...prev, index]);
    }
  };

  const allRevealed = revealed.length === data.length;

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 md:p-8 text-slate-100 relative overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 z-10 flex-shrink-0">
        <h2 className="text-3xl md:text-4xl font-black text-cyan-400 mb-2 flex items-center gap-4 drop-shadow-md">
          <Table size={36} /> 模块二：寻找不变的秘密
        </h2>
        <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed">
          基于上一模块的航行日志，我们来看看"飞行距离"和"飞行时间"之间有什么隐藏的规律。
          <strong className="text-yellow-400 ml-2">点击表格的每一列，看看会发生什么！</strong>
        </p>
      </motion.div>

      <div className="flex-1 flex flex-col items-center justify-start max-w-6xl mx-auto w-full z-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-slate-900/80 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-700 overflow-x-auto flex-shrink-0"
        >
          <table className="w-full text-center border-collapse text-2xl md:text-3xl">
            <tbody>
              {/* Row 1: Time */}
              <tr className="bg-slate-800/50">
                <th className="p-4 border-2 border-slate-600 text-cyan-300 font-bold w-1/4 whitespace-nowrap shadow-inner">时间 (小时)</th>
                {data.map((item, i) => (
                  <td key={`x-${i}`} className="p-4 border-2 border-slate-600 font-medium text-slate-200">
                    {item.x}
                  </td>
                ))}
              </tr>

              {/* Row 2: Distance */}
              <tr className="bg-slate-800/50">
                <th className="p-4 border-2 border-slate-600 text-yellow-400 font-bold w-1/4 whitespace-nowrap shadow-inner">距离 (万千米)</th>
                {data.map((item, i) => (
                  <td key={`y-${i}`} className="p-4 border-2 border-slate-600 font-medium text-yellow-300">
                    {item.y}
                  </td>
                ))}
              </tr>

              {/* Row 3: Ratio (Interactive) */}
              <tr>
                <th className="p-4 border-2 border-slate-600 text-emerald-400 font-bold bg-emerald-900/30 w-1/4 whitespace-nowrap shadow-inner">
                  距离 ÷ 时间
                </th>
                {data.map((item, i) => {
                  const isRevealed = revealed.includes(i);
                  const ratio = item.y / item.x;

                  return (
                    <td
                      key={`ratio-${i}`}
                      onClick={() => handleReveal(i)}
                      className={`p-4 border-2 border-slate-600 relative cursor-pointer transition-colors ${
                        isRevealed ? 'bg-emerald-900/50' : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isRevealed ? (
                          <motion.div
                            key="revealed"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="font-bold text-emerald-400 flex flex-col items-center"
                          >
                            <span className="text-lg text-emerald-300/70 mb-1">{item.y} ÷ {item.x} =</span>
                            <span className="text-4xl drop-shadow-md">{ratio}</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center text-slate-400 gap-2"
                          >
                            <Hand size={28} className="animate-bounce text-cyan-400" />
                            <span className="text-lg font-medium">点击计算</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </motion.div>

        {/* Conclusion */}
        <AnimatePresence>
          {allRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.4)] max-w-4xl text-center w-full border border-emerald-400 mt-4 flex-shrink-0"
            >
              <h3 className="text-2xl font-black mb-4 flex items-center justify-center gap-3 drop-shadow-md">
                <Lightbulb size={32} className="text-yellow-300" /> 惊人的发现！
              </h3>
              <p className="text-xl leading-relaxed font-medium">
                无论飞行时间和距离怎么变化，它们的<strong className="text-yellow-300 mx-2 text-3xl drop-shadow-lg">比值（商）始终是 2</strong>！<br/>
                这个不变的比值，其实就是飞船的<strong className="text-yellow-300 mx-2 text-2xl">飞行速度</strong>。
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
