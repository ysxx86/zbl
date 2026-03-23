import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Slide2Perimeter() {
  const [side, setSide] = useState(1);
  const [data, setData] = useState<{ side: number; perimeter: number; ratio: number }[]>([]);

  useEffect(() => {
    // Generate data up to the current side
    const newData = [];
    for (let i = 1; i <= side; i++) {
      newData.push({
        side: i,
        perimeter: i * 4,
        ratio: 4,
      });
    }
    setData(newData);
  }, [side]);

  return (
    <div className="flex flex-col h-full bg-orange-50 p-6 md:p-10 text-slate-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
          探究一：正方形的周长与边长
        </h2>
        <p className="text-lg md:text-xl text-slate-600">
          拖动滑块改变正方形的边长，观察周长是如何变化的，并计算它们的比值。
        </p>
      </motion.div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-0">
        {/* Left Column: Controls & Table */}
        <div className="flex flex-col gap-6 bg-white p-6 rounded-3xl shadow-sm border border-orange-100 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <label className="text-xl font-semibold flex justify-between">
              <span>边长 (cm): <span className="text-orange-600">{side}</span></span>
              <span>周长 (cm): <span className="text-orange-600">{side * 4}</span></span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={side}
              onChange={(e) => setSide(Number(e.target.value))}
              className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            
            <div className="flex justify-center my-4">
              <motion.div
                className="border-4 border-orange-500 bg-orange-100 flex items-center justify-center font-bold text-orange-700"
                animate={{ width: side * 20, height: side * 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ minWidth: 20, minHeight: 20 }}
              >
                {side}
              </motion.div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-orange-100 text-orange-800">
                  <th className="p-3 border border-orange-200 rounded-tl-xl">边长 (cm)</th>
                  <th className="p-3 border border-orange-200">周长 (cm)</th>
                  <th className="p-3 border border-orange-200 rounded-tr-xl">周长 ÷ 边长</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.side} className="hover:bg-orange-50 transition-colors">
                    <td className="p-3 border border-orange-100 font-medium">{row.side}</td>
                    <td className="p-3 border border-orange-100 font-medium">{row.perimeter}</td>
                    <td className="p-3 border border-orange-100 font-bold text-orange-600 bg-orange-50/50">
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
              className="bg-green-100 text-green-800 p-4 rounded-xl font-bold text-center text-lg"
            >
              💡 发现了吗？无论边长怎么变，周长和边长的比值始终是 4！
            </motion.div>
          )}
        </div>

        {/* Right Column: Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 flex flex-col min-h-[300px]">
          <h3 className="text-xl font-bold text-center mb-4 text-slate-700">周长与边长关系图</h3>
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
                  domain={[0, 40]} 
                  label={{ value: '周长 (cm)', angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip 
                  formatter={(value: number) => [`${value} cm`, '周长']}
                  labelFormatter={(label) => `边长: ${label} cm`}
                />
                <Line 
                  type="linear" 
                  dataKey="perimeter" 
                  stroke="#ea580c" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#ea580c', strokeWidth: 2, stroke: '#fff' }} 
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
              className="text-center mt-4 text-orange-600 font-semibold"
             >
               这些点连起来，是一条经过原点 (0,0) 的直线！
             </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
