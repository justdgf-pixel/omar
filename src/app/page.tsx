import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  CreditCard,
  Download,
  Star,
  TrendingUp,
  BookOpen,
  Palette,
  Code,
  Music,
  FileText,
  GraduationCap,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  ebooks: <BookOpen className="w-6 h-6" />,
  courses: <GraduationCap className="w-6 h-6" />,
  templates: <FileText className="w-6 h-6" />,
  software: <Code className="w-6 h-6" />,
  graphics: <Palette className="w-6 h-6" />,
  music: <Music className="w-6 h-6" />,
};

export default async function HomePage() {
  let featuredProducts: any[] = [];
  let categories: any[] = [];
  let productCount = 0;

  try {
    [featuredProducts, categories, productCount] = await Promise.all([
      prisma.product.findMany({
        where: { published: true, featured: true },
        include: {
          category: true,
          seller: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
      }),
      prisma.product.count({ where: { published: true } }),
    ]);
  } catch {
    // Database might not be seeded yet
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span className="text-sm font-medium text-emerald-100">
                {productCount > 0
                  ? `${productCount}+ produits numériques disponibles`
                  : "Lancez votre boutique numérique"}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              La marketplace de
              <br />
              <span className="text-emerald-200">produits numériques</span>
              <br />
              en Algérie
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-xl leading-relaxed">
              Achetez et vendez des ebooks, cours en ligne, templates, logiciels
              et plus encore. Paiement facile par CCP, BaridiMob et Dahabia.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors shadow-xl shadow-black/10"
              >
                Explorer les produits
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register?role=seller"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500/30 text-white font-semibold rounded-xl hover:bg-emerald-500/40 transition-colors backdrop-blur-sm border border-white/20"
              >
                Devenir vendeur
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  Téléchargement instantané
                </p>
                <p className="text-xs text-gray-500">Accès immédiat</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  Paiement local
                </p>
                <p className="text-xs text-gray-500">CCP, BaridiMob, Dahabia</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  Paiement sécurisé
                </p>
                <p className="text-xs text-gray-500">Protection acheteur</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  Support 24/7
                </p>
                <p className="text-xs text-gray-500">Assistance rapide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Catégories
                </h2>
                <p className="text-gray-500 mt-1">
                  Explorez par catégorie
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  className="group flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:from-emerald-100 group-hover:to-teal-100 transition-colors">
                    {CATEGORY_ICONS[cat.slug] || (
                      <span className="text-2xl">{cat.icon}</span>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors">
                      {cat.nameFr}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {cat._count.products} produit
                      {cat._count.products !== 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Produits en vedette
                </h2>
                <p className="text-gray-500 mt-1">
                  Les meilleurs produits numériques sélectionnés pour vous
                </p>
              </div>
              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="sm:hidden mt-6 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600"
              >
                Voir tous les produits
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA: Become a Seller */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl px-8 md:px-16 py-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="relative max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Vendez vos produits numériques en Algérie
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Rejoignez notre communauté de créateurs. Uploadez vos ebooks,
                cours, templates et commencez à gagner de l'argent avec des
                paiements locaux algériens.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register?role=seller"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/25"
                >
                  Commencer à vendre
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Méthodes de paiement algériennes
            </h2>
            <p className="text-gray-500 mt-2">
              Payez facilement avec vos méthodes de paiement locales préférées
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-100">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-700">CCP</span>
              </div>
              <h3 className="font-semibold text-gray-900">Compte CCP</h3>
              <p className="text-sm text-gray-500 mt-1">
                Virement postal Algérie Poste
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-green-700">
                  BaridiMob
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">BaridiMob</h3>
              <p className="text-sm text-gray-500 mt-1">
                Paiement mobile Algérie Poste
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-blue-700">
                  Dahabia
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">Carte Dahabia</h3>
              <p className="text-sm text-gray-500 mt-1">
                Carte de paiement électronique
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
