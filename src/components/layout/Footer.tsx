"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold text-white">DigiStore DZ</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              La première marketplace de produits numériques en Algérie. Achetez et vendez des e-books, cours, templates et plus encore.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm hover:text-white transition-colors">Accueil</Link></li>
              <li><Link href="/products" className="text-sm hover:text-white transition-colors">Produits</Link></li>
              <li><Link href="/products?category=ebooks" className="text-sm hover:text-white transition-colors">E-Books</Link></li>
              <li><Link href="/products?category=courses" className="text-sm hover:text-white transition-colors">Cours en ligne</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Paiement</h3>
            <ul className="space-y-2">
              <li className="text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-400 rounded-full"></span>
                CCP / Compte Postal
              </li>
              <li className="text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-400 rounded-full"></span>
                BaridiMob
              </li>
              <li className="text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-400 rounded-full"></span>
                Carte EDAHABIA
              </li>
              <li className="text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-400 rounded-full"></span>
                Virement bancaire
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm">contact@digistore.dz</li>
              <li className="text-sm">+213 555 123 456</li>
              <li className="text-sm">Alger, Algérie 🇩🇿</li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} DigiStore DZ. Tous droits réservés.
          </p>
          <p className="text-sm text-gray-500">
            🇩🇿 Fièrement algérien
          </p>
        </div>
      </div>
    </footer>
  );
}
