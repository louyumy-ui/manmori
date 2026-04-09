import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, X, ChevronDown, Play, Info, Filter, RotateCcw, Download, ChevronUp, History, UserPlus, Users, ShieldCheck, User, MessageSquare, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { SvgCopyButton } from './SvgCopyButton';

interface CapturedInfo {
  key: string;
  value: string;
}

interface ChatMessage {
  role: 'bot' | 'user';
  content: string;
}

interface QualityHit {
  type: '关键点' | '非关键点';
  issue: string;
  reason: string;
}

interface CallRecord {
  id: string;
  scriptName: string;
  taskName: string;
  phoneNumber: string;
  callTime: string;
  answerStatus: '已接' | '未接';
  phoneStatus: '呼叫成功' | '响铃未接' | '排队超时' | '号码挂断';
  duration: number; // seconds
  recordingUrl: string;
  dialogTags: string[];
  workOrderTags: string[];
  summary: string;
  source: '主动呼出' | '回拨呼入' | '其他呼入';
  transferToHuman: {
    triggered: boolean;
    number?: string;
    time?: string;
    result?: '转接成功' | '转接失败';
    failReason?: '号码格式错误' | '线路忙' | '无响应' | '排队超时';
  };
  // New fields for quality inspection
  qualityType: '关键点' | '非关键点' | '-';
  qualityIssue: string[];
  qualityHits: QualityHit[];
  status: '已处理' | '未处理';
  capturedInfo: CapturedInfo[];
  chatTranscript: ChatMessage[];
  creator: string;
  template: string;
  rounds: number;
  dialCount: number;
}

const INITIAL_RECORDS: CallRecord[] = [
  {
    id: '1',
    scriptName: '业务体验',
    taskName: '业务体验任务',
    phoneNumber: '188****4221',
    callTime: '2026-03-18 15:31:50',
    answerStatus: '已接',
    phoneStatus: '呼叫成功',
    duration: 98,
    recordingUrl: '#',
    dialogTags: ['参加'],
    workOrderTags: ['时间:周三', '早餐:不吃', '知悉所有事项:是', '其他需求:有糖尿病', '其他需求:体检前一天晚', '其他需求:水少喝一点', '其他需求:降糖药照常吃', '其他需求:带药盒或药名'],
    summary: '用户确认周三参加老年人免费体检，知晓空腹要求及降糖药使用注意事项，承诺携带身份证和药物信息',
    source: '主动呼出',
    transferToHuman: { triggered: false },
    qualityType: '关键点',
    qualityIssue: ['答非所问'],
    qualityHits: [
      { 
        type: '关键点', 
        issue: '答非所问', 
        reason: '工单记录用户表示“有糖尿病”，但通话中客户明确否认“不准确啊，我都没病”，工单信息与通话实况不符，属于捏造事实。' 
      }
    ],
    status: '未处理',
    creator: '运营-俊生',
    template: '广州健康通调研-普通话版-东漱社区医院',
    rounds: 2,
    dialCount: 1,
    capturedInfo: [
      { key: '中断原因', value: '非本人' },
      { key: '是否本人', value: '否' },
      { key: '居住地址确认', value: '' },
      { key: '本人病症', value: '无' },
      { key: '家属病症', value: '无' },
      { key: '本次服务', value: '未评价' },
      { key: '评价建议', value: '无' },
    ],
    chatTranscript: [
      { role: 'bot', content: '欸 你好！我们这边是东漱社区医院的，请问是梁军升本人嘛？' },
      { role: 'user', content: '我是小爱助理呀，你是有什么事吗？' },
      { role: 'bot', content: '那你认识梁军升吗？能不能代他回答几个问题呀？' },
    ]
  },
  {
    id: '2',
    scriptName: '老年人体检(未接重呼)(未接重呼)',
    taskName: '老年人体检任务',
    phoneNumber: '188****4221',
    callTime: '2026-03-18 15:30:00',
    answerStatus: '已接',
    phoneStatus: '呼叫成功',
    duration: 40,
    recordingUrl: '#',
    dialogTags: ['不参加'],
    workOrderTags: [],
    summary: '用户表示已做过体检，不参与本次免费体检',
    source: '主动呼出',
    transferToHuman: { triggered: false },
    qualityType: '非关键点',
    qualityIssue: ['重复追问'],
    qualityHits: [
      { 
        type: '非关键点', 
        issue: '重复追问', 
        reason: '用户明确否认“不准确啊，我都没病”，依旧继续追问，属于重复追问。' 
      }
    ],
    status: '已处理',
    creator: '运营-俊生',
    template: '广州健康通调研-普通话版-东漱社区医院',
    rounds: 1,
    dialCount: 1,
    capturedInfo: [
      { key: '是否本人', value: '是' },
      { key: '是否参加', value: '否' },
    ],
    chatTranscript: [
      { role: 'bot', content: '您好，这里是社区医院...' },
    ]
  },
  {
    id: '3',
    scriptName: '老年人体检(未接重呼)',
    taskName: '老年人体检任务',
    phoneNumber: '151****6125',
    callTime: '2026-03-18 15:21:04',
    answerStatus: '已接',
    phoneStatus: '呼叫成功',
    duration: 57,
    recordingUrl: '#',
    dialogTags: ['参加'],
    workOrderTags: ['时间:周一', '早餐:吃', '知悉所有事项:是'],
    summary: '用户预约周一体检，选择吃早餐并确认知悉空腹、禁水及带身份证要求',
    source: '主动呼出',
    transferToHuman: { triggered: false },
    qualityType: '-',
    qualityIssue: [],
    qualityHits: [],
    status: '未处理',
    creator: '运营-俊生',
    template: '广州健康通调研-普通话版-东漱社区医院',
    rounds: 3,
    dialCount: 1,
    capturedInfo: [
      { key: '是否本人', value: '是' },
      { key: '预约时间', value: '周一' },
    ],
    chatTranscript: [
      { role: 'bot', content: '您好...' },
    ]
  }
];

