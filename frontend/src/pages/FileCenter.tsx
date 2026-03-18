import { useState } from 'react';
import { 
  Upload, Download, Share2, Trash2, Star, FileText, Image as ImageIcon, 
  FileSpreadsheet, FileVideo, Folder, Music, Search, MoreVertical, Grid3X3, 
  List, X, Filter, HardDrive, Clock, Heart
} from 'lucide-react';

interface FileItem {
  id: number;
  name: string;
  type: 'doc' | 'docx' | 'pdf' | 'xlsx' | 'xls' | 'mp4' | 'zip' | 'png' | 'jpg' | 'mp3';
  size: string;
  date: string;
  isStarred?: boolean;
  isFavorite?: boolean;
  folder?: string;
  uploadedBy?: string;
}

const mockFiles: FileItem[] = [
  { 
    id: 1, 
    name: '盖力及科技赋能复盘式高效会议.docx', 
    type: 'docx', 
    size: '988KB', 
    date: '10 月 25 日',
    isStarred: true,
    isFavorite: true,
    folder: 'UN 集团项目',
    uploadedBy: '董欣'
  },
  { 
    id: 2, 
    name: '集团 MK 系统选型推销术.docx', 
    type: 'docx', 
    size: '119KB', 
    date: '10 月 24 日',
    folder: '集团文件',
    uploadedBy: '张三'
  },
  { 
    id: 3, 
    name: '集团 2022 年移动端 AI 功能产出报告.pdf', 
    type: 'pdf', 
    size: '19MB', 
    date: '10 月 23 日',
    isStarred: true,
    folder: 'AI 项目',
    uploadedBy: '李四'
  },
  { 
    id: 4, 
    name: '集团 2022 年度市场成效分析表.xlsx', 
    type: 'xlsx', 
    size: '9MB', 
    date: '09 月 29 日',
    folder: '市场报告',
    uploadedBy: '王五'
  },
  { 
    id: 5, 
    name: '集团 2022 年度 4 季度市场成效在产品.mp4', 
    type: 'mp4', 
    size: '589MB', 
    date: '09 月 29 日',
    folder: '市场报告',
    uploadedBy: '赵六'
  },
  { 
    id: 6, 
    name: '集团 2022 年度 3 季度最新汇科技汇总.zip', 
    type: 'zip', 
    size: '1.9GB', 
    date: '09 月 29 日',
    folder: '科技汇总',
    uploadedBy: '钱七'
  },
  { 
    id: 7, 
    name: '产品原型设计.png', 
    type: 'png', 
    size: '2.5MB', 
    date: '09 月 28 日',
    isFavorite: true,
    folder: '设计文件',
    uploadedBy: '孙八'
  },
  { 
    id: 8, 
    name: '会议纪要.jpg', 
    type: 'jpg', 
    size: '1.2MB', 
    date: '09 月 27 日',
    folder: '会议记录',
    uploadedBy: '周九'
  },
  { 
    id: 9, 
    name: '项目培训录音.mp3', 
    type: 'mp3', 
    size: '45MB', 
    date: '09 月 26 日',
    folder: '培训资料',
    uploadedBy: '吴十'
  },
  { 
    id: 10, 
    name: '2023 年度预算表.xls', 
    type: 'xls', 
    size: '5.6MB', 
    date: '09 月 25 日',
    folder: '财务文件',
    uploadedBy: '郑十一'
  },
];

type ViewMode = 'grid' | 'list';
type Category = 'all' | 'doc' | 'image' | 'video' | 'audio' | 'archive' | 'recent' | 'starred';

