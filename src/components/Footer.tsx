import Link from "next/link";
import { Store, Mail, Phone, Globe, ExternalLink, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DigiStore DZ</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              La marketplace #1 pour les produits numériques en Algérie. Achetez
              et vendez des ebooks, cours, templates et plus encore.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm hover:text-emerald-400 transition-colors">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link href="/products?category=ebooks" className="text-sm hover:text-emerald-400 transition-colors">
                  E-Books
                </Link>
              </li>
              <li>
                <Link href="/products?category=courses" className="text-sm hover:text-emerald-400 transition-colors">
                  Cours en ligne
                </Link>
              </li>
              <li>
                <Link href="/products?category=templates" className="text-sm hover:text-emerald-400 transition-colors">
                  Templates
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Vendeurs</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/register?role=seller" className="text-sm hover:text-emerald-400 transition-colors">
                  Devenir vendeur
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm hover:text-emerald-400 transition-colors">
                  Tableau de bord
                </Link>
              </li>
              <li>
                <Link href="/dashboard/products" className="text-sm hover:text-emerald-400 transition-colors">
                  Gérer mes produits
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-emerald-400" />
                contact@digistore.dz
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-emerald-400" />
                0555 00 00 00
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} DigiStore DZ. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Paiements acceptés:</span>
              <span className="px-2 py-1 bg-gray-800 rounded text-xs font-medium text-emerald-400">
                CCP
              </span>
              <span className="px-2 py-1 bg-gray-800 rounded text-xs font-medium text-emerald-400">
                BaridiMob
              </span>
              <span className="px-2 py-1 bg-gray-800 rounded text-xs font-medium text-emerald-400">
                Dahabia
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
