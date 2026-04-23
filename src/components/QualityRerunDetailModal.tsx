import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bot, User, ShieldCheck, Clock, AlertCircle, CheckCircle2, RefreshCw, Copy, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { QualityRerunRecord } from '../data/mockData';
import { SvgCopyButton } from './SvgCopyButton';

interface QualityRerunDetailModalProps {
  record: QualityRerunRecord | null;
  onClose: () => void;
}

export const QualityRerunDetailModal: React.FC<QualityRerunDetailModalProps> = ({ record, onClose }) => {
  const [selectedRoundIdx, setSelectedRoundIdx] = React.useState<number | null>(null);

  // Initialize selected round to problem round or last round
  React.useEffect(() => {
    if (record) {
      // The user specifically asked for Round 2 to be highlighted in their logic example
      // But usually we'd highlight the problem round. 
      // Let's default to the problem round if it exists, otherwise the last one.
      // However, the user said "高亮应该是第二轮", so I'll default to index 1 if available.
      setSelectedRoundIdx(record.context.length >= 4 ? 1 : Math.floor(record.context.length / 2) - 1);
    }
  }, [record]);

  if (!record) return null;

  // Group context into rounds (User + Bot)
  const rounds: { user: string; bot: string; isHit: boolean; roundIndex: number }[] = [];
  for (let i = 0; i < record.context.length; i += 2) {
    const userMsg = record.context[i];
    const botMsg = record.context[i + 1];
    const roundIndex = Math.floor(i / 2);
    rounds.push({
      user: userMsg?.role === 'user' ? userMsg.content : (botMsg?.role === 'user' ? botMsg.content : ''),
      bot: botMsg?.role === 'bot' ? botMsg.content : (userMsg?.role === 'bot' ? userMsg.content : ''),
      isHit: roundIndex === record.problemRound,
      roundIndex: roundIndex + 1
    });
  }

  const handleCopyContext = () => {
    const text = rounds.map(r => `第${r.roundIndex}轮\n用户：${r.user}\nAI：${r.bot}`).join('\n\n');
    navigator.clipboard.writeText(text);
  };

  const currentRound = selectedRoundIdx !== null ? rounds[selectedRoundIdx] : null;

  return (
    <AnimatePresence>
      {record && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            id="quality-rerun-detail"
            className="bg-white h-[90vh] w-full max-w-6xl relative shadow-2xl flex flex-col rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <h3 className="text-lg font-bold text-gray-800">重跑详情</h3>
              <div className="flex items-center gap-3">
                <SvgCopyButton targetId="quality-rerun-detail" />
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left: Dialogue Context */}
              <div className="flex-1 flex flex-col border-r border-gray-100 bg-white overflow-hidden">
                <div className="p-6 pb-2 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-800">对话上下文 (重跑后)</span>
                  <button 
                    onClick={handleCopyContext}
                    className="text-sm text-[#1890ff] hover:text-[#40a9ff] flex items-center gap-1 transition-colors"
                  >
                    <Copy size={14} />
                    复制对话上下文
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {rounds.map((round, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedRoundIdx(idx)}
                      className={cn(
                        "flex gap-4 cursor-pointer group transition-all",
                        selectedRoundIdx === idx ? "opacity-100" : "opacity-60 hover:opacity-100"
                      )}
                    >
                      {/* Round Number Circle */}
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1 transition-colors border-2 border-white shadow-sm",
                        selectedRoundIdx === idx ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
                      )}>
                        {round.roundIndex}
                      </div>

                      <div className="flex-1 space-y-4">
                        {/* User Message */}
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <User size={16} className="text-gray-400" />
                          </div>
                          <div className="bg-white border border-gray-100 rounded-lg p-4 text-sm text-gray-700 shadow-sm flex-1">
                            <div className="text-[10px] text-gray-400 font-medium mb-1">用户提问</div>
                            {round.user}
                          </div>
                        </div>

                        {/* AI Message */}
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <Bot size={16} className="text-blue-500" />
                          </div>
                          <div className={cn(
                            "rounded-lg p-4 text-sm shadow-sm flex-1 border relative",
                            round.isHit ? "bg-orange-50 border-orange-100 text-gray-800" : "bg-white border-gray-100 text-gray-700"
                          )}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-[10px] text-blue-500 font-medium">重跑后 AI 回答</div>
                              {round.isHit && (
                                <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">命中质检问题</span>
                              )}
                            </div>
                            {round.bot}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Quality Result */}
              <div className="w-[400px] flex flex-col bg-white shrink-0">
                <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-[#1890ff]" />
                  <span className="text-lg font-bold text-gray-800">质检结果分析</span>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-10">
                  <div className="space-y-6">
                    <div className="text-sm text-gray-400">被叫号码: {record.calledNumber}</div>
                    
                    <div className="space-y-6">
                      <h4 className="text-sm font-bold text-gray-800">核心质检指标</h4>
                      
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-xs text-gray-400">本次质检维度</label>
                          <div className="text-base font-bold text-gray-800">{record.dimension}</div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-gray-400">是否没问题</label>
                          <div className={cn(
                            "text-base font-bold flex items-center gap-1",
                            currentRound?.isHit ? "text-red-500" : "text-emerald-500"
                          )}>
                            {currentRound?.isHit ? '❌有问题' : '✅没问题'}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-gray-400">轮次</label>
                        <div className="text-base font-bold text-gray-800">第 {currentRound?.roundIndex || '-'} 轮</div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-gray-400">命中原因</label>
                        <div className="text-sm text-gray-500 leading-relaxed">
                          {currentRound?.isHit ? (record.reason || '逻辑断层，未按人设引导。') : '无'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Full Link Info Box */}
                  <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-4 space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">全链路追溯信息</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">重跑时间</span>
                        <span className="text-gray-700 flex items-center gap-1">
                          <Clock size={12} className="text-gray-400" />
                          {record.rerunTime}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">主人设版本</span>
                        <span className="text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-100 font-mono">{record.personaVersion}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">质检维度版本</span>
                        <span className="text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-100 font-mono">{record.qualityVersion}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">重跑操作人</span>
                        <span className="text-gray-700">{record.operator}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="p-6 bg-white border-t border-gray-100">
                  <button className="w-full bg-[#1890ff] text-white py-4 rounded-xl text-base font-bold hover:bg-[#40a9ff] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
                    <RotateCcw size={20} />
                    重新重跑
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
