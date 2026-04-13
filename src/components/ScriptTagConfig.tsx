import React from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface ScriptTagConfigProps {
  activeL1: string;
  setActiveL1: (id: string) => void;
}

export const ScriptTagConfig: React.FC<ScriptTagConfigProps> = ({ activeL1, setActiveL1 }) => {
  return (
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
    </div>
  );
};
