import React, { useState } from 'react';
import { ChevronDown, Info, Play, ChevronUp, History } from 'lucide-react';
import { cn } from '../lib/utils';
import { ScriptRevisionLogModal } from './ScriptRevisionLogModal';

export const ScriptCallConfig: React.FC = () => {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [personaContent, setPersonaContent] = useState(`称呼：严禁对客户使用“您”，一律改用“你”（锁定脚本内的“您”除外，必须原封不动）。
限字：单次回复严禁超过 50 字。
姓氏：严禁主动提姓氏。仅当被问“你贵姓？”时，回答：“我姓林，你叫我林医生就行。”
禁区：禁止提及“服务、上门、随访、送货、年长照顾”。除了核对地址不一致，禁止主动提短信。
中断优先级：若客户质问或提问，必须用陈述句正面回答，回答完后立即停止，严禁在同一回复中接回刚才的问题或问下一题。
沟通流程（按 1-5 顺序执行，严禁回跳）
第一步：身份确认
话术：你好，请问是梁军升吗？
若确认身份，输出（#是否本人：是）并进入第二步。
若非本人但愿代答，进入代答模式（“你”变“梁军升”），输出（#是否本人：否-代答）。
第二步：标准五问（严格顺序）
核对意愿：你好，我们医院正在完善居民健康档案，方便现在跟你核对几个信息吗？
地址核对（锁定脚本，禁止缩减）：首先为了确保您健康档案归属的准确性，跟你核对下，现在还是住在{address}吗？
若不对（锁定脚本）：等下挂了电话我给你发个短信，你到时点进去填一下最新的地址就好啦。另外还想顺便问下，你平时有高血压或糖尿病这类慢性病吗？
本人病症：好嘞。另外外想问下，你平时有高血压或糖尿病这类慢性病吗？
家属病症：你的家里人例如爸爸妈妈、兄弟姐妹有类似的慢性病史吗？`);

  const handleRollback = (log: any) => {
    if (log.description === '人设') {
      // In a real app, log.oldData would be the full content or we'd fetch it
      // For demo, we'll just prepend a rollback marker
      setPersonaContent(`[已回滚至 ${log.time} 版本]\n\n${personaContent}`);
      alert(`已成功回滚人设至 ${log.time} 的版本`);
    } else {
      alert(`已回滚 ${log.description} 配置`);
    }
    setIsLogModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-white">
      {/* Call Config View Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
        <div className="flex items-center gap-2">
          <History size={18} className="text-gray-400" />
          <span className="text-sm font-bold text-gray-800">通话配置</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsLogModalOpen(true)}
            className="px-4 py-1.5 border border-[#1890ff] text-[#1890ff] rounded text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <History size={14} />
            配置日志
          </button>
          <button className="px-6 py-1.5 bg-[#faad14] text-white rounded text-sm hover:bg-[#ffc53d] transition-colors">保存</button>
          <button className="px-6 py-1.5 bg-gray-200 text-gray-600 rounded text-sm hover:bg-gray-300 transition-colors">取消</button>
        </div>
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
              <div className="text-sm text-gray-700 leading-loose space-y-4 whitespace-pre-wrap">
                {personaContent}
              </div>
              <button className="px-4 py-1.5 border border-[#1890ff] text-[#1890ff] rounded text-sm hover:bg-blue-50 transition-colors">添加变量</button>
            </div>
          </div>
        </div>
      </div>

      <ScriptRevisionLogModal 
        isOpen={isLogModalOpen} 
        onClose={() => setIsLogModalOpen(false)} 
        onRollback={handleRollback}
      />
    </div>
  );
};
