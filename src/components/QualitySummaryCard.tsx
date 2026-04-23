import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface QualitySummaryCardProps {
  total: number;
  issues: {
    name: string;
    count: number;
    processed: number;
    unprocessed: number;
  }[];
}

export const QualitySummaryCard: React.FC<QualitySummaryCardProps> = ({ total, issues }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
        <ShieldCheck size={18} className="text-[#1890ff]" />
        质检结果汇总
      </h3>
      <div className="text-xs text-gray-400">
        总任务：<span className="font-bold text-gray-800">共 {total} 条</span>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6">
      {issues.map((issue, idx) => {
        const percentage = ((issue.count / total) * 100).toFixed(1);
        return (
          <div key={idx} className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-800">{issue.name}</span>
              <span className="text-xs text-gray-400">共 {issue.count} 条，占总任务的 {percentage}%</span>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 flex items-center justify-between px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <span className="text-[10px]">已处理</span>
                <span className="text-sm font-bold">{issue.processed} 条</span>
              </div>
              <div className="flex-1 flex items-center justify-between px-3 py-2 bg-red-50 text-red-600 rounded-lg">
                <span className="text-[10px]">未处理</span>
                <span className="text-sm font-bold">{issue.unprocessed} 条</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
