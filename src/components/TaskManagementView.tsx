import React, { useState } from 'react';
import { 
  Search, RotateCcw, ChevronDown, Calendar, 
  Download, ChevronLeft, ChevronRight, Info, List
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SvgCopyButton } from './SvgCopyButton';
import { QualitySummaryCard } from './QualitySummaryCard';
import { 
  TASKS, 
  DAILY_DATA, 
  QUALITY_SUMMARY_DATA
} from '../data/mockData';

export const TaskManagementView: React.FC = () => {
  const [selectedTaskId, setSelectedTaskId] = useState('5');
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'ongoing' | 'completed' | 'analysis'>('analysis');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedTask = TASKS.find(t => t.id === selectedTaskId) || TASKS[0];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Sidebar: Task List */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer hover:text-[#1890ff]">
              <span>全部任务</span>
              <ChevronDown size={14} />
            </div>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="刷新">
              <RotateCcw size={14} className="text-gray-400" />
            </button>
          </div>
          <button className="w-full py-2 bg-[#1890ff] text-white rounded text-sm font-medium hover:bg-[#40a9ff] transition-colors shadow-sm">
            新建任务
          </button>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索任务名称，按回车键查询" 
              className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#1890ff]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 border border-gray-200 rounded px-2 py-1.5 text-[10px] text-gray-400">
            <Calendar size={12} />
            <span>开始时间 至 结束时间</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
          {TASKS.map(task => (
            <div 
              key={task.id}
              onClick={() => setSelectedTaskId(task.id)}
              className={cn(
                "p-3 rounded-lg border transition-all cursor-pointer group",
                selectedTaskId === task.id 
                  ? "bg-white border-[#1890ff] shadow-md ring-1 ring-[#1890ff]/10" 
                  : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={cn(
                  "text-xs font-bold truncate pr-2",
                  selectedTaskId === task.id ? "text-[#1890ff]" : "text-gray-800"
                )}>{task.title}</h3>
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded shrink-0",
                  task.status === '已完成' ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"
                )}>{task.status}</span>
              </div>
              <div className="space-y-1 text-[10px] text-gray-400">
                <div className="flex justify-between">
                  <span>话术模板:</span>
                  <span className="text-gray-600">{task.template}</span>
                </div>
                <div className="flex justify-between">
                  <span>账号:</span>
                  <span className="text-gray-600">{task.account}</span>
                </div>
                <div className="flex justify-between">
                  <span>创建时间:</span>
                  <span className="text-gray-600">{task.time}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-50 mt-1">
                  <span>进度:</span>
                  <span className="text-[#1890ff] font-bold">{task.progress}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: Task Analysis */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Analysis Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-800">{selectedTask.title}</h2>
            <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-500 rounded font-medium">已完成</span>
          </div>
          <div className="flex items-center gap-3">
            <SvgCopyButton targetId="task-analysis-content" />
            <button className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded text-sm hover:bg-gray-50 transition-colors">
              更多
            </button>
          </div>
        </div>

        {/* Analysis Tabs */}
        <div className="px-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-8">
            {['进行中列表', '已完成列表', '任务分析'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveAnalysisTab(tab === '进行中列表' ? 'ongoing' : tab === '已完成列表' ? 'completed' : 'analysis')}
                className={cn(
                  "py-3 text-sm font-medium border-b-2 transition-all",
                  (activeAnalysisTab === 'ongoing' && tab === '进行中列表') ||
                  (activeAnalysisTab === 'completed' && tab === '已完成列表') ||
                  (activeAnalysisTab === 'analysis' && tab === '任务分析')
                    ? "text-[#1890ff] border-[#1890ff]" 
                    : "text-gray-500 border-transparent hover:text-gray-700"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Analysis Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30" id="task-analysis-content">
          {activeAnalysisTab === 'analysis' ? (
            <>
              {/* Quality Inspection Summary */}
              <QualitySummaryCard total={QUALITY_SUMMARY_DATA.total} issues={QUALITY_SUMMARY_DATA.issues} />

              {/* Daily Detailed Data Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800">每日明细数据明细</h3>
                  <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                    <Download size={14} />
                    导出报表
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-400 border-b border-gray-100">
                        <th className="px-6 py-4 font-medium flex items-center gap-1">日期 <ChevronDown size={12} /></th>
                        <th className="px-6 py-4 font-medium">拨打总数</th>
                        <th className="px-6 py-4 font-medium flex items-center gap-1 text-blue-500">有效号码接通数 <ChevronDown size={12} /></th>
                        <th className="px-6 py-4 font-medium">接通率</th>
                        <th className="px-6 py-4 font-medium flex items-center gap-1 text-emerald-500">有效接通率 <Info size={12} /> <ChevronDown size={12} /></th>
                        <th className="px-6 py-4 font-medium text-red-500">未接总数</th>
                        <th className="px-6 py-4 font-medium">无效号码</th>
                        <th className="px-6 py-4 font-medium flex items-center gap-1">有效号码未接数 <Info size={12} /></th>
                        <th className="px-6 py-4 font-medium flex items-center gap-1 text-red-500">意向用户 (人) <ChevronDown size={12} /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {DAILY_DATA.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-800">{row.date}</td>
                          <td className="px-6 py-4 text-gray-500">{row.total}</td>
                          <td className="px-6 py-4 font-bold text-blue-500">{row.connected}</td>
                          <td className="px-6 py-4 text-gray-500">{row.rate}</td>
                          <td className="px-6 py-4 font-bold text-emerald-500">{row.effectiveRate}</td>
                          <td className="px-6 py-4 font-bold text-red-500">{row.missed}</td>
                          <td className="px-6 py-4 text-gray-500">{row.invalid}</td>
                          <td className="px-6 py-4 text-gray-500">{row.active}</td>
                          <td className="px-6 py-4 font-bold text-red-500">{row.users}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-8 py-4 flex items-center justify-between text-xs text-gray-400">
                  <span>共 400 条</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span>20条/页</span>
                      <ChevronDown size={12} />
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={14} /></button>
                      <span className="w-6 h-6 bg-[#1890ff] text-white flex items-center justify-center rounded">1</span>
                      <span>...</span>
                      <span>3</span>
                      <span>4</span>
                      <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={14} /></button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>前往</span>
                      <input type="text" value="4" className="w-8 h-6 border border-gray-200 rounded text-center outline-none" readOnly />
                      <span>页</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 py-20">
              <div className="text-center">
                <List size={48} className="mx-auto mb-4 opacity-20" />
                <p>列表内容开发中...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
