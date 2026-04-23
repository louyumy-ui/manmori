import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { TaskManagementView } from './TaskManagementView';
import { ScriptManagementView } from './ScriptManagementView';

export const SystemManagement: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'task' | 'script'>('task');

  return (
    <div className="flex-1 flex flex-col bg-[#f0f2f5] overflow-hidden" id="system-management-page">
      {/* Top Tab Bar */}
      <div className="bg-white border-b border-gray-200 px-6 shrink-0 z-20">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setActiveSubTab('task')}
            className={cn(
              "py-4 text-sm font-medium border-b-2 transition-all relative",
              activeSubTab === 'task' ? "text-[#1890ff] border-[#1890ff]" : "text-gray-500 border-transparent hover:text-gray-700"
            )}
          >
            任务管理
          </button>
          <button 
            onClick={() => setActiveSubTab('script')}
            className={cn(
              "py-4 text-sm font-medium border-b-2 transition-all relative",
              activeSubTab === 'script' ? "text-[#1890ff] border-[#1890ff]" : "text-gray-500 border-transparent hover:text-gray-700"
            )}
          >
            话术管理
          </button>
        </div>
      </div>

      {/* View Content */}
      {activeSubTab === 'task' ? (
        <TaskManagementView />
      ) : (
        <ScriptManagementView />
      )}
    </div>
  );
};

export default SystemManagement;
