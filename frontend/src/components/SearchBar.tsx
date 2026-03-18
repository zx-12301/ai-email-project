import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, FileText, Star } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

interface SearchResult {
  id: number;
  type: 'email' | 'contact' | 'file';
  title: string;
  preview: string;
  date: string;
}

export default function SearchBar({ onSearch, placeholder = '搜索邮件、联系人或文件...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    '会议邀请',
    '项目进度',
    '财务报表'
  ]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      // 模拟搜索结果
      const mockResults: SearchResult[] = [
        {
          id: 1,
          type: 'email',
          title: '会议邀请 - 产品评审会',
          preview: '定于本周五下午 2 点召开产品评审会，请各位准时参加...',
          date: '2027-11-25'
        },
        {
          id: 2,
          type: 'email',
          title: '项目进度汇报',
          preview: '现将本周项目进展情况汇报如下：1. 前端开发完成 80%...',
          date: '2027-11-24'
        },
        {
          id: 3,
          type: 'contact',
          title: '张三 - 产品经理',
          preview: 'zhangsan@Spt.com | 138****8888',
          date: '联系人'
        },
        {
          id: 4,
          type: 'file',
          title: '产品需求文档 v2.0.pdf',
          preview: '2.5MB | 来自：张三',
          date: '2027-11-20'
        }
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.preview.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(mockResults);
      
      if (onSearch) {
        onSearch(query);
      }
    } else {
      setResults([]);
    }
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
  };

  const handleSelectResult = (result: SearchResult) => {
    alert(`打开：${result.title}`);
    setIsFocused(false);
    setQuery('');
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
  };

  const removeRecentSearch = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(recentSearches.filter(s => s !== search));
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'contact':
        return <Star className="w-4 h-4 text-amber-600" />;
      case 'file':
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className={`relative transition-all ${isFocused ? 'w-full' : ''}`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-slate-100 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 rounded-full"
          >
            <X className="w-3 h-3 text-slate-400" />
          </button>
        )}
      </div>

      {/* 搜索下拉面板 */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-96 overflow-y-auto">
          {query ? (
            /* 搜索结果 */
            results.length > 0 ? (
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-medium text-slate-500 border-b border-slate-100 mb-2">
                  搜索结果（{results.length}条）
                </div>
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelectResult(result)}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getResultIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-900 truncate">{result.title}</div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">{result.preview}</div>
                      </div>
                      <div className="text-xs text-slate-400 flex-shrink-0">{result.date}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">未找到相关结果</p>
                <p className="text-xs text-slate-400 mt-1">试试其他关键词</p>
              </div>
            )
          ) : (
            /* 最近搜索 */
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-slate-500 border-b border-slate-100 mb-2 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                最近搜索
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearch(search)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-sm text-slate-700">{search}</span>
                  </div>
                  <button
                    onClick={(e) => removeRecentSearch(search, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-all"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
