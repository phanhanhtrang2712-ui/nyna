-- Copy toàn bộ nội dung này vào Supabase SQL Editor và nhấn RUN

-- 1. Bảng Tin tức (news)
CREATE TABLE IF NOT EXISTS public.news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    date TEXT,
    excerpt TEXT,
    image TEXT,
    content TEXT
);

-- 2. Bảng Thương hiệu (brands)
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    color TEXT DEFAULT 'text-blue-600'
);

-- 3. Bảng Sản phẩm (products)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    brand TEXT REFERENCES public.brands(name) ON UPDATE CASCADE,
    image TEXT,
    price NUMERIC DEFAULT 0,
    features JSONB DEFAULT '[]'::jsonb
);

-- 4. Bảng Tuyển dụng (jobs)
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    location TEXT,
    salary TEXT,
    deadline TEXT
);

-- 5. Bảng Nhà phân phối (distributors)
CREATE TABLE IF NOT EXISTS public.distributors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    region TEXT
);

-- 6. Bảng Cấu hình (settings)
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    site_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    footer_text TEXT
);

-- 7. Bảng Trang nội dung (pages) - Dùng cho Footer & Chính sách
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    category TEXT DEFAULT 'about',
    content TEXT,
    show_on_home BOOLEAN DEFAULT false
);

-- Bật quyền truy cập công khai (RLS disabled hoặc Policy cho Anon)
-- Lưu ý: Để đơn giản, hãy tắt RLS cho các bảng này trong Dashboard nếu bạn chưa cấu hình Auth.
ALTER TABLE public.news DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages DISABLE ROW LEVEL SECURITY;
