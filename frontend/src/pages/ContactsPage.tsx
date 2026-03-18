import { useState } from 'react';
import { 
  Search, Star, Users, UserCircle2, ChevronDown, Plus, 
  Mail, Phone, MoreVertical, Edit2, Trash2, Heart,
  Filter, Grid3X3, List, X
} from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  email: string;
  group?: string;
  department?: string;
  phone?: string;
  mobile?: string;
  position?: string;
  company?: string;
  avatar?: string;
  isStarred?: boolean;
  isFavorite?: boolean;
}

interface ContactGroup {
  id: number;
  name: string;
  count: number;
}

const mockContactGroups: ContactGroup[] = [
  { id: 1, name: '全部联系人', count: 156 },
  { id: 2, name: '集团领导班子', count: 12 },
  { id: 3, name: '中层干部', count: 45 },
  { id: 4, name: '运营班子成员', count: 8 },
  { id: 5, name: '集团审计小组', count: 6 },
  { id: 6, name: '国际联盟项目组', count: 23 },
  { id: 7, name: 'UN 集团项目组', count: 18 },
  { id: 8, name: '其他', count: 44 },
];

const mockContacts: Contact[] = [
  { 
    id: 1, 
    name: '诸君明君', 
    email: 'zhugunji@Spt.com', 
    group: '集团领导班子',
    phone: '010-88888888',
    mobile: '138****8888',
    position: '总裁',
    company: '速信达集团',
    isStarred: true,
    isFavorite: true
  },
  { 
    id: 2, 
    name: '盖力', 
    email: 'dm@mail.modao.cc',
    mobile: '139****6666',
    position: '设计师',
    company: '摹客科技',
    isStarred: true,
    isFavorite: true
  },
  { 
    id: 3, 
    name: '王伟', 
    email: 'wangw@Spt.com',
    mobile: '137****9999',
    position: '技术总监',
    company: '速信达集团',
    isStarred: true
  },
  { 
    id: 4, 
    name: '李娜', 
    email: 'lin@Spt.com',
    group: '中层干部',
    mobile: '136****7777',
    position: '部门经理',
    company: '速信达集团'
  },
  { 
    id: 5, 
    name: '张三', 
    email: 'zhangs@Spt.com',
    group: 'UN 集团项目组',
    mobile: '135****5555',
    position: '项目经理',
    company: '速信达集团'
  },
  { 
    id: 6, 
    name: '李四', 
    email: 'lis@Spt.com',
    group: 'UN 集团项目组',
    mobile: '134****3333',
    position: '开发工程师',
    company: '速信达集团'
  },
  { 
    id: 7, 
    name: '王五', 
    email: 'wangw@Spt.com',
    group: '国际联盟项目组',
    mobile: '133****2222',
    position: '产品专员',
    company: '速信达集团'
  },
  { 
    id: 8, 
    name: '赵六', 
    email: 'zhaol@Spt.com',
    group: '中层干部',
    mobile: '132****1111',
    position: '运营经理',
    company: '速信达集团'
  },
];

type ViewMode = 'grid' | 'list';

