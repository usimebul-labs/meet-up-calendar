import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/providers"; // 1. 방금 만든 통합 Provider를 임포트합니다.
import Header from "@/components/Header"; // Header 컴포넌트 임포트
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meet-Up Scheduler",
  description: "최적의 약속 날짜 찾기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header /> {/* 여기에 Header 컴포넌트를 추가합니다. */}
          <main>{children}</main> {/* 페이지 컨텐츠는 main 태그 안에 렌더링 */}
        </Providers>
      </body>
    </html>
  );
}
