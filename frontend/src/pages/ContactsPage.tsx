import { useState, useEffect } from 'react';
import {
  Search,
  Star,
  Users,
  UserCircle2,
  ChevronDown,
  Plus,
  Mail,
  Phone,
  MoreVertical,
  List,
  Grid3X3,
  Filter,
  Heart
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { API_BASE_URL } from '../config/api';

interface Contact {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  position?: string;
  company?: string;
  group?: string;
  birthday?: string;
  avatar?: string;
  isStarred?: boolean;
  isFavorite?: boolean;
  isTest?: boolean;
}

interface ContactGroup {
  id: number;
  name: string;
  count: number;
  icon?: string;
}

// 获取 Token
const getToken = () => {
  return localStorage.getItem('token');
};

// 获取系统所有用户
const getSystemUsers = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/auth/users`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  });
  if (!response.ok) {
    throw new Error('获取用户列表失败');
  }
  return response.json();
};

// 联系人群组（静态数据）
const mockContactGroups: ContactGroup[] = [
  { id: 1, name: '全部联系人', count: 0, icon: 'folder' },
  { id: 2, name: '集团领导班子', count: 0 },
  { id: 3, name: '中层干部', count: 0 },
  { id: 4, name: '运营班子成员', count: 0 },
  { id: 5, name: '集团审计小组', count: 0 },
  { id: 6, name: '国际联盟项目组', count: 0 },
  { id: 7, name: 'UN 集团项目组', count: 0 },
  { id: 8, name: '其他', count: 0 },
];

// 测试数据（备用）
const testContacts: Contact[] = [
  {
    id: 'test-1',
    name: '诸葛明君',
    email: 'zhugunji@Spt.com',
    mobile: '138****8888',
    position: '总裁',
    company: '速信达集团',
    group: '集团领导班子',
    isStarred: true,
    isFavorite: true,
    avatar: '诸',
    isTest: true
  },
  {
    id: 'test-2',
    name: '盖力',
    email: 'dm@mail.modao.cc',
    mobile: '139****6666',
    position: '设计师',
    company: '摹客科技',
    group: '其他',
    isStarred: true,
    isFavorite: true,
    avatar: '盖',
    isTest: true
  },
  {
    id: 'test-3',
    name: '王伟',
    email: 'wangw@Spt.com',
    mobile: '137****9999',
    position: '技术总监',
    company: '速信达集团',
    group: '中层干部',
    isStarred: true,
    avatar: '王',
    isTest: true
  },
  {
    id: 'test-4',
    name: '李娜',
    email: 'lin@Spt.com',
    mobile: '136****7777',
    position: '部门经理',
    company: '速信达集团',
    group: '中层干部',
    avatar: '李',
    isTest: true
  },
];

type ViewMode = 'list' | 'table';

export default function ContactsPage() {
  const { showToast } = useToast();
  const [selectedGroup, setSelectedGroup] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedContacts, setSelectedContacts] = useState<(number | string)[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>(mockContactGroups);

  // 加载联系人列表
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const userList = await getSystemUsers();

      const transformedContacts: Contact[] = userList.map((user: any) => ({
        id: user.id,
        name: user.name || user.phone,
        email: user.email || `${user.phone}@aimail.com`,
        phone: user.phone,
        mobile: user.phone ? `${user.phone.slice(0, 3)}****${user.phone.slice(-4)}` : undefined,
        position: user.position || undefined,
        company: user.company || undefined,
        group: user.group || '其他',
        isStarred: user.isStarred || false,
        isFavorite: user.isFavorite || false,
        avatar: (user.name || user.phone || '').charAt(0),
        isTest: false,
      }));

      if (transformedContacts.length === 0) {
        throw new Error('暂无联系人数据');
      }

      // 更新联系人群组统计
      const groupCounts: Record<string, number> = {};
      transformedContacts.forEach(contact => {
        const group = contact.group || '其他';
        groupCounts[group] = (groupCounts[group] || 0) + 1;
      });

      const updatedGroups = contactGroups.map(group => ({
        ...group,
        count: group.id === 1 ? transformedContacts.length : (groupCounts[group.name] || 0)
      }));
      setContactGroups(updatedGroups);
      setContacts(transformedContacts);
    } catch (error) {
      console.error('加载联系人失败:', error);
      // API 失败时显示测试数据
      setContacts(testContacts);
      showToast('加载联系人失败，显示测试数据', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === 1 || contact.group === contactGroups.find(g => g.id === selectedGroup)?.name;
    return matchesSearch && matchesGroup;
  });

  const toggleSelectContact = (id: number | string) => {
    setSelectedContacts(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleFavorite = (e: React.MouseEvent, id: number | string) => {
    e.stopPropagation();
    console.log('Toggle favorite:', id);
  };

  return (
    <div className="h-full flex bg-white">
      {/* 中间 - 联系人群组 */}
      <div className="w-64 border-r border-slate-200 flex flex-col bg-white">
        {/* 搜索框 */}
        <div className="p-3 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索联系人"
              className="w-full pl-9 pr-3 py-2 bg-slate-100 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>
        </div>

        {/* 分组列表 */}
        <div className="flex-1 overflow-y-auto p-2">
          {/* 全部联系人 */}
          <button
            onClick={() => setSelectedGroup(1)}
            className={`w-full px-3 py-2.5 mb-1 rounded-md flex items-center justify-between transition-colors ${
              selectedGroup === 1 ? 'bg-blue-50' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded flex items-center justify-center ${
                selectedGroup === 1 ? 'bg-blue-100' : 'bg-slate-100'
              }`}>
                <Users className={`w-4 h-4 ${
                  selectedGroup === 1 ? 'text-blue-600' : 'text-slate-500'
                }`} />
              </div>
              <span className={`text-sm font-medium ${
                selectedGroup === 1 ? 'text-blue-700' : 'text-slate-700'
              }`}>
                全部联系人
              </span>
            </div>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {contacts.length}
            </span>
          </button>

          {/* 联系人分组 */}
          <div className="mt-2 space-y-0.5">
            {contactGroups.slice(1).map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`w-full px-3 py-2 rounded-md flex items-center justify-between transition-colors ${
                  selectedGroup === group.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className={`text-sm ${
                    selectedGroup === group.id ? 'text-blue-700 font-medium' : 'text-slate-700'
                  }`}>
                    {group.name}
                  </span>
                </div>
                <span className="text-xs text-slate-500">{group.count}</span>
              </button>
            ))}
          </div>

          {/* 星标联系人 */}
          <div className="mt-4">
            <button className="w-full px-3 py-2 rounded-md flex items-center gap-2.5 hover:bg-slate-50 transition-colors">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm text-slate-700">星标联系人</span>
            </button>
          </div>
        </div>
      </div>

      {/* 右侧 - 联系人列表 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="border-b border-slate-200 px-4 py-3 bg-white">
          <div className="flex items-center justify-between mb-3">
            {/* 添加/管理按钮 */}
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md font-medium flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" />
                添加
              </button>
              <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm rounded-md font-medium flex items-center gap-2 transition-colors">
                管理
              </button>
            </div>

            {/* 搜索框 */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索联系人姓名、邮箱或公司"
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* 视图切换和添加按钮 */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-md transition-colors">
                <Filter className="w-4 h-4 text-slate-600" />
              </button>
              <div className="flex items-center bg-slate-100 rounded-md p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${
                    viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-slate-200'
                  }`}
                >
                  <List className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded ${
                    viewMode === 'table' ? 'bg-white shadow' : 'hover:bg-slate-200'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md font-medium flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" />
                添加联系人
              </button>
            </div>
          </div>

          {/* 批量操作栏 */}
          {selectedContacts.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md border border-blue-100">
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
                删除
              </button>
              <div className="flex-1" />
              <button 
                onClick={() => setSelectedContacts([])}
                className="p-1 hover:bg-white rounded transition-colors"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* 联系人列表/表格 */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
          {viewMode === 'list' ? (
            /* 列表视图 - 卡片式 */
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
                    {contact.avatar}
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
                    <button className="p-2 hover:bg-slate-200 rounded-md transition-colors">
                      <Mail className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-md transition-colors">
                      <Phone className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-md transition-colors">
                      <MoreVertical className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              {/* 表头 */}
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-4 text-xs font-medium text-slate-500">
                <div className="w-8 flex-shrink-0"></div>
                <div className="w-48 flex-shrink-0">联系人名称</div>
                <div className="flex-1">邮箱</div>
                <div className="w-48 flex-shrink-0">分组</div>
                <div className="w-40 flex-shrink-0">电话</div>
                <div className="w-32 flex-shrink-0">生日</div>
              </div>

              {/* 联系人列表 */}
              <div className="divide-y divide-slate-100">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="px-4 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                  >
                    {/* 选择框 */}
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => toggleSelectContact(contact.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />

                    {/* 联系人名称 */}
                    <div className="w-48 flex-shrink-0 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {contact.avatar}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-slate-900">{contact.name}</span>
                        {contact.isStarred && (
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        )}
                      </div>
                    </div>

                    {/* 邮箱 */}
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-slate-600 truncate block">
                        {contact.email}
                      </span>
                    </div>

                    {/* 分组 */}
                    <div className="w-48 flex-shrink-0">
                      <span className="text-sm text-slate-600">{contact.group || '-'}</span>
                    </div>

                    {/* 电话 */}
                    <div className="w-40 flex-shrink-0">
                      <span className="text-sm text-slate-600">{contact.mobile || '-'}</span>
                    </div>

                    {/* 生日 */}
                    <div className="w-32 flex-shrink-0">
                      <span className="text-sm text-slate-400">{contact.birthday || '-'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 分页 */}
        <div className="bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-slate-600">
            显示 {filteredContacts.length} / {contacts.length} 位联系人
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              上一页
            </button>
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
