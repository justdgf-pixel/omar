import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="font-bold text-xl text-white">Digi<span className="text-emerald-400">DZ</span></span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              La première plateforme algérienne de vente de produits numériques. Achetez et vendez des e-books, cours, templates et plus encore.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/products" className="hover:text-emerald-400 transition-colors">All Products</Link></li>
              <li><Link href="/products?category=ebooks" className="hover:text-emerald-400 transition-colors">E-Books</Link></li>
              <li><Link href="/products?category=courses" className="hover:text-emerald-400 transition-colors">Courses</Link></li>
              <li><Link href="/products?category=templates" className="hover:text-emerald-400 transition-colors">Templates</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Sellers</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/auth/signup" className="hover:text-emerald-400 transition-colors">Start Selling</Link></li>
              <li><Link href="/dashboard/seller" className="hover:text-emerald-400 transition-colors">Seller Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Payment Methods</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">🏦 CCP (Compte Postal)</li>
              <li className="flex items-center gap-2">📱 BaridiMob</li>
              <li className="flex items-center gap-2">💳 Carte Edahabia</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} DigiDZ. All rights reserved.</p>
          <p className="text-sm text-gray-500">Made with ❤️ in Algeria 🇩🇿</p>
        </div>
      </div>
    </footer>
  );
}
