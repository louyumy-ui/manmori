
// src/data/mockData.ts

// --- System Management Data ---

export const TASKS = [
  { id: '1', title: '测试对话标签显示逻辑', status: '已完成', template: '普通企业年报提醒(新测)', account: '张漫', time: '2026-03-31 16:14:33', progress: '1/1' },
  { id: '2', title: '年报', status: '已完成', template: '普通企业年报提醒(新测)', account: '张漫', time: '2026-03-27 16:19:33', progress: '2/2' },
  { id: '3', title: '年审测试', status: '已完成', template: '普通企业年报提醒(新测)', account: '张漫', time: '2026-03-27 16:11:03', progress: '2/2' },
  { id: '4', title: '任务', status: '已完成', template: '普通企业年报提醒(新测)', account: '张漫', time: '2026-03-25 14:16:26', progress: '1/1' },
  { id: '5', title: '测试', status: '已完成', template: '模型测试话术', account: '张漫', time: '2026-03-24 16:25:39', progress: '1/1' },
];

export const CONNECTION_RATE_DATA = [
  { name: '接通', value: 100 },
  { name: '未接通', value: 0 },
];

export const DURATION_DATA = [
  { name: '<=10 秒', value: 0 },
  { name: '11~60 秒', value: 100 },
  { name: '61~120 秒', value: 0 },
  { name: '>120 秒', value: 0 },
];

export const TREND_DATA = [
  { date: '03-01', users: 10, dining: 5, time: 2 },
  { date: '03-02', users: 85, dining: 40, time: 15 },
  { date: '03-03', users: 65, dining: 30, time: 10 },
  { date: '03-04', users: 90, dining: 45, time: 20 },
  { date: '03-05', users: 55, dining: 25, time: 12 },
  { date: '03-06', users: 80, dining: 35, time: 18 },
  { date: '03-07', users: 95, dining: 50, time: 25 },
];

export const REACH_TREND_DATA = [
  { date: '03-01', rate: 60, total: 250, effective: 150 },
  { date: '03-02', rate: 66.7, total: 240, effective: 160 },
  { date: '03-03', rate: 53.8, total: 260, effective: 140 },
  { date: '03-04', rate: 67.4, total: 230, effective: 155 },
  { date: '03-05', rate: 61.1, total: 270, effective: 165 },
  { date: '03-06', rate: 56.9, total: 255, effective: 145 },
  { date: '03-07', rate: 61.6, total: 245, effective: 151 },
];

export const QUALITY_TREND_DATA = [
  { date: '03-01', invalid: 55, active: 1365 },
  { date: '03-02', invalid: 50, active: 1365 },
  { date: '03-03', invalid: 60, active: 1365 },
  { date: '03-04', invalid: 45, active: 1365 },
  { date: '03-05', invalid: 65, active: 1365 },
  { date: '03-06', invalid: 55, active: 1365 },
  { date: '03-07', invalid: 39, active: 1365 },
];

export const FOCUS_POINTS = [
  { name: '询问电费金额', count: 5, color: 'bg-blue-500' },
  { name: '询问是否是骗子', count: 3, color: 'bg-cyan-400' },
  { name: '体检项目咨询', count: 2, color: 'bg-emerald-400' },
  { name: '报告领取方式', count: 2, color: 'bg-indigo-400' },
  { name: '交通路线咨询', count: 1, color: 'bg-blue-400' },
  { name: '停车位咨询', count: 1, color: 'bg-orange-400' },
  { name: '用餐环境询问', count: 1, color: 'bg-red-400' },
  { name: '其他咨询', count: 1, color: 'bg-gray-400' },
  { name: '投诉建议', count: 1, color: 'bg-slate-400' },
  { name: '合作咨询', count: 1, color: 'bg-sky-400' },
];

