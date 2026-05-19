import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Newspaper, Package, Briefcase, 
  MapPin, LogOut, Plus, Trash2, Edit, Save, X, Image as ImageIcon
} from 'lucide-react';
import { auth, signInWithGoogle, logout } from '../lib/firebase';
import { dataService } from '../services/dataService';
import { onAuthStateChanged, type User } from 'firebase/auth';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('nyna_admin_auth') === 'true';
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'news' | 'products' | 'jobs' | 'distributors'>('news');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === '123456123456') {
      setIsAuthenticated(true);
      sessionStorage.setItem('nyna_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Tài khoản hoặc mật khẩu không đúng');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nyna_admin_auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-blue-900 font-bold mb-4">Đang khởi tạo hệ thống...</div>
        <a href="/" className="text-gray-400 text-sm hover:underline">Quay về trang chủ</a>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl max-w-md w-full border border-blue-50">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <LayoutDashboard className="text-blue-900 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-blue-900 mb-2 text-center uppercase tracking-tighter">NYNA CMS</h1>
          <p className="text-gray-500 mb-8 text-center text-sm">Hệ thống quản trị nội dung website</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Tài khoản</label>
              <input 
                type="text"
                required
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-medium"
                placeholder="Nhập tài khoản"
                value={loginData.username}
                onChange={e => setLoginData({...loginData, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Mật khẩu</label>
              <input 
                type="password"
                required
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-medium"
                placeholder="Nhập mật khẩu"
                value={loginData.password}
                onChange={e => setLoginData({...loginData, password: e.target.value})}
              />
            </div>

            {loginError && (
              <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl text-center">
                {loginError}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider mt-4"
            >
              Đăng nhập hệ thống
            </button>
            
            <a 
              href="/"
              className="block w-full py-4 text-center text-gray-400 font-bold hover:text-blue-900 transition-all text-sm"
            >
              Quay lại trang chủ
            </a>
          </form>
          
          <div className="mt-8 pt-8 border-t border-gray-100 text-[10px] text-center text-gray-400 uppercase tracking-widest leading-relaxed">
            Mặc định: admin / 123456123456
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-blue-900 text-white p-8 hidden md:flex flex-col border-r border-white/5">
        <h2 className="text-3xl font-black mb-12 tracking-tighter uppercase">NYNA</h2>
        <nav className="flex-1 space-y-3">
          {[
            { id: 'news', icon: <Newspaper size={20} />, label: 'Quản lý Tin tức' },
            { id: 'products', icon: <Package size={20} />, label: 'Quản lý Sản phẩm' },
            { id: 'jobs', icon: <Briefcase size={20} />, label: 'Quản lý Tuyển dụng' },
            { id: 'distributors', icon: <MapPin size={20} />, label: 'Nhà phân phối' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === tab.id ? 'bg-white text-blue-900 shadow-xl shadow-black/10' : 'hover:bg-white/10 text-blue-100'
              }`}
            >
              {tab.icon}
              <span className="font-bold text-sm tracking-wide">{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-8 border-t border-white/10">
          <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center font-black text-white shadow-lg">
              AD
            </div>
            <div className="overflow-hidden">
              <div className="text-[14px] font-black tracking-tight">Administrator</div>
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">NYNA Manager</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-red-500/20"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm uppercase tracking-wider">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'news' && <NewsManager />}
          {activeTab === 'products' && <ProductManager />}
          {activeTab === 'jobs' && <JobManager />}
          {activeTab === 'distributors' && <DistributorManager />}
        </div>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS (MANAGERS) ---

const NewsManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', excerpt: '', image: '', content: '' });
  const [uploading, setUploading] = useState(false);

  const load = () => dataService.list('news').then(setItems);
  useEffect(() => { load(); }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Dung lượng ảnh quá lớn (Vui lòng chọn ảnh < 1MB)");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.create('news', formData);
    setIsAdding(false);
    setFormData({ title: '', date: '', excerpt: '', image: '', content: '' });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-blue-900">Quản lý tin tức</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-emerald-500 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus size={20} /> Thêm bài viết
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-xl mb-8 border border-blue-50">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề bài viết</label>
              <input 
                required
                className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-900 focus:bg-white outline-none transition-all"
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Ngày đăng</label>
              <input 
                required
                className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-900 focus:bg-white outline-none transition-all"
                placeholder="20/05/2024"
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})} 
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Hình ảnh bài viết</label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 hover:border-blue-900 transition-all bg-gray-50">
                    <ImageIcon className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-500">{uploading ? 'Đang tải...' : 'Chọn ảnh từ máy'}</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
                {formData.image && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border">
                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Tóm tắt nội dung</label>
              <textarea 
                required
                className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-900 focus:bg-white outline-none transition-all h-24"
                value={formData.excerpt} 
                onChange={e => setFormData({...formData, excerpt: e.target.value})} 
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={uploading} className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50">Lưu bài viết</button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 rounded-xl font-bold text-gray-500">Hủy</button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                <img src={item.image} className="w-full h-full object-cover" alt="Thumb" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900">{item.title}</h4>
                <p className="text-[12px] text-gray-400">{item.date}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={async () => { if(confirm('Xóa?')) { await dataService.delete('news', item.id); load(); } }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MOCK PRODUCT MANAGER (Similar pattern) ---
const ProductManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [formData, setFormData] = useState({ title: '', brand: '', image: '', price: '' });
  const [brandFormData, setBrandFormData] = useState({ name: '', desc: '', color: 'text-blue-600' });
  const [uploading, setUploading] = useState(false);

  const load = () => {
    dataService.list('products').then(setItems);
    dataService.list('brands').then(res => {
      setBrands(res);
      if (res.length > 0 && !formData.brand) {
        setFormData(prev => ({ ...prev, brand: res[0].name }));
      }
    });
  };

  useEffect(() => { load(); }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      alert("Dung lượng ảnh quá lớn (Vui lòng chọn ảnh < 1MB)");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.create('products', { 
      ...formData, 
      price: Number(formData.price),
      features: [{label: 'Nổi bật', icon: 'zap'}] 
    });
    setIsAdding(false);
    setFormData({ title: '', brand: brands[0]?.name || 'NYNA', image: '', price: '' });
    load();
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.create('brands', brandFormData);
    setIsAddingBrand(false);
    setBrandFormData({ name: '', desc: '', color: 'text-blue-600' });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-blue-900">Quản lý sản phẩm & Thương hiệu</h2>
        <div className="flex gap-3">
          <button onClick={() => setIsAddingBrand(true)} className="bg-pink-500 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/20">
            <Plus size={20} /> Thêm Thương hiệu
          </button>
          <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            <Plus size={20} /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Brand Form */}
      {isAddingBrand && (
        <form onSubmit={handleAddBrand} className="bg-pink-50/50 p-8 rounded-[32px] shadow-xl mb-8 border border-pink-100">
           <h3 className="text-xl font-black text-pink-600 mb-6 uppercase tracking-tight">Cấu hình thương hiệu</h3>
           <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Tên thương hiệu</label>
                <input required className="w-full p-3 bg-white border-2 border-transparent focus:border-pink-500 rounded-xl outline-none transition-all" value={brandFormData.name} onChange={e=>setBrandFormData({...brandFormData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Màu sắc nhận diện</label>
                <select className="w-full p-3 bg-white border-2 border-transparent focus:border-pink-500 rounded-xl outline-none transition-all" value={brandFormData.color} onChange={e=>setBrandFormData({...brandFormData, color: e.target.value})}>
                  <option value="text-blue-600">Xanh dương (Blue)</option>
                  <option value="text-pink-600">Hồng (Pink)</option>
                  <option value="text-emerald-600">Xanh lá (Emerald)</option>
                  <option value="text-indigo-600">Tím xanh (Indigo)</option>
                  <option value="text-orange-600">Cam (Orange)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Mô tả ngắn</label>
                <input required className="w-full p-3 bg-white border-2 border-transparent focus:border-pink-500 rounded-xl outline-none transition-all" value={brandFormData.desc} onChange={e=>setBrandFormData({...brandFormData, desc: e.target.value})} />
              </div>
           </div>
           <div className="flex gap-3">
            <button type="submit" className="bg-pink-600 text-white px-8 py-3 rounded-xl font-bold">Lưu thương hiệu</button>
            <button type="button" onClick={() => setIsAddingBrand(false)} className="px-8 py-3 rounded-xl font-bold text-gray-400">Hủy</button>
           </div>
        </form>
      )}

      {/* Product Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-xl mb-8 border border-blue-50">
           <h3 className="text-xl font-black text-blue-900 mb-6 uppercase tracking-tight">Chi tiết sản phẩm</h3>
           <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Tên sản phẩm</label>
                <input required className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-xl outline-none transition-all" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Thuộc thương hiệu</label>
                <select className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-xl outline-none transition-all font-bold" value={formData.brand} onChange={e=>setFormData({...formData, brand: e.target.value})}>
                  {brands.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                  {brands.length === 0 && <option value="">Đang tải thương hiệu...</option>}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Giá bán dự kiến (VND)</label>
                <input type="number" required className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-xl outline-none transition-all" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Ảnh đại diện sản phẩm</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center gap-2 bg-gray-50 hover:border-blue-900 transition-all">
                      <ImageIcon className="text-gray-400 w-5 h-5" />
                      <span className="text-sm font-bold text-gray-400">{uploading ? 'Đang tải...' : 'Chọn từ máy'}</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                  {formData.image && <img src={formData.image} className="w-12 h-12 rounded-lg border object-cover shadow-sm" alt="p" />}
                </div>
              </div>
           </div>
           <div className="flex gap-3">
            <button type="submit" disabled={uploading} className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50">Lưu sản phẩm</button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 rounded-xl font-bold text-gray-400">Hủy</button>
           </div>
        </form>
      )}

      {/* Brands Summary List */}
      <div className="mb-12">
        <h3 className="text-sm font-black text-gray-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
          <div className="w-8 h-[2px] bg-pink-500 rounded-full"></div>
          Thương hiệu hiện có
        </h3>
        <div className="flex flex-wrap gap-4">
          {brands.map(brand => (
            <div key={brand.id} className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group">
              <div>
                <div className={`font-black uppercase tracking-tight text-sm ${brand.color}`}>{brand.name}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{brand.desc}</div>
              </div>
              <button 
                onClick={async () => { if(confirm('Xóa thương hiệu này sẽ ảnh hưởng đến lọc sản phẩm. Tiếp tục?')) { await dataService.delete('brands', brand.id); load(); } }}
                className="p-2 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {brands.length === 0 && <p className="text-gray-400 text-xs font-bold italic">Chưa có thương hiệu được thiết lập.</p>}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black text-gray-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
          <div className="w-8 h-[2px] bg-blue-500 rounded-full"></div>
          Kho hàng sản phẩm
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-blue-900 transition-all group">
              <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-50">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="P" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 leading-tight mb-1">{item.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">{item.brand}</span>
                  <span className="text-[11px] font-bold text-emerald-600">{new Intl.NumberFormat('vi-VN').format(item.price || 0)}đ</span>
                </div>
              </div>
              <button onClick={async () => { if(confirm('Xóa sản phẩm?')) { await dataService.delete('products', item.id); load(); } }} className="text-red-200 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const JobManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', location: '', salary: '', deadline: '' });

  const load = () => dataService.list('jobs').then(setItems);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.create('jobs', formData);
    setIsAdding(false);
    setFormData({ title: '', location: '', salary: '', deadline: '' });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-blue-900">Quản lý tuyển dụng</h2>
        <button onClick={() => setIsAdding(true)} className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2">
          <Plus size={20} /> Thêm vị trí
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-xl mb-8 border border-blue-50">
           <div className="grid md:grid-cols-2 gap-6 mb-6">
              <input placeholder="Vị trí tuyển dụng" className="p-3 border rounded-xl" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} />
              <input placeholder="Địa điểm" className="p-3 border rounded-xl" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} />
              <input placeholder="Mức lương" className="p-3 border rounded-xl" value={formData.salary} onChange={e=>setFormData({...formData, salary: e.target.value})} />
              <input placeholder="Hạn nộp hồ sơ" className="p-3 border rounded-xl" value={formData.deadline} onChange={e=>setFormData({...formData, deadline: e.target.value})} />
           </div>
           <button type="submit" className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold">Lưu tin</button>
           <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 rounded-xl font-bold text-gray-400">Hủy</button>
        </form>
      )}

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-blue-900 text-lg">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.location} • {item.salary} • Hạn: {item.deadline}</p>
            </div>
            <button onClick={async () => { if(confirm('Xóa?')) { await dataService.delete('jobs', item.id); load(); } }} className="text-red-400"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const DistributorManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', phone: '', region: 'Miền Nam' });

  const load = () => dataService.list('distributors').then(setItems);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.create('distributors', formData);
    setIsAdding(false);
    setFormData({ name: '', address: '', phone: '', region: 'Miền Nam' });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-blue-900">Nhà phân phối</h2>
        <button onClick={() => setIsAdding(true)} className="bg-indigo-500 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2">
          <Plus size={20} /> Thêm NPP
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-xl mb-8 border border-blue-50">
           <div className="grid md:grid-cols-2 gap-6 mb-6">
              <input placeholder="Tên đại lý/NPP" className="p-3 border rounded-xl" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
              <input placeholder="Địa chỉ" className="p-3 border rounded-xl" value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} />
              <input placeholder="Số điện thoại" className="p-3 border rounded-xl" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} />
              <select className="p-3 border rounded-xl" value={formData.region} onChange={e=>setFormData({...formData, region: e.target.value})}>
                <option>Miền Bắc</option>
                <option>Miền Trung</option>
                <option>Miền Nam</option>
              </select>
           </div>
           <button type="submit" className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold">Lưu nhà phân phối</button>
           <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 rounded-xl font-bold text-gray-400">Hủy</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between mb-2">
              <h4 className="font-bold text-blue-900 uppercase">{item.name}</h4>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold">{item.region}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">{item.address}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-blue-900">{item.phone}</span>
              <button onClick={async () => { if(confirm('Xóa?')) { await dataService.delete('distributors', item.id); load(); } }} className="text-red-400"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
