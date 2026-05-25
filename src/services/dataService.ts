import { getSupabase } from '../lib/supabase';
import { queryCache } from './queryCache';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

const FALLBACK_DATA: Record<string, any[]> = {
  products: [
    {
      id: "prod-1",
      title: "Tã quần em bé NYNA Premium (Size L - 54 miếng)",
      brand: "NYNA",
      category: "Tã em bé",
      price: 185000,
      original_price: 245000,
      image: "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800",
      images: [
        "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800"
      ],
      features: [{ label: "100% Cotton tự nhiên", icon: "CheckCircle2" }, { label: "Thấm hút tới 12 giờ", icon: "CheckCircle2" }],
      color: "text-blue-600",
      description: "Sản phẩm tã quần trẻ em NYNA Premium mềm mại đột phá, gấp đôi thun đàn hồi giúp bé luôn khô thoáng, thoải mái vận động suốt ngày dài.",
      specifications: [
        { key: "Thương hiệu", value: "NYNA" },
        { key: "Xuất xứ", value: "Việt Nam" },
        { key: "Chất liệu", value: "Bông Cotton tự nhiên" },
        { key: "Độ tuổi", value: "Cho bé từ 9 - 14kg" }
      ],
      variants: [
        { name: "Size M - 60 miếng", price: 175000, original_price: 235000 },
        { name: "Size L - 54 miếng", price: 185000, original_price: 245000 },
        { name: "Size XL - 48 miếng", price: 195000, original_price: 255000 }
      ]
    },
    {
      id: "prod-2",
      title: "Tã dán hỗ trợ sơ sinh NYNA Soft & Dry XS",
      brand: "NYNA",
      category: "Tã em bé",
      price: 135000,
      original_price: 165000,
      image: "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800",
      images: [
        "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800"
      ],
      features: [{ label: "Air-through siêu thoáng", icon: "CheckCircle2" }, { label: "Rãnh rốn Oheso bảo vệ bé tốt nhất", icon: "CheckCircle2" }],
      color: "text-blue-600",
      description: "Hỗ trợ tuyệt vời cho giai đoạn sơ sinh đầu đời. Thiết kế cắt rãnh rốn Oheso tránh tiếp xúc phần rốn nhạy cảm, chất liệu lụa satin êm đềm bảo vệ tối đa làn da non nớt.",
      specifications: [
        { key: "Thương hiệu", value: "NYNA" },
        { key: "Dòng sản phẩm", value: "Soft & Dry" },
        { key: "Chỉ số thấm hút", value: "Tốt" }
      ],
      variants: [
        { name: "XS (Dưới 5kg)", price: 135000, original_price: 165000 }
      ]
    },
    {
      id: "prod-3",
      title: "Tã quần người lớn SILA Active siêu mềm (M/L)",
      brand: "SILA",
      category: "Tã người lớn",
      price: 95000,
      original_price: 135000,
      image: "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800",
      images: [],
      features: [{ label: "Kháng khuẩn khử mùi Nhật Bản", icon: "CheckCircle2" }, { label: "Thoải mái tựa đồ lót thường ngày", icon: "CheckCircle2" }],
      color: "text-emerald-600",
      description: "Dòng tã quần người lớn cao cấp dành riêng cho người có thể đi lại, tiện lợi và kín đáo tựa đồ lót thường ngày.",
      specifications: [
        { key: "Thương hiệu", value: "SILA" },
        { key: "Kích cỡ", value: "M/L (Vòng bụng 60 - 90cm)" }
      ]
    },
    {
      id: "prod-4",
      title: "Tã dán người già SILA Super Absorb siêu thấm hút",
      brand: "SILA",
      category: "Tã người lớn",
      price: 125000,
      original_price: 155000,
      image: "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800",
      images: [],
      features: [{ label: "Vạch báo tã đầy thông minh", icon: "CheckCircle2" }, { label: "Hạt SAP thấm hút tối ưu", icon: "CheckCircle2" }],
      color: "text-emerald-600",
      description: "Thích hợp cho người lớn tuổi nằm giường dài ngày. Lõi thấm hút kép kết hợp rãnh sần dẫn thấm 4 chiều giữ bề mặt luôn sạch khô mát mẻ.",
      specifications: [
        { key: "Thương hiệu", value: "SILA" },
        { key: "Quy cách", value: "Gói 10 miếng" }
      ]
    },
    {
      id: "prod-5",
      title: "Băng vệ sinh thảo dược cao cấp LYNA Cool Fresh",
      brand: "LYNA",
      category: "Chăm sóc phụ nữ",
      price: 38000,
      original_price: 45000,
      image: "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800",
      images: [],
      features: [{ label: "Bạc hà thảo dược mát dịu", icon: "CheckCircle2" }, { label: "Bảo vệ mỏng nhẹ 0.1cm", icon: "CheckCircle2" }],
      color: "text-pink-600",
      description: "Cảm giác sảng khoái mát lạnh tức thì giúp xua tan cảm giác bí bách mệt mỏi trong những ngày nhạy cảm.",
      specifications: [
        { key: "Thương hiệu", value: "LYNA" },
        { key: "Độ dài", value: "24.5cm siêu mỏng cánh" }
      ]
    },
    {
      id: "prod-6",
      title: "Tấm lót thấm hút đa năng tiện lợi TONY Plus (Bịch 10 miếng)",
      brand: "TONY",
      category: "Tấm lót đa năng",
      price: 65000,
      original_price: 85000,
      image: "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800",
      images: [],
      features: [{ label: "Màng đáy PE chống tràn tuyệt đối", icon: "CheckCircle2" }, { label: "Thấm nhanh khóa dịch lỏng", icon: "CheckCircle2" }],
      color: "text-indigo-600",
      description: "Tấm lót đa năng bảo vệ giường nằm, nôi em bé hoặc xe lăn sạch sẽ tuyệt đối, vệ sinh dễ dàng chỉ trong một bước bỏ.",
      specifications: [
        { key: "Thương hiệu", value: "TONY" },
        { key: "Số lượng", value: "10 miếng/bịch" }
      ]
    }
  ],
  brands: [
    { id: "br-1", name: 'LYNA', description: 'Sản phẩm chăm sóc phụ nữ hiện đại', color: 'text-pink-600', image: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800', content: 'LYNA mang đến những giải pháp chăm sóc sức khỏe phụ nữ với các dòng sản phẩm băng vệ sinh cao cấp.' },
    { id: "br-2", name: 'SILA', description: 'Tã người lớn cao cấp', color: 'text-emerald-600', image: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800', content: 'SILA là dòng tã bỉm người lớn chuyên dụng, thấm hút tốt và êm ái.' },
    { id: "br-3", name: 'NYNA', description: 'Tã em bé êm mềm vượt trội', color: 'text-blue-600', image: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800', content: 'NYNA tự hào là người bạn đồng hành của hàng triệu gia đình Việt trong việc chăm sóc con nhỏ.' },
    { id: "br-4", name: 'TONY', description: 'Tấm lót / Miếng lót đa năng', color: 'text-indigo-600', image: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800', content: 'TONY cung cấp các giải pháp lót thấm đa năng cho nhiều mục đích sử dụng.' },
  ],
  news: [
    {
      id: "news-1",
      title: "Cách chọn tã bỉm phù hợp cho trẻ sơ sinh lần đầu làm mẹ",
      date: "24/05/2026",
      excerpt: "Chia sẻ cẩm nang khoa học giúp mẹ dễ dàng chọn size tã quần hay tã dán phù hợp, mềm mại và chống hăm hiệu quả cho bé yêu của mình.",
      image: "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800",
      content: "Lựa chọn tã lót đầu đời luôn là thử thách lớn với các mẹ. Để chăm bé chu đáo, mẹ nên ưu tiên chất liệu lụa bông mềm mát, kết cấu thun mềm ôm 4 chiều và rãnh rốn bảo vệ tinh tế như dòng NYNA Premium..."
    },
    {
      id: "news-2",
      title: "Chăm sóc người cao tuổi đi lại khó khăn: Giải pháp tâm lý và vệ sinh",
      date: "22/05/2026",
      excerpt: "Vệ sinh sạch sẽ đóng vai trò tối quan trọng đối với sức khỏe thể chất lẫn tinh thần của người cao tuổi nằm giường dài ngày.",
      image: "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800",
      content: "Chăm sóc vệ sinh cho người lớn tuổi đòi hỏi tính kiên nhẫn và các dụng cụ an toàn, chuyên nghiệp. Dòng tã dán và tấm lót thấm hút SILA / TONY giúp hỗ trợ tối ưu về khả năng thấm hút cực cao lên đến 10 giờ liền."
    }
  ],
  videos: [
    { id: "vid-1", title: "Giới thiệu Quy trình sản xuất tã bỉm cao cấp NYNA", youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", tag: "QUY TRÌNH" },
    { id: "vid-2", title: "Review tã quần cao cấp NYNA Premium lụa bông", youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", tag: "ĐÁNH GIÁ" }
  ],
  distributors: [
    { id: "dist-1", name: "Nhà phân phối NYNA Miền Bắc", address: "Số Phố Vọng, Phường Hai Bà Trưng, Hà Nội", phone: "0912345678", region: "Miền Bắc" },
    { id: "dist-2", name: "Nhà phân phối NYNA Miền Trung", address: "Nguyễn Văn Linh, Hải Châu, Đà Nẵng", phone: "0905123456", region: "Miền Trung" },
    { id: "dist-3", name: "Nhà phân phối NYNA Miền Nam", address: "Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh", phone: "0987654321", region: "Miền Nam" }
  ],
  pages: [
    { id: "policy-chinh-sach", title: "Chính sách mua hàng & đổi trả", slug: "chinh-sach", category: "policy", content: "NYNA hỗ trợ giao hàng hỏa tốc trong nước và đổi trả hoàn toàn miễn phí tã bỉm trong vòng 7 ngày nếu lỗi quy cách đóng gói hoặc hư hỏng do vận chuyển." }
  ],
  jobs: [
    { id: "job-1", title: "Nhân viên Kinh doanh Kênh GT (Toàn quốc)", location: "TP.HCM / Hà Nội / Đà Nẵng", salary: "10M - 20M + Hoa hồng", deadline: "30/06/2026" },
    { id: "job-2", title: "Trưởng nhóm Marketing Thương hiệu (Brand Manager)", location: "Hội sở chính TP.HCM", salary: "Cạnh tranh", deadline: "15/06/2026" }
  ]
};

export const dataService = {
  // Generic list
  async list<T>(table: string, orderField: string = 'created_at'): Promise<T[]> {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order(orderField, { ascending: false });
      
      if (error) {
        // Fallback for tables that might still use camelCase from Firestore migration
        if (error.message.includes('column "created_at" does not exist')) {
          const { data: retryData, error: retryError } = await supabase
            .from(table)
            .select('*')
            .order('createdAt', { ascending: false });
          if (retryError) throw retryError;
          
          if ((!retryData || retryData.length === 0) && FALLBACK_DATA[table]) {
            return FALLBACK_DATA[table] as T[];
          }
          return (retryData || []) as T[];
        }
        throw error;
      }
      
      const listData = data || [];
      if (listData.length === 0 && FALLBACK_DATA[table]) {
        return FALLBACK_DATA[table] as T[];
      }
      return listData as T[];
    } catch (error) {
      console.error(`Supabase List Error [${table}]: `, error);
      if (FALLBACK_DATA[table]) {
        console.info(`Unconfigured or error loading [${table}]. Using rich Vietnamese offline fallback dataset.`);
        return FALLBACK_DATA[table] as T[];
      }
      return [];
    }
  },

  // Generic create
  async create<T>(table: string, data: T): Promise<string> {
    const supabase = getSupabase();
    const { data: inserted, error } = await supabase
       .from(table)
       .insert([data] as any)
       .select();
    
    if (error) {
      console.error(`Supabase Create Error [${table}]: `, error);
      throw error;
    }
    // Evict client-side cache
    try {
      queryCache.clearTable(table);
    } catch (e) {
      console.warn(e);
    }
    return inserted?.[0]?.id || '';
  },

  // Generic update
  async update<T>(table: string, id: string, data: Partial<T>): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase
       .from(table)
       .update(data as any)
       .eq('id', id);
    
    if (error) {
      console.error(`Supabase Update Error [${table}/${id}]: `, error);
      throw error;
    }
    // Evict client-side cache
    try {
      queryCache.clearTable(table);
      queryCache.delete(`nyna_cache_${table}_${id}`);
    } catch (e) {
      console.warn(e);
    }
  },

  // Generic delete
  async delete(table: string, id: string): Promise<void> {
    try {
      const supabase = getSupabase();
      const { error } = await supabase
         .from(table)
         .delete()
         .eq('id', id);
      
      if (error) throw error;
      // Evict client-side cache
      try {
        queryCache.clearTable(table);
        queryCache.delete(`nyna_cache_${table}_${id}`);
      } catch (e) {
        console.warn(e);
      }
    } catch (error) {
       console.error(`Supabase Delete Error [${table}/${id}]: `, error);
    }
  },

  async get<T>(table: string, id: string): Promise<T> {
    const cacheKey = `nyna_cache_${table}_${id}`;
    
    // 1. Try individual cache first (fresh)
    const cachedItem = queryCache.get<T>(cacheKey);
    if (cachedItem) {
      return cachedItem;
    }

    // 2. Try table list cache next (fresh)
    const listCacheKey = `nyna_cache_${table}`;
    const cachedList = queryCache.get<any[]>(listCacheKey);
    if (cachedList) {
      const found = cachedList.find(item => item.id === id);
      if (found) {
        return found as T;
      }
    }

    // Fallback: network fetch with deduplication
    const fetchFunc = async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
           .from(table)
           .select('*')
           .eq('id', id)
           .single();
        
        if (error) {
          throw error;
        }
        return data as T;
      } catch (err) {
        if (FALLBACK_DATA[table]) {
          const found = FALLBACK_DATA[table].find(item => item.id === id);
          if (found) return found as T;
        }
        console.error(`Supabase Get Error [${table}/${id}]: `, err);
        throw err;
      }
    };

    const data = await queryCache.getOrCreatePromise(cacheKey, fetchFunc);
    
    // Save to individual cache
    queryCache.set(cacheKey, data);

    return data;
  },

  // Settings
  async getSettings(): Promise<any> {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; 
      return data;
    } catch (error) {
      console.error('Supabase Get Settings Error: ', error);
      return null;
    }
  },

  async updateSettings(data: any): Promise<void> {
    try {
      const supabase = getSupabase();
      const current = await this.getSettings();
      if (current) {
        const { error } = await supabase
          .from('settings')
          .update(data)
          .eq('id', current.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('settings')
          .insert([data]);
        if (error) throw error;
      }
    } catch (error) {
      console.error('Supabase Update Settings Error: ', error);
    }
  }
};
