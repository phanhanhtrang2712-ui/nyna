import { 
  Phone, Mail, MapPin, Search, Heart, ShoppingCart, 
  CheckCircle2, Factory, Truck, Users, Headset,
  Facebook, Youtube, Send, ChevronRight, Menu, X, ArrowUpRight,
  Wind, ShieldCheck, Feather, Droplets, Zap, ArrowRight, Play, PhoneCall, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';

// --- DATA TYPES ---
interface NewsItem {
  id?: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
}

interface ProductItem {
  id?: string;
  title: string;
  brand: string;
  image: string;
  features: { label: string; icon: any }[];
  color?: string;
  price?: number;
}

interface JobItem {
  id?: string;
  title: string;
  location: string;
  salary: string;
  deadline: string;
}

interface DistributorItem {
  id?: string;
  name: string;
  address: string;
  phone: string;
  region: string;
}

// --- COMPONENTS ---

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full relative z-50">
      <div className="bg-blue-900 text-white text-[11px] py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>0916 070 421 - 0916 070 422</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Thứ 2 - Thứ 7: 7:30 - 17:30</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>info@nyna.com.vn</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Link to="/cms" className="bg-white/10 px-3 py-1 rounded-md hover:bg-white/20 transition-all font-bold text-emerald-400">Hệ thống phân phối</Link>
            <span className="hover:underline cursor-pointer">Tuyển dụng</span>
            <span className="hover:underline cursor-pointer">Tài liệu</span>
          </div>
        </div>
      </div>

      <nav className={`w-full transition-all duration-300 ${isScrolled ? 'fixed top-0 bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-white py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-4xl font-black tracking-tighter text-blue-900 flex flex-col items-center">
              <span className="leading-none uppercase">NYNA</span>
              <div className="flex gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {['TRANG CHỦ', 'GIỚI THIỆU', 'THƯƠNG HIỆU', 'SẢN PHẨM', 'TIN TỨC', 'VIDEO', 'LIÊN HỆ'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[13px] font-black text-blue-900 hover:text-pink-500 transition-colors tracking-tight uppercase">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6 text-blue-900">
               <Search className="w-5 h-5 cursor-pointer hover:text-pink-500 transition-colors" />
               <div className="relative cursor-pointer">
                 <ShoppingCart className="w-5 h-5" />
                 <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">0</span>
               </div>
            </div>
            <button className="bg-blue-900 text-white px-8 py-3 rounded-full text-[13px] font-black hover:bg-pink-500 hover:shadow-xl transition-all hidden md:block uppercase tracking-tight">
              Liên hệ ngay
            </button>
            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

const Hero = () => (
  <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50/50 via-white to-pink-50/30">
    <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/[0.02] skew-x-12 translate-x-32 pointer-events-none"></div>
    
    <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-5 py-2 rounded-xl text-sm font-black uppercase tracking-[0.2em] mb-8">
            <Zap size={16} fill="currentColor" /> NYNA
          </div>
          <h1 className="text-6xl md:text-[84px] font-black text-blue-900 leading-[0.95] mb-8 tracking-tighter uppercase">
            CHĂM SÓC <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">GIA ĐÌNH VIỆT</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-lg mb-12 leading-relaxed font-medium">
            Sản phẩm chất lượng cao tự hào là thương hiệu Việt. Vì cuộc sống khỏe mạnh và hạnh phúc hơn mỗi ngày cho mẹ và bé.
          </p>
          <div className="flex flex-wrap gap-5">
            <button className="bg-blue-900 text-white px-12 py-5 rounded-full font-black text-lg flex items-center gap-3 hover:translate-y-[-4px] hover:shadow-2xl transition-all shadow-xl shadow-blue-900/20 uppercase tracking-tight">
              Xem sản phẩm <ArrowRight size={22} />
            </button>
            <button className="bg-white text-blue-900 border-2 border-blue-100 px-12 py-5 rounded-full font-black text-lg hover:bg-gray-50 transition-all uppercase tracking-tight">
              Hợp tác đại lý
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative z-10 w-full aspect-square rounded-[80px] bg-white shadow-2xl border-4 border-white overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
              alt="Hero Product"
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay features matching image style */}
            <div className="absolute top-8 right-8 flex flex-col gap-4">
              {[
                { icon: <ShieldCheck size={18} />, label: "Chất lượng chuẩn quốc tế" },
                { icon: <Heart size={18} />, label: "An toàn cho mọi làn da" },
                { icon: <Zap size={18} />, label: "Thương hiệu Việt Nam" }
              ].map((f, i) => (
                <div key={i} className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white flex items-center gap-3 hover:bg-blue-900 hover:text-white transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tight">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Decorative gradients */}
          <div className="absolute -top-20 -right-20 w-[140%] h-[140%] bg-gradient-to-tr from-blue-400/10 to-pink-400/10 rounded-full blur-[100px] -z-10"></div>
        </motion.div>
      </div>
    </div>
  </section>
);

const BrandSection = () => {
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    dataService.list<any>('brands').then(res => {
      if (res.length > 0) setBrands(res);
      else {
        setBrands([
          { name: 'LYNA', description: 'Sản phẩm chăm sóc phụ nữ hiện đại', color: 'text-pink-600' },
          { name: 'SILA', description: 'Tã người lớn cao cấp', color: 'text-emerald-600' },
          { name: 'NYNA', description: 'Tã em bé êm mềm vượt trội', color: 'text-blue-600' },
          { name: 'TONY', description: 'Tấm lót / Miếng lót đa năng', color: 'text-indigo-600' },
        ]);
      }
    });
  }, []);

  return (
    <section className="py-24 container mx-auto px-6" id="brands">
      <div className="grid md:grid-cols-4 gap-10">
        {brands.map((brand, idx) => (
          <motion.div 
            key={brand.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="group p-10 rounded-[48px] bg-white border border-gray-100 hover:border-blue-600/20 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] transition-all cursor-pointer text-center"
          >
            <h3 className={`text-4xl font-black mb-3 tracking-tighter uppercase ${brand.color}`}>{brand.name}</h3>
            <p className="text-sm font-bold text-gray-400 mb-8 uppercase tracking-widest line-clamp-2">{brand.description}</p>
            <span className="inline-flex items-center gap-2 text-blue-600 font-black text-xs group-hover:gap-5 transition-all uppercase tracking-widest">
              Xem ngay <ChevronRight size={18} />
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const MissionSection = () => {
  const [mission, setMission] = useState<any>(null);

  useEffect(() => {
    dataService.list<any>('pages').then(pages => {
      const about = pages.find(p => p.slug === 'about' && p.show_on_home);
      if (about) setMission(about);
    });
  }, []);

  if (!mission) return null;

  return (
    <section className="bg-blue-900 py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 opacity-40"></div>
      <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
        >
          <span className="text-blue-400 font-black uppercase tracking-[0.4em] text-xs mb-8 block">TẦM NHÌN & SỨ MỆNH</span>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-12 tracking-tight leading-[1.1] uppercase">
            {mission.title}
          </h2>
          <div className="text-2xl text-blue-100/90 leading-[1.6] font-medium max-w-4xl mx-auto italic">
            "{mission.content}"
          </div>
          <div className="mt-16 flex justify-center gap-2">
            {[1,2,3].map(i => <div key={i} className={`h-1.5 rounded-full transition-all ${i===1 ? 'w-12 bg-pink-500' : 'w-4 bg-white/20'}`}></div>)}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const CatalogSection = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    dataService.list<ProductItem>('products').then(res => {
      if (res.length > 0) setProducts(res);
    });
  }, []);

  return (
    <section className="py-24 bg-white" id="sản phẩm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black text-blue-900 mb-6 tracking-tighter uppercase">DANH MỤC SẢN PHẨM</h2>
          <p className="text-lg font-bold text-gray-400 uppercase tracking-widest">Đa dạng sản phẩm - Đáp ứng mọi nhu cầu của bạn</p>
          <div className="w-24 h-2 bg-pink-500 mx-auto rounded-full mt-8"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
           {products.length > 0 ? products.map((cat) => (
             <div key={cat.id} className="bg-white rounded-[48px] border border-gray-100 shadow-sm p-8 group transition-all hover:shadow-2xl hover:-translate-y-3 cursor-pointer">
                <div className="mb-6 flex justify-between items-start">
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {cat.brand}
                  </div>
                  <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-pink-500 hover:text-white transition-all">
                     <Heart size={18} />
                  </button>
                </div>
                <h3 className="text-2xl font-black text-blue-900 leading-tight mb-6 line-clamp-1 group-hover:text-pink-500 transition-colors uppercase tracking-tight">{cat.title}</h3>
                <div className="h-56 rounded-[32px] overflow-hidden mb-8 bg-gray-50">
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {cat.features?.slice(0, 4).map(f => (
                    <div key={f.label} className="flex items-center gap-2">
                       <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                       </div>
                       <span className="text-[10px] font-bold text-gray-500 uppercase">{f.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
                   <div className="text-xl font-black text-blue-900">{new Intl.NumberFormat('vi-VN').format(cat.price || 0)}đ</div>
                   <button className="bg-blue-900 text-white p-3 rounded-2xl hover:bg-pink-500 transition-all">
                      <ShoppingCart size={18} />
                   </button>
                </div>
             </div>
           )) : <p className="col-span-full text-center text-gray-400 uppercase font-black py-20 italic">Đang cập nhật kho hàng...</p>}
        </div>
      </div>
    </section>
  );
};

const WhyChooseSection = () => (
  <section className="py-24 bg-gray-50/50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <h2 className="text-5xl font-black text-blue-900 tracking-tighter mb-4 uppercase">VÌ SAO CHỌN NYNA?</h2>
        <div className="w-20 h-1.5 bg-blue-900 mx-auto rounded-full"></div>
      </div>
      <div className="grid md:grid-cols-5 gap-12 text-center">
        {[
          { icon: <ShieldCheck />, title: "Chính hãng", desc: "Chất lượng chuẩn quốc tế, kiểm soát nghiêm ngặt." },
          { icon: <Factory />, title: "Hiện đại", desc: "Công nghệ tiên tiến, nhà máy sản xuất tự động." },
          { icon: <Truck />, title: "Toàn quốc", desc: "Hệ thống phân phối rộng khắp 63 tỉnh thành." },
          { icon: <Users />, title: "Đối tác", desc: "Chính sách hỗ trợ NPP, đại lý tốt nhất thị trường." },
          { icon: <Headset />, title: "Tận tâm", desc: "Đội ngũ chuyên gia sẵn sàng hỗ trợ 24/7." }
        ].map((item, idx) => (
          <div key={idx} className="group">
            <div className="w-20 h-20 bg-white shadow-lg rounded-[28px] flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-900 group-hover:text-white transition-all duration-500 group-hover:-translate-y-2">
              {React.cloneElement(item.icon as React.ReactElement, { size: 36, strokeWidth: 1.5 })}
            </div>
            <h4 className="text-lg font-black text-blue-900 mb-3 uppercase tracking-tight">{item.title}</h4>
            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[180px] mx-auto">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    dataService.list<NewsItem>('news').then(res => {
      setNews(res.slice(0, 3));
    });
  }, []);

  return (
    <section className="py-32 bg-white" id="tin tức">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
             <h2 className="text-5xl font-black text-blue-900 tracking-tighter uppercase mb-4">TIN TỨC MỚI NHẤT</h2>
             <p className="text-lg font-bold text-gray-400 uppercase tracking-[0.2em] leading-none">Cập nhật xu hướng & kiến thức chăm sóc</p>
          </div>
          <button className="text-blue-900 font-black flex items-center gap-3 hover:text-pink-500 transition-all uppercase tracking-widest text-sm bg-blue-50 px-8 py-3 rounded-full">
            Xem tất cả <ChevronRight size={18} />
          </button>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {news.map(item => (
            <div key={item.id} className="group cursor-pointer">
              <div className="h-72 rounded-[48px] overflow-hidden mb-10 shadow-xl border border-white relative">
                 <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                 <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl font-black text-[10px] uppercase text-blue-900">{item.date}</div>
              </div>
              <h3 className="text-2xl font-black text-blue-900 mb-4 group-hover:text-pink-500 transition-colors leading-tight uppercase tracking-tight line-clamp-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">{item.excerpt}</p>
              <button className="text-blue-900 font-black text-xs flex items-center gap-3 hover:gap-5 transition-all uppercase tracking-[0.2em]">Đọc bài viết <ArrowRight size={18} /></button>
            </div>
          ))}
          {news.length === 0 && <p className="col-span-full text-center text-gray-400 py-10 uppercase font-black">Chưa có bài viết mới.</p>}
        </div>
      </div>
    </section>
  );
};

const JobsSection = () => {
  const [jobs, setJobs] = useState<JobItem[]>([]);

  useEffect(() => {
    dataService.list<JobItem>('jobs').then(setJobs);
  }, []);

  if (jobs.length === 0) return null;

  return (
    <section className="py-24 bg-blue-50/50" id="tuyển dụng">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-blue-900 uppercase tracking-tighter">CƠ HỘI NGHỀ NGHIỆP</h2>
          <div className="w-16 h-1 bg-pink-500 mx-auto mt-6 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-10 rounded-[48px] shadow-sm hover:shadow-2xl transition-all border border-white group">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-black text-blue-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{job.title}</h3>
                <span className="bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Tuyển gấp</span>
              </div>
              <div className="flex flex-wrap gap-8 text-[13px] text-gray-500 font-bold uppercase mb-10">
                <div className="flex items-center gap-3"><MapPin size={18} className="text-blue-400" /> {job.location}</div>
                <div className="flex items-center gap-3"><Users size={18} className="text-blue-400" /> {job.salary}</div>
                <div className="flex items-center gap-3"><Zap size={18} className="text-blue-400" /> {job.deadline}</div>
              </div>
              <button className="w-full bg-blue-900 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-pink-500 transition-all">Ứng tuyển ngay</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DistributorsSection = () => {
  const [distributors, setDistributors] = useState<DistributorItem[]>([]);
  const [activeRegion, setActiveRegion] = useState('Tất cả');

  useEffect(() => {
    dataService.list<DistributorItem>('distributors').then(setDistributors);
  }, []);

  const regions = ['Tất cả', ...Array.from(new Set(distributors.map(d => d.region)))];
  const filtered = activeRegion === 'Tất cả' 
    ? distributors 
    : distributors.filter(d => d.region === activeRegion);

  if (distributors.length === 0) return null;

  return (
    <section className="py-32 bg-white" id="hệ thống phân phối">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
           <div>
             <h2 className="text-5xl font-black text-blue-900 tracking-tighter uppercase mb-4">HỆ THỐNG PHÂN PHỐI</h2>
             <p className="text-lg font-bold text-gray-400 uppercase tracking-[0.2em]">Tìm điểm bán gần nhất của NYNA trên toàn quốc</p>
           </div>
           <div className="flex flex-wrap gap-3">
              {regions.map(r => (
                <button key={r} onClick={() => setActiveRegion(r)} className={`px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeRegion === r ? 'bg-blue-900 text-white shadow-xl' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                  {r}
                </button>
              ))}
           </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map((item) => (
            <div key={item.id} className="p-10 rounded-[64px] border border-gray-100 hover:border-blue-900 transition-all group bg-white shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]">
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-all transform group-hover:rotate-6">
                  <MapPin size={28} />
                </div>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] bg-blue-50 px-4 py-1.5 rounded-full">{item.region}</span>
              </div>
              <h3 className="text-2xl font-black text-blue-900 mb-6 uppercase tracking-tight leading-tight line-clamp-2">{item.name}</h3>
              <p className="text-gray-500 font-medium mb-10 leading-relaxed min-h-[60px]">{item.address}</p>
              <div className="flex items-center gap-4 text-blue-900 group-hover:text-pink-500 transition-colors">
                <div className="w-10 h-10 rounded-full border border-blue-50 flex items-center justify-center"><Phone size={16} /></div>
                <span className="text-xl font-black">{item.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [activePage, setActivePage] = useState<any>(null);

  useEffect(() => {
    dataService.list<any>('pages').then(setPages);
  }, []);

  const policyPages = pages.filter(p => p.category === 'policy');
  const partnerPages = pages.filter(p => p.category === 'partner');

  return (
    <footer className="bg-blue-900 text-white pt-32 pb-16 relative overflow-hidden">
      {/* Decorative blur */}
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-blue-800 rounded-full blur-[100px] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32 relative z-10">
        <div className="flex flex-col gap-8">
          <div className="text-5xl font-black tracking-tighter uppercase">NYNA</div>
          <p className="text-blue-100/70 font-medium leading-relaxed text-sm">
            Tự hào là đơn vị tiên phong mang đến các giải pháp chăm sóc gia đình tiêu chuẩn quốc tế cho người Việt.
          </p>
          <div className="flex gap-4">
             {[Facebook, Youtube, Send].map((Icon, i)=> (
               <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-pink-500 transition-all hover:-translate-y-1">
                  <Icon size={20} />
               </div>
             ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-black mb-10 uppercase tracking-[0.2em] text-pink-400">CHÍNH SÁCH</h4>
          <ul className="space-y-4 text-blue-100/60 font-bold text-sm uppercase tracking-wide">
            {policyPages.length > 0 ? policyPages.map(page => (
              <li key={page.id} onClick={() => setActivePage(page)} className="hover:text-white cursor-pointer transition-colors">{page.title}</li>
            )) : (
              <>
                <li className="hover:text-white cursor-pointer transition-colors opacity-40">Chính sách bảo mật</li>
                <li className="hover:text-white cursor-pointer transition-colors opacity-40">Cửa hàng ủy quyền</li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-black mb-10 uppercase tracking-[0.2em] text-pink-400">HỖ TRỢ ĐỐI TÁC</h4>
          <ul className="space-y-4 text-blue-100/60 font-bold text-sm uppercase tracking-wide">
            {partnerPages.length > 0 ? partnerPages.map(page => (
              <li key={page.id} onClick={() => setActivePage(page)} className="hover:text-white cursor-pointer transition-colors">{page.title}</li>
            )) : (
              <>
                <li className="hover:text-white cursor-pointer transition-colors opacity-40">Hợp tác đại lý</li>
                <li className="hover:text-white cursor-pointer transition-colors opacity-40">Quy trình nhập hàng</li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-black mb-10 uppercase tracking-[0.2em] text-pink-400">ĐĂNG KÝ NHẬN TIN</h4>
          <p className="text-blue-100/60 text-sm mb-8 font-medium">Nhận thông tin ưu đãi sớm nhất từ NYNA.</p>
          <div className="flex bg-white/5 border border-white/10 rounded-3xl p-1.5 focus-within:border-pink-500 transition-all">
             <input type="text" placeholder="Email của bạn..." className="bg-transparent border-none outline-none flex-1 px-4 text-sm font-bold placeholder:text-blue-100/30" />
             <button className="bg-pink-500 text-white p-4 rounded-2xl hover:bg-pink-600 transition-all">
                <Send size={18} />
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <p className="text-[11px] font-black text-blue-100/30 uppercase tracking-[0.3em]">
          © 2024 NYNA VIETNAM. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center gap-10">
           <Link to="/cms" className="text-[11px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-4 py-2 rounded-lg hover:bg-emerald-400 hover:text-blue-900 transition-all">ADMIN DASHBOARD</Link>
           <div className="text-[11px] font-black text-blue-100/30 uppercase tracking-[0.3em]">THIẾT KẾ BỞI NYNA</div>
        </div>
      </div>

      {/* Page Content Modal */}
      <AnimatePresence>
        {activePage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePage(null)}
              className="absolute inset-0 bg-blue-900/80 backdrop-blur-md"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="relative bg-white w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-[48px] p-12 shadow-2xl text-gray-900"
            >
              <button onClick={() => setActivePage(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all">
                <X size={24} />
              </button>
              <div className="mb-8">
                <span className="text-blue-500 font-black uppercase tracking-widest text-xs mb-2 block">{activePage.category === 'policy' ? 'Chính sách' : 'Đối tác'}</span>
                <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tighter">{activePage.title}</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
                {activePage.content}
              </div>
              <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
                <button onClick={() => setActivePage(null)} className="bg-blue-900 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs">Đóng lại</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sticky actions matching image */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-[100]">
        <motion.div whileHover={{ scale: 1.1 }} className="w-16 h-16 bg-blue-500 text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer border-4 border-white/20">
          <PhoneCall size={28} />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} className="w-16 h-16 bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer border-4 border-white/20">
          <MessageCircle size={28} />
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.1 }} 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-16 h-16 bg-blue-900 text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer border-4 border-white/20"
        >
          <ArrowUpRight size={28} />
        </motion.div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white selection:bg-pink-100 selection:text-pink-600">
      <Header />
      <Hero />
      <BrandSection />
      <MissionSection />
      <CatalogSection />
      <WhyChooseSection />
      <NewsSection />
      <JobsSection />
      <DistributorsSection />
      <Footer />
    </div>
  );
}
