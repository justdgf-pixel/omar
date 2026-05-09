"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatDZD } from "@/lib/utils";
import { useCartStore, CartItem } from "@/lib/store";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface Product {
  id: string;
  name: string;
  nameFr: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionFr: string;
  price: number;
  comparePrice: number | null;
  image: string | null;
  fileType: string | null;
  fileSize: string | null;
  downloadLimit: number;
  category: { name: string; nameFr: string; slug: string };
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    fetch(`/api/products/${params.slug}`)
      .then((r) => r.json())
      .then((d) => setProduct(d.product))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-[4/3] bg-surface-tertiary rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-surface-tertiary rounded-xl w-3/4 animate-pulse" />
            <div className="h-6 bg-surface-tertiary rounded-xl w-1/2 animate-pulse" />
            <div className="h-32 bg-surface-tertiary rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold mb-2">Produit introuvable</h2>
        <p className="text-text-secondary mb-6">Ce produit n&apos;existe pas ou a été supprimé.</p>
        <Link href="/products"><Button>Retour aux produits</Button></Link>
      </div>
    );
  }

  const inCart = items.some((i) => i.id === product.id);
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAdd = () => {
    const item: CartItem = {
      id: product.id,
      name: product.nameFr || product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
    };
    addItem(item);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
        <Link href="/" className="hover:text-primary-600">Accueil</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-600">Produits</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary-600">
          {product.category.nameFr}
        </Link>
        <span>/</span>
        <span className="text-text-secondary">{product.nameFr}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-surface-tertiary rounded-2xl overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.nameFr} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl">
              -{discount}%
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <Badge variant="info" className="mb-3">{product.category.nameFr}</Badge>
          <h1 className="text-3xl font-bold text-text-primary mb-2">{product.nameFr || product.name}</h1>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-3xl font-bold text-primary-700">{formatDZD(product.price)}</span>
            {product.comparePrice && (
              <span className="text-lg text-text-muted line-through">{formatDZD(product.comparePrice)}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {product.fileType && (
              <div className="flex items-center gap-2 bg-surface-tertiary rounded-xl px-4 py-2">
                <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span className="text-sm font-medium">{product.fileType}</span>
              </div>
            )}
            {product.fileSize && (
              <div className="flex items-center gap-2 bg-surface-tertiary rounded-xl px-4 py-2">
                <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span className="text-sm font-medium">{product.fileSize}</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-surface-tertiary rounded-xl px-4 py-2">
              <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
              </svg>
              <span className="text-sm font-medium">{product.downloadLimit} téléchargements</span>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <Button size="lg" onClick={handleAdd} disabled={inCart} className="flex-1">
              {inCart ? "✓ Dans le panier" : "Ajouter au panier"}
            </Button>
            {inCart && (
              <Link href="/cart">
                <Button size="lg" variant="secondary">Voir le panier</Button>
              </Link>
            )}
          </div>

          <div className="bg-surface-secondary rounded-2xl p-6 border border-border">
            <h3 className="font-semibold text-text-primary mb-3">Description</h3>
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {product.descriptionFr || product.description}
            </p>
          </div>

          <div className="mt-6 bg-accent-50 rounded-2xl p-6 border border-accent-200">
            <h3 className="font-semibold text-accent-800 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Livraison instantanée
            </h3>
            <p className="text-sm text-accent-700">
              Recevez votre produit immédiatement après confirmation du paiement. Lien de téléchargement sécurisé envoyé par email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
