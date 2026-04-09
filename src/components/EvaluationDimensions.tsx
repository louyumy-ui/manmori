import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, X, ChevronDown, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { SvgCopyButton } from './SvgCopyButton';

interface Dimension {
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

interface Tag {
  id: string;
  name: string;
  color: string;
  usageCount: number;
}

const CATEGORIES = ['医疗', '业务', '素质', '情感', '流程'];
const STATUS_OPTIONS = ['全部', '启用', '停用'];

const INITIAL_DATA: Dimension[] = [
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

const INITIAL_TAGS: Tag[] = [
  { id: '1', name: '医疗', color: '#1890ff', usageCount: 12 },
  { id: '2', name: '业务', color: '#52c41a', usageCount: 45 },
  { id: '3', name: '素质', color: '#faad14', usageCount: 8 },
  { id: '4', name: '情感', color: '#f5222d', usageCount: 15 },
  { id: '5', name: '流程', color: '#722ed1', usageCount: 30 },
];

export const EvaluationDimensions: React.FC = () => {
  const [data, setData] = useState<Dimension[]>(INITIAL_DATA);
  const [tags, setTags] = useState<Tag[]>(INITIAL_TAGS);
  const [activeSubTab, setActiveSubTab] = useState<'dimension' | 'tag'>('dimension');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Dimension | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Dimension>>({
    name: '',
    category: ['流程'],
    description: '',
    persona: '',
    status: true
  });
  const [categorySearch, setCategorySearch] = useState('');

  const handleOpenModal = (item?: Dimension) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        category: ['流程'],
        description: '',
        persona: '',
        status: true
      });
    }
    setIsModalOpen(true);
    setIsCategoryDropdownOpen(false);
    setCategorySearch('');
  };

  const handleSave = () => {
    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...formData, updatedAt: new Date().toLocaleString() } as Dimension : item));
    } else {
      const newItem: Dimension = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || '',
        category: formData.category || ['流程'],
        scriptCount: 0,
        creator: '当前用户',
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        updater: '当前用户',
        status: formData.status ?? true,
        ...formData
      } as Dimension;
      setData(prev => [newItem, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deletingId) {
      setData(prev => prev.filter(item => item.id !== deletingId));
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const addCategoryTag = (tag: string) => {
    if (!formData.category?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        category: [...(prev.category || []), tag]
      }));
    }
    setCategorySearch('');
  };

  const removeCategoryTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category?.filter(c => c !== tag)
    }));
  };

  const renderDimensionTable = () => (
    <>
      {/* Filters - 12 Column Grid */}
      <div className="p-6 border-b border-gray-50">
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-2">
            <label className="block text-xs text-gray-400 mb-1">分类</label>
            <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-[#1890ff] bg-white h-9">
              <option value="全部">全部</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-gray-400 mb-1">创建者</label>
            <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-[#1890ff] bg-white h-9">
              <option value="全部">全部</option>
              <option value="张经理">张经理</option>
              <option value="李主管">李主管</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-gray-400 mb-1">最后更新人</label>
            <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-[#1890ff] bg-white h-9">
              <option value="全部">全部</option>
              <option value="张经理">张经理</option>
              <option value="李主管">李主管</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs text-gray-400 mb-1">状态</label>
            <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-[#1890ff] bg-white h-9">
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-span-3">
            <label className="block text-xs text-gray-400 mb-1">创建时间</label>
            <div className="flex items-center border border-gray-300 rounded px-2 py-1.5 bg-white h-9">
              <input type="text" placeholder="开始日期" className="text-sm w-full outline-none" />
              <span className="mx-2 text-gray-300">~</span>
              <input type="text" placeholder="结束日期" className="text-sm w-full outline-none" />
            </div>
          </div>
          <div className="col-span-2 flex gap-2">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="搜索维度名称" 
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#1890ff] h-9 pr-8"
              />
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button className="bg-[#1890ff] text-white px-4 py-1.5 rounded text-sm hover:bg-[#40a9ff] transition-colors h-9 shrink-0">
              查询
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fafafa] border-b border-gray-200">
              <th className="px-4 py-4 text-sm font-semibold text-gray-800">维度名称</th>
              <th className="px-4 py-4 text-sm font-semibold text-gray-800">分类</th>
              <th className="px-4 py-4 text-sm font-semibold text-gray-800 text-center">关联话术</th>
              <th className="px-4 py-4 text-sm font-semibold text-gray-800">创建人</th>
              <th className="px-4 py-4 text-sm font-semibold text-gray-800">创建时间</th>
              <th className="px-4 py-4 text-sm font-semibold text-gray-800">最后更新时间</th>
              <th className="px-4 py-4 text-sm font-semibold text-gray-800">最后更新人</th>
              <th className="px-4 py-4 text-sm font-semibold text-gray-800">状态</th>
              <th className="px-4 py-4 text-sm font-semibold text-gray-800">操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-[#1890ff] cursor-pointer hover:underline">{item.name}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {item.category.map(cat => (
                      <span key={cat} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                        {cat}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-sm text-gray-600">{item.scriptCount}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-600">{item.creator}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-500">{item.createdAt}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-500">{item.updatedAt}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-600">{item.updater}</span>
                </td>
                <td className="px-4 py-4">
                  <button 
                    onClick={() => setData(prev => prev.map(d => d.id === item.id ? { ...d, status: !d.status } : d))}
                    className={cn(
                      "w-10 h-5 rounded-full relative transition-colors duration-200",
                      item.status ? "bg-[#1890ff]" : "bg-gray-300"
                    )}
                  >
                    <div className={cn(
                      "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200",
                      item.status ? "left-[22px]" : "left-0.5"
                    )} />
                  </button>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="text-gray-400 hover:text-[#1890ff] transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => {
                        setDeletingId(item.id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderTagTable = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-gray-50">
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-3">
            <label className="block text-xs text-gray-400 mb-1">标签名称</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="搜索标签" 
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#1890ff] h-9 pr-8"
              />
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="col-span-2">
            <button className="bg-[#1890ff] text-white px-4 py-1.5 rounded text-sm hover:bg-[#40a9ff] transition-colors h-9">
              查询
            </button>
          </div>
          <div className="col-span-7 flex justify-end">
            <button className="bg-[#1890ff] text-white px-4 py-1.5 rounded text-sm hover:bg-[#40a9ff] transition-colors h-9 flex items-center gap-2">
              <Plus size={16} />
              新建标签
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {tags.map(tag => (
            <div key={tag.id} className="col-span-3 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                  <span className="font-bold text-gray-800">{tag.name}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button className="text-gray-400 hover:text-[#1890ff]"><Edit2 size={14} /></button>
                  <button className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>关联维度数量</span>
                <span className="font-medium text-gray-900">{tag.usageCount}</span>
              </div>
              <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1890ff]" 
                  style={{ width: `${Math.min(100, (tag.usageCount / 50) * 100)}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-[#f0f2f5] overflow-hidden" id="evaluation-page">
      {/* Breadcrumbs & Tabs */}
      <div className="bg-white border-b border-gray-200 shrink-0">
        <div className="px-6 py-2 flex items-center gap-2 text-xs text-gray-400">
          <ShieldCheck size={12} />
          <span>首页</span>
          <span>/</span>
          <span className="text-gray-900">评估维度</span>
        </div>
        <div className="px-6 flex items-center gap-1">
          <div className="px-4 py-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-50">概览</div>
          <div className="px-4 py-2 text-sm text-[#1890ff] bg-[#e6f7ff] border-b-2 border-[#1890ff] flex items-center gap-2 font-medium">
            评估维度
            <X size={14} className="cursor-pointer hover:text-red-500" />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-3 flex justify-end items-center gap-3 shrink-0">
        <SvgCopyButton targetId="evaluation-page" />
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#1890ff] hover:bg-[#40a9ff] text-white px-4 py-2 rounded flex items-center gap-2 text-sm transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span>{activeSubTab === 'dimension' ? '新建评估维度' : '新建标签'}</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white rounded-sm shadow-sm min-h-full flex flex-col">
          {/* Tabs */}
          <div className="px-6 pt-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex gap-8">
              <button 
                onClick={() => setActiveSubTab('dimension')}
                className={cn(
                  "pb-3 text-sm font-medium transition-all relative",
                  activeSubTab === 'dimension' ? "text-[#1890ff]" : "text-gray-500 hover:text-gray-700"
                )}
              >
                维度
                {activeSubTab === 'dimension' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1890ff]" />
                )}
              </button>
              <button 
                onClick={() => setActiveSubTab('tag')}
                className={cn(
                  "pb-3 text-sm font-medium transition-all relative",
                  activeSubTab === 'tag' ? "text-[#1890ff]" : "text-gray-500 hover:text-gray-700"
                )}
              >
                标签
                {activeSubTab === 'tag' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1890ff]" />
                )}
              </button>
            </div>
          </div>

          {activeSubTab === 'dimension' ? renderDimensionTable() : renderTagTable()}

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-4 shrink-0">
            <span className="text-sm text-gray-500">共 {activeSubTab === 'dimension' ? data.length : tags.length} 条</span>
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
              <button className="w-8 h-8 flex items-center justify-center text-sm hover:bg-gray-100 rounded">2</button>
              <button className="w-8 h-8 flex items-center justify-center text-sm hover:bg-gray-100 rounded">3</button>
              <button className="w-8 h-8 flex items-center justify-center text-sm hover:bg-gray-100 rounded">4</button>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>前往</span>
              <input type="text" className="w-10 border border-gray-300 rounded px-1 py-0.5 text-center outline-none" defaultValue="1" />
              <span>页</span>
            </div>
          </div>
        </div>
      </main>

      {/* Edit/New Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/45"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="text-base font-semibold text-gray-800">
                  {editingItem ? '编辑评估维度' : '新建评估维度'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <span className="text-red-500">*</span>维度名称
                  </label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="记录评估维度的名称。如：客诉询问"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <span className="text-red-500">*</span>话术分类
                  </label>
                  <div className="relative">
                    <div 
                      className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm flex flex-wrap gap-2 min-h-[38px] cursor-text hover:border-[#1890ff] transition-colors items-center"
                      onClick={() => setIsCategoryDropdownOpen(true)}
                    >
                      {formData.category?.map(tag => (
                        <span key={tag} className="bg-[#e6f7ff] text-[#1890ff] border border-[#91d5ff] px-2 py-0.5 rounded text-xs flex items-center gap-1">
                          {tag}
                          <X 
                            size={12} 
                            className="cursor-pointer hover:text-red-500" 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCategoryTag(tag);
                            }}
                          />
                        </span>
                      ))}
                      <input 
                        type="text" 
                        placeholder={formData.category?.length ? "" : "+ 添加或搜索标签"} 
                        className="outline-none flex-1 min-w-[120px]"
                        value={categorySearch}
                        onChange={(e) => {
                          setCategorySearch(e.target.value);
                          setIsCategoryDropdownOpen(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && categorySearch.trim()) {
                            addCategoryTag(categorySearch.trim());
                          }
                        }}
                      />
                      <ChevronDown size={14} className="text-gray-400" />
                    </div>
                    
                    <AnimatePresence>
                      {isCategoryDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 py-1 max-h-48 overflow-y-auto"
                        >
                          {CATEGORIES.filter(c => c.toLowerCase().includes(categorySearch.toLowerCase())).map(category => (
                            <button
                              key={category}
                              onClick={() => addCategoryTag(category)}
                              className={cn(
                                "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                                formData.category?.includes(category) ? "text-[#1890ff] font-medium bg-[#e6f7ff]" : "text-gray-700"
                              )}
                            >
                              {category}
                            </button>
                          ))}
                          {categorySearch && !CATEGORIES.includes(categorySearch) && (
                            <button
                              onClick={() => addCategoryTag(categorySearch)}
                              className="w-full text-left px-4 py-2 text-sm text-[#1890ff] hover:bg-gray-50 transition-colors border-t border-gray-50"
                            >
                              新增标签: "{categorySearch}"
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">维度说明 (非常关键)</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="从业务角度描述该维度的考核重点..."
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff]/20 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <span className="text-red-500">*</span>人设
                  </label>
                  <textarea 
                    rows={4}
                    value={formData.persona}
                    onChange={e => setFormData(prev => ({ ...prev, persona: e.target.value }))}
                    placeholder="明确制定当前的话术标签。例如：必须包含“流程”（回访确认）..."
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff]/20 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">状态</span>
                  <button 
                    onClick={() => setFormData(prev => ({ ...prev, status: !prev.status }))}
                    className={cn(
                      "w-10 h-5 rounded-full relative transition-colors duration-200",
                      formData.status ? "bg-[#1890ff]" : "bg-gray-300"
                    )}
                  >
                    <div className={cn(
                      "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200",
                      formData.status ? "left-[22px]" : "left-0.5"
                    )} />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 text-sm bg-[#1890ff] text-white rounded hover:bg-[#40a9ff] transition-colors shadow-sm"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/45"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-sm relative z-10 p-8 text-center"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">确定要删除该维度吗？</h3>
                <p className="text-red-500 font-medium">确认后，该数据从列表中移除</p>
                <p className="text-gray-400 text-xs mt-2">ps：如果维度已被话术使用，则删除失败，仅能停用。</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-2.5 bg-[#1890ff] text-white rounded-lg text-sm font-medium hover:bg-[#40a9ff] transition-colors shadow-md"
                >
                  确认
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