export const DAILY_DATA = [
  { date: '03-01', total: 250, connected: 150, rate: '60%', effectiveRate: '76.9%', missed: 100, invalid: 55, active: 45, users: 98 },
  { date: '03-02', total: 240, connected: 160, rate: '66.7%', effectiveRate: '84.2%', missed: 80, invalid: 50, active: 30, users: 105 },
  { date: '03-03', total: 260, connected: 140, rate: '53.8%', effectiveRate: '70%', missed: 120, invalid: 60, active: 60, users: 92 },
  { date: '03-04', total: 230, connected: 155, rate: '67.4%', effectiveRate: '83.8%', missed: 75, invalid: 45, active: 30, users: 112 },
  { date: '03-05', total: 270, connected: 165, rate: '61.1%', effectiveRate: '80.5%', missed: 105, invalid: 65, active: 40, users: 88 },
  { date: '03-06', total: 255, connected: 145, rate: '56.9%', effectiveRate: '72.5%', missed: 110, invalid: 55, active: 55, users: 100 },
  { date: '03-07', total: 245, connected: 151, rate: '61.6%', effectiveRate: '79.5%', missed: 94, invalid: 55, active: 39, users: 102 },
];

export const QUALITY_SUMMARY_DATA = {
  total: 1000,
  issues: [
    { name: '答非所问', count: 100, processed: 50, unprocessed: 50 },
    { name: '意图识别有误', count: 100, processed: 70, unprocessed: 30 },
  ]
};

export const SCRIPTS_MOCK = [
  { id: '1', title: '普通企业年报提醒(新测)', type: '外呼', version: 'V1.2', time: '2026-03-31 16:14:33' },
  { id: '2', title: '模型测试话术', type: '外呼', version: 'V2.0', time: '2026-03-24 16:25:39' },
  { id: '3', title: '意向客户回访', type: '外呼', version: 'V1.0', time: '2026-03-20 10:11:03' },
  { id: '4', title: '活动通知话术', type: '外呼', version: 'V1.5', time: '2026-03-15 14:16:26' },
];

// --- Call Records Data ---

export interface CapturedInfo {
  key: string;
  value: string;
}

export interface ChatMessage {
  role: 'bot' | 'user';
  content: string;
}

export interface QualityHit {
  type: '关键点' | '非关键点';
  issue: string;
  reason: string;
}

