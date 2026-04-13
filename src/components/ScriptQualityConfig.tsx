import React from 'react';
import { Plus, Search, X, ChevronDown, ArrowRight, ShieldCheck, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { SvgCopyButton } from './SvgCopyButton';

interface ScriptQualityConfigProps {
  personaText: string;
  setPersonaText: (text: string) => void;
  tempPersonaText: string;
  setTempPersonaText: (text: string) => void;
  isEditingQuality: boolean;
  setIsEditingQuality: (val: boolean) => void;
  isAddingNode: boolean;
  setIsAddingNode: (val: boolean) => void;
  newNodeType: 'key' | 'non-key';
  setNewNodeType: (type: 'key' | 'non-key') => void;
  selectedAtoms: string[];
  setSelectedAtoms: (atoms: string[]) => void;
  atomSearchQuery: string;
  setAtomSearchQuery: (query: string) => void;
  activeAtomCategory: string;
  setActiveAtomCategory: (cat: string) => void;
  onJumpToAtom?: () => void;
}

export const ScriptQualityConfig: React.FC<ScriptQualityConfigProps> = ({
  personaText,
  setPersonaText,
  tempPersonaText,
  setTempPersonaText,
  isEditingQuality,
  setIsEditingQuality,
  isAddingNode,
  setIsAddingNode,
  newNodeType,
  setNewNodeType,
  selectedAtoms,
  setSelectedAtoms,
  atomSearchQuery,
  setAtomSearchQuery,
  activeAtomCategory,
  setActiveAtomCategory,
  onJumpToAtom
}) => {
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
    const insertionText = atoms.map(atom => `[${typeLabel}-${atom}]：`).join('\n');
    
    setTempPersonaText(prev => {
      const separator = prev.endsWith('\n') || prev === '' ? '' : '\n';
      return prev + separator + insertionText;
    });
    
    if (!atomsToInsert) {
      setSelectedAtoms([]);
      setIsAddingNode(false);
    }
  };

  const removeNodeFromText = (fullMatch: string, isTemp = false) => {
    const setter = isTemp ? setTempPersonaText : setPersonaText;
    setter(prev => {
      const lines = prev.split('\n');
      const filteredLines = lines.filter(line => !line.includes(fullMatch));
      return filteredLines.join('\n');
    });
  };

  const renderPersonaWithHighlights = (text: string, isClickable = false, isTemp = false) => {
    if (!text) return null;
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
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                                  <div className="absolute inset-0 p-4 text-sm leading-relaxed pointer-events-none whitespace-pre-wrap text-transparent" data-svg-copy-ignore="true">
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
                                      onClick={() => handleInsertNode()}
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
  );
};

const Check = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
