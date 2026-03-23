import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Star, Sparkles, BookOpen, MessageCircleQuestion } from 'lucide-react';
import { useSoundContext } from '../App';

export default function Slide8Summary() {
  const { play } = useSoundContext();
  
  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 md:p-12 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950"></div>
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="mb-10 flex items-center gap-4 z-10">
        <BookOpen size={48} className="text-cyan-400" />
        <h2 className="text-4xl md:text-5xl font-black text-cyan-400 drop-shadow-md">
          星际航行总结：我们的收获
        </h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto w-full z-10 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="w-full bg-slate-900/80 backdrop-blur-md p-10 rounded-3xl shadow-[0_0_40px_rgba(56,189,248,0.2)] border border-cyan-500/30 relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 text-cyan-500/10 rotate-12">
            <Rocket size={300} />
          </div>
          
          <h3 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <Star className="text-yellow-400 fill-yellow-400" size={36} /> 
            这节课，我们学到了什么？
          </h3>
          
          <ul className="space-y-6 text-2xl md:text-3xl text-slate-200 leading-relaxed font-medium ml-4">
            <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-start gap-4">
              <span className="text-cyan-400 mt-1">🚀</span>
              <p>认识了什么是<strong className="text-cyan-300 mx-2 text-4xl">正比例关系</strong>：两种相关联的量，一种量变化，另一种量也随着变化。</p>
            </motion.li>
            <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex items-start gap-4">
              <span className="text-purple-400 mt-1">✨</span>
              <p>找到了正比例的"灵魂"：如果这两种量中相对应的两个数的<strong className="text-purple-300 mx-2 text-4xl">比值（商）一定</strong>，它们就成正比例。</p>
            </motion.li>
            <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }} className="flex items-start gap-4">
              <span className="text-emerald-400 mt-1">📝</span>
              <p>学会了<strong className="text-emerald-300 mx-2 text-4xl">三步判断法</strong>：①两种量是否相关联？②一种变化另一种是否变化？③比值是否一定？</p>
            </motion.li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 1.2 }}
          className="w-full bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md p-10 rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.2)] border border-purple-500/30"
        >
          <h3 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <MessageCircleQuestion className="text-fuchsia-400" size={36} /> 
            星际探讨：你还有什么疑问吗？
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xl md:text-2xl text-indigo-100">
            <div className="bg-slate-950/50 p-6 rounded-2xl border border-indigo-500/30 hover:border-indigo-400 transition-colors">
              <p className="flex items-center gap-3 mb-2"><Sparkles className="text-yellow-400" size={24}/> 思考题 1</p>
              <p>既然有"正比例"，那会不会有"反比例"呢？如果乘积一定，会发生什么？</p>
            </div>
            <div className="bg-slate-950/50 p-6 rounded-2xl border border-indigo-500/30 hover:border-indigo-400 transition-colors">
              <p className="flex items-center gap-3 mb-2"><Sparkles className="text-yellow-400" size={24}/> 思考题 2</p>
              <p>在你的日常生活中，还能找到哪些成正比例的例子？（比如：买文具、走路...）</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
