import React, { useState } from 'react';
import { ChevronLeft, X, Bot, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { SvgCopyButton } from './SvgCopyButton';
import { ScriptTagConfig } from './ScriptTagConfig';
import { ScriptQualityConfig } from './ScriptQualityConfig';
import { ScriptCallConfig } from './ScriptCallConfig';

interface ChatMessage {
  role: 'bot' | 'user';
  content: string;
}

interface ScriptConfigProps {
  onJumpToAtom?: () => void;
}

export const ScriptConfig: React.FC<ScriptConfigProps> = ({ onJumpToAtom }) => {
  const [activeTab, setActiveTab] = useState('call'); // 'sms', 'tag', 'test', 'call'
  
  // Tag Config State
  const [activeL1, setActiveL1] = useState('1');
  
  // Quality Inspection State
  const [isEditingQuality, setIsEditingQuality] = useState(false);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [newNodeType, setNewNodeType] = useState<'key' | 'non-key'>('key');
  const [selectedAtoms, setSelectedAtoms] = useState<string[]>([]);
  const [atomSearchQuery, setAtomSearchQuery] = useState('');
  const [activeAtomCategory, setActiveAtomCategory] = useState('全部');
  const [personaText, setPersonaText] = useState('这是外呼机器人与用户的对话，请按照以下规则提取并整理信息。\n输出格式：热词：XXX, XXX\n示例热词：什么东西，不需要，哪位，什么事');
  const [tempPersonaText, setTempPersonaText] = useState(personaText);

  // Test Tab State
  const [testMessages, setTestMessages] = useState<ChatMessage[]>([
    { role: 'bot', content: '欸 你好！这里是东漱社区社区医院，请问是梁俊升本人嘛？' }
  ]);
  const [testInput, setTestInput] = useState('');

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
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-gray-600 hover:text-[#1890ff] transition-colors">
            <ChevronLeft size={20} />
            <span className="text-lg font-medium">返回</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">配置--XXX话术</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#1890ff] text-white px-4 py-2 rounded text-sm flex items-center gap-2 hover:bg-[#40a9ff] transition-colors">
            配置日志
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Sidebar Tabs */}
        <div className="w-[200px] bg-white border-r border-gray-200 flex flex-col py-4 shrink-0">
          {[
            { id: 'call', name: '通话配置' },
            { id: 'tag', name: '标签配置' },
            { id: 'test', name: '会话测试' },
            { id: 'sms', name: '短信配置' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 text-sm font-medium transition-all text-left border-r-2",
                activeTab === tab.id 
                  ? "bg-blue-50 text-[#1890ff] border-[#1890ff]" 
                  : "text-gray-500 hover:bg-gray-50 border-transparent"
              )}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'tag' ? (
          <div className="flex-1 overflow-y-auto">
            <ScriptTagConfig 
              activeL1={activeL1} 
              setActiveL1={setActiveL1} 
            />
            <ScriptQualityConfig 
              personaText={personaText}
              setPersonaText={setPersonaText}
              tempPersonaText={tempPersonaText}
              setTempPersonaText={setTempPersonaText}
              isEditingQuality={isEditingQuality}
              setIsEditingQuality={setIsEditingQuality}
              isAddingNode={isAddingNode}
              setIsAddingNode={setIsAddingNode}
              newNodeType={newNodeType}
              setNewNodeType={setNewNodeType}
              selectedAtoms={selectedAtoms}
              setSelectedAtoms={setSelectedAtoms}
              atomSearchQuery={atomSearchQuery}
              setAtomSearchQuery={setAtomSearchQuery}
              activeAtomCategory={activeAtomCategory}
              setActiveAtomCategory={setActiveAtomCategory}
              onJumpToAtom={onJumpToAtom}
            />
          </div>
        ) : activeTab === 'call' ? (
          <ScriptCallConfig />
        ) : activeTab === 'test' ? (
          <div className="flex-1 overflow-hidden flex flex-col bg-white">
            {/* Session Test View */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar: Info */}
              <div className="w-[320px] border-r border-gray-100 flex flex-col overflow-y-auto p-6 space-y-8 bg-gray-50/30">
                <section className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-orange-500">捕捉信息明细</span>
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
                    <span className="text-[#1890ff]">质检命中详情</span>
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
    </div>
      
    <div className="absolute top-4 right-4 z-50">
      <SvgCopyButton targetId="script-config-page" />
    </div>
  </div>
);
};

export default ScriptConfig;
