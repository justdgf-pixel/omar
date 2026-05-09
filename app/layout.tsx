import './globals.css';
import type { Metadata, Viewport } from 'next';
import { getDictionary, getDirection, getLocale } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getCurrentUser } from '@/lib/auth';
import { readCart } from '@/lib/cart';

export const metadata: Metadata = {
  title: 'Souk Digital — منتجات رقمية للجزائر',
  description: 'سوق رقمي جزائري لشراء وبيع الكتب، الدورات، التطبيقات، القوالب والإيقاعات.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icons/icon-192.svg',
    apple: '/icons/icon-192.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#177e47',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  const dir = getDirection(locale);
  const dict = getDictionary(locale);
  const user = await getCurrentUser();
  const cartCount = readCart().reduce((s, i) => s + i.quantity, 0);

  return (
    <html lang={locale} dir={dir}>
      <body className="min-h-screen flex flex-col">
        <Header locale={locale} dict={dict} user={user} cartCount={cartCount} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
