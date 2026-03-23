import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle2, XCircle, GripHorizontal, LockOpen, Lock, Lightbulb, CheckSquare } from 'lucide-react';
import { useSoundContext } from '../App';

interface DraggableItem {
  id: string;
  text: string;
  missingCondition: 'related' | 'sameDirection' | 'ratioFixed' | 'allSatisfied';
  explanation: string;
  zone: 'unclassified' | 'related' | 'sameDirection' | 'ratioFixed' | 'allSatisfied';
}

const initialItems: DraggableItem[] = [
  { 
    id: '1', 
    text: '小明的年龄和身高', 
    missingCondition: 'ratioFixed',
    explanation: '虽然年龄增长身高也增长，但身高÷年龄不是固定值',
    zone: 'unclassified' 
  },
  { 
    id: '2', 
    text: '一本书已读页数和未读页数', 
    missingCondition: 'sameDirection',
    explanation: '已读页数增加，未读页数反而减少',
    zone: 'unclassified' 
  },
  { 
    id: '3', 
    text: '小红的身高和班级人数', 
    missingCondition: 'related',
    explanation: '这两个量没有关系，一个变化另一个不会跟着变化',
    zone: 'unclassified' 
  },
  { 
    id: '4', 
    text: '圆的周长和直径', 
    missingCondition: 'allSatisfied',
    explanation: '周长÷直径=π（一定），三个条件都满足',
    zone: 'unclassified' 
  },
];

const conditions = [
  { id: 1, key: 'related', title: '相关联', text: '两种量必须是相关联的量', detail: '一种量变化，另一种量也随着变化' },
  { id: 2, key: 'sameDirection', title: '同向变化', text: '变化方向相同', detail: '一种量增加，另一种量也增加' },
  { id: 3, key: 'ratioFixed', title: '比值一定', text: '比值（商）一定', detail: '相对应的两个数的比值是固定的常数' },
];

