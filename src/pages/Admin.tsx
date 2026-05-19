import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Newspaper, Package, Briefcase, 
  MapPin, LogOut, Plus, Trash2, Edit, Save, X, Image as ImageIcon
} from 'lucide-react';
import { auth, signInWithGoogle, logout } from '../lib/firebase';
import { dataService } from '../services/dataService';
import { onAuthStateChanged, type User } from 'firebase/auth';

const AdminPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'news' | 'products' | 'jobs' | 'distributors'>('news');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center">
          <h1 className="text-3xl font-black text-blue-900 mb-6">CMS NYNA</h1>
          <p className="text-gray-500 mb-8">Vui lòng đăng nhập để quản trị nội dung website.</p>
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-800 transition-all"
          >
            Đăng nhập với Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 hidden md:flex flex-col">
        <h2 className="text-2xl font-black mb-10 tracking-tighter">NYNA CMS</h2>
        <nav className="flex-1 space-y-2">
          {[
            { id: 'news', icon: <Newspaper size={20} />, label: 'Tin tức' },
            { id: 'products', icon: <Package size={20} />, label: 'Sản phẩm' },
            { id: 'jobs', icon: <Briefcase size={20} />, label: 'Tuyển dụng' },
            { id: 'distributors', icon: <MapPin size={20} />, label: 'Nhà phân phối' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-white text-blue-900' : 'hover:bg-white/10'
              }`}
            >
              {tab.icon}
              <span className="font-bold text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden">
               {user.photoURL && <img src={user.photoURL} alt="Avatar" />}
            </div>
            <div className="overflow-hidden">
              <div className="text-[12px] font-bold truncate">{user.displayName}</div>
              <div className="text-[10px] text-blue-300 truncate">{user.email}</div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-300 transition-all"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm">Đăng xuất</span>
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

  const load = () => dataService.list('news').then(setItems);
  useEffect(() => { load(); }, []);

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
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-xl mb-8 border border-blue-50">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề</label>
              <input 
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none"
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ngày đăng</label>
              <input 
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none"
                placeholder="20/05/2024"
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})} 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">URL Hình ảnh</label>
              <input 
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none"
                value={formData.image} 
                onChange={e => setFormData({...formData, image: e.target.value})} 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Tóm tắt</label>
              <textarea 
                required
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none h-24"
                value={formData.excerpt} 
                onChange={e => setFormData({...formData, excerpt: e.target.value})} 
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold">Lưu bài viết</button>
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
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', brand: 'NYNA', image: '', price: '' });

  const load = () => dataService.list('products').then(setItems);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.create('products', { 
      ...formData, 
      price: Number(formData.price),
      features: [{label: 'Nổi bật', icon: 'zap'}] 
    });
    setIsAdding(false);
    setFormData({ title: '', brand: 'NYNA', image: '', price: '' });
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-blue-900">Quản lý sản phẩm</h2>
        <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 transition-all">
          <Plus size={20} /> Thêm sản phẩm
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-xl mb-8 border border-blue-50">
           <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm</label>
                <input required className="w-full p-3 border rounded-xl" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Thương hiệu</label>
                <select className="w-full p-3 border rounded-xl" value={formData.brand} onChange={e=>setFormData({...formData, brand: e.target.value})}>
                  <option>NYNA</option>
                  <option>LYNA</option>
                  <option>SILA</option>
                  <option>TONY</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Giá bán (VND)</label>
                <input type="number" required className="w-full p-3 border rounded-xl" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">URL Hình ảnh</label>
                <input required className="w-full p-3 border rounded-xl" value={formData.image} onChange={e=>setFormData({...formData, image: e.target.value})} />
              </div>
           </div>
           <div className="flex gap-3">
            <button type="submit" className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold">Lưu sản phẩm</button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 rounded-xl font-bold text-gray-400">Hủy</button>
           </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <img src={item.image} className="w-20 h-20 object-cover rounded-xl" alt="P" />
            <div className="flex-1">
              <h4 className="font-bold text-blue-900">{item.title}</h4>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-500 uppercase">{item.brand}</span>
                <span className="text-[11px] font-bold text-emerald-600">{new Intl.NumberFormat('vi-VN').format(item.price || 0)}đ</span>
              </div>
            </div>
            <button onClick={async () => { if(confirm('Xóa?')) { await dataService.delete('products', item.id); load(); } }} className="text-red-400 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
          </div>
        ))}
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
