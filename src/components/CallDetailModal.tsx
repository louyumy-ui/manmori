import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Phone, Clock, MessageSquare, Filter, 
  ShieldCheck, Edit2, Play, Bot, User 
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
  if (!selectedRecord) return null;

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
            className="bg-white h-[90vh] w-full max-w-5xl relative shadow-2xl flex flex-col rounded-lg overflow-hidden"
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
                  <span className="text-sm font-bold text-gray-700">对话流水</span>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>对话轮次: <span className="text-gray-700 font-medium">{selectedRecord.rounds}</span></span>
                    <span>拨打次数: <span className="text-gray-700 font-medium">{selectedRecord.dialCount}</span></span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {selectedRecord.chatTranscript.map((msg, idx) => (
                    <div key={idx} className={cn(
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
                        "p-3 rounded-xl text-sm leading-relaxed",
                        msg.role === 'bot' ? "bg-white text-gray-700 shadow-sm border border-gray-100" : "bg-[#1890ff] text-white"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
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
