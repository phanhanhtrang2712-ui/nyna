import { NextResponse } from 'next/server';

const SECRET_KEY = 'my_secret_key_2026'; // Thay bằng mã của bạn
const COOKIE_NAME = 'bypass_maintenance';

export function middleware(request) {
  const url = request.nextUrl.clone();
  
  // Tránh vòng lặp vô hạn: Nếu đang truy cập vào chính trang bảo trì hoặc các file hệ thống thì cho qua luôn
  if (
    url.pathname === '/baotri' || 
    url.pathname.startsWith('/_next/') || 
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. Kiểm tra mã bí mật trên URL (?access=...)
  const hasAccessQuery = url.searchParams.get('access') === SECRET_KEY;
  
  // 2. Kiểm tra Cookie có sẵn
  const hasAccessCookie = request.cookies.get(COOKIE_NAME)?.value === SECRET_KEY;

  // Nếu nhập đúng mã bí mật qua URL
  if (hasAccessQuery) {
    url.searchParams.delete('access');
    const response = NextResponse.redirect(url);
    
    // Cấp quyền truy cập trong 30 ngày
    response.cookies.set(COOKIE_NAME, SECRET_KEY, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    return response;
  }

  // Nếu có cookie hợp lệ -> Cho xem website thật bình thường
  if (hasAccessCookie) {
    return NextResponse.next();
  }

  // Đối với người dùng thông thường: Âm thầm đổi hướng hiển thị sang trang bảo trì công khai
  url.pathname = '/baotri';
  return NextResponse.rewrite(url);
}

export const config = {
  // Áp dụng kiểm tra cho toàn bộ các trang trên website
  matcher: '/:path*',
};
