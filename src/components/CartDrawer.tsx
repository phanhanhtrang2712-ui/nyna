
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, BusinessSettings } from '../types';
import { dataService } from '../services/dataService';

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: CartItem[]; 
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}) => {
  const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const [showPayment, setShowPayment] = useState(false);
  const [bankSettings, setBankSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    if (isOpen) {
      dataService.get<BusinessSettings>('business_settings', 'main')
        .then(res => {
          if (res) setBankSettings(res);
        })
        .catch(console.error);
    }
  }, [isOpen]);

  // VietQR generation
  const getQrUrl = () => {
    if (!bankSettings) return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=NYNA-PAYMENT-TOTAL-${total}`;
    
    // Attempt VietQR format if possible or fall back
    // We'll use a generic one that looks good
    const bank = encodeURIComponent(bankSettings.bank_name);
    const acc = bankSettings.account_number;
    const name = encodeURIComponent(bankSettings.account_name);
    const info = encodeURIComponent(`THANH TOAN DON HANG NYNA`);
    
    // Generic QR API but formatted for banking apps if they support it
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=bank:${bank};acc:${acc};amount:${total};name:${name};info:${info}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm"
          ></motion.div>
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <ShoppingCart className="text-blue-900" size={24} />
                 <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">Giỏ hàng của bạn</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
              {items.length > 0 ? (
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-24 h-24 rounded-2xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1 block">{item.brand}</span>
                        <h4 className="font-black text-blue-900 uppercase tracking-tight text-sm truncate mb-2">{item.title}</h4>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center bg-gray-100 rounded-lg p-1">
                              <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-900">-</button>
                              <span className="px-3 text-xs font-black text-blue-900">{item.quantity}</span>
                              <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-900">+</button>
                           </div>
                           <div className="text-sm font-black text-blue-900">
                             {new Intl.NumberFormat('vi-VN').format((item.price || 0) * item.quantity)}đ
                           </div>
                        </div>
                      </div>
                      <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1 shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingCart size={64} className="mb-4" />
                  <p className="font-black uppercase tracking-widest text-xs">Giỏ hàng trống</p>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Tổng tiền tạm tính</span>
                  <span className="text-3xl font-black text-blue-900">{new Intl.NumberFormat('vi-VN').format(total)}đ</span>
                </div>
                
                {showPayment ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-white rounded-[32px] border-2 border-emerald-500/20 shadow-2xl space-y-4"
                  >
                    <div className="flex items-center gap-3 justify-center text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 py-2 rounded-xl">
                       <CreditCard size={14} /> Quét mã để thanh toán
                    </div>
                    
                    <div className="aspect-square w-64 mx-auto bg-white rounded-3xl flex items-center justify-center p-3 shadow-inner border border-gray-100">
                       <img 
                        src={getQrUrl()} 
                        alt="QR Code Payment" 
                        className="w-full h-full"
                       />
                    </div>

                    <div className="text-left bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-1.5">
                      <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1 opacity-40">Thông tin thụ hưởng</p>
                      <p className="text-xs font-black text-blue-900 uppercase">{bankSettings?.account_name || 'CÔNG TY TNHH NYNA'}</p>
                      <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                        <span>Số tài khoản:</span>
                        <span className="text-blue-600 font-black">{bankSettings?.account_number || '0916070421'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                        <span>Ngân hàng:</span>
                        <span>{bankSettings?.bank_name || 'MB Bank'}</span>
                      </div>
                      {bankSettings?.branch && (
                        <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                          <span>Chi nhánh:</span>
                          <span>{bankSettings.branch}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-xs font-bold text-emerald-600 pt-1 mt-1 border-t border-gray-200">
                        <span>Số tiền:</span>
                        <span className="font-black">{new Intl.NumberFormat('vi-VN').format(total)}đ</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setShowPayment(false)} 
                      className="w-full py-4 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-900 transition-all border border-transparent hover:border-gray-100 rounded-2xl"
                    >
                      Quay lại giỏ hàng
                    </button>
                  </motion.div>
                ) : (
                  <button 
                    onClick={() => setShowPayment(true)}
                    className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-pink-500 transition-all shadow-xl shadow-blue-900/10"
                  >
                    Thanh toán ngay
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
