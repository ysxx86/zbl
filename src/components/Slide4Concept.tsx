import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle2, XCircle, GripHorizontal, LockOpen, Lock, Lightbulb, CheckSquare, ChevronDown } from 'lucide-react';
import { useSoundContext } from '../App';

interface DraggableItem {
  id: string;
  text: string;
  isProportional: boolean;
  reason: string;
  zone: 'unclassified' | 'yes' | 'no';
}

const initialItems: DraggableItem[] = [
  { 
    id: '1', 
    text: '小明的年龄和身高', 
    isProportional: false,
    reason: '虽然年龄增长身高也增长（相关联、同向变化），但身高÷年龄不是固定值，比值不固定',
    zone: 'unclassified' 
  },
  { 
    id: '2', 
    text: '一本书已读页数和未读页数', 
    isProportional: false,
    reason: '虽然相关联，但已读页数增加，未读页数反而减少，变化方向相反',
    zone: 'unclassified' 
  },
  { 
    id: '3', 
    text: '小红的身高和班级人数', 
    isProportional: false,
    reason: '这两个量没有关系，一个变化另一个不会跟着变化，不相关联',
    zone: 'unclassified' 
  },
  { 
    id: '4', 
    text: '圆的周长和直径', 
    isProportional: true,
    reason: '周长÷直径=π（一定），三个条件都满足：相关联、同向变化、比值一定',
    zone: 'unclassified' 
  },
];

const conditions = [
  { id: 1, key: 'related', title: '相关联', detail: '一种量变化，另一种量也随着变化' },
  { id: 2, key: 'sameDirection', title: '同向变化', detail: '一种量增加，另一种量也增加' },
  { id: 3, key: 'ratioFixed', title: '比值一定', detail: '相对应的两个数的比值是固定的常数' },
];

