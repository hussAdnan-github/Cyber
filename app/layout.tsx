import type { Metadata } from "next";
// import { Cairo } from "next/font/google";
import "./globals.css";

// const cairo = Cairo({
//   variable: "--font-cairo",
//   subsets: ["arabic"],
// });

export const metadata: Metadata = {
  title: "لوحة التحكم | الأمن السيبراني",
  description: "لوحة تحكم لإدارة الفنادق والنزلاء",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={` h-full antialiased font-cairo`}>
      <body className="min-h-full flex flex-col bg-[#F3F4F6]">{children}</body>
    </html>
  );
}
