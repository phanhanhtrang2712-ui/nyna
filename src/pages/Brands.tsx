
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, ArrowLeft } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useDataList } from '../hooks/useDataList';
import { BrandItem } from '../types';
import Markdown from 'react-markdown';

const Brands = () => {
  const { data: fetchedBrands, loading } = useDataList<BrandItem>('brands');
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | null>(null);

  const brands = React.useMemo(() => {
    if (fetchedBrands && fetchedBrands.length > 0) {
      return fetchedBrands;
    } else if (!loading) {
      return [
        { name: 'LYNA', description: 'Sản phẩm chăm sóc phụ nữ hiện đại', color: 'text-pink-600', image: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800', content: 'LYNA mang đến những giải pháp chăm sóc sức khỏe phụ nữ với các dòng sản phẩm băng vệ sinh cao cấp.' },
        { name: 'SILA', description: 'Tã người lớn cao cấp', color: 'text-emerald-600', image: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800', content: 'SILA là dòng tã bỉm người lớn chuyên dụng, thấm hút tốt và êm ái.' },
        { name: 'NYNA', description: 'Tã em bé êm mềm vượt trội', color: 'text-blue-600', image: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800', content: 'NYNA tự hào là người bạn đồng hành của hàng triệu gia đình Việt trong việc chăm sóc con nhỏ.' },
        { name: 'TONY', description: 'Tấm lót / Miếng lót đa năng', color: 'text-indigo-600', image: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800', content: 'TONY cung cấp các giải pháp lót thấm đa năng cho nhiều mục đích sử dụng.' },
      ] as BrandItem[];
    }
    return fetchedBrands || [];
  }, [fetchedBrands, loading]);

  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 text-center">
          <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-xs mb-4 block">HỆ SINH THÁI</span>
          <h1 className="text-5xl font-black text-blue-900 tracking-tighter uppercase">Thương hiệu của NYNA</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {brands.map((brand, idx) => (
            <motion.div 
              key={brand.name}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row bg-gray-50 rounded-[32px] md:rounded-[48px] overflow-hidden group hover:shadow-2xl transition-all"
            >
              <div className="md:w-1/2 aspect-square overflow-hidden bg-white p-8">
                <img src={brand.image || 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800'} alt={brand.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h3 className={`text-3xl md:text-5xl font-black mb-4 uppercase ${brand.color || 'text-blue-900'}`}>{brand.name}</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-8">{brand.description}</p>
                <div className="flex gap-2 mb-8">
                  {[1,2,3].map(i => <div key={i} className="w-8 h-1 bg-gray-200 rounded-full"></div>)}
                </div>
                <button 
                  onClick={() => setSelectedBrand(brand)}
                  className="flex items-center gap-2 text-blue-900 font-black text-sm uppercase tracking-widest hover:gap-5 transition-all"
                >
                  Khám phá thêm <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {selectedBrand && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBrand(null)}
              className="absolute inset-0 bg-blue-900/40 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setSelectedBrand(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
              >
                <X size={24} />
              </button>

              <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="relative h-[300px] md:h-[450px] bg-white p-12 md:p-20 flex items-center justify-center">
                   <img src={selectedBrand.image} className="max-w-full max-h-full object-contain" alt={selectedBrand.name} />
                   <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"></div>
                   <div className="absolute bottom-12 left-12">
                      <h2 className={`text-5xl md:text-8xl font-black uppercase tracking-tighter ${selectedBrand.color || 'text-blue-900'} drop-shadow-sm`}>{selectedBrand.name}</h2>
                      <p className="text-lg md:text-xl font-bold bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full inline-block mt-4 text-blue-900 shadow-xl border border-gray-100">{selectedBrand.description}</p>
                   </div>
                </div>

                <div className="p-12 md:p-20">
                   <div className="max-w-3xl">
                      <div className="prose prose-xl prose-blue max-w-none text-gray-600 font-medium leading-relaxed font-sans">
                         <Markdown>{selectedBrand.content || 'Nội dung đang được cập nhật...'}</Markdown>
                      </div>
                      
                      <div className="mt-20 pt-12 border-t border-gray-100 flex items-center justify-between">
                         <button 
                          onClick={() => setSelectedBrand(null)}
                          className="flex items-center gap-3 text-gray-400 font-black text-sm uppercase tracking-widest hover:text-blue-900 transition-colors"
                         >
                            <ArrowLeft size={20} /> Quay lại danh sách
                         </button>
                         <div className="text-[10px] text-gray-300 font-black uppercase tracking-[0.4em]">NYNA Premium Brand</div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Brands;
