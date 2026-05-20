import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, ArrowLeft, CheckCircle2, ShieldCheck, 
  Zap, Info, ListChecks, ChevronRight, Heart
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { dataService } from '../services/dataService';
import { ProductItem } from '../types';

interface ProductDetailProps {
  onAddToCart?: (product: any) => void;
}

const ProductDetail = ({ onAddToCart: propsOnAddToCart }: ProductDetailProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useOutletContext<{ onAddToCart?: (p: any) => void }>();
  const onAddToCart = propsOnAddToCart || context?.onAddToCart;

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description');

  useEffect(() => {
    if (id) {
      setLoading(true);
      dataService.get<ProductItem>('products', id)
        .then(res => {
          setProduct(res);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
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

        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start">
          {/* Product Images Area */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-square bg-gray-50 rounded-[48px] overflow-hidden border border-gray-100 group relative">
               <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
               />
               <div className="absolute top-8 left-8 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-blue-900 border border-white/50 tracking-widest">
                 {product.brand}
               </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="aspect-square bg-gray-50 rounded-2xl overflow-hidden opacity-50 hover:opacity-100 cursor-pointer transition-all border border-gray-100">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Product Info Area */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full"
          >
            <div className="mb-10">
              <span className="text-pink-500 font-black uppercase tracking-[0.4em] text-xs mb-4 block">{product.category}</span>
              <h1 className="text-4xl md:text-5xl font-black text-blue-900 mb-6 uppercase tracking-tight leading-[1.1]">
                {product.title}
              </h1>
              <div className="flex items-center gap-6">
                <div className="text-4xl font-black text-blue-900 italic">
                  {new Intl.NumberFormat('vi-VN').format(product.price || 0)}đ
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest line-through decoration-pink-500/30">
                  {new Intl.NumberFormat('vi-VN').format((product.price || 0) * 1.2)}đ
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-12">
               <div className="flex flex-wrap gap-3">
                  {product.features?.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight shadow-sm">
                       <Zap size={14} /> {f.label}
                    </div>
                  ))}
               </div>
               <p className="text-gray-500 font-medium leading-relaxed">
                  Sản phẩm tiêu chuẩn quốc tế được nghiên cứu và phát triển bởi NYNA Việt Nam, mang lại sự an tâm tuyệt đối cho cả gia đình.
               </p>
            </div>

            <div className="flex gap-4 mb-16">
               <button 
                onClick={() => onAddToCart && onAddToCart(product)}
                className="flex-1 bg-blue-900 text-white h-20 rounded-3xl font-black uppercase tracking-widest hover:bg-pink-500 transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-4 group"
               >
                 THÊM VÀO GIỎ HÀNG <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
               </button>
               <button className="w-20 h-20 bg-gray-50 text-gray-400 rounded-3xl flex items-center justify-center hover:bg-pink-50 hover:text-pink-500 transition-all border border-gray-100 shadow-sm">
                  <Heart size={28} />
               </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-gray-100">
               {[
                 { icon: <ShieldCheck className="text-emerald-500" />, text: "Chính hãng 100%" },
                 { icon: <CheckCircle2 className="text-blue-500" />, text: "Đã kiểm định y tế" },
                 { icon: <Zap className="text-pink-500" />, text: "Giao hàng từ 2-4h" },
               ].map((item, i) => (
                 <div key={i} className="text-center space-y-2">
                    <div className="flex justify-center">{item.icon}</div>
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{item.text}</div>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>

        {/* Detailed Tabs */}
        <div className="mt-24 md:mt-32">
          <div className="flex gap-10 border-b border-gray-100 mb-12">
             <button 
              onClick={() => setActiveTab('description')}
              className={`pb-6 text-sm font-black uppercase tracking-widest relative transition-all ${activeTab === 'description' ? 'text-blue-900' : 'text-gray-300 hover:text-gray-500'}`}
             >
                Ưu điểm & Công dụng
                {activeTab === 'description' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-pink-500 rounded-full" />}
             </button>
             <button 
              onClick={() => setActiveTab('specifications')}
              className={`pb-6 text-sm font-black uppercase tracking-widest relative transition-all ${activeTab === 'specifications' ? 'text-blue-900' : 'text-gray-300 hover:text-gray-500'}`}
             >
                Thông số kỹ thuật
                {activeTab === 'specifications' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-pink-500 rounded-full" />}
             </button>
          </div>

          <div className="max-w-4xl">
             <AnimatePresence mode="wait">
                {activeTab === 'description' ? (
                  <motion.div 
                    key="desc"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="prose prose-lg max-w-none text-gray-600 font-medium leading-[1.8] whitespace-pre-wrap"
                  >
                    {product.description || (
                      <div className="space-y-8">
                        <p>Với công nghệ tiên tiến nhất tại NYNA, dòng sản phẩm {product.title} được thiết kế để mang lại sự thoải mái tuyệt đối cho người sử dụng. Mỗi giai đoạn từ nguyên liệu đầu vào đến thành phẩm cuối cùng đều trải qua quy trình kiểm soát nghiêm ngặt.</p>
                        <div className="grid md:grid-cols-2 gap-8 not-prose">
                          <div className="bg-blue-50 p-8 rounded-[40px] border border-blue-100">
                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-900 mb-6 shadow-sm"><Info size={24} /></div>
                             <h4 className="text-xl font-black text-blue-900 uppercase tracking-tight mb-4">Đặc tính nổi bật</h4>
                             <ul className="space-y-3 text-sm font-bold text-gray-600">
                               <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0"></div> Bề mặt êm mềm như tơ, không gây kích ứng</li>
                               <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0"></div> Khả năng thấm hút cực lớn, giữ khô sạch suốt 12h</li>
                               <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0"></div> Công nghệ màng đáy thở thế hệ mới</li>
                             </ul>
                          </div>
                          <div className="bg-pink-50 p-8 rounded-[40px] border border-pink-100">
                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pink-500 mb-6 shadow-sm"><ListChecks size={24} /></div>
                             <h4 className="text-xl font-black text-blue-900 uppercase tracking-tight mb-4">Hướng dẫn sử dụng</h4>
                             <p className="text-sm font-bold text-gray-600">Để phát huy tối đa công dụng của sản phẩm, quý khách vui lòng tuân thủ các bước hướng dẫn chuẩn từ nhà sản xuất...</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="spec"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {[
                      { key: 'Chất liệu', value: 'Cotton cao cấp, vải không dệt SAP Nhật Bản' },
                      { key: 'Xuất xứ', value: 'Việt Nam (Công nghệ CHLB Đức)' },
                      { key: 'Hạn sử dụng', value: '3 năm kể từ ngày sản xuất' },
                      { key: 'Quy chuẩn đóng gói', value: 'Gói đại / Gói trung (Tùy size)' }
                    ].map((spec, i) => (
                      <div key={i} className="flex border-b border-gray-100 py-6 last:border-0">
                         <div className="w-1/3 text-xs font-black text-gray-400 uppercase tracking-widest">{spec.key}</div>
                         <div className="flex-1 text-sm font-bold text-blue-900">{spec.value}</div>
                      </div>
                    ))}
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