export default function Slide4Concept() {
  const { play } = useSoundContext();
  const [items, setItems] = useState<DraggableItem[]>(initialItems);
  const [showDefinition, setShowDefinition] = useState(false);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, zone: 'related' | 'sameDirection' | 'ratioFixed' | 'allSatisfied' | 'unclassified') => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const item = items.find(i => i.id === id);
    if (item) {
      if (zone === item.missingCondition) {
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

  const unclassifiedItems = items.filter(i => i.zone === 'unclassified');
  const relatedItems = items.filter(i => i.zone === 'related');
  const sameDirectionItems = items.filter(i => i.zone === 'sameDirection');
  const ratioFixedItems = items.filter(i => i.zone === 'ratioFixed');
  const allSatisfiedItems = items.filter(i => i.zone === 'allSatisfied');

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 md:p-12 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 z-10">
        <h2 className="text-4xl md:text-5xl font-black text-cyan-400 mb-2 flex items-center gap-4 drop-shadow-md">
          <BookOpen size={48} /> 模块三：揭开"正比例"的神秘面纱
        </h2>
      </motion.div>

      <div className="flex-1 flex gap-8 max-w-7xl mx-auto w-full z-10">
        {/* 左侧：概念定义 + 拖拽练习 */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Definition Area */}
          <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-slate-700 text-center relative overflow-hidden min-h-[200px] flex items-center justify-center">
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
                  className="flex items-center gap-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-10 py-6 rounded-full text-3xl font-black shadow-2xl border-2 border-cyan-300 cursor-pointer"
                >
                  <Lock size={40} /> 点击提取核心规律
                </motion.button>
              ) : (
                <motion.div
                  key="definition"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="text-2xl leading-relaxed text-slate-200 font-medium w-full"
                >
                  <div className="flex items-center justify-center gap-3 mb-3 text-cyan-400">
                    <LockOpen size={28} /> <span className="text-xl font-bold tracking-widest">规律已解锁</span>
                  </div>
                  <p className="mb-4">
                    两种相关联的量，一种量变化，另一种量也随着变化。<br/>
                    如果这两种量中相对应的两个数的<strong className="text-cyan-400 text-3xl mx-2">比值一定</strong>，<br/>
                    这两种量就叫做<strong className="text-cyan-400">成正比例的量</strong>。
                  </p>
                  <div className="text-3xl font-mono font-black bg-slate-800 text-cyan-300 inline-block px-8 py-3 rounded-2xl tracking-widest shadow-inner border border-slate-600">
                    y ÷ x = k (一定)
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Drag and Drop Game */}
          <AnimatePresence>
            {showDefinition && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex-1 grid grid-cols-2 gap-4"
              >
                {/* Unclassified Zone */}
                <div
                  className="bg-slate-800/50 p-4 rounded-2xl border-2 border-dashed border-slate-600 flex flex-col gap-3"
                  onDrop={(e) => handleDrop(e, 'unclassified')}
                  onDragOver={handleDragOver}
                >
                  <h3 className="text-xl font-bold text-slate-400 text-center mb-1 flex items-center justify-center gap-2">
                    <GripHorizontal size={20} /> 待分类
                  </h3>
                  {unclassifiedItems.map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      className="bg-slate-700 p-3 rounded-xl shadow-lg border border-slate-500 cursor-grab active:cursor-grabbing text-lg font-bold text-center hover:bg-slate-600 transition-colors text-slate-100"
                    >
                      {item.text}
                    </div>
                  ))}
                  {unclassifiedItems.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-slate-500 italic text-lg font-bold">完成！🎉</div>
                  )}
                </div>

                {/* 缺少"相关联" */}
                <div
                  className="bg-red-900/30 p-4 rounded-2xl border-2 border-red-700/50 flex flex-col gap-3"
                  onDrop={(e) => handleDrop(e, 'related')}
                  onDragOver={handleDragOver}
                >
                  <h3 className="text-xl font-black text-red-400 text-center mb-1 flex items-center justify-center gap-2">
                    <XCircle size={22} /> 缺少"相关联"
                  </h3>
                  {relatedItems.map(item => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl shadow-lg border-2 text-lg font-bold text-center ${
                        item.missingCondition === 'related' ? 'bg-emerald-800/80 border-emerald-500 text-emerald-100' : 'bg-red-900/80 border-red-500 text-red-100'
                      }`}
                    >
                      {item.text}
                      <span className="block text-sm mt-1 font-medium">{item.missingCondition === 'related' ? '✅ 正确！' : '❌ 再想想'}</span>
                    </div>
                  ))}
                </div>

                {/* 缺少"同向变化" */}
                <div
                  className="bg-orange-900/30 p-4 rounded-2xl border-2 border-orange-700/50 flex flex-col gap-3"
                  onDrop={(e) => handleDrop(e, 'sameDirection')}
                  onDragOver={handleDragOver}
                >
                  <h3 className="text-xl font-black text-orange-400 text-center mb-1 flex items-center justify-center gap-2">
                    <XCircle size={22} /> 缺少"同向变化"
                  </h3>
                  {sameDirectionItems.map(item => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl shadow-lg border-2 text-lg font-bold text-center ${
                        item.missingCondition === 'sameDirection' ? 'bg-emerald-800/80 border-emerald-500 text-emerald-100' : 'bg-red-900/80 border-red-500 text-red-100'
                      }`}
                    >
                      {item.text}
                      <span className="block text-sm mt-1 font-medium">{item.missingCondition === 'sameDirection' ? '✅ 正确！' : '❌ 再想想'}</span>
                    </div>
                  ))}
                </div>

                {/* 缺少"比值一定" */}
                <div
                  className="bg-purple-900/30 p-4 rounded-2xl border-2 border-purple-700/50 flex flex-col gap-3"
                  onDrop={(e) => handleDrop(e, 'ratioFixed')}
                  onDragOver={handleDragOver}
                >
                  <h3 className="text-xl font-black text-purple-400 text-center mb-1 flex items-center justify-center gap-2">
                    <XCircle size={22} /> 缺少"比值一定"
                  </h3>
                  {ratioFixedItems.map(item => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl shadow-lg border-2 text-lg font-bold text-center ${
                        item.missingCondition === 'ratioFixed' ? 'bg-emerald-800/80 border-emerald-500 text-emerald-100' : 'bg-red-900/80 border-red-500 text-red-100'
                      }`}
                    >
                      {item.text}
                      <span className="block text-sm mt-1 font-medium">{item.missingCondition === 'ratioFixed' ? '✅ 正确！' : '❌ 再想想'}</span>
                    </div>
                  ))}
                </div>

                {/* 三个条件都满足 */}
                <div
                  className="bg-emerald-900/30 p-4 rounded-2xl border-2 border-emerald-700/50 flex flex-col gap-3 col-span-2"
                  onDrop={(e) => handleDrop(e, 'allSatisfied')}
                  onDragOver={handleDragOver}
                >
                  <h3 className="text-xl font-black text-emerald-400 text-center mb-1 flex items-center justify-center gap-2">
                    <CheckCircle2 size={22} /> 三个条件都满足（成正比例）
                  </h3>
                  <div className="flex gap-3 justify-center flex-wrap">
                    {allSatisfiedItems.map(item => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl shadow-lg border-2 text-lg font-bold text-center ${
                          item.missingCondition === 'allSatisfied' ? 'bg-emerald-800/80 border-emerald-500 text-emerald-100' : 'bg-red-900/80 border-red-500 text-red-100'
                        }`}
                      >
                        {item.text}
                        <span className="block text-sm mt-1 font-medium">{item.missingCondition === 'allSatisfied' ? '✅ 正确！' : '❌ 再想想'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 右侧：三个必要条件 */}
        <div className="w-80 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-b from-yellow-900/40 to-orange-900/40 backdrop-blur-md p-6 rounded-3xl shadow-2xl border-2 border-yellow-500/50 h-full flex flex-col"
          >
            <h3 className="text-2xl font-black text-yellow-400 mb-4 flex items-center justify-center gap-2">
              <CheckSquare size={28} /> 判断正比例的<br/>三个必要条件
            </h3>
            
            <div className="text-lg text-center mb-4 text-yellow-100 font-medium bg-yellow-900/30 p-3 rounded-xl border border-yellow-600/30">
              ⚠️ 三个条件<br/><strong className="text-xl text-yellow-300">必须同时成立</strong>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {conditions.map((condition, index) => (
                <motion.div
                  key={condition.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-slate-900/80 p-4 rounded-2xl border-2 border-yellow-500/30 text-center"
                >
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-2xl font-black text-slate-900 mx-auto mb-3 shadow-lg">
                    {condition.id}
                  </div>
                  <h4 className="text-xl font-bold text-yellow-300 mb-2">{condition.title}</h4>
                  <p className="text-base text-slate-300">{condition.detail}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-4 text-center"
            >
              <div className="bg-emerald-900/50 px-4 py-3 rounded-2xl border border-emerald-500">
                <span className="text-lg font-bold text-emerald-300">
                  三步判断法
                </span>
                <div className="text-sm text-emerald-200 mt-1">
                  相关联 → 同向变化 → 比值一定
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
