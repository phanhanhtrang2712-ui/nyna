
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { dataService } from '../services/dataService';
import { BrandItem } from '../types';

const BrandTicker = () => {
  const [brands, setBrands] = useState<BrandItem[]>([]);

  useEffect(() => {
    dataService.list<BrandItem>('brands')
      .then(res => {
        const brandsWithImage = res.filter(b => b.image);
        setBrands(brandsWithImage);
      })
      .catch(console.error);
  }, []);

  if (brands.length === 0) return null;

  return (
    <div className="w-full bg-gray-50 border-b border-gray-100 overflow-hidden py-4">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex gap-12 items-center">
          <motion.div 
            animate={{ 
              x: [0, -1000],
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="flex gap-16 items-center whitespace-nowrap shrink-0"
          >
            {/* Double the list for seamless loop */}
            {[...brands, ...brands, ...brands].map((brand, i) => (
              <div key={`${brand.id}-${i}`} className="h-8 md:h-12 w-auto shrink-0 grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100 flex items-center justify-center">
                <img 
                  src={brand.image} 
                  alt={brand.name} 
                  className="h-full w-auto object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Gradients for smooth fade at edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
      </div>
    </div>
  );
};

export default BrandTicker;
