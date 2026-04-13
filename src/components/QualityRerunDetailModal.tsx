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
    // In a real app, we'd show a toast here
  };

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
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-800">重跑详情</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">ID: {record.id}</span>
                  <span>被叫号码: {record.calledNumber}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SvgCopyButton targetId="quality-rerun-detail" />
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left: Dialogue Context */}
              <div className="flex-1 flex flex-col border-r border-gray-100 bg-gray-50/30 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-700">对话上下文 (重跑后)</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">按轮次展示</span>
                  </div>
                  <button 
                    onClick={handleCopyContext}
                    className="text-xs text-[#1890ff] hover:underline flex items-center gap-1"
                  >
                    <Copy size={12} />
                    复制对话上下文
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {rounds.map((round, idx) => (
                    <div key={idx} className={cn(
                      "relative pl-8 border-l-2 transition-all",
                      round.isHit ? "border-orange-400" : "border-gray-100"
                    )}>
                      {/* Round Number Badge */}
                      <div className={cn(
                        "absolute -left-[11px] top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm",
                        round.isHit ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"
                      )}>
                        {round.roundIndex}
                      </div>

                      <div className="space-y-4">
                        {/* User Question */}
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <User size={16} className="text-gray-500" />
                          </div>
                          <div className="bg-white border border-gray-100 rounded-lg p-3 text-sm text-gray-700 shadow-sm flex-1">
                            <div className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">用户提问</div>
                            {round.user}
                          </div>
                        </div>

                        {/* AI Answer */}
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <Bot size={16} className="text-blue-600" />
                          </div>
                          <div className={cn(
                            "rounded-lg p-3 text-sm shadow-sm flex-1 border",
                            round.isHit ? "bg-orange-50 border-orange-100 text-gray-800" : "bg-white border-gray-100 text-gray-700"
                          )}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">重跑后 AI 回答</div>
                              {round.isHit && (
                                <span className="text-[10px] bg-orange-500 text-white px-1.5 rounded font-bold">命中质检问题</span>
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
              <div className="w-[380px] flex flex-col bg-white shrink-0">
                <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#1890ff]" />
                  <span className="text-base font-bold text-gray-800">质检结果分析</span>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Core Results */}
                  <div className="space-y-5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">核心质检指标</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400">本次质检维度</label>
                        <div className="text-sm font-bold text-gray-800">{record.dimension}</div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400">是否命中标准</label>
                        <div className={cn(
                          "text-sm font-bold",
                          record.latestResult === '❌有问题' ? "text-red-500" : "text-emerald-500"
                        )}>
                          {record.latestResult}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-gray-400">命中轮次</label>
                      <div className="text-sm font-bold text-gray-800">第 {record.problemRound + 1} 轮</div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-gray-400">命中原因</label>
                      {record.latestResult === '❌有问题' ? (
                        <div className="text-xs text-gray-600 bg-red-50/50 p-4 rounded-lg border border-red-100 leading-relaxed italic">
                          {record.reason || '精准匹配规则：用户提问与AI回答逻辑断层，未按人设引导。'}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 italic">无</div>
                      )}
                    </div>
                  </div>

                  {/* Full Link Info */}
                  <div className="space-y-5 pt-8 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">全链路追溯信息</h4>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">重跑时间</span>
                        <span className="text-gray-700 font-medium flex items-center gap-1">
                          <Clock size={12} />
                          {record.rerunTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">主人设版本</span>
                        <span className="text-gray-700 font-mono bg-gray-100 px-1.5 rounded">{record.personaVersion}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">质检维度版本</span>
                        <span className="text-gray-700 font-mono bg-gray-100 px-1.5 rounded">{record.qualityVersion}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">重跑操作人</span>
                        <span className="text-gray-700 font-medium">{record.operator}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-8 space-y-3">
                    <button className="w-full bg-[#1890ff] text-white py-3 rounded-lg text-sm font-bold hover:bg-[#40a9ff] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
                      <RotateCcw size={16} />
                      重新重跑
                    </button>
                    <button className="w-full border border-gray-200 text-gray-600 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                      标记为已处理
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
