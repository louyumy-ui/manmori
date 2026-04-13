import React, { useState } from 'react';
import { 
  Search, Plus, RotateCcw, ChevronDown, MoreHorizontal, 
  Phone, PhoneCall, PhoneForwarded, PhoneMissed, Clock, 
  MessageSquare, BarChart3, List, Settings, Calendar,
  TrendingUp, Users, ShieldCheck, Download, Filter,
  ArrowRight, Info, CheckCircle2, AlertCircle, X,
  ChevronRight, ChevronLeft
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { cn } from '../lib/utils';
import { SvgCopyButton } from './SvgCopyButton';
import { 
  TASKS, 
  CONNECTION_RATE_DATA, 
  DURATION_DATA, 
  TREND_DATA, 
  REACH_TREND_DATA, 
  QUALITY_TREND_DATA, 
  FOCUS_POINTS, 
  DAILY_DATA, 
  QUALITY_SUMMARY_DATA,
  SCRIPTS_MOCK
} from '../data/mockData';

const QualitySummaryCard = ({ total, issues }: { total: number, issues: any[] }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
        <ShieldCheck size={18} className="text-[#1890ff]" />
        质检结果汇总
      </h3>
      <div className="text-xs text-gray-400">
        总任务：<span className="font-bold text-gray-800">共 {total} 条</span>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6">
      {issues.map((issue, idx) => {
        const percentage = ((issue.count / total) * 100).toFixed(1);
        return (
          <div key={idx} className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-800">{issue.name}</span>
              <span className="text-xs text-gray-400">共 {issue.count} 条，占总任务的 {percentage}%</span>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 flex items-center justify-between px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <span className="text-[10px]">已处理</span>
                <span className="text-sm font-bold">{issue.processed} 条</span>
              </div>
              <div className="flex-1 flex items-center justify-between px-3 py-2 bg-red-50 text-red-600 rounded-lg">
                <span className="text-[10px]">未处理</span>
                <span className="text-sm font-bold">{issue.unprocessed} 条</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export const SystemManagement: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'task' | 'script'>('task');
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'ongoing' | 'completed' | 'analysis'>('analysis');
  const [selectedTaskId, setSelectedTaskId] = useState('5');
  const [selectedScriptId, setSelectedScriptId] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedTask = TASKS.find(t => t.id === selectedTaskId) || TASKS[0];
  const selectedScript = SCRIPTS_MOCK.find(s => s.id === selectedScriptId) || SCRIPTS_MOCK[0];

  return (
    <div className="flex-1 flex flex-col bg-[#f0f2f5] overflow-hidden" id="system-management-page">
      {/* Top Tab Bar */}
      <div className="bg-white border-b border-gray-200 px-6 shrink-0 z-20">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setActiveSubTab('task')}
            className={cn(
              "py-4 text-sm font-medium border-b-2 transition-all relative",
              activeSubTab === 'task' ? "text-[#1890ff] border-[#1890ff]" : "text-gray-500 border-transparent hover:text-gray-700"
            )}
          >
            任务管理
          </button>
          <button 
            onClick={() => setActiveSubTab('script')}
            className={cn(
              "py-4 text-sm font-medium border-b-2 transition-all relative",
              activeSubTab === 'script' ? "text-[#1890ff] border-[#1890ff]" : "text-gray-500 border-transparent hover:text-gray-700"
            )}
          >
            话术管理
          </button>
        </div>
      </div>

      {activeSubTab === 'task' ? (
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
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: Script List */}
          <div className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer hover:text-[#1890ff]">
                  <span>全部话术</span>
                  <ChevronDown size={14} />
                </div>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="刷新">
                  <RotateCcw size={14} className="text-gray-400" />
                </button>
              </div>
              <button className="w-full py-2 bg-[#1890ff] text-white rounded text-sm font-medium hover:bg-[#40a9ff] transition-colors shadow-sm">
                新建话术
              </button>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="搜索话术名称" 
                  className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#1890ff]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
              {SCRIPTS_MOCK.map(script => (
                <div 
                  key={script.id}
                  onClick={() => setSelectedScriptId(script.id)}
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer group",
                    selectedScriptId === script.id 
                      ? "bg-white border-[#1890ff] shadow-md ring-1 ring-[#1890ff]/10" 
                      : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={cn(
                      "text-xs font-bold truncate pr-2",
                      selectedScriptId === script.id ? "text-[#1890ff]" : "text-gray-800"
                    )}>{script.title}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded shrink-0">{script.type}</span>
                  </div>
                  <div className="space-y-1 text-[10px] text-gray-400">
                    <div className="flex justify-between">
                      <span>版本:</span>
                      <span className="text-gray-600">{script.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>更新时间:</span>
                      <span className="text-gray-600">{script.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content: Script Analysis */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Script Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-800">{selectedScript.title}</h2>
                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-500 rounded font-medium">{selectedScript.version}</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded text-sm hover:bg-gray-50 transition-colors">
                  编辑话术
                </button>
                <button className="px-4 py-1.5 bg-[#1890ff] text-white rounded text-sm font-medium hover:bg-[#40a9ff] transition-colors">
                  发布版本
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/30">
              {/* Quality Inspection Summary */}
              <QualitySummaryCard total={QUALITY_SUMMARY_DATA.total} issues={QUALITY_SUMMARY_DATA.issues} />

            {/* Task Results Depth Analysis (Moved from Task Management) */}
            <div className="pt-8 border-t border-gray-200 space-y-8">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="text-[#1890ff]" />
                话术成果深度分析
              </h2>

              {/* Top Metrics Row */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      话术成果
                    </div>
                    <div className="flex items-end gap-2 mb-6">
                      <span className="text-4xl font-bold text-gray-900">361</span>
                      <span className="text-sm text-gray-400 mb-1">意向用户 (人)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-400">明确拒绝</span>
                        <span className="font-bold text-gray-800">33 人</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-400">未正面答复</span>
                        <span className="font-bold text-gray-800">128 人</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-400">挂机</span>
                        <span className="font-bold text-gray-800">20 人</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-400">非本人</span>
                        <span className="font-bold text-gray-800">15 人</span>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                      <span className="text-[10px] text-gray-300">更新于 10:24</span>
                      <button className="text-[10px] text-[#1890ff] font-bold flex items-center gap-1">查看详情 <ChevronRight size={10} /></button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      触达效率
                    </div>
                    <div className="flex items-end gap-2 mb-6">
                      <span className="text-4xl font-bold text-gray-900">78.1%</span>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1">
                        接通率 (有效号码)
                        <Info size={10} />
                      </div>
                    </div>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">拨打总数</span>
                        <span className="font-bold text-gray-800">1,750</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">接通数 (有效号码)</span>
                        <span className="font-bold text-gray-800">1,066</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 flex items-center gap-1">未接数 (有效号码) <Info size={10} /></span>
                        <span className="font-bold text-gray-800">299</span>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                      <span className="text-[10px] text-gray-300">更新于 10:24</span>
                      <button className="text-[10px] text-[#1890ff] font-bold flex items-center gap-1">未接通列表 <ChevronRight size={10} /></button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      号码质量
                    </div>
                    <div className="flex items-end gap-2 mb-6">
                      <span className="text-4xl font-bold text-orange-500">385</span>
                      <span className="text-sm text-gray-400 mb-1">/ 1,750 (22.0%) 无效号码</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>无效号码构成</span>
                        <div className="flex gap-3">
                          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> 空号 231</span>
                          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-800" /> 停机 116</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-50 rounded-full overflow-hidden flex">
                        <div className="h-full bg-orange-400 w-[60%]" />
                        <div className="h-full bg-slate-800 w-[40%]" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400 flex items-center gap-1">有效号码 <Info size={10} /></span>
                        <span className="text-xs font-bold text-gray-800">1,365 <span className="text-[10px] font-normal text-gray-400">/ 1,750 (78.0%)</span></span>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                      <span className="text-[10px] text-gray-300">更新于 10:24</span>
                      <button className="text-[10px] text-[#1890ff] font-bold flex items-center gap-1">导出无效号码 <ChevronRight size={10} /></button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trend Charts */}
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <Users size={18} className="text-emerald-500" />
                      话术成果趋势分析 (参加)
                    </h3>
                    <div className="flex items-center gap-6 text-[10px]">
                      <span className="flex items-center gap-1.5 text-gray-400"><div className="w-2 h-2 rounded-full bg-emerald-500" /> 意向用户量</span>
                      <span className="flex items-center gap-1.5 text-gray-400"><div className="w-2 h-2 rounded-full bg-emerald-300" /> 在院内用餐</span>
                      <span className="flex items-center gap-1.5 text-gray-400"><div className="w-2 h-2 rounded-full bg-emerald-100" /> 确认预约时间</span>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={TREND_DATA} barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                          cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                        <Bar dataKey="dining" fill="#6ee7b7" radius={[4, 4, 0, 0]} barSize={12} />
                        <Bar dataKey="time" fill="#d1fae5" radius={[4, 4, 0, 0]} barSize={12} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <TrendingUp size={18} className="text-blue-500" />
                      触达效率趋势分析
                    </h3>
                    <div className="flex items-center gap-6 text-[10px]">
                      <span className="flex items-center gap-1.5 text-gray-400"><div className="w-2 h-2 rounded-full bg-blue-500" /> 接通率(有效号码)</span>
                      <span className="flex items-center gap-1.5 text-gray-400"><div className="w-2 h-2 rounded-full bg-blue-300" /> 拨打总数</span>
                      <span className="flex items-center gap-1.5 text-gray-400"><div className="w-2 h-2 rounded-full bg-blue-100" /> 有效号码接通数</span>
                      <span className="flex items-center gap-1.5 text-gray-400"><div className="w-2 h-2 rounded-full bg-indigo-200" /> 有效号码未接数</span>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={REACH_TREND_DATA}>
                        <defs>
                          <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="rate" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRate)" strokeWidth={2} />
                        <Bar dataKey="total" fill="#93c5fd" radius={[2, 2, 0, 0]} barSize={8} />
                        <Bar dataKey="effective" fill="#bfdbfe" radius={[2, 2, 0, 0]} barSize={8} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-orange-500" />
                      号码质量趋势分析
                    </h3>
                    <div className="flex items-center gap-6 text-[10px]">
                      <span className="flex items-center gap-1.5 text-gray-400"><div className="w-2 h-2 rounded-full bg-orange-500" /> 无效号码号码号码</span>
                      <span className="flex items-center gap-1.5 text-gray-400"><div className="w-2 h-2 rounded-full bg-orange-300" /> 有效话号</span>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={QUALITY_TREND_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                        <Tooltip />
                        <Bar dataKey="invalid" fill="#f97316" radius={[4, 4, 0, 0]} barSize={12} />
                        <Bar dataKey="active" fill="#fdba74" radius={[4, 4, 0, 0]} barSize={12} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Focus Points Detailed */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800">客户关注点</h3>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[#1890ff] font-bold cursor-pointer">前十</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-400 cursor-pointer hover:text-gray-600">全部</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                  {FOCUS_POINTS.map((point, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{point.name}</span>
                        <span className="font-bold">{point.count}人</span>
                      </div>
                      <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", point.color)} style={{ width: `${(point.count / 5) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multi-level Perspective Detailed */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-800">工单标签多级透视</h3>
                  <Info size={14} className="text-gray-300" />
                  <span className="text-[10px] text-gray-400 font-normal">点击卡片可获取详情</span>
                </div>
                
                <div className="flex gap-4">
                  <div className="px-8 py-3 bg-blue-50 border-b-2 border-[#1890ff] text-center cursor-pointer rounded-t-lg">
                    <div className="text-sm text-[#1890ff] font-bold">参加体检</div>
                    <div className="text-xs text-[#1890ff]">128人 (73%)</div>
                  </div>
                  <div className="px-8 py-3 bg-gray-50 text-center cursor-pointer rounded-t-lg">
                    <div className="text-sm text-gray-400 font-bold">不参加</div>
                    <div className="text-xs text-gray-400">48人 (27%)</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: '在院内用餐', value: '90人', percent: '70%', color: 'border-orange-400 text-orange-500', barColor: 'bg-orange-400' },
                    { label: '确认预约时间', value: '128人', percent: '100%', color: 'border-blue-400 text-blue-500', barColor: 'bg-blue-400' },
                    { label: '知悉体检注意事项', value: '128人', percent: '100%', color: 'border-emerald-400 text-emerald-500', barColor: 'bg-emerald-400' },
                    { label: '其他需求', value: '15人', percent: '12%', color: 'border-purple-400 text-purple-500', barColor: 'bg-purple-400', tag: 'AI' },
                  ].map((item, idx) => (
                    <div key={idx} className={cn("p-4 border-t-2 rounded-lg bg-white shadow-sm space-y-4 relative group hover:shadow-md transition-all", item.color)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-800">{item.label}</span>
                          {item.tag && <span className="text-[8px] px-1 bg-purple-100 text-purple-500 rounded">{item.tag}</span>}
                        </div>
                        <ChevronRight size={12} className="text-gray-300 group-hover:text-gray-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] text-gray-400">用餐总需求</span>
                          <div className="text-right">
                            <span className="text-sm font-bold">{item.value}</span>
                            <span className="text-[10px] ml-1 opacity-70">占比 {item.percent}</span>
                          </div>
                        </div>
                        <div className="h-1 bg-gray-50 rounded-full overflow-hidden">
                          <div className={cn("h-full", item.barColor)} style={{ width: item.percent }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default SystemManagement;
