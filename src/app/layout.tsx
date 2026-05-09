import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/cart";
import { ToastContextProvider } from "@/lib/toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RakamDZ - منصة المنتجات الرقمية في الجزائر",
  description: "اشتري وبيع المنتجات الرقمية في الجزائر - برمجيات، قوالب، دورات تعليمية وأكثر",
  keywords: ["منتجات رقمية", "الجزائر", "برمجيات", "قوالب", "دورات"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${geist.className} bg-gray-50 min-h-screen flex flex-col`}>
        <SessionProvider>
          <CartProvider>
            <ToastContextProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </ToastContextProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