export default function ContactsPage() {
  const [selectedGroup, setSelectedGroup] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);

  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === 1 || contact.group === mockContactGroups.find(g => g.id === selectedGroup)?.name;
    return matchesSearch && matchesGroup;
  });

  const toggleSelectContact = (id: number) => {
    setSelectedContacts(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    // 实际项目中应该调用 API
    console.log('Toggle favorite:', id);
  };

  return (
    <div className="h-full flex bg-slate-50">
      {/* 左侧边栏 - 导航 */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className="space-y-1">
            <button className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2.5 transition-colors">
              <UserCircle2 className="w-4 h-4" />
              收件箱 (5)
            </button>
            <button className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2.5 transition-colors">
              <Star className="w-4 h-4" />
              星标邮件
            </button>
            <button className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2.5 transition-colors">
              <Users className="w-4 h-4" />
              星标联系人邮件
            </button>
            <button className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2.5 transition-colors">
              <Users className="w-4 h-4" />
              群邮件
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-2 px-2 py-1 text-xs font-medium text-slate-500">已发送</div>
          <button className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            已发送
          </button>

          <div className="mt-4 mb-2 px-2 py-1 text-xs font-medium text-slate-500 flex items-center gap-1">
            <ChevronDown className="w-3 h-3" />
            我的文件夹
          </div>
          
          <div className="mb-2 px-2 py-1 text-xs font-medium text-slate-500 flex items-center gap-1">
            <ChevronDown className="w-3 h-3" />
            已删除
          </div>

          <div className="mt-4 mb-2 px-2 py-1 text-xs font-medium text-slate-500">应用</div>
          <div className="space-y-1">
            <button className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              文件中心
            </button>
            <button className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg font-medium">
              通讯录
            </button>
            <button className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              发票助手
            </button>
          </div>
        </div>
      </div>

      {/* 中间 - 联系人群组 */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className="flex gap-2">
            <button
              className={`flex-1 px-3 py-2 text-sm rounded-lg flex items-center justify-center gap-2 transition-colors ${
                true
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              添加
            </button>
            <button
              className={`flex-1 px-3 py-2 text-sm rounded-lg flex items-center justify-center gap-2 transition-colors ${
                false
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              管理
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* 全部联系人 */}
          <button
            onClick={() => setSelectedGroup(1)}
            className={`w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between transition-colors ${
              selectedGroup === 1 ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-900">全部联系人</span>
            </div>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">156</span>
          </button>

          {/* 联系人分组 */}
          <div className="divide-y divide-slate-100">
            {mockContactGroups.slice(1).map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between transition-colors ${
                  selectedGroup === group.id ? 'bg-blue-50' : ''
                }`}
              >
                <span className="text-sm text-slate-700">{group.name}</span>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{group.count}</span>
              </button>
            ))}
          </div>

          {/* 星标联系人 */}
          <div className="p-4 border-t border-slate-200">
            <button className="w-full flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50 p-2 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <span className="font-medium">星标联系人</span>
            </button>
          </div>
        </div>
      </div>

      {/* 右侧 - 联系人列表 */}
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
                placeholder="搜索联系人姓名、邮箱或公司"
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
                <Plus className="w-4 h-4" />
                添加联系人
              </button>
            </div>
          </div>

          {/* 批量操作栏 */}
          {selectedContacts.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
              <span className="text-sm text-blue-700 ml-2">
                已选择 {selectedContacts.length} 位联系人
              </span>
              <div className="h-4 w-px bg-blue-200 mx-2" />
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-700 hover:bg-white rounded transition-colors">
                <Mail className="w-4 h-4" />
                群发邮件
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-700 hover:bg-white rounded transition-colors">
                <Phone className="w-4 h-4" />
                发起会议
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-700 hover:bg-white rounded transition-colors">
                <Trash2 className="w-4 h-4" />
                删除
              </button>
              <div className="flex-1" />
              <button 
                onClick={() => setSelectedContacts([])}
                className="p-1 hover:bg-white rounded transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          )}
        </div>

        {/* 联系人列表/网格 */}
        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === 'list' ? (
            /* 列表视图 */
            <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 hover:bg-slate-50 flex items-center gap-4 transition-colors"
                >
                  {/* 选择框 */}
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => toggleSelectContact(contact.id)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  {/* 头像 */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-medium flex-shrink-0">
                    {contact.name.charAt(0)}
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900">{contact.name}</span>
                      {contact.isStarred && (
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      )}
                      {contact.isFavorite && (
                        <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {contact.email}
                      </span>
                      {contact.mobile && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {contact.mobile}
                        </span>
                      )}
                      {contact.position && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {contact.position}
                        </span>
                      )}
                      {contact.company && (
                        <span>{contact.company}</span>
                      )}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <Mail className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <Phone className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 网格视图 */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
                >
                  {/* 头像和星标 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-medium">
                      {contact.name.charAt(0)}
                    </div>
                    <button
                      onClick={(e) => toggleFavorite(e, contact.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        contact.isFavorite ? 'text-red-400' : 'text-slate-300 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${contact.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* 信息 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-slate-900">{contact.name}</span>
                      {contact.isStarred && (
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      )}
                    </div>
                    {contact.position && (
                      <div className="text-xs text-slate-500">{contact.position}</div>
                    )}
                    {contact.company && (
                      <div className="text-xs text-slate-500">{contact.company}</div>
                    )}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                      {contact.mobile && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Phone className="w-3 h-3" />
                          <span>{contact.mobile}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                    <button className="flex-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
                      <Mail className="w-3 h-3" />
                      发邮件
                    </button>
                    <button className="flex-1 px-3 py-1.5 text-xs bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                      <Phone className="w-3 h-3" />
                      打电话
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
            显示 {filteredContacts.length} / {mockContacts.length} 位联系人
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
