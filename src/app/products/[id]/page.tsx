"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, ShoppingCart, Download, FileText, HardDrive, ArrowLeft, Check, User } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface ProductDetail {
  id: string; title: string; description: string; price: number; comparePrice: number | null;
  images: string; fileSize: string | null; fileType: string | null; rating: number; reviewCount: number;
  downloads: number; tags: string; createdAt: string;
  category: { name: string; slug: string; id: string };
  seller: { id: string; name: string; avatar: string | null; bio: string | null };
  reviews: { id: string; rating: number; comment: string | null; createdAt: string; user: { name: string; avatar: string | null } }[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const isInCart = product ? items.some((i) => i.id === product.id) : false;

  useEffect(() => {
    fetch(`/api/products/${params.id}`).then((r) => r.json()).then((data) => { setProduct(data.product); setLoading(false); }).catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-12"><div className="animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-10"><div className="lg:col-span-2 space-y-6"><div className="aspect-video bg-gray-100 rounded-2xl" /><div className="h-8 bg-gray-100 rounded w-3/4" /></div><div className="h-40 bg-gray-100 rounded-2xl" /></div></div>;
  if (!product) return <div className="text-center py-20"><div className="text-6xl mb-4">404</div><h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2><Link href="/products" className="inline-flex items-center gap-2 mt-6 text-emerald-600 font-medium"><ArrowLeft className="w-4 h-4" /> Back to Products</Link></div>;

  const tags = JSON.parse(product.tags || "[]");
  const discount = product.comparePrice && product.comparePrice > product.price ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : null;
  const emoji = product.category.slug === "ebooks" ? "📚" : product.category.slug === "courses" ? "🎓" : product.category.slug === "templates" ? "📋" : product.category.slug === "software" ? "💻" : product.category.slug === "graphics" ? "🎨" : product.category.slug === "music" ? "🎵" : product.category.slug === "photos" ? "📷" : "📦";

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"><ArrowLeft className="w-4 h-4" /> Back to Products</Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-100 flex items-center justify-center text-8xl mb-8">{emoji}</div>
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <Link href={`/products?category=${product.category.slug}`} className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">{product.category.name}</Link>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />))}
                  <span className="text-sm text-gray-500 ml-1">({product.reviewCount} reviews)</span>
                </div>
                <span className="text-sm text-gray-500 flex items-center gap-1"><Download className="w-4 h-4" /> {product.downloads} downloads</span>
              </div>
              <hr className="my-6" />
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
              {tags.length > 0 && <div className="flex flex-wrap gap-2 mt-6">{tags.map((tag: string) => (<span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">#{tag}</span>))}</div>}
              {product.reviews.length > 0 && (<><hr className="my-8" /><h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews ({product.reviewCount})</h2>
                <div className="space-y-4">{product.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center"><User className="w-4 h-4 text-emerald-600" /></div>
                      <div><p className="font-medium text-sm text-gray-900">{review.user.name}</p>
                        <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />))}</div>
                      </div>
                      <span className="text-xs text-gray-400 ml-auto">{formatDate(review.createdAt)}</span>
                    </div>
                    {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
                  </div>
                ))}</div></>)}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                  {product.comparePrice && product.comparePrice > product.price && (<><span className="text-lg text-gray-400 line-through">{formatPrice(product.comparePrice)}</span><span className="text-sm font-bold text-red-500">-{discount}%</span></>)}
                </div>
                <button onClick={() => { if (!isInCart) addItem({ id: product.id, title: product.title, price: product.price, image: "", sellerId: product.seller.id, sellerName: product.seller.name }); }}
                  className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${isInCart ? "bg-emerald-100 text-emerald-700" : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25"}`}>
                  {isInCart ? (<><Check className="w-4 h-4" /> Added to Cart</>) : (<><ShoppingCart className="w-4 h-4" /> Add to Cart</>)}
                </button>
                <div className="mt-6 space-y-3">
                  {product.fileType && <div className="flex items-center gap-3 text-sm text-gray-600"><FileText className="w-4 h-4 text-gray-400" /><span>Format: {product.fileType}</span></div>}
                  {product.fileSize && <div className="flex items-center gap-3 text-sm text-gray-600"><HardDrive className="w-4 h-4 text-gray-400" /><span>Size: {product.fileSize}</span></div>}
                  <div className="flex items-center gap-3 text-sm text-gray-600"><Download className="w-4 h-4 text-gray-400" /><span>Instant digital download</span></div>
                </div>
                <hr className="my-5" />
                <div className="text-xs text-gray-500 space-y-2">
                  <p className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Secure payment via CCP, BaridiMob, Edahabia</p>
                  <p className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Instant access after payment</p>
                  <p className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Lifetime access to purchased content</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">About the Seller</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-emerald-600" /></div>
                  <div><p className="font-medium text-gray-900">{product.seller.name}</p>{product.seller.bio && <p className="text-xs text-gray-500 mt-0.5">{product.seller.bio}</p>}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
