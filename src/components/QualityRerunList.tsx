import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, 
  Search, Filter, RefreshCw, Eye, CheckCircle2, XCircle, Clock, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { SvgCopyButton } from './SvgCopyButton';
import { QUALITY_RERUN_RECORDS, QualityRerunRecord } from '../data/mockData';

interface QualityRerunListProps {
  onViewDetail: (record: QualityRerunRecord) => void;
}

export const QualityRerunList: React.FC<QualityRerunListProps> = ({ onViewDetail }) => {
  const [records, setRecords] = useState<QualityRerunRecord[]>(QUALITY_RERUN_RECORDS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  const toggleSelectAll = () => {
    if (selectedIds.length === records.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(records.map(r => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="flex flex-col gap-4" id="quality-rerun-list">
      {/* Filter Section */}
      <div className="bg-white rounded-sm shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#1890ff] rounded-full"></div>
            <h2 className="text-base font-bold text-gray-800">质检重跑列表</h2>
          </div>
          <div className="flex items-center gap-3">
            <SvgCopyButton targetId="quality-rerun-list" />
            <button 
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="text-[#1890ff] text-sm flex items-center gap-1"
            >
              {isFilterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {isFilterExpanded ? '收起' : '展开'}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isFilterExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 shrink-0">话术名称:</span>
                  <input type="text" placeholder="请输入话术名称" className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 shrink-0">被叫号码:</span>
                  <input type="text" placeholder="请输入号码" className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 shrink-0">质检维度:</span>
                  <select className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8 bg-white">
                    <option value="">全部</option>
                    <option value="答非所问">答非所问</option>
                    <option value="幻觉">幻觉</option>
                    <option value="重复追问">重复追问</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 shrink-0">处理状态:</span>
                  <select className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8 bg-white">
                    <option value="">全部</option>
                    <option value="重跑中">重跑中</option>
                    <option value="已完成">已完成</option>
                    <option value="重跑失败">重跑失败</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button className="border border-gray-300 text-gray-600 px-6 py-1 rounded text-sm hover:bg-gray-50 h-8">重置</button>
                <button className="bg-[#1890ff] text-white px-6 py-1 rounded text-sm hover:bg-[#40a9ff] h-8">查询</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-sm shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="bg-[#1890ff] text-white px-4 py-1.5 rounded text-sm flex items-center gap-2 hover:bg-[#40a9ff]">
              <RefreshCw size={14} />
              批量重新重跑
            </button>
            <button className="border border-gray-300 text-gray-600 px-4 py-1.5 rounded text-sm hover:bg-gray-50">
              批量标记处理
            </button>
          </div>
          <div className="text-sm text-gray-500">
            已选择 <span className="text-[#1890ff] font-bold">{selectedIds.length}</span> 项
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafafa] border-b border-gray-200">
                <th className="px-4 py-4 w-10">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === records.length && records.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-[#1890ff] focus:ring-[#1890ff]"
                  />
                </th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">话术名称</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">被叫号码</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">命中质检维度</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">人设版本</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">质检版本</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">重跑次数</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">最新命中结果</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">重跑时间</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">操作人</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">状态</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800 sticky right-0 bg-[#fafafa] shadow-[-2px_0_5px_rgba(0,0,0,0.05)]">操作</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                  <td className="px-4 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(record.id)}
                      onChange={() => toggleSelect(record.id)}
                      className="rounded border-gray-300 text-[#1890ff] focus:ring-[#1890ff]"
                    />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{record.scriptName}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{record.calledNumber}</td>
                  <td className="px-4 py-4">
                    <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded border border-orange-100">
                      {record.dimension}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500 font-mono">{record.personaVersion}</td>
                  <td className="px-4 py-4 text-xs text-gray-500 font-mono">{record.qualityVersion}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{record.rerunCount}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <span className={cn(
                        "text-sm font-bold",
                        record.latestResult === '❌有问题' ? "text-red-500" : "text-emerald-500"
                      )}>
                        {record.latestResult}
                      </span>
                      <span className="text-[10px] text-gray-400">第 {record.rerunCount} 次质检</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{record.rerunTime}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{record.operator}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      {record.status === '重跑中' && (
                        <div className="flex items-center gap-1.5 text-blue-500">
                          <RefreshCw size={12} className="animate-spin" />
                          <span className="text-xs">重跑中</span>
                        </div>
                      )}
                      {record.status === '已完成' && (
                        <div className="flex items-center gap-1.5 text-emerald-500">
                          <CheckCircle2 size={12} />
                          <span className="text-xs">已完成</span>
                        </div>
                      )}
                      {record.status === '重跑失败' && (
                        <div className="flex items-center gap-1.5 text-red-500">
                          <XCircle size={12} />
                          <span className="text-xs">重跑失败</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 sticky right-0 bg-white group-hover:bg-gray-50 shadow-[-2px_0_5px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onViewDetail(record)}
                        className="text-sm text-[#1890ff] hover:underline flex items-center gap-1"
                      >
                        <Eye size={14} />
                        详情
                      </button>
                      <button className="text-sm text-[#1890ff] hover:underline flex items-center gap-1">
                        <RefreshCw size={14} />
                        重跑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-4 shrink-0">
          <span className="text-sm text-gray-500">共 {records.length} 条</span>
          <div className="flex items-center border border-gray-300 rounded">
            <select className="px-2 py-1 text-sm outline-none bg-white">
              <option>20条/页</option>
              <option>50条/页</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-sm bg-[#1890ff] text-white rounded">1</button>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
