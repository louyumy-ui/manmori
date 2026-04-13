import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Phone, Clock, MessageSquare, Filter, 
  ShieldCheck, Edit2, Play, Bot, User, RefreshCw, Sparkles,
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SvgCopyButton } from './SvgCopyButton';
import { CallRecord } from '../data/mockData';

interface CallDetailModalProps {
  selectedRecord: CallRecord | null;
  setSelectedRecord: (record: CallRecord | null) => void;
  setRecords: React.Dispatch<React.SetStateAction<CallRecord[]>>;
  isEditingWorkOrder: boolean;
  setIsEditingWorkOrder: (isEditing: boolean) => void;
  tempWorkOrderTags: string[];
  setTempWorkOrderTags: (tags: string[]) => void;
}

export const CallDetailModal: React.FC<CallDetailModalProps> = ({
  selectedRecord,
  setSelectedRecord,
  setRecords,
  isEditingWorkOrder,
  setIsEditingWorkOrder,
  tempWorkOrderTags,
  setTempWorkOrderTags,
}) => {
  const [isRerunning, setIsRerunning] = useState(false);
  const [isRerunningQuality, setIsRerunningQuality] = useState(false);
  const [rerunResults, setRerunResults] = useState<any[]>([]);
  const [qualityRerunResults, setQualityRerunResults] = useState<{ dimension: string; status: string; detail: string }[]>([]);
  const [showQualityRerunMenu, setShowQualityRerunMenu] = useState(false);

  if (!selectedRecord) return null;

  const handleRerun = () => {
    setIsRerunning(true);
    // Simulate AI generation based on context
    setTimeout(() => {
      const results = selectedRecord.chatTranscript.map((msg, idx) => {
        if (msg.role === 'bot') {
          return {
            original: msg.content,
            new: `[新人设重跑] ${msg.content.replace('欸 你好', '您好，我是林医生')}`,
            changed: true
          };
        }
        return { original: msg.content, changed: false };
      });
      setRerunResults(results);
      setIsRerunning(false);
    }, 1500);
  };

  const handleQualityRerun = (mode: 'full' | 'dimension', dimension?: string) => {
    setIsRerunningQuality(true);
    setShowQualityRerunMenu(false);
    // Simulate Quality Inspection Rerun
    setTimeout(() => {
      const results = [
        { dimension: '答非所问', status: '已修复', detail: '携带上下文重跑后，AI已能正确识别用户意图，不再出现幻觉回答。' },
        { dimension: '关键点遗漏', status: '正常', detail: '重跑验证：关键点“告知体检时间”已覆盖。' },
        { dimension: '幻觉检测', status: '已消除', detail: '针对历史幻觉句子“需空腹24小时”进行验证，重跑后答案为“需空腹8-12小时”，符合人设要求。' }
      ];
      setQualityRerunResults(mode === 'full' ? results : results.filter(r => r.dimension === dimension));
      setIsRerunningQuality(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {selectedRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRecord(null)}
            className="absolute inset-0 bg-black/45"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            id="call-detail-modal"
            className="bg-white h-[90vh] w-full max-w-6xl relative shadow-2xl flex flex-col rounded-lg overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-gray-800">通话详情</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">ID: {selectedRecord.id}</span>
                  <span>{selectedRecord.callTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button 
                    onClick={() => setShowQualityRerunMenu(!showQualityRerunMenu)}
                    disabled={isRerunningQuality}
                    className={cn(
                      "flex items-center gap-2 px-4 py-1.5 rounded text-sm transition-all",
                      isRerunningQuality ? "bg-gray-100 text-gray-400" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100"
                    )}
                  >
                    <RefreshCw size={14} className={cn(isRerunningQuality && "animate-spin")} />
                    {isRerunningQuality ? "质检重跑中..." : "一键质检重跑"}
                    <ChevronDown size={14} />
                  </button>
                  
                  <AnimatePresence>
                    {showQualityRerunMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
                      >
                        <button 
                          onClick={() => handleQualityRerun('full')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          全量重跑
                        </button>
                        <div className="h-[1px] bg-gray-100 my-1" />
                        <div className="px-4 py-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">按维度重跑</div>
                        <button 
                          onClick={() => handleQualityRerun('dimension', '答非所问')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          答非所问
                        </button>
                        <button 
                          onClick={() => handleQualityRerun('dimension', '关键点遗漏')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          关键点遗漏
                        </button>
                        <button 
                          onClick={() => handleQualityRerun('dimension', '幻觉检测')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          幻觉检测
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={handleRerun}
                  disabled={isRerunning}
                  className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded text-sm transition-all",
                    isRerunning ? "bg-gray-100 text-gray-400" : "bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-100"
                  )}
                >
                  <RefreshCw size={14} className={cn(isRerunning && "animate-spin")} />
                  {isRerunning ? "重跑中..." : "原对话重跑"}
                </button>
                <SvgCopyButton targetId="call-detail-modal" />
                <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Side: Chat Transcript */}
              <div className="flex-1 flex flex-col border-r border-gray-100 bg-gray-50/30">
                <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-700">对话流水</span>
                    {rerunResults.length > 0 && (
                      <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Sparkles size={10} />
                        已应用新人设重跑
                      </span>
                    )}
                    {qualityRerunResults.length > 0 && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <ShieldCheck size={10} />
                        质检重跑完成
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>对话轮次: <span className="text-gray-700 font-medium">{selectedRecord.rounds}</span></span>
                    <span>拨打次数: <span className="text-gray-700 font-medium">{selectedRecord.dialCount}</span></span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {qualityRerunResults.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mb-6 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                          <ShieldCheck size={16} />
                          质检重跑分析报告
                        </h5>
                        <button onClick={() => setQualityRerunResults([])} className="text-emerald-400 hover:text-emerald-600">
                          <X size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {qualityRerunResults.map((res, i) => (
                          <div key={i} className="bg-white/60 p-2 rounded text-xs border border-emerald-50">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-gray-700">【{res.dimension}】</span>
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-[10px]",
                                res.status === '已修复' || res.status === '已消除' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                              )}>{res.status}</span>
                            </div>
                            <p className="text-gray-500">{res.detail}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {selectedRecord.chatTranscript.map((msg, idx) => {
                    const rerunMsg = rerunResults[idx];
                    return (
                      <div key={idx} className="space-y-2">
                        <div className={cn(
                          "flex gap-3 max-w-[85%]",
                          msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}>
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            msg.role === 'bot' ? "bg-[#1890ff] text-white" : "bg-gray-200 text-gray-500"
                          )}>
                            {msg.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
                          </div>
                          <div className={cn(
                            "p-3 rounded-xl text-sm leading-relaxed relative group",
                            msg.role === 'bot' ? "bg-white text-gray-700 shadow-sm border border-gray-100" : "bg-[#1890ff] text-white"
                          )}>
                            {msg.content}
                            {rerunMsg?.changed && (
                              <div className="mt-2 pt-2 border-t border-purple-50 text-purple-600 bg-purple-50/50 p-2 rounded text-xs animate-in fade-in slide-in-from-top-1">
                                <div className="flex items-center gap-1 mb-1 font-bold">
                                  <Sparkles size={10} />
                                  新人设重跑结果：
                                </div>
                                {rerunMsg.new}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Audio Player Placeholder */}
                <div className="p-4 bg-white border-t border-gray-100">
                  <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2">
                    <button className="w-8 h-8 bg-[#1890ff] text-white rounded-full flex items-center justify-center">
                      <Play size={14} fill="currentColor" />
                    </button>
                    <div className="flex-1 h-1 bg-gray-200 rounded-full relative">
                      <div className="absolute left-0 top-0 h-full bg-[#1890ff] w-1/3 rounded-full" />
                    </div>
                    <span className="text-xs text-gray-400">01:24 / 03:15</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Analysis & Info */}
              <div className="w-[400px] overflow-y-auto p-6 space-y-8 bg-white">
                {/* Basic Info */}
                <section className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    基本信息
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <p className="text-gray-400">客户号码</p>
                      <p className="text-gray-700 font-medium">{selectedRecord.phoneNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-400">通话时长</p>
                      <p className="text-gray-700 font-medium">{selectedRecord.duration}s</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-400">创建人</p>
                      <p className="text-gray-700 font-medium">{selectedRecord.creator}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-400">话术模板</p>
                      <p className="text-gray-700 font-medium truncate" title={selectedRecord.template}>{selectedRecord.template}</p>
                    </div>
                  </div>
                </section>

                {/* Quality Hits */}
                <section className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#1890ff]" />
                    质检命中详情
                  </h4>
                  <div className="space-y-3">
                    {selectedRecord.qualityHits.map((hit, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-100 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded",
                            hit.type === '关键点' ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                          )}>
                            {hit.type}
                          </span>
                          <span className="text-[10px] text-gray-600 bg-white px-1.5 py-0.5 rounded border border-gray-100">
                            {hit.issue}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                          <span className="text-orange-600 font-medium">原因：</span>
                          {hit.reason}
                        </p>
                      </div>
                    ))}
                    {selectedRecord.qualityHits.length === 0 && (
                      <div className="text-center py-4 text-xs text-gray-400 bg-gray-50 rounded border border-dashed border-gray-200">
                        暂无质检命中
                      </div>
                    )}
                  </div>
                </section>

                {/* Captured Info */}
                <section className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Edit2 size={16} className="text-orange-500" />
                    捕捉信息明细
                  </h4>
                  <div className="border border-gray-100 rounded overflow-hidden">
                    <table className="w-full text-xs">
                      <tbody>
                        {selectedRecord.capturedInfo.map((info, idx) => (
                          <tr key={idx} className="border-b border-gray-50 last:border-0">
                            <td className="w-1/3 p-3 bg-gray-50 text-gray-600 border-r border-gray-50 font-medium">{info.key}</td>
                            <td className="w-2/3 p-0">
                              {info.key.includes('本人') || info.key.includes('参加') ? (
                                <select 
                                  value={info.value}
                                  onChange={(e) => {
                                    const newVal = e.target.value;
                                    setRecords(prev => prev.map(r => r.id === selectedRecord.id ? {
                                      ...r,
                                      capturedInfo: r.capturedInfo.map((ci, i) => i === idx ? { ...ci, value: newVal } : ci)
                                    } : r));
                                    setSelectedRecord(prev => prev ? {
                                      ...prev,
                                      capturedInfo: prev.capturedInfo.map((ci, i) => i === idx ? { ...ci, value: newVal } : ci)
                                    } : null);
                                  }}
                                  className="w-full p-3 outline-none bg-blue-50/30 text-gray-700 cursor-pointer"
                                >
                                  <option value={info.value}>{info.value || '请选择'}</option>
                                  <option value="是">是</option>
                                  <option value="否">否</option>
                                  <option value="不确定">不确定</option>
                                </select>
                              ) : (
                                <div className="w-full p-3 text-gray-700">{info.value || '-'}</div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Summary */}
                <section>
                  <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare size={16} className="text-gray-400" />
                    通话概括
                  </h4>
                  <div className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded border border-gray-100">
                    {selectedRecord.summary || '暂无概要内容'}
                  </div>
                </section>

                {/* Traceability / Operation Log */}
                <section className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    留痕登记
                  </h4>
                  <div className="space-y-3">
                    {[
                      { user: '系统管理员', action: '将“答非所问”状态修改为已处理', time: '2024-03-20 14:30' },
                      { user: '系统管理员', action: '选择修改工单，工单质检状态为已修改', time: '2024-03-20 14:35' },
                      { user: '系统管理员', action: '选择不修改工单，工单质检状态为已修改', time: '2024-03-20 14:40' },
                    ].map((log, idx) => (
                      <div key={idx} className="flex gap-3 text-[10px] relative">
                        {idx !== 2 && <div className="absolute left-1.5 top-4 bottom-[-12px] w-0.5 bg-gray-100" />}
                        <div className="w-3 h-3 rounded-full bg-blue-100 border-2 border-white shadow-sm z-10 mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <p className="text-gray-700">
                            <span className="font-bold mr-1">{log.user}</span>
                            {log.action}
                          </p>
                          <p className="text-gray-400">{log.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Work Order Tags Editing */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Filter size={16} className="text-gray-400" />
                      工单标签
                    </h4>
                    {isEditingWorkOrder && (
                      <button 
                        onClick={() => {
                          setRecords(prev => prev.map(r => r.id === selectedRecord.id ? { ...r, workOrderTags: tempWorkOrderTags, status: '已处理' } : r));
                          setSelectedRecord(prev => prev ? { ...prev, workOrderTags: tempWorkOrderTags, status: '已处理' } : null);
                          setIsEditingWorkOrder(false);
                        }}
                        className="text-[#1890ff] text-xs hover:underline"
                      >
                        保存
                      </button>
                    )}
                  </div>
                  {isEditingWorkOrder ? (
                    <div className="space-y-2">
                      <textarea 
                        value={tempWorkOrderTags.join(',')}
                        onChange={(e) => setTempWorkOrderTags(e.target.value.split(',').filter(t => t.trim()))}
                        className="w-full p-2 text-xs border border-gray-200 rounded outline-none focus:border-[#1890ff] min-h-[60px]"
                        placeholder="输入标签，用逗号隔开"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {selectedRecord.workOrderTags.map(tag => (
                        <span key={tag} className="text-[10px] bg-blue-50 text-[#1890ff] px-1.5 py-0.5 rounded border border-blue-100">
                          {tag}
                        </span>
                      ))}
                      {selectedRecord.workOrderTags.length === 0 && <span className="text-xs text-gray-300">暂无标签</span>}
                    </div>
                  )}
                </section>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
              <button 
                onClick={() => {
                  setIsEditingWorkOrder(true);
                  setTempWorkOrderTags(selectedRecord.workOrderTags);
                }}
                className="px-6 py-2 border border-[#1890ff] text-[#1890ff] rounded text-sm hover:bg-blue-50 transition-colors"
              >
                需修改工单
              </button>
              <button 
                onClick={() => {
                  setRecords(prev => prev.map(r => r.id === selectedRecord.id ? { ...r, status: '已处理' } : r));
                  setSelectedRecord(prev => prev ? { ...prev, status: '已处理' } : null);
                  setSelectedRecord(null);
                }}
                className="px-6 py-2 bg-[#1890ff] text-white rounded text-sm hover:bg-[#40a9ff] transition-colors"
              >
                不需要
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
