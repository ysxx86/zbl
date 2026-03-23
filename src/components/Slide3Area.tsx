import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Slide3Area() {
  const [side, setSide] = useState(1);
  const [data, setData] = useState<{ side: number; area: number; ratio: number }[]>([]);

  useEffect(() => {
    const newData = [];
    for (let i = 1; i <= side; i++) {
      newData.push({
        side: i,
        area: i * i,
        ratio: i,
      });
    }
    setData(newData);
  }, [side]);

  return (
    <div className="flex flex-col h-full bg-blue-50 p-6 md:p-10 text-slate-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
          探究二：正方形的面积与边长
        </h2>
        <p className="text-lg md:text-xl text-slate-600">
          现在，我们来看看面积和边长之间的关系。它们也是正比例吗？
        </p>
      </motion.div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-0">
        {/* Left Column: Controls & Table */}
        <div className="flex flex-col gap-6 bg-white p-6 rounded-3xl shadow-sm border border-blue-100 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <label className="text-xl font-semibold flex justify-between">
              <span>边长 (cm): <span className="text-blue-600">{side}</span></span>
              <span>面积 (cm²): <span className="text-blue-600">{side * side}</span></span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={side}
              onChange={(e) => setSide(Number(e.target.value))}
              className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            
            <div className="flex justify-center my-4">
               <motion.div
                className="bg-blue-500 flex items-center justify-center font-bold text-white shadow-inner"
                animate={{ width: side * 20, height: side * 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ minWidth: 20, minHeight: 20 }}
              >
                {side * side}
              </motion.div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th className="p-3 border border-blue-200 rounded-tl-xl">边长 (cm)</th>
                  <th className="p-3 border border-blue-200">面积 (cm²)</th>
                  <th className="p-3 border border-blue-200 rounded-tr-xl">面积 ÷ 边长</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.side} className="hover:bg-blue-50 transition-colors">
                    <td className="p-3 border border-blue-100 font-medium">{row.side}</td>
                    <td className="p-3 border border-blue-100 font-medium">{row.area}</td>
                    <td className="p-3 border border-blue-100 font-bold text-blue-600 bg-blue-50/50">
                      {row.ratio}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {side >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-100 text-red-800 p-4 rounded-xl font-bold text-center text-lg"
            >
              ⚠️ 注意看！面积和边长的比值在不断变化（1, 2, 3...），它不是一个固定的数！
            </motion.div>
          )}
        </div>

        {/* Right Column: Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 flex flex-col min-h-[300px]">
          <h3 className="text-xl font-bold text-center mb-4 text-slate-700">面积与边长关系图</h3>
          <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="side" 
                  type="number" 
                  domain={[0, 10]} 
                  label={{ value: '边长 (cm)', position: 'insideBottom', offset: -10 }} 
                />
                <YAxis 
                  domain={[0, 100]} 
                  label={{ value: '面积 (cm²)', angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip 
                  formatter={(value: number) => [`${value} cm²`, '面积']}
                  labelFormatter={(label) => `边长: ${label} cm`}
                />
                <Line 
                  type="monotone" 
                  dataKey="area" 
                  stroke="#2563eb" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8 }} 
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {side >= 3 && (
             <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-4 text-blue-600 font-semibold"
             >
               这些点连起来，是一条弯曲的线（抛物线），不是直线！
             </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
