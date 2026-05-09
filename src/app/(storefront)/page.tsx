"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/storefront/HeroSection";
import ProductCard from "@/components/storefront/ProductCard";
import CategoryCard from "@/components/storefront/CategoryCard";
import PaymentMethods from "@/components/storefront/PaymentMethods";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products?featured=true&limit=4").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <HeroSection />

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Catégories</h2>
              <p className="text-text-secondary mt-1">Explorez par catégorie</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-surface-tertiary rounded-2xl h-32 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categories.map((cat: Record<string, unknown> & { slug: string }) => (
                <CategoryCard key={cat.slug} category={cat as any} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Produits populaires</h2>
              <p className="text-text-secondary mt-1">Les meilleures ventes du moment</p>
            </div>
            <Link href="/products">
              <Button variant="outline" size="sm">Voir tout</Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product: Record<string, unknown> & { id: string }) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          )}
        </div>
      </section>

      <PaymentMethods />

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d&apos;Algériens qui achètent et vendent des produits numériques sur DigiStore DZ.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products">
              <Button size="lg">Explorer les produits</Button>
            </Link>
            <Link href="/auth?mode=register">
              <Button size="lg" variant="outline">Créer un compte gratuit</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