export default function Slide4Concept() {
  const { play } = useSoundContext();
  const [items, setItems] = useState<DraggableItem[]>(initialItems);
  const [showDefinition, setShowDefinition] = useState(false);
  const [showReasons, setShowReasons] = useState(false);
  const [showConditionsButton, setShowConditionsButton] = useState(false);
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

  const handleShowReasons = () => {
    play('reveal');
    setShowReasons(true);
    setShowConditionsButton(true);
  };

  const handleShowConditions = () => {
    play('reveal');
    setShowConditions(true);
  };

  // 自动显示原因（不需要按钮了）
  // useEffect(() => {
  //   if (allClassified && !showReasons) {
  //     setTimeout(() => {
  //       setShowReasons(true);
  //       setShowConditionsButton(true);
  //     }, 500);
  //   }
  // }, [allClassified]);

  const unclassifiedItems = items.filter(i => i.zone === 'unclassified');
  const yesItems = items.filter(i => i.zone === 'yes');
  const noItems = items.filter(i => i.zone === 'no');
  const allClassified = unclassifiedItems.length === 0;

  const renderDraggableItem = (item: DraggableItem, showFeedback: boolean = true) => (
    <div
      key={item.id}
      draggable
      onDragStart={(e) => handleDragStart(e, item.id)}
      className="bg-slate-700 p-3 rounded-xl shadow-lg border border-slate-500 cursor-grab active:cursor-grabbing text-lg font-bold text-center hover:bg-slate-600 transition-colors text-slate-100"
    >
      {item.text}
    </div>
  );

  const renderClassifiedItem = (item: DraggableItem, isCorrectZone: boolean) => (
    <div
      key={item.id}
      draggable
      onDragStart={(e) => handleDragStart(e, item.id)}
      className={`p-3 rounded-xl shadow-lg border-2 text-lg font-bold text-center cursor-grab active:cursor-grabbing transition-colors ${
        isCorrectZone 
          ? 'bg-emerald-800/80 border-emerald-500 text-emerald-100 hover:bg-emerald-700/80' 
          : 'bg-red-900/80 border-red-500 text-red-100 hover:bg-red-800/80'
      }`}
    >
      {item.text}
      <span className="block text-sm mt-1 font-medium">
        {isCorrectZone ? '✅ 正确！' : '❌ 再想想'}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 md:p-6 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-3 z-10 flex-shrink-0">
        <h2 className="text-2xl md:text-3xl font-black text-cyan-400 mb-1 flex items-center gap-3 drop-shadow-md">
          <BookOpen size={32} /> 模块三：揭开"正比例"的神秘面纱
        </h2>
      </motion.div>

      <div className="flex-1 flex gap-4 max-w-7xl mx-auto w-full z-10 overflow-hidden">
        {/* 左侧：概念定义 + 拖拽练习 */}
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          {/* Definition Area */}
          <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-700 text-center relative flex items-center justify-center flex-shrink-0">
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
                  className="flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-4 rounded-full text-xl font-black shadow-2xl border-2 border-cyan-300 cursor-pointer"
                >
                  <Lock size={28} /> 点击提取核心规律
                </motion.button>
              ) : (
                <motion.div
                  key="definition"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="text-lg leading-relaxed text-slate-200 font-medium w-full"
                >
                  <div className="flex items-center justify-center gap-2 mb-2 text-cyan-400">
                    <LockOpen size={20} /> <span className="text-base font-bold tracking-widest">规律已解锁</span>
                  </div>
                  <p className="mb-2">
                    两种相关联的量，一种量变化，另一种量也随着变化。
                    如果这两种量中相对应的两个数的<strong className="text-cyan-400 text-xl mx-1">比值一定</strong>，
                    这两种量就叫做<strong className="text-cyan-400">成正比例的量</strong>。
                  </p>
                  <div className="text-xl font-mono font-black bg-slate-800 text-cyan-300 inline-block px-6 py-2 rounded-xl tracking-widest shadow-inner border border-slate-600">
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex-1 flex flex-col gap-3 overflow-hidden"
              >
                {/* 拖拽区域 */}
                <div className="grid grid-cols-3 gap-3 flex-shrink-0">
                  {/* Unclassified Zone */}
                  <div
                    className="bg-slate-800/50 p-3 rounded-xl border-2 border-dashed border-slate-600 flex flex-col gap-2 min-h-[80px]"
                    onDrop={(e) => handleDrop(e, 'unclassified')}
                    onDragOver={handleDragOver}
                  >
                    <h3 className="text-base font-bold text-slate-400 text-center flex items-center justify-center gap-1">
                      <GripHorizontal size={16} /> 待判断
                    </h3>
                    {unclassifiedItems.map(item => renderDraggableItem(item))}
                    {unclassifiedItems.length === 0 && (
                      <div className="flex-1 flex items-center justify-center text-slate-500 italic text-sm font-bold">完成！🎉</div>
                    )}
                  </div>

                  {/* 是正比例 */}
                  <div
                    className="bg-emerald-900/30 p-3 rounded-xl border-2 border-emerald-700/50 flex flex-col gap-2 min-h-[80px]"
                    onDrop={(e) => handleDrop(e, 'yes')}
                    onDragOver={handleDragOver}
                  >
                    <h3 className="text-base font-black text-emerald-400 text-center flex items-center justify-center gap-1">
                      <CheckCircle2 size={18} /> 是正比例
                    </h3>
                    {yesItems.map(item => renderClassifiedItem(item, item.isProportional))}
                  </div>

                  {/* 不是正比例 */}
                  <div
                    className="bg-red-900/30 p-3 rounded-xl border-2 border-red-700/50 flex flex-col gap-2 min-h-[80px]"
                    onDrop={(e) => handleDrop(e, 'no')}
                    onDragOver={handleDragOver}
                  >
                    <h3 className="text-base font-black text-red-400 text-center flex items-center justify-center gap-1">
                      <XCircle size={18} /> 不是正比例
                    </h3>
                    {noItems.map(item => renderClassifiedItem(item, !item.isProportional))}
                  </div>
                </div>



                {/* 原因列表 - 紧凑显示 */}
                {showReasons && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 flex-shrink-0"
                  >
                    <h4 className="text-base font-bold text-yellow-400 mb-2 flex items-center gap-2">
                      <Lightbulb size={18} /> 判断原因
                    </h4>
                    <div className="space-y-2">
                      {items.map(item => (
                        <div 
                          key={item.id}
                          className={`p-2 rounded-lg border flex items-start gap-2 ${
                            item.isProportional 
                              ? 'bg-emerald-900/30 border-emerald-600' 
                              : 'bg-red-900/30 border-red-600'
                          }`}
                        >
                          {item.isProportional ? (
                            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-bold text-sm">{item.text}</span>
                            <p className="text-xs text-slate-300 mt-0.5">{item.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {/* 显示原因按钮 */}
                {allClassified && !showReasons && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center flex-shrink-0"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(250,204,21,0.5)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShowReasons}
                      className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full text-lg font-bold shadow-xl border-2 border-yellow-300 cursor-pointer"
                    >
                      <Lightbulb size={24} /> 点击查看原因
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 右侧：三个必要条件 */}
        <AnimatePresence>
          {showConditionsButton && showConditions && (
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="w-72 flex-shrink-0"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-b from-yellow-900/40 to-orange-900/40 backdrop-blur-md p-4 rounded-2xl shadow-2xl border-2 border-yellow-500/50 flex flex-col overflow-hidden"
              >
                <h3 className="text-lg font-black text-yellow-400 mb-2 flex items-center justify-center gap-2">
                  <CheckSquare size={20} /> 判断正比例的三个必要条件
                </h3>
                
                <div className="text-sm text-center mb-2 text-yellow-100 font-medium bg-yellow-900/30 p-2 rounded-lg border border-yellow-600/30">
                  ⚠️ 三个条件必须<strong className="text-yellow-300">同时成立</strong>
                </div>

                <div className="flex flex-col gap-2 overflow-y-auto">
                  {conditions.map((condition, index) => (
                    <motion.div
                      key={condition.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-900/80 p-3 rounded-xl border-2 border-yellow-500/30 text-center"
                    >
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-xl font-black text-slate-900 mx-auto mb-2 shadow-lg">
                        {condition.id}
                      </div>
                      <h4 className="text-base font-bold text-yellow-300 mb-1">{condition.title}</h4>
                      <p className="text-sm text-slate-300">{condition.detail}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-2 text-center flex-shrink-0"
                >
                  <div className="bg-emerald-900/50 px-3 py-2 rounded-xl border border-emerald-500">
                    <span className="text-sm font-bold text-emerald-300">
                      三步判断法
                    </span>
                    <div className="text-xs text-emerald-200 mt-1">
                      相关联 → 同向变化 → 比值一定
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