export default function FileCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const filteredFiles = mockFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === 'all' ||
      (selectedCategory === 'recent' && true) || // 简化处理，实际应该按日期过滤
      (selectedCategory === 'starred' && file.isStarred) ||
      (selectedCategory === 'doc' && ['doc', 'docx', 'pdf'].includes(file.type)) ||
      (selectedCategory === 'image' && ['png', 'jpg'].includes(file.type)) ||
      (selectedCategory === 'video' && file.type === 'mp4') ||
      (selectedCategory === 'audio' && file.type === 'mp3') ||
      (selectedCategory === 'archive' && ['zip', 'rar'].includes(file.type));
    return matchesSearch && matchesCategory;
  });

  const toggleSelectFile = (id: number) => {
    setSelectedFiles(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    console.log('Toggle favorite:', id);
  };

  const toggleStar = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    console.log('Toggle star:', id);
  };

  // 获取文件图标
  const getFileIcon = (type: string, size: string = 'w-8 h-8') => {
    const iconClass = `${size} flex-shrink-0`;
    switch (type) {
      case 'doc':
      case 'docx':
        return <FileText className={`${iconClass} text-blue-500`} />;
      case 'pdf':
        return <FileText className={`${iconClass} text-red-500`} />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className={`${iconClass} text-green-500`} />;
      case 'mp4':
        return <FileVideo className={`${iconClass} text-purple-500`} />;
      case 'zip':
        return <Folder className={`${iconClass} text-yellow-500`} />;
      case 'png':
      case 'jpg':
        return <ImageIcon className={`${iconClass} text-pink-500`} />;
      case 'mp3':
        return <Music className={`${iconClass} text-orange-500`} />;
      default:
        return <FileText className={`${iconClass} text-slate-500`} />;
    }
  };

  const categories = [
    { id: 'all', name: '全部文件', icon: Folder, count: mockFiles.length },
    { id: 'recent', name: '最近使用', icon: Clock, count: 24 },
    { id: 'starred', name: '星标文件', icon: Star, count: 8 },
    { id: 'doc', name: '文档', icon: FileText, count: 45 },
    { id: 'image', name: '图片', icon: ImageIcon, count: 32 },
    { id: 'video', name: '视频', icon: FileVideo, count: 12 },
    { id: 'audio', name: '音频', icon: Music, count: 8 },
    { id: 'archive', name: '压缩文件', icon: Folder, count: 15 },
  ];

  return (
    <div className="h-full flex bg-slate-50">
      {/* 文件分类 */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <Folder className="w-4 h-4 text-blue-500" />
            <span>文件分类</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full px-3 py-2.5 text-left hover:bg-slate-50 rounded-lg flex items-center justify-between transition-colors ${
                    selectedCategory === category.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedCategory === category.id 
                        ? 'bg-blue-100' 
                        : 'bg-slate-100'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        selectedCategory === category.id 
                          ? 'text-blue-600' 
                          : 'text-slate-500'
                      }`} />
                    </div>
                    <span className={`text-sm font-medium ${
                      selectedCategory === category.id 
                        ? 'text-blue-700' 
                        : 'text-slate-700'
                    }`}>
                      {category.name}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 存储空间 */}
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">存储空间</span>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>已用 15.6GB</span>
                <span>共 50GB</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full w-[31%] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
              </div>
            </div>
            <button className="text-xs text-blue-600 hover:underline">
              升级存储空间 →
            </button>
          </div>
        </div>
      </div>

      {/* 右侧 - 文件列表 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            {/* 搜索框 */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索文件名、类型或上传者"
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* 视图切换和操作 */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Filter className="w-4 h-4 text-slate-600" />
              </button>
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-slate-200'
                  }`}
                >
                  <List className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-slate-200'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
                <Upload className="w-4 h-4" />
                上传文件
              </button>
            </div>
          </div>

          {/* 批量操作栏 */}
          {selectedFiles.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
              <span className="text-sm text-blue-700 ml-2">
                已选择 {selectedFiles.length} 个文件
              </span>
              <div className="h-4 w-px bg-blue-200 mx-2" />
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-700 hover:bg-white rounded transition-colors">
                <Download className="w-4 h-4" />
                下载
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-700 hover:bg-white rounded transition-colors">
                <Share2 className="w-4 h-4" />
                分享
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-700 hover:bg-white rounded transition-colors">
                <Trash2 className="w-4 h-4" />
                删除
              </button>
              <div className="flex-1" />
              <button 
                onClick={() => setSelectedFiles([])}
                className="p-1 hover:bg-white rounded transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          )}
        </div>

        {/* 文件列表/网格 */}
        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === 'list' ? (
            <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-4 hover:bg-slate-50 flex items-center gap-4 transition-colors group"
                >
                  {/* 选择框 */}
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => toggleSelectFile(file.id)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  {/* 文件图标 */}
                  <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900 truncate">{file.name}</span>
                      {file.isStarred && (
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                      )}
                      {file.isFavorite && (
                        <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{file.size}</span>
                      <span>{file.date}</span>
                      {file.folder && (
                        <span className="flex items-center gap-1">
                          <Folder className="w-3 h-3" />
                          {file.folder}
                        </span>
                      )}
                      {file.uploadedBy && (
                        <span>上传：{file.uploadedBy}</span>
                      )}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <Star className={`w-4 h-4 ${file.isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
                >
                  {/* 图标和收藏 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-14 h-14 bg-slate-50 rounded-lg flex items-center justify-center">
                      {getFileIcon(file.type, 'w-8 h-8')}
                    </div>
                    <button
                      onClick={(e) => toggleFavorite(e, file.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        file.isFavorite ? 'text-red-400' : 'text-slate-300 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${file.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* 文件名 */}
                  <h3 className="text-sm font-medium text-slate-900 truncate mb-2" title={file.name}>
                    {file.name}
                  </h3>

                  {/* 信息 */}
                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>{file.size}</span>
                      <span>{file.date}</span>
                    </div>
                    {file.folder && (
                      <div className="flex items-center gap-1 truncate">
                        <Folder className="w-3 h-3" />
                        <span className="truncate">{file.folder}</span>
                      </div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
                      <Download className="w-3 h-3" />
                      下载
                    </button>
                    <button className="flex-1 px-3 py-1.5 text-xs bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                      <Share2 className="w-3 h-3" />
                      分享
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 分页 */}
        <div className="bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-slate-600">
            显示 {filteredFiles.length} / {mockFiles.length} 个文件
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              上一页
            </button>
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
