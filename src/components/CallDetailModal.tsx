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
  const [activeTab, setActiveTab] = useState<'detail' | 'revision'>('detail');
  const [isRerunning, setIsRerunning] = useState(false);
  const [isRerunningQuality, setIsRerunningQuality] = useState(false);
  const [rerunResults, setRerunResults] = useState<any[]>([]);
  const [qualityRerunResults, setQualityRerunResults] = useState<{ dimension: string; status: string; detail: string }[]>([]);
  const [showQualityRerunMenu, setShowQualityRerunMenu] = useState(false);

  if (!selectedRecord) return null;

  const handleRerun = () => {
    setIsRerunning(true);
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
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            id="call-detail-modal"
            className="bg-white h-[90vh] w-full max-w-[1400px] relative shadow-2xl flex flex-col rounded-lg overflow-hidden"
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
                        <button onClick={() => handleQualityRerun('full')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">全量重跑</button>
                        <div className="h-[1px] bg-gray-100 my-1" />
                        <div className="px-4 py-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">按维度重跑</div>
                        <button onClick={() => handleQualityRerun('dimension', '答非所问')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">答非所问</button>
                        <button onClick={() => handleQualityRerun('dimension', '关键点遗漏')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">关键点遗漏</button>
                        <button onClick={() => handleQualityRerun('dimension', '幻觉检测')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">幻觉检测</button>
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

            {/* Modal Content - 3 Columns */}
            <div className="flex-1 flex overflow-hidden bg-gray-50/30">
              
              {/* Column 1: Dialogue (Left) */}
              <div className="w-[450px] flex flex-col border-r border-gray-100 bg-white">
                {/* Audio Player */}
                <div className="p-4 border-b border-gray-100 bg-white">
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
                {/* Transcript */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/20">
                  {selectedRecord.chatTranscript.map((msg, idx) => (
                    <div key={idx} className={cn(
                      "flex gap-3 max-w-[90%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}>
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        msg.role === 'bot' ? "bg-[#1890ff] text-white" : "bg-gray-200 text-gray-500"
                      )}>
                        {msg.role === 'bot' ? <Bot size={16} /> : <User size={16} />}
                      </div>
                      <div className={cn(
                        "p-3 rounded-xl text-sm leading-relaxed shadow-sm border",
                        msg.role === 'bot' ? "bg-white text-gray-700 border-gray-100" : "bg-[#1890ff] text-white border-[#1890ff]"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Quality Inspection (Middle) */}
              <div className="flex-1 flex flex-col border-r border-gray-100 bg-white">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#1890ff]" />
                    质检详情
                  </h4>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Key Points */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-50 text-red-500 text-[10px] px-2 py-0.5 rounded font-bold">关键点</span>
                      <span className="text-xs text-gray-400">工单质检</span>
                    </div>
                    <div className="space-y-4">
                      {selectedRecord.qualityInspection?.keyPoints.map((point, idx) => (
                        <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-700">第 {point.roundNo} 轮</span>
                              <span className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-500">{point.ruleName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400">是否关联:</span>
                              <span className={cn(
                                "text-[10px] font-bold",
                                point.isAssociated === '是' ? "text-emerald-500" : "text-gray-400"
                              )}>{point.isAssociated}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            <span className="text-orange-500 font-bold mr-1">命中原因:</span>
                            {point.reason}
                          </p>
                          {point.affectedRounds.length > 0 && (
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                              <span className="text-[10px] text-gray-400">影响轮次列表:</span>
                              <div className="flex gap-1">
                                {point.affectedRounds.map(r => (
                                  <span key={r} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 rounded">第 {r} 轮</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Non-Key Points */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-50 text-blue-500 text-[10px] px-2 py-0.5 rounded font-bold">非关键点</span>
                      <span className="text-xs text-gray-400">重复追问</span>
                    </div>
                    {selectedRecord.qualityInspection?.nonKeyPoints.length === 0 ? (
                      <div className="bg-gray-50/30 border border-dashed border-gray-200 rounded-lg p-4 text-center text-xs text-gray-400">
                        暂无非关键点命中
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedRecord.qualityInspection?.nonKeyPoints.map((point, idx) => (
                          <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-lg p-4 space-y-3">
                            {/* Similar structure to key points */}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Middle Footer Buttons */}
                <div className="p-4 border-t border-gray-100 flex gap-3 bg-white">
                  <button className="flex-1 py-2 border border-[#1890ff] text-[#1890ff] rounded text-sm hover:bg-blue-50 transition-colors">
                    需修改工单
                  </button>
                  <button className="flex-1 py-2 bg-[#1890ff] text-white rounded text-sm hover:bg-[#40a9ff] transition-colors">
                    不需要
                  </button>
                </div>
              </div>

              {/* Column 3: Details & Info (Right) */}
              <div className="w-[450px] flex flex-col bg-white">
                {/* Tabs Header */}
                <div className="flex border-b border-gray-100 shrink-0">
                  <button 
                    onClick={() => setActiveTab('detail')}
                    className={cn(
                      "flex-1 py-3 text-sm font-bold transition-all border-b-2",
                      activeTab === 'detail' ? "text-[#1890ff] border-[#1890ff]" : "text-gray-400 border-transparent hover:text-gray-600"
                    )}
                  >
                    外呼明细
                  </button>
                  <button 
                    onClick={() => setActiveTab('revision')}
                    className={cn(
                      "flex-1 py-3 text-sm font-bold transition-all border-b-2",
                      activeTab === 'revision' ? "text-[#1890ff] border-[#1890ff]" : "text-gray-400 border-transparent hover:text-gray-600"
                    )}
                  >
                    修订记录
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {activeTab === 'detail' ? (
                    <>
                      {/* Outbound Info */}
                      <section className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                          <div className="w-1 h-4 bg-[#1890ff] rounded-full" />
                          外呼信息
                          <span className="ml-auto text-[10px] text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">回援呼入</span>
                        </div>
                        <div className="grid grid-cols-1 gap-3 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">业务话术</span>
                            <span className="text-gray-700 font-medium">企业年报</span>
                          </div>
                        </div>
                      </section>

                      {/* Customer Info */}
                      <section className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                          <User size={16} className="text-gray-400" />
                          客户信息
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">号码</span>
                          <span className="text-gray-700 font-medium">132****7714</span>
                        </div>
                      </section>

                      {/* Call Records Timeline */}
                      <section className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                          <Clock size={16} className="text-gray-400" />
                          通话记录
                        </div>
                        <div className="space-y-4 pl-2">
                          <div className="relative pl-6 border-l border-gray-100">
                            <div className="absolute left-[-4.5px] top-0 w-2 h-2 rounded-full bg-gray-200" />
                            <div className="text-[10px] text-gray-400 mb-1">上次通话时间：2026-03-20 14:30</div>
                            <div className="space-y-1 text-[10px] text-gray-500">
                              <p>通话状态：<span className="text-emerald-500">已接</span></p>
                              <p>通话时长：6s</p>
                              <p>通话概要：确认周一前往，需用餐，无海鲜过敏，无其他特殊要求。</p>
                            </div>
                          </div>
                          <div className="relative pl-6 border-l border-gray-100">
                            <div className="absolute left-[-4.5px] top-0 w-2 h-2 rounded-full bg-[#1890ff]" />
                            <div className="text-[10px] text-gray-400 mb-1">本次通话时间：2026-04-03 14:35</div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">回援呼入</span>
                              <span className="text-[10px] text-gray-500">6s</span>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Captured Info Detail */}
                      <section className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                            <ShieldCheck size={16} className="text-orange-500" />
                            捕捉信息明细
                          </div>
                          <input type="checkbox" checked readOnly className="rounded text-[#1890ff]" />
                        </div>
                        <div className="border border-gray-100 rounded overflow-hidden">
                          <table className="w-full text-xs">
                            <tbody>
                              {[
                                { key: '参加体检', value: '是' },
                                { key: '是否在院内用餐', value: '是' },
                                { key: '预约时间', value: '周一 上午' },
                                { key: '知悉体检注意事项', value: '是' },
                              ].map((info, idx) => (
                                <tr key={idx} className="border-b border-gray-50 last:border-0">
                                  <td className="w-1/2 p-3 bg-gray-50 text-gray-600 border-r border-gray-50 font-medium">{info.key}</td>
                                  <td className="w-1/2 p-3 text-gray-700 flex items-center justify-between">
                                    {info.value}
                                    <ChevronDown size={12} className="text-gray-300" />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] text-gray-400">其他需求</p>
                          <div className="flex flex-wrap gap-2">
                            {['# 忌口：葱', '# 海鲜过敏', '# 需温水'].map(tag => (
                              <span key={tag} className="text-[10px] text-blue-500">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </section>

                      {/* Call Summary */}
                      <section className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                          <MessageSquare size={16} className="text-blue-400" />
                          通话概要
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded border border-gray-100">
                          确认周一前往，需用餐，对海鲜过敏，无其他特殊要求。
                        </div>
                      </section>
                    </>
                  ) : (
                    <div className="text-center py-20 text-gray-400 text-sm">暂无修订记录</div>
                  )}
                </div>

                {/* Right Footer Buttons */}
                <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
                  <button onClick={() => setSelectedRecord(null)} className="px-6 py-2 border border-gray-200 text-gray-600 rounded text-sm hover:bg-gray-50 transition-colors">
                    取消
                  </button>
                  <button className="px-6 py-2 bg-[#1890ff] text-white rounded text-sm hover:bg-[#40a9ff] transition-colors shadow-lg shadow-blue-100">
                    保存
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="px-6 py-3 border-t border-gray-100 flex justify-center gap-4 bg-white shrink-0">
              <button className="px-8 py-1.5 border border-gray-200 text-gray-600 rounded-full text-sm hover:bg-gray-50 transition-colors">
                上一通话
              </button>
              <button className="px-8 py-1.5 border border-gray-200 text-gray-600 rounded-full text-sm hover:bg-gray-50 transition-colors">
                下一通话
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
