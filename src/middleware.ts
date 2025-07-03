
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
    // error: '/auth/error',
  },
});

export const config = {
  matcher: [
    /*
     * 다음으로 시작하는 경로를 제외한 모든 요청 경로를 매칭합니다:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /login (로그인 페이지 자체는 보호되면 안 됨)
     * - / (메인 페이지는 누구나 접근 가능하게 설정)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
