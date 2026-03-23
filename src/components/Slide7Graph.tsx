import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, MousePointerClick, AlertCircle } from 'lucide-react';

interface Props {
  records: { x: number; y: number }[];
}

export default function Slide7Graph({ records }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<{ x: number; y: number }[]>([]);

  // Default data if user skipped the scenario
  const defaultData = [
    { x: 1, y: 60 },
    { x: 2, y: 120 },
    { x: 3, y: 180 },
    { x: 4, y: 240 },
    { x: 5, y: 300 },
  ];

  const chartData = records.length > 0 ? records : defaultData;

  useEffect(() => {
    if (step === 0) {
      setData([]);
    } else if (step === 1) {
      setData([chartData[0]]);
    } else if (step === 2) {
      setData(chartData);
    } else if (step === 3) {
      setData(chartData);
    }
  }, [step, chartData]);

  // Data for the curve (non-proportional example)
  const curveData = [
    { x: 0, y: 0 },
    { x: 1, y: 10 },
    { x: 2, y: 40 },
    { x: 3, y: 90 },
    { x: 4, y: 160 },
    { x: 5, y: 250 },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 md:p-12 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 z-10">
        <h2 className="text-4xl md:text-5xl font-black text-emerald-400 mb-4 flex items-center gap-4 drop-shadow-md">
          <TrendingUp size={48} /> 模块五：绘制星际航线图
        </h2>
        <p className="text-2xl md:text-3xl text-slate-300 font-medium leading-relaxed">
          数学家最喜欢把数字变成图像！<br/>让我们把飞船的数据画在坐标轴上，看看“正比例”长什么样？
        </p>
      </motion.div>

      <div className="flex-1 flex flex-col md:flex-row gap-10 max-w-7xl mx-auto w-full z-10">
        {/* Left: Interactive Controls */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-700 flex flex-col gap-6">
            <h3 className="text-3xl font-bold text-emerald-300 mb-4 border-b-2 border-slate-700 pb-4">绘制步骤</h3>
            
            <button
              onClick={() => setStep(1)}
              className={`p-6 rounded-2xl text-2xl font-bold transition-all flex items-center gap-4 shadow-lg border-2 ${step >= 1 ? 'bg-emerald-900/50 text-emerald-300 border-emerald-500' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border-slate-600'}`}
            >
              <MousePointerClick size={32} /> 1. 描出第一个点
            </button>
            
            <button
              onClick={() => setStep(2)}
              disabled={step < 1}
              className={`p-6 rounded-2xl text-2xl font-bold transition-all flex items-center gap-4 shadow-lg border-2 ${step >= 2 ? 'bg-emerald-900/50 text-emerald-300 border-emerald-500' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed'}`}
            >
              <MousePointerClick size={32} /> 2. 描出所有点
            </button>
            
            <button
              onClick={() => setStep(3)}
              disabled={step < 2}
              className={`p-6 rounded-2xl text-2xl font-bold transition-all flex items-center gap-4 shadow-lg border-2 ${step >= 3 ? 'bg-emerald-900/50 text-emerald-300 border-emerald-500' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed'}`}
            >
              <MousePointerClick size={32} /> 3. 连线！
            </button>

            <button
              onClick={() => setStep(4)}
              disabled={step < 3}
              className={`p-6 rounded-2xl text-2xl font-bold transition-all flex items-center gap-4 shadow-lg border-2 mt-4 ${step >= 4 ? 'bg-red-900/50 text-red-300 border-red-500' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed'}`}
            >
              <AlertCircle size={32} /> 4. 对比：不成正比例的图
            </button>
          </div>

          <AnimatePresence>
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-emerald-900 to-teal-900 p-8 rounded-3xl shadow-2xl border border-emerald-500 text-center"
              >
                <h3 className="text-3xl font-black text-emerald-300 mb-4 drop-shadow-md">终极发现 💡</h3>
                <p className="text-2xl font-medium text-emerald-100 leading-relaxed">
                  正比例关系的图像，永远是一条<br/>
                  <strong className="text-yellow-400 text-4xl mx-2 drop-shadow-lg">经过原点的直线</strong>！
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Graph */}
        <div className="w-full md:w-2/3 bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] border border-slate-700 flex flex-col">
          <h3 className="text-3xl font-bold text-center mb-8 text-slate-300 tracking-widest">飞船航行距离与时间关系图</h3>
          <div className="flex-1 w-full min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="x" 
                  type="number" 
                  domain={[0, 6]} 
                  tickCount={7} 
                  stroke="#94a3b8" 
                  label={{ value: '时间 (小时)', position: 'insideBottomRight', offset: -10, fill: '#94a3b8', fontSize: 20 }}
                  tick={{ fontSize: 18 }}
                />
                <YAxis 
                  dataKey="y" 
                  type="number" 
                  domain={[0, 400]} 
                  stroke="#94a3b8"
                  label={{ value: '距离 (万公里)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 20 }}
                  tick={{ fontSize: 18 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#34d399' }}
                />
                
                {/* Proportional Line */}
                {step >= 1 && (
                  <Line 
                    data={data} 
                    type="linear" 
                    dataKey="y" 
                    stroke="#34d399" 
                    strokeWidth={6} 
                    dot={{ r: 10, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} 
                    activeDot={{ r: 12 }}
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                )}

                {/* Non-Proportional Curve (Area example) */}
                {step >= 4 && (
                  <Line 
                    data={curveData} 
                    type="monotone" 
                    dataKey="y" 
                    stroke="#f87171" 
                    strokeWidth={6} 
                    strokeDasharray="10 10"
                    dot={{ r: 8, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} 
                    isAnimationActive={true}
                    animationDuration={1500}
                    name="不成正比例 (如面积)"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {step >= 4 && (
            <div className="mt-6 text-center text-xl font-bold text-red-400 flex justify-center items-center gap-3">
              <div className="w-8 h-2 bg-red-400 border-dashed border-2 border-transparent"></div>
              红色虚线代表“不成正比例”的图像（它是一条曲线！）
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
