import { NextResponse } from 'next/server';

// Đặt một mã bí mật của riêng bạn (Nên đổi thành chuỗi ký tự khó đoán hơn)
const SECRET_KEY = '220785'; 
const COOKIE_NAME = 'bypass_maintenance';

export function middleware(request) {
  const url = request.nextUrl.clone();
  
  // 1. Kiểm tra nếu URL có chứa tham số mã bí mật (?access=...)
  const hasAccessQuery = url.searchParams.get('access') === SECRET_KEY;
  
  // 2. Kiểm tra nếu trình duyệt đã có sẵn Cookie quyền truy cập trước đó
  const hasAccessCookie = request.cookies.get(COOKIE_NAME)?.value === SECRET_KEY;

  // Nếu có mã bí mật trên URL, tiến hành lưu Cookie và cho phép vào website
  if (hasAccessQuery) {
    // Xóa tham số trên URL để giao diện sạch sẽ sau khi đăng nhập thành công
    url.searchParams.delete('access');
    const response = NextResponse.redirect(url);
    
    // Lưu Cookie vào trình duyệt, có hiệu lực trong 30 ngày
    response.cookies.set(COOKIE_NAME, SECRET_KEY, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 ngày
      httpOnly: true,
      secure: true,
    });
    return response;
  }

  // Nếu đã có sẵn Cookie hợp lệ, cho phép truy cập bình thường (Bỏ qua bảo trì)
  if (hasAccessCookie) {
    return NextResponse.next();
  }

  // --- GIAO DIỆN BẢO TRÌ (Dành cho người dùng thông thường) ---
  const maintenanceHtml = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Website Tạm Dừng Hoạt Động</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background-color: #f3f4f6; color: #1f2937; 
                display: flex; justify-content: center; align-items: center; 
                height: 100vh; padding: 20px;
            }
            .container { 
                text-align: center; background: white; padding: 40px 30px; 
                border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                max-width: 500px; width: 100%;
            }
            .icon { font-size: 64px; margin-bottom: 20px; }
            h1 { font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #111827; }
            p { font-size: 16px; color: #4b5563; line-height: 1.6; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon">🚧</div>
            <h1>Website hiện đang tạm dừng hoạt động</h1>
         </div>
    </body>
    </html>
  `;

  return new NextResponse(maintenanceHtml, {
    status: 503,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

export const config = {
  matcher: '/:path*',
};