export const CallRecords: React.FC = () => {
  const [records, setRecords] = useState<CallRecord[]>(INITIAL_RECORDS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<CallRecord | null>(null);
  const [historyNumber, setHistoryNumber] = useState<string | null>(null);
  const [isEditingWorkOrder, setIsEditingWorkOrder] = useState(false);
  const [tempWorkOrderTags, setTempWorkOrderTags] = useState<string[]>([]);
  const [bulkProcessModal, setBulkProcessModal] = useState<{ isOpen: boolean; issue: string | null }>({ isOpen: false, issue: null });
  const [viewMode, setViewMode] = useState<'list' | 'test'>('list');
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

  const canCreateTask = useMemo(() => {
    const selected = records.filter(r => selectedIds.includes(r.id));
    return selected.some(r => 
      r.answerStatus === '未接' || 
      r.phoneStatus === '排队超时' || 
      r.transferToHuman.result === '转接失败'
    );
  }, [selectedIds, records]);

  const handleCreateTask = () => {
    alert(`已将选中的 ${selectedIds.length} 条记录加入呼出任务队列`);
    setSelectedIds([]);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f0f2f5] overflow-hidden" id="call-records-page">
      {/* Breadcrumbs & Tabs */}
      <div className="bg-white border-b border-gray-200 shrink-0">
        <div className="px-6 py-2 flex items-center gap-2 text-xs text-gray-400">
          <History size={12} />
          <span>概览</span>
          <span>/</span>
          <span className="text-gray-900">通话详情</span>
        </div>
        <div className="px-6 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div 
              onClick={() => setViewMode('list')}
              className={cn(
                "px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors",
                viewMode === 'list' ? "text-[#1890ff] bg-[#e6f7ff] border-b-2 border-[#1890ff] font-medium" : "text-gray-500"
              )}
            >
              通话详情
            </div>
            <div 
              onClick={() => setViewMode('test')}
              className={cn(
                "px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors",
                viewMode === 'test' ? "text-[#1890ff] bg-[#e6f7ff] border-b-2 border-[#1890ff] font-medium" : "text-gray-500"
              )}
            >
              会话测试
            </div>
          </div>
          {viewMode === 'list' && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  if (selectedIds.length === 0) return;
                  setRecords(prev => prev.map(r => selectedIds.includes(r.id) ? { ...r, status: '已处理' } : r));
                  setSelectedIds([]);
                }}
                disabled={selectedIds.length === 0}
                className="text-xs bg-[#1890ff] text-white px-3 py-1 rounded disabled:opacity-50 hover:bg-[#40a9ff]"
              >
                批量处理
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 p-4 overflow-y-auto space-y-4">
        {viewMode === 'list' ? (
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
                <input type="text" placeholder="请输入接听状态" className="border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8 w-40" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 shrink-0">工单标签:</span>
                <input type="text" placeholder="请输入工单标签" className="border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8 w-40" />
              </div>
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
                <input type="text" placeholder="请输入迭代备注" className="border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-[#1890ff] h-8 w-40" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <button className="bg-[#1890ff] text-white px-6 py-1 rounded text-sm hover:bg-[#40a9ff] h-8">查询</button>
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
                  <th className="px-4 py-4 w-10">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.length === records.length}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-[#1890ff] focus:ring-[#1890ff]"
                    />
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800">话术名称</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800">任务名称</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800">号码</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800">呼叫来源</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800">通话时间</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800">接听状态</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800">号码状态</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800">通话时长(秒)</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800">转人工详情</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800">通话录音</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800">对话标签</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800">工单标签</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800">通话概要</th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800">
                    <div className="flex flex-col gap-2">
                      <span>质检</span>
                      <input 
                        type="text" 
                        placeholder="筛选" 
                        className="font-normal text-xs border border-gray-200 rounded px-1 py-0.5 outline-none focus:border-[#1890ff]"
                        value={filters.qualityType}
                        onChange={(e) => setFilters(prev => ({ ...prev, qualityType: e.target.value }))}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800">
                    <div className="flex flex-col gap-2">
                      <span>质检问题</span>
                      <input 
                        type="text" 
                        placeholder="筛选" 
                        className="font-normal text-xs border border-gray-200 rounded px-1 py-0.5 outline-none focus:border-[#1890ff]"
                        value={filters.qualityIssue}
                        onChange={(e) => setFilters(prev => ({ ...prev, qualityIssue: e.target.value }))}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800">
                    <div className="flex flex-col gap-2">
                      <span>工单状态</span>
                      <input 
                        type="text" 
                        placeholder="筛选" 
                        className="font-normal text-xs border border-gray-200 rounded px-1 py-0.5 outline-none focus:border-[#1890ff]"
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      />
                    </div>
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-gray-800 sticky right-0 bg-[#fafafa] shadow-[-2px_0_5px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col gap-2">
                      <span>操作</span>
                      <button 
                        onClick={() => {
                          if (selectedIds.length === 0) return;
                          setRecords(prev => prev.map(r => selectedIds.includes(r.id) ? { ...r, status: '已处理' } : r));
                          setSelectedIds([]);
                        }}
                        className="text-[10px] font-normal text-[#1890ff] hover:underline"
                      >
                        批量处理
                      </button>
                    </div>
                  </th>
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
                        className="text-sm text-[#1890ff] cursor-pointer hover:underline font-medium"
                      >
                        {record.phoneNumber}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded border",
                        record.source === '主动呼出' ? "bg-blue-50 text-blue-600 border-blue-100" : 
                        record.source === '回拨呼入' ? "bg-purple-50 text-purple-600 border-purple-100" : 
                        "bg-orange-50 text-orange-600 border-orange-100"
                      )}>
                        {record.source}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-500">{record.callTime}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        "text-sm",
                        record.answerStatus === '已接' ? "text-emerald-500" : "text-red-500"
                      )}>
                        {record.answerStatus}
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
                      {record.transferToHuman.triggered ? (
                        <div className="text-xs space-y-0.5">
                          <div className={cn(
                            "font-medium",
                            record.transferToHuman.result === '转接成功' ? "text-emerald-600" : "text-red-600"
                          )}>
                            {record.transferToHuman.result}
                            {record.transferToHuman.failReason && ` (${record.transferToHuman.failReason})`}
                          </div>
                          <div className="text-gray-400">号码: {record.transferToHuman.number}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button className="text-sm text-[#1890ff] hover:underline flex items-center gap-1">
                        <Play size={12} fill="currentColor" />
                        播放录音
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {record.dialogTags.map(tag => (
                          <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {record.workOrderTags.map(tag => (
                          <span key={tag} className="text-[10px] bg-blue-50 text-[#1890ff] px-1.5 py-0.5 rounded border border-blue-100">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs text-gray-500 max-w-[200px] line-clamp-2" title={record.summary}>
                        {record.summary}
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
                      <div className="flex flex-wrap gap-1">
                        {record.qualityIssue.map(issue => (
                          <span 
                            key={issue} 
                            onClick={() => setBulkProcessModal({ isOpen: true, issue })}
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded border cursor-pointer transition-colors",
                              record.status === '已处理' 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" 
                                : "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                            )}
                          >
                            {issue}
                          </span>
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
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setSelectedRecord(record)}
                          className="text-sm text-[#1890ff] hover:underline"
                        >
                          详情
                        </button>
                        <button 
                          onClick={() => {
                            setRecords(prev => prev.map(r => r.id === record.id ? { ...r, status: '已处理' } : r));
                          }}
                          className="text-sm text-[#1890ff] hover:underline"
                        >
                          处理
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
      </>
    ) : (
      /* Session Test View */
      <div className="bg-white rounded-sm shadow-sm flex flex-col h-full overflow-hidden" id="session-test-view">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setViewMode('list')} className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm">
              <ChevronLeft size={16} />
              返回
            </button>
            <div className="w-px h-4 bg-gray-200"></div>
            <h2 className="text-sm font-bold text-gray-800">会话测试--模型测试话术</h2>
          </div>
          <SvgCopyButton targetId="session-test-view" />
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: Config & Info */}
          <div className="w-[320px] border-r border-gray-100 flex flex-col overflow-y-auto p-6 space-y-8 bg-gray-50/30">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 shrink-0">手机号</span>
                <input 
                  type="text" 
                  placeholder="请填写测试手机号" 
                  value={testPhoneNumber}
                  onChange={(e) => setTestPhoneNumber(e.target.value)}
                  className="flex-1 border border-gray-200 rounded px-3 py-1.5 text-sm outline-none focus:border-[#1890ff]"
                />
              </div>
              <button className="w-20 bg-[#1890ff] text-white py-1.5 rounded text-sm hover:bg-[#40a9ff] ml-[52px]">拨打</button>
            </div>

            {/* Captured Info Details (Replicated from detail modal) */}
            <section className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Edit2 size={16} className="text-orange-500" />
                捕捉信息明细
              </h4>
              <div className="border border-gray-100 rounded overflow-hidden bg-white">
                <table className="w-full text-xs">
                  <tbody>
                    {INITIAL_RECORDS[0].capturedInfo.map((info, idx) => (
                      <tr key={idx} className="border-b border-gray-50 last:border-0">
                        <td className="w-1/2 p-2 bg-gray-50 text-gray-600 border-r border-gray-50 font-medium">{info.key}</td>
                        <td className="w-1/2 p-2 text-gray-700">{info.value || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Quality Hits (Replicated from detail modal) */}
            <section className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#1890ff]" />
                质检命中详情
              </h4>
              <div className="space-y-3">
                {INITIAL_RECORDS[0].qualityHits.map((hit, idx) => (
                  <div key={idx} className="p-3 bg-white rounded border border-gray-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded",
                        hit.type === '关键点' ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                      )}>
                        {hit.type}
                      </span>
                      <span className="text-[10px] text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                        {hit.issue}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      <span className="text-orange-600 font-medium">原因：</span>
                      {hit.reason}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-white relative">
            {/* Chat Header Options */}
            <div className="px-6 py-3 border-b border-gray-50 flex items-center justify-end gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span>是否展示推理结果:</span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="inference" defaultChecked className="text-[#1890ff]" />
                  <span className="text-[#1890ff]">展示</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="inference" className="text-[#1890ff]" />
                  <span>不展示</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <span>是否展示推理延迟:</span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="latency" defaultChecked className="text-[#1890ff]" />
                  <span className="text-[#1890ff]">展示</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="latency" className="text-[#1890ff]" />
                  <span>不展示</span>
                </label>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/20">
              {testMessages.map((msg, idx) => (
                <div key={idx} className={cn(
                  "flex gap-3 max-w-[80%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                    msg.role === 'bot' ? "bg-[#1890ff] text-white" : "bg-gray-200 text-gray-500"
                  )}>
                    {msg.role === 'bot' ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed shadow-sm border",
                    msg.role === 'bot' ? "bg-white text-gray-700 border-gray-100 rounded-tl-none" : "bg-[#1890ff] text-white border-[#1890ff] rounded-tr-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-100 shrink-0">
              <div className="relative">
                <textarea 
                  placeholder="请输入内容"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="w-full h-32 p-4 border border-gray-200 rounded-lg outline-none focus:border-[#1890ff] resize-none text-sm pr-20"
                />
                <button 
                  onClick={() => {
                    if (!testInput.trim()) return;
                    setTestMessages(prev => [...prev, { role: 'user', content: testInput }]);
                    setTestInput('');
                  }}
                  className="absolute right-4 bottom-4 bg-[#1890ff] text-white px-6 py-1.5 rounded text-sm hover:bg-[#40a9ff] transition-colors"
                >
                  发送
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </main>

      {/* Detail Modal */}
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
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">通话详情</h3>
                <div className="flex items-center gap-3">
                  <SvgCopyButton targetId="call-detail-modal" />
                  <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 flex overflow-hidden">
                {/* Left: Audio & Transcript */}
                <div className="flex-1 flex flex-col border-r border-gray-100 overflow-hidden">
                  {/* Audio Player */}
                  <div className="p-6 border-b border-gray-50">
                    <div className="bg-gray-50 rounded-full p-4 flex items-center gap-4">
                      <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1890ff]">
                        <Play size={20} fill="currentColor" />
                      </button>
                      <div className="flex-1 h-1 bg-gray-200 rounded-full relative">
                        <div className="absolute left-0 top-0 h-full w-1/3 bg-[#1890ff] rounded-full"></div>
                        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#1890ff] rounded-full shadow-sm"></div>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">0:00 / 0:19</span>
                      <div className="flex items-center gap-2 text-gray-400">
                        <RotateCcw size={16} className="cursor-pointer" />
                        <Download size={16} className="cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  {/* Transcript */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30 flex flex-col">
                    <div className="flex-1 space-y-6">
                      {selectedRecord.chatTranscript.map((msg, idx) => (
                        <div key={idx} className={cn(
                          "flex gap-3 max-w-[80%]",
                          msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}>
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            msg.role === 'bot' ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-600"
                          )}>
                            {msg.role === 'bot' ? <ShieldCheck size={18} /> : <User size={18} />}
                          </div>
                          <div className={cn(
                            "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                            msg.role === 'bot' ? "bg-white text-gray-700 rounded-tl-none" : "bg-[#1890ff] text-white rounded-tr-none"
                          )}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quality Inspection Hits at the bottom of transcript */}
                    {selectedRecord.qualityHits.length > 0 && (
                      <div className="mt-8 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <ShieldCheck size={16} className="text-[#1890ff]" />
                          <span className="text-sm font-bold text-gray-800">质检命中详情</span>
                        </div>
                        <div className="space-y-4">
                          {selectedRecord.qualityHits.map((hit, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "text-xs px-2 py-0.5 rounded",
                                  hit.type === '关键点' ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                                )}>
                                  {hit.type}
                                </span>
                                <span className="text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                  {hit.issue}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 bg-orange-50/50 p-3 rounded border border-orange-100/50 leading-relaxed">
                                <span className="text-orange-600 font-medium">命中原因：</span>
                                {hit.reason}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Sidebar */}
                <div className="w-[400px] overflow-y-auto p-6 space-y-8 bg-white">
                  {/* Outbound Info */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Download size={16} className="text-gray-400" />
                        外呼信息
                      </h4>
                      <button className="text-red-500 text-xs flex items-center gap-1 hover:underline">
                        <RotateCcw size={12} />
                        迭代备注
                      </button>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-gray-400">创建账号</span><span className="text-gray-700">{selectedRecord.creator}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">话术模板</span><span className="text-gray-700 text-right max-w-[200px]">{selectedRecord.template}</span></div>
                    </div>
                  </section>

                  {/* Customer Info */}
                  <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      客户信息
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400">客户手机</span>
                        <span className="text-sm font-medium text-gray-700">{selectedRecord.phoneNumber}</span>
                      </div>
                      <span className="text-xs bg-emerald-50 text-emerald-500 px-2 py-1 rounded border border-emerald-100">已接通</span>
                    </div>
                  </section>

                  {/* Call Record */}
                  <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <History size={16} className="text-gray-400" />
                      通话记录
                    </h4>
                    <div className="flex gap-2 mb-4">
                      <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[10px] rounded border border-gray-100">0分20秒</span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[10px] rounded border border-gray-100">对话2轮</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-gray-400">通话时间</span><span className="text-gray-700">{selectedRecord.callTime}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">拨打次数</span><span className="text-gray-700">{selectedRecord.dialCount}</span></div>
                    </div>
                  </section>

                  {/* Captured Info Details */}
                  <section>
                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Edit2 size={16} className="text-orange-500" />
                      捕捉信息明细
                    </h4>
                    <div className="border border-gray-100 rounded overflow-hidden">
                      <table className="w-full text-xs">
                        <tbody>
                          {selectedRecord.capturedInfo.map((info, idx) => (
                            <tr key={idx} className="border-b border-gray-50 last:border-0">
                              <td className="w-1/2 p-3 bg-gray-50 text-gray-600 border-r border-gray-50 font-medium">{info.key}</td>
                              <td className="w-1/2 p-0">
                                {isEditingWorkOrder ? (
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
    </div>
  );
};
