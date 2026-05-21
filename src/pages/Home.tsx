
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ChevronRight, 
  Filter, X, LayoutGrid, List, SlidersHorizontal, ArrowRight, Zap, ShieldCheck
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { dataService } from '../services/dataService';
import { useDataList } from '../hooks/useDataList';
import { ProductItem } from '../types';

interface HomeProps {
  onAddToCart?: (product: any) => void;
}

const CategorySection = ({ group, items, onAddToCart }: { group: string; items: ProductItem[]; onAddToCart?: (p: any) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
         <div>
            <h4 className="text-lg md:text-xl font-black text-blue-900 uppercase tracking-tighter">{group}</h4>
         </div>
         <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsExpanded(!isExpanded)}
             className={`px-4 md:px-6 py-2 rounded-full font-black text-[9px] md:text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 group ${
               items.length > 3 ? 'flex' : 'hidden md:flex'
             } ${
               isExpanded 
               ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' 
               : 'bg-blue-900/5 text-blue-900 hover:bg-blue-900 hover:text-white'
             }`}
           >
             {isExpanded ? 'Thu gọn' : 'Xem thêm'} 
             <ChevronRight size={14} className={`transition-transform md:w-4 md:h-4 ${isExpanded ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
           </button>
         </div>
      </div>
      
      {/* Grid container for both mobile and desktop */}
      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            className={`
              ${!isExpanded && index >= 3 ? 'hidden md:block' : ''} 
              ${!isExpanded && index >= 4 ? 'md:hidden' : ''}
              ${isExpanded ? 'block' : ''}
            `}
          >
            <ProductCard item={item} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Home = ({ onAddToCart: propsOnAddToCart }: HomeProps) => {
  const context = useOutletContext<{ onAddToCart?: (p: any) => void }>();
  const onAddToCart = propsOnAddToCart || context?.onAddToCart;

  const { data: fetchedProducts, loading } = useDataList<ProductItem>('products');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedBrand, setSelectedBrand] = useState('Tất cả');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setProducts(fetchedProducts);
  }, [fetchedProducts]);

  useEffect(() => {
    let result = products;

    if (selectedCategory !== 'Tất cả') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedBrand !== 'Tất cả') {
      result = result.filter(p => p.brand === selectedBrand);
    }

    if (searchQuery) {
      result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    result = result.filter(p => (p.price || 0) >= priceRange[0] && (p.price || 0) <= priceRange[1]);

    setFilteredProducts(result);
  }, [selectedCategory, selectedBrand, priceRange, searchQuery, products]);

  const categories = ['Tất cả', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const brands = ['Tất cả', ...Array.from(new Set(products.map(p => p.brand).filter(Boolean)))];

  const priceFilters = [
    { label: 'Tất cả', range: [0, 10000000] },
    { label: 'Dưới 100k', range: [0, 100000] },
    { label: '100k - 500k', range: [100000, 500000] },
    { label: 'Trên 500k', range: [500000, 10000000] },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Hero Header for Home - Minimalist but Impactful */}
      <section className="bg-blue-900 pt-16 md:pt-24 pb-24 md:pb-32 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-800/50 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-pink-500 font-black uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4 md:mb-6 block text-center">PREMIUM QUALITY</span>
            <h1 className="text-3xl md:text-7xl font-black text-white mb-4 md:mb-8 tracking-tighter uppercase leading-[1.1] md:leading-[0.95] text-center">
              GIẢI PHÁP <br className="hidden md:block"/> CHĂM SÓC GIA ĐÌNH
            </h1>
            <p className="text-blue-100/70 text-sm md:text-lg font-medium max-w-2xl mx-auto mb-8 md:mb-12 text-center">
              Khám phá hệ sinh thái sản phẩm cao cấp từ NYNA - Vì sức khỏe và hạnh phúc bền lâu của người Việt.
            </p>
          </motion.div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 md:w-96 md:h-96 bg-pink-500/10 rounded-full blur-[60px] md:blur-[100px]"></div>
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-blue-400/10 rounded-full blur-[50px] md:blur-[80px]"></div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-8 md:-mt-16 pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Area */}
          <aside className="lg:w-72 shrink-0">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block space-y-8 sticky top-24">
              {/* Category Search */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <div className="relative mb-8">
                   <input 
                    type="text" 
                    placeholder="Tìm sản phẩm..." 
                    className="w-full bg-gray-50 px-6 py-4 rounded-2xl outline-none text-sm font-bold focus:bg-white border-2 border-transparent focus:border-blue-900 transition-all"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                   />
                   <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>

                <div className="space-y-10">
                  {/* Nhóm sản phẩm */}
                  <div>
                    <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <LayoutGrid size={14} className="text-pink-500" /> NHÓM SẢN PHẨM
                    </h4>
                    <div className="space-y-2">
                       {categories.map(cat => (
                         <button 
                          key={cat} 
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full text-left px-5 py-3 rounded-xl text-sm font-black uppercase tracking-tight transition-all ${selectedCategory === cat ? 'bg-blue-900 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}
                         >
                           {cat}
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Thương hiệu */}
                  <div>
                    <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <ShieldCheck size={14} className="text-emerald-500" /> THƯƠNG HIỆU
                    </h4>
                    <div className="space-y-2">
                       {brands.map(brand => (
                         <button 
                          key={brand} 
                          onClick={() => setSelectedBrand(brand)}
                          className={`w-full text-left px-5 py-3 rounded-xl text-sm font-black uppercase tracking-tight transition-all ${selectedBrand === brand ? 'bg-blue-900 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}
                         >
                           {brand}
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Khoảng giá */}
                  <div>
                    <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                       <SlidersHorizontal size={14} className="text-blue-500" /> VÙNG GIÁ
                    </h4>
                    <div className="space-y-2">
                       {priceFilters.map(filter => (
                         <button 
                          key={filter.label} 
                          onClick={() => setPriceRange(filter.range as [number, number])}
                          className={`w-full text-left px-5 py-3 rounded-xl text-sm font-black uppercase tracking-tight transition-all ${priceRange[0] === filter.range[0] && priceRange[1] === filter.range[1] ? 'bg-blue-900 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}
                         >
                           {filter.label}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Banner in Sidebar */}
              <div className="bg-pink-500 rounded-[40px] p-8 text-white relative overflow-hidden group cursor-pointer">
                 <div className="relative z-10">
                    <h4 className="font-black text-2xl uppercase tracking-tighter mb-2">Ưu đãi NPP</h4>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-6">Chính sách đặc biệt</p>
                    <button className="bg-white text-pink-500 w-10 h-10 rounded-full flex items-center justify-center group-hover:gap-4 transition-all">
                       <ArrowRight size={20} />
                    </button>
                 </div>
                 <Zap className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
              </div>
            </div>

            {/* Mobile Filter Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-full bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center mb-8"
            >
              <div className="flex items-center gap-3">
                 <Filter className="text-blue-900" size={20} />
                 <span className="font-black text-blue-900 uppercase tracking-widest text-xs">Bộ lọc sản phẩm</span>
              </div>
              <ChevronRight className="text-gray-400" />
            </button>
          </aside>

          {/* Main Product Area */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-blue-900 uppercase tracking-tighter">Sản phẩm ({filteredProducts.length})</h3>
                  <div className="h-4 w-px bg-gray-200 hidden md:block"></div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hiển thị {selectedCategory}</span>
               </div>
               <div className="flex gap-2">
                  <button className="p-3 bg-blue-900 text-white rounded-xl shadow-lg"><LayoutGrid size={20} /></button>
                  <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100"><List size={20} /></button>
               </div>
            </div>

            {/* Grouped Product Sections */}
            <div className="space-y-12">
               {loading ? (
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-[32px] h-[400px] animate-pulse border border-gray-100"></div>
                    ))}
                 </div>
               ) : (
                 (() => {
                    const groupNames = Array.from(new Set(filteredProducts.map(p => p.category || 'Sản phẩm khác')));
                    if (filteredProducts.length === 0) return null;
                    
                    return groupNames.map(group => {
                      const groupItems = filteredProducts.filter(p => (p.category || 'Sản phẩm khác') === group);
                      return <CategorySection key={group} group={group} items={groupItems} onAddToCart={onAddToCart} />;
                    });
                 })()
               )}
               {!loading && filteredProducts.length === 0 && (
                 <div className="py-32 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                       <Search size={48} />
                    </div>
                    <p className="font-black text-gray-400 uppercase tracking-widest text-sm">Không tìm thấy sản phẩm phù hợp</p>
                    <button onClick={() => { setSelectedCategory('Tất cả'); setSelectedBrand('Tất cả'); setPriceRange([0, 10000000]); setSearchQuery(''); }} className="mt-8 text-blue-900 font-black text-xs uppercase tracking-widest hover:underline">Xóa tất cả bộ lọc</button>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
             <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm"
             />
             <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              className="absolute left-0 top-0 h-full w-full max-w-xs bg-white p-10 overflow-y-auto"
             >
                <div className="flex justify-between items-center mb-12">
                   <h3 className="text-2xl font-black text-blue-900 uppercase">Bộ lọc</h3>
                   <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-50 rounded-full"><X size={20} /></button>
                </div>
                
                <div className="space-y-10">
                   {/* Replicate Sidebar Content here for Mobile */}
                   <div>
                    <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-6">Nhóm sản phẩm</h4>
                    <div className="flex flex-wrap gap-2">
                       {categories.map(cat => (
                         <button 
                          key={cat} 
                          onClick={() => { setSelectedCategory(cat); setIsSidebarOpen(false); }}
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${selectedCategory === cat ? 'bg-blue-900 text-white' : 'bg-gray-50 text-gray-400'}`}
                         >
                           {cat}
                         </button>
                       ))}
                    </div>
                  </div>
                  {/* ... Add other field filters as needed for mobile drawer ... */}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
