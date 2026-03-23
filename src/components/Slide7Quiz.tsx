import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, RefreshCcw, HelpCircle, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import clsx from 'clsx';
import { useSoundContext } from '../App';

type QuestionType = 'choice' | 'fill' | 'table-choice';

interface Question {
  id: number;
  type: QuestionType;
  category: string;
  difficulty: number;
  points: number;
  text: string;
  options?: { id: string; text: string; isCorrect: boolean }[];
  tableData?: { x: (number | string)[]; y: (number | string)[] };
  correctAnswer?: string;
  explanation: string;
}

const questions: Question[] = [
  { id: 1, type: 'choice', category: '概念判断', difficulty: 1, points: 1, text: "判断题：两种相关联的量，只要一种量增加，另一种量也增加，它们就一定成正比例。对吗？", options: [{id:'A', text:'对', isCorrect:false}, {id:'B', text:'错', isCorrect:true}], explanation: "错！必须是它们的【比值（商）一定】，才能叫成正比例。仅仅是一起增加是不够的（比如人的年龄和身高）。" },
  { id: 2, type: 'choice', category: '概念判断', difficulty: 2, points: 2, text: "判断题：正方形的【周长】和【边长】成正比例吗？", options: [{id:'A', text:'成正比例', isCorrect:true}, {id:'B', text:'不成正比例', isCorrect:false}], explanation: "正确！因为 周长 ÷ 边长 = 4（一定），比值固定，所以成正比例。" },
  { id: 3, type: 'choice', category: '概念判断', difficulty: 3, points: 3, text: "判断题：正方形的【面积】和【边长】成正比例吗？", options: [{id:'A', text:'成正比例', isCorrect:false}, {id:'B', text:'不成正比例', isCorrect:true}], explanation: "正确！因为 面积 ÷ 边长 = 边长。边长是变化的，所以比值不固定，不成正比例！" },
  
  { id: 4, type: 'table-choice', category: '表格计算', difficulty: 1, points: 1, text: "已知 x 和 y 成正比例，请选择表格中缺失的数字。", tableData: { x: [2, 4], y: [6, '?'] }, options: [{id:'A', text:'8', isCorrect:false}, {id:'B', text:'10', isCorrect:false}, {id:'C', text:'12', isCorrect:true}, {id:'D', text:'14', isCorrect:false}], explanation: "y ÷ x = 6 ÷ 2 = 3。比值是3，所以 ? ÷ 4 = 3，得出 ? = 12。" },
  { id: 5, type: 'table-choice', category: '表格计算', difficulty: 2, points: 2, text: "买同一种苹果，数量 x 和总价 y 成正比例。请选择缺失的数字。", tableData: { x: [3, 5], y: [15, '?'] }, options: [{id:'A', text:'20', isCorrect:false}, {id:'B', text:'25', isCorrect:true}, {id:'C', text:'30', isCorrect:false}, {id:'D', text:'45', isCorrect:false}], explanation: "单价 = 总价 ÷ 数量 = 15 ÷ 3 = 5元。买5个就是 5 × 5 = 25元。" },
  { id: 6, type: 'table-choice', category: '表格计算', difficulty: 3, points: 3, text: "飞船匀速飞行，时间 x 和距离 y 成正比例。请选择缺失的数字。", tableData: { x: [1.5, '?'], y: [90, 150] }, options: [{id:'A', text:'2.0', isCorrect:false}, {id:'B', text:'2.5', isCorrect:true}, {id:'C', text:'3.0', isCorrect:false}, {id:'D', text:'3.5', isCorrect:false}], explanation: "速度 = 距离 ÷ 时间 = 90 ÷ 1.5 = 60。时间 = 距离 ÷ 速度 = 150 ÷ 60 = 2.5。" },

  { id: 7, type: 'choice', category: '生活应用', difficulty: 1, points: 1, text: "速度一定，汽车行驶的【路程】和【时间】成正比例吗？", options: [{id:'A', text:'成正比例', isCorrect:true}, {id:'B', text:'不成正比例', isCorrect:false}], explanation: "成正比例！因为 路程 ÷ 时间 = 速度（一定）。" },
  { id: 8, type: 'choice', category: '生活应用', difficulty: 2, points: 2, text: "总钱数一定，买笔记本的【单价】和【数量】成正比例吗？", options: [{id:'A', text:'成正比例', isCorrect:false}, {id:'B', text:'不成正比例', isCorrect:true}], explanation: "不成正比例！因为 单价 × 数量 = 总钱数（乘积一定），而不是比值一定。这其实是反比例关系哦！" },
  { id: 9, type: 'choice', category: '生活应用', difficulty: 3, points: 3, text: "圆的【面积】和【半径的平方】成正比例吗？", options: [{id:'A', text:'成正比例', isCorrect:true}, {id:'B', text:'不成正比例', isCorrect:false}], explanation: "成正比例！这是一个高级陷阱题。面积 ÷ (半径的平方) = π (圆周率)。因为 π 是一个固定的常数，所以它们成正比例！" },

  { id: 10, type: 'choice', category: '综合判断', difficulty: 2, points: 2, text: "如果 y = 5x，那么 y 和 x 成正比例吗？", options: [{id:'A', text:'成正比例', isCorrect:true}, {id:'B', text:'不成正比例', isCorrect:false}], explanation: "成正比例！因为 y ÷ x = 5，比值是固定的常数 5。" },
  { id: 11, type: 'choice', category: '综合判断', difficulty: 3, points: 3, text: "如果 y = x + 5，那么 y 和 x 成正比例吗？", options: [{id:'A', text:'成正比例', isCorrect:false}, {id:'B', text:'不成正比例', isCorrect:true}], explanation: "不成正比例！虽然 x 增加 y 也增加，但 y ÷ x = (x+5)÷x = 1 + 5/x，比值是变化的！" },
  { id: 12, type: 'choice', category: '综合判断', difficulty: 1, points: 1, text: "判断题：一个人的【年龄】和【身高】成正比例。", options: [{id:'A', text:'对', isCorrect:false}, {id:'B', text:'错', isCorrect:true}], explanation: "错！年龄增长，身高不一定增长（成年后身高基本不变），而且身高÷年龄也不是固定值。" },
];

