import React, { useState } from 'react';
import { LayoutDashboard, PhoneCall, Settings, ShieldCheck, BarChart3, Users, Download, Figma, Copy, Check, ChevronRight, ChevronDown, ListTodo, MessageSquare, FileText, Database, Monitor, Wrench, UserCheck } from 'lucide-react';
import { elementToSVG } from 'dom-to-svg';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ activeTab, onTabChange }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['outbound_mgmt', 'scripts_mgmt']);

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const menuGroups = [
    { id: 'home', label: '概览', icon: LayoutDashboard },
    { 
      id: 'scripts_mgmt', 
      label: '话术管理', 
      icon: MessageSquare,
      children: [
        { id: 'scripts', label: '外呼话术', icon: FileText },
        { id: 'evaluation', label: '评估维度', icon: ShieldCheck },
      ]
    },
    { 
      id: 'outbound_mgmt', 
      label: '外呼管理', 
      icon: PhoneCall,
      children: [
        { id: 'billing', label: '账单统计', icon: Database },
        { id: 'call_records', label: '通话详情', icon: ListTodo },
        { id: 'sms_details', label: '短信详情', icon: FileText },
      ]
    },
    { id: 'analytics', label: '效果分析', icon: BarChart3 },
    { id: 'atom_library', label: '原子库管理', icon: Database },
    { id: 'system', label: '系统管理', icon: Settings },
  ];

  const handleCopyToFigma = async () => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    setIsExporting(true);
    try {
      const clone = mainElement.cloneNode(true) as HTMLElement;
      const originalInputs = mainElement.querySelectorAll('input, select, textarea');
      const clonedInputs = clone.querySelectorAll('input, select, textarea');
      
      originalInputs.forEach((orig, i) => {
        const cloned = clonedInputs[i] as HTMLElement;
        const original = orig as any;
        const replacement = document.createElement('span');
        const style = window.getComputedStyle(original);
        replacement.style.display = 'inline-block';
        replacement.style.width = style.width;
        replacement.style.height = style.height;
        replacement.style.padding = style.padding;
        replacement.style.fontSize = style.fontSize;
        replacement.style.fontFamily = style.fontFamily;
        replacement.style.color = style.color;
        replacement.style.lineHeight = style.lineHeight;
        replacement.style.verticalAlign = 'middle';
        
        if (original.tagName === 'SELECT') {
          replacement.textContent = original.options[original.selectedIndex]?.text || '';
          replacement.style.border = style.border;
          replacement.style.borderRadius = style.borderRadius;
          replacement.style.backgroundColor = style.backgroundColor;
          replacement.style.position = 'relative';
          const arrow = document.createElement('span');
          arrow.textContent = '▼';
          arrow.style.position = 'absolute';
          arrow.style.right = '8px';
          arrow.style.top = '50%';
          arrow.style.transform = 'translateY(-50%) scale(0.7)';
          arrow.style.fontSize = '10px';
          arrow.style.color = '#999';
          replacement.appendChild(arrow);
        } else if (original.tagName === 'INPUT') {
          if (original.type === 'checkbox' || original.type === 'radio') {
            replacement.textContent = original.checked ? '✓' : '';
            replacement.style.textAlign = 'center';
            replacement.style.border = '1px solid #ccc';
          } else {
            replacement.textContent = original.value || original.placeholder || '';
          }
        } else {
          replacement.textContent = original.value || '';
        }
        
        if (cloned.parentNode) {
          cloned.parentNode.replaceChild(replacement, cloned);
        }
      });

      clone.style.position = 'fixed';
      clone.style.top = '-9999px';
      clone.style.left = '-9999px';
      clone.style.width = mainElement.offsetWidth + 'px';
      document.body.appendChild(clone);

      const svgDocument = elementToSVG(clone);
      document.body.removeChild(clone);

      const svgString = new XMLSerializer().serializeToString(svgDocument);
      await navigator.clipboard.writeText(svgString);
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 2000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <aside className="w-full h-full bg-[#001529] text-gray-400 flex flex-col border-r border-white/5 select-none shrink-0 overflow-hidden">
      <div className="p-4 h-16 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 bg-[#1890ff] rounded flex items-center justify-center">
          <PhoneCall size={18} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">智策云语</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {menuGroups.map((group) => (
          <div key={group.id} className="mb-1">
            <button
              onClick={() => group.children ? toggleMenu(group.id) : onTabChange(group.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 group ${
                activeTab === group.id 
                  ? 'bg-[#1890ff] text-white' 
                  : 'hover:text-white'
              }`}
            >
              <group.icon size={16} />
              <span className="text-sm flex-1 text-left">{group.label}</span>
              {group.children && (
                expandedMenus.includes(group.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />
              )}
            </button>
            
            {group.children && expandedMenus.includes(group.id) && (
              <div className="bg-black/20">
                {group.children.map(child => (
                  <button
                    key={child.id}
                    onClick={() => onTabChange(child.id)}
                    className={`w-full flex items-center gap-3 pl-12 pr-4 py-3 transition-all duration-200 ${
                      activeTab === child.id 
                        ? 'bg-[#1890ff] text-white' 
                        : 'hover:text-white'
                    }`}
                  >
                    {child.icon && <child.icon size={14} />}
                    <span className="text-sm">{child.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="mt-8 px-4">
          <button
            onClick={handleCopyToFigma}
            disabled={isExporting}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded transition-all duration-300 border text-xs ${
              showCheck 
                ? 'bg-emerald-500 border-emerald-500 text-white' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border-white/5'
            }`}
          >
            {isExporting ? (
              <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : showCheck ? (
              <Check size={14} />
            ) : (
              <Figma size={14} />
            )}
            <span>{showCheck ? '已复制' : '复制矢量图层'}</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default AppSidebar;
