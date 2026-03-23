import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle2, XCircle, GripHorizontal, LockOpen, Lock, Lightbulb, CheckSquare } from 'lucide-react';
import { useSoundContext } from '../App';

interface DraggableItem {
  id: string;
  text: string;
  isProportional: boolean;
  zone: 'unclassified' | 'yes' | 'no';
}

const initialItems: DraggableItem[] = [
  { id: '1', text: '飞船消耗的燃料与飞行距离 (每光年消耗一定)', isProportional: true, zone: 'unclassified' },
  { id: '2', text: '光发送到地球的时间与距离', isProportional: true, zone: 'unclassified' },
  { id: '3', text: '空间站的氧气剩余量与使用天数', isProportional: false, zone: 'unclassified' },
  { id: '4', text: '宇航员的年龄与身高', isProportional: false, zone: 'unclassified' },
];

const conditions = [
  { id: 1, text: '两种量必须是相关联的量', detail: '一种量变化，另一种量也随着变化' },
  { id: 2, text: '变化方向相同', detail: '一种量增加，另一种量也增加；一种量减少，另一种量也减少' },
  { id: 3, text: '比值（商）一定', detail: '相对应的两个数的比值是固定的常数' },
];

export default function Slide4Concept() {
  const { play } = useSoundContext();
  const [items, setItems] = useState<DraggableItem[]>(initialItems);
  const [showDefinition, setShowDefinition] = useState(false);
  const [showConditions, setShowConditions] = useState(false);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, zone: 'yes' | 'no' | 'unclassified') => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const item = items.find(i => i.id === id);
    if (item) {
      if (zone === 'yes' && item.isProportional) {
        play('correct');
      } else if (zone === 'no' && !item.isProportional) {
        play('correct');
      } else if (zone !== 'unclassified') {
        play('wrong');
      }
    }
    setItems(prev => prev.map(item => item.id === id ? { ...item, zone } : item));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleShowDefinition = () => {
    play('reveal');
    setShowDefinition(true);
  };

  const handleShowConditions = () => {
    play('reveal');
    setShowConditions(true);
  };

  const unclassifiedItems = items.filter(i => i.zone === 'unclassified');
  const yesItems = items.filter(i => i.zone === 'yes');
  const noItems = items.filter(i => i.zone === 'no');
  const allClassified = unclassifiedItems.length === 0;

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 md:p-12 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 z-10">
        <h2 className="text-4xl md:text-5xl font-black text-cyan-400 mb-4 flex items-center gap-4 drop-shadow-md">
          <BookOpen size={48} /> 模块三：揭开"正比例"的神秘面纱
        </h2>
        <p className="text-2xl md:text-3xl text-slate-300 font-medium leading-relaxed">
          刚才飞船的"距离与时间"隐藏着一个数学中非常重要的终极规律！
        </p>
      </motion.div>

      <div className="flex-1 flex flex-col items-center max-w-7xl mx-auto w-full gap-8 z-10">
        {/* Definition Area */}
        <div className="w-full bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-700 text-center relative overflow-hidden min-h-[280px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!showDefinition ? (
              <motion.button
                key="unlock-btn"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0, filter: 'blur(10px)' }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(34,211,238,0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShowDefinition}
                className="flex items-center gap-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-12 py-8 rounded-full text-4xl font-black shadow-2xl border-2 border-cyan-300 cursor-pointer"
              >
                <Lock size={48} /> 点击提取核心规律
              </motion.button>
            ) : (
              <motion.div
                key="definition"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="text-3xl leading-relaxed text-slate-200 font-medium w-full"
              >
                <div className="flex items-center justify-center gap-3 mb-4 text-cyan-400">
                  <LockOpen size={36} /> <span className="text-2xl font-bold tracking-widest">规律已解锁</span>
                </div>
                <p className="mb-6">
                  两种相关联的量，一种量变化，另一种量也随着变化。<br/>
                  如果这两种量中相对应的两个数的<strong className="text-cyan-400 text-5xl mx-3 drop-shadow-md">比值（也就是商）一定</strong>，<br/>
                  这两种量就叫做<strong className="text-cyan-400">成正比例的量</strong>，它们的关系叫做<strong className="text-cyan-400">正比例关系</strong>。
                </p>
                <div className="mt-4 text-4xl font-mono font-black bg-slate-800 text-cyan-300 inline-block px-10 py-4 rounded-2xl tracking-widest shadow-inner border border-slate-600">
                  y ÷ x = k (一定)
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Drag and Drop Game - Only show after definition is revealed */}
        <AnimatePresence>
          {showDefinition && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[300px]"
            >
              {/* Unclassified Zone */}
              <div
                className="bg-slate-800/50 p-6 rounded-3xl border-4 border-dashed border-slate-600 flex flex-col gap-4"
                onDrop={(e) => handleDrop(e, 'unclassified')}
                onDragOver={handleDragOver}
              >
                <h3 className="text-2xl font-bold text-slate-400 text-center mb-2 flex items-center justify-center gap-2">
                  <GripHorizontal /> 待分类的例子 (拖拽)
                </h3>
                {unclassifiedItems.map(item => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    className="bg-slate-700 p-4 rounded-2xl shadow-lg border border-slate-500 cursor-grab active:cursor-grabbing text-xl font-bold text-center hover:bg-slate-600 transition-colors text-slate-100"
                  >
                    {item.text}
                  </div>
                ))}
                {unclassifiedItems.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-slate-500 italic text-2xl font-bold">全部完成！🎉</div>
                )}
              </div>

              {/* Yes Zone */}
              <div
                className="bg-emerald-900/30 p-6 rounded-3xl border-4 border-emerald-700/50 flex flex-col gap-4"
                onDrop={(e) => handleDrop(e, 'yes')}
                onDragOver={handleDragOver}
              >
                <h3 className="text-3xl font-black text-emerald-400 text-center mb-2 flex items-center justify-center gap-3 drop-shadow-md">
                  <CheckCircle2 size={36} /> 是正比例
                </h3>
                {yesItems.map(item => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    className={`p-4 rounded-2xl shadow-lg border-2 text-xl font-bold text-center cursor-grab active:cursor-grabbing ${
                      item.isProportional ? 'bg-emerald-800/80 border-emerald-500 text-emerald-100' : 'bg-red-900/80 border-red-500 text-red-100'
                    }`}
                  >
                    {item.text}
                    {!item.isProportional && <span className="block text-base text-red-300 mt-2 font-medium">❌ 放错啦！比值不固定</span>}
                    {item.isProportional && <span className="block text-base text-emerald-300 mt-2 font-medium">✅ 正确！比值一定</span>}
                  </div>
                ))}
              </div>

              {/* No Zone */}
              <div
                className="bg-red-900/30 p-6 rounded-3xl border-4 border-red-700/50 flex flex-col gap-4"
                onDrop={(e) => handleDrop(e, 'no')}
                onDragOver={handleDragOver}
              >
                <h3 className="text-3xl font-black text-red-400 text-center mb-2 flex items-center justify-center gap-3 drop-shadow-md">
                  <XCircle size={36} /> 不是正比例
                </h3>
                {noItems.map(item => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    className={`p-4 rounded-2xl shadow-lg border-2 text-xl font-bold text-center cursor-grab active:cursor-grabbing ${
                      !item.isProportional ? 'bg-emerald-800/80 border-emerald-500 text-emerald-100' : 'bg-red-900/80 border-red-500 text-red-100'
                    }`}
                  >
                    {item.text}
                    {item.isProportional && <span className="block text-base text-red-300 mt-2 font-medium">❌ 放错啦！比值是固定的</span>}
                    {!item.isProportional && <span className="block text-base text-emerald-300 mt-2 font-medium">✅ 正确！比值不固定或和一定</span>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show Conditions Button - Only show after all items are classified */}
        <AnimatePresence>
          {showDefinition && allClassified && !showConditions && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(250,204,21,0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShowConditions}
                className="flex items-center gap-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-12 py-6 rounded-full text-3xl font-bold shadow-2xl border-2 border-yellow-300 cursor-pointer"
              >
                <Lightbulb size={40} /> 总结：判断正比例的必要条件
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conditions Panel */}
        <AnimatePresence>
          {showConditions && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-full bg-gradient-to-r from-yellow-900/40 to-orange-900/40 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-yellow-500/50"
            >
              <h3 className="text-4xl font-black text-yellow-400 mb-8 flex items-center justify-center gap-4">
                <CheckSquare size={44} /> 判断正比例的三个必要条件
              </h3>
              
              <div className="text-2xl text-center mb-6 text-yellow-100 font-medium">
                ⚠️ 三个条件<strong className="text-3xl text-yellow-300 mx-2">必须同时成立</strong>，才能判断为正比例！
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {conditions.map((condition, index) => (
                  <motion.div
                    key={condition.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-slate-900/80 p-6 rounded-2xl border-2 border-yellow-500/30 text-center"
                  >
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-3xl font-black text-slate-900 mx-auto mb-4 shadow-lg">
                      {condition.id}
                    </div>
                    <h4 className="text-2xl font-bold text-yellow-300 mb-3">{condition.text}</h4>
                    <p className="text-lg text-slate-300">{condition.detail}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 text-center"
              >
                <div className="inline-flex items-center gap-4 bg-emerald-900/50 px-8 py-4 rounded-2xl border border-emerald-500">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                  <span className="text-2xl font-bold text-emerald-300">
                    三步判断法：相关联 → 同向变化 → 比值一定
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