export default function Slide7Quiz() {
  const { play } = useSoundContext();
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [fillValue, setFillValue] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#22d3ee', '#34d399', '#facc15', '#c084fc']
    });
  };

  const handleChoiceClick = (optionId: string, isCorrect: boolean) => {
    if (selectedOption) return;
    setSelectedOption(optionId);
    setShowExplanation(true);
    if (isCorrect) {
      setScore(s => s + questions[currentQ].points);
      play('correct');
      triggerConfetti();
    } else {
      play('wrong');
    }
  };

  const handleFillSubmit = () => {
    if (showExplanation) return;
    const isCorrect = fillValue.trim() === questions[currentQ].correctAnswer;
    setShowExplanation(true);
    if (isCorrect) {
      setScore(s => s + questions[currentQ].points);
      play('correct');
      triggerConfetti();
    } else {
      play('wrong');
    }
  };

  const handleNext = () => {
    play('click');
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelectedOption(null);
      setFillValue('');
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      if (score >= maxScore * 0.8) {
        play('celebration');
      }
    }
  };

  const handleRestart = () => {
    play('click');
    setCurrentQ(0);
    setSelectedOption(null);
    setFillValue('');
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
  };

  const renderStars = (difficulty: number) => {
    return (
      <div className="flex items-center gap-1 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-600 shadow-inner">
        <span className="text-slate-300 font-bold mr-2 text-xl">难度:</span>
        {Array.from({ length: 3 }).map((_, i) => (
          <Star key={i} size={24} className={i < difficulty ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" : "text-slate-600"} />
        ))}
        <span className="text-yellow-400 font-black ml-2 text-xl">({difficulty} 积分)</span>
      </div>
    );
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-950 p-6 md:p-12 text-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900/90 backdrop-blur-md p-16 rounded-3xl shadow-[0_0_60px_rgba(192,132,252,0.4)] text-center max-w-3xl w-full border border-purple-500 z-10">
          <h2 className="text-5xl md:text-6xl font-black text-purple-400 mb-8 drop-shadow-md">终极考核完成！🎉</h2>
          <p className="text-3xl md:text-4xl mb-12 font-medium">
            你的总积分：<span className="text-6xl md:text-7xl font-black text-yellow-400 mx-4 drop-shadow-lg">{score}</span> / {maxScore}
          </p>
          {score === maxScore ? (
            <p className="text-3xl text-emerald-400 font-bold mb-12 leading-relaxed">太完美了！你已经完全掌握了正比例的奥秘，<br/>可以胜任最高级星际领航员了！🚀</p>
          ) : score >= maxScore * 0.7 ? (
            <p className="text-3xl text-cyan-400 font-bold mb-12 leading-relaxed">非常棒！你已经掌握了大部分知识，<br/>再复习一下错题就能拿满分！🌟</p>
          ) : (
            <p className="text-3xl text-orange-400 font-bold mb-12 leading-relaxed">继续加油！再多复习一下正比例的概念，<br/>下次一定能拿到高分！💪</p>
          )}
          <button onClick={handleRestart} className="inline-flex items-center justify-center gap-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-12 py-6 rounded-full text-3xl font-bold hover:from-purple-500 hover:to-indigo-500 transition-all shadow-2xl border border-purple-400">
            <RefreshCcw size={36} /> 重新挑战
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQ];
  const isFillCorrect = q.type === 'fill' && fillValue.trim() === q.correctAnswer;
  const isTableChoiceCorrect = q.type === 'table-choice' && selectedOption === q.options?.find(o => o.isCorrect)?.id;

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 md:p-12 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center z-10 gap-6">
        <h2 className="text-4xl md:text-5xl font-black text-purple-400 flex items-center gap-4 drop-shadow-md">
          <HelpCircle size={48} /> 模块六：星际领航员考核
        </h2>
        <div className="flex items-center gap-6">
          <div className="text-2xl font-bold text-yellow-400 bg-yellow-900/30 px-6 py-3 rounded-full shadow-inner border border-yellow-700 flex items-center gap-2">
            <Star className="fill-yellow-400" size={28} /> 当前积分: {score}
          </div>
          <div className="text-2xl font-bold text-purple-300 bg-purple-900/50 px-8 py-3 rounded-full shadow-inner border border-purple-700">
            题目 {currentQ + 1} / {questions.length}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full z-10">
        <AnimatePresence mode="wait">
          <motion.div key={currentQ} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full bg-slate-900/90 backdrop-blur-md p-10 md:p-14 rounded-3xl shadow-2xl border-t-8 border-purple-500 border-x border-b border-slate-700">
            
            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl font-bold text-cyan-400 bg-cyan-900/30 px-6 py-2 rounded-xl border border-cyan-700">
                类型: {q.category}
              </span>
              {renderStars(q.difficulty)}
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-slate-100 mb-12 leading-relaxed">{q.text}</h3>
            
            {q.type === 'choice' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {q.options?.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  const isCorrect = opt.isCorrect;
                  let btnClass = "p-8 rounded-3xl text-3xl font-bold border-4 transition-all duration-300 flex items-center justify-between shadow-lg ";
                  if (!selectedOption) btnClass += "border-slate-600 bg-slate-800 hover:bg-slate-700 hover:border-purple-400 text-slate-200 cursor-pointer";
                  else if (isSelected && isCorrect) btnClass += "border-emerald-500 bg-emerald-900/50 text-emerald-300";
                  else if (isSelected && !isCorrect) btnClass += "border-red-500 bg-red-900/50 text-red-300";
                  else if (!isSelected && isCorrect) btnClass += "border-emerald-500 bg-emerald-900/50 text-emerald-300 opacity-50";
                  else btnClass += "border-slate-700 bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed";

                  return (
                    <button key={opt.id} onClick={() => handleChoiceClick(opt.id, opt.isCorrect)} disabled={selectedOption !== null} className={btnClass}>
                      <span>{opt.text}</span>
                      {selectedOption && isCorrect && <CheckCircle2 size={40} className="text-emerald-400" />}
                      {isSelected && !isCorrect && <XCircle size={40} className="text-red-400" />}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'table-choice' && q.tableData && (
              <div className="flex flex-col items-center gap-10">
                <table className="w-full max-w-2xl text-center border-collapse text-4xl">
                  <tbody>
                    <tr>
                      <th className="p-6 border-4 border-slate-600 bg-slate-800 text-cyan-400 w-1/4">x</th>
                      {q.tableData.x.map((val, i) => (
                        <td key={`x-${i}`} className="p-6 border-4 border-slate-600 font-medium text-slate-200">
                          {val === '?' ? (
                            <span className="text-purple-400 font-bold text-5xl">?</span>
                          ) : val}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th className="p-6 border-4 border-slate-600 bg-slate-800 text-yellow-400 w-1/4">y</th>
                      {q.tableData.y.map((val, i) => (
                        <td key={`y-${i}`} className="p-6 border-4 border-slate-600 font-medium text-yellow-300">
                          {val === '?' ? (
                            <span className="text-purple-400 font-bold text-5xl">?</span>
                          ) : val}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                
                <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                  {q.options?.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    const isCorrect = opt.isCorrect;
                    let btnClass = "p-6 rounded-2xl text-3xl font-bold border-4 transition-all duration-300 flex items-center justify-center shadow-lg ";
                    if (!selectedOption) btnClass += "border-slate-600 bg-slate-800 hover:bg-slate-700 hover:border-purple-400 text-slate-200 cursor-pointer";
                    else if (isSelected && isCorrect) btnClass += "border-emerald-500 bg-emerald-900/50 text-emerald-300";
                    else if (isSelected && !isCorrect) btnClass += "border-red-500 bg-red-900/50 text-red-300";
                    else if (!isSelected && isCorrect) btnClass += "border-emerald-500 bg-emerald-900/50 text-emerald-300 opacity-50";
                    else btnClass += "border-slate-700 bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed";

                    return (
                      <button key={opt.id} onClick={() => handleChoiceClick(opt.id, opt.isCorrect)} disabled={selectedOption !== null} className={btnClass}>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <AnimatePresence>
              {showExplanation && (
                <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 40 }} className="overflow-hidden">
                  <div className={clsx("p-8 rounded-3xl text-2xl font-medium shadow-inner border-2", 
                    (q.type === 'choice' && selectedOption === q.options?.find(o => o.isCorrect)?.id) || (q.type === 'fill' && isFillCorrect) || isTableChoiceCorrect
                      ? "bg-emerald-900/30 text-emerald-200 border-emerald-500/50" 
                      : "bg-red-900/30 text-red-200 border-red-500/50"
                  )}>
                    <p className="mb-4 font-bold text-3xl flex items-center gap-3">
                      {(q.type === 'choice' && selectedOption === q.options?.find(o => o.isCorrect)?.id) || (q.type === 'fill' && isFillCorrect) || isTableChoiceCorrect
                        ? <><CheckCircle2 size={36} className="text-emerald-400"/> 回答正确！获得 {q.points} 积分 🎉</> 
                        : <><XCircle size={36} className="text-red-400"/> 回答错误！❌</>}
                    </p>
                    <p className="leading-relaxed text-slate-300">{q.explanation}</p>
                  </div>
                  <div className="mt-10 flex justify-end">
                    <button onClick={handleNext} className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-10 py-5 rounded-full text-2xl font-bold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-xl flex items-center gap-3 border border-cyan-400">
                      {currentQ < questions.length - 1 ? "下一题 ➡️" : "查看最终成绩 🏆"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
