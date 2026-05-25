
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductItem } from '../types';

interface ProductCardProps {
  item: ProductItem;
  onAddToCart?: (product: any) => void;
}

const ProductCard = ({ item, onAddToCart }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const featureLabels = (item.features || [])
    .map((feature: any) => typeof feature === 'string' ? feature : feature?.label)
    .filter((label: any) => typeof label === 'string' && label.trim() && label.trim().toLowerCase() !== 'nổi bật')
    .slice(0, 2);

  return (
    <motion.div 
      layout
      className="bg-white rounded-[20px] md:rounded-[32px] border border-gray-100 shadow-sm p-2.5 md:p-5 group transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full"
    >
      <Link to={`/san-pham/${item.id}`} className="relative mb-3 md:mb-6 rounded-[16px] md:rounded-[24px] overflow-hidden bg-gray-50 aspect-square shrink-0 block">
        {/* Shimmer Placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:200%_100%] animate-pulse" style={{ animationDuration: '1.5s' }} />
        )}
        
        <img 
          src={item.image} 
          alt={item.title} 
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`} 
        />
        <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white/90 backdrop-blur-md px-1.5 py-0.5 md:px-3 md:py-1 rounded-full text-[7px] md:text-[9px] font-black text-blue-900 uppercase tracking-widest border border-white/50 z-10">
          {item.brand}
        </div>
      </Link>

      <div className="flex-1 flex flex-col">
        <Link to={`/san-pham/${item.id}`} className="block group-hover:text-pink-500 transition-colors">
          <h3 className="text-xs md:text-sm font-black text-blue-900 mb-2 md:mb-4 uppercase tracking-tight line-clamp-2 min-h-[32px] md:min-h-[40px] leading-tight">
            {item.title}
          </h3>
        </Link>
        
        <div className="flex flex-wrap gap-1 md:gap-2 mb-4 md:mb-6">
          {featureLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 md:px-3 md:py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-tighter">
              <CheckCircle2 size={10} className="shrink-0" /> <span className="truncate">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-3 md:pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="text-base md:text-xl font-black text-blue-900 italic">
              {new Intl.NumberFormat('vi-VN').format(item.price || 0)}đ
            </div>
            {item.original_price && item.original_price > (item.price || 0) && (
              <div className="text-[9px] md:text-[10px] font-bold text-gray-300 line-through decoration-pink-500/30">
                {new Intl.NumberFormat('vi-VN').format(item.original_price)}đ
              </div>
            )}
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); onAddToCart && onAddToCart(item); }}
            className="bg-blue-900 text-white p-2.5 md:p-4 rounded-[16px] md:rounded-[20px] hover:bg-pink-500 transition-all shadow-lg hover:shadow-pink-200"
          >
            <ShoppingCart size={16} className="md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
