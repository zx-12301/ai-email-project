import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  Star, 
  Trash2, 
  ChevronDown, 
  MoreVertical,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  FileVideo,
  Music,
  FileArchive,
  Search,
  List,
  Grid3X3,
  Send,
  Calendar,
  User
} from 'lucide-react';

interface Attachment {
  id: number;
  name: string;
  size: string;
  type: 'zip' | 'pdf' | 'doc' | 'docx' | 'xlsx' | 'xls' | 'png' | 'jpg' | 'mp4' | 'mp3';
  expireDate?: string;
  from: string;
  subject: string;
  date: string;
  isStarred?: boolean;
}

// 附件数据（测试数据）
const attachments: Attachment[] = [
  {
    id: 1,
    name: 'Dell-Alienware-Update-Application_WIN64_5.5.0_A.zip',
    size: '28KB',
    type: 'zip',
    expireDate: '无期限',
    from: 'Dell Notifications',
    subject: 'XPS 13 9360 有新的更新',
    date: '11 月 22 日',
    isStarred: false
  },
  {
    id: 2,
    name: '产品需求文档 v2.0.pdf',
    size: '2.5MB',
    type: 'pdf',
    expireDate: '2024-12-31',
    from: '张三',
    subject: '产品需求文档评审',
    date: '11 月 20 日',
    isStarred: true
  },
  {
    id: 3,
    name: '2024 年度财务报表.xlsx',
    size: '1.8MB',
    type: 'xlsx',
    expireDate: '2025-01-15',
    from: '财务部',
    subject: '年度财务报表提交',
    date: '11 月 18 日',
    isStarred: false
  },
  {
    id: 4,
    name: '项目培训视频.mp4',
    size: '156MB',
    type: 'mp4',
    expireDate: '2024-12-20',
    from: '人力资源部',
    subject: '新员工培训资料',
    date: '11 月 15 日',
    isStarred: false
  },
  {
    id: 5,
    name: '产品原型设计.png',
    size: '3.2MB',
    type: 'png',
    expireDate: '无期限',
    from: '设计部',
    subject: 'UI 设计稿确认',
    date: '11 月 12 日',
    isStarred: true
  },
];

type ViewMode = 'list' | 'grid';

