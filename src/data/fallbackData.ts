export const FALLBACK_DATA: Record<string, any[]> = {
  // products: KHÔNG dùng fallback - tránh hiển thị data giả
  // Sẽ dùng skeleton loading thay thế
  brands: [
    { id: "br-1", name: "LYNA", description: "San pham cham soc phu nu hien dai", color: "text-pink-600", image: "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800", content: "LYNA mang den nhung giai phap cham soc suc khoe phu nu." },
    { id: "br-2", name: "SILA", description: "Ta nguoi lon cao cap", color: "text-emerald-600", image: "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800", content: "SILA la dong ta bim nguoi lon chuyen dung, tham hut tot va em ai." },
    { id: "br-3", name: "NYNA", description: "Ta em be em mem vuot troi", color: "text-blue-600", image: "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800", content: "NYNA tu hao la nguoi ban dong hanh cua hang trieu gia dinh Viet." },
    { id: "br-4", name: "TONY", description: "Tam lot / Mieng lot da nang", color: "text-indigo-600", image: "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800", content: "TONY cung cap cac giai phap lot tham da nang cho nhieu muc dich su dung." },
  ],
  news: [
    { id: "news-1", title: "Cach chon ta bim phu hop cho tre so sinh lan dau lam me", date: "24/05/2026", excerpt: "Chia se cam nang khoa hoc giup me de dang chon size ta quan hay ta dan phu hop.", image: "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800", content: "Lua chon ta lot dau doi luon la thu thach lon voi cac me..." },
    { id: "news-2", title: "Cham soc nguoi cao tuoi di lai kho khan: Giai phap tam ly va ve sinh", date: "22/05/2026", excerpt: "Ve sinh sach se dong vai tro toi quan trong doi voi suc khoe nguoi cao tuoi.", image: "https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=800", content: "Cham soc ve sinh cho nguoi lon tuoi doi hoi tinh kien nhan..." }
  ],
  videos: [
    { id: "vid-1", title: "Gioi thieu Quy trinh san xuat ta bim cao cap NYNA", youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", tag: "QUY TRINH" },
    { id: "vid-2", title: "Review ta quan cao cap NYNA Premium lua bong", youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", tag: "DANH GIA" }
  ],
  distributors: [
    { id: "dist-1", name: "Nha phan phoi NYNA Mien Bac", address: "So Pho Vong, Phuong Hai Ba Trung, Ha Noi", phone: "0912345678", region: "Mien Bac" },
    { id: "dist-2", name: "Nha phan phoi NYNA Mien Trung", address: "Nguyen Van Linh, Hai Chau, Da Nang", phone: "0905123456", region: "Mien Trung" },
    { id: "dist-3", name: "Nha phan phoi NYNA Mien Nam", address: "Ly Thuong Kiet, Quan 10, TP. Ho Chi Minh", phone: "0987654321", region: "Mien Nam" }
  ],
  pages: [
    { id: "policy-chinh-sach", title: "Chinh sach mua hang & doi tra", slug: "chinh-sach", category: "policy", content: "NYNA ho tro giao hang hoa toc va doi tra mien phi trong vong 7 ngay." }
  ],
  jobs: [
    { id: "job-1", title: "Nhan vien Kinh doanh Kenh GT (Toan quoc)", location: "TP.HCM / Ha Noi / Da Nang", salary: "10M - 20M + Hoa hong", deadline: "30/06/2026" },
    { id: "job-2", title: "Truong nhom Marketing Thuong hieu", location: "Hoi so chinh TP.HCM", salary: "Canh tranh", deadline: "15/06/2026" }
  ],
};
