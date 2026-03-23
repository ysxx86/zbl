import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Square, Hand, AlertTriangle } from 'lucide-react';

export default function Slide6SquareArea() {
  const [side, setSide] = useState(1);
  const [revealed, setRevealed] = useState<number[]>([]);

  const data = [1, 2, 3, 4, 5].map(x => ({ x, y: x * x }));

  const handleReveal = (index: number) => {
    if (!revealed.includes(index)) {
      setRevealed(prev => [...prev, index]);
    }
  };

  const allRevealed = revealed.length === data.length;

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 md:p-12 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 z-10">
        <h2 className="text-4xl md:text-5xl font-black text-purple-400 mb-4 flex items-center gap-4 drop-shadow-md">
          <Square size={48} /> 模块四 (进阶)：太阳能板的面积
        </h2>
        <p className="text-2xl md:text-3xl text-slate-300 font-medium leading-relaxed">
          刚才我们验证了周长和边长成正比例，现在来看看太阳能板的<strong className="text-purple-400 mx-2">面积</strong>。<br/>
          拖动滑块改变<strong className="text-cyan-400 mx-2">边长</strong>，观察<strong className="text-purple-400 mx-2">面积</strong>的变化，看看它们成正比例吗？
        </p>
      </motion.div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto w-full z-10">
        {/* Left: Interactive Square */}
        <div className="bg-slate-900/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-slate-700 flex flex-col items-center justify-center gap-10">
          <div className="w-full text-center bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-inner">
            <div className="text-3xl font-bold mb-6 flex items-center justify-center gap-3 text-cyan-300">
              边长: <span className="text-white text-5xl mx-2">{side}</span> 米
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={side}
              onChange={(e) => setSide(Number(e.target.value))}
              className="w-full h-6 bg-slate-700 rounded-full appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
            />
          </div>

          <div className="relative w-full h-64 bg-slate-950 rounded-2xl border-2 border-slate-800 flex items-center justify-center shadow-inner overflow-hidden">
            <motion.div
              animate={{ width: side * 40, height: side * 40 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-purple-500/20 border-4 border-purple-400 shadow-[0_0_30px_rgba(192,132,252,0.3)] flex items-center justify-center relative"
            >
              <span className="absolute -top-8 text-cyan-300 font-bold text-xl">{side}m</span>
              <span className="absolute -right-10 text-cyan-300 font-bold text-xl">{side}m</span>
              <span className="text-2xl font-black text-purple-200 whitespace-nowrap">面积: {side * side}m²</span>
            </motion.div>
          </div>
        </div>

        {/* Right: Table */}
        <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-700 flex flex-col justify-center">
          <table className="w-full text-center border-collapse text-2xl md:text-3xl">
            <tbody>
              <tr className="bg-slate-800/50">
                <th className="p-4 border-2 border-slate-600 text-cyan-300 font-bold w-2/5 whitespace-nowrap shadow-inner">边长 (m)</th>
                {data.map((item, i) => (
                  <td key={`x-${i}`} className={`p-4 border-2 border-slate-600 font-medium ${side === item.x ? 'bg-cyan-900/50 text-cyan-100' : 'text-slate-200'}`}>
                    {item.x}
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-800/50">
                <th className="p-4 border-2 border-slate-600 text-purple-400 font-bold w-2/5 whitespace-nowrap shadow-inner">面积 (m²)</th>
                {data.map((item, i) => (
                  <td key={`y-${i}`} className={`p-4 border-2 border-slate-600 font-medium ${side === item.x ? 'bg-purple-900/30 text-purple-100' : 'text-purple-300'}`}>
                    {item.y}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="p-4 border-2 border-slate-600 text-red-400 font-bold bg-red-900/30 w-2/5 whitespace-nowrap shadow-inner">
                  面积 ÷ 边长
                </th>
                {data.map((item, i) => {
                  const isRevealed = revealed.includes(i);
                  return (
                    <td
                      key={`ratio-${i}`}
                      onClick={() => handleReveal(i)}
                      className={`p-4 border-2 border-slate-600 relative cursor-pointer transition-colors ${
                        isRevealed ? 'bg-red-900/50' : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isRevealed ? (
                          <motion.div
                            key="revealed"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="font-bold text-red-400"
                          >
                            {item.y / item.x}
                          </motion.div>
                        ) : (
                          <motion.div
                            key="hidden"
                            exit={{ opacity: 0 }}
                            className="flex justify-center text-slate-400"
                          >
                            <Hand size={28} className="animate-bounce text-cyan-400" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>

          <AnimatePresence>
            {allRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-gradient-to-r from-red-900 to-orange-900 text-white p-6 rounded-2xl shadow-lg border border-red-500 text-center"
              >
                <h3 className="text-2xl font-black mb-2 flex items-center justify-center gap-2">
                  <AlertTriangle size={32} className="text-yellow-300" /> 注意！比值变了！
                </h3>
                <p className="text-xl font-medium">
                  正方形的面积和边长的比值<strong className="text-yellow-300 text-3xl mx-2">不是固定的</strong>（比值等于边长本身）。<br/>
                  所以，正方形的面积和边长 <strong className="text-red-300 text-3xl mx-1">不成正比例</strong>！
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