export interface CallRecord {
  id: string;
  scriptName: string;
  taskName: string;
  phoneNumber: string;
  callTime: string;
  answerStatus: '已接听' | '未接听' | '排队超时' | '用户挂断';
  phoneStatus: '呼叫成功' | '响铃未接' | '排队超时' | '号码挂断';
  duration: number; // seconds
  recordingUrl: string;
  dialogTags: string[];
  workOrderTags: string[];
  summary: string;
  source: '主动呼出' | '回拨呼入' | '陌生呼入';
  transferToHuman: {
    triggered: boolean;
    number?: string;
    time?: string;
    result?: '转接成功' | '转接失败';
    failReason?: '号码格式错误' | '线路忙' | '无响应' | '排队超时';
  };
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

export const INITIAL_RECORDS: CallRecord[] = [
  {
    id: '1',
    scriptName: '业务体验',
    taskName: '业务体验任务',
    phoneNumber: '188****4221',
    callTime: '2026-03-18 15:31:50',
    answerStatus: '已接听',
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
    answerStatus: '未接听',
    phoneStatus: '响铃未接',
    duration: 40,
    recordingUrl: '#',
    dialogTags: ['不参加'],
    workOrderTags: [],
    summary: '用户表示已做过体检，不参与本次免费体检',
    source: '回拨呼入',
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
    answerStatus: '排队超时',
    phoneStatus: '排队超时',
    duration: 57,
    recordingUrl: '#',
    dialogTags: ['参加'],
    workOrderTags: ['时间:周一', '早餐:吃', '知悉所有事项:是'],
    summary: '用户预约周一体检，选择吃早餐并确认知悉空腹、禁水及带身份证要求',
    source: '陌生呼入',
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

// --- Evaluation Dimensions Data ---

export interface Dimension {
  id: string;
  name: string;
  category: string[];
  scriptCount: number;
  creator: string;
  createdAt: string;
  updatedAt: string;
  updater: string;
  status: boolean;
  description?: string;
  persona?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  usageCount: number;
}

export const CATEGORIES = ['医疗', '业务', '素质', '情感', '流程'];
export const STATUS_OPTIONS = ['全部', '启用', '停用'];

export const INITIAL_DATA: Dimension[] = [
  {
    id: '1',
    name: '客诉询问',
    category: ['流程', '业务'],
    scriptCount: 7,
    creator: '张经理',
    createdAt: '2024-03-01 14:20:05',
    updatedAt: '2024-03-01 14:20:05',
    updater: '张经理',
    status: true,
    description: '询问客人的投诉内容、标签、及入场描述',
    persona: '明确制定当前的话术标签。例如：必须包含“流程”（回访确认）...'
  },
  {
    id: '2',
    name: '流程完善',
    category: ['流程'],
    scriptCount: 17,
    creator: '李主管',
    createdAt: '2024-02-15 09:12:33',
    updatedAt: '2024-02-15 09:12:33',
    updater: '李主管',
    status: true,
  },
  {
    id: '3',
    name: '意图识别有误',
    category: ['业务'],
    scriptCount: 22,
    creator: '王老师',
    createdAt: '2024-03-02 16:45:12',
    updatedAt: '2024-03-02 16:45:12',
    updater: '王老师',
    status: false,
  }
];

export const INITIAL_TAGS: Tag[] = [
  { id: '1', name: '医疗', color: '#1890ff', usageCount: 12 },
  { id: '2', name: '业务', color: '#52c41a', usageCount: 45 },
  { id: '3', name: '素质', color: '#faad14', usageCount: 8 },
  { id: '4', name: '情感', color: '#f5222d', usageCount: 15 },
  { id: '5', name: '流程', color: '#722ed1', usageCount: 30 },
];

export interface QualityRerunRecord {
  id: string;
  scriptName: string;
  calledNumber: string;
  dimension: string;
  rerunCount: number;
  latestResult: '❌有问题' | '✅没问题';
  rerunTime: string;
  operator: string;
  status: '重跑中' | '已完成' | '重跑失败';
  reason?: string;
  context: ChatMessage[];
  problemRound: number;
  newAnswer?: string;
  personaVersion: string;
  qualityVersion: string;
}

export const QUALITY_RERUN_RECORDS: QualityRerunRecord[] = [
  {
    id: '1',
    scriptName: '业务体验',
    calledNumber: '188****4221',
    dimension: '答非所问',
    rerunCount: 2,
    latestResult: '✅没问题',
    rerunTime: '2026-04-13 10:30:00',
    operator: '运营-俊生',
    status: '已完成',
    reason: '重跑后AI正确识别了用户“我是小爱助理”的意图，并引导询问是否认识本人，逻辑正确。',
    problemRound: 1,
    newAnswer: '那你认识梁军升吗？能不能代他回答几个问题呀？',
    personaVersion: 'v1.2.3',
    qualityVersion: 'v2.1.0',
    context: [
      { role: 'bot', content: '欸 你好！我们这边是东漱社区医院的，请问是梁军升本人嘛？' },
      { role: 'user', content: '我是小爱助理呀，你是有什么事吗？' },
      { role: 'bot', content: '那你认识梁军升吗？能不能代他回答几个问题呀？' },
    ]
  },
  {
    id: '2',
    scriptName: '老年人体检',
    calledNumber: '151****6125',
    dimension: '幻觉',
    rerunCount: 1,
    latestResult: '❌有问题',
    rerunTime: '2026-04-13 10:35:00',
    operator: '运营-俊生',
    status: '重跑中',
    problemRound: 2,
    personaVersion: 'v1.2.3',
    qualityVersion: 'v2.0.5',
    context: [
      { role: 'bot', content: '您好，请问您周一有空参加体检吗？' },
      { role: 'user', content: '有空的，需要注意什么吗？' },
      { role: 'bot', content: '需要空腹24小时哦。' }, // Hallucination
    ]
  }
];

export const REVISION_LOGS = [
  {
    id: '1',
    operator: '运营-俊生',
    type: '修改了',
    version: 'v1.2.3',
    description: '语音合成开场白',
    oldData: '欸 你好！这里是...',
    newData: '欸 你好！这里是东漱社区...',
    time: '2026-04-03 15:12:06'
  },
  {
    id: '2',
    operator: '运营-俊生',
    type: '修改了',
    version: 'v1.2.2',
    description: '人设',
    oldData: '身份:桥中街道...',
    newData: '角色身份 你是...',
    time: '2026-04-03 15:11:56'
  },
  {
    id: '3',
    operator: '运营-俊生',
    type: '修改了',
    version: 'v1.2.1',
    description: '参数配置',
    oldData: '{"temperature": 0.7}',
    newData: '{"temperature": 0.8}',
    time: '2026-04-02 16:00:54'
  },
  {
    id: '4',
    operator: '运营-俊生',
    type: '修改了',
    version: 'v1.2.0',
    description: '模型配置模板',
    oldData: '开源-qwen3.5-fl...',
    newData: 'qwen3-next-80...',
    time: '2026-04-02 16:00:54'
  },
  {
    id: '5',
    operator: '运营-俊生',
    type: '修改了',
    version: 'v1.1.9',
    description: '参数配置',
    oldData: '{"temperature": 0.6}',
    newData: '{"temperature": 0.7}',
    time: '2026-03-25 14:14:53'
  },
  {
    id: '6',
    operator: '运营-俊生',
    type: '修改了',
    version: 'v1.1.8',
    description: '模型配置模板',
    oldData: '开源-qwen3.5-1...',
    newData: '开源-qwen3.5-fl...',
    time: '2026-03-25 14:14:24'
  },
  {
    id: '7',
    operator: '运营-俊生',
    type: '修改了',
    version: 'v1.1.7',
    description: '模型配置模板',
    oldData: '开源-qwen35-3...',
    newData: '开源-qwen3.5-1...',
    time: '2026-03-25 14:13:30'
  },
  {
    id: '8',
    operator: '运营-俊生',
    type: '修改了',
    version: 'v1.1.6',
    description: '模型配置模板',
    oldData: 'qwen3-next-80...',
    newData: '开源-qwen3.5-fl...',
    time: '2026-03-25 14:11:09'
  },
  {
    id: '9',
    operator: '运营-俊生',
    type: '修改了',
    version: 'v1.1.5',
    description: '语音合成开场白',
    oldData: '欸 你好！我们...',
    newData: '欸 你好！这里...',
    time: '2026-03-20 10:17:09'
  },
  {
    id: '10',
    operator: '运营-俊生',
    type: '修改了',
    version: 'v1.1.4',
    description: '人设',
    oldData: '身份:东漱社区...',
    newData: '身份:桥中街道...',
    time: '2026-03-20 10:17:09'
  },
  {
    id: '11',
    operator: '超级管理员',
    type: '修改了',
    version: 'v1.1.3',
    description: '模型配置模板',
    oldData: 'Moonshot-Kimi...',
    newData: 'qwen3-next-80...',
    time: '2026-03-16 11:46:36'
  },
  {
    id: '12',
    operator: '超级管理员',
    type: '修改了',
    version: 'v1.1.2',
    description: '参数配置',
    oldData: '{"temperature": 0.5}',
    newData: '{"temperature": 0.6}',
    time: '2026-03-16 11:46:36'
  }
];
