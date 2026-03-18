import { useState } from 'react';
import {
  Trash2,
  Forward,
  Star,
  Archive,
  Shield,
  CheckCircle,
  Folder,
  ChevronDown,
  X
} from 'lucide-react';

interface PageToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDelete?: () => void;
  onForward?: () => void;
  onSpam?: () => void;
  onMarkAsRead?: () => void;
  onStar?: () => void;
  onArchive?: () => void;
  onMove?: () => void;
}

export default function PageToolbar({
  selectedCount,
  onClearSelection,
  onDelete,
  onForward,
  onSpam,
  onMarkAsRead,
  onStar,
  onArchive,
  onMove
}: PageToolbarProps) {
  const [showMoveDropdown, setShowMoveDropdown] = useState(false);
  const [showStarDropdown, setShowStarDropdown] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      const confirmed = window.confirm(`确定要删除选中的 ${selectedCount} 封邮件吗？`);
      if (confirmed) {
        onDelete();
      }
    }
  };

  const handleForward = () => {
    if (onForward) {
      const recipient = window.prompt('请输入收件人邮箱：');
      if (recipient) {
        onForward();
        alert(`已转发给 ${recipient}`);
      }
    }
  };

  const handleSpam = () => {
    if (onSpam) {
      const confirmed = window.confirm(`确定要将选中的 ${selectedCount} 封邮件标记为垃圾邮件吗？`);
      if (confirmed) {
        onSpam();
      }
    }
  };

  const handleMarkAsRead = () => {
    if (onMarkAsRead) {
      onMarkAsRead();
      alert(`已将 ${selectedCount} 封邮件标记为已读`);
    }
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive();
      alert(`已将 ${selectedCount} 封邮件归档`);
    }
  };

  const handleMove = (folder: string) => {
    if (onMove) {
      onMove();
      alert(`已将 ${selectedCount} 封邮件移动到 ${folder}`);
      setShowMoveDropdown(false);
    }
  };

  const handleStar = (starType: string) => {
    if (onStar) {
      onStar();
      alert(`已将 ${selectedCount} 封邮件标记为${starType}`);
      setShowStarDropdown(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
      <span className="text-sm text-blue-700 ml-2">
        已选择 {selectedCount} 封邮件
      </span>
      <div className="h-4 w-px bg-blue-200 mx-2" />
      
      <button 
        onClick={handleMarkAsRead}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-700 hover:bg-white rounded transition-colors"
      >
        <CheckCircle className="w-4 h-4" />
        全部已读
      </button>
      
      <button 
        onClick={handleArchive}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-700 hover:bg-white rounded transition-colors"
      >
        <Archive className="w-4 h-4" />
        归档
      </button>
      
      <button 
        onClick={handleDelete}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-700 hover:bg-white rounded transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        删除
      </button>
      
      <button 
        onClick={handleSpam}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-700 hover:bg-white rounded transition-colors"
      >
        <Shield className="w-4 h-4" />
        垃圾邮件
      </button>
      
      <div className="relative">
        <button 
          onClick={() => setShowStarDropdown(!showStarDropdown)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-700 hover:bg-white rounded transition-colors"
        >
          <Star className="w-4 h-4" />
          标记为
          <ChevronDown className="w-4 h-4" />
        </button>
        
        {showStarDropdown && (
          <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
            <button
              onClick={() => handleStar('星标')}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Star className="w-4 h-4 text-amber-400" />
              星标
            </button>
            <button
              onClick={() => handleStar('重要')}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Star className="w-4 h-4 text-red-400" />
              重要
            </button>
            <button
              onClick={() => handleStar('稍后处理')}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Star className="w-4 h-4 text-blue-400" />
              稍后处理
            </button>
          </div>
        )}
      </div>
      
      <div className="relative">
        <button 
          onClick={() => setShowMoveDropdown(!showMoveDropdown)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-700 hover:bg-white rounded transition-colors"
        >
          <Folder className="w-4 h-4" />
          移动到
          <ChevronDown className="w-4 h-4" />
        </button>
        
        {showMoveDropdown && (
          <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
            <button
              onClick={() => handleMove('收件箱')}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
            >
              收件箱
            </button>
            <button
              onClick={() => handleMove('草稿箱')}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
            >
              草稿箱
            </button>
            <button
              onClick={() => handleMove('已发送')}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
            >
              已发送
            </button>
            <button
              onClick={() => handleMove('垃圾箱')}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
            >
              垃圾箱
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1" />
      
      <button 
        onClick={onClearSelection}
        className="p-1 hover:bg-white rounded transition-colors"
      >
        <X className="w-4 h-4 text-slate-500" />
      </button>
    </div>
  );
}
