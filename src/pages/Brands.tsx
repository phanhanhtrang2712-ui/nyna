
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { dataService } from '../services/dataService';

const Brands = () => {
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    dataService.list<any>('brands').then(res => {
      if (res.length > 0) setBrands(res);
      else {
        setBrands([
          { name: 'LYNA', description: 'Sản phẩm chăm sóc phụ nữ hiện đại', color: 'text-pink-600', image: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800' },
          { name: 'SILA', description: 'Tã người lớn cao cấp', color: 'text-emerald-600', image: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800' },
          { name: 'NYNA', description: 'Tã em bé êm mềm vượt trội', color: 'text-blue-600', image: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800' },
          { name: 'TONY', description: 'Tấm lót / Miếng lót đa năng', color: 'text-indigo-600', image: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800' },
        ]);
      }
    });
  }, []);

  return (
    <div className="py-24 bg-white">
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
              <div className="md:w-1/2 aspect-square overflow-hidden">
                <img src={brand.image || 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800'} alt={brand.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h3 className={`text-3xl md:text-5xl font-black mb-4 uppercase ${brand.color}`}>{brand.name}</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-8">{brand.description}</p>
                <div className="flex gap-2 mb-8">
                  {[1,2,3].map(i => <div key={i} className="w-8 h-1 bg-gray-200 rounded-full"></div>)}
                </div>
                <button className="flex items-center gap-2 text-blue-900 font-black text-sm uppercase tracking-widest hover:gap-5 transition-all">
                  Khám phá thêm <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brands;
