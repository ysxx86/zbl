import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Plus, Clock, Map } from 'lucide-react';

interface Record {
  x: number;
  y: number;
}

interface Props {
  records: Record[];
  setRecords: React.Dispatch<React.SetStateAction<Record[]>>;
  hours: number;
  setHours: React.Dispatch<React.SetStateAction<number>>;
}

export default function Slide2Scenario({ records, setRecords, hours, setHours }: Props) {
  const speed = 2; // 万千米/小时
  const distance = hours * speed;

  const handleRecord = () => {
    if (!records.find(r => r.x === hours)) {
      setRecords(prev => [...prev, { x: hours, y: distance }].sort((a, b) => a.x - b.x));
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 md:p-12 text-slate-100 relative overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 z-10">
        <h2 className="text-4xl md:text-5xl font-black text-cyan-400 mb-4 flex items-center gap-4 drop-shadow-md">
          <Rocket size={48} /> 模块一：星际航行中的变化
        </h2>
        <p className="text-2xl md:text-3xl text-slate-300 font-medium leading-relaxed">
          “星际探索号”飞船正以 <strong className="text-yellow-400 text-4xl mx-2">2 万千米/小时</strong> 的恒定速度驶向火星。<br/>
          拖动滑块改变飞行时间，观察飞行距离的变化，并记录数据！
        </p>
      </motion.div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto w-full z-10">
        {/* Left: Interactive Area */}
        <div className="bg-slate-900/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-slate-700 flex flex-col items-center justify-center gap-10">
          
          {/* Slider Control */}
          <div className="w-full text-center bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-inner">
            <div className="text-3xl font-bold mb-6 flex items-center justify-center gap-3 text-cyan-300">
              <Clock size={36} /> 飞行时间: <span className="text-white text-5xl mx-2">{hours}</span> 小时
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full h-6 bg-slate-700 rounded-full appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
            />
          </div>

          {/* Visual Feedback */}
          <div className="relative w-full h-32 bg-slate-950 rounded-full border-2 border-slate-800 overflow-hidden flex items-center shadow-inner">
            {/* Track markers */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="absolute h-full w-px bg-slate-800" style={{ left: `${(i + 1) * 10}%` }}></div>
            ))}
            {/* Rocket with Flame */}
            <motion.div
              animate={{ left: `${(hours / 10) * 85}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="absolute flex items-center justify-center"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              {/* Flame */}
              <motion.div
                animate={{ scaleX: [1, 1.4, 0.9, 1.3], opacity: [0.7, 1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 0.3 }}
                className="absolute -left-12 w-16 h-6 bg-gradient-to-l from-yellow-300 via-orange-500 to-red-600 rounded-full blur-[3px]"
                style={{ transformOrigin: 'right center' }}
              />
              {/* Rocket Emoji */}
              <div 
                className="text-6xl drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] relative z-10"
                style={{ transform: 'rotate(45deg)' }}
              >
                🚀
              </div>
            </motion.div>
          </div>

          {/* Output */}
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 px-10 py-6 rounded-2xl text-blue-100 border border-blue-700 shadow-lg flex items-center gap-4 w-full justify-center">
            <Map size={40} className="text-blue-300" />
            飞行距离: <span className="text-yellow-400 text-6xl mx-2 drop-shadow-md">{distance}</span> 万千米
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(56,189,248,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRecord}
            className="flex items-center justify-center gap-3 bg-cyan-600 text-white px-10 py-5 rounded-full text-3xl font-bold shadow-xl hover:bg-cyan-500 transition-colors w-full"
          >
            <Plus size={36} /> 记录当前航行数据
          </motion.button>
        </div>

        {/* Right: Records List */}
        <div className="bg-slate-900/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-slate-700 flex flex-col">
          <h3 className="text-3xl font-black text-cyan-400 mb-8 border-b-2 border-slate-700 pb-6 flex items-center gap-3">
            📝 航行日志 (数据表)
          </h3>
          
          {records.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-2xl border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/50">
              点击左侧“记录当前航行数据”按钮添加记录
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-4 space-y-4 custom-scrollbar">
              {records.map((record, index) => (
                <motion.div
                  key={record.x}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center bg-slate-800 p-6 rounded-2xl border border-slate-600 shadow-md"
                >
                  <span className="text-2xl font-bold text-slate-400">
                    第 {index + 1} 次记录
                  </span>
                  <div className="flex gap-8 text-2xl font-medium">
                    <span>时间: <strong className="text-cyan-400">{record.x} 小时</strong></span>
                    <span>距离: <strong className="text-yellow-400">{record.y} 万千米</strong></span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {records.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-gradient-to-r from-emerald-900 to-teal-900 text-emerald-100 p-6 rounded-2xl font-bold text-center text-2xl border border-emerald-700 shadow-lg"
            >
              💡 观察航行日志，你发现“时间”和“距离”是怎么变化的吗？<br/>
              （按键盘 <kbd className="bg-slate-800 px-3 py-1 rounded-md shadow-sm text-xl border border-slate-600 mx-2">➡️</kbd> 进入下一模块探究）
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
