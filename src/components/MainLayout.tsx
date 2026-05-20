
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import { CartItem } from '../types';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nyna-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('nyna-cart', JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleAddToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === (product.id || product.title));
      if (existing) {
        return prev.map(item => item.id === (product.id || product.title) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { 
        id: product.id || product.title, 
        title: product.title, 
        price: product.price || 0, 
        image: product.image,
        brand: product.brand,
        quantity: 1 
      }];
    });
    setIsCartOpen(true);
  };

  // Pass handleAddToCart to children via props or provide a context? 
  // For simplicity since I'm rewriting all pages, I'll pass it down to page components that need it.
  // Actually, I can use React Context but for a small app it's often cleaner to just use events.
  
  // Need to ensure children can call addToCart. 
  // I will use React.cloneElement or just provide the function in context if needed.
  // Let's use a simple Global Event or just pass it in props by wrapping pages.

  return (
    <div className="min-h-screen bg-white selection:bg-pink-100 selection:text-pink-600">
      <Header cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />
      
      <main>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            // Check if it's an Outlet to pass context
            return React.cloneElement(child as React.ReactElement<any>, { 
              onAddToCart: handleAddToCart,
              context: { onAddToCart: handleAddToCart } 
            });
          }
          return child;
        })}
      </main>

      <Footer />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />
    </div>
  );
};

export default MainLayout;
