
import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { ProductItem } from '../types';

interface ProductCardProps {
  item: ProductItem;
  onAddToCart?: (product: any) => void;
}

const ProductCard = ({ item, onAddToCart }: ProductCardProps) => {
  return (
    <motion.div 
      layout
      className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-5 group transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full"
    >
      <div className="relative mb-6 rounded-[24px] overflow-hidden bg-gray-50 aspect-square shrink-0">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-blue-900 uppercase tracking-widest border border-white/50">
          {item.brand}
        </div>
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-pink-500 transition-colors shadow-lg">
          <Heart size={18} />
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-black text-blue-900 mb-4 uppercase tracking-tight group-hover:text-pink-500 transition-colors line-clamp-2 min-h-[56px] leading-tight">
          {item.title}
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {item.features?.slice(0, 2).map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter">
              <CheckCircle2 size={10} /> {f.label}
            </div>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
          <div className="text-xl font-black text-blue-900 italic">
            {new Intl.NumberFormat('vi-VN').format(item.price || 0)}đ
          </div>
          <button 
            onClick={() => onAddToCart && onAddToCart(item)}
            className="bg-blue-900 text-white p-4 rounded-[20px] hover:bg-pink-500 transition-all shadow-lg hover:shadow-pink-200"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
