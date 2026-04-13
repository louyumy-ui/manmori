import React, { useState } from 'react';
import { X, History, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { SvgCopyButton } from './SvgCopyButton';
import { 
  INITIAL_RECORDS, 
  CallRecord, 
  ChatMessage 
} from '../data/mockData';
import { CallRecordsList } from './CallRecordsList';
import { CallDetailModal } from './CallDetailModal';
import { CallSessionTest } from './CallSessionTest';
import { QualityRerunList } from './QualityRerunList';
import { QualityRerunDetailModal } from './QualityRerunDetailModal';
import { QualityRerunRecord } from '../data/mockData';

export const CallRecords: React.FC = () => {
  const [records, setRecords] = useState<CallRecord[]>(INITIAL_RECORDS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<CallRecord | null>(null);
  const [selectedRerunRecord, setSelectedRerunRecord] = useState<QualityRerunRecord | null>(null);
  const [historyNumber, setHistoryNumber] = useState<string | null>(null);
  const [isEditingWorkOrder, setIsEditingWorkOrder] = useState(false);
  const [tempWorkOrderTags, setTempWorkOrderTags] = useState<string[]>([]);
  const [bulkProcessModal, setBulkProcessModal] = useState<{ isOpen: boolean; issue: string | null }>({ isOpen: false, issue: null });
  const [viewMode, setViewMode] = useState<'list' | 'test' | 'quality-rerun'>('list');
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [testMessages, setTestMessages] = useState<ChatMessage[]>([
    { role: 'bot', content: '欸 你好！这里是东漱社区社区医院，请问是梁俊升本人嘛？' }
  ]);
  const [testInput, setTestInput] = useState('');
  const [filters, setFilters] = useState({
    qualityType: '',
    qualityIssue: '',
    status: ''
  });

  return (
    <div className="flex-1 flex flex-col bg-[#f0f2f5] overflow-hidden" id="call-records-page">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-600 hover:text-[#1890ff] transition-colors">
              <ChevronLeft size={18} />
              <span className="text-sm">返回</span>
            </button>
            <div className="h-4 w-[1px] bg-gray-200" />
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>首页</span>
              <span>/</span>
              <span>话术管理 (管理端)</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">配置</span>
            </div>
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "px-6 py-1.5 rounded-md text-sm transition-all",
                viewMode === 'list' ? "bg-white text-gray-900 shadow-sm font-bold scale-110" : "text-gray-400"
              )}
            >
              管理端
            </button>
            <button 
              onClick={() => setViewMode('test')}
              className={cn(
                "px-6 py-1.5 rounded-md text-sm transition-all",
                viewMode === 'test' ? "bg-white text-gray-900 shadow-sm font-bold scale-110" : "text-gray-400"
              )}
            >
              客户端
            </button>
            <button 
              onClick={() => setViewMode('quality-rerun')}
              className={cn(
                "px-6 py-1.5 rounded-md text-sm transition-all",
                viewMode === 'quality-rerun' ? "bg-white text-gray-900 shadow-sm font-bold scale-110" : "text-gray-400"
              )}
            >
              质检重跑
            </button>
          </div>
          <div className="w-40" /> {/* Spacer for balance */}
        </div>

        <div className="px-6 flex items-center gap-1">
          <div 
            className={cn(
              "px-6 py-3 text-sm cursor-pointer transition-colors relative",
              viewMode === 'list' ? "text-[#1890ff] font-bold" : "text-gray-500"
            )}
          >
            概览
          </div>
          <div 
            className={cn(
              "px-6 py-3 text-sm cursor-pointer transition-colors relative",
              viewMode === 'list' ? "text-[#1890ff] font-bold" : "text-gray-500"
            )}
          >
            外呼记录
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1890ff]" />
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-50 text-[#1890ff] text-[10px] flex items-center justify-center rounded-sm">
              <X size={10} />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 p-4 overflow-y-auto space-y-4">
        {viewMode === 'list' && (
          <CallRecordsList 
            records={records}
            setRecords={setRecords}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            isFilterExpanded={isFilterExpanded}
            setIsFilterExpanded={setIsFilterExpanded}
            setSelectedRecord={setSelectedRecord}
            setHistoryNumber={setHistoryNumber}
            setBulkProcessModal={setBulkProcessModal}
            filters={filters}
            setFilters={setFilters}
            setViewMode={setViewMode}
          />
        )}
        {viewMode === 'test' && (
          <CallSessionTest 
            setViewMode={setViewMode}
            testPhoneNumber={testPhoneNumber}
            setTestPhoneNumber={setTestPhoneNumber}
            testMessages={testMessages}
            setTestMessages={setTestMessages}
            testInput={testInput}
            setTestInput={setTestInput}
          />
        )}
        {viewMode === 'quality-rerun' && (
          <QualityRerunList 
            onViewDetail={setSelectedRerunRecord}
          />
        )}
      </main>

      {/* Detail Modal */}
      <CallDetailModal 
        selectedRecord={selectedRecord}
        setSelectedRecord={setSelectedRecord}
        setRecords={setRecords}
        isEditingWorkOrder={isEditingWorkOrder}
        setIsEditingWorkOrder={setIsEditingWorkOrder}
        tempWorkOrderTags={tempWorkOrderTags}
        setTempWorkOrderTags={setTempWorkOrderTags}
      />

      {/* Bulk Process Modal */}
      <AnimatePresence>
        {bulkProcessModal.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBulkProcessModal({ isOpen: false, issue: null })}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-sm relative z-10 p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">批量处理确认</h3>
              <p className="text-sm text-gray-600 mb-6">
                是否将所有命中了 <span className="text-orange-600 font-bold">“{bulkProcessModal.issue}”</span> 的记录状态修改为 <span className="text-emerald-600 font-bold">“已处理”</span>？
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setBulkProcessModal({ isOpen: false, issue: null })}
                  className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded border border-gray-200"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    setRecords(prev => prev.map(r => r.qualityIssue.includes(bulkProcessModal.issue!) ? { ...r, status: '已处理' } : r));
                    setBulkProcessModal({ isOpen: false, issue: null });
                  }}
                  className="px-4 py-2 text-sm bg-[#1890ff] text-white rounded hover:bg-[#40a9ff]"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Drill-down Modal */}
      <AnimatePresence>
        {historyNumber && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHistoryNumber(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              id="history-modal"
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative z-10 flex flex-col max-h-[80vh]"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">历史通话轨迹</h3>
                  <p className="text-sm text-gray-400">号码：{historyNumber}</p>
                </div>
                <div className="flex items-center gap-3">
                  <SvgCopyButton targetId="history-modal" />
                  <button onClick={() => setHistoryNumber(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {records.filter(r => r.phoneNumber === historyNumber).map((r, idx) => (
                    <div key={r.id} className="relative pl-8 border-l-2 border-gray-100 pb-6 last:pb-0">
                      <div className={cn(
                        "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm",
                        r.answerStatus === '已接' ? "bg-emerald-500" : "bg-red-500"
                      )} />
                      <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-bold text-gray-800">{r.callTime}</span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded",
                            r.source === '主动呼出' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                          )}>{r.source}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                          <div>话术: {r.scriptName}</div>
                          <div>时长: {r.duration}s</div>
                          <div>状态: {r.phoneStatus}</div>
                        </div>
                        {r.summary && (
                          <div className="mt-3 text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
                            {r.summary}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Quality Rerun Detail Modal */}
      <QualityRerunDetailModal 
        record={selectedRerunRecord}
        onClose={() => setSelectedRerunRecord(null)}
      />
    </div>
  );
};
