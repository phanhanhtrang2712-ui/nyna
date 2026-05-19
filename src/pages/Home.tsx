import { 
  Phone, Mail, MapPin, Search, Heart, ShoppingCart, 
  CheckCircle2, Factory, Truck, Users, Headset,
  Facebook, Youtube, Send, ChevronRight, Menu, X, ArrowUpRight,
  Wind, ShieldCheck, Feather, Droplets, Zap
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

// --- CONSTANTS (Fallback) ---
const BRANDS = [
  { name: 'LYNA', desc: 'Sản phẩm chăm sóc phụ nữ hiện đại', color: 'text-pink-600' },
  { name: 'SILA', desc: 'Tã người lớn cao cấp', color: 'text-emerald-600' },
  { name: 'NYNA', desc: 'Tã em bé êm mềm vượt trội', color: 'text-blue-600' },
  { name: 'TONY', desc: 'Tấm lót / Miếng lót đa năng', color: 'text-indigo-600' },
];

const WHY_CHOOSE = [
  { title: 'Sản phẩm chính hãng', desc: 'Chất lượng đạt chuẩn, kiểm soát nghiêm ngặt', icon: <CheckCircle2 className="w-8 h-8 text-blue-600" /> },
  { title: 'Nhà máy hiện đại', desc: 'Công nghệ tiên tiến, đảm bảo chất lượng', icon: <Factory className="w-8 h-8 text-blue-600" /> },
  { title: 'Phân phối toàn quốc', desc: 'Hệ thống rộng khắp, giao hàng nhanh chóng', icon: <Truck className="w-8 h-8 text-blue-600" /> },
  { title: 'Hỗ trợ đối tác', desc: 'Chính sách tốt cho NPP, đại lý và cửa hàng', icon: <Users className="w-8 h-8 text-blue-600" /> },
  { title: 'Tư vấn tận tâm', desc: 'Đội ngũ chuyên nghiệp, hỗ trợ 24/7', icon: <Headset className="w-8 h-8 text-blue-600" /> }
];

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
            <Link to="/cms" className="bg-white/10 px-3 py-1 rounded-md hover:bg-white/20 transition-all font-bold text-emerald-400">Quản trị (CMS)</Link>
            <span className="hover:underline cursor-pointer">Hệ thống phân phối</span>
            <span className="hover:underline cursor-pointer">Tuyển dụng</span>
            <span className="hover:underline cursor-pointer">Tài liệu</span>
          </div>
        </div>
      </div>

      <nav className={`w-full transition-all duration-300 ${isScrolled ? 'fixed top-0 bg-white shadow-md py-2' : 'bg-white py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-4xl font-black tracking-tighter text-blue-900 flex flex-col items-center">
              <span className="leading-none uppercase">NYNA</span>
              <div className="flex gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <a href="#" className="text-[13px] font-bold text-gray-800 hover:text-blue-900 uppercase">TRANG CHỦ</a>
            <a href="#" className="text-[13px] font-bold text-gray-800 hover:text-blue-900 uppercase">GIỚI THIỆU</a>
            <a href="#brands" className="text-[13px] font-bold text-gray-800 hover:text-blue-900 uppercase">THƯƠNG HIỆU</a>
            <a href="#products" className="text-[13px] font-bold text-gray-800 hover:text-blue-900 uppercase">SẢN PHẨM</a>
            <a href="#news" className="text-[13px] font-bold text-gray-800 hover:text-blue-900 uppercase">TIN TỨC</a>
            <Link to="/cms" className="text-[13px] font-bold text-pink-600 hover:text-pink-700 uppercase">QUẢN TRỊ</Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="bg-blue-900 text-white px-6 py-2.5 rounded-full text-[13px] font-bold hover:bg-blue-800 transition-colors hidden md:block">
              Liên hệ ngay
            </button>
            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Menu omitted for brevity in this page file, same as App.tsx before */}
    </header>
  );
}

const Hero = () => (
  <section className="relative overflow-hidden pt-12 pb-24 lg:pt-24 lg:pb-32 bg-white">
    <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 transform origin-top-right -z-10"></div>
    <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span className="bg-pink-100 text-pink-600 px-4 py-1.5 rounded-lg text-sm font-bold tracking-wider inline-block mb-6 uppercase">NYNA</span>
        <h1 className="text-5xl lg:text-7xl font-black text-blue-900 leading-[1.1] mb-8 uppercase">Chăm sóc <br /> gia đình Việt</h1>
        <p className="text-lg text-gray-600 mb-10 max-w-md leading-relaxed">Sản phẩm chất lượng cao <br /> Vì cuộc sống khỏe mạnh và hạnh phúc hơn.</p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-900 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-blue-800 transition-all group">
            Xem sản phẩm <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="bg-white border-2 border-gray-200 text-gray-800 px-8 py-4 rounded-full font-bold hover:border-blue-900 hover:text-blue-900 transition-all">Hợp tác đại lý</button>
        </div>
      </div>
      <div className="relative">
        <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-[40px] shadow-2xl relative">
          <img src="https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800" alt="NYNA Products" className="w-full h-auto rounded-3xl" />
        </div>
      </div>
    </div>
  </section>
);

const BrandSection = () => (
  <section className="py-20 bg-gray-50" id="brands">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {BRANDS.map((brand) => (
          <div key={brand.name} className="text-center">
            <h3 className={`text-4xl font-black mb-4 ${brand.color} tracking-tight`}>{brand.name}</h3>
            <p className="text-gray-600 text-sm mb-6 px-4">{brand.desc}</p>
            <a href="#" className="inline-flex items-center gap-1.5 text-blue-900 font-bold text-sm hover:underline">Xem ngay <ChevronRight className="w-3.5 h-3.5" /></a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CatalogSection = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    dataService.list<ProductItem>('products').then(res => {
      if (res.length > 0) setProducts(res);
    });
  }, []);

  return (
    <section className="py-24 bg-white" id="products">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-blue-900 mb-4 uppercase">Danh mục sản phẩm</h2>
          <p className="text-gray-500">Đa dạng sản phẩm - Đáp ứng mọi nhu cầu</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
           {products.length > 0 ? products.map((cat) => (
             <div key={cat.id} className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 w-full group relative overflow-hidden transition-all hover:-translate-y-2">
                <div className="mb-4">
                  <h3 className="text-[18px] font-black text-blue-900 leading-tight mb-2">{cat.title}</h3>
                  <span className="bg-blue-900 text-white px-3 py-1 rounded-full text-[10px] font-bold">{cat.brand}</span>
                </div>
                <div className="h-48 rounded-2xl overflow-hidden mb-4">
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex justify-between gap-2">
                  {cat.features?.map(f => (
                    <div key={f.label} className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-blue-500" /></div>
                      <span className="text-[9px] text-gray-500">{f.label}</span>
                    </div>
                  ))}
                </div>
             </div>
           )) : <p className="col-span-full text-center text-gray-400">Đang tải sản phẩm...</p>}
        </div>
      </div>
    </section>
  );
};

const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    dataService.list<NewsItem>('news').then(res => {
      if (res.length > 0) setNews(res);
    });
  }, []);

  return (
    <section className="py-24 bg-white" id="news">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-black text-blue-900 uppercase mb-12">Tin tức mới nhất</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {news.length > 0 ? news.map((item) => (
            <div key={item.id} className="group">
              <div className="h-64 rounded-3xl overflow-hidden mb-6 shadow-lg">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="text-[11px] text-gray-400 mb-2">{item.date}</p>
              <h3 className="text-lg font-black text-blue-900 mb-3 group-hover:text-blue-700 transition-colors leading-tight">{item.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{item.excerpt}</p>
            </div>
          )) : <p className="col-span-full text-gray-400">Đang tải tin tức...</p>}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-blue-900 text-white pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-blue-100 text-sm">
      <div>
        <div className="text-3xl font-black mb-8 text-white">NYNA</div>
        <p className="mb-4">443/1 Đức Hòa Hạ, Ấp Bình Tiền 2, Xã Đức Hòa Hạ, Huyện Đức Hòa, Tỉnh Long An</p>
      </div>
      <div>
        <h4 className="text-lg font-bold mb-8 uppercase text-white">Thông tin</h4>
        <ul className="space-y-2">
          <li>Giới thiệu</li>
          <li>Tuyển dụng</li>
          <li>Liên hệ</li>
          <li className="pt-4">
            <Link to="/cms" className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-600 transition-all inline-block">
              Quản trị Website (CMS)
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </footer>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <BrandSection />
      <CatalogSection />
      <WhyChooseSection />
      <NewsSection />
      <JobsSection />
      <DistributorsSection />
      <Footer />
    </div>
  );
}

const JobsSection = () => {
  const [jobs, setJobs] = useState<JobItem[]>([]);

  useEffect(() => {
    dataService.list<JobItem>('jobs').then(setJobs);
  }, []);

  if (jobs.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50" id="jobs">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-blue-900 uppercase">Cơ hội nghề nghiệp</h2>
            <p className="text-gray-500 mt-2">Gia nhập đội ngũ NYNA để cùng phát triển</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-blue-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{job.title}</h3>
                <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none flex items-center h-6">Mới</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gray-400" />
                  <span>{job.salary}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Hạn: {job.deadline}</span>
                <button className="bg-blue-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-800 transition-all">Ứng tuyển</button>
              </div>
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
    <section className="py-24 bg-white" id="distributors">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-blue-900 mb-4 uppercase">Hệ thống phân phối</h2>
          <p className="text-gray-500">Tìm kiếm đại lý và nhà phân phối NYNA gần bạn</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {regions.map(r => (
            <button 
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`px-8 py-2.5 rounded-full font-bold text-sm transition-all ${
                activeRegion === r ? 'bg-blue-900 text-white shadow-xl shadow-blue-900/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div key={item.id} className="p-8 rounded-[40px] border border-gray-100 hover:border-blue-900 transition-all group bg-white shadow-sm hover:shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-all">
                  <MapPin className="w-6 h-6 outline-none" />
                </div>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{item.region}</span>
              </div>
              <h3 className="text-lg font-black text-blue-900 mb-4 uppercase tracking-tighter leading-tight">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed flex items-start gap-2">
                 {item.address}
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-bold">
                <Phone className="w-4 h-4" />
                <span>{item.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyChooseSection = () => (
  <section className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-4xl font-black text-blue-900 mb-16 uppercase text-center">Vì sao chọn NYNA?</h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
        {WHY_CHOOSE.map((item) => (
          <div key={item.title} className="text-center group">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">{item.icon}</div>
            <h3 className="text-[14px] font-bold text-gray-900 mb-2 leading-tight">{item.title}</h3>
            <p className="text-[11px] text-gray-500 max-w-[140px] mx-auto leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
