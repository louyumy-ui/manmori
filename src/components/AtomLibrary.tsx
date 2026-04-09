import React from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, X, ChevronDown, ShieldCheck, Database, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

export const AtomLibrary: React.FC = () => {
  const atoms = [
    { title: '答非所问', desc: '模型回答与用户提问无关，逻辑断层', tag: '流程', type: '素质' },
    { title: '回答脱离人设', desc: '回答超出给定的业务流程，偏离官方要求。', tag: '素质', type: '素质' },
    { title: '意图识别有误', desc: '模型错误理解用户意图，对话偏离方向', tag: '业务', type: '业务' },
    { title: '重复追问', desc: '在用户已明确回答后仍追问相同问题', tag: '业务', type: '业务' },
    { title: '语速过快', desc: '机器人说话速度明显超过正常交流频率', tag: '体验', type: '体验' },
    { title: '态度生硬', desc: '回复缺乏亲和力，语气过于生硬', tag: '体验', type: '体验' },
    { title: '未按流程执行', desc: '未遵循预设的话术流程进行引导', tag: '流程', type: '流程' },
    { title: '信息录入错误', desc: '提取的用户关键信息与实际不符', tag: '业务', type: '业务' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#f0f2f5] overflow-hidden">
      <div className="bg-white border-b border-gray-200 shrink-0">
        <div className="px-6 py-2 flex items-center gap-2 text-xs text-gray-400">
          <Database size={12} />
          <span>首页</span>
          <span>/</span>
          <span className="text-gray-900">原子库管理</span>
        </div>
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">质检原子库</h1>
          <button className="bg-[#1890ff] text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
            <Plus size={16} />
            <span>新增原子</span>
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索原子名称或描述" 
              className="w-full border border-gray-200 rounded pl-10 pr-4 py-2 text-sm focus:border-[#1890ff] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">分类：</span>
            <select className="border border-gray-200 rounded px-3 py-2 text-sm bg-white">
              <option>全部</option>
              <option>业务</option>
              <option>流程</option>
              <option>素质</option>
              <option>体验</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {atoms.map((atom) => (
            <div key={atom.title} className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-lg transition-all group relative">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 size={14} className="text-gray-400 hover:text-[#1890ff] cursor-pointer" />
                <Trash2 size={14} className="text-gray-400 hover:text-red-500 cursor-pointer" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#1890ff]"></div>
                  <h3 className="font-bold text-gray-900">{atom.title}</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed h-10 overflow-hidden line-clamp-2">
                  {atom.desc}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-[#1890ff] text-[10px] rounded border border-blue-100">
                    {atom.tag}
                  </span>
                  <span className="text-[10px] text-gray-400">更新于: 2024-03-20</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
