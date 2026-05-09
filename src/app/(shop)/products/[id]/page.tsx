"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  Star,
  Download,
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Tag,
  Check,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice, formatDate, formatFileSize } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCart((s) => s.addItem);
  const items = useCart((s) => s.items);
  const router = useRouter();

  const isInCart = items.some((i) => i.id === id);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="aspect-[4/3] bg-gray-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Produit non trouvé
        </h2>
        <Link href="/products" className="text-emerald-600 hover:underline">
          Retour aux produits
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (isInCart) {
      toast("Déjà dans le panier", { icon: "ℹ️" });
      return;
    }
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      sellerId: product.seller.id,
      sellerName: product.seller.name,
    });
    toast.success("Ajouté au panier!");
  };

  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      )
    : 0;

  const tags = product.tags ? product.tags.split(",").map((t: string) => t.trim()) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image */}
        <div>
          <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden">
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                <Download className="w-16 h-16 text-emerald-300" />
              </div>
            )}
            {discount > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-xl">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Link
              href={`/products?category=${product.categoryId}`}
              className="text-sm text-emerald-600 font-medium hover:text-emerald-700"
            >
              {product.category.nameFr || product.category.name}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              {product.title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm text-gray-500">
                ({product.reviewCount} avis)
              </span>
            </div>
            <span className="text-sm text-gray-400">|</span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Download className="w-4 h-4" />
              {product.downloadCount} téléchargements
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-emerald-600">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
                isInCart
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25"
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-5 h-5" />
                  Dans le panier
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Ajouter au panier
                </>
              )}
            </button>
            {isInCart && (
              <Link
                href="/cart"
                className="px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Voir le panier
              </Link>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                Fichier: {product.fileName}
                {product.fileSize > 0 &&
                  ` (${formatFileSize(product.fileSize)})`}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                Vendeur: {product.seller.name}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                Publié le {formatDate(product.createdAt)}
              </span>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Avis ({product.reviews.length})
          </h2>
          <div className="space-y-4">
            {product.reviews.map((review: any) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-gray-100 p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {review.user.name[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {review.user.name}
                    </p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-gray-400">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
