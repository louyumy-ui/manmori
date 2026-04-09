import React, { useState } from 'react';
import { ChevronLeft, Plus, Edit2, Eye, Search, X, ChevronRight, Settings, Info, Check, ArrowRight, MessageSquare, ShieldCheck, User, ChevronDown, Play, Bot, RotateCcw, Download, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { SvgCopyButton } from './SvgCopyButton';

interface Tag {
  id: string;
  name: string;
  type?: 'manual' | 'auto';
  options?: string[];
}

interface QualityNode {
  id: string;
  type: 'key' | 'non-key';
  atoms: string[];
  supplement: string;
}

interface ChatMessage {
  role: 'bot' | 'user';
  content: string;
}

interface ScriptConfigProps {
  onJumpToAtom?: () => void;
}

export const ScriptConfig: React.FC<ScriptConfigProps> = ({ onJumpToAtom }) => {
  const [activeTab, setActiveTab] = useState('call'); // 'sms', 'tag', 'test', 'call'
  const [testMessages, setTestMessages] = useState<ChatMessage[]>([
    { role: 'bot', content: '欸 你好！这里是东漱社区社区医院，请问是梁俊升本人嘛？' }
  ]);
  const [testInput, setTestInput] = useState('');
  const [activeL1, setActiveL1] = useState('1');
  const [activeL2, setActiveL2] = useState('2-2');
  
  // Quality Inspection State
  const [isEditingQuality, setIsEditingQuality] = useState(false);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [newNodeType, setNewNodeType] = useState<'key' | 'non-key'>('key');
  const [selectedAtoms, setSelectedAtoms] = useState<string[]>([]);
  const [atomSearchQuery, setAtomSearchQuery] = useState('');
  const [activeAtomCategory, setActiveAtomCategory] = useState('全部');
  const [personaText, setPersonaText] = useState('这是外呼机器人与用户的对话，请按照以下规则提取并整理信息。\n输出格式：热词：XXX, XXX\n示例热词：什么东西，不需要，哪位，什么事');
  const [tempPersonaText, setTempPersonaText] = useState(personaText);

  const atomCategories = ['全部', '逻辑类', '态度类', '业务类', '合规类'];
  const atomLibrary = [
    { name: '答非所问', category: '逻辑类' },
    { name: '回答脱离人设', category: '逻辑类' },
    { name: '意图识别有误', category: '逻辑类' },
    { name: '语气生硬', category: '态度类' },
    { name: '专业知识错误', category: '业务类' },
    { name: '敏感词汇', category: '合规类' },
    { name: '未按流程引导', category: '业务类' },
  ];

  const filteredAtoms = atomLibrary.filter(atom => {
    const matchesSearch = atom.name.includes(atomSearchQuery);
    const matchesCategory = activeAtomCategory === '全部' || atom.category === activeAtomCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInsertNode = (atomsToInsert?: string[], type?: 'key' | 'non-key') => {
    const atoms = atomsToInsert || selectedAtoms;
    if (atoms.length === 0) return;
    
    const typeLabel = (type || newNodeType) === 'key' ? '关键点' : '非关键点';
    // Create the tags to insert
    const insertionText = atoms.map(atom => `[${typeLabel}-${atom}]：`).join('\n');
    
    // Simple append for now, but in a real app we'd use cursor position
    setTempPersonaText(prev => {
      const separator = prev.endsWith('\n') || prev === '' ? '' : '\n';
      return prev + separator + insertionText;
    });
    
    if (!atomsToInsert) {
      setSelectedAtoms([]);
      setIsAddingNode(false);
    }
  };

  // Helper to remove a specific node line from text
  const removeNodeFromText = (fullMatch: string, isTemp = false) => {
    const setter = isTemp ? setTempPersonaText : setPersonaText;
    setter(prev => {
      // Remove the line containing this match
      const lines = prev.split('\n');
      const filteredLines = lines.filter(line => !line.includes(fullMatch));
      return filteredLines.join('\n');
    });
  };

  // Helper to render persona text with highlighted nodes
  const renderPersonaWithHighlights = (text: string, isClickable = false, isTemp = false) => {
    if (!text) return null;
    
    // Regex to match [Key/Non-Key-AtomName]：
    const parts = text.split(/(\[关键点-[^\]]+\]：|\[非关键点-[^\]]+\]：)/g);
    
    return parts.map((part, index) => {
      const isNode = part.startsWith('[关键点-') || part.startsWith('[非关键点-');
      if (isNode) {
        return (
          <span key={index} className="inline-flex items-center group relative">
            <span 
              onClick={() => isClickable && onJumpToAtom?.()}
              className={cn(
                "text-[#1890ff] font-bold",
                isClickable ? "cursor-pointer hover:underline" : ""
              )}
            >
              {part}
            </span>
            {isClickable && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeNodeFromText(part, isTemp);
                }}
                className="opacity-0 group-hover:opacity-100 ml-1 p-0.5 hover:bg-red-50 rounded text-red-400 transition-all"
                title="移除该质检点"
              >
                <X size={12} />
              </button>
            )}
          </span>
        );
      }
      return <span key={index} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  // Extract used atoms from text for bottom navigation
  const usedAtoms = React.useMemo(() => {
    const regex = /\[(关键点|非关键点)-([^\]]+)\]：/g;
    const matches: { type: 'key' | 'non-key', atom: string, fullMatch: string }[] = [];
    let match;
    while ((match = regex.exec(personaText)) !== null) {
      matches.push({
        type: match[1] === '关键点' ? 'key' : 'non-key',
        atom: match[2],
        fullMatch: match[0]
      });
    }
    return matches;
  }, [personaText]);

  return (
    <div className="flex-1 flex flex-col bg-[#f0f2f5] overflow-hidden" id="script-config-page">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 shrink-0">
        <div className="px-6 py-2 flex items-center gap-2 text-xs text-gray-400">
          <span>首页</span>
          <span>/</span>
          <div className="flex items-center gap-1 bg-[#e6f7ff] text-[#1890ff] px-2 py-0.5 rounded">
            <span>大模型话术</span>
            <X size={10} className="cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-600 hover:text-[#1890ff] transition-colors">
              <ChevronLeft size={20} />
              <span className="text-lg font-medium">返回</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">配置--XXX话术</h1>
          </div>
          
          {/* Tabs */}
          <div className="flex items-center gap-2">
            {[
              { id: 'sms', name: '短信配置' },
              { id: 'tag', name: '标签配置' },
              { id: 'test', name: '会话测试' },
              { id: 'call', name: '通话配置' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-2 rounded text-sm font-medium transition-all",
                  activeTab === tab.id 
                    ? "bg-[#1890ff] text-white shadow-md" 
                    : "text-gray-500 hover:bg-gray-100"
                )}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#1890ff] text-white px-4 py-2 rounded text-sm flex items-center gap-2 hover:bg-[#40a9ff] transition-colors">
            配置日志
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'tag' ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. 标签配置 */}
            <section className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-[#1890ff]"></div>
              <h2 className="font-bold text-gray-900">标签配置</h2>
              <span className="text-xs bg-blue-50 text-[#1890ff] px-2 py-0.5 rounded">收起</span>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">标签通话概要人设</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-[#1890ff] text-white rounded">编辑配置</button>
                <button className="px-3 py-1 text-xs border border-gray-200 text-gray-600 rounded">查看</button>
              </div>
            </div>
            <div className="text-sm text-gray-500">大模型：阿里千问--XXX</div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">标签体系</label>
              <div className="relative w-64">
                <select className="w-full border border-gray-200 rounded px-3 py-2 text-sm appearance-none bg-white">
                  <option>工单标签</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <div className="text-xs text-gray-400">逻辑说明：层级之间通过“包含关系”绑定。AI 按照 L1 → L2 → L3 的顺序进行推理。</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">标签人设描述</label>
              <textarea 
                className="w-full border border-gray-200 rounded p-3 text-sm h-24 bg-gray-50"
                defaultValue="外呼机器人通话标签规则：
通话内容归类为以下标签之一：${label}。
输出格式：标签：XXXX & 通话概要：XXXXX"
              />
            </div>

            {/* Tag Management UI */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              {/* L1 */}
              <div className="space-y-4">
                <div className="text-sm font-bold text-gray-900 flex items-center justify-between">
                  <span>对话标签 (L1)</span>
                </div>
                <div className="space-y-2">
                  <div className={cn(
                    "p-3 rounded border flex items-center justify-between cursor-pointer transition-all",
                    activeL1 === '1' ? "bg-[#1890ff] text-white border-[#1890ff]" : "bg-white text-gray-600 border-gray-200"
                  )} onClick={() => setActiveL1('1')}>
                    <span>参加体检</span>
                    <span className="text-lg">−</span>
                  </div>
                  <div className={cn(
                    "p-3 rounded border flex items-center justify-between cursor-pointer transition-all",
                    activeL1 === '2' ? "bg-[#1890ff] text-white border-[#1890ff]" : "bg-white text-gray-600 border-gray-200"
                  )} onClick={() => setActiveL1('2')}>
                    <span>不参加体检</span>
                    <span className="text-lg">+</span>
                  </div>
                  <button className="w-full py-3 border border-dashed border-[#1890ff] text-[#1890ff] rounded text-sm flex items-center justify-center gap-1">
                    <Plus size={14} />
                    <span>添加一级</span>
                  </button>
                </div>
              </div>

              {/* L2 */}
              <div className="space-y-4">
                <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span>二级标签 (工单 L2)</span>
                  <span className="text-xs font-normal text-gray-400">所属：参加体检</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded border border-gray-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">是否院内用餐</span>
                      <Plus size={14} className="text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                      <span>配置：手动</span>
                    </div>
                  </div>
                  <div className="p-3 rounded border border-[#1890ff] bg-[#e6f7ff] space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#1890ff] font-medium">预约时间</span>
                      <span className="text-[#1890ff] text-lg">−</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-[#1890ff]">
                        <div className="w-3 h-3 rounded-full border-2 border-[#1890ff] flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1890ff]"></div>
                        </div>
                        <span>手动</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <div className="w-3 h-3 rounded-full border border-gray-300"></div>
                        <span>自动(AI)</span>
                      </div>
                    </div>
                    {/* Connection Line */}
                    <div className="absolute -right-6 top-1/2 w-6 border-t-2 border-dashed border-blue-300"></div>
                  </div>
                  <div className="p-3 rounded border border-gray-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">知悉体检注意事项</span>
                      <Plus size={14} className="text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                      <span>配置：手动</span>
                    </div>
                  </div>
                  <div className="p-3 rounded border border-orange-200 bg-orange-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-orange-500 font-medium">其他需求</span>
                      <Plus size={14} className="text-orange-400" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-orange-400">
                      <div className="w-1 h-1 rounded-full bg-orange-400"></div>
                      <span>配置：自动 (AI)</span>
                    </div>
                  </div>
                  <button className="w-full py-3 border border-dashed border-[#1890ff] text-[#1890ff] rounded text-sm flex items-center justify-center gap-1">
                    <Plus size={14} />
                    <span>添加二级</span>
                  </button>
                </div>
              </div>

              {/* L3 */}
              <div className="space-y-4">
                <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span>三级标签 (明细 L3)</span>
                  <span className="text-xs font-normal text-gray-400">所属：预约时间</span>
                </div>
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">当前层级选项逻辑：</span>
                    <div className="flex border border-gray-200 rounded overflow-hidden">
                      <button className="px-3 py-1 text-xs bg-white text-gray-600">单选</button>
                      <button className="px-3 py-1 text-xs bg-[#1890ff] text-white">多选</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {['周一', '周二', '周三', '周四', '周五', '上午', '下午'].map((opt) => (
                      <div key={opt} className="bg-white border border-gray-200 rounded p-2 flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-0.5">
                            <div className="w-3 h-0.5 bg-gray-200"></div>
                            <div className="w-3 h-0.5 bg-gray-200"></div>
                          </div>
                          <span>{opt}</span>
                        </div>
                        <span className="text-gray-300">−</span>
                      </div>
                    ))}
                  </div>
                  <button className="text-[#1890ff] text-sm flex items-center gap-1">
                    <Plus size={14} />
                    <span>新增选项</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 质检【对内】 */}
        <section className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-[#1890ff]"></div>
              <h2 className="font-bold text-gray-900">质检【对内】</h2>
              <span className="text-xs bg-blue-50 text-[#1890ff] px-2 py-0.5 rounded">收起</span>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setTempPersonaText(personaText);
                    setIsEditingQuality(true);
                  }}
                  className="px-3 py-1 text-xs bg-[#1890ff] text-white rounded hover:bg-[#40a9ff] transition-colors"
                >编辑配置</button>
                <button className="px-3 py-1 text-xs border border-gray-200 text-gray-600 rounded">查看</button>
              </div>
            </div>
            <div className="text-sm text-gray-500">大模型：阿里千问--XXX</div>

            <div className="space-y-4">
              <div className="relative group">
                <div className="w-full border border-gray-200 rounded p-4 text-sm bg-gray-50 min-h-[120px] relative">
                  <div className="text-gray-700 leading-relaxed">
                    {renderPersonaWithHighlights(personaText, true, false)}
                  </div>
                  
                  {/* Add Node Button fixed in the persona bar area */}
                  <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setTempPersonaText(personaText);
                        setIsEditingQuality(true);
                        setIsAddingNode(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#1890ff] text-white rounded-full text-xs shadow-lg hover:bg-[#40a9ff] transition-all"
                    >
                      <Plus size={14} />
                      <span>添加节点</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Edit Quality Modal */}
              <AnimatePresence>
                {isEditingQuality && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsEditingQuality(false)}
                      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
                    >
                      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between" id="quality-edit-modal-header">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-gray-800">编辑 <span className="text-red-500">质检【对内】</span> 人设配置</h3>
                          <SvgCopyButton targetId="quality-edit-modal-content" />
                        </div>
                        <X size={20} className="text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => setIsEditingQuality(false)} />
                      </div>

                      <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]" id="quality-edit-modal-content">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center gap-4">
                            <label className="w-24 text-sm text-gray-500 text-right">模型厂商：</label>
                            <div className="relative flex-1">
                              <select className="w-full border border-gray-200 rounded px-3 py-2 text-sm appearance-none bg-white focus:border-[#1890ff] focus:outline-none">
                                <option>阿里</option>
                                <option>百度</option>
                                <option>腾讯</option>
                              </select>
                              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="w-24 text-sm text-gray-500 text-right">推理大模型：</label>
                            <div className="relative flex-1">
                              <select className="w-full border border-gray-200 rounded px-3 py-2 text-sm appearance-none bg-white focus:border-[#1890ff] focus:outline-none">
                                <option>qwen3-next-80b-a3b</option>
                                <option>qwen-max</option>
                                <option>qwen-plus</option>
                              </select>
                              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <label className="w-24 text-sm text-gray-500 text-right mt-2">人设：</label>
                            <div className="flex-1 space-y-4">
                              <div className="relative">
                                <div className="w-full border border-gray-200 rounded overflow-hidden focus-within:border-[#1890ff] transition-colors bg-white">
                                  <div className="relative">
                                    <textarea 
                                      value={tempPersonaText}
                                      onChange={(e) => setTempPersonaText(e.target.value)}
                                      className="w-full p-4 text-sm h-64 focus:outline-none leading-relaxed resize-none bg-transparent relative z-10"
                                      placeholder="请输入人设内容..."
                                    />
                                    {/* Highlighter Overlay for Textarea (Visual only) */}
                                    <div className="absolute inset-0 p-4 text-sm leading-relaxed pointer-events-none whitespace-pre-wrap text-transparent">
                                      {renderPersonaWithHighlights(tempPersonaText, false, true)}
                                    </div>
                                  </div>
                                </div>

                                <div className="absolute right-4 top-4">
                                  <button 
                                    onClick={() => setIsAddingNode(true)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-[#1890ff] text-white rounded-full text-xs shadow-lg hover:bg-[#40a9ff] transition-all"
                                  >
                                    <Plus size={14} />
                                    <span>选择类型</span>
                                  </button>
                                </div>
                              </div>

                              {/* Add Node Sub-Modal */}
                              <AnimatePresence>
                                {isAddingNode && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="border border-blue-200 bg-blue-50 rounded-lg p-4 space-y-4 shadow-inner"
                                  >
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-sm font-bold text-gray-900">配置质检节点</h4>
                                      <X size={16} className="text-gray-400 cursor-pointer" onClick={() => setIsAddingNode(false)} />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-4">
                                      <div className="space-y-2">
                                        <span className="text-xs text-gray-500">节点类型：</span>
                                        <div className="flex gap-2">
                                          <button 
                                            onClick={() => setNewNodeType('key')}
                                            className={cn(
                                              "flex-1 px-3 py-1.5 rounded text-xs transition-all font-medium",
                                              newNodeType === 'key' ? "bg-red-500 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200"
                                            )}
                                          >关键点</button>
                                          <button 
                                            onClick={() => setNewNodeType('non-key')}
                                            className={cn(
                                              "flex-1 px-3 py-1.5 rounded text-xs transition-all font-medium",
                                              newNodeType === 'non-key' ? "bg-blue-500 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200"
                                            )}
                                          >非关键点</button>
                                        </div>
                                      </div>

                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-100">
                                          <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold text-gray-700">原子库筛选</span>
                                            <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
                                              {atomCategories.map(cat => (
                                                <button
                                                  key={cat}
                                                  onClick={() => setActiveAtomCategory(cat)}
                                                  className={cn(
                                                    "px-2 py-1 rounded text-[10px] transition-all",
                                                    activeAtomCategory === cat 
                                                      ? "bg-[#e6f7ff] text-[#1890ff] font-bold" 
                                                      : "text-gray-500 hover:bg-gray-50"
                                                  )}
                                                >
                                                  {cat}
                                                </button>
                                              ))}
                                            </div>
                                          </div>
                                          <div className="relative">
                                            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input 
                                              type="text"
                                              value={atomSearchQuery}
                                              onChange={(e) => setAtomSearchQuery(e.target.value)}
                                              placeholder="搜索原子..."
                                              className="pl-7 pr-8 py-1.5 border border-gray-200 rounded text-[10px] focus:outline-none focus:border-[#1890ff] w-40"
                                            />
                                            {atomSearchQuery && (
                                              <X 
                                                size={10} 
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600" 
                                                onClick={() => setAtomSearchQuery('')}
                                              />
                                            )}
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-100 rounded bg-gray-50/30">
                                          {filteredAtoms.map(atom => {
                                            const isSelected = selectedAtoms.includes(atom.name);
                                            return (
                                              <button
                                                key={atom.name}
                                                onClick={() => {
                                                  if (isSelected) {
                                                    setSelectedAtoms(selectedAtoms.filter(a => a !== atom.name));
                                                  } else {
                                                    setSelectedAtoms([...selectedAtoms, atom.name]);
                                                  }
                                                }}
                                                className={cn(
                                                  "px-3 py-2 rounded text-xs transition-all border flex items-center justify-between group",
                                                  isSelected 
                                                    ? "bg-white border-[#1890ff] text-[#1890ff] shadow-sm" 
                                                    : "bg-white border-gray-100 text-gray-600 hover:border-gray-300"
                                                )}
                                              >
                                                <span className="truncate">{atom.name}</span>
                                                {isSelected ? (
                                                  <Check size={12} className="shrink-0" />
                                                ) : (
                                                  <div className="w-3 h-3 rounded-sm border border-gray-200 group-hover:border-gray-300 shrink-0" />
                                                )}
                                              </button>
                                            );
                                          })}
                                          {filteredAtoms.length === 0 && (
                                            <div className="col-span-3 text-center py-8 text-xs text-gray-400 italic">未找到匹配原子</div>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                      <button 
                                        onClick={() => setIsAddingNode(false)}
                                        className="px-4 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded"
                                      >取消</button>
                                      <button 
                                        onClick={handleInsertNode}
                                        className="px-4 py-1.5 text-xs bg-[#1890ff] text-white rounded hover:bg-[#40a9ff] shadow-sm"
                                      >确认插入</button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                        <button 
                          onClick={() => setIsEditingQuality(false)}
                          className="px-6 py-2 text-sm border border-gray-300 text-gray-600 rounded hover:bg-gray-100 transition-colors"
                        >取消</button>
                        <button 
                          onClick={() => {
                            setPersonaText(tempPersonaText);
                            setIsEditingQuality(false);
                          }}
                          className="px-6 py-2 text-sm bg-[#1890ff] text-white rounded hover:bg-[#40a9ff] transition-colors shadow-md"
                        >确定</button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="搜索" 
                  className="w-64 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#1890ff]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">已选质检原子库 (点击跳转修改)</div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {usedAtoms.map((node, idx) => (
                  <div 
                    key={`${node.atom}-${idx}`} 
                    onClick={() => onJumpToAtom?.()}
                    className="bg-white rounded-lg p-4 border border-gray-200 space-y-2 hover:shadow-md hover:border-[#1890ff] transition-all cursor-pointer group relative"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{node.atom}</h3>
                      <ArrowRight size={14} className="text-gray-300 group-hover:text-[#1890ff] transition-all" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded",
                        node.type === 'key' ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                      )}>
                        {node.type === 'key' ? '关键点' : '非关键点'}
                      </span>
                    </div>
                  </div>
                ))}
                {usedAtoms.length === 0 && (
                  <div className="col-span-4 py-8 text-center text-gray-400 text-sm italic border border-dashed border-gray-200 rounded-lg">
                    暂未在人设正文中添加质检节点
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. 客户关注点人设配置 */}
        <section className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-[#1890ff]"></div>
              <h2 className="font-bold text-gray-900">客户关注点人设配置</h2>
              <span className="text-xs bg-blue-50 text-[#1890ff] px-2 py-0.5 rounded">收起</span>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-[#1890ff] text-white rounded">编辑配置</button>
                <button className="px-3 py-1 text-xs border border-gray-200 text-gray-600 rounded">查看</button>
              </div>
            </div>
            <div className="text-sm text-gray-500">大模型：阿里千问--XXX</div>

            <div className="space-y-2">
              <textarea 
                className="w-full border border-gray-200 rounded p-4 text-sm h-32 bg-gray-50"
                defaultValue="这是外呼机器人与用户的对话，请按照以下规则提取并整理信息。
输出格式：客户关注点：XXX，如“XXX”
示例：询问公司名称，如“我的什么公司没申报”..."
              />
            </div>
          </div>
        </section>
      </div>
    ) : activeTab === 'call' ? (
      <div className="flex-1 overflow-hidden flex flex-col bg-white">
        {/* Call Config View */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-end gap-3 bg-white shrink-0">
          <button className="px-6 py-1.5 bg-[#faad14] text-white rounded text-sm hover:bg-[#ffc53d] transition-colors">保存</button>
          <button className="px-6 py-1.5 bg-gray-200 text-gray-600 rounded text-sm hover:bg-gray-300 transition-colors">取消</button>
        </div>
        
        <div className="flex-1 overflow-hidden flex">
          {/* Left Column - Model & Params */}
          <div className="w-[45%] border-r border-gray-100 overflow-y-auto p-8 space-y-8">
            <div className="space-y-6">
              {/* Model Vendor */}
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-gray-600 text-right"><span className="text-red-500 mr-1">*</span>模型厂商</label>
                <div className="flex-1 relative">
                  <select className="w-full border border-gray-200 rounded px-3 py-2 text-sm appearance-none bg-white focus:border-[#1890ff] outline-none">
                    <option>阿里</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Model Name */}
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-gray-600 text-right"><span className="text-red-500 mr-1">*</span>模型名称</label>
                <div className="flex-1 relative">
                  <select className="w-full border border-gray-200 rounded px-3 py-2 text-sm appearance-none bg-white focus:border-[#1890ff] outline-none">
                    <option>qwen3-next-80b-a3b</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Param Config Toggle */}
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-gray-600 text-right"><span className="text-red-500 mr-1">*</span>参数配置</label>
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">关闭</span>
                    <div className="w-12 h-6 bg-[#1890ff] rounded-full relative cursor-pointer p-1">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                    </div>
                    <span className="text-sm text-[#1890ff]">开启</span>
                  </div>
                  <button className="text-xs text-red-400 bg-red-50 px-3 py-1 rounded border border-red-100">重置参数</button>
                </div>
              </div>

              {/* Sliders */}
              {[
                { label: '采样温度(temperature)', value: '0.70', min: 0, max: 1 },
                { label: '核采样概率阈值(top_p)', value: '0.80', min: 0, max: 1 },
                { label: '模型可以生成的最大 token 数量(max_tokens)', value: '1000', min: 1, max: 4000 },
                { label: '生成过程中采样候选集的大小(top_k)', value: '20', min: 1, max: 100 },
                { label: '模型生成时连续序列中的重复度(repetition_penalty)', value: '1.05', min: 1, max: 2 },
                { label: '控制模型生成文本时内容的重复度(presence_penalty)', value: '0.0', min: -2, max: 2 },
              ].map((param, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600 text-right flex items-center justify-end gap-1">
                    <span className="text-red-500">*</span>
                    <span className="truncate" title={param.label}>{param.label.split('(')[0]}</span>
                    <Info size={14} className="text-gray-300 shrink-0" />
                  </label>
                  <div className="flex-1 flex items-center gap-4">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full relative">
                      <div className="absolute left-0 top-0 h-full bg-[#1890ff] rounded-full" style={{ width: `${(parseFloat(param.value) / param.max) * 100}%` }}></div>
                      <div className="absolute w-4 h-4 bg-white border-2 border-[#1890ff] rounded-full top-1/2 -translate-y-1/2 shadow-sm" style={{ left: `${(parseFloat(param.value) / param.max) * 100}%` }}></div>
                    </div>
                    <div className="w-20 flex items-center border border-gray-200 rounded overflow-hidden">
                      <input type="text" value={param.value} readOnly className="w-full px-2 py-1 text-xs text-center outline-none" />
                      <div className="flex flex-col border-l border-gray-200">
                        <button className="px-1 hover:bg-gray-50"><ChevronUp size={10} /></button>
                        <button className="px-1 hover:bg-gray-50 border-t border-gray-200"><ChevronDown size={10} /></button>
                      </div>
                    </div>
                    <button className="bg-red-500 text-white text-xs px-3 py-1 rounded">关闭</button>
                  </div>
                </div>
              ))}

              {/* Switches */}
              {[
                { label: '允许打断', active: true },
                { label: '是否开启录音', active: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600 text-right"><span className="text-red-500 mr-1">*</span>{item.label}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">关闭</span>
                    <div className={cn("w-12 h-6 rounded-full relative cursor-pointer p-1 transition-colors", item.active ? "bg-[#1890ff]" : "bg-gray-200")}>
                      <div className={cn("w-4 h-4 bg-white rounded-full absolute transition-all", item.active ? "right-1" : "left-1")}></div>
                    </div>
                    <span className={cn("text-sm transition-colors", item.active ? "text-[#1890ff]" : "text-gray-400")}>开启</span>
                  </div>
                </div>
              ))}

              {/* More Sliders */}
              {[
                { label: '开场白语速调节', value: '1.00' },
                { label: '对话语速调节', value: '1.00' },
                { label: '语音识别超时时长(毫秒)', value: '7000' },
                { label: '语音识别断句阈值(毫秒)', value: '800' },
              ].map((param, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600 text-right"><span className="text-red-500 mr-1">*</span>{param.label}</label>
                  <div className="flex-1 flex items-center gap-4">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full relative">
                      <div className="absolute left-0 top-0 h-full bg-[#1890ff] rounded-full w-1/2"></div>
                      <div className="absolute w-4 h-4 bg-white border-2 border-[#1890ff] rounded-full top-1/2 -translate-y-1/2 shadow-sm left-1/2"></div>
                    </div>
                    <div className="w-20 flex items-center border border-gray-200 rounded overflow-hidden">
                      <input type="text" value={param.value} readOnly className="w-full px-2 py-1 text-xs text-center outline-none" />
                      <div className="flex flex-col border-l border-gray-200">
                        <button className="px-1 hover:bg-gray-50"><ChevronUp size={10} /></button>
                        <button className="px-1 hover:bg-gray-50 border-t border-gray-200"><ChevronDown size={10} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Final Switches */}
              {[
                { label: '自动挂机设置', active: true },
                { label: '是否开启文本过滤', active: true },
                { label: '用户沉默转换', active: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600 text-right"><span className="text-red-500 mr-1">*</span>{item.label}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">关闭</span>
                    <div className={cn("w-12 h-6 rounded-full relative cursor-pointer p-1 transition-colors", item.active ? "bg-[#1890ff]" : "bg-gray-200")}>
                      <div className={cn("w-4 h-4 bg-white rounded-full absolute transition-all", item.active ? "right-1" : "left-1")}></div>
                    </div>
                    <span className={cn("text-sm transition-colors", item.active ? "text-[#1890ff]" : "text-gray-400")}>开启</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Script & Persona */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/30">
            {/* Opening Script */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-red-500">*</span>
                <span className="text-sm font-bold text-gray-800">开场白</span>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 rounded-full border-2 border-[#1890ff] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#1890ff]"></div>
                    </div>
                    <span className="text-sm text-[#1890ff] font-medium">语音合成</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:border-[#1890ff]"></div>
                    <span className="text-sm text-gray-500 group-hover:text-gray-700">文本录音</span>
                  </label>
                </div>
                <div className="relative">
                  <textarea 
                    className="w-full border border-gray-200 rounded-lg p-4 text-sm h-32 focus:border-[#1890ff] outline-none resize-none leading-relaxed"
                    defaultValue="欸 你好！这里是东漱社区社区医院，请问是梁俊升本人嘛？"
                  />
                  <button className="absolute right-4 top-4 text-gray-400 hover:text-[#1890ff] transition-colors">
                    <Play size={18} fill="currentColor" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-1.5 border border-[#1890ff] text-[#1890ff] rounded text-sm hover:bg-blue-50 transition-colors">添加变量</button>
                  <button className="px-4 py-1.5 bg-[#fff7e6] text-[#faad14] border border-[#ffe58f] rounded text-sm hover:bg-[#fff1b8] transition-colors">生成合成录音</button>
                </div>
              </div>
            </div>

            {/* Persona */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-red-500">*</span>
                <span className="text-sm font-bold text-gray-800">人设</span>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-sm min-h-[400px]">
                <div className="text-sm text-gray-700 leading-loose space-y-4">
                  <p>称呼：严禁对客户使用“您”，一律改用“你”（锁定脚本内的“您”除外，必须原封不动）。</p>
                  <p>限字：单次回复严禁超过 50 字。</p>
                  <p>姓氏：严禁主动提姓氏。仅当被问“你贵姓？”时，回答：“我姓林，你叫我林医生就行。”</p>
                  <p>禁区：禁止提及“服务、上门、随访、送货、年长照顾”。除了核对地址不一致，禁止主动提短信。</p>
                  <p>中断优先级：若客户质问或提问，必须用陈述句正面回答，回答完后立即停止，严禁在同一回复中接回刚才的问题或问下一题。</p>
                  <p>沟通流程（按 1-5 顺序执行，严禁回跳）</p>
                  <p>第一步：身份确认</p>
                  <p>话术：你好，请问是梁军升吗？</p>
                  <p>若确认身份，输出（#是否本人：是）并进入第二步。</p>
                  <p>若非本人但愿代答，进入代答模式（“你”变“梁军升”），输出（#是否本人：否-代答）。</p>
                  <p>第二步：标准五问（严格顺序）</p>
                  <p>核对意愿：你好，我们医院正在完善居民健康档案，方便现在跟你核对几个信息吗？</p>
                  <p>地址核对（锁定脚本，禁止缩减）：首先为了确保您健康档案归属的准确性，跟你核对下，现在还是住在${`{address}`}吗？</p>
                  <p>若不对（锁定脚本）：等下挂了电话我给你发个短信，你到时点进去填一下最新的地址就好啦。另外还想顺便问下，你平时有高血压或糖尿病这类慢性病吗？</p>
                  <p>本人病症：好嘞。另外外想问下，你平时有高血压或糖尿病这类慢性病吗？</p>
                  <p>家属病症：你的家里人例如爸爸妈妈、兄弟姐妹有类似的慢性病史吗？</p>
                </div>
                <button className="px-4 py-1.5 border border-[#1890ff] text-[#1890ff] rounded text-sm hover:bg-blue-50 transition-colors">添加变量</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : activeTab === 'test' ? (
      <div className="flex-1 overflow-hidden flex flex-col bg-white">
        {/* Session Test View (Simplified version of CallRecords test mode) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: Info */}
          <div className="w-[320px] border-r border-gray-100 flex flex-col overflow-y-auto p-6 space-y-8 bg-gray-50/30">
            <section className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Edit2 size={16} className="text-orange-500" />
                捕捉信息明细
              </h4>
              <div className="border border-gray-100 rounded overflow-hidden bg-white">
                <table className="w-full text-xs">
                  <tbody>
                    {[
                      { key: '是否本人', value: '是' },
                      { key: '预约时间', value: '周一' },
                    ].map((info, idx) => (
                      <tr key={idx} className="border-b border-gray-50 last:border-0">
                        <td className="w-1/2 p-2 bg-gray-50 text-gray-600 border-r border-gray-50 font-medium">{info.key}</td>
                        <td className="w-1/2 p-2 text-gray-700">{info.value || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#1890ff]" />
                质检命中详情
              </h4>
              <div className="space-y-3">
                {[
                  { type: '关键点', issue: '答非所问', reason: '用户询问体检时间，机器人未直接回答。' },
                ].map((hit, idx) => (
                  <div key={idx} className="p-3 bg-white rounded border border-gray-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-500">{hit.type}</span>
                      <span className="text-[10px] text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{hit.issue}</span>
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
            </div>

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
    ) : (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">模块开发中</h2>
          <p>当前选中的模块是: {activeTab}</p>
        </div>
      </div>
    )}
      </div>
      
      <div className="absolute top-4 right-4 z-50">
        <SvgCopyButton targetId="script-config-page" />
      </div>
    </div>
  );
};

export default ScriptConfig;
