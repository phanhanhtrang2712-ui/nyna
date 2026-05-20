-- 🚨 QUAN TRỌNG: COPY VÀ CHẠY ĐOẠN NÀY TRONG SQL EDITOR CỦA SUPABASE ĐỂ CẬP NHẬT DATABASE 🚨
-- Chạy xong hãy nhấn F5 tải lại trang web.

-- 1. Cập nhật bảng Sản phẩm (Products)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Chưa phân loại';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '[]'::jsonb;

-- 2. Cập nhật bảng Trang nội dung (Pages)
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT false;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'policy';
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS slug TEXT;

-- 3. Tạo bảng Video (videos)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    tag TEXT DEFAULT 'SỰ KIỆN'
);
ALTER TABLE public.videos DISABLE ROW LEVEL SECURITY;

-- 4. Cập nhật bảng Thương hiệu (Brands)
ALTER TABLE public.brands ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.brands ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.brands ADD COLUMN IF NOT EXISTS slug TEXT;

-- 5. Cập nhật bảng Sản phẩm (Products) cho nhiều ảnh và giá gốc
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images TEXT[]; -- Mảng chứa tối đa 3 ảnh
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price NUMERIC;

-- 6. Bảng cấu hình doanh nghiệp (Bank info, v.v.)
CREATE TABLE IF NOT EXISTS public.business_settings (
    id TEXT PRIMARY KEY,
    bank_name TEXT,
    account_name TEXT,
    account_number TEXT,
    branch TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.business_settings DISABLE ROW LEVEL SECURITY;

-- DƯỚI ĐÂY LÀ TOÀN BỘ CẤU TRÚC (Nếu tạo mới từ đầu):
-- Nếu bạn đã chạy các lệnh trên thì không cần chạy phần dưới này.

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
    category TEXT DEFAULT 'Chưa phân loại',
    description TEXT,
    specifications JSONB DEFAULT '[]'::jsonb,
    image TEXT,
    price NUMERIC DEFAULT 0,
    features JSONB DEFAULT '[]'::jsonb
);

-- Nếu bảng đã tồn tại, chạy lệnh này trong SQL Editor:
-- ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Chưa phân loại';

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

-- 8. Bảng Video (videos)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    tag TEXT DEFAULT 'SỰ KIỆN'
);
ALTER TABLE public.videos DISABLE ROW LEVEL SECURITY;
