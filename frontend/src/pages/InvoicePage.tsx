import { useState } from 'react';
import { 
  Upload, 
  Forward, 
  Star, 
  Download, 
  Trash2, 
  Search, 
  ChevronDown,
  FileText,
  Calendar,
  Building2,
  Tag
} from 'lucide-react';

interface Invoice {
  id: number;
  title: string;
  type: '增值税专票' | '增值税普票' | '电子发票';
  category: '服务' | '商品' | '其他';
  amount: number;
  date: string;
  payer: string;
  project: string;
  isStarred?: boolean;
}

// 发票数据（测试数据）
const invoices: Invoice[] = [
  {
    id: 1,
    title: '上海开心能源科技股份有限公司',
    type: '增值税专票',
    category: '服务',
    amount: 98885.00,
    date: '2027 年 11 月 21 日',
    payer: '中国平安财产保险股份有限公司北京朝阳...',
    project: '*劳务*维修费',
    isStarred: false
  },
  {
    id: 2,
    title: '北京京东世纪贸易有限公司',
    type: '电子发票',
    category: '商品',
    amount: 3599.00,
    date: '2027 年 11 月 20 日',
    payer: '速信达集团',
    project: '办公用品 - 电脑配件',
    isStarred: true
  },
  {
    id: 3,
    title: '阿里巴巴云计算有限公司',
    type: '增值税专票',
    category: '服务',
    amount: 15800.00,
    date: '2027 年 11 月 18 日',
    payer: '速信达集团',
    project: '云服务费用 - 2027 年 11 月',
    isStarred: false
  },
];

export default function InvoicePage() {
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSelect = (id: number) => {
    setSelectedInvoices(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedInvoices(invoices.map(i => i.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const toggleStar = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    console.log('Toggle star:', id);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.payer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || invoice.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="h-full flex bg-white">
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="border-b border-slate-200 p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            {/* 操作按钮 */}
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md font-medium flex items-center gap-2 transition-colors">
                <Upload className="w-4 h-4" />
                上传发票
              </button>
              <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm rounded-md font-medium flex items-center gap-2 transition-colors">
                <Forward className="w-4 h-4" />
                转发
              </button>
              <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm rounded-md font-medium flex items-center gap-2 transition-colors">
                <Star className="w-4 h-4" />
                标星
              </button>
              <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm rounded-md font-medium flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                下载
              </button>
              <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm rounded-md font-medium flex items-center gap-2 transition-colors">
                <Trash2 className="w-4 h-4" />
                删除
              </button>
            </div>

            {/* 筛选和搜索 */}
            <div className="flex items-center gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全部</option>
                <option value="增值税专票">增值税专票</option>
                <option value="增值税普票">增值税普票</option>
                <option value="电子发票">电子发票</option>
              </select>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索发票信息"
                  className="w-64 pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 批量操作栏 */}
          {selectedInvoices.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md border border-blue-100">
              <span className="text-sm text-blue-700 ml-2">
                已选择 {selectedInvoices.length} 张发票
              </span>
              <div className="h-4 w-px bg-blue-200 mx-2" />
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-700 hover:bg-white rounded transition-colors">
                <Download className="w-4 h-4" />
                下载
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-700 hover:bg-white rounded transition-colors">
                <Forward className="w-4 h-4" />
                转发
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-700 hover:bg-white rounded transition-colors">
                <Trash2 className="w-4 h-4" />
                删除
              </button>
              <div className="flex-1" />
              <button 
                onClick={() => setSelectedInvoices([])}
                className="p-1 hover:bg-white rounded transition-colors"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* 发票列表 */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
          {/* 新增提示 */}
          {filteredInvoices.length > 0 && (
            <div className="mb-4">
              <span className="text-sm text-slate-600">
                新增（{filteredInvoices.length}张发票）
              </span>
            </div>
          )}

          {/* 发票卡片列表 */}
          <div className="space-y-3">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* 选择框 */}
                  <input
                    type="checkbox"
                    checked={selectedInvoices.includes(invoice.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelect(invoice.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />

                  {/* 发票图标 */}
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>

                  {/* 发票信息 */}
                  <div className="flex-1 min-w-0">
                    {/* 标题和标签 */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-slate-900 truncate">
                          {invoice.title}
                        </h3>
                        <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded">
                          {invoice.type}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                          {invoice.category}
                        </span>
                      </div>
                      <button
                        onClick={(e) => toggleStar(e, invoice.id)}
                        className="p-1 hover:bg-slate-100 rounded"
                      >
                        <Star className={`w-4 h-4 ${
                          invoice.isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                        }`} />
                      </button>
                    </div>

                    {/* 金额 */}
                    <div className="text-lg font-semibold text-slate-900 mb-3">
                      ¥ {invoice.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </div>

                    {/* 详细信息 */}
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-500">时间</span>
                        <span className="text-slate-900">{invoice.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-500">付款方</span>
                        <span className="text-slate-900 truncate">{invoice.payer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-500">项目</span>
                        <span className="text-slate-900">{invoice.project}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {filteredInvoices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-48 h-48 relative mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-24 bg-blue-100 rounded-lg border-2 border-blue-300 flex items-center justify-center">
                    <div className="text-4xl">💻</div>
                  </div>
                </div>
                <div className="absolute top-0 left-0 w-4 h-4 bg-yellow-300 rounded-full"></div>
                <div className="absolute top-4 right-4 w-3 h-3 bg-green-300 rounded-full"></div>
                <div className="absolute bottom-0 left-8 w-3 h-3 bg-pink-300 rounded-full"></div>
                <div className="absolute -top-4 right-8 w-12 h-12 bg-blue-50 rounded-full border-2 border-blue-300 flex items-center justify-center">
                  <span className="text-blue-500 text-xs">🧾</span>
                </div>
              </div>
              <p className="text-slate-500 text-sm">暂无发票</p>
              <p className="text-slate-400 text-xs mt-2">点击"上传发票"添加新发票</p>
            </div>
          )}
        </div>

        {/* 分页 */}
        <div className="bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 mr-2">
              共 {filteredInvoices.length} 张发票
            </span>
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