export default function AttachmentsPage() {
  const navigate = useNavigate();
  const [selectedAttachments, setSelectedAttachments] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const handleAttachmentClick = (attachmentId: number) => {
    // 预览或下载附件
    console.log('Click attachment:', attachmentId);
  };

  const toggleSelect = (id: number) => {
    setSelectedAttachments(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedAttachments(attachments.map(a => a.id));
    } else {
      setSelectedAttachments([]);
    }
  };

  const toggleStar = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    console.log('Toggle star:', id);
  };

  // 获取文件图标
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'zip':
        return <FileArchive className="w-5 h-5 text-yellow-600" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
      case 'png':
      case 'jpg':
        return <ImageIcon className="w-5 h-5 text-pink-600" />;
      case 'mp4':
        return <FileVideo className="w-5 h-5 text-purple-600" />;
      case 'mp3':
        return <Music className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  // 过滤附件
  const filteredAttachments = attachments.filter(attachment => {
    const matchesSearch = attachment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attachment.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || attachment.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="h-full flex bg-white">
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="border-b border-slate-200 p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-900">全部附件</span>
                <button className="p-1 hover:bg-slate-100 rounded">
                  <List className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors">
                <Send className="w-4 h-4" />
                发送
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors">
                <Download className="w-4 h-4" />
                下载
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors">
                <Star className="w-4 h-4" />
                收藏
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors">
                <Trash2 className="w-4 h-4" />
                删除
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部</option>
                <option value="zip">压缩包</option>
                <option value="pdf">PDF</option>
                <option value="doc">文档</option>
                <option value="xlsx">表格</option>
                <option value="png">图片</option>
                <option value="mp4">视频</option>
                <option value="mp3">音频</option>
              </select>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索附件"
                  className="w-48 pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${
                    viewMode === 'list' ? 'bg-slate-200' : 'hover:bg-slate-100'
                  }`}
                >
                  <List className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${
                    viewMode === 'grid' ? 'bg-slate-200' : 'hover:bg-slate-100'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 附件列表 */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'list' ? (
            <div className="bg-white">
              {/* 表头 */}
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-4 text-xs font-medium text-slate-500">
                <div className="w-8 flex-shrink-0"></div>
                <div className="flex-1">文件名</div>
                <div className="w-24 flex-shrink-0">大小</div>
                <div className="w-32 flex-shrink-0">过期时间</div>
                <div className="w-40 flex-shrink-0">发件人</div>
                <div className="flex-1">邮件主题</div>
                <div className="w-24 flex-shrink-0 text-right">操作</div>
              </div>

              {/* 附件列表 */}
              {filteredAttachments.map((attachment) => (
                <div
                  key={attachment.id}
                  onClick={() => handleAttachmentClick(attachment.id)}
                  className="px-4 py-3 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100"
                >
                  <input
                    type="checkbox"
                    checked={selectedAttachments.includes(attachment.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelect(attachment.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  {/* 文件图标 */}
                  <div className="w-8 flex-shrink-0">
                    {getFileIcon(attachment.type)}
                  </div>

                  {/* 文件名 */}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-slate-900 truncate block">
                      {attachment.name}
                    </span>
                  </div>

                  {/* 大小 */}
                  <div className="w-24 flex-shrink-0">
                    <span className="text-sm text-slate-600">{attachment.size}</span>
                  </div>

                  {/* 过期时间 */}
                  <div className="w-32 flex-shrink-0">
                    <span className={`text-sm ${
                      attachment.expireDate === '无期限' 
                        ? 'text-slate-500' 
                        : 'text-slate-600'
                    }`}>
                      {attachment.expireDate}
                    </span>
                  </div>

                  {/* 发件人 */}
                  <div className="w-40 flex-shrink-0">
                    <span className="text-sm text-slate-600 truncate block">
                      {attachment.from}
                    </span>
                  </div>

                  {/* 邮件主题 */}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-slate-600 truncate block">
                      {attachment.subject}
                    </span>
                  </div>

                  {/* 操作按钮 */}
                  <div className="w-24 flex-shrink-0 flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => toggleStar(e, attachment.id)}
                      className="p-1.5 hover:bg-slate-200 rounded"
                    >
                      <Star className={`w-4 h-4 ${
                        attachment.isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-400'
                      }`} />
                    </button>
                    <button className="p-1.5 hover:bg-slate-200 rounded">
                      <Download className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-200 rounded">
                      <MoreVertical className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-50">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredAttachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
                  >
                    {/* 图标和收藏 */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                        {getFileIcon(attachment.type)}
                      </div>
                      <button
                        onClick={(e) => toggleStar(e, attachment.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          attachment.isStarred ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${attachment.isStarred ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* 文件名 */}
                    <h3 className="text-sm font-medium text-slate-900 truncate mb-2" title={attachment.name}>
                      {attachment.name}
                    </h3>

                    {/* 信息 */}
                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center justify-between">
                        <span>{attachment.size}</span>
                        <span className={attachment.expireDate !== '无期限' ? 'text-orange-600' : ''}>
                          {attachment.expireDate === '无期限' ? '永久' : attachment.expireDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate">{attachment.from}</span>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                      <button className="flex-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
                        <Download className="w-3 h-3" />
                        下载
                      </button>
                      <button className="flex-1 px-3 py-1.5 text-xs bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                        <Send className="w-3 h-3" />
                        发送
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 分页 */}
        <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 mr-2">
              共 {filteredAttachments.length} 个附件
            </span>
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              上一页
            </button>
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
