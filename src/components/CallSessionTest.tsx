import React from 'react';
import { ChevronLeft, Edit2, ShieldCheck, Bot, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { SvgCopyButton } from './SvgCopyButton';
import { ChatMessage, INITIAL_RECORDS } from '../data/mockData';

interface CallSessionTestProps {
  setViewMode: (mode: 'list' | 'test') => void;
  testPhoneNumber: string;
  setTestPhoneNumber: (num: string) => void;
  testMessages: ChatMessage[];
  setTestMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  testInput: string;
  setTestInput: (input: string) => void;
}

export const CallSessionTest: React.FC<CallSessionTestProps> = ({
  setViewMode,
  testPhoneNumber,
  setTestPhoneNumber,
  testMessages,
  setTestMessages,
  testInput,
  setTestInput,
}) => {
  return (
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

          {/* Captured Info Details */}
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

          {/* Quality Hits */}
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
  );
};
