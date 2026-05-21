
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useDataList } from '../hooks/useDataList';
import { DistributorItem } from '../types';

const Distribution = () => {
  const { data: fetchedDistributors, loading } = useDataList<DistributorItem>('distributors');
  const [distributors, setDistributors] = useState<DistributorItem[]>([]);
  const [activeRegion, setActiveRegion] = useState('Tất cả');

  useEffect(() => {
    setDistributors(fetchedDistributors);
  }, [fetchedDistributors]);

  const regions = ['Tất cả', ...Array.from(new Set(distributors.map(d => d.region)))];
  const filtered = activeRegion === 'Tất cả' 
    ? distributors 
    : distributors.filter(d => d.region === activeRegion);

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
           <div>
             <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-xs mb-4 block">NETWORK</span>
             <h1 className="text-5xl font-black text-blue-900 tracking-tighter uppercase mb-4">Hệ thống phân phối</h1>
             <p className="text-lg font-bold text-gray-400 uppercase tracking-[0.2em]">Hệ thống rộng khắp 63 tỉnh thành</p>
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
          {filtered.map((item, idx) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="p-10 rounded-[64px] border border-gray-100 hover:border-blue-900 transition-all group bg-white shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]"
            >
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
            </motion.div>
          ))}
          {filtered.length === 0 && <p className="col-span-full text-center text-gray-400 py-20 uppercase font-black italic">Đang cập nhật danh sách...</p>}
        </div>
      </div>
    </div>
  );
};

export default Distribution;
