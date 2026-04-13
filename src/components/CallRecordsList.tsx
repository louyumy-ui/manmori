import React from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, 
  Play, Filter, History, Download, X, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { SvgCopyButton } from './SvgCopyButton';
import { CallRecord } from '../data/mockData';

interface CallRecordsListProps {
  records: CallRecord[];
  setRecords: React.Dispatch<React.SetStateAction<CallRecord[]>>;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  isFilterExpanded: boolean;
  setIsFilterExpanded: (expanded: boolean) => void;
  setSelectedRecord: (record: CallRecord | null) => void;
  setHistoryNumber: (num: string | null) => void;
  setBulkProcessModal: (modal: { isOpen: boolean; issue: string | null }) => void;
  filters: { qualityType: string; qualityIssue: string; status: string };
  setFilters: React.Dispatch<React.SetStateAction<{ qualityType: string; qualityIssue: string; status: string }>>;
  setViewMode: (mode: 'list' | 'test' | 'quality-rerun') => void;
}

export const CallRecordsList: React.FC<CallRecordsListProps> = ({
  records,
  setRecords,
  selectedIds,
  setSelectedIds,
  isFilterExpanded,
  setIsFilterExpanded,
  setSelectedRecord,
  setHistoryNumber,
  setBulkProcessModal,
  filters,
  setFilters,
  setViewMode,
}) => {
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
    <>
      {/* Filter Section */}
      <div className="bg-white rounded-sm shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-4 bg-[#1890ff] rounded-full"></div>
          <h2 className="text-base font-bold text-gray-800">外呼记录</h2>
        </div>

        <div className={cn("space-y-4 transition-all duration-300", isFilterExpanded ? "opacity-100" : "h-0 opacity-0 overflow-hidden")}>
          {/* Row 1 */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 shrink-0">账号:</span>
              <input type="text" placeholder="请输入账号" className="border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 shrink-0">话术名称:</span>
              <input type="text" placeholder="请输入话术名称" className="border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 shrink-0">客户号码:</span>
              <input type="text" placeholder="请输入客户号码" className="border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 shrink-0">主叫号码:</span>
              <input type="text" placeholder="请输入主叫号码" className="border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 shrink-0">通话时间:</span>
              <div className="flex items-center border border-gray-300 rounded px-2 py-1 bg-white h-8">
                <History size={14} className="text-gray-400 mr-2" />
                <input type="text" placeholder="开始时间" className="text-sm w-24 outline-none" />
                <span className="mx-2 text-gray-300">至</span>
                <input type="text" placeholder="结束时间" className="text-sm w-24 outline-none" />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 shrink-0">接听状态:</span>
              <div className="flex-1 relative">
                <select className="w-40 border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8 appearance-none bg-white">
                  <option value="">请选择</option>
                  <option value="已接听">已接听</option>
                  <option value="未接听">未接听</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 shrink-0">质检状态:</span>
              <div className="flex-1 relative">
                <select className="w-40 border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8 appearance-none bg-white">
                  <option value="已处理">已处理</option>
                  <option value="未处理">未处理</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 shrink-0">工单标签:</span>
              <input type="text" placeholder="请选择" className="border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 shrink-0">质检:</span>
              <input type="text" placeholder="请选择" className="border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 shrink-0">质检问题:</span>
              <input type="text" placeholder="答非所问" className="border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 shrink-0">工单状态:</span>
              <div className="flex-1 relative">
                <select className="w-40 border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8 appearance-none bg-white">
                  <option value="">请选择</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 shrink-0">通话时长区间(秒):</span>
              <div className="flex items-center gap-1">
                <input type="text" placeholder="自定义秒数" className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-[#1890ff] h-8 w-24 text-center" />
                <span className="text-gray-300">--</span>
                <input type="text" placeholder="自定义秒数" className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-[#1890ff] h-8 w-24 text-center" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 shrink-0">对话轮次:</span>
              <div className="flex items-center gap-1">
                <input type="text" placeholder="自定义轮次" className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-[#1890ff] h-8 w-24 text-center" />
                <span className="text-gray-300">--</span>
                <input type="text" placeholder="自定义轮次" className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-[#1890ff] h-8 w-24 text-center" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 shrink-0">迭代备注:</span>
              <input type="text" placeholder="请选择" className="border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8 w-40" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <button className="bg-[#1890ff] text-white px-6 py-1 rounded text-sm hover:bg-[#40a9ff] h-8">查询</button>
            <button 
              onClick={() => setViewMode('quality-rerun')}
              className="bg-emerald-500 text-white px-6 py-1 rounded text-sm hover:bg-emerald-600 h-8 flex items-center gap-1"
            >
              <RefreshCw size={14} />
              一键重跑质检
            </button>
            <button className="bg-red-300 text-white px-6 py-1 rounded text-sm hover:bg-red-400 h-8">批量处理质检问题</button>
            <button className="border border-gray-300 text-gray-600 px-6 py-1 rounded text-sm hover:bg-gray-50 h-8">重置</button>
            <button className="border border-gray-300 text-gray-600 px-6 py-1 rounded text-sm hover:bg-gray-50 h-8">导出</button>
            <button className="border border-gray-300 text-gray-600 px-6 py-1 rounded text-sm hover:bg-gray-50 h-8">刷新</button>
            
            <div className="ml-auto flex items-center gap-3">
              <SvgCopyButton targetId="call-records-page" />
              <button 
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="text-[#1890ff] text-sm flex items-center gap-1 px-2 py-1 hover:bg-gray-50 rounded"
              >
                {isFilterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {isFilterExpanded ? '收起' : '展开'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-sm shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1600px]">
            <thead>
              <tr className="bg-[#fafafa] border-b border-gray-200">
                       <th className="px-4 py-4 text-sm font-semibold text-gray-800">话术名称</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">任务名称</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">号码</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">通话时间</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">接听状态</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">号码状态</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">通话时长(秒)</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">通话录音</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">对话标签</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">获取明细</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">质检</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">质检问题</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800">工单状态</th>
                <th className="px-4 py-4 text-sm font-semibold text-gray-800 sticky right-0 bg-[#fafafa] shadow-[-2px_0_5px_rgba(0,0,0,0.05)]">详情</th>
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
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-600 max-w-[150px] truncate" title={record.scriptName}>{record.scriptName}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-600 max-w-[150px] truncate" title={record.taskName}>{record.taskName}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div 
                      onClick={() => setHistoryNumber(record.phoneNumber)}
                      className="text-sm text-gray-600 cursor-pointer hover:text-[#1890ff] font-medium"
                    >
                      {record.phoneNumber}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-500">{record.callTime}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "text-sm",
                      record.answerStatus === '已接听' ? "text-emerald-500" : 
                      record.answerStatus === '未接听' ? "text-red-500" :
                      record.answerStatus === '排队超时' ? "text-orange-500" :
                      "text-gray-400"
                    )}>
                      {record.answerStatus === '已接听' ? '已接' : record.answerStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "text-sm",
                      record.phoneStatus === '呼叫成功' ? "text-emerald-500" : "text-red-500"
                    )}>
                      {record.phoneStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-600">{record.duration}</div>
                  </td>
                  <td className="px-4 py-4">
                    <button className="text-sm text-[#1890ff] hover:underline">播放录音</button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-600">{record.dialogTags[0] || '参加体检'}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1">
                      <span className="text-xs bg-blue-50 text-[#1890ff] px-2 py-1 rounded border border-blue-100">时间: 周一;上午</span>
                      <span className="text-xs bg-gray-50 text-gray-400 px-2 py-1 rounded border border-gray-100">用餐: 是</span>
                      <span className="text-xs bg-gray-50 text-gray-400 px-2 py-1 rounded border border-gray-100">须知: 已知晓</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "text-sm font-medium",
                      record.qualityType === '关键点' ? "text-red-500" : 
                      record.qualityType === '非关键点' ? "text-blue-500" : "text-gray-400"
                    )}>
                      {record.qualityType}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      {record.qualityIssue.map(issue => (
                        <div key={issue} className="flex items-center gap-1 text-red-500 text-xs">
                          <span>{issue}</span>
                          <X size={12} className="bg-red-500 text-white rounded-full p-0.5" />
                        </div>
                      ))}
                      {record.qualityIssue.length === 0 && <span className="text-gray-300">-</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "text-sm",
                      record.status === '已处理' ? "text-emerald-500" : "text-orange-500"
                    )}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 sticky right-0 bg-white group-hover:bg-gray-50 shadow-[-2px_0_5px_rgba(0,0,0,0.05)]">
                    <button 
                      onClick={() => setSelectedRecord(record)}
                      className="text-sm text-[#1890ff] hover:underline"
                    >
                      详情
                    </button>
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
    </>
  );
};
