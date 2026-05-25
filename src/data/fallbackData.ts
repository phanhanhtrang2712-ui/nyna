import productsBackup from '../products_backup.json';

export const FALLBACK_DATA: Record<string, any[]> = {
  products: productsBackup,
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
