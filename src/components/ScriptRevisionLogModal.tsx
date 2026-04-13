import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { REVISION_LOGS } from '../data/mockData';
import { SvgCopyButton } from './SvgCopyButton';

interface ScriptRevisionLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRollback: (log: any) => void;
}

export const ScriptRevisionLogModal: React.FC<ScriptRevisionLogModalProps> = ({
  isOpen,
  onClose,
  onRollback
}) => {
  const [filterType, setFilterType] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = REVISION_LOGS.filter(log => {
    const matchesFilter = filterType === '全部' || log.description.includes(filterType);
    const matchesSearch = log.operator.includes(searchQuery) || log.description.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/45"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            id="script-revision-log-modal"
            className="bg-white w-full max-w-5xl h-[80vh] relative shadow-2xl flex flex-col rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <h3 className="text-lg font-bold text-gray-800">配置列表</h3>
              <div className="flex items-center gap-3">
                <SvgCopyButton targetId="script-revision-log-modal" />
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">描述筛选:</span>
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border border-gray-200 rounded px-3 py-1.5 text-sm bg-white focus:border-[#1890ff] outline-none"
                  >
                    <option value="全部">全部</option>
                    <option value="人设">人设</option>
                    <option value="语音合成开场白">语音合成开场白</option>
                    <option value="参数配置">参数配置</option>
                    <option value="模型配置模板">模型配置模板</option>
                  </select>
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="搜索操作人/描述" 
                    className="pl-9 pr-3 py-1.5 border border-gray-200 rounded text-sm focus:border-[#1890ff] outline-none w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="text-xs text-gray-400">
                共 <span className="text-gray-700 font-medium">{filteredLogs.length}</span> 条记录
              </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                  <tr className="text-xs text-gray-400 font-medium border-b border-gray-100">
                    <th className="px-6 py-4 font-medium">操作人</th>
                    <th className="px-6 py-4 font-medium">版本号</th>
                    <th className="px-6 py-4 font-medium">类型</th>
                    <th className="px-6 py-4 font-medium">描述</th>
                    <th className="px-6 py-4 font-medium">旧数据</th>
                    <th className="px-6 py-4 font-medium">新数据</th>
                    <th className="px-6 py-4 font-medium">操作时间</th>
                    <th className="px-6 py-4 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-700">{log.operator}</td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{log.version}</td>
                      <td className="px-6 py-4">
                        <span className="text-red-500">{log.type}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{log.description}</td>
                      <td className="px-6 py-4 text-gray-400 max-w-[150px] truncate" title={log.oldData}>{log.oldData}</td>
                      <td className="px-6 py-4 text-gray-700 max-w-[150px] truncate" title={log.newData}>{log.newData}</td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{log.time}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button className="text-[#1890ff] hover:underline">详情</button>
                          <button 
                            onClick={() => onRollback(log)}
                            className="text-orange-500 hover:underline flex items-center gap-1"
                          >
                            <RotateCcw size={12} />
                            回滚
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>共 {filteredLogs.length} 条</span>
                <select className="border border-gray-200 rounded px-2 py-1 outline-none">
                  <option>50条/页</option>
                  <option>100条/页</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-30" disabled>
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1">
                  <button className="w-6 h-6 rounded bg-[#1890ff] text-white text-xs flex items-center justify-center">1</button>
                </div>
                <button className="p-1 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-30" disabled>
                  <ChevronRight size={16} />
                </button>
                <div className="flex items-center gap-2 text-xs text-gray-500 ml-4">
                  <span>前往</span>
                  <input type="text" defaultValue="1" className="w-8 border border-gray-200 rounded px-1 py-0.5 text-center outline-none focus:border-[#1890ff]" />
                  <span>页</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
