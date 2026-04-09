import React, { useState } from 'react';
import AppSidebar from './components/AppSidebar';
import { EvaluationDimensions } from './components/EvaluationDimensions';
import { CallRecords } from './components/CallRecords';
import { ScriptConfig } from './components/ScriptConfig';
import { AtomLibrary } from './components/AtomLibrary';
import { SystemManagement } from './components/SystemManagement';
import { Bell, Cloud, User, ChevronDown, LayoutGrid, LogOut } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('scripts');

  return (
    <div className="grid grid-cols-12 h-screen w-full bg-[#f0f2f5] overflow-hidden font-sans">
      {/* Sidebar - 2 Columns */}
      <div className="col-span-2 h-full overflow-hidden">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {/* Main Content Area - 10 Columns */}
      <div className="col-span-10 flex flex-col overflow-hidden">
        {/* Global Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1890ff] rounded flex items-center justify-center">
                <LayoutGrid size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">智策云语 <span className="text-[#1890ff]">AI交互中心</span></h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-[#1890ff] transition-colors relative">
              <Cloud size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1 cursor-pointer group">
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#1890ff]">张漫</span>
                <ChevronDown size={14} className="text-gray-400 group-hover:text-[#1890ff]" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'evaluation' ? (
            <EvaluationDimensions />
          ) : activeTab === 'call_records' ? (
            <CallRecords />
          ) : activeTab === 'scripts' ? (
            <ScriptConfig onJumpToAtom={() => setActiveTab('atom_library')} />
          ) : activeTab === 'atom_library' ? (
            <AtomLibrary />
          ) : activeTab === 'system' ? (
            <SystemManagement />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">模块开发中</h2>
                <p>当前选中的模块是: {activeTab}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
