
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Brands from './pages/Brands';
import News from './pages/News';
import Video from './pages/Video';
import Contact from './pages/Contact';
import Distribution from './pages/Distribution';
import Jobs from './pages/Jobs';
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';

const WrappedRoute = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cms" element={<Admin />} />
        
        <Route element={<WrappedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/san-pham/:id" element={<ProductDetail />} />
          <Route path="/gioi-thieu" element={<About />} />
          <Route path="/thuong-hieu" element={<Brands />} />
          <Route path="/tin-tuc" element={<News />} />
          <Route path="/video" element={<Video />} />
          <Route path="/lien-he" element={<Contact />} />
          <Route path="/he-thong" element={<Distribution />} />
          <Route path="/tuyen-dung" element={<Jobs />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
