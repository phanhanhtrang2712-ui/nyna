import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, ArrowLeft, CheckCircle2, ShieldCheck, 
  Zap, Info, ListChecks, ChevronRight, Heart
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { dataService } from '../services/dataService';
import { queryCache } from '../services/queryCache';
import { FALLBACK_DATA } from '../data/fallbackData';
import { ProductItem } from '../types';

interface ProductDetailProps {
  onAddToCart?: (product: any) => void;
}

const ProductDetail = ({ onAddToCart: propsOnAddToCart }: ProductDetailProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useOutletContext<{ onAddToCart?: (p: any) => void }>();
  const onAddToCart = propsOnAddToCart || context?.onAddToCart;

  const [product, setProduct] = useState<ProductItem | null>(() => {
    if (!id) return null;
    
    // 1. Try single item cache in queryCache
    const itemCacheKey = `nyna_cache_products_${id}`;
    const cachedItem = queryCache.getAny<ProductItem>(itemCacheKey);
    if (cachedItem) return cachedItem;

    // 2. Try general list cache in queryCache
    const listCacheKey = `nyna_cache_products`;
    const cachedList = queryCache.getAny<ProductItem[]>(listCacheKey);
    if (cachedList) {
      const found = cachedList.find(p => p.id === id);
      if (found) return found;
    }

    // 3. Try fallback static backup database
    const fallbackList = FALLBACK_DATA["products"];
    if (fallbackList) {
      const found = fallbackList.find(p => p.id === id);
      if (found) return found;
    }
    return null;
  });
  const [loading, setLoading] = useState(() => {
    if (!id) return true;
    const freshItem = queryCache.get<ProductItem>(`nyna_cache_products_${id}`);
    if (freshItem) return false;
    
    const freshList = queryCache.get<ProductItem[]>(`nyna_cache_products`);
    if (freshList && freshList.some(p => p.id === id)) return false;

    return !product;
  });
  const [activeImage, setActiveImage] = useState<string>(product ? product.image : '');
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      const fetchItem = async () => {
        // Try fresh item cache first
        const freshItem = queryCache.get<ProductItem>(`nyna_cache_products_${id}`);
        if (freshItem) {
          if (isMounted) {
            setProduct(freshItem);
            setActiveImage(prev => prev || freshItem.image);
            setLoading(false);
          }
          return;
        }

        try {
          const res = await dataService.get<ProductItem>('products', id);
          if (isMounted) {
            setProduct(res);
            setActiveImage(prev => prev || res.image);
            setLoading(false);
          }
        } catch (err) {
          console.error(err);
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      fetchItem();
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h2 className="text-3xl font-black text-blue-900 mb-4 uppercase">Không tìm thấy sản phẩm</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-900 text-white px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-12 text-[10px] font-black uppercase tracking-widest text-gray-400">
           <span className="cursor-pointer hover:text-blue-900" onClick={() => navigate('/')}>Trang chủ</span>
           <ChevronRight size={10} />
           <span className="cursor-pointer hover:text-blue-900">{product.category}</span>
           <ChevronRight size={10} />
           <span className="text-blue-900">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 md:gap-24 items-start">
          {/* Product Images Area */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 md:space-y-6 sticky top-24"
          >
            <div className="aspect-[4/3] md:aspect-square bg-gray-50 rounded-[32px] md:rounded-[48px] overflow-hidden border border-gray-100 group relative">
               <AnimatePresence mode="wait">
                 <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={activeImage} 
                  alt={product.title} 
                  className="w-full h-full object-contain p-8 md:p-12 transition-transform duration-700 group-hover:scale-105" 
                 />
               </AnimatePresence>
               <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-white/90 backdrop-blur px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase text-blue-900 border border-white/50 tracking-widest">
                 {product.brand}
               </div>
            </div>
            
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 md:gap-4 overflow-x-auto no-scrollbar pb-2">
                 {[product.image, ...product.images].filter(Boolean).map((img, i) => (
                   <div 
                    key={i} 
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square w-20 md:w-24 bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer transition-all border-2 shrink-0 ${
                      activeImage === img ? 'border-pink-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                   >
                      <img src={img} alt={`${product.title} ${i}`} className="w-full h-full object-contain p-2" />
                   </div>
                 ))}
              </div>
            )}
          </motion.div>

          {/* Product Info Area */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full"
          >
            <div className="mb-10 font-sans">
              <span className="text-pink-500 font-black uppercase tracking-[0.4em] text-xs mb-4 block">{product.category}</span>
              <h1 className="text-xl md:text-3xl font-black text-blue-900 mb-4 uppercase tracking-tight leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-6">
                <div className="text-2xl md:text-5xl font-black text-blue-900 italic">
                  {new Intl.NumberFormat('vi-VN').format(selectedVariant ? selectedVariant.price : (product.price || 0))}đ
                </div>
                {((selectedVariant ? selectedVariant.original_price : product.original_price) && (selectedVariant ? selectedVariant.original_price : product.original_price) > (selectedVariant ? selectedVariant.price : (product.price || 0))) && (
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-tighter mb-1">
                      Tiết kiệm {new Intl.NumberFormat('vi-VN').format((selectedVariant ? selectedVariant.original_price : product.original_price) - (selectedVariant ? selectedVariant.price : (product.price || 0)))}đ
                    </span>
                    <div className="text-sm font-bold text-gray-300 uppercase tracking-widest line-through decoration-pink-500/30">
                      {new Intl.NumberFormat('vi-VN').format(selectedVariant ? selectedVariant.original_price : product.original_price)}đ
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6 mb-8">
               <div className="flex flex-wrap gap-3">
                  {product.features?.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight shadow-sm">
                       <Zap size={14} /> {f.label}
                    </div>
                  ))}
               </div>
            </div>

            {/* Product Variants / Options Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-10 pb-8 border-b border-gray-100">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3.5 pl-0.5">Phân loại phẩm cấp:</label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v, i) => {
                    const isSelected = selectedVariant?.name === v.name;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all relative border-2 ${
                          isSelected 
                            ? 'bg-pink-50 text-pink-600 border-pink-500 shadow-sm font-black' 
                            : 'bg-gray-50 text-blue-900 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {v.name}
                        {isSelected && (
                          <div className="absolute right-1 bottom-1 w-2.5 h-2.5 bg-pink-500 rounded-full flex items-center justify-center border border-white">
                            <span className="block w-1.5 h-1.5 bg-white rounded-full"></span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-4 mb-16">
               <button 
                onClick={() => {
                  if (onAddToCart) {
                    if (selectedVariant) {
                       onAddToCart({
                         ...product,
                         id: `${product.id}-${selectedVariant.name}`,
                         title: `${product.title} (${selectedVariant.name})`,
                         price: selectedVariant.price,
                         original_price: selectedVariant.original_price,
                         selectedVariant: selectedVariant.name
                       });
                    } else {
                       onAddToCart(product);
                    }
                  }
                }}
                className="flex-1 bg-blue-900 text-white h-20 rounded-3xl font-black uppercase tracking-widest hover:bg-pink-500 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-4 group"
               >
                 THÊM VÀO GIỎ HÀNG <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
               </button>
               <button className="w-20 h-20 bg-gray-50 text-gray-400 rounded-3xl flex items-center justify-center hover:bg-pink-50 hover:text-pink-500 transition-all border border-gray-100 shadow-sm">
                  <Heart size={28} />
               </button>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-12 border-t border-gray-100">
               {[
                 { icon: <ShieldCheck className="text-emerald-500" />, text: "Chính hãng 100%" },
                 { icon: <CheckCircle2 className="text-blue-500" />, text: "Đã kiểm định y tế" },
               ].map((item, i) => (
                 <div key={i} className="text-center space-y-2">
                    <div className="flex justify-center">{item.icon}</div>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{item.text}</div>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>

        {/* Detailed Section */}
        <div className="mt-24 md:mt-32">
          <div className="border-b border-gray-100 mb-12">
             <div className="pb-6 text-sm font-black uppercase text-blue-900 tracking-[0.3em] relative inline-block">
                Ưu điểm & Công dụng
                <div className="absolute bottom-0 left-0 w-full h-1 bg-pink-500 rounded-full" />
             </div>
          </div>

          <div className="max-w-4xl">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-lg max-w-none text-gray-600 font-medium leading-[1.8] whitespace-pre-wrap"
              >
                {product.description || (
                  <div className="space-y-8">
                    <p>Với công nghệ tiên tiến nhất tại NYNA, dòng sản phẩm {product.title} được thiết kế để mang lại sự thoải mái tuyệt đối cho người sử dụng.</p>
                  </div>
                )}
              </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
